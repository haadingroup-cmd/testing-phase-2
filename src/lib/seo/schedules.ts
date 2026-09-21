import { createHash, randomUUID } from "node:crypto";
import { redis } from "./job-store";
import type { AuditInput } from "./types";
export interface AuditSchedule {
  id: string;
  owner: string;
  input: AuditInput;
  maxPages: number;
  ai: boolean;
  aiLimit: number;
  cadence: "daily" | "weekly";
  nextAt: number;
  lastJob?: string;
  enabled: boolean;
}
const all = "hgn:schedules";
export async function schedules(owner?: string) {
  const rows = await redis<Record<string, string> | string[]>("HGETALL", all);
  const values = Array.isArray(rows)
    ? rows.filter((_, i) => i % 2 === 1)
    : Object.values(rows || {});
  return values
    .map((v) => JSON.parse(v) as AuditSchedule)
    .filter((s) => !owner || s.owner === owner);
}
export async function saveSchedule(schedule: AuditSchedule) {
  await redis("HSET", all, schedule.id, JSON.stringify(schedule));
}
export function scheduleId(owner: string, url: string) {
  return createHash("sha256")
    .update(`${owner}\n${url}`)
    .digest("hex")
    .slice(0, 32);
}
