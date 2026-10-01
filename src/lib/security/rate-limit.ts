import "server-only";
import { createHash } from "node:crypto";
import { getDb, hasDatabase } from "@/lib/db";

/**
 * Fixed-window rate limiter stored in PostgreSQL, so limits hold across
 * serverless instances. Falls back to a per-instance memory map when no
 * database is configured (local development without Postgres).
 */
const memory = new Map<string, { count: number; resetAt: number }>();

export type RateLimitResult = { allowed: boolean; remaining: number; retryAfterSeconds: number };

export function hashKey(value: string): string {
  const salt = process.env.AUTH_SECRET ?? "haadinglobal";
  return createHash("sha256").update(`${salt}:${value}`).digest("hex").slice(0, 40);
}

export async function rateLimit(scope: string, identifier: string, limit: number, windowSeconds: number): Promise<RateLimitResult> {
  const key = `${scope}:${hashKey(identifier)}`;
  const now = Date.now();
  const windowMs = windowSeconds * 1000;

  if (!hasDatabase) {
    const entry = memory.get(key);
    if (!entry || entry.resetAt <= now) {
      memory.set(key, { count: 1, resetAt: now + windowMs });
      return { allowed: true, remaining: limit - 1, retryAfterSeconds: 0 };
    }
    entry.count += 1;
    return {
      allowed: entry.count <= limit,
      remaining: Math.max(0, limit - entry.count),
      retryAfterSeconds: Math.ceil((entry.resetAt - now) / 1000),
    };
  }

  try {
    const db = getDb();
    const resetAt = new Date(now + windowMs);
    // Atomic upsert: start a new window when the old one has expired.
    const rows = await db.$queryRaw<Array<{ count: number; resetAt: Date }>>`
      INSERT INTO "RateLimit" ("key", "count", "resetAt") VALUES (${key}, 1, ${resetAt})
      ON CONFLICT ("key") DO UPDATE SET
        "count" = CASE WHEN "RateLimit"."resetAt" <= NOW() THEN 1 ELSE "RateLimit"."count" + 1 END,
        "resetAt" = CASE WHEN "RateLimit"."resetAt" <= NOW() THEN ${resetAt} ELSE "RateLimit"."resetAt" END
      RETURNING "count", "resetAt"`;
    const row = rows[0];
    // Opportunistic cleanup of expired windows (~1% of requests).
    if (Math.random() < 0.01) {
      await db.rateLimit.deleteMany({ where: { resetAt: { lt: new Date(now - 3600_000) } } });
    }
    return {
      allowed: row.count <= limit,
      remaining: Math.max(0, limit - row.count),
      retryAfterSeconds: Math.max(0, Math.ceil((row.resetAt.getTime() - now) / 1000)),
    };
  } catch (error) {
    console.error("[rate-limit] failed open:", error instanceof Error ? error.message : error);
    return { allowed: true, remaining: limit, retryAfterSeconds: 0 };
  }
}
