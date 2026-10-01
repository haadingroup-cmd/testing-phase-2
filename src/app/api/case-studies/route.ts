import { getCaseStudies } from "@/lib/data";
import { ok } from "@/lib/security/request";

export const revalidate = 300;

/** GET /api/case-studies — published case studies. */
export async function GET() {
  return ok(await getCaseStudies());
}
