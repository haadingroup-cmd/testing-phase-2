"use server";
import { revalidatePath } from "next/cache";
import { getCurrentProfile } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase-server";

type Result = { ok: boolean; error?: string };
const BUCKET = "profile-media";

/**
 * A member edits their OWN profile. Only safe display fields are written —
 * role, level, stars and is_public are NEVER touched here, so a member can
 * never escalate their own permissions.
 */
export async function updateMyProfile(formData: FormData): Promise<Result> {
  const me = await getCurrentProfile();
  if (!me) return { ok: false, error: "Not signed in." };

  const title = String(formData.get("title") || "").trim().slice(0, 120);
  const bio = String(formData.get("bio") || "").trim().slice(0, 2000);
  const linkedin = String(formData.get("linkedin") || "").trim().slice(0, 300);
  const website = String(formData.get("website") || "").trim().slice(0, 300);
  const skills = String(formData.get("skills") || "")
    .split(",").map((s) => s.trim()).filter(Boolean).slice(0, 20);

  const update: Record<string, unknown> = { title, bio, linkedin, website, skills };

  const photo = formData.get("photo") as File | null;
  if (photo && typeof photo === "object" && photo.size > 0) {
    if (photo.size > 5 * 1024 * 1024) return { ok: false, error: "Photo must be under 5 MB." };
    const ext = (photo.name.split(".").pop() || "jpg").toLowerCase().replace(/[^a-z0-9]/g, "") || "jpg";
    const path = `${me.id}/photo-${Date.now()}.${ext}`;
    const buf = Buffer.from(await photo.arrayBuffer());
    const admin = supabaseAdmin();
    const up = await admin.storage.from(BUCKET).upload(path, buf, {
      contentType: photo.type || "image/jpeg",
      upsert: true,
    });
    if (up.error) return { ok: false, error: "Photo upload failed." };
    update.photo_url = admin.storage.from(BUCKET).getPublicUrl(path).data.publicUrl;
  }

  const admin = supabaseAdmin();
  const { error } = await admin.from("profiles").update(update).eq("id", me.id);
  if (error) return { ok: false, error: error.message };

  revalidatePath("/dashboard/profile");
  revalidatePath("/team");
  revalidatePath(`/team/${me.id}`);
  return { ok: true };
}
