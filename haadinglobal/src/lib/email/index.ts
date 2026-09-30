import "server-only";

/**
 * Transactional email via Resend's HTTP API (https://resend.com).
 * Optional: when RESEND_API_KEY / EMAIL_FROM / EMAIL_TO are not set, sending
 * is skipped and the lead is still saved in the database.
 */
export function isEmailConfigured(): boolean {
  return Boolean(process.env.RESEND_API_KEY && process.env.EMAIL_FROM && process.env.EMAIL_TO);
}

export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

type SendArgs = { subject: string; html: string; text: string; replyTo?: string };

export async function sendNotification({ subject, html, text, replyTo }: SendArgs): Promise<boolean> {
  if (!isEmailConfigured()) return false;
  const to = (process.env.EMAIL_TO ?? "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ from: process.env.EMAIL_FROM, to, subject, html, text, ...(replyTo ? { reply_to: replyTo } : {}) }),
      signal: AbortSignal.timeout(8000),
    });
    if (!response.ok) {
      console.error("[email] Resend responded", response.status, await response.text().catch(() => ""));
      return false;
    }
    return true;
  } catch (error) {
    console.error("[email] send failed:", error instanceof Error ? error.message : error);
    return false;
  }
}

/** Build a simple table-based notification from label/value pairs. */
export function renderLeadEmail(title: string, rows: Array<[string, string | undefined | null]>, adminUrl?: string) {
  const filled = rows.filter(([, v]) => v && String(v).trim() !== "") as Array<[string, string]>;
  const html = `<!doctype html><html><body style="font-family:Inter,Arial,sans-serif;background:#f8f9ff;padding:24px;color:#0d1c2d">
<div style="max-width:560px;margin:0 auto;background:#fff;border-radius:16px;padding:24px;border:1px solid #e5efff">
<p style="font-size:11px;letter-spacing:.12em;text-transform:uppercase;color:#0851d5;font-weight:700;margin:0 0 8px">HaadinGlobal · New enquiry</p>
<h1 style="font-size:20px;margin:0 0 16px">${escapeHtml(title)}</h1>
<table style="width:100%;border-collapse:collapse;font-size:14px">${filled
    .map(
      ([k, v]) =>
        `<tr><td style="padding:8px 0;color:#44474d;vertical-align:top;width:140px">${escapeHtml(k)}</td><td style="padding:8px 0;white-space:pre-wrap">${escapeHtml(v)}</td></tr>`,
    )
    .join("")}</table>
${adminUrl ? `<p style="margin-top:20px"><a href="${escapeHtml(adminUrl)}" style="background:#0851d5;color:#fff;padding:10px 16px;border-radius:8px;text-decoration:none;font-weight:600">Open in admin</a></p>` : ""}
</div></body></html>`;
  const text = `${title}\n\n${filled.map(([k, v]) => `${k}: ${v}`).join("\n")}${adminUrl ? `\n\n${adminUrl}` : ""}`;
  return { html, text };
}
