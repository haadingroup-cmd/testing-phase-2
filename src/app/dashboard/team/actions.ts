"use server";
import { revalidatePath } from "next/cache";
import { supabaseAdmin } from "@/lib/supabase-server";
import { getCurrentProfile } from "@/lib/auth";
import { getMember } from "@/data/team";

/**
 * Server actions for the team-management dashboard.
 *
 * Security: every action re-checks the caller's role on the server before
 * doing anything. Creating/removing accounts requires ADMIN. Managers may
 * update level/stars/details but cannot create/delete accounts or change roles.
 */

type ActionResult = { ok: boolean; error?: string };

async function guard(requireAdmin: boolean): Promise<ActionResult & { role?: string }> {
  const me = await getCurrentProfile();
  if (!me) return { ok: false, error: "Not signed in." };
  if (me.role !== "admin" && me.role !== "manager") return { ok: false, error: "Not authorized." };
  if (requireAdmin && me.role !== "admin") return { ok: false, error: "Admin only." };
  return { ok: true, role: me.role };
}

/** ADMIN: create a login account + profile. */
export async function createMember(formData: FormData): Promise<ActionResult> {
  const g = await guard(true);
  if (!g.ok) return g;

  const email = String(formData.get("email") || "").trim().toLowerCase();
  const password = String(formData.get("password") || "");
  const full_name = String(formData.get("full_name") || "").trim();
  const title = String(formData.get("title") || "").trim();
  const role = String(formData.get("role") || "member");
  const level = String(formData.get("level") || "Junior");

  if (!email || !password) return { ok: false, error: "Email and password are required." };
  if (password.length < 8) return { ok: false, error: "Password must be at least 8 characters." };
  if (!["admin", "manager", "member"].includes(role)) return { ok: false, error: "Invalid role." };

  const admin = supabaseAdmin();

  // Create the auth user (email confirmed so they can log in immediately).
  const { data: created, error: authErr } = await admin.auth.admin.createUser({
    email, password, email_confirm: true,
  });
  if (authErr || !created.user) {
    return { ok: false, error: authErr?.message || "Could not create account." };
  }

  // Create their profile row.
  const { error: profErr } = await admin.from("profiles").insert({
    id: created.user.id, email, full_name, title, role, level,
  });
  if (profErr) {
    // Roll back the auth user so we don't leave an orphan.
    await admin.auth.admin.deleteUser(created.user.id);
    return { ok: false, error: profErr.message };
  }

  revalidatePath("/dashboard/team");
  revalidatePath("/team");
  return { ok: true };
}

/** ADMIN: permanently remove a member (auth user + profile + files cascade). */
export async function removeMember(userId: string): Promise<ActionResult> {
  const g = await guard(true);
  if (!g.ok) return g;

  const me = await getCurrentProfile();
  if (me?.id === userId) return { ok: false, error: "You cannot remove your own account." };

  const admin = supabaseAdmin();
  const { error } = await admin.auth.admin.deleteUser(userId); // profile cascades
  if (error) return { ok: false, error: error.message };

  revalidatePath("/dashboard/team");
  revalidatePath("/team");
  return { ok: true };
}

/** ADMIN: change a member's role. */
export async function setRole(userId: string, role: string): Promise<ActionResult> {
  const g = await guard(true);
  if (!g.ok) return g;
  if (!["admin", "manager", "member"].includes(role)) return { ok: false, error: "Invalid role." };

  const admin = supabaseAdmin();
  const { error } = await admin.from("profiles").update({ role }).eq("id", userId);
  if (error) return { ok: false, error: error.message };
  revalidatePath("/dashboard/team");
  return { ok: true };
}

