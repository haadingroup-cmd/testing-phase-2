import { z } from "zod";
import { normalizeURL, PublicError } from "./security";
const short = z.string().trim().max(160).optional();
export const auditInputSchema = z
  .object({
    url: z.string().trim().min(3).max(2048),
    businessName: short,
    businessType: short,
    country: short,
    city: short,
    language: short,
    keyword: z.string().trim().max(240).optional(),
    competitors: z.array(z.string().max(2048)).max(3).default([]),
    social: z
      .object({
        facebook: short,
        instagram: short,
        youtube: short,
        tiktok: short,
        linkedin: short,
      })
      .default({}),
  })
  .strict();
export async function readJSON(
  request: Request,
  max = 800_000,
): Promise<unknown> {
  if (!request.headers.get("content-type")?.includes("application/json"))
    throw new PublicError("This endpoint accepts JSON requests.", 415);
  const reader = request.body?.getReader();
  if (!reader) throw new PublicError("The request is empty.");
  const chunks: Uint8Array[] = [];
  let bytes = 0;
  while (true) {
    const { value, done } = await reader.read();
    if (done) break;
    bytes += value.byteLength;
    if (bytes > max) {
      await reader.cancel();
      throw new PublicError("The request is too large.", 413);
    }
    chunks.push(value);
  }
  try {
    return JSON.parse(Buffer.concat(chunks).toString("utf8"));
  } catch {
    throw new PublicError("The request contains invalid JSON.");
  }
}
export function parseAuditInput(value: unknown) {
  const parsed = auditInputSchema.safeParse(value);
  if (!parsed.success)
    throw new PublicError(
      "Check your website URL and optional fields. Add no more than three competitors.",
    );
  return {
    ...parsed.data,
    url: normalizeURL(parsed.data.url).href,
    competitors: [
      ...new Set(
        parsed.data.competitors
          .filter(Boolean)
          .map((x) => normalizeURL(x).href),
      ),
    ],
  };
}
export function assertSameOrigin(request: Request) {
  const origin = request.headers.get("origin");
  const expected =
    process.env.NEXT_PUBLIC_APP_URL || new URL(request.url).origin;
  if (origin && origin !== new URL(expected).origin)
    throw new PublicError(
      "This request must come from the analyzer website.",
      403,
    );
  if (request.headers.get("sec-fetch-site") === "cross-site")
    throw new PublicError("Cross-site requests are not accepted.", 403);
}
