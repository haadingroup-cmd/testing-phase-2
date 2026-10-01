"use server";

import { supabaseServer } from "@/lib/supabase-server";
import { requireProfile } from "@/lib/auth";
import { revalidatePath } from "next/cache";

/** Move a lead to a new pipeline status. */
export async function updateLeadStatus(id: string, status: string) {
  await requireProfile(); // must be signed in; RLS enforces who can update
  const supabase = supabaseServer();
  const { error } = await supabase
    .from("leads")
    .update({ status, updated_at: new Date().toISOString() })
    .eq("id", id);
  if (error) return { ok: false, error: error.message };
  revalidatePath("/dashboard/leads");
  return { ok: true };
}

/** Save notes / estimated value on a lead. */
export async function updateLeadDetails(id: string, notes: string, value: number) {
  await requireProfile();
  const supabase = supabaseServer();
  const { error } = await supabase
    .from("leads")
    .update({ notes, value, updated_at: new Date().toISOString() })
    .eq("id", id);
  if (error) return { ok: false, error: error.message };
  revalidatePath("/dashboard/leads");
  return { ok: true };
}

/** Manually add a lead (e.g. one that came via a phone call). */
export async function addLead(form: {
  name: string; phone: string; email: string; service: string; message: string; source: string;
}) {
  await requireProfile();
  const supabase = supabaseServer();
  const { error } = await supabase.from("leads").insert({
    name: form.name, phone: form.phone, email: form.email,
    service: form.service, message: form.message, source: form.source || "manual",
    status: "new",
  });
  if (error) return { ok: false, error: error.message };
  revalidatePath("/dashboard/leads");
  return { ok: true };
}

/** Delete a lead (admin only — enforced by RLS). */
export async function deleteLead(id: string) {
  await requireProfile();
  const supabase = supabaseServer();
  const { error } = await supabase.from("leads").delete().eq("id", id);
  if (error) return { ok: false, error: error.message };
  revalidatePath("/dashboard/leads");
  return { ok: true };
}
