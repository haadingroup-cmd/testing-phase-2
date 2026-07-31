# HaadiGlobale — Round 4 Fixes

## Aap ki 2 specific shikayatein

### 1. Service pages pe USD ($399) dikha raha tha Pakistan mein
**Root cause:** Service detail page (`/services/[slug]`) aur services list page (`/services`)
abhi tak `basePrice` field use kar rahe the — woh USD-only number tha (`$399`, `$299`, etc.).
Round 3 mein services data file mein `pricePkr`/`priceUsd` add kiye the, lekin in 2 pages
ko update karna reh gaya tha.

**Fix:** Naya client component `ServicePriceTag` banaya — cookie se currency read karta hai
aur appropriate price dikhata hai. Dono pages mein use kar diya. Plus consultation aur contact
page ke budget dropdowns ko bhi currency-aware kar diya — Pakistan users ko `PKR 50,000`,
`PKR 150,000+` options dikhenge.

**Verified:** 11 pages pe scan ki, **zero visible USD prices** Pakistan default render mein.

### 2. About image puri nazar nahi aati thi
**Root cause:** Aap ki photo (1086x1448) mein person nichay center mein hai aur upar
curtains/background hai. Round 3 mein `object-contain` use kiya tha — sab dikhta tha lekin
person chota lagta tha (curtains ka size zyada). Aap ki screenshot mein bhi yahi tha.

**Fix:** Ab `aspect-square` (mobile) + `aspect-[4/5]` (large) frame use ki with
`object-cover` aur `objectPosition: "center 30%"`. Yeh photo ko square frame mein crop karta
hai, top 7% (curtains) cut hota hai, person properly framed hota hai — face, shoulders, suit,
sweater, hand sab visible.

**Preview verified:** Cropped output mein person properly centered hai. (Standalone `/about`
page aur homepage AboutSection dono fix kiye — `h-72 object-top` wala purana code hata diya
jo face crop kar raha tha).

## Naye / modified files (v4)

| File | What |
|---|---|
| `src/components/services/ServicePriceTag.tsx` | **NEW** — client component for currency-aware price display |
| `src/utils/useBudgetOptions.ts` | **NEW** — currency-aware budget dropdown options |
| `src/app/services/[slug]/page.tsx` | Uses ServicePriceTag instead of $basePrice |
| `src/app/services/page.tsx` | Uses ServicePriceTag for card prices |
| `src/components/contact/ContactForm.tsx` | Budget options now PKR/USD switchable |
| `src/app/consultation/page.tsx` | Budget options now PKR/USD switchable |
| `src/app/about/page.tsx` | New square image frame, proper cropping |
| `src/components/home/AboutSection.tsx` | Same image fix for homepage About |

## Build verification (zero errors)
- `npx tsc --noEmit` → ✅ 0 errors
- `npm run build` → ✅ Compiled successfully
- All 35 pages prerender + Middleware 27.6 kB
- Runtime smoke test: visible USD prices on Pakistan default = **0** (on all 11 key pages)
- Middleware sets `hg-country=PK` cookie correctly
- Light theme CSS rules: 65 selectors in compiled output

## Deploy
1. Naya zip extract karein → GitHub repo replace karein
2. `git add . && git commit -m "v4: service price tag + about image crop" && git push`
3. Vercel deploy ke waqt **"Use existing Build Cache" ka tick HATA dein**

Ab `/services`, `/services/google-ads`, `/services/meta-ads` — sab pages Pakistan users ko
PKR mein hi dikhayenge, aur about page mein image properly framed hogi.
