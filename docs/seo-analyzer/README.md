# HaadinGlobal SEO Analyzer

An isolated `/free-seo-audit` application inside the existing HaadinGlobal Next.js 14 / React 18 website. It adds a real server-side crawl and diagnostic report without replacing the homepage, dashboard, Supabase authentication, marketing pages or existing design.

## Run locally

Use Node.js 22 or newer.

```sh
npm ci
cp docs/seo-analyzer/environment.example .env.local
# Generate a signing secret and put it in .env.local; never commit this file.
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
npm run dev
```

Open `/free-seo-audit`. In development, an ephemeral signing key is used if none is configured. Production requires a stable `AUDIT_SIGNING_SECRET` with at least 32 characters. Changing this key invalidates previously signed reports.

## What works

- Public HTML audit with robots checks, sequential requests, same-origin page discovery, a default cap of 11 pages and depth 2.
- URL/protocol/port restrictions; all DNS answers checked for public addresses; TCP lookup pinned to a checked address; every redirect checked again; decompression and transfer byte limits; request and whole-crawl timeouts; cancellation.
- Title, description, headings, canonical, robots meta/X-Robots-Tag, viewport, language, charset, JSON-LD syntax/types, image ALT attributes, links, sharing tags, HTML size/compression/cache-policy checks.
- Sample-only duplicate metadata and broken internal destination findings. No claim of a complete site crawl, Google indexing or a rendered-browser audit.
- On-site local contact/business/location signals when factual optional context is supplied.
- Social URL and website-reference checks. No social account scraping or invented audience data.
- Up to three competitor starting-page comparisons.
- Transparent configurable category weights, evidence, action plans, beginner/pro modes, filters and page details.
- Server-generated PDF, spreadsheet-safe CSV and JSON exports. Optional agency/client labels on PDF covers.
- An editable factual Organization/LocalBusiness JSON-LD builder.
- Optional OpenAI Responses integration for summaries, topic/intent assessments, issue-specific fixes and metadata drafts. Responses are schema-validated, bounded and labeled as suggestions. No API call is made unless the relevant server variables are present and the visitor requests it.
- Optional Google PageSpeed Insights mobile lab test. This is kept separate from the HTML performance score.
- Source labels, unavailable metrics, error states, streaming progress from actual crawl operations and a production rate-limit gate.

## Intentionally unavailable

Backlinks, authority metrics, search volume, keyword difficulty, CPC, Bing and consumer AI-answer visibility remain unconnected. An authenticated Google adapter implements Search Console property totals and GA4 totals, using exact host-to-property mapping and explicit allowed profile IDs. It requires real service-account credentials, enabled APIs and property permissions; it has not yet been live-verified. Average Search Console position is not a rank tracker.

Public quick reports live in the visitor's current session and expire for server exports/AI after 24 hours. Staff background jobs are stored in Redis for 30 days and support daily/weekly schedules. Account billing, public report sharing, emailed reports and CMS publishing are not implemented. No lead form pretends to send data: agency CTAs link to the existing contact, services and WhatsApp destinations.

The content score measures structure and server-visible text, not semantic quality. Readability for arbitrary languages, visual mobile usability, complete rich-result eligibility, external-link checking and social profile content are not assessed. The PDF embeds DejaVu fonts and escapes unsupported glyphs to Unicode code points; JSON preserves the original text. Full multilingual/RTL PDF typography needs dedicated validation before promising it as a supported feature.

## Vercel launch configuration

Keep the existing `testing-phase-2` project linked to its GitHub repository. Use a feature-branch preview first.

Required before public production audits:

| Variable                   | Value / purpose                                                                                                                                                                           |
| -------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `AUDIT_SIGNING_SECRET`     | Random secret of at least 32 characters; generate securely and set as a server environment variable.                                                                                      |
| `RATE_LIMIT_MODE`          | `redis` for Vercel production. Memory mode is for a single local server or a controlled preview only.                                                                                     |
| `UPSTASH_REDIS_REST_URL`   | HTTPS URL of a provisioned Upstash-compatible Redis REST endpoint.                                                                                                                        |
| `UPSTASH_REDIS_REST_TOKEN` | Its server-only credential. The Redis limiter uses atomic counters and expiry.                                                                                                            |
| `TRUSTED_CLIENT_IP_HEADER` | Set to a header your host overwrites, such as `x-vercel-forwarded-for` on Vercel. Never trust arbitrary incoming forwarded headers. If unset, visitors share a conservative global quota. |
| `NEXT_PUBLIC_APP_URL`      | Optional exact public origin used for cross-origin validation. Do not set the production origin on a different preview origin. Omit to use the request origin.                            |

