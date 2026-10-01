import { timingSafeEqual } from "node:crypto";
import { start } from "workflow/api";
import { supabaseAdmin } from "@/lib/supabase-server";
import { schedules, saveSchedule } from "@/lib/seo/schedules";
import { newFullCrawl } from "@/lib/seo/full-crawl";
import {
  createJob,
  saveJob,
  getJob,
  withJobLock,
  jobsConfigured,
} from "@/lib/seo/job-store";
import { fullSiteAuditWorkflow } from "@/workflows/seo-audit";
import { apiError } from "@/lib/seo/http";
import { PublicError } from "@/lib/seo/security";
export const runtime = "nodejs";
export const maxDuration = 120;
export async function GET(request: Request) {
  try {
    const secret = process.env.CRON_SECRET;
    const auth = request.headers.get("authorization") || "";
    const expected = `Bearer ${secret}`;
    if (
      !secret ||
      secret.length < 32 ||
      auth.length !== expected.length ||
      !timingSafeEqual(Buffer.from(auth), Buffer.from(expected))
    )
      throw new PublicError("Unauthorized", 401);
    if (!jobsConfigured())
      throw new PublicError("Background audit storage is not configured.", 503);
    let started = 0;
    const failures: string[] = [];
    for (const schedule of (await schedules())
      .filter((s) => s.enabled && s.nextAt <= Date.now())
      .slice(0, 20)) {
      try {
        await withJobLock(`schedule-${schedule.id}`, async () => {
          const current = (await schedules(schedule.owner)).find(
            (s) => s.id === schedule.id,
          );
          if (!current || !current.enabled || current.nextAt > Date.now())
            return;
          const { data: profile } = await supabaseAdmin()
            .from("profiles")
            .select("role")
            .eq("id", current.owner)
            .single();
          if (!profile || !["admin", "manager"].includes(profile.role)) {
            current.enabled = false;
            await saveSchedule(current);
            return;
          }
          if (current.lastJob) {
            const previous = await getJob(current.lastJob);
            if (previous && ["running", "queued"].includes(previous.status))
              return;
          }
          const job = newFullCrawl(
            current.input,
            current.owner,
            current.maxPages,
            current.ai,
          );
          job.aiLimit = current.aiLimit;
          await createJob(job);
          current.lastJob = job.id;
          current.nextAt =
            Date.now() + (current.cadence === "daily" ? 1 : 7) * 86400000;
          await saveSchedule(current);
          await withJobLock(job.id, async () => {
            try {
              const run = await start(fullSiteAuditWorkflow, [job.id]);
              job.runId = run.runId;
            } catch {
              job.status = "failed";
              job.error =
                "Scheduled workflow did not start; resume from the dashboard.";
            }
            await saveJob(job);
          });
          started++;
        });
      } catch {
        failures.push(schedule.id);
      }
    }
    return Response.json(
      { started, failures },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch (e) {
    return apiError(e);
  }
}
