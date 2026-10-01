import { analyzeWebsite } from "@/lib/audit/analyze";
import { FetchBlockedError } from "@/lib/audit/safe-fetch";
import { getDb, hasDatabase } from "@/lib/db";
import { createLead } from "@/lib/leads";
import { rateLimit } from "@/lib/security/rate-limit";
import { PayloadError, clientIp, fail, isSameOrigin, ok, readJson, validationFailure } from "@/lib/security/request";
import { checkSpam } from "@/lib/security/spam";
import { AUDIT_SECTORS, auditRequestSchema } from "@/lib/validations/audit";
import type { Prisma } from "@/generated/prisma/client";

export const runtime = "nodejs";
// Fetching the site (and optional PageSpeed) can take a while on Vercel.
export const maxDuration = 60;

/** POST /api/audit — runs a real single-page audit and stores the report. */
export async function POST(request: Request) {
  if (!isSameOrigin(request)) return fail("Cross-site requests are not allowed.", 403);
  if (!hasDatabase) return fail("The audit tool is temporarily unavailable. Please try again later.", 503);

  const ip = clientIp(request);
  const limit = await rateLimit("audit", ip, 6, 3600);
  if (!limit.allowed) {
    return fail("You've run several audits recently. Please try again in a little while.", 429, undefined, { "Retry-After": String(limit.retryAfterSeconds) });
  }

  let body: unknown;
  try {
    body = await readJson(request, 8_000);
  } catch (error) {
    return error instanceof PayloadError ? fail(error.message, error.status) : fail("Invalid request.", 400);
  }

  const parsed = auditRequestSchema.safeParse(body);
  if (!parsed.success) return validationFailure(parsed.error);
  const input = parsed.data;
  if (checkSpam(input).spam) return fail("Please wait a moment and try again.", 429);

  const db = getDb();
  const audit = await db.auditRequest.create({
    data: { url: input.url, phone: input.phone ?? null, email: input.email ?? null, sector: input.sector ?? null },
  });

  try {
    const report = await analyzeWebsite(input.url);
    let leadId: string | null = null;
    if (input.phone) {
      const sector = AUDIT_SECTORS.find((s) => s.value === input.sector)?.label;
      const lead = await createLead(
        {
          name: new URL(report.finalUrl).hostname,
          phone: input.phone,
          email: input.email,
          website: report.finalUrl,
          business: sector,
          service: "Website audit",
          message: `Ran the free website audit — overall score ${report.score}/100.`,
          source: "AUDIT",
          details: { auditId: audit.id, score: report.score },
        },
        [["Audit score", `${report.score}/100`]],
      );
      leadId = lead.id;
    }
    await db.auditRequest.update({
      where: { id: audit.id },
      data: {
        status: "COMPLETED",
        finalUrl: report.finalUrl,
        score: report.score,
        report: report as unknown as Prisma.InputJsonValue,
        leadId,
      },
    });
    return ok({ id: audit.id, score: report.score }, 201);
  } catch (error) {
    const message =
      error instanceof FetchBlockedError
        ? error.message
        : error instanceof Error && /HTTP \d+|HTML page|redirects|too long|ENOTFOUND|EAI_AGAIN|ECONNREFUSED|certificate|ECONNRESET/i.test(error.message)
          ? friendlyFetchError(error.message)
          : "We couldn't analyse that website. Check the address and try again.";
    await db.auditRequest.update({ where: { id: audit.id }, data: { status: "FAILED", error: error instanceof Error ? error.message.slice(0, 500) : "Unknown error" } });
    return fail(message, 422, { url: [message] });
  }
}

function friendlyFetchError(raw: string): string {
  if (/ENOTFOUND|EAI_AGAIN/i.test(raw)) return "That domain doesn't seem to exist. Check the spelling and try again.";
  if (/ECONNREFUSED|ECONNRESET/i.test(raw)) return "The website refused the connection.";
  if (/certificate/i.test(raw)) return "The website's SSL certificate is invalid — that's an issue worth fixing first.";
  return raw;
}
