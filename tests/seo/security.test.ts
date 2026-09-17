import test, { mock } from "node:test";
import dns from "node:dns/promises";
import https from "node:https";
import { EventEmitter } from "node:events";
import { PassThrough } from "node:stream";
import assert from "node:assert/strict";
import {
  isPublicIP,
  normalizeURL,
  safeFetch,
  resolvePublic,
} from "../../src/lib/seo/security";
import {
  assertSameOrigin,
  parseAuditInput,
  readJSON,
} from "../../src/lib/seo/input";
import { rateLimit } from "../../src/lib/seo/rate-limit";

test("mixed public/private DNS answers are rejected before any connection", async () => {
  const stub = mock.method(dns, "lookup", async () => [
    { address: "8.8.8.8", family: 4 },
    { address: "10.0.0.1", family: 4 },
  ]);
  try {
    await assert.rejects(
      resolvePublic("public-looking.example.com"),
      /private or reserved/,
    );
  } finally {
    stub.mock.restore();
  }
});
test("the transport pins checked DNS and rejects a redirect to the metadata service", async () => {
  const resolver = mock.method(dns, "lookup", async () => [
    { address: "8.8.8.8", family: 4 },
  ]);
  let requests = 0;
  let pinned = "";
  const transport = mock.method(https, "request", ((
    _url: unknown,
    options: { lookup: Function },
    callback: Function,
  ) => {
    requests++;
    options.lookup(
      "ignored",
      { all: false },
      (_error: unknown, address: string) => {
        pinned = address;
      },
    );
    const request = new EventEmitter() as EventEmitter & {
      end: () => void;
      destroy: () => void;
    };
    request.destroy = () => {};
    request.end = () => {
      const response = new PassThrough() as PassThrough & {
        statusCode: number;
        headers: Record<string, string>;
      };
      response.statusCode = 302;
      response.headers = {
        location: "http://169.254.169.254/latest/meta-data/",
      };
      callback(response);
    };
    return request;
  }) as never);
  try {
    await assert.rejects(
      safeFetch("https://public-looking.example.com"),
      /Private/,
    );
    assert.equal(requests, 1);
    assert.equal(pinned, "8.8.8.8");
  } finally {
    resolver.mock.restore();
    transport.mock.restore();
  }
});

test("blocks loopback, private, link-local, mapped, multicast and reserved IPs", () => {
  for (const address of [
    "127.0.0.1",
    "10.1.2.3",
    "192.168.1.1",
    "172.16.1.2",
    "169.254.169.254",
    "0.0.0.0",
    "100.64.0.1",
    "224.0.0.1",
    "192.0.2.1",
    "::1",
    "::",
    "fe80::1",
    "fc00::1",
    "::ffff:127.0.0.1",
  ])
    assert.equal(isPublicIP(address), false, address);
  assert.equal(isPublicIP("8.8.8.8"), true);
  assert.equal(isPublicIP("2606:4700:4700::1111"), true);
});
test("rejects URL parsing tricks, credentials, private addresses, unsupported protocols and ports", () => {
  for (const url of [
    "http://127.1",
    "http://2130706433",
    "http://0x7f000001",
    "http://[::1]",
    "http://localhost",
    "http://foo.internal",
    "file:///etc/passwd",
    "ftp://example.com",
    "http://user:pass@example.com",
    "https://example.com:8080",
  ])
    assert.throws(() => normalizeURL(url), undefined, url);
  assert.equal(
    normalizeURL("example.com/path#x").href,
    "https://example.com/path",
  );
});
test("an already aborted request does not open a connection or hang", async () => {
  const controller = new AbortController();
  controller.abort();
  await assert.rejects(
    safeFetch("https://example.com", {
      signal: controller.signal,
      timeoutMs: 50,
    }),
    /cancelled/,
  );
});
test("input validation caps competitors and rejects private competitor URLs", () => {
  assert.throws(
    () =>
      parseAuditInput({
        url: "https://example.com",
        competitors: [
          "https://a.com",
          "https://b.com",
          "https://c.com",
          "https://d.com",
        ],
      }),
    /three/,
  );
  assert.throws(
    () =>
      parseAuditInput({
        url: "https://example.com",
        competitors: ["http://127.0.0.1"],
      }),
    /Private/,
  );
});
test("cross-origin requests are refused", () => {
  assert.throws(
    () =>
      assertSameOrigin(
        new Request("https://analyzer.example.com/api/seo/audit", {
          headers: { origin: "https://evil.example.com" },
        }),
      ),
    /analyzer/,
  );
  assert.doesNotThrow(() =>
    assertSameOrigin(
      new Request("https://analyzer.example.com/api/seo/audit", {
        headers: { origin: "https://analyzer.example.com" },
      }),
    ),
  );
});
test("JSON body reader enforces size and rejects invalid input", async () => {
  await assert.rejects(
    readJSON(
      new Request("https://example.com", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: "x".repeat(110),
      }),
      100,
    ),
    /too large/,
  );
  await assert.rejects(
    readJSON(
      new Request("https://example.com", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: "not json",
      }),
    ),
    /invalid JSON/,
  );
});
test("memory rate limiter rejects excess requests without trusting client spoofed forwarded headers", async () => {
  const request = new Request("https://example.com/api/seo/audit", {
    headers: { "x-forwarded-for": "8.8.8.8" },
  });
  for (let i = 0; i < 6; i++) await rateLimit(request, "audit");
  await assert.rejects(rateLimit(request, "audit"), /limit/);
});
