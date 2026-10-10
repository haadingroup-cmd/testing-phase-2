# SEO state — haadinglobal.com

Checked against the *Complete AI SEO Execution Prompt Book* (Sept 2026 edition).
Last audit: 2026-10-02, live production site plus repository. Status values: PASS / FIXED (in this batch) / FAIL / UNKNOWN (no data or access) / N/A.

## Business brief (Phase 0)
- Platform: Next.js 14 App Router on Vercel, deployed from `main`. The repository is the only CMS.
- Offer: digital marketing agency (Meta, Google and TikTok ads, SEO, social, web/Shopify, branding, AI automation, YouTube channel management).
- Office: Sahiwal, Punjab, Pakistan. Serves PK, UAE, KSA, Qatar, UK and USA remotely.
- Real proof: 60+ projects, 20+ clients, 90% retention, 4x ROAS, 6 countries. Never use the old $150K figure.
- Primary conversion: consultation and contact form leads (GA4 key event `generate_lead`), plus WhatsApp.

## Phase-by-phase status
| Area | Status | Evidence / note |
|---|---|---|
| T01 hosts / HTTPS | PASS | http, non-www and trailing slash all 308 to `https://www.` with no slash. `http://haadinglobal.com` takes 2 hops (Vercel domain setting; harmless). |
| T03/T04 real 404s | PASS | Unknown routes, blog slugs and service slugs return 404 (not soft 404). |
| T05 robots.txt | PASS | Blocks only /api, /admin, /dashboard, /thank-you, /login. |
| T08 canonicals | PASS | All 72 sitemap URLs self-canonical. |
| T10 sitemap | PASS | 72 URLs, all 200 and indexable. Blog posts carry real lastmod; static pages have no invented dates. |
| Clone-site URLs | FIXED (PR #14) | /audit, /results/*, /faq, /refund-policy and /security now 308 to the closest real page. |
| C04/C05 titles, descriptions | FIXED | No duplicates. 21 blog titles were 66–84 characters because of the " \| HaadinGlobal" suffix; headlines over 50 characters now drop the suffix. |
| C04 H1 | PASS | Exactly one H1 on every page. |
| M02 image alt | PASS | No `<img>` without alt on any sitemap page. |
| M06 share image | FIXED | The declared 1200×630 image was a 500×500 logo. Added a real 1200×630 `/og-image.jpg` (real stats only). /free-seo-audit had no og:image. |
| Schema | PASS / FIXED | Organization, ProfessionalService, Service+Offer per market, BlogPosting, Person, BreadcrumbList, WebApplication. City pages no longer use "the UAE"/"the UK"/"the USA" as country names. |
| C11 FAQ schema | PASS (note) | Kept as answer structure only. Google no longer shows FAQ rich results, so it is not a ranking win. |
| Phase 10 NAP | PASS | Phone `+92 305 4782677` and email match on footer, contact page and schema. Only one physical address (Sahiwal) is claimed. |
| ML05/ML06 city pages | PASS (watch) | 16 `/agency/*` pages state "serving", carry no fake address and share about 30% of sentences. Keep adding real local proof (clients, case studies) per city. |
| Phase 11 international | PASS | One URL per page. Arabic only via the language button, so no hreflang needed. Each visitor sees only their own market's price; schema has an Offer per market. |
| AI09–AI16 bot policy | FIXED | Added `Claude-SearchBot` and `Claude-User`, and corrected the Google-Extended comment (AI Overviews use Googlebot). llms.txt kept as an optional extra. |
| T24 Core Web Vitals | UNKNOWN | Needs CrUX field data from PageSpeed Insights or GSC. |
| Phase 1 measurement | PARTIAL | GA4 `generate_lead` is a key event. Lead-to-client quality is not tracked yet. |
| Phase 10 GBP | UNKNOWN | Owner to confirm the profile category, hours and photos, and send the review link to real clients. |
| Phase 13 backlinks | IN PROGRESS | Clutch profile done. Next: genuine directories and partners (owner sends). |
| Phase 15 GSC queues | WAITING | Needs the Queries/Pages export (28 days vs prior 28 days). |

## Next actions
1. Owner: in GSC, resubmit `sitemap.xml`. In 7–10 days, export Queries + Pages (28 days) and share the "Discovered – not indexed" count (last value: 30).
2. Owner: Vercel → Domains → make `haadinglobal.com` redirect straight to `www` (removes the 2-hop chain).
3. Next batch: run Phase 15 opportunity queues on the GSC export, then improve the pages in positions 4–20 first.
