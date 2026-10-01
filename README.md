# HaadinGlobal — Digital Marketing & Technology Agency Website

Production website for **HaadinGlobal** (https://www.haadinglobal.com), built from the Stitch design ("Sovereign Blue & Precision Tech") as a full-stack Next.js application:

- Public site: Home, Services (+ 12 service pages), Pricing with a live **package builder**, Results / case studies, Blog, **free website SEO audit** with PDF report, About, FAQ, Contact, legal pages.
- Real backend: PostgreSQL + Prisma, validated API routes, lead capture, email notifications, rate limiting and spam protection.
- Protected **admin panel** (`/admin`): dashboard, leads, audit requests, and CRUD for services, pricing plans, blog posts, case studies, FAQs and site settings.

---

## 1. Requirements

| Tool | Version |
| --- | --- |
| Node.js | **20.9 or newer** (22 LTS recommended) |
| npm | 10+ (bundled with Node) |
| PostgreSQL | 14+ (local, or hosted: Neon, Supabase, Vercel Postgres, Railway…) |

## 2. Installation

```bash
npm install          # also runs `prisma generate`
cp .env.example .env # then fill in the values (see section 5)
```

## 3. Development

```bash
npm run db:migrate   # create tables in your local database
npm run db:seed      # load services, pricing, FAQs, settings, blog posts, case studies (+ admin if set)
npm run dev          # http://localhost:3000
```

The public site also runs **without a database**: every page falls back to the built-in default content (`src/content/*`). Forms, the audit tool and the admin need the database.

Useful scripts:

| Command | What it does |
| --- | --- |
| `npm run dev` | Development server |
| `npm run build` / `npm start` | Production build / server |
| `npm run lint` | ESLint + check that every icon used exists in the icon font subset |
| `npm run typecheck` | TypeScript (strict) |
| `npm run db:migrate` | Create/apply migrations in development |
| `npm run db:deploy` | Apply migrations in production (no prompts) |
| `npm run db:seed` | Seed initial content (safe to re-run; never overwrites admin edits) |
| `npm run db:studio` | Browse the database in Prisma Studio |
| `npm run admin:create` | Create an admin user or reset a password |
| `npm run icons:update` | Regenerate the self-hosted icon font after adding names to `src/lib/icons.ts` |

## 4. Database

1. Create a PostgreSQL database and copy its connection string into `DATABASE_URL`.
   - Local example: `postgresql://postgres:postgres@localhost:5432/haadinglobal?schema=public`
   - Hosted providers usually need `?sslmode=require`.
2. Apply the schema: `npm run db:migrate` (development) or `npm run db:deploy` (production).
3. Seed initial data: `npm run db:seed`.

Schema: `prisma/schema.prisma` · Migrations: `prisma/migrations/` · Seed: `prisma/seed.ts`.

Models: `User` (admins), `Lead`, `Service`, `PricingPlan`, `BlogPost`, `CaseStudy`, `FAQ`, `SiteSetting`, `AuditRequest`, `RateLimit`.

**What the seed contains:** the 12 services and 4 pricing tiers from the Stitch design, general FAQs, business settings, the 23 existing blog articles from the previous site, and case studies built only from real project facts and real dashboard screenshots. **No testimonials or invented results are seeded.**

## 5. Environment variables

| Variable | Required | Description |
| --- | --- | --- |
| `DATABASE_URL` | Yes (for forms/admin/audit) | PostgreSQL connection string. Use the *pooled* URL on Vercel. |
| `AUTH_SECRET` | Yes (for admin) | 32+ random characters used to sign admin sessions. Generate with `openssl rand -base64 48`. Changing it signs everyone out. |
| `ADMIN_EMAIL` | For first admin | Email of the admin created by `db:seed` / `admin:create`. |
| `ADMIN_PASSWORD` | For first admin | 12+ chars with upper-case, lower-case and a number. **Remove it from the environment after the admin exists.** |
| `RESEND_API_KEY` | Optional | Resend API key for new-lead email notifications. Without it, leads are still saved. |
| `EMAIL_FROM` | With Resend | Sender, e.g. `HaadinGlobal Website <notifications@haadinglobal.com>` (domain must be verified in Resend). |
| `EMAIL_TO` | With Resend | Where notifications go (comma-separate multiple addresses). |
| `NEXT_PUBLIC_SITE_URL` | Yes | Canonical domain, e.g. `https://www.haadinglobal.com`. Used for canonical URLs, sitemap, Open Graph, schema. |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | Yes | Default WhatsApp number in international format without `+` (`923054782677`). The admin Settings value takes precedence on the site. |
| `PAGESPEED_API_KEY` | Optional | Google PageSpeed Insights key. Adds real Lighthouse / Core Web Vitals lab data to the audit. |
| `GOOGLE_SITE_VERIFICATION` | Optional | Google Search Console verification token. |

## 6. Admin

- URL: **`/admin`** (redirects to `/admin/login`).
- Create the first admin, either:
  - set `ADMIN_EMAIL` + `ADMIN_PASSWORD` and run `npm run db:seed`, **or**
  - run `npm run admin:create` (interactive), which also resets a password for an existing email.
- Passwords are stored as bcrypt hashes; sessions are signed, HTTP-only, `Secure`, `SameSite=Lax` cookies valid for 7 days. Changing a password signs out all other sessions.
- Every admin page and server action re-validates the session against the database; `/admin` is also gated in `src/proxy.ts` and excluded from search engines.
- Login is rate-limited (8 attempts / 15 minutes per IP).

## 7. Deploy to Vercel

The project is at the repository root, so Vercel detects Next.js automatically — **no settings to change**.

**Quick deploy (site goes live immediately):**
1. Push to GitHub.
2. Vercel → *Add New → Project* → *Import* this repository → click **Deploy**. Leave every setting on its default.

The public website works right away using the built-in content. Forms, the admin panel and the audit tool switch on once a database is connected:

**Turn on forms, admin and the audit tool:**
3. In the Vercel project → *Storage* → create a **Postgres (Neon)** database and connect it — Vercel adds `DATABASE_URL` automatically.
4. Project → *Settings → Environment Variables* → add `AUTH_SECRET` (any 32+ random characters), `ADMIN_EMAIL`, `ADMIN_PASSWORD`, and optionally the email variables from section 5.
5. *Deployments* → **Redeploy**. Tables are created automatically during the build (`vercel-build` runs `prisma migrate deploy` whenever `DATABASE_URL` is set).
6. Seed content and create your admin once, from your computer: `DATABASE_URL="<production url>" ADMIN_EMAIL=... ADMIN_PASSWORD=... npm run db:seed`. Then remove `ADMIN_PASSWORD` from Vercel.
7. **Custom domain**: Project → *Settings → Domains* → add `www.haadinglobal.com` and follow the DNS instructions. Set `NEXT_PUBLIC_SITE_URL` if you use a different domain.

## 8. Project structure

```
(repository root)
├── prisma/                 schema.prisma, migrations/, seed.ts, client.ts (CLI scripts)
├── public/                 images (services, blog, results), founder photo, fonts/ (icon subset), downloads/, icons
├── scripts/                create-admin.ts, update-icon-font.mjs, check-icons.mjs
└── src/
    ├── app/
    │   ├── (site)/         public pages: home, about, services, pricing, results, blog, audit, contact, faq, legal
    │   ├── admin/          login, (panel)/ dashboard + CRUD screens, actions.ts (server actions)
    │   ├── api/            leads, package-request, audit (+ [id], [id]/pdf), services, pricing, blog, case-studies
    │   ├── layout.tsx, globals.css (design tokens), sitemap.ts, robots.ts, manifest.ts, opengraph-image.tsx
    ├── components/         ui/, layout/, sections/, forms/, services/, pricing/, results/, blog/, audit/, admin/, seo/
    ├── content/            default content (services, pricing, FAQs, settings, blog, case studies, legal, navigation)
    ├── lib/                db/, data/ (read layer), validations/, auth/, audit/, email/, security/, seo/, leads.ts …
    ├── proxy.ts            admin route gate
    └── types/              shared types
```

## 9. How things work

- **Data**: pages read through `src/lib/data` (database first, default content as fallback) and are statically generated with 5-minute revalidation. Admin saves revalidate the site immediately.
- **Forms**: React Hook Form + Zod on the client, **re-validated with the same Zod schemas on the server**, honeypot + minimum-fill-time spam checks, same-origin check, and database-backed rate limits. Every form has idle / submitting / success / error states, and success offers a WhatsApp follow-up.
- **Package builder**: prices come from the Services table, and the estimate logic lives in `src/content/calculator.ts`. The server recalculates the estimate before saving, so client numbers are never trusted.
- **SEO audit**: `src/lib/audit` fetches the submitted page with SSRF protection (public IPs only, checked at connect time, redirects re-validated, time/size limits) and runs 35+ real checks across Technical SEO, On-Page, Content, Performance, Social, Accessibility and Conversion. Scores are computed only from checks that ran (pass = 1, warning = 0.5, error = 0). The PDF is generated server-side with `pdf-lib`. Backlinks/rankings/traffic need paid APIs and are listed as limitations. Integration point for more providers: `src/lib/audit/pagespeed.ts` (pattern to copy).
- **Email**: `src/lib/email` calls the Resend HTTP API when configured; otherwise it's skipped silently.
- **Icons**: the Stitch design's Material Symbols, self-hosted as a ~25 KB subset (`public/fonts`). Add names to `src/lib/icons.ts`, then run `npm run icons:update`.

## 10. Production checklist

- [ ] `DATABASE_URL`, `AUTH_SECRET`, `NEXT_PUBLIC_SITE_URL`, `NEXT_PUBLIC_WHATSAPP_NUMBER` set in Vercel
- [ ] Migrations applied (`vercel-build` does this) and seed run once
- [ ] Admin created; `ADMIN_PASSWORD` removed from the environment
- [ ] Sign in at `/admin` and review **Settings** (contact details, social links, homepage stats)
- [ ] Homepage stats reflect figures you can verify (edit in Settings)
- [ ] Resend domain verified and `RESEND_API_KEY`, `EMAIL_FROM`, `EMAIL_TO` set (optional)
- [ ] Submit a test enquiry on `/contact` and confirm it appears in `/admin/leads`
- [ ] Run a test audit on `/audit` and download the PDF
- [ ] Custom domain connected; `https://www.haadinglobal.com/sitemap.xml` and `/robots.txt` load
- [ ] Submit the sitemap in Google Search Console
- [ ] Legal pages reviewed for your jurisdiction (`src/content/legal.ts`)

## 11. Notes

- `npm audit` reports advisories in `mysql2`, which is pulled in by the Prisma **CLI** (dev-time only). It is not part of the deployed application, and the app uses PostgreSQL.
- Old URLs from the previous site (`/portfolio`, `/consultation`, `/team`, `/careers`, `/agency/*`, …) permanently redirect to their new equivalents (see `next.config.ts`).
