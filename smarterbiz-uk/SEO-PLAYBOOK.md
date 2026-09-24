# SmarterBiz.uk — SEO, AEO & GEO Playbook

## 1. Keyword research (UK, live data)

Pulled for **United Kingdom** on 24 Sep 2026 (seed: "ai tools for small business"). Volume is monthly UK searches and CPC is in USD. A high CPC signals strong commercial value.

| Keyword | UK volume | Competition | CPC | Intent | Target page |
|---|---:|---|---:|---|---|
| deepseek ai | 14,800 | Low | $2.28 | Info | /guides/is-deepseek-safe-for-uk-businesses, /tools/deepseek |
| ai detection tool | 2,900 | Medium | $3.04 | Info | /guides/best-ai-detection-tools |
| ai presentation maker | 2,400 | High | $5.68 | Commercial | /guides/best-ai-presentation-makers, /categories/presentations |
| ai workflows | 590 | Medium | $14.81 | Info | /guides/ai-workflows-for-small-business |
| ai comparison / ai model comparison | 390 + 390 | Low | $4.38 / $3.30 | Commercial | /guides/ai-model-comparison, /compare |
| ai ranking / ai model rankings | 880 + 260 | Low | $2.81 | Info | /guides/ai-model-comparison |
| ai tools for business | 260 | High | $23.87 | Commercial | / (home), /tools |
| best ai tools for businesses | 260 | High | $22.67 | Commercial | /guides/best-ai-tools-for-uk-small-businesses |
| ai tools list | 260 | Medium | $4.44 | Info | /tools |
| ai for small businesses | 210 | Medium | $11.83 | Commercial | /guides/how-to-use-ai-in-your-small-business |
| ai research tools / ai tools for research | 210 + 170 | High | $5.66 | Info | /guides/best-ai-research-tools, /categories/research |
| ai tools directory | 170 | Low | $3.11 | Nav | /tools |
| ai productivity tools | 110 | Medium | $7.73 | Commercial | /categories/productivity |
| ai research assistant | 110 | Medium | $7.64 | Info | /guides/best-ai-research-tools |
| ai tools for small businesses | 50 | Low | **$65.10** | Commercial | /guides/best-ai-tools-for-uk-small-businesses |
| best ai tools for small businesses | 40 | Low | $25.29 | Commercial | same as above |

**Takeaways**

- The "small business" phrases have modest volume but very high CPC: few searches, high buyer value, and low competition. The flagship guide targets this cluster.
- The volume winners are informational: DeepSeek, AI detection and presentation makers. Each has a dedicated guide to bring in top-of-funnel traffic, with internal links to the money pages.
- Comparison queries have low competition. Add more "X vs Y" pages; they're quick wins.

## 2. On-page (already built in)

- One H1 per page, keyword-led titles under ~65 characters and descriptions clipped to about 158 characters.
- A canonical URL on every page, `en-GB` hreflang, and breadcrumbs with BreadcrumbList schema.
- Heavy internal linking between guides, tools, categories and comparisons.
- Quick-answer boxes of about 40–60 words at the top of each guide. These are aimed at featured snippets and AI Overviews.
- FAQ sections with FAQPage schema on every guide, tool, category and comparison.
- Dates shown ("Updated …") plus `dateModified` in the schema, as freshness signals.

## 3. Technical SEO (already built in)

- Everything is statically pre-rendered, with a small JS payload and self-hosted fonts (no layout shift).
- `sitemap.xml`, `robots.txt`, `feed.xml` (RSS), dynamic 1200×630 OG images and a web manifest.
- Legacy URLs `/blog`, `/directory` and `/comparisons` 301-redirect to their new paths.
- `/search` and `/api/*` are `noindex`, so thin search pages stay out of the index.

## 4. GEO / LLM optimisation (getting cited by ChatGPT, Claude, Perplexity and Gemini)

- `llms.txt` (a site map for LLMs) and `llms-full.txt` (all content as plain text).
- AI crawlers are explicitly allowed in `robots.txt`.
- Facts are stated plainly and in a form models can quote: prices, dates, thresholds (e.g. MTD £50k/£30k/£20k).
- Consistent entity naming and Organization schema. **Add real `sameAs` profiles in `src/lib/site.ts`.**
- Primary sources are cited (GOV.UK, ICO), which models weight heavily.

## 5. Off-page plan (first 90 days)

1. **Foundations (week 1–2):** Google Business Profile isn't applicable to a publisher, so instead create brand profiles on LinkedIn (company page), X, YouTube, Medium and Crunchbase. Add them all to `SITE.social`.
2. **UK directories and citations:** Clutch-style SaaS directories, Product Hunt (launch the directory itself), BetaList, and UK startup lists such as Tech Nation alumni and local growth hubs.
3. **Digital PR (highest impact):** publish one original data piece per quarter, e.g. "What UK SMEs really pay for AI tools in 2026" (survey 100 business owners). Pitch it to UK trade press: Startups.co.uk, Small Business UK, Business Leader, Computer Weekly, AccountingWEB and regional business titles.
4. **Vendor outreach:** tell each reviewed vendor about their review and score. Many link to independent reviews or add them to their "press" or "awards" pages. Offer an "Editor's Choice" badge they can embed, which must link back.
5. **Guest expertise:** answer journalist requests (Qwoted, Featured.com, #journorequest on X) as an AI-for-SMEs expert.
6. **Communities:** add genuinely helpful answers in r/UKPersonalFinance, r/smallbusinessuk, r/ukbusiness and LinkedIn groups. Link only where it truly helps; no spam.
7. **Accountant and bookkeeper partnerships:** the MTD guide is a natural resource for UK accountancy firms to link to.

## 6. "Parasite SEO": the safe version

Publishing on high-authority platforms (LinkedIn Articles, Medium, Substack, YouTube and Reddit) can rank quickly. Google's **site reputation abuse** policy penalises third-party content placed on another site purely to exploit its ranking signals. Stay on the right side of it:

- Publish **original, useful summaries** on platforms where you own the account: LinkedIn articles, a Medium publication, YouTube explainers.
- When republishing a full article, set the **canonical** to the SmarterBiz.uk URL (Medium supports this), or publish a shorter take that links back.
- **Never** pay to place content on unrelated high-authority domains, and don't mass-produce pages.

Suggested cadence: turn every new guide into one LinkedIn article, one short YouTube or Shorts video (Synthesia or Descript work well) and one Medium post with a canonical link.

## 7. Content roadmap (next 12 articles)

Priority is ordered by commercial value and ease of ranking:

1. Best AI accounting software for sole traders UK (MTD ITSA)
2. ChatGPT vs Copilot for business
3. Best AI chatbot for small business websites UK
4. Best AI CRM for small business UK
5. Canva vs Gamma: best AI presentation maker
6. Best free AI tools for small business UK
7. AI tools for estate agents UK (niche vertical)
8. AI tools for accountants and bookkeepers UK
9. AI tools for tradespeople (quotes, invoicing, scheduling)
10. Is ChatGPT GDPR compliant? UK guide
11. AI for recruitment: UK GDPR and bias rules
12. Claude vs Gemini for business

Each article should follow the existing template: quick answer, takeaways, comparison table, tool cards, FAQs, internal links to 2+ tools and 1+ category, and an external link to an authoritative UK source.

## 8. Measurement

- Google Search Console: impressions and clicks per page, weekly.
- Bing Webmaster Tools: this also powers ChatGPT search results.
- Track brand mentions in AI answers monthly, for example by asking ChatGPT, Perplexity and Gemini "best AI tools for UK small businesses".
