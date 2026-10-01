# HaadiGlobale — Round 3 Fixes (after deployment feedback)

## Asli problems jo aap ne batayi thin

| # | Problem | Status |
|---|---------|--------|
| 1 | Light mode mein bhi kuch sections (CTA, courses heading, hero) dark dikh rahe the | ✅ Fixed |
| 2 | Pakistan mein bhi USD prices dikh rahe the ($135, $405 etc.) | ✅ Fixed |
| 3 | Prices conversion rate galat — auto-uplift +35% sahi nahi tha | ✅ Fixed |
| 4 | About section image puri nazar nahi aati thi | ✅ Fixed |
| 5 | Services section pe prices nahi the | ✅ Added |
| 6 | Calculator prices update karne the | ✅ Done |

## Kya kya badla

### 1. Light mode dark patches (asli root-cause)
Pehle attribute selectors (`[class*="from-[#020205]"]`) use kar raha tha. Yeh browsers mein
`[` brackets ke saath reliable nahi the. Ab **escaped Tailwind class selectors** use kiye —
`.from-\[\#020205\]` directly. **65 light-theme rules** ab compiled CSS mein guaranteed hain,
including a "sledgehammer" rule jo har `absolute inset-0 + dark hex gradient` overlay ko light
mode mein transparent kar deta hai. Hero, courses heading, CTA section, footer — sab ab
properly light hote hain.

### 2 & 3. Geo detection + prices
- **Pehle:** `ipapi.co` se client-side fetch karta tha, slow + unreliable + rate-limit hota
  tha. Pakistan ke users ko bhi USD dikh raha tha kyunke fetch fail ho jata tha ya cached
  localStorage galat tha.
- **Ab:** Next.js **middleware** (`src/middleware.ts`) Vercel ke `x-vercel-ip-country`
  header se country read karta hai (100% reliable on Vercel), `hg-country` cookie set
  karta hai. `useCurrency()` cookie ko synchronously read karta hai — koi fetch nahi, koi
  delay nahi, koi rate limit nahi.
- **Prices:** Aap ki di hui exact PKR + USD list use ki (no more +35% auto-uplift). PKR
  15,000 → $54, PKR 25,000 → $91, PKR 80,000 → $291, etc. — sab explicit values data files
  mein store hain.

### 4. About image
`object-cover object-top` + scrim mask hata diya (woh face crop kar raha tha). Ab
**`object-contain`** use kiya with 3:4 aspect-ratio container — **poori image bina kisi
crop ke** nazar aati hai, har screen size pe. Caption neeche separate hai, image pe overlay
nahi.

### 5. Services section prices
Pehle services section mein prices nahi the. Ab har card pe `PKR 15,000/mo` ya `$54/mo`
dikhta hai, currency cookie ke hisab se auto-switch.

### 6. Calculator prices
Service options ki saari prices aap ki exact list se update — Meta Ads PKR 15k/$54,
Google Ads PKR 25k/$91, SEO PKR 35k/$127, YouTube PKR 40k/$145, Branding PKR 50k/$182,
AI Automation PKR 80k/$291, etc.

## Naye / modified files
| File | What |
|---|---|
| `src/middleware.ts` | **NEW** — Vercel geo → cookie |
| `src/utils/useCurrency.ts` | Rewritten — cookie-based, synchronous, no fetch |
| `src/utils/pricing.ts` | Simplified — explicit dual prices, no withUplift |
| `src/data/services.ts` | Added `pricePkr` + `priceUsd` to all 12 services |
| `src/data/courses.ts` | USD prices updated to match ~280 PKR/USD rate |
| `src/components/home/ServicesSection.tsx` | Now displays prices |
| `src/components/home/AboutSection.tsx` | Image: object-contain, no crop |
| `src/components/home/CoursesTeaser.tsx` | Direct USD (no uplift) |
| `src/components/pricing/PricingCards.tsx` | USD plan prices: $54/$127/$254/Custom |
| `src/components/pricing/PricingCalculator.tsx` | Direct USD (no uplift) |
| `src/app/checkout/page.tsx` | Direct USD |
| `src/app/api/checkout/route.ts` | Direct USD |
| `src/styles/globals.css` | Light layer rewritten: escaped class selectors + sledgehammer |

## Build verification
- `npm run build` → ✅ Compiled successfully, 35/35 pages, middleware 27.6 kB
- `tsc --noEmit` → ✅ 0 errors
- Runtime test: middleware sets PKR cookie locally; HTML renders `PKR 15,000`, `PKR 25,000` etc. correctly
- CSS: 65 [data-theme=light] rules in compiled output (verified)

## Deploy karein
1. Naya zip extract karein
2. Apne GitHub repo pe poora project replace karein
3. `git add . && git commit -m "round 3: geo middleware + light theme fixes + prices" && git push`
4. Vercel pe deploy ke waqt **"Use existing Build Cache" ka tick HATA dein** (purana CSS cache nahi chahiye)
5. Vercel deploy ke baad — Pakistan ke users ko PKR, doosre countries ke users ko USD automatic dikhega
