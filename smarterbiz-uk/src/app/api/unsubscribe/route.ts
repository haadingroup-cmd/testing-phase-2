import type { NextRequest } from "next/server";
import { z } from "zod";
import { clientIp, guardPost, json, rateLimit } from "@/lib/security";
import { updateRows } from "@/lib/db";
import { tokensConfigured, verifyUnsubscribeToken } from "@/lib/tokens";
import { handleWriteError } from "@/lib/api";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const input = z.object({
  email: z.string().trim().toLowerCase().max(254).email(),
  token: z.string().trim().min(20).max(100),
});

async function unsubscribe(email: string, token: string) {
  if (!tokensConfigured()) return json({ ok: false, error: "Unsubscribe is temporarily unavailable. Please email us." }, 503);
  if (!verifyUnsubscribeToken(email, token)) return json({ ok: false, error: "This unsubscribe link is invalid." }, 400);
  try {
    await updateRows("subscribers", { email: `eq.${email}`, unsubscribed_at: "is.null" }, { unsubscribed_at: new Date().toISOString() });
    return json({ ok: true });
  } catch (err) {
    return handleWriteError(err);
  }
}

export async function POST(req: NextRequest) {
  const qe = req.nextUrl.searchParams.get("e");
  const qt = req.nextUrl.searchParams.get("t");

  // RFC 8058 one-click: mail providers POST "List-Unsubscribe=One-Click" to the URL from the email header.
  // The signed token is the credential, so no same-origin check applies here.
  if (qe && qt) {
    const rl = rateLimit(`unsub:${clientIp(req)}`, 20, 60_000);
    if (!rl.ok) return json({ ok: false, error: "Too many requests." }, 429, { "Retry-After": String(rl.retryAfter) });
    const parsed = input.safeParse({ email: qe, token: qt });
    if (!parsed.success) return json({ ok: false, error: "This unsubscribe link is invalid." }, 400);
    return unsubscribe(parsed.data.email, parsed.data.token);
  }

  // Confirmation button on /unsubscribe (JSON, same-origin).
  const guard = await guardPost(req, { key: "unsub-page", limit: 10, windowMs: 10 * 60_000 });
  if (!guard.ok) return guard.res;
  const parsed = input.safeParse(guard.body);
  if (!parsed.success) return json({ ok: false, error: "This unsubscribe link is invalid." }, 400);
  return unsubscribe(parsed.data.email, parsed.data.token);
}
