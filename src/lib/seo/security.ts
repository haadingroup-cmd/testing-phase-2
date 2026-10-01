import { lookup } from "node:dns/promises";
import http from "node:http";
import https from "node:https";
import { createBrotliDecompress, createGunzip, createInflate } from "node:zlib";
import { Transform } from "node:stream";
import ipaddr from "ipaddr.js";

export class PublicError extends Error {
  constructor(
    message: string,
    public status = 400,
  ) {
    super(message);
    this.name = "PublicError";
  }
}
export function isPublicIP(address: string): boolean {
  try {
    return ipaddr.process(address).range() === "unicast";
  } catch {
    return false;
  }
}
export function normalizeURL(input: string): URL {
  let url: URL;
  try {
    url = new URL(
      /^[a-z][a-z\d+.-]*:/i.test(input.trim())
        ? input.trim()
        : `https://${input.trim()}`,
    );
  } catch {
    throw new PublicError(
      "Enter a valid public website URL, such as https://example.com.",
    );
  }
  const host = url.hostname
    .replace(/^\[|\]$/g, "")
    .replace(/\.$/, "")
    .toLowerCase();
  if (
    !["http:", "https:"].includes(url.protocol) ||
    url.username ||
    url.password ||
    (url.port && !["80", "443"].includes(url.port))
  )
    throw new PublicError(
      "Only public HTTP or HTTPS websites on standard ports are supported. URLs with credentials are not accepted.",
    );
  if (
    input.length > 2048 ||
    !host ||
    (!host.includes(".") && !ipaddr.isValid(host)) ||
    /(?:^|\.)(?:localhost|local|internal|test|invalid|onion|home|lan)$/.test(
      host,
    )
  )
    throw new PublicError(
      "Enter a public website address. Local and private networks cannot be analyzed.",
    );
  if (ipaddr.isValid(host) && !isPublicIP(host))
    throw new PublicError(
      "Private, reserved, and local IP addresses cannot be analyzed.",
    );
  url.hash = "";
  return url;
}
export async function resolvePublic(
  hostname: string,
): Promise<{ address: string; family: number }[]> {
  const host = hostname.replace(/^\[|\]$/g, "");
  const addresses = ipaddr.isValid(host)
    ? [{ address: host, family: ipaddr.parse(host).kind() === "ipv6" ? 6 : 4 }]
    : await lookup(host, { all: true, verbatim: true });
  if (!addresses.length || addresses.some((a) => !isPublicIP(a.address)))
    throw new PublicError(
      "This hostname resolves to a private or reserved network and cannot be fetched.",
    );
  return addresses;
}
export interface FetchResult {
  url: string;
  status: number;
  headers: Record<string, string>;
  body: string;
  bytes: number;
  transferBytes: number;
  fetchMs: number;
  redirects: string[];
}
export interface FetchOptions {
  signal?: AbortSignal;
  timeoutMs?: number;
  maxBytes?: number;
  maxRedirects?: number;
  beforeHop?: (url: URL) => Promise<void>;
  accept?: string;
}
export type Fetcher = (
  url: string,
  options?: FetchOptions,
) => Promise<FetchResult>;
export const crawlerAgent =
  "HaadinGlobalAudit/1.0 (+https://www.haadinglobal.com/free-seo-audit)";

