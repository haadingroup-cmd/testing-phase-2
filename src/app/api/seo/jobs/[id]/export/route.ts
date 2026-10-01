import { rateLimit } from "@/lib/seo/rate-limit";
import { auditStaff } from "@/lib/seo/job-auth";
import { ownedJob } from "@/lib/seo/job-store";
import { fullCrawlReport } from "@/lib/seo/full-crawl";
import { generatePDF } from "@/lib/seo/pdf";
import { reportCSV } from "@/lib/seo/export";
import { apiError } from "@/lib/seo/http";
import { PublicError } from "@/lib/seo/security";
export const runtime = "nodejs";
export const maxDuration = 120;
export async function GET(
  request: Request,
  { params }: { params: { id: string } },
) {
  try {
    const profile = await auditStaff();
    await rateLimit(request, "export");
    const job = await ownedJob(params.id, profile.id),
      report = fullCrawlReport(job);
    if (!report.pages.length)
      throw new PublicError("There are no completed pages to export yet.");
    const format = new URL(request.url).searchParams.get("format") || "pdf";
    if (!["pdf", "csv", "json"].includes(format))
      throw new PublicError("Unsupported export format.");
    const data =
      format === "pdf"
        ? await generatePDF(report)
        : Buffer.from(
            format === "csv"
              ? reportCSV(report)
              : JSON.stringify(
                  { ...report, aiPageReviews: job.aiReviews || {} },
                  null,
                  2,
                ),
          );
    let offset = 0;
    const stream = new ReadableStream({
      pull(controller) {
        if (offset >= data.length) {
          controller.close();
          return;
        }
        controller.enqueue(data.slice(offset, offset + 64000));
        offset += 64000;
      },
    });
    return new Response(stream, {
      headers: {
        "Content-Type":
          format === "pdf"
            ? "application/pdf"
            : format === "csv"
              ? "text/csv; charset=utf-8"
              : "application/json",
        "Content-Disposition": `attachment; filename="HaadinGlobal-site-audit-${job.id}.${format}"`,
        "Cache-Control": "no-store",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch (e) {
    return apiError(e);
  }
}
