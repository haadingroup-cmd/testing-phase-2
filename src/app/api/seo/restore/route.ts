import { assertSameOrigin, readJSON } from "@/lib/seo/input";
import { verifyReport } from "@/lib/seo/seal";
import { apiError } from "@/lib/seo/http";
export const runtime = "nodejs";
export async function POST(request: Request) {
  try {
    assertSameOrigin(request);
    const signed = await readJSON(request, 2_000_000);
    verifyReport(signed);
    return Response.json({ signed }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) { return apiError(error); }
}
