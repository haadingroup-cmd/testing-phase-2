import { createLead } from "@/lib/leads";
import { hasDatabase } from "@/lib/db";
import { rateLimit } from "@/lib/security/rate-limit";
import { PayloadError, clientIp, fail, isSameOrigin, ok, readJson, validationFailure } from "@/lib/security/request";
import { checkSpam } from "@/lib/security/spam";
import { leadSchema } from "@/lib/validations/lead";

export const runtime = "nodejs";

/** POST /api/leads — contact & consultation forms. */
export async function POST(request: Request) {
  if (!isSameOrigin(request)) return fail("Cross-site requests are not allowed.", 403);

  const limit = await rateLimit("leads", clientIp(request), 5, 600);
  if (!limit.allowed) {
    return fail("Too many submissions. Please try again later or message us on WhatsApp.", 429, undefined, {
      "Retry-After": String(limit.retryAfterSeconds),
    });
  }

  let body: unknown;
  try {
    body = await readJson(request);
  } catch (error) {
    if (error instanceof PayloadError) return fail(error.message, error.status);
    return fail("Invalid request.", 400);
  }

  const parsed = leadSchema.safeParse(body);
  if (!parsed.success) return validationFailure(parsed.error);
  const input = parsed.data;

  // Spam: pretend success so bots don't learn, but store nothing.
  if (checkSpam(input).spam) return ok({ id: "received" }, 201);

  if (!hasDatabase) return fail("Our form is temporarily unavailable. Please contact us on WhatsApp.", 503);

  try {
    const lead = await createLead({
      name: input.name,
      phone: input.phone,
      email: input.email,
      business: "business" in input ? input.business : undefined,
      website: "website" in input ? input.website : undefined,
      service: input.service,
      budget: input.budget,
      message: input.message,
      source: input.source,
    });
    return ok({ id: lead.id }, 201);
  } catch (error) {
    console.error("[api/leads]", error instanceof Error ? error.message : error);
    return fail("We couldn't save your request. Please try again or contact us on WhatsApp.", 500);
  }
}
