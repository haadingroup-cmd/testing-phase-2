import { z } from "zod";
import { assertSameOrigin, readJSON } from "@/lib/seo/input";
import { signReport, verifyReport } from "@/lib/seo/seal";
import { rateLimit } from "@/lib/seo/rate-limit";
import { generateAI } from "@/lib/seo/ai";
import { apiError } from "@/lib/seo/http";
import { PublicError } from "@/lib/seo/security";
export const runtime = "nodejs";
export const maxDuration = 60;
const schema = z
  .object({
    signed: z.unknown(),
    task: z.enum(["summary", "fix", "meta", "content"]),
    issueId: z.string().max(3000).optional(),
    fields: z
      .object({
        topic: z.string().max(400).optional(),
        keyword: z.string().max(400).optional(),
        businessName: z.string().max(400).optional(),
        location: z.string().max(400).optional(),
        pageType: z.string().max(400).optional(),
      })
      .strict()
      .optional(),
  })
  .strict();
export async function POST(request: Request) {
  try {
    assertSameOrigin(request);
    const result = schema.safeParse(await readJSON(request, 2_000_000));
    if (!result.success) throw new PublicError("Check the AI request fields.");
    const report = verifyReport(result.data.signed);
    await rateLimit(request, "ai");
    const guidance = await generateAI(
      report,
      result.data.task,
      result.data.issueId,
      result.data.fields,
    );
    return Response.json(
      {
        guidance,
        ...(result.data.task === "summary"
          ? {
              signed: signReport({
                ...report,
                ai: guidance,
                aiStatus: guidance.source,
              }),
            }
          : {}),
      },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch (error) {
    return apiError(error);
  }
}
