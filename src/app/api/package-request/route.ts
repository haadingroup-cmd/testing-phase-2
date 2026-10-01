import { CALCULATOR, calculateEstimate, type HorizonId, type StageId } from "@/content/calculator";
import { getServices } from "@/lib/data";
import { hasDatabase } from "@/lib/db";
import { createLead } from "@/lib/leads";
import { rateLimit } from "@/lib/security/rate-limit";
import { PayloadError, clientIp, fail, isSameOrigin, ok, readJson, validationFailure } from "@/lib/security/request";
import { checkSpam } from "@/lib/security/spam";
import { formatPKR } from "@/lib/utils";
import { packageRequestSchema } from "@/lib/validations/package";

export const runtime = "nodejs";

/**
 * POST /api/package-request — saves a package-builder request as a lead.
 * The estimate is recomputed here from current service prices; the client's
 * numbers are never trusted.
 */
export async function POST(request: Request) {
  if (!isSameOrigin(request)) return fail("Cross-site requests are not allowed.", 403);
  const limit = await rateLimit("package", clientIp(request), 5, 600);
  if (!limit.allowed) return fail("Too many requests. Please try again later.", 429, undefined, { "Retry-After": String(limit.retryAfterSeconds) });

  let body: unknown;
  try {
    body = await readJson(request);
  } catch (error) {
    return error instanceof PayloadError ? fail(error.message, error.status) : fail("Invalid request.", 400);
  }

  const parsed = packageRequestSchema.safeParse(body);
  if (!parsed.success) return validationFailure(parsed.error);
  const input = parsed.data;
  if (checkSpam(input).spam) return ok({ id: "received", monthlyPkr: 0 }, 201);
  if (!hasDatabase) return fail("Package requests are temporarily unavailable. Please use WhatsApp.", 503);

  const catalogue = (await getServices()).filter((s) => s.inBuilder);
  const chosen = catalogue.filter((s) => input.services.includes(s.slug));
  if (chosen.length !== input.services.length) {
    return fail("One or more selected services are no longer available. Please refresh the page.", 422, { services: ["Unknown service selected"] });
  }

  const builderServices = chosen.map((s) => ({ slug: s.slug, label: s.builderLabel || s.title, icon: s.icon, price: s.price }));
  const estimate = calculateEstimate(builderServices, input.stage as StageId, input.horizon as HorizonId);
  const stage = CALCULATOR.stages.find((s) => s.id === input.stage)!;
  const horizon = CALCULATOR.horizons.find((h) => h.id === input.horizon)!;

  try {
    const lead = await createLead(
      {
        name: input.name,
        phone: input.phone,
        email: input.email,
        business: input.business,
        message: input.message,
        service: builderServices.map((s) => s.label).join(", "),
        budget: `${formatPKR(estimate.monthlyPkr)}/month (estimate)`,
        source: "PACKAGE_BUILDER",
        details: {
          services: builderServices.map(({ slug, label, price }) => ({ slug, label, price })),
          stage: { id: stage.id, label: stage.label, multiplier: stage.multiplier },
          horizon: { id: horizon.id, label: horizon.label, months: horizon.months },
          estimate,
        },
      },
      [
        ["Stage", `${stage.label} (${stage.multiplier}x)`],
        ["Horizon", horizon.label],
        ["Discount", `${Math.round(estimate.discountRate * 100)}%`],
        ["Total for horizon", formatPKR(estimate.totalPkr)],
      ],
    );
    return ok({ id: lead.id, monthlyPkr: estimate.monthlyPkr }, 201);
  } catch (error) {
    console.error("[api/package-request]", error instanceof Error ? error.message : error);
    return fail("We couldn't save your request. Please try again or contact us on WhatsApp.", 500);
  }
}
