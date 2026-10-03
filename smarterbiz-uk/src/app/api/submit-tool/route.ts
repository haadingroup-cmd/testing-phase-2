import type { NextRequest } from "next/server";
import { submitToolSchema } from "@/lib/validation";
import { guardPost, json, tooFast } from "@/lib/security";
import { insertRow } from "@/lib/db";
import { fakeOk, firstIssue, handleWriteError } from "@/lib/api";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const guard = await guardPost(req, { key: "submit-tool", limit: 3, windowMs: 30 * 60_000 });
  if (!guard.ok) return guard.res;

  const parsed = submitToolSchema.safeParse(guard.body);
  if (!parsed.success) return json({ ok: false, error: firstIssue(parsed.error) }, 422);
  const { website, startedAt, toolName, toolUrl, contactName, ukPricing, ...rest } = parsed.data;
  if (website || tooFast(startedAt)) return fakeOk();

  try {
    await insertRow("tool_submissions", {
      tool_name: toolName,
      tool_url: toolUrl,
      contact_name: contactName,
      uk_pricing: ukPricing,
      ...rest,
    });
    return json({ ok: true });
  } catch (err) {
    return handleWriteError(err);
  }
}
