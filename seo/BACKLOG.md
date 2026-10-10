# SEO backlog

IDs follow the 2026-10-10 audit (H01–H18). Status as of 2026-10-10.

| ID | URL / template | Evidence (reproduced 2026-10-10) | Action | Priority | Status |
|---|---|---|---|---|---|
| H02 | `/agency/[slug]` UK, USA | H1 read "…for UK Businessesthe UK"; copy said "your the UK business" | Headline rendering fixed for any city not in the headline; adjective form drops "the" | P1 | deployed |
| H03 | `/agency/digital-marketing-agency-saudi-arabia`, `…-qatar` | H1 "in Riyadh" / "in Doha" on country URLs | Country H1 (Saudi Arabia, Qatar); Riyadh/Jeddah/Doha kept in body copy | P1 | deployed |
| — | `/agency/[slug]` | 5 decorative stars with no rating source; empty "Nearby Cities" heading on Dubai/Saudi/Qatar | Stars removed; nearby block only when it has links | P1 | deployed |
| H14 | `/agency/[slug]` schema | Extra unlinked ProfessionalService entity per market | `Service` with `provider` → `#org` and `areaServed` | P2 | deployed |
| H04 | Homepage hero | "ROI Guaranteed" vs Terms ("cannot be guaranteed") | Changed to "ROI-Focused Reporting" | P1 | deployed |
| H05 | Pricing, trust badges, service cards | "Cancel anytime" vs Terms "30 days written notice" | Visible copy aligned to Terms. **14-day money-back: owner decision (B1)** | P1 | partly deployed / blocked |
| H07 | `/services/[slug]` (all 12) | Quick answer repeated hero text ("means haadinGlobal provides…") | Quick answer now gives price, included items and billing terms | P1 | deployed |
| H08 | 2 blog posts (AI search, SEO trends) | Training vs search bots conflated; "schema dramatically increases…"; unsourced "60% zero-click" | Rewritten against Google/OpenAI docs, sources linked, `dateModified` set | P1 | deployed |
| H13 | `/blog/[slug]` schema | "HaadinGlobal Team" marked up as Person | Team → Organization `#org`; named authors link to team profile | P2 | deployed |
| H18 | Consultation, contact, landing, lead magnet, popup forms | Controls had no associated label | `htmlFor`/`id` pairs or `aria-label`; autocomplete hints | P2 | deployed |
| H12 | Entry popup | Modal covered content 3.5 s after first load | Desktop/tablet only, after 50% scroll; phones keep sticky bar | P2 | deployed |
| M01 | GA4 | WhatsApp clicks fired `generate_lead` (the key event) | WhatsApp clicks → `contact_click`; `generate_lead` only after a successful form submit | P1 | deployed |
| — | Arabic service blurbs | Meta "6x+ ROI", TikTok "millions of views" (unsupported) | Neutral Arabic descriptions | P1 | deployed |
| H01 | Arabic | Toggle on the same URL, partial translation, no hreflang | Stable `/ar/...` pages after a fluent reviewer is available (B3) | P1 | blocked |
| H06 | Portfolio | Cards only, no case-study URLs | 3 case studies (Royal Painter Dubai, Kaashan, + 1) need permission and facts (B2) | P1 | blocked |
| H09 | GSC / GA4 | No baseline | Exports (B5) | P1 | blocked |
| H10 | UK / USA / Dubai hubs | Broad, price-led | Choose one niche per market (B4) | P2 | pending |
| H11 | Consultation | Requires name + WhatsApp + email; PKR budget only | One preferred contact channel + country/currency | P2 | pending |
| H15 | Contact page | Street address only in schema | Owner decides the public address (B7) | P2 | blocked |
| H16 | Footer LinkedIn | `/in/haadinglobal` personal path | Real company page URL (B7) | P2 | blocked |
| H17 | Service / blog bodies | Few contextual links | Add links to cases and market hubs once case studies exist | P2 | pending |
| K01 | Blog batch 1 | — | Seeds: how-to-rank-in-ai-search-2026, digital-marketing-cost-dubai-uae, digital-marketing-cost-pakistan, shopify-vs-wordpress-pakistan-ecommerce, local-seo-guide-small-business-pakistan | P2 | blocked on B6 |
