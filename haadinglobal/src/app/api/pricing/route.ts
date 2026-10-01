import { getPricingPlans } from "@/lib/data";
import { ok } from "@/lib/security/request";

export const revalidate = 300;

/** GET /api/pricing — published pricing plans. */
export async function GET() {
  return ok(await getPricingPlans());
}
