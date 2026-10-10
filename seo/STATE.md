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
Phase 2 (defects and commercial clarity): first batch shipped in the PR of 2026-10-10. See CHANGELOG.md.

## Next three actions
1. Owner answers BLOCKERS B1–B4. Then align the money-back wording, publish the case studies and set the hero/stat claims.
2. Phase 1 baseline: as soon as the GSC and Ahrefs exports arrive (B5, B6), fill BASELINE.md and classify the Ahrefs 404 URLs.
3. Phase 6: first 5-post keyword batch. Seed list is in BACKLOG.md K01; the export request is B6.

## Status keys
`pending`, `in_progress`, `blocked`, `ready_for_review`, `deployed`, `verified`.
