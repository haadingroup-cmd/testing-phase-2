import type { NextRequest } from "next/server";
import { contactSchema } from "@/lib/validation";
import { guardPost, json, tooFast } from "@/lib/security";
import { insertRow } from "@/lib/db";
import { fakeOk, firstIssue, handleWriteError } from "@/lib/api";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const guard = await guardPost(req, { key: "contact", limit: 3, windowMs: 10 * 60_000 });
  if (!guard.ok) return guard.res;

  const parsed = contactSchema.safeParse(guard.body);
  if (!parsed.success) return json({ ok: false, error: firstIssue(parsed.error) }, 422);
  const { website, startedAt, ...data } = parsed.data;
  if (website || tooFast(startedAt)) return fakeOk();

  try {
    await insertRow("contact_messages", data);
    return json({ ok: true });
  } catch (err) {
    return handleWriteError(err);
  }
}
