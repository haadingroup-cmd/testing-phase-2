import { after, type NextRequest } from "next/server";
import { subscribeSchema } from "@/lib/validation";
import { guardPost, json, tooFast } from "@/lib/security";
import { insertRow, updateRows } from "@/lib/db";
import { sendWelcomeEmail } from "@/lib/email";
import { fakeOk, firstIssue, handleWriteError } from "@/lib/api";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const guard = await guardPost(req, { key: "subscribe", limit: 5, windowMs: 10 * 60_000 });
  if (!guard.ok) return guard.res;

  const parsed = subscribeSchema.safeParse(guard.body);
  if (!parsed.success) return json({ ok: false, error: firstIssue(parsed.error) }, 422);
  if (parsed.data.website || tooFast(parsed.data.startedAt)) return fakeOk();

  const { email, source } = parsed.data;
  try {
    let isNew = await insertRow(
      "subscribers",
      { email, source, consent_text: "Weekly SmarterBiz briefing — unsubscribe anytime." },
      { ignoreDuplicatesOn: "email" },
    );
    if (!isNew) {
      // Existing address: re-activate only if it had unsubscribed. Active subscribers get no second email,
      // so the form can't be used to bombard someone's inbox.
      isNew = (await updateRows("subscribers", { email: `eq.${email}`, unsubscribed_at: "not.is.null" }, { unsubscribed_at: null, source })) > 0;
    }
    // Same response either way, so the endpoint doesn't reveal who is subscribed.
    if (isNew) after(() => sendWelcomeEmail(email));
    return json({ ok: true });
  } catch (err) {
    return handleWriteError(err);
  }
}
