"use server";
import { revalidatePath } from "next/cache";
import { supabaseAdmin } from "@/lib/supabase-server";
import { getCurrentProfile } from "@/lib/auth";

export async function reviewProject(id: string, status: "approved" | "rejected") {
  const me = await getCurrentProfile();
  if (!me || (me.role !== "admin" && me.role !== "manager")) {
    return { ok: false, error: "Not authorized." };
  }
  if (!["approved", "rejected"].includes(status)) {
    return { ok: false, error: "Invalid status." };
  }

  const admin = supabaseAdmin();
  const { error } = await admin.from("projects").update({ status }).eq("id", id);
  if (error) return { ok: false, error: error.message };

  revalidatePath("/dashboard/projects");
  return { ok: true };
}
