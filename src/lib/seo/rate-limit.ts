import { createHash } from "node:crypto";
import { PublicError } from "./security";
import { redisCredentials } from "./redis-config";
const globalState = globalThis as typeof globalThis & {
  seoLimits?: Map<string, { count: number; expires: number }>;
};
const memory = (globalState.seoLimits ??= new Map());
async function increment(key: string, seconds: number): Promise<number> {
  if (
    process.env.VERCEL_ENV === "production" &&
    process.env.RATE_LIMIT_MODE !== "redis"
  )
    throw new PublicError(
      "The public audit is awaiting distributed rate-limit configuration. Please try again later.",
      503,
    );
  if (process.env.RATE_LIMIT_MODE === "redis") {
    const { url, token } = redisCredentials();
    if (!url || !token || !url.startsWith("https://"))
      throw new PublicError(
        "The service is being configured. Please try again later.",
        503,
      );
    const response = await fetch(url, {
      method: "POST",
      signal: AbortSignal.timeout(5000),
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify([
        "EVAL",
        "local n=redis.call('INCR',KEYS[1]); if n==1 then redis.call('EXPIRE',KEYS[1],ARGV[1]); end; return n",
        "1",
        key,
        String(seconds),
      ]),
    });
    if (!response.ok)
      throw new PublicError(
        "The service is temporarily unavailable. Please try again later.",
        503,
      );
    const data = await response.json();
    if (typeof data.result !== "number")
      throw new PublicError(
        "The service is temporarily unavailable. Please try again later.",
        503,
      );
    return data.result;
  }
  if (
    process.env.NODE_ENV === "production" &&
    process.env.RATE_LIMIT_MODE !== "memory"
  )
    throw new PublicError(
      "The service rate limiter has not been configured yet.",
      503,
    );
  const now = Date.now();
  for (const [key, entry] of memory)
    if (entry.expires < now) memory.delete(key);
  if (memory.size > 5000)
    throw new PublicError("The service is busy. Please try again later.", 429);
  const entry = memory.get(key);
  const next =
    entry && entry.expires > now
      ? { ...entry, count: entry.count + 1 }
      : { count: 1, expires: now + seconds * 1000 };
  memory.set(key, next);
  return next.count;
}
export async function rateLimit(
  request: Request,
  purpose: "audit" | "ai" | "export" | "performance",
) {
  // An untrusted forwarded header is never used. Configure one only behind an overwriting proxy.
  const trusted = process.env.TRUSTED_CLIENT_IP_HEADER;
  const client = trusted
    ? request.headers.get(trusted)?.split(",")[0].trim() || "unknown"
    : "shared";
  const hash = createHash("sha256")
    .update(client.slice(0, 200))
    .digest("hex")
    .slice(0, 24);
  const cap = { audit: 6, ai: 12, export: 30, performance: 6 }[purpose];
  const perClient = await increment(`hg:${purpose}:${hash}`, 900);
  if (perClient > cap)
    throw new PublicError(
      "You have reached the free request limit. Please try again in 15 minutes.",
      429,
    );
  const globalCount = await increment(`hg:${purpose}:global`, 3600);
  if (globalCount > (purpose === "export" ? 300 : 100))
    throw new PublicError(
      "The service has reached its hourly capacity. Please try again later.",
      429,
    );
}
