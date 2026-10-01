import { start, getRun } from "workflow/api";
import { auditStaff } from "@/lib/seo/job-auth";
import {
  ownedJob,
  saveJob,
  jobSummary,
  withJobLock,
} from "@/lib/seo/job-store";
import { fullCrawlReport } from "@/lib/seo/full-crawl";
import { assertSameOrigin, readJSON } from "@/lib/seo/input";
import { apiError } from "@/lib/seo/http";
import { PublicError } from "@/lib/seo/security";
import { fullSiteAuditWorkflow } from "@/workflows/seo-audit";
export const runtime = "nodejs";
export const maxDuration = 60;
type Context = { params: { id: string } };
export async function GET(request: Request, { params }: Context) {
  try {
    const profile = await auditStaff(),
      job = await ownedJob(params.id, profile.id);
    const report = fullCrawlReport(job);
    const raw = Number(new URL(request.url).searchParams.get("offset") || 0);
    const offset = Number.isFinite(raw) ? Math.max(0, Math.floor(raw)) : 0;
    return Response.json(
      {
        ...jobSummary(job),
        scores: report.scores,
        overall: report.overall,
        coverage: report.coverage,
        partial: report.partial,
        warnings: report.warnings,
        counts: {
          critical: report.checks.filter((c) => c.status === "critical").length,
          warning: report.checks.filter((c) => c.status === "warning").length,
          passed: report.checks.filter((c) => c.status === "passed").length,
          unavailable: report.checks.filter((c) => c.status === "unavailable")
            .length,
        },
        pages: job.pages.slice(offset, offset + 10).map((p) => ({
          url: p.url,
          title: p.title,
          score: p.score,
          checks: p.checks,
          ai: job.aiReviews?.[p.url],
        })),
        skippedURLs: job.skipped.slice(offset, offset + 20),
        offset,
        totalPages: job.pages.length,
      },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch (e) {
    return apiError(e);
  }
}
export async function POST(request: Request, { params }: Context) {
  try {
    assertSameOrigin(request);
    const profile = await auditStaff();
    const body = (await readJSON(request, 1000)) as { action?: string };
    if (!["cancel", "resume"].includes(body.action || ""))
      throw new PublicError("Choose cancel or resume.");
    const result = await withJobLock(params.id, async () => {
      const job = await ownedJob(params.id, profile.id);
      if (body.action === "cancel") {
        job.status = "cancelled";
        job.aiStatus = "Further work cancelled; completed evidence retained.";
        await saveJob(job);
        return jobSummary(job);
      }
      if (job.runId) {
        const run = getRun(job.runId);
        const status = await run.status;
        if (!["completed", "failed", "cancelled"].includes(status))
          throw new PublicError(
            "This workflow is still active. Wait for its next checkpoint.",
            409,
          );
      }
      if (job.status === "completed" && !job.aiRequested)
        throw new PublicError(
          "This crawl is already complete. Start a new audit for fresh data.",
        );
      if (job.queue.length) job.status = "running";
      else if (job.pages.length) job.status = "completed";
      else
        throw new PublicError(
          "No resumable pages remain; start a fresh audit.",
        );
      delete job.error;
      await saveJob(job);
      const run = await start(fullSiteAuditWorkflow, [job.id]);
      job.runId = run.runId;
      await saveJob(job);
      return jobSummary(job);
    });
    if (!result)
      throw new PublicError(
        "A crawl step is saving its results. Please try again shortly.",
        409,
      );
    return Response.json(result);
  } catch (e) {
    return apiError(e);
  }
}