Optional:

- `OPENAI_API_KEY` and `OPENAI_MODEL`: enable AI. Use a model supporting the Responses API with structured output. Set a provider-side spending limit and confirm one real request before announcing availability.
- `PAGESPEED_API_KEY`: enable genuine Google API tests. Confirm API enablement and quota.
- Crawl and score variables are documented in `environment.example`. Numeric crawl caps cannot exceed the hard safety ceilings in code.

Vercel production refuses to run audits without the distributed limiter. Missing provider credentials disable their features honestly. Never put secret values in `NEXT_PUBLIC_*` variables.

The API routes declare 120 seconds for crawling, 90 for PageSpeed and 60 for AI/PDF. Confirm the project's plan/runtime permits those durations; adjust both the route duration and internal timeout coherently if it does not. The crawler itself has a default 75-second total budget.

## Review and release

```sh
npm ci
npm run typecheck
npm run test:seo
npm run build
```

1. Review the feature branch. The initial dependency lockfile mismatch is repaired; Next.js and React are retained at the existing major versions.
2. Configure preview environment variables and deploy the branch.
3. Confirm a real audit on a small accessible website and a larger site. Check skips, actual evidence and the 11-page limit.
4. Check a robots-restricted site, an invalid/private URL, a failed URL and a slow site. A blocked site should never receive an invented bad score.
5. Test desktop and 375px mobile: form, optional fields, report modes, issue filters, page details, AI-unavailable messages and downloads.
6. Download a PDF, CSV and JSON from that exact preview. Confirm score/evidence consistency, intact layout and branding. Verify JSON-LD generation and copy controls.
7. If AI/PageSpeed are enabled, perform real provider smoke tests. Mock/fixture tests do not prove live credentials or quota.
8. Configure Redis and run rate-limit tests in preview. Confirm failures are safe and server keys never appear in client bundles or logs.
9. Review the existing privacy policy and inherited analytics for the new processing flow. The analyzer sends public URLs to your server; optional AI transmits bounded page excerpts and user-supplied context to OpenAI. The host's existing analytics are unchanged.
10. Merge/promote only after the preview and production configuration are confirmed. Revert the feature commit to roll back; no database migration is required.

## Architecture

```text
src/app/free-seo-audit/       Landing page, metadata, scoped responsive styles
src/components/seo/          Analyzer form, streamed progress, dashboard and tools
src/app/api/seo/audit/       Validated, rate-limited NDJSON audit endpoint
src/app/api/seo/ai/          Signed-report AI recommendations and drafts
src/app/api/seo/performance/ Signed-report PageSpeed test
src/app/api/seo/export/      Signed-report PDF / CSV / JSON generation
src/lib/seo/                 Crawl, parsing, scoring, security, providers and exports
tests/seo/                   Controlled fixtures and automated tests
```

The public quick-audit API is stateless apart from rate counters. The authenticated background API stores checkpointed jobs in Redis and uses Vercel Workflow for execution. The report returned to the browser is HMAC-signed; exports and AI calls reject tampered or expired reports. Raw website HTML is never rendered into the analyzer UI. HTML is parsed without executing scripts. AI cannot publish changes and receives no API secrets or tools.

Rate limits are 6 audit requests, 12 AI requests, 6 performance requests and 30 exports per client per 15 minutes, plus global hourly caps. Without an explicitly trusted client-IP header, the service uses one shared quota. Counters expire. Authenticated job snapshots and page AI reviews are compressed in Redis with a 30-day TTL; summaries are returned to the UI and page findings are paginated.

## Methodology and sources

The overall score is the weighted average of available category scores. A category score is weighted passed checks divided by weighted evaluated checks. Critical/warning checks receive no pass credit. Unavailable and zero-weight informational checks are excluded. Missing categories are reweighted, so reports with different coverage are not directly comparable. Individual critical findings still require attention even when the overall average is high.

Default category weights: technical 30, on-page 25, content structure 20, HTML performance 10, local signals 10, social/sharing 5. Character/size thresholds are review heuristics, not Google rules.

Implementation references:

