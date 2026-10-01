import "server-only";
import { lookup } from "node:dns";
import http from "node:http";
import https from "node:https";
import { isIP } from "node:net";
import type { LookupFunction } from "node:net";
import zlib from "node:zlib";

/**
 * SSRF-hardened HTTP fetcher for the audit tool.
 *  - http/https only, standard ports only, no credentials in URLs
 *  - every DNS answer is checked against private/reserved ranges at
 *    connect time (defeats DNS-rebinding between check and connect)
 *  - redirects are followed manually and each hop is re-validated
 *  - hard limits on time and response size
 */

export class FetchBlockedError extends Error {}

const MAX_REDIRECTS = 5;
const DEFAULT_TIMEOUT_MS = 10_000;
const DEFAULT_MAX_BYTES = 3 * 1024 * 1024;
const USER_AGENT = "Mozilla/5.0 (compatible; HaadinGlobalAuditBot/1.0; +https://www.haadinglobal.com/audit)";

function ipv4ToInt(ip: string): number {
  return ip.split(".").reduce((acc, octet) => (acc << 8) + Number(octet), 0) >>> 0;
}

const BLOCKED_V4: Array<[string, number]> = [
  ["0.0.0.0", 8],
  ["10.0.0.0", 8],
  ["100.64.0.0", 10],
  ["127.0.0.0", 8],
  ["169.254.0.0", 16],
  ["172.16.0.0", 12],
  ["192.0.0.0", 24],
  ["192.0.2.0", 24],
  ["192.168.0.0", 16],
  ["198.18.0.0", 15],
  ["198.51.100.0", 24],
  ["203.0.113.0", 24],
  ["224.0.0.0", 4],
  ["240.0.0.0", 4],
];

export function isBlockedAddress(address: string): boolean {
  const family = isIP(address);
  if (family === 4) {
    const value = ipv4ToInt(address);
    return BLOCKED_V4.some(([base, bits]) => {
      const mask = bits === 0 ? 0 : (~0 << (32 - bits)) >>> 0;
      return (value & mask) === (ipv4ToInt(base) & mask);
    });
  }
  if (family === 6) {
    const lower = address.toLowerCase();
    if (lower === "::" || lower === "::1") return true;
    const mapped = lower.match(/^::ffff:(\d+\.\d+\.\d+\.\d+)$/);
    if (mapped) return isBlockedAddress(mapped[1]);
    if (/^f[cd]/.test(lower)) return true; // fc00::/7 unique local
    if (/^fe[89ab]/.test(lower)) return true; // fe80::/10 link local
    if (/^ff/.test(lower)) return true; // multicast
    if (lower.startsWith("2001:db8")) return true; // documentation
    if (lower.startsWith("64:ff9b")) return true; // NAT64
    return false;
  }
  return true;
}

const safeLookup: LookupFunction = (hostname, options, callback) => {
  lookup(hostname, { ...options, all: true }, (error, addresses) => {
    if (error) return callback(error, "", 4);
    const list = Array.isArray(addresses) ? addresses : [];
    const safe = list.filter((a) => !isBlockedAddress(a.address));
    if (list.length === 0 || safe.length !== list.length) {
      return callback(new FetchBlockedError("This address points to a private or reserved network."), "", 4);
    }
    if (options.all) {
      return (callback as unknown as (e: null, a: typeof safe) => void)(null, safe);
    }
    callback(null, safe[0].address, safe[0].family);
  });
};

export function assertPublicUrl(raw: string): URL {
  let url: URL;
  try {
    url = new URL(raw);
  } catch {
    throw new FetchBlockedError("Invalid URL.");
  }
  if (url.protocol !== "http:" && url.protocol !== "https:") throw new FetchBlockedError("Only http and https URLs are allowed.");
  if (url.username || url.password) throw new FetchBlockedError("URLs with credentials are not allowed.");
  if (url.port && url.port !== "80" && url.port !== "443") throw new FetchBlockedError("Only standard ports are allowed.");
  const host = url.hostname.replace(/^\[|\]$/g, "");
  if (isIP(host) && isBlockedAddress(host)) throw new FetchBlockedError("This address points to a private or reserved network.");
  if (host === "localhost" || host.endsWith(".localhost") || host.endsWith(".local") || host.endsWith(".internal")) {
    throw new FetchBlockedError("Enter a public website address.");
  }
  return url;
}

