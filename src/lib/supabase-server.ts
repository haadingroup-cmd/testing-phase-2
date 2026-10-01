import "server-only";
import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";

const URL = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const ANON = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

/** Server client — reads the logged-in session from cookies. */
export function supabaseServer() {
  const cookieStore = cookies();
  return createServerClient(URL, ANON, {
    cookies: {
      get(name: string) {
        return cookieStore.get(name)?.value;
      },
      set(name: string, value: string, options: CookieOptions) {
        try { cookieStore.set({ name, value, ...options }); } catch { /* read-only in RSC */ }
      },
      remove(name: string, options: CookieOptions) {
        try { cookieStore.set({ name, value: "", ...options }); } catch { /* read-only in RSC */ }
      },
    },
  });
}

/**
 * Admin client — bypasses Row Level Security. SERVER ONLY.
 * Throws if the secret key is missing so we fail loudly, never silently.
 */
export function supabaseAdmin() {
  const SERVICE = process.env.SUPABASE_SERVICE_ROLE_KEY || "";
  if (!URL || !SERVICE) {
    throw new Error("Supabase admin not configured: set SUPABASE_SERVICE_ROLE_KEY.");
  }
  return createClient(URL, SERVICE, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}