async function requestOnce(
  url: URL,
  options: FetchOptions,
): Promise<Omit<FetchResult, "redirects">> {
  const timeout = options.timeoutMs ?? 8000;
  const max = options.maxBytes ?? 2_000_000;
  const controller = new AbortController();
  const onAbort = () => controller.abort();
  options.signal?.addEventListener("abort", onAbort, { once: true });
  if (options.signal?.aborted) controller.abort();
  const timer = setTimeout(() => controller.abort(), timeout);
  const started = performance.now();
  try {
    if (controller.signal.aborted)
      throw new PublicError("The website request was cancelled.", 499);
    const addresses = await Promise.race([
      resolvePublic(url.hostname),
      new Promise<never>((_, reject) =>
        controller.signal.addEventListener(
          "abort",
          () =>
            reject(
              new PublicError(
                "The website took too long to respond. Try again later.",
                504,
              ),
            ),
          { once: true },
        ),
      ),
    ]);
    if (controller.signal.aborted)
      throw new PublicError(
        "The website request was cancelled or timed out.",
        504,
      );
    // Every DNS answer is checked, and the actual TCP connection is pinned to one checked answer.
    // No proxy agent or automatic redirect can bypass this lookup.
    const address = addresses.find((a) => a.family === 4) ?? addresses[0];
    return await new Promise((resolve, reject) => {
      const transport = url.protocol === "https:" ? https : http;
      const req = transport.request(
        url,
        {
          method: "GET",
          agent: false,
          signal: controller.signal,
          lookup: ((
            _host: string,
            opts: { all?: boolean },
            cb: (...args: unknown[]) => void,
          ) => {
            if (opts?.all) cb(null, [address]);
            else cb(null, address.address, address.family);
          }) as never,
          headers: {
            "User-Agent": crawlerAgent,
            Accept:
              options.accept ??
              "text/html,application/xhtml+xml;q=0.9,*/*;q=0.1",
            "Accept-Encoding": "gzip, deflate, br",
          },
        },
        (res) => {
          const headers: Record<string, string> = {};
          for (const [key, value] of Object.entries(res.headers))
            if (value !== undefined)
              headers[key] = Array.isArray(value) ? value.join(", ") : value;
          const status = res.statusCode ?? 0;
          if ([301, 302, 303, 307, 308].includes(status)) {
            res.destroy();
            resolve({
              url: url.href,
              status,
              headers,
              body: "",
              bytes: 0,
              transferBytes: 0,
              fetchMs: Math.round(performance.now() - started),
            });
            return;
          }
          let transferBytes = 0;
          let bytes = 0;
          const chunks: Buffer[] = [];
          const limiter = new Transform({
            transform(chunk, _encoding, cb) {
              transferBytes += chunk.length;
              if (transferBytes > max)
                cb(
                  new PublicError(
                    "The page exceeds the safe download limit (2 MB).",
                  ),
                );
              else cb(null, chunk);
            },
          });
          const encoding = headers["content-encoding"]?.toLowerCase();
          const decoder =
            encoding === "gzip"
              ? createGunzip()
              : encoding === "br"
                ? createBrotliDecompress()
                : encoding === "deflate"
                  ? createInflate()
                  : null;
          const fail = (err: Error) => {
            req.destroy();
            res.destroy();
            limiter.destroy();
            decoder?.destroy();
            reject(err);
          };
          res.on("error", fail);
          limiter.on("error", fail);
          decoder?.on("error", fail);
          const stream = decoder
            ? res.pipe(limiter).pipe(decoder)
            : res.pipe(limiter);
          stream.on("data", (chunk: Buffer) => {
            bytes += chunk.length;
            if (bytes > max) {
              fail(
                new PublicError(
                  "The expanded page exceeds the safe size limit (2 MB).",
                ),
              );
              return;
            }
            chunks.push(chunk);
          });
          stream.on("end", () => {
            const buffer = Buffer.concat(chunks);
            const declared =
              headers["content-type"]?.match(
                /charset=["']?([^;\s"']+)/i,
              )?.[1] ||
              buffer
                .subarray(0, 1024)
                .toString("ascii")
                .match(/charset=["']?([^\s"'>;]+)/i)?.[1] ||
              "utf-8";
            let body: string;
            try {
              body = new TextDecoder(declared).decode(buffer);
            } catch {
              body = buffer.toString("utf8");
            }
            resolve({
              url: url.href,
              status,
              headers,
              body,
              bytes,
              transferBytes,
              fetchMs: Math.round(performance.now() - started),
            });
          });
        },
      );
      req.on("error", (err) =>
        reject(
          controller.signal.aborted
            ? new PublicError(
                "The website took too long to respond or the audit was cancelled.",
                504,
              )
            : err,
        ),
      );
      req.end();
    });
  } finally {
    clearTimeout(timer);
    options.signal?.removeEventListener("abort", onAbort);
  }
}
export const safeFetch: Fetcher = async (input, options = {}) => {
  let url = normalizeURL(input);
  const redirects: string[] = [];
  let totalFetchMs = 0;
  const seen = new Set<string>();
  for (let hop = 0; hop <= (options.maxRedirects ?? 4); hop++) {
    if (seen.has(url.href))
      throw new PublicError("The website returned a redirect loop.");
    seen.add(url.href);
    await options.beforeHop?.(url);
    const result = await requestOnce(url, options);
    totalFetchMs += result.fetchMs;
    if (
      [301, 302, 303, 307, 308].includes(result.status) &&
      result.headers.location
    ) {
      redirects.push(`${result.status} ${url.href}`);
      url = normalizeURL(new URL(result.headers.location, url).href);
      continue;
    }
    return { ...result, redirects, fetchMs: totalFetchMs };
  }
  throw new PublicError(
    "The website redirects too many times to complete this audit.",
  );
};
export function friendlyError(error: unknown): string {
  if (error instanceof PublicError) return error.message;
  return "We couldn't access this website. It may be blocking automated requests, temporarily unavailable, or requiring authentication.";
}