export type SafeResponse = {
  url: string;
  status: number;
  headers: Record<string, string>;
  body: string;
  bytes: number;
  truncated: boolean;
  timeToFirstByteMs: number;
  totalTimeMs: number;
  redirects: string[];
};

type Options = { timeoutMs?: number; maxBytes?: number; accept?: string };

function requestOnce(url: URL, opts: Required<Options>): Promise<{ status: number; headers: Record<string, string>; body: Buffer; truncated: boolean; ttfb: number }> {
  return new Promise((resolveOuter, rejectOuter) => {
    const started = Date.now();
    const resolve: typeof resolveOuter = (value) => {
      clearTimeout(timer);
      resolveOuter(value);
    };
    const reject = (error: unknown) => {
      clearTimeout(timer);
      rejectOuter(error);
    };
    const client = url.protocol === "https:" ? https : http;
    const req = client.request(
      url,
      {
        method: "GET",
        lookup: safeLookup,
        timeout: opts.timeoutMs,
        headers: {
          "User-Agent": USER_AGENT,
          Accept: opts.accept,
          "Accept-Encoding": "gzip, deflate, br",
          "Accept-Language": "en;q=0.9",
        },
      },
      (res) => {
        const ttfb = Date.now() - started;
        const headers: Record<string, string> = {};
        for (const [key, value] of Object.entries(res.headers)) {
          if (value !== undefined) headers[key.toLowerCase()] = Array.isArray(value) ? value.join(", ") : String(value);
        }
        const status = res.statusCode ?? 0;
        if (status >= 300 && status < 400) {
          res.resume();
          return resolve({ status, headers, body: Buffer.alloc(0), truncated: false, ttfb });
        }
        const encoding = (headers["content-encoding"] ?? "").toLowerCase();
        let stream: NodeJS.ReadableStream = res;
        if (encoding.includes("br")) stream = res.pipe(zlib.createBrotliDecompress());
        else if (encoding.includes("gzip")) stream = res.pipe(zlib.createGunzip());
        else if (encoding.includes("deflate")) stream = res.pipe(zlib.createInflate());

        const chunks: Buffer[] = [];
        let size = 0;
        let truncated = false;
        stream.on("data", (chunk: Buffer) => {
          if (truncated) return;
          size += chunk.length;
          if (size > opts.maxBytes) {
            truncated = true;
            chunks.push(chunk.subarray(0, Math.max(0, chunk.length - (size - opts.maxBytes))));
            res.destroy();
            resolve({ status, headers, body: Buffer.concat(chunks), truncated, ttfb });
            return;
          }
          chunks.push(chunk);
        });
        stream.on("end", () => resolve({ status, headers, body: Buffer.concat(chunks), truncated, ttfb }));
        stream.on("error", (error) => (truncated ? undefined : reject(error)));
      },
    );
    // Overall deadline (the socket `timeout` option only covers idle time).
    const timer = setTimeout(() => req.destroy(new Error("The website took too long to respond.")), opts.timeoutMs);
    req.on("timeout", () => req.destroy(new Error("The website took too long to respond.")));
    req.on("error", reject);
    req.end();
  });
}

export async function safeFetch(rawUrl: string, options: Options = {}): Promise<SafeResponse> {
  const opts: Required<Options> = {
    timeoutMs: options.timeoutMs ?? DEFAULT_TIMEOUT_MS,
    maxBytes: options.maxBytes ?? DEFAULT_MAX_BYTES,
    accept: options.accept ?? "text/html,application/xhtml+xml;q=0.9,*/*;q=0.8",
  };
  const started = Date.now();
  const redirects: string[] = [];
  let current = assertPublicUrl(rawUrl);

  for (let hop = 0; hop <= MAX_REDIRECTS; hop++) {
    const res = await requestOnce(current, opts);
    if (res.status >= 300 && res.status < 400 && res.headers.location) {
      if (hop === MAX_REDIRECTS) throw new Error("Too many redirects.");
      redirects.push(current.toString());
      current = assertPublicUrl(new URL(res.headers.location, current).toString());
      continue;
    }
    return {
      url: current.toString(),
      status: res.status,
      headers: res.headers,
      body: res.body.toString("utf8"),
      bytes: res.body.length,
      truncated: res.truncated,
      timeToFirstByteMs: res.ttfb,
      totalTimeMs: Date.now() - started,
      redirects,
    };
  }
  throw new Error("Too many redirects.");
}
