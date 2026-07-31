/**
 * Supabase CLIENT-SAFE factory (browser only).
 *
 * env vars (set in Vercel → Settings → Environment Variables):
 *   NEXT_PUBLIC_SUPABASE_URL
 *   NEXT_PUBLIC_SUPABASE_ANON_KEY   (Publishable / anon — browser-safe)
 *
 * Server-only clients live in "@/lib/supabase-server" so that client
 * components never accidentally import next/headers or the service key.
 */
import { createBrowserClient } from "@supabase/ssr";

const URL = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const ANON = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

/** True when the public env vars are present (used to soft-disable auth UI). */
export const SUPABASE_READY = Boolean(URL && ANON);

/** Browser client — safe in "use client" components. */
export function supabaseBrowser() {
  return createBrowserClient(URL, ANON);
}