- [Next.js 14 output tracing](https://nextjs.org/docs/14/app/api-reference/next-config-js/output)
- [OpenAI structured outputs](https://developers.openai.com/api/docs/guides/structured-outputs)
- [Google PageSpeed Insights API](https://developers.google.com/speed/docs/insights/v5/get-started)

## Initial verification record

The September 21 local production build completed successfully with 101 generated pages and the new API/application routes included. All 33 automated tests passed, including DNS pinning and redirect-to-private-address protections. A controlled nine-page PDF fixture was generated, parsed and every page visually reviewed. These are development checks, not a claim that production deployment or live AI credentials have been verified.

The GitHub feature branch is `feat/free-seo-audit`, and the existing Vercel project is `haadingroup-4472s-projects/testing-phase-2`. Use the pull request and its deployment checks for the current release status.

The local verification environment could not expose a reachable browser preview or perform live crawler DNS requests. Remote preview checks, actual provider requests when enabled, and production environment configuration remain required release gates. The development checks above do not establish that these gates have passed.


## Agency background release (September 2026)

- Correct brand: **HaadinGlobal**, matching `SITE.name`. Generic “Excellent SEO” labels were replaced with descriptions of check pass rates. AI is an explicitly requested review, not a claim about the underlying HTML checks.
- `/dashboard/seo` requires an existing authenticated admin/manager profile. Every job read, export, mutation and Google reporting request checks authorization on the server. Jobs belong to their creator.
- Site-wide crawler follows links without a depth cutoff and processes sitemap indexes. Default 250 pages; selectable 1–500. Same-origin public HTML only; query URLs, private hosts, robots-disallowed resources, actions, login and files excluded. Maximum 100 sitemap documents, 3000 discovered tasks, 2 MB/document, 24-hour run. Queue completion does not prove discovery of every URL.
- Each bounded task checkpoints to Redis. Vercel Workflow drives tasks after browser disconnection. Failed runs can resume when the prior workflow has terminated; cancellation retains completed evidence. Locks prevent concurrent state writes. Transient target errors receive at most two retries.
- Optional AI reviews operate on individual pages, up to the operator-selected limit. Failed reviews are labeled. The complete review results are in the dashboard/JSON; PDF/CSV provide observed rule-based checks.
- API pagination avoids sending entire crawl contents on every progress poll. Export endpoints fetch authorized server-side reports and stream PDF/CSV/JSON.
- Vercel Cron calls `/api/seo/cron` daily at 03:00 UTC. `CRON_SECRET` is mandatory and checked before work. Daily/weekly schedules are opt-in per website and reuse its crawl/AI budget. Staff role is rechecked before scheduled runs. Disable using “Stop repeats”. Up to 50 schedules; up to 20 due schedules started per invocation. Failed starts remain visible in history.
- `SEO_BACKGROUND_ENABLED=true` is a release gate, not a substitute for connecting Redis and verifying a real workflow.

### Required operational verification before production

1. Keep PR in draft until latest `main` is integrated and all checks pass. Current agency updates are in local `release/seo-analyzer-verified`; do not overwrite newer unrelated work.
2. Provision Redis only after the account owner approves provider terms and plan. Separate Preview/Production databases; do not share private production snapshots with preview builds.
3. Add signing secret, Redis REST URL/token, `RATE_LIMIT_MODE=redis`, `SEO_BACKGROUND_ENABLED=true`, and a separate `CRON_SECRET` in the correct environment. Never use memory rate limits for public production.
4. Verify staff login, cross-user access denial, workflow continuation with browser closed, cancellation, resume, schedule creation/disable and a real triggered scheduled audit.
5. Configure `OPENAI_API_KEY`/`OPENAI_MODEL`, choose an account budget, and verify real per-page AI results. Verify PageSpeed independently with `PAGESPEED_API_KEY`.
6. For Google reporting: enable Search Console API and Google Analytics Data API in a Google Cloud project. Add a service account to the relevant properties with read access. Set `GOOGLE_SERVICE_ACCOUNT_JSON` and `SEO_GOOGLE_PROPERTIES_JSON` (exact host, IDs and allowed staff profile IDs). Test authorized and unauthorized property requests. Search Console access does not imply GA4 access.
7. Redis compressed snapshots have an 8 MB encoded size ceiling and 50 MB decompression ceiling. Large audits must surface storage/provider failures, not claim complete coverage. Monitor workflow and storage limits before increasing page capacity.

### Verification boundary

The first live quick audit crawled 11 client pages and exported a real PDF. New background, scheduling and Google reporting code has not yet been verified on connected production services. Automated tests and a successful build are not evidence of working credentials, correct quotas, or semantic SEO accuracy. Do not advertise integrations as live until the relevant real request succeeds.
