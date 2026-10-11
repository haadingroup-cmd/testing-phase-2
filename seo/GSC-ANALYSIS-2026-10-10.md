# Search Console analysis — 2026-10-10 export (last 3 months, Web)

Sources: GSC Performance export (Jul 30 – Oct 8, 2026), Page indexing export and drilldowns, Ahrefs Site Audit (Oct 11).

## 1. Totals
- **47 clicks, 1,457 impressions.** Pakistan has 41 clicks (position 13.8). The US has 389 impressions but 0 clicks (position 61). The UAE has 98 impressions and 0 clicks (position 68).
- **Mobile performs much better than desktop.** Mobile: CTR 6.4%, average position 19.8. Desktop: CTR 2.3%, average position 52 (mostly far-away blog impressions).

## 2. Where the clicks come from
- **37 of 47 clicks land on the homepage** (position 10.6, CTR 19.6%).
- **The query table shows only 1 click** ("digital pakpattan"). The other 46 clicks come from queries Google hides for privacy.
- A ~20% homepage CTR at position ~10 is typical of navigational searches: people who already know the name, or near-brand searches. This fits the owner's sense that clicks are not new buyers. GSC cannot show which queries they were; GA4 landing-page engagement and leads by source can.
- **Irrelevant impressions found in the visible queries:**
  - *Name look-alikes:* "haidaon", "hagley digital marketing agency", "handeline global", "hardal ajans", "domain haidaroofing.com", "mash global qatar", "globital faisalabad".
  - *Lead scrapers:* `inurl:contact ("@gmail.com" …) "marketing agency"` and `"offshore marketers" -site:…`. These are people harvesting agency emails, not buyers.
  - *Global informational blog queries ranking 60–100:* AEO trends 2025, "top 10 global seo influencers", Shopify CRO, D2C ROAS. These come from the US, India and the Philippines and have no buying intent for this agency.

## 3. What actually ranks (commercial, page 1–2)
| Page | Impressions | Position | Note |
|---|---|---|---|
| /agency/…-pakpattan | 120 | 9.0 | 4 clicks; "digital pakpattan" |
| /services/web-development | 102 | 4.6 | **0 clicks** — title/snippet or intent mismatch |
| /services | 81 | 6.9 | 1 click |
| /agency/…-okara | 66 | 10.2 | 0 clicks |
| /agency/…-sargodha | 47 | 17.2 | 1 click |
| /agency/…-jhang | 42 | 10.3 | |
| /agency/…-faisalabad | 29 | 19.1 | 1 click |
| /agency/…-uk | 59 | 20.3 | |
| /agency/…-usa | 26 | 10.8 | |
| /agency/…-sahiwal | 10 | 4.0 | headquarters page, very little demand captured |

**Conclusion:** the only market where the site is competitive today is local Punjab (tier-2 cities), plus web development.

## 4. The biggest problem: money pages are not indexed
- **Discovered – never crawled** (28): /services/seo, meta-ads, google-ads, shopify, social-media, tiktok-ads, branding, content-writing, graphic-design, ai-automation, the old youtube-automation URL and /terms. The rest are the replaced site's URLs (now 308 redirects).
- **Crawled – not indexed** (5): /agency/…-london, /agency/…-new-york, /blog/tiktok-ads-vs-meta-ads-2026, plus the sitemap and a font file (both normal).
- **Indexed: 43, not indexed: 40.**
- **Cause (judgement):** internal links, robots and canonicals are correct (verified). The 12 service pages come from one template, have ~600 words each, near-identical FAQ patterns and a contradictory timeline. Google discovered them but chose not to spend crawl on them. London/New York duplicate the UK/USA hubs without unique proof.

## 5. Ahrefs Site Audit (Oct 11)
- Health 100, 0 errors.
- **Warnings, reproduced:**
  - 11 pages inherit the homepage og:url, title and description, so share previews are wrong.
  - 18 city pages have no og:type; 6 team pages have no og:url.
  - 9 descriptions are too short and 2 too long; the team titles are too long.
  - Blogs at the end of the list are linked only from /blog, because the related-posts logic always picked the top posts.

## 6. Decisions taken from this data
1. Make the service pages genuinely unique and deep, starting with **SEO, Web Development and Shopify** (owner focus). Remove the template FAQ contradictions and fake urgency. The owner then requests indexing for these URLs.
2. Consolidate London → UK and New York → USA with 301s. Google declined to index them, and they had 0 impressions.
3. Strengthen the Punjab city pages that already rank, by adding links to the right service pages.
4. Fix the web-development snippet (position 4.6, 0 clicks).
5. Stop chasing global informational blog traffic. Re-point blog internal links to services and use tag-based related posts.
6. Niche positioning for SEO and development:
   - **Pakistan:** local businesses in Punjab.
   - **UAE:** home-service companies (painting, maintenance, cleaning); proof is Royal Painter Dubai.
   - **KSA:** event and service businesses; proof is the Abdulla Events project, which is in progress.
   - **UK:** Shopify development and SEO for small online stores.
   - **USA:** white-label SEO and web development for US agencies.
