import { start } from "workflow/api";
import { z } from "zod";
import { auditStaff } from "@/lib/seo/job-auth";
import { assertSameOrigin, readJSON, parseAuditInput } from "@/lib/seo/input";
import { newFullCrawl } from "@/lib/seo/full-crawl";
import {
  createJob,
  saveJob,
  recentJobs,
  jobSummary,
  jobsConfigured,
  withJobLock,
} from "@/lib/seo/job-store";
import { apiError } from "@/lib/seo/http";
import { rateLimit } from "@/lib/seo/rate-limit";
import { aiConfigured } from "@/lib/seo/ai";
import { PublicError } from "@/lib/seo/security";
import { fullSiteAuditWorkflow } from "@/workflows/seo-audit";
export const runtime = "nodejs";
export const maxDuration = 60;
export async function GET() {
  try {
    const profile = await auditStaff();
    return Response.json(
      {
        configured: jobsConfigured(),
        ai: aiConfigured(),
        jobs: jobsConfigured() ? await recentJobs(profile.id) : [],
      },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch (e) {
    return apiError(e);
  }
}
export async function POST(request: Request) {
  try {
    assertSameOrigin(request);
    const profile = await auditStaff();
    await rateLimit(request, "audit");
    const schema = z
      .object({
        input: z.unknown(),
        maxPages: z.number().int().min(1).max(500),
        ai: z.boolean().default(false),
        aiLimit: z.number().int().min(1).max(500).default(20),
      })
      .strict();
    const parsed = schema.safeParse(await readJSON(request, 20000));
    if (!parsed.success)
      throw new PublicError(
        "Check the website, page limit and AI review limit.",
      );
    const input = parseAuditInput(parsed.data.input);
    const job = newFullCrawl(
      input,
      profile.id,
      parsed.data.maxPages,
      parsed.data.ai,
    );
    job.aiLimit = Math.min(parsed.data.aiLimit, job.maxPages);
    if (job.aiRequested && !aiConfigured())
      throw new PublicError(
        "Connect the AI provider before requesting AI page reviews.",
        503,
      );
    const created = await withJobLock(`owner:${profile.id}`, async () => {
      const active = (await recentJobs(profile.id)).filter((j) =>
        ["queued", "running"].includes(j.status),
      );
      if (active.length >= 2)
        throw new PublicError(
          "Two audits are already active. Cancel or finish one first.",
          429,
        );
      await createJob(job);
      return true;
    });
    if (!created)
      throw new PublicError(
        "Another audit is being created. Please try again shortly.",
        409,
      );
    try {
      await withJobLock(job.id, async () => {
        const run = await start(fullSiteAuditWorkflow, [job.id]);
        job.runId = run.runId;
        await saveJob(job);
      });
    } catch {
      job.status = "failed";
      job.error =
        "The workflow could not start. Use Resume after checking the deployment.";
      await saveJob(job);
    }
    return Response.json(jobSummary(job), {
      status: 202,
      headers: { "Cache-Control": "no-store" },
    });
  } catch (e) {
    return apiError(e);
  }
}