/** STAFF: set level (Junior/Mid/Senior/Lead). */
export async function setLevel(userId: string, level: string): Promise<ActionResult> {
  const g = await guard(false);
  if (!g.ok) return g;
  if (!["Junior", "Mid", "Senior", "Lead"].includes(level)) return { ok: false, error: "Invalid level." };

  const admin = supabaseAdmin();
  const { error } = await admin.from("profiles").update({ level }).eq("id", userId);
  if (error) return { ok: false, error: error.message };
  revalidatePath("/dashboard/team");
  revalidatePath("/team");
  return { ok: true };
}

/** STAFF: set star rating 0–5. */
export async function setStars(userId: string, stars: number): Promise<ActionResult> {
  const g = await guard(false);
  if (!g.ok) return g;
  const s = Math.max(0, Math.min(5, Math.round(stars)));

  const admin = supabaseAdmin();
  const { error } = await admin.from("profiles").update({ stars: s }).eq("id", userId);
  if (error) return { ok: false, error: error.message };
  revalidatePath("/dashboard/team");
  revalidatePath("/team");
  return { ok: true };
}

/** STAFF: toggle whether a member shows on the public /team page. */
export async function setPublic(userId: string, isPublic: boolean): Promise<ActionResult> {
  const g = await guard(false);
  if (!g.ok) return g;

  const admin = supabaseAdmin();
  const { error } = await admin.from("profiles").update({ is_public: isPublic }).eq("id", userId);
  if (error) return { ok: false, error: error.message };
  revalidatePath("/dashboard/team");
  revalidatePath("/team");
  return { ok: true };
}

/**
 * ADMIN: one-click import of the original static roster into real, editable
 * accounts. Each member gets the login firstname@haadinglobal.com with a
 * temporary password. Skips anyone who already exists.
 */
const IMPORT_SLUGS = ["malaika-farooq", "arooba-shafique", "nafia-aziz", "rohab-abdullah"];
const IMPORT_TEMP_PASSWORD = "Haadin@2026";

export async function importStaticTeam(): Promise<ActionResult & { created?: string[]; skipped?: string[] }> {
  try {
    const g = await guard(true);
    if (!g.ok) return g;

    const admin = supabaseAdmin();
    const created: string[] = [];
    const existed: string[] = [];
    const failed: string[] = [];

    for (const slug of IMPORT_SLUGS) {
      try {
        const m = getMember(slug);
        if (!m) { failed.push(`${slug} (not in roster)`); continue; }

        const email = `${slug.split("-")[0]}@haadinglobal.com`;

        const { data: byEmail } = await admin.from("profiles").select("id").eq("email", email).limit(1).maybeSingle();
        const { data: byName } = await admin.from("profiles").select("id").ilike("full_name", m.full_name).limit(1).maybeSingle();
        if (byEmail || byName) { existed.push(m.full_name); continue; }

        const { data: createdUser, error: authErr } = await admin.auth.admin.createUser({
          email, password: IMPORT_TEMP_PASSWORD, email_confirm: true,
        });
        if (authErr || !createdUser?.user) { failed.push(`${m.full_name}: ${authErr?.message || "account creation failed"}`); continue; }

        const { error: profErr } = await admin.from("profiles").insert({
          id: createdUser.user.id, email, full_name: m.full_name, title: m.title,
          bio: m.bio, photo_url: m.photo_url, skills: m.skills, level: m.level,
          stars: m.stars, role: "member", is_public: true,
        });
        if (profErr) {
          await admin.auth.admin.deleteUser(createdUser.user.id).catch(() => {});
          failed.push(`${m.full_name}: ${profErr.message}`);
          continue;
        }
        created.push(m.full_name);
      } catch (e) {
        failed.push(`${slug}: ${e instanceof Error ? e.message : "unexpected error"}`);
      }
    }

    revalidatePath("/dashboard/team");
    revalidatePath("/team");

    if (created.length === 0 && failed.length > 0) {
      return { ok: false, error: "Import failed for: " + failed.join(" | "), created, skipped: [...existed, ...failed] };
    }
    return { ok: true, created, skipped: [...existed, ...failed] };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Import failed unexpectedly." };
  }
}
