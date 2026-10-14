# SmarterBiz.uk — UK AI Tools Directory

A complete Next.js 15 site built from the Stitch "British Editorial Intelligence" design: an independent directory of AI tools for UK small businesses, with reviews, head-to-head comparisons, long-form guides, a secure backend for forms, and full technical SEO/AEO/GEO.

This site lives in the `smarterbiz-uk/` folder so it does not touch the HaadinGlobal site at the repo root.

## What's inside

| Area | Details |
|---|---|
| Pages | Home, tools directory (search/filter/sort/paginate), 37 tool reviews, 14 category pages, 10 comparisons, 18 guides, search, about, methodology, affiliate disclosure, privacy (UK GDPR), terms, contact, submit-a-tool, unsubscribe, 404 |
| Backend | `/api/subscribe` (with optional welcome email via Resend), `/api/unsubscribe` (HMAC-signed links + RFC 8058 one-click), `/api/contact`, `/api/submit-tool` (Supabase via server-side REST), `/api/search` |
| Security | Strict CSP + HSTS + frame/sniff/referrer/permissions headers, same-origin (CSRF) checks, JSON-only, 16 KB body limit, per-IP rate limiting, zod validation, honeypot + timing bot traps, RLS-locked tables, service key never sent to the browser, no `dangerouslySetInnerHTML` for content, 0 npm vulnerabilities |
| SEO | Per-page titles/descriptions/canonicals/hreflang (en-GB), Open Graph + Twitter cards, dynamic OG images, XML sitemap, robots.txt, RSS feed, breadcrumbs |
| Schema.org | Organization, WebSite + SearchAction, BreadcrumbList, Article, SoftwareApplication + Review/Rating, ItemList, FAQPage, Speakable |
| AEO / GEO / LLM | "Quick answer" boxes, key takeaways, FAQ blocks, `llms.txt` + `llms-full.txt`, AI crawlers (GPTBot, ClaudeBot, PerplexityBot, Google-Extended…) explicitly allowed |
| Design & motion | Newsreader + Inter (self-hosted via `next/font`), CSS-3D hero with pointer parallax, 3D tilt cards, scroll reveals, animated score bars, reading progress bar. Honours `prefers-reduced-motion` |
| Quality gates | `npm run check:content` (slugs, tool references, internal links), typecheck, lint, build, `npm audit` — all run in GitHub Actions (`.github/workflows/smarterbiz-ci.yml`) |
| Performance | 170 pages statically pre-rendered, ~103–116 kB first-load JS, no third-party scripts, SVG-generated artwork (no heavy images) |

## Local development

```bash
cd smarterbiz-uk
npm install
cp .env.example .env.local   # fill in values
npm run dev                  # http://localhost:3000
npm run check:content && npm run typecheck && npm run lint && npm run build
```

## Go live on Vercel (step by step)

1. **Supabase (database)**
   1. Create a project at supabase.com (choose the **London (eu-west-2)** region for UK data residency).
   2. Open **SQL Editor → New query**, paste `supabase/schema.sql` and run it.
   3. From **Project Settings → API**, copy the Project URL and the `service_role` key.
2. **Vercel**
   1. Go to **Add New → Project** and import this GitHub repo.
   2. Set **Root Directory** to `smarterbiz-uk`. This matters: the repo root is the other site.
   3. Add these environment variables:
      - `NEXT_PUBLIC_SITE_URL` = `https://www.yourdomain.co.uk` (no trailing slash)
      - `SUPABASE_URL` = your Supabase project URL
      - `SUPABASE_SERVICE_ROLE_KEY` = your service role key (**never** prefix it with `NEXT_PUBLIC_`)
      - `NEWSLETTER_SECRET` = 32+ random characters (`openssl rand -hex 32`), which signs unsubscribe links
      - Optional: `RESEND_API_KEY` and `EMAIL_FROM` for welcome emails (verify your domain in Resend first)
      - Optional: `INDEXNOW_KEY` (`openssl rand -hex 16`), so every production deploy pings Bing (which also powers ChatGPT search)
   4. Deploy, then add your custom domain under **Settings → Domains**.
3. **Search engines**
   1. Verify the domain in Google Search Console and Bing Webmaster Tools. You can paste the codes into `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` and `NEXT_PUBLIC_BING_SITE_VERIFICATION`.
   2. Submit `https://yourdomain/sitemap.xml` in both.

Until the Supabase variables are set, the forms show a polite "temporarily unavailable" message and the rest of the site works normally.

## Before launch: edit these

In `src/lib/site.ts`:

- `url`, `email` and `editorialEmail`
- `legalName` and `companyNumber` once registered (they're hidden until set)
- `social`: real profile URLs, which become Organization `sameAs` signals
- `author`: a real named editor with a bio. This strengthens E-E-A-T; Google favours real, accountable authors.

Content:

- Tool data lives in `src/data/tools.ts`, guides in `src/data/guides-1.ts` and `guides-2.ts`, comparisons in `src/data/comparisons.ts`.
- Prices are indicative GBP figures. Re-check them against vendor sites before launch and then quarterly, and update `SITE.lastUpdated`.
- To add an affiliate link, set `affiliateUrl` on a tool. It's automatically marked `rel="sponsored"`.

## Newsletter

- Sign-ups are single opt-in and stored in `subscribers`. If Resend is configured, a welcome email with a signed unsubscribe link and one-click `List-Unsubscribe` headers is sent; the site never sends marketing email without a working unsubscribe.
- To send the weekly briefing, export active subscribers (`unsubscribed_at is null`) or connect the table to your email platform. Include each person's unsubscribe link (`/unsubscribe?e=…&t=…`, where the token is HMAC-SHA256 of `unsubscribe:<email>` with `NEWSLETTER_SECRET`, base64url).

## Reading submissions

Use Supabase **Table Editor**: `subscribers`, `contact_messages` and `tool_submissions`. Row Level Security is on with no public policies, so only your server (service role) can read or write them.

## Notes

- The rate limiter is in-memory, so each serverless instance applies its own limit. For strict global limits, swap `rateLimit()` in `src/lib/security.ts` for Upstash Redis or Vercel KV.
- The CSP allows inline scripts because Next.js' static pages need them. There are no third-party scripts. If you add analytics (such as Plausible or GA4), add its domain to `script-src`/`connect-src` in `next.config.mjs`, and add a cookie banner if it sets cookies.

See **SEO-PLAYBOOK.md** for keyword research, the content plan and off-page strategy.
