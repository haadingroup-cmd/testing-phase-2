/**
 * Lead capture into the Supabase CRM, without shipping supabase-js on every page.
 *
 * The lead forms (entry popup, contact, consultation, landing, lead magnet)
 * only touch Supabase on submit, but importing "@/lib/supabase" statically put
 * the whole client (~195 KB) in the bundle of every page. This module has no
 * static Supabase import; the client is fetched on demand at submit time.
 */
export const SUPABASE_READY = Boolean(
  process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export async function insertLead(row: Record<string, string>) {
  const { supabaseBrowser } = await import("@/lib/supabase");
  return supabaseBrowser().from("leads").insert(row);
}
