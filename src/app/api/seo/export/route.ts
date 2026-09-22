import { z } from "zod";
import { assertSameOrigin, readJSON } from "@/lib/seo/input";
import { verifyReport } from "@/lib/seo/seal";
import { rateLimit } from "@/lib/seo/rate-limit";
import { generatePDF } from "@/lib/seo/pdf";
import { reportCSV } from "@/lib/seo/export";
import { apiError } from "@/lib/seo/http";
import { PublicError } from "@/lib/seo/security";
export const runtime = "nodejs";
export const maxDuration = 60;
const schema = z
  .object({
    signed: z.unknown(),
    format: z.enum(["pdf", "csv", "json"]),
    branding: z
      .object({
        clientName: z.string().max(100).optional(),
        agencyName: z.string().max(100).optional(),
      })
      .optional(),
  })
  .strict();
export async function POST(request: Request) {
  try {
    assertSameOrigin(request);
    const body = schema.safeParse(await readJSON(request, 2_000_000));
    if (!body.success)
      throw new PublicError("Check the report export options.");
    const report = verifyReport(body.data.signed);
    await rateLimit(request, "export");
    const format = body.data.format;
    const bytes =
      format === "pdf"
        ? Buffer.from(await generatePDF(report, body.data.branding))
        : format === "csv"
          ? reportCSV(report)
          : JSON.stringify(report, null, 2);
    return new Response(bytes, {
      headers: {
        "Content-Type":
          format === "pdf"
            ? "application/pdf"
            : format === "csv"
              ? "text/csv; charset=utf-8"
              : "application/json; charset=utf-8",
        "Content-Disposition": `attachment; filename="HaadinGlobal-SEO-Audit-${report.id.slice(0, 8)}.${format}"`,
        "Cache-Control": "no-store",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch (error) {
    return apiError(error);
  }
}
