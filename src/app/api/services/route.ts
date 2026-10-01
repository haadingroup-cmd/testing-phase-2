import { getServices } from "@/lib/data";
import { ok } from "@/lib/security/request";

export const revalidate = 300;

/** GET /api/services — published services. */
export async function GET() {
  return ok(await getServices());
}
