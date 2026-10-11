# SEO project state

Source plan: *HaadinGlobal Claude Implementation Prompt* + *SEO Audit 2026-10-10* (owner-supplied).
Read this file first in every new session, then continue the next unblocked task.

## Environment (Phase 0)
- Repository: `haadingroup-cmd/testing-phase-2`, default branch `main`.
- Production: Vercel deploys `main` to https://www.haadinglobal.com. Every PR gets a Vercel preview plus the `verify` GitHub check.
- Framework: Next.js 14 App Router. Content lives in `src/data/*.ts`, with no external CMS.
- Rollback: revert the merge commit on `main` (or Vercel → Deployments → Promote a previous deployment).
- Publishing authority: the owner asked Claude to make changes and deploy them itself (2026-10-10). Changes that need owner facts or decisions are listed in BLOCKERS.md and are not published until answered.

## Current phase
Batches 2 and 3 shipped 2026-10-11. Next: (1) owner requests indexing for the B8 URLs; (2) after 2–4 weeks, compare GSC (28 days vs 28 days) for the rewritten pages and the Arabic hubs; (3) case studies once B2 facts arrive; (4) apply the same deep rewrite to Google Ads and Meta Ads if those services stay a priority; (5) blog batch 1 (K01).

## Owner decisions (2026-10-11)
- B1: money-back guarantee removed.
- B2: clients gave permission. Results numbers and month/year per client are still needed; no invented dates or metrics.
- B3: no Arabic reviewer. Claude writes the Arabic; flag it for a later native review.
- B4: focus on SEO and development; markets KSA, UAE, Pakistan, UK and USA; Claude picks the niches (see GSC-ANALYSIS §6).
- B7: LinkedIn company page 135118415; address "Canal View Town, near Pakpattan Chowk Flyover, Sahiwal 57000"; hours Mon–Sat 9–5 PKT.
