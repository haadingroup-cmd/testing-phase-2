import { auditStaff } from "@/lib/seo/job-auth";
import { ownedJob } from "@/lib/seo/job-store";
import { schedules, saveSchedule, scheduleId } from "@/lib/seo/schedules";
import { assertSameOrigin, readJSON } from "@/lib/seo/input";
import { apiError } from "@/lib/seo/http";
import { PublicError } from "@/lib/seo/security";
import { z } from "zod";
export const runtime = "nodejs";
export async function GET() {
  try {
    const p = await auditStaff();
    return Response.json(
      {
        enabled: Boolean(process.env.CRON_SECRET),
        schedules: await schedules(p.id),
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
    const p = await auditStaff();
    const parsed = z
      .object({
        jobId: z.string().uuid(),
        cadence: z.enum(["daily", "weekly"]),
        enabled: z.boolean(),
      })
      .strict()
      .safeParse(await readJSON(request, 2000));
    if (!parsed.success)
      throw new PublicError("Choose a saved audit and daily or weekly repeat.");
    if (!process.env.CRON_SECRET)
      throw new PublicError(
        "The scheduled-audit worker is not configured yet.",
        503,
      );
    const job = await ownedJob(parsed.data.jobId, p.id);
    const id = scheduleId(p.id, job.input.url);
    const existing = (await schedules(p.id)).find((s) => s.id === id);
    const all = await schedules();
    if (!existing && all.length >= 50)
      throw new PublicError(
        "The scheduler has reached its 50-project capacity.",
        429,
      );
    const schedule = {
      id,
      owner: p.id,
      input: job.input,
      maxPages: job.maxPages,
      ai: job.aiRequested,
      aiLimit: job.aiLimit,
      cadence: parsed.data.cadence,
      enabled: parsed.data.enabled,
      nextAt: Date.now() + (parsed.data.cadence === "daily" ? 1 : 7) * 86400000,
      lastJob: existing?.lastJob,
    };
    await saveSchedule(schedule);
    return Response.json(schedule);
  } catch (e) {
    return apiError(e);
  }
}
