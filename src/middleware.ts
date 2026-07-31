import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createServerClient, type CookieOptions } from "@supabase/ssr";

/**
 * Middleware does two jobs on every page request:
 *
 * 1) Geo cookie — sets `hg-country` from Vercel's edge geo header so pricing
 *    and language can default correctly (PK → PKR/English, Gulf → USD/Arabic).
 *
 * 2) Auth — refreshes the Supabase session cookie and PROTECTS /dashboard.
 *    If a signed-out visitor hits /dashboard they are bounced to /login.
 *    (Fine-grained role checks happen server-side inside each dashboard.)
 */
export async function middleware(req: NextRequest) {
  const res = NextResponse.next();

  // ── 1) Geo cookie ────────────────────────────────────────────────────────
  const vercelCountry = req.headers.get("x-vercel-ip-country");
  const geoCountry = (req as unknown as { geo?: { country?: string } }).geo?.country;
  const realCountry = vercelCountry || geoCountry;
  const existing = req.cookies.get("hg-country")?.value;
  if (realCountry && realCountry !== existing) {
    res.cookies.set("hg-country", realCountry, { path: "/", maxAge: 60 * 60 * 24 * 30, sameSite: "lax" });
  } else if (!existing) {
    res.cookies.set("hg-country", "PK", { path: "/", maxAge: 60 * 60 * 24 * 30, sameSite: "lax" });
  }

  // ── 2) Supabase session refresh + /dashboard guard ───────────────────────
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  // If Supabase isn't configured yet, skip auth entirely (site still works).
  if (url && anon) {
    const supabase = createServerClient(url, anon, {
      cookies: {
        get(name: string) {
          return req.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          res.cookies.set({ name, value, ...options });
        },
        remove(name: string, options: CookieOptions) {
          res.cookies.set({ name, value: "", ...options });
        },
      },
    });

    const { data: { user } } = await supabase.auth.getUser();

    if (req.nextUrl.pathname.startsWith("/dashboard") && !user) {
      const login = req.nextUrl.clone();
      login.pathname = "/login";
      login.searchParams.set("next", req.nextUrl.pathname);
      return NextResponse.redirect(login);
    }

    // Already logged in and visiting /login → send to dashboard.
    if (req.nextUrl.pathname === "/login" && user) {
      const dash = req.nextUrl.clone();
      dash.pathname = "/dashboard";
      dash.search = "";
      return NextResponse.redirect(dash);
    }
  }

  return res;
}

// Run on every route except static assets and API routes.
export const config = {
  matcher: ["/((?!api/|_next/|favicon.ico|robots.txt|sitemap.xml|.*\\..*).*)"],
};
