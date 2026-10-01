import "server-only";
import { randomBytes } from "node:crypto";
import { getDb, hasDatabase } from "@/lib/db";
import type { AuditReport } from "@/lib/audit/types";
import type { Prisma } from "@/generated/prisma/client";

// Reuse the connected free Upstash integration; never require a paid provider.
const redisUrl = process.env.KV_REST_API_URL ?? process.env.UPSTASH_REDIS_REST_URL;
const redisToken = process.env.KV_REST_API_TOKEN ?? process.env.UPSTASH_REDIS_REST_TOKEN;
export const hasAuditRedis = Boolean(redisUrl && redisToken);
export const hasAuditStorage = hasDatabase || hasAuditRedis;
const REPORT_TTL_SECONDS = 7 * 24 * 60 * 60;
const prefix = `hgn:public-audit:v2:${process.env.VERCEL_ENV ?? "development"}`;

type StoredReport = { id: string; url: string; report: AuditReport; createdAt: string };

/** Server-only REST client. Errors deliberately exclude credentials and payloads. */
export async function auditRedisCommand<T>(command: Array<string | number>): Promise<T> {
  if (!hasAuditRedis) throw new Error("Audit storage is not configured.");
  const response = await fetch(redisUrl!, {
    method: "POST",
    headers: { Authorization: `Bearer ${redisToken}`, "Content-Type": "application/json" },
    body: JSON.stringify(command),
    cache: "no-store",
    signal: AbortSignal.timeout(8000),
  });
  if (!response.ok) throw new Error("Audit storage is temporarily unavailable.");
  const result = await response.json() as { result: T; error?: string };
  if (result.error) throw new Error("Audit storage operation failed.");
  return result.result;
}

export async function saveAuditReport(report: AuditReport): Promise<string> {
  if (hasDatabase) {
    const row = await getDb().auditRequest.create({ data: {
      url: report.requestedUrl, finalUrl: report.finalUrl, status: "COMPLETED", score: report.score,
      report: report as unknown as Prisma.InputJsonValue,
    } });
    return row.id;
  }
  const id = randomBytes(18).toString("hex");
  const row: StoredReport = { id, url: report.requestedUrl, report, createdAt: new Date().toISOString() };
  const saved = await auditRedisCommand<string>(["SET", `${prefix}:report:${id}`, JSON.stringify(row), "EX", REPORT_TTL_SECONDS]);
  if (saved !== "OK") throw new Error("Report could not be saved.");
  return id;
}

/** Unguessable links expose only the public-site report, never contact details. */
export async function getAuditReport(id: string): Promise<{ id: string; url: string; report: AuditReport; createdAt: Date } | null> {
  if (!/^[a-z0-9]{20,40}$/i.test(id)) return null;
  if (hasDatabase) {
    const row = await getDb().auditRequest.findUnique({ where: { id } });
    if (row?.status === "COMPLETED" && row.report) {
      return { id: row.id, url: row.url, report: row.report as unknown as AuditReport, createdAt: row.createdAt };
    }
  }
  if (!hasAuditRedis) return null;
  const value = await auditRedisCommand<string | null>(["GET", `${prefix}:report:${id}`]);
  if (!value) return null;
  const row = JSON.parse(value) as StoredReport;
  if (row.id !== id || row.report?.version !== 1) return null;
  return { ...row, createdAt: new Date(row.createdAt) };
}

/** Atomic shared counter: no per-instance memory fallback for public crawls. */
export async function auditRateLimit(key: string, limit: number, seconds: number): Promise<{ allowed: boolean; retryAfterSeconds: number }> {
  const script = "local n=redis.call('INCR',KEYS[1]); if n==1 then redis.call('EXPIRE',KEYS[1],ARGV[1]) end; return {n,redis.call('TTL',KEYS[1])}";
  const [count, ttl] = await auditRedisCommand<[number, number]>(["EVAL", script, 1, `${prefix}:limit:${key}`, seconds]);
  return { allowed: count <= limit, retryAfterSeconds: Math.max(1, ttl) };
}
