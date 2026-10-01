import { getCurrentProfile } from "@/lib/auth";
import { PublicError } from "./security";
export async function auditStaff() {
  const profile = await getCurrentProfile();
  if (!profile) throw new PublicError("Sign in to your agency account.", 401);
  if (!["admin", "manager"].includes(profile.role))
    throw new PublicError(
      "Full-site audits require an agency admin or manager account.",
      403,
    );
  return profile;
}
