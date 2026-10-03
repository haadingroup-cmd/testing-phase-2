# Analyzer upgrade — 2 October 2026

## What visitors can do

1. Open **SEO Analyzer** from the main menu. The analyzer shares the actual Navbar, brand red, fonts and light/dark theme tokens.
2. Enter the site. Expand optional business details to supply up to **five** relevant competitor URLs. Choose businesses in the same service and location; the tool does not automatically discover or certify the Google top five.
3. Read the plain-English summary, priority actions, page evidence and competitor comparison. The public crawl remains bounded to 11 pages, with time reserved for supplied competitors. Each competitor comparison covers only the supplied starting page. Robots restrictions and the overall time budget still apply.
4. Open **Traffic & value**. Traffic and earnings are unavailable until you provide your own data; missing values never become zero.
5. Import a daily English Search Console CSV (the Dates.csv file inside the exported ZIP), or a GA4 daily CSV with Date and Sessions, optionally Total revenue. Date must be the only dimension. CSVs are limited to 1 MB and 366 unique daily rows. Currency is selected explicitly; no currency conversion occurs.
6. Use the planning calculator for visits/clicks, visit-to-sale conversion, average sale revenue, assumed CPC and your proposed monthly SEO fee. It calculates estimated sales, gross revenue and equivalent advertising value. These are assumptions, not measured earnings, profit, ROI, recommended prices or payment requests.
7. Download PDF/JSON for the audit and clearly labeled user-supplied supplement. Findings CSV exports audit checks only. Raw imported files are processed locally; daily totals and assumptions are sent only when exporting PDF/JSON, and are not saved to an account. Refreshing/leaving clears session data.

## Existing staff connection

The authorized staff-only `/api/seo/search-data` endpoint now also requests GA4 `totalRevenue`, reporting the property currency returned by Google. It requires the existing team login, service account and per-user property allowlist. Private data is not exposed in the public analyzer. Production credentials were not added or changed by this upgrade.

## Deliberate limits

No paid provider or new subscription was added. This does not recreate SEMrush/Ahrefs proprietary backlink databases, keyword volumes, keyword difficulty, ranking tracking, competitor traffic estimates or AI citation monitoring. The diagnostic score is not a Google/SEMrush score. No automated search-results scraping or inferred revenue is used.

## Primary references

- Search Console exports: https://support.google.com/webmasters/answer/12919797
- Search Console report: https://support.google.com/webmasters/answer/7576553
- GA4 metric definitions: https://developers.google.com/analytics/devguides/reporting/data/v1/api-schema

## Validation

TypeScript, existing SEO/security/integration tests, and focused tests for five-competitor validation, CSV date/duplicate/formula handling, missing-versus-zero metrics, calculator arithmetic and PDF supplements. Production deployment and browser checks are required before marking the release live.
