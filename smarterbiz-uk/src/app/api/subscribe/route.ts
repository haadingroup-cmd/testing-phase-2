import type { NextRequest } from "next/server";
import { subscribeSchema } from "@/lib/validation";
import { guardPost, json, tooFast } from "@/lib/security";
import { insertRow } from "@/lib/db";
import { fakeOk, firstIssue, handleWriteError } from "@/lib/api";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const guard = await guardPost(req, { key: "subscribe", limit: 5, windowMs: 10 * 60_000 });
  if (!guard.ok) return guard.res;

  const parsed = subscribeSchema.safeParse(guard.body);
  if (!parsed.success) return json({ ok: false, error: firstIssue(parsed.error) }, 422);
  if (parsed.data.website || tooFast(parsed.data.startedAt)) return fakeOk();

  try {
    await insertRow(
      "subscribers",
      { email: parsed.data.email, source: parsed.data.source, consent_text: "Weekly SmarterBiz briefing — unsubscribe anytime." },
      { ignoreDuplicatesOn: "email" },
    );
    return json({ ok: true });
  } catch (err) {
    return handleWriteError(err);
  }
}
