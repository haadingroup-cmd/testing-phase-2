import "server-only";
import { getDb } from "@/lib/db";
import type { AuditReport } from "@/lib/audit/types";

/** Report ids are unguessable cuids; anyone holding the link can view that report. */
export async function getAuditReport(id: string): Promise<{ id: string; url: string; report: AuditReport; createdAt: Date } | null> {
  if (!/^[a-z0-9]{20,40}$/i.test(id)) return null;
  const row = await getDb().auditRequest.findUnique({ where: { id } });
  if (!row || row.status !== "COMPLETED" || !row.report) return null;
  return { id: row.id, url: row.url, report: row.report as unknown as AuditReport, createdAt: row.createdAt };
}
