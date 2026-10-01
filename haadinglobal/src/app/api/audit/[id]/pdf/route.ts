import { renderAuditPdf } from "@/lib/audit/pdf";
import { getAuditReport } from "@/lib/audit/store";
import { getSettings } from "@/lib/data";
import { hasDatabase } from "@/lib/db";
import { fail } from "@/lib/security/request";
import { SITE_URL } from "@/lib/site";

export const runtime = "nodejs";

/** GET /api/audit/:id/pdf — server-side PDF of a completed report. */
export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!hasDatabase) return fail("Unavailable.", 503);
  const { id } = await params;
  const audit = await getAuditReport(id);
  if (!audit) return fail("Report not found.", 404);

  const settings = await getSettings();
  const pdf = await renderAuditPdf(audit.report, {
    name: settings.companyName,
    email: settings.email,
    phone: settings.phone,
    siteUrl: SITE_URL.replace(/^https?:\/\//, ""),
  });
  const host = new URL(audit.report.finalUrl).hostname.replace(/[^a-z0-9.-]/gi, "");
  return new Response(Buffer.from(pdf), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="website-audit-${host}.pdf"`,
      "Cache-Control": "private, max-age=3600",
      "X-Robots-Tag": "noindex",
    },
  });
}
