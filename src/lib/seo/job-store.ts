import { gzipSync, gunzipSync } from "node:zlib";
import { randomUUID } from "node:crypto";
import { PublicError } from "./security";
import type { FullCrawl } from "./full-crawl";
const ttl = 30 * 86400;
export function jobsConfigured() {
  return Boolean(
    process.env.UPSTASH_REDIS_REST_URL &&
      process.env.UPSTASH_REDIS_REST_TOKEN &&
      process.env.SEO_BACKGROUND_ENABLED === "true",
  );
}
export async function redis<T = unknown>(
  ...command: (string | number)[]
): Promise<T> {
  const url = process.env.UPSTASH_REDIS_REST_URL,
    token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url?.startsWith("https://") || !token)
    throw new PublicError("Persistent audit storage is not connected.", 503);
  const response = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(command),
    signal: AbortSignal.timeout(10000),
    cache: "no-store",
  });
  if (!response.ok)
    throw new PublicError("Audit storage is temporarily unavailable.", 503);
  const data = await response.json();
  if (data.error)
    throw new PublicError(
      "Audit storage could not complete the operation.",
      503,
    );
  return data.result as T;
}
const key = (id: string) => `hgn:job:${id}`;
export async function getJob(id: string): Promise<FullCrawl | null> {
  if (!/^[a-f\d-]{36}$/.test(id)) throw new PublicError("Invalid audit ID.");
  const value = await redis<string | null>("GET", key(id));
  return value
    ? JSON.parse(
        gunzipSync(Buffer.from(value, "base64"), {
          maxOutputLength: 50_000_000,
        }).toString(),
      )
    : null;
}
export async function saveJob(job: FullCrawl) {
  const value = gzipSync(JSON.stringify(job)).toString("base64");
  if (Buffer.byteLength(value) > 8_000_000)
    throw new PublicError(
      "This audit exceeds the report storage size limit. Reduce the page limit.",
      413,
    );
  await redis("EVAL", "redis.call('SET',KEYS[1],ARGV[1],'EX',ARGV[3]); redis.call('SET',KEYS[2],ARGV[2],'EX',ARGV[3]); return 1", 2, key(job.id), `hgn:summary:${job.id}`, value, JSON.stringify({ ...jobSummary(job), owner: job.owner }), ttl);
}
export async function createJob(job: FullCrawl) {
  if (!jobsConfigured())
    throw new PublicError(
      "Background audits are awaiting persistent storage and workflow configuration.",
      503,
    );
  await saveJob(job);
  await redis(
    "ZADD",
    `hgn:history:${job.owner}`,
    Date.parse(job.createdAt),
    job.id,
  );
  await redis("ZREMRANGEBYRANK", `hgn:history:${job.owner}`, 0, -101);
  await redis("EXPIRE", `hgn:history:${job.owner}`, ttl);
}
export async function recentJobs(owner: string) {
  const ids = await redis<string[]>("ZREVRANGE", `hgn:history:${owner}`, 0, 49);
  if (!ids.length) return [];
  const values = await redis<(string | null)[]>(
    "MGET",
    ...ids.map((id) => `hgn:summary:${id}`),
  );
  const found: ReturnType<typeof jobSummary>[] = [];
  for (const value of values) {
    if (!value) continue;
    const { owner: storedOwner, ...summary } = JSON.parse(value);
    if (storedOwner === owner) found.push(summary);
  }
  return found;
}
export async function withJobLock<T>(
  id: string,
  fn: () => Promise<T>,
): Promise<T | null> {
  const token = randomUUID(),
    lock = `hgn:lock:${id}`;
  const acquired = await redis("SET", lock, token, "NX", "EX", 100);
  if (acquired !== "OK") return null;
  try {
    return await fn();
  } finally {
    await redis(
      "EVAL",
      "if redis.call('GET',KEYS[1])==ARGV[1] then return redis.call('DEL',KEYS[1]) else return 0 end",
      1,
      lock,
      token,
    );
  }
}
export async function ownedJob(id: string, owner: string) {
  const job = await getJob(id);
  if (!job || job.owner !== owner)
    throw new PublicError("Audit not found.", 404);
  return job;
}
export function jobSummary(job: FullCrawl) {
  return {
    id: job.id,
    url: job.input.url,
    createdAt: job.createdAt,
    status: job.status,
    pages: job.pages.length,
    pending: job.queue.length,
    discovered: job.seen.length,
    skipped: job.skipped.length,
    maxPages: job.maxPages,
    error: job.error,
    aiStatus: job.aiStatus,
    aiRequested: job.aiRequested,
    aiReviewed: Object.keys(job.aiReviews || {}).length,
    aiLimit: job.aiLimit,
    runId: job.runId,
  };
}
