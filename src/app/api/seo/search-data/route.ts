import { auditStaff } from "@/lib/seo/job-auth";
import { assertSameOrigin, readJSON } from "@/lib/seo/input";
import { authorizedGoogleMetrics } from "@/lib/seo/google-data";
import { rateLimit } from "@/lib/seo/rate-limit";
import { apiError } from "@/lib/seo/http";
import { PublicError } from "@/lib/seo/security";
export const runtime = "nodejs";
export const maxDuration = 90;
export async function POST(request: Request) {
  try {
    assertSameOrigin(request);
    const p = await auditStaff();
    await rateLimit(request, "performance");
    const body = (await readJSON(request, 3000)) as { url?: unknown };
    if (typeof body.url !== "string")
      throw new PublicError("Choose a website.");
    return Response.json(await authorizedGoogleMetrics(body.url, p.id), {
      headers: { "Cache-Control": "no-store" },
    });
  } catch (e) {
    return apiError(e);
  }
}
