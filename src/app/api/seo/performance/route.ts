import { assertSameOrigin, readJSON } from "@/lib/seo/input";
import { signReport, verifyReport } from "@/lib/seo/seal";
import { rateLimit } from "@/lib/seo/rate-limit";
import { PageSpeedProvider } from "@/lib/seo/providers";
import { apiError } from "@/lib/seo/http";
export const runtime = "nodejs";
export const maxDuration = 90;
export async function POST(request: Request) {
  try {
    assertSameOrigin(request);
    const body = await readJSON(request, 2_000_000);
    const report = verifyReport(body);
    await rateLimit(request, "performance");
    const metrics = await new PageSpeedProvider().getMetrics(
      report.pages[0].url,
    );
    return Response.json(
      {
        metrics,
        signed: signReport({
          ...report,
          metrics: [
            ...report.metrics.filter(
              (m) => !metrics.some((n) => n.key === m.key),
            ),
            ...metrics,
          ],
        }),
      },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch (error) {
    return apiError(error);
  }
}
