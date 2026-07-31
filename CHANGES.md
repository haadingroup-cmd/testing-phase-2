# HaadiGlobale — Update Summary

Framework detected: **Next.js 14.2.5 (App Router) · React 18 · TypeScript · Tailwind 3 · Framer Motion**.
Final state: `npm run build` ✅ · `tsc --noEmit` ✅ (0 errors) · 35/35 pages prerender · Vercel-ready.

## New files
| File | Purpose |
|---|---|
| `src/components/providers/ThemeProvider.tsx` | Dark/light context + no-flash inline init script (system default, localStorage). |
| `src/components/common/ThemeToggle.tsx` | Premium animated light/dark switch (navbar). |
| `src/utils/pricing.ts` | Pure pricing helpers (`withUplift`, `formatPrice`) — safe for server **and** client. |
| `src/utils/useCurrency.ts` | SSR-safe geo→currency hook (PKR for PK, USD +35% elsewhere). |
| `src/utils/payments.ts` | Provider-agnostic checkout dispatcher (Stripe/PayPal/JazzCash/EasyPaisa). |
| `src/data/courses.ts` | Single source of truth for courses (slug, +20% prices, icons, product-ID slots). |
| `src/app/checkout/page.tsx` | Course checkout page (Suspense + useSearchParams, SSR-safe). |
| `src/app/api/checkout/route.ts` | Server checkout session creator (reads secret keys; 501 until configured). |
| `.env.example` | All payment env vars documented. |

## Modified files & what changed
- **`tailwind.config.ts`** — `darkMode: ["selector", '[data-theme="dark"]']`.
- **`src/styles/globals.css`** — Theme tokens (dark default + `[data-theme="light"]`); a **light compatibility layer** remapping the hardcoded dark hexes & slate/white utilities used site-wide (premium light mode without rewriting every component); tightened `.section-pad` (5–8rem → 3–5rem); toggle styles; added Plus Jakarta Sans.
- **`src/app/layout.tsx`** — `<html data-theme="dark">`, no-flash script, wrapped in `ThemeProvider`.
- **`src/components/layout/Navbar.tsx`** — `ThemeToggle` added (desktop + mobile).
- **`src/components/layout/Footer.tsx`** — top padding `pt-40` → `pt-16` (#9 breathing room).
- **`src/components/pricing/PricingCards.tsx`** — **all Urdu removed** (#2); premium redesign for both themes (#7); dynamic PKR/USD with +35% intl uplift (#11).
- **`src/components/pricing/PricingCalculator.tsx`** — richer cards/gradients/shadows/borders/hover (#8); shared currency hook + uplift (#11).
- **`src/components/home/CoursesTeaser.tsx`** — lucide course icons (#13); +20% prices (#12); cards clickable → `/checkout?course=…` (#14); currency-aware.
- **`src/components/home/ServicesSection.tsx`** — improved heading typography/spacing (#10). (Cards were already linked → `/services/[slug]`, #6 ✓.)
- **`src/components/home/AboutSection.tsx`** — CEO image fit fixed: portrait-aware `aspect-[3/4]` + `object-top`, responsive, no crop (#15); fixed broken `/reviews` link → `/#testimonials`.

## #14 — Payment gateway: what I need from you
Set in Vercel env vars (no fake keys used; see `.env.example`). Pick a provider:
- **Stripe:** `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`, `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, + per-course `stripePriceId` in `courses.ts`.
- **PayPal:** `NEXT_PUBLIC_PAYPAL_CLIENT_ID`, `PAYPAL_CLIENT_SECRET`.
- **JazzCash/EasyPaisa:** `JAZZCASH_MERCHANT_ID`, `JAZZCASH_PASSWORD`, `JAZZCASH_INTEGRITY_SALT`.
- **Shared:** success/cancel URLs (defaults provided).
Until set, checkout shows an instant **WhatsApp enrollment** fallback. The TODO blocks in `route.ts` are where each provider's session-creation code goes.

## Deployment safety
TypeScript ✅ · Tailwind ✅ · imports/exports ✅ · hydration (currency + theme both render PKR/dark first, reconcile after mount) ✅ · routing ✅ · API route 501 (clean) until configured ✅.
