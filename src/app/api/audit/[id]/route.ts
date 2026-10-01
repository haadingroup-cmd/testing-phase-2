import { getAuditReport } from "@/lib/audit/store";
import { hasDatabase } from "@/lib/db";
import { fail, ok } from "@/lib/security/request";

export const runtime = "nodejs";

/** GET /api/audit/:id — JSON report (for integrations / future dashboards). */
export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!hasDatabase) return fail("Unavailable.", 503);
  const { id } = await params;
  const audit = await getAuditReport(id);
  if (!audit) return fail("Report not found.", 404);
  return ok(audit.report);
}
