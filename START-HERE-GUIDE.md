# HaadinGlobal — Deploy Guide (Phase 1)

Yeh Phase 1 hai: saari SEO fixes + brand/domain fix + team pages + courses removed +
security headers. **Build test ho chuka hai — koi error nahi.** Ise abhi deploy
kar sakte ho. (Team login/dashboard Phase 2 mein aayega.)

Follow karo, ek-ek step. Technical hona zaroori nahi.

---

## Kya-kya fix hua (Phase 1)
- ✅ Domain har jagah `haadinglobal.com` (pehle galat `haadiglobale.com` tha)
- ✅ Brand har jagah `HaadinGlobal` (Footer bhi theek)
- ✅ "Pakistan's #1" claim hataya (English + Arabic)
- ✅ Social links sab sahi `haadinglobal` par
- ✅ Courses / Enroll / Checkout section poora remove
- ✅ FAQ ab Google rich-results ke liye schema-ready
- ✅ Team page live: `/team` + har member ka apna page (`/team/arooba-shafique` waghera)
- ✅ Security headers add (clickjacking, HTTPS force, etc.)
- ✅ Next.js secure version par upgrade
- ✅ Corrupt `seo-guide.png` theek kiya

---

## STEP 1 — GitHub par upload
1. github.com par login karo → **New repository** → naam `haadinglobal` → **Create**.
2. Naye repo page par **"uploading an existing file"** link par click.
3. Is folder ke **saare files/folders** drag-and-drop karo (ye poora unzipped folder).
   - `node_modules` folder upload **mat** karna (agar hai to skip) — Vercel khud bana lega.
4. Neeche **Commit changes** dabao.

## STEP 2 — Vercel par deploy
1. vercel.com par GitHub se login karo.
2. **Add New → Project** → apna `haadinglobal` repo **Import** karo.
3. Framework khud **Next.js** detect ho jayega. Kuch change mat karo.
4. **Deploy** dabao. 1–2 minute mein site live.

## STEP 3 — Apna domain lagao
1. Vercel project → **Settings → Domains** → `www.haadinglobal.com` add karo.
2. Jo DNS records Vercel dikhaye, wo apne domain provider par laga do.

## STEP 4 — Google ko batao (zaroori — warna fix "count" nahi hoga)
1. Google Search Console kholo → apni property `haadinglobal.com`.
2. **Sitemaps** → `https://www.haadinglobal.com/sitemap.xml` submit karo.
3. Home page + important pages **URL Inspection → Request Indexing**.

---

## STEP 5 — (Phase 2 ke liye) Supabase keys Vercel mein daalna
> Yeh abhi zaroori nahi — team login Phase 2 mein activate hoga. Jab main Phase 2
> de doon, tab yeh karna. Abhi sirf jaan lo kahan daalni hain.

Vercel project → **Settings → Environment Variables** → yeh 3 add karna:

| Name | Value |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://wrwcyilvmmustqgshkyp.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase ki **Publishable / anon** key |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase ki **Secret / service_role** key |

(Keys Supabase → Settings → API Keys se milengi. Inhein kisi ke saath share mat karna.)

---

## Zaroori security reminder
Supabase mein wo purani `service_role` key jo pehle kahin paste hui thi — usko
**API Keys page se "Disable legacy keys"** karke, naye **Publishable + Secret** keys
banana. Nayi keys sirf upar wale Vercel box mein daalni hain, kahin aur nahi.

---

Koi step atke to bata dena — main us jagah ka aur simple screenshot-style guide bana dunga.

---

# PHASE 2 — Team Login & Dashboard (ab included hai)

Phase 2 bhi is zip mein hai: 3-role dashboard (Admin/Manager/Member), team login,
aur members ka project upload. **Website bina iske bhi chalti hai** — dashboard tab
on hoga jab aap Supabase keys daaloge.

**Dashboard on karne ke liye:** `supabase/SETUP-GUIDE.md` follow karo (schema chalao,
keys Vercel mein daalo, pehla admin banao). 10–15 minute ka kaam, step-by-step likha hai.

Naye pages:
- `/login` — team login (koi public signup nahi; accounts aap banate ho)
- `/dashboard` — role ke hisaab se: member ko apne projects, staff ko team + projects
- `/dashboard/team` — members add/remove, role/level/stars set (admin/manager)
- `/dashboard/projects` — members ke submitted projects approve/reject

Public `/team` page automatically live Supabase data dikhायेga jab connect ho jaye.

---

# PHASE 3 — International SEO, Gulf Ads Pages & Growth (included)

Phase 3 bhi is zip mein hai:

**Gulf Google Ads landing pages** (aapki Dubai/Qatar/Saudi ads ke liye):
- `/agency/digital-marketing-agency-dubai`
- `/agency/digital-marketing-agency-qatar`
- `/agency/digital-marketing-agency-saudi-arabia`

Har page conversion ke liye bana hai: strong headline, pain/solution, services,
FAQ, inline lead form (spam-protected honeypot ke saath), aur LocalBusiness + FAQ
schema — ye Google Ads **Quality Score** aur conversions dono ke liye acha hai.

> Apni Google Ads campaigns in URLs par point karo (har country ki apni). Isse
> ad relevance high hoti hai aur cost-per-lead kam.

**International SEO schema:** Organization mein `areaServed` (PK, UAE, Qatar, KSA,
UK, US), WebSite schema, aur har landing page + FAQ par structured data. Fake
"150 reviews" rating hata diya (Google policy risk tha).

**Arabic/RTL:** Gulf visitors ko site auto Arabic + right-to-left dikhegi (country
se detect, ya language switcher se manual).

**Growth guides (padhо aur follow karo):**
- `GROWTH-backlinks-and-directories.md` — kahan list hona hai (Clutch, GoodFirms…)
- `GROWTH-blog-content-plan.md` — 12 article ideas jo international traffic laayenge

## Ads ke liye zaroori
- Har Gulf ad ko uske apne landing URL par bhejo (upar wale).
- Conversion tracking laga do: Google Ads → Tag → `/thank-you` page ko conversion
  set karo (form submit uspe le jaata hai).
