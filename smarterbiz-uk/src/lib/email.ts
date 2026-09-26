import "server-only";
import { SITE, absoluteUrl } from "./site";
import { oneClickUrl, unsubscribeUrl } from "./tokens";
import { topTools } from "@/data/tools";
import { featuredGuide } from "@/data/guides";

/** Transactional email via Resend's REST API. Optional: does nothing unless configured. */
export const emailConfigured = () => Boolean(process.env.RESEND_API_KEY && process.env.EMAIL_FROM);

const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

async function send(payload: Record<string, unknown>): Promise<boolean> {
  if (!emailConfigured()) return false;
  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({ from: process.env.EMAIL_FROM, ...payload }),
      cache: "no-store",
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) console.error(`[email] send failed with status ${res.status}`);
    return res.ok;
  } catch {
    console.error("[email] send failed (network)");
    return false;
  }
}

export async function sendWelcomeEmail(email: string): Promise<boolean> {
  const unsub = unsubscribeUrl(email);
  const oneClick = oneClickUrl(email);
  // Never send marketing email without a working unsubscribe link (PECR).
  if (!unsub || !oneClick) return false;

  const guide = featuredGuide();
  const tools = topTools(3);
  const guideUrl = absoluteUrl(`/guides/${guide.slug}`);

  const html = `<!doctype html><html lang="en-GB"><body style="margin:0;background:#f7f9fb;font-family:Arial,Helvetica,sans-serif;color:#191c1e">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr><td align="center" style="padding:32px 16px">
<table role="presentation" width="560" cellpadding="0" cellspacing="0" style="max-width:560px;background:#ffffff;border:1px solid #E2E8F0;border-radius:8px">
<tr><td style="padding:28px 28px 8px"><p style="margin:0;font-family:Georgia,serif;font-size:22px;font-weight:bold;color:#0F172A">SmarterBiz<span style="color:#2563EB">.uk</span></p></td></tr>
<tr><td style="padding:8px 28px"><h1 style="font-family:Georgia,serif;font-size:24px;line-height:30px;color:#0F172A;margin:12px 0">Cheers — you're on the list.</h1>
<p style="font-size:15px;line-height:24px;color:#45464d">Every Thursday you'll get three tested AI tools, one time-saving workflow and the UK regulatory updates (HMRC, ICO) that matter to small businesses.</p>
<p style="font-size:15px;line-height:24px;color:#45464d">Start with our flagship guide: <a href="${esc(guideUrl)}" style="color:#2563EB">${esc(guide.title)}</a>.</p>
<p style="font-size:13px;font-weight:bold;letter-spacing:.04em;text-transform:uppercase;color:#0F172A;margin-top:24px">Top rated right now</p>
<ul style="padding-left:18px;font-size:15px;line-height:24px;color:#45464d">${tools
    .map((t) => `<li><a href="${esc(absoluteUrl(`/tools/${t.slug}`))}" style="color:#2563EB">${esc(t.name)}</a> — ${t.score.toFixed(1)}/10, ${esc(t.bestFor.toLowerCase())}</li>`)
    .join("")}</ul></td></tr>
<tr><td style="padding:20px 28px 28px;border-top:1px solid #E2E8F0;font-size:12px;line-height:18px;color:#64748B">
You're receiving this because you subscribed at ${esc(SITE.url.replace(/^https?:\/\//, ""))}. <a href="${esc(unsub)}" style="color:#64748B">Unsubscribe</a> at any time.
</td></tr></table></td></tr></table></body></html>`;

  const text = `Cheers — you're on the list.

Every Thursday: three tested AI tools, one time-saving workflow and UK regulatory updates.

Start here: ${guide.title}
${guideUrl}

Unsubscribe: ${unsub}`;

  return send({
    to: [email],
    subject: "Welcome to the SmarterBiz Thursday Briefing",
    html,
    text,
    headers: { "List-Unsubscribe": `<${oneClick}>`, "List-Unsubscribe-Post": "List-Unsubscribe=One-Click" },
  });
}
