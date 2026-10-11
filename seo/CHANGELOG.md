# SEO changelog

## 2026-10-11 — Batch 2 (GSC + Ahrefs findings, business facts)
**Evidence:** `seo/GSC-ANALYSIS-2026-10-10.md`, Ahrefs Site Audit 2026-10-11.
**Changed**
- Share metadata: new `pageMeta()` helper. 11 static pages no longer inherit the homepage og:url, title and description. City pages get og:type; team pages get og:url, longer descriptions and titles that fit. Short and long descriptions rewritten to 139–156 characters.
- Internal links: related posts ranked by shared tags (posts at the end of the list were linked only from /blog); a "Guides on …" block on every service page links 1–3 matching posts.
- London → UK and New York → USA hubs (301). Google had crawled them but declined to index them, and they had 0 impressions.
- Service FAQ timing is now service-specific and honest (the old "1–3 months" contradicted "3–6 months"). Removed the fake "Limited slots available this month".
- Owner decisions: removed the 14-day money-back guarantee (B1); LinkedIn now points to the company page (B7); professional address on the Contact page, footer and schema, with directions shown separately (B7).
- robots.txt: removed the `Host:` line, which Google ignores and which caused the Search Console warning.

**Rollback:** revert the merge commit.

## 2026-10-10 — Audit batch 1 (defects, claims, measurement)
**Changed**
- `/agency/*`: fixed UK/USA H1 ("…UK Businessesthe UK") and "your the UK business"; Saudi Arabia and Qatar URLs now have a country H1; removed the unsourced 5-star decoration; hid the empty "Nearby Cities" block; market schema is now `Service` provided by `#org` (no implied extra offices).
- Homepage hero: "ROI Guaranteed" → "ROI-Focused Reporting". Pricing, trust badges and service cards: "Cancel anytime" → "30 days' notice to cancel" (matches Terms §6).
- `/services/*` (12): the Quick answer no longer repeats the hero; it states price, included items and billing terms.
- Blog: AI-search and SEO-trends posts corrected against Google/OpenAI documentation, with sources and `Updated Oct 10, 2026`; the "HaadinGlobal Team" author is now an Organization in schema; added `dateModified` and sitemap lastmod from `updated`.
- Forms: labels associated with controls; autocomplete hints. Popup no longer covers content on first view (desktop/tablet only, after 50% scroll).
- GA4: WhatsApp clicks now send `contact_click` instead of `generate_lead`.
- Arabic service blurbs: removed the unsupported "6x+ ROI" and "millions of views".

**Expected effect:** cleaner country-page relevance, no contradiction between promises and Terms, more accurate lead counts. Ranking effect unknown until GSC data is compared (28 days vs 28 days).

**Watch out:** GA4 `generate_lead` counts will drop because WhatsApp clicks no longer count. This is a correction, not a loss of leads. Compare WhatsApp interest using `contact_click`.

**Rollback:** revert the merge commit of this PR on `main`.
