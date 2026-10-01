import { supabaseServer } from "@/lib/supabase-server";
import { redirect } from "next/navigation";

export type Role = "admin" | "manager" | "member";
export type Level = "Junior" | "Mid" | "Senior" | "Lead";

export interface Profile {
  id: string;
  full_name: string;
  role: Role;
  title: string;
  bio: string;
  photo_url: string;
  email: string;
  linkedin: string;
  skills: string[];
  level: Level;
  stars: number;
  is_public: boolean;
  sort_order: number;
}

/**
 * Returns the signed-in user's profile (with role) or null.
 * Used by every dashboard page to decide what to show.
 */
export async function getCurrentProfile(): Promise<Profile | null> {
  const supabase = supabaseServer();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  return (data as Profile) ?? null;
}

/** Require a signed-in profile or redirect to /login. */
export async function requireProfile(): Promise<Profile> {
  const profile = await getCurrentProfile();
  if (!profile) redirect("/login");
  return profile;
}

/** Require admin or manager, else redirect to the member dashboard. */
export async function requireStaff(): Promise<Profile> {
  const profile = await requireProfile();
  if (profile.role !== "admin" && profile.role !== "manager") redirect("/dashboard");
  return profile;
}

/** Require admin only. */
export async function requireAdmin(): Promise<Profile> {
  const profile = await requireProfile();
  if (profile.role !== "admin") redirect("/dashboard");
  return profile;
}
