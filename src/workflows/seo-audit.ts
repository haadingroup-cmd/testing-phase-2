import { sleep } from "workflow";

async function crawlStep(id: string) {
  "use step";
  const { getJob, saveJob, withJobLock } = await import("@/lib/seo/job-store");
  const { advanceFullCrawl } = await import("@/lib/seo/full-crawl");
  const result = await withJobLock(id, async () => {
    const job = await getJob(id);
    if (!job || ["cancelled", "failed", "completed"].includes(job.status))
      return { done: true, delay: 0 };
    const delay = await advanceFullCrawl(job);
    await saveJob(job);
    return {
      done: ["completed", "cancelled", "failed"].includes(job.status),
      delay,
    };
  });
  return result || { done: false, delay: 5000 };
}
async function aiStep(id: string) {
  "use step";
  const { getJob, saveJob, withJobLock } = await import("@/lib/seo/job-store");
  const { fullCrawlReport } = await import("@/lib/seo/full-crawl");
  const { generateAI, aiConfigured } = await import("@/lib/seo/ai");
  return (
    (await withJobLock(id, async () => {
      const job = await getJob(id);
      if (!job || job.status !== "completed" || !job.aiRequested) return true;
      if (!aiConfigured()) {
        job.aiStatus =
          "AI provider is not configured. No AI review was performed.";
        await saveJob(job);
        return true;
      }
      job.aiReviews ||= {};
      const selected = job.pages.slice(0, job.aiLimit);
      const page = selected.find((p) => !job.aiReviews![p.url]);
      if (!page) {
        job.aiStatus = `AI reviews finished: ${Object.values(job.aiReviews).filter((r) => r.result).length} succeeded, ${Object.values(job.aiReviews).filter((r) => r.error).length} failed. Scope: first ${selected.length} pages. Suggestions require review; rankings and AI search visibility are not measured.`;
        await saveJob(job);
        return true;
      }
      const report = fullCrawlReport(job);
      report.pages = [page];
      report.checks = page.checks;
      try {
        job.aiReviews[page.url] = {
          result: await generateAI(report, "content"),
        };
      } catch {
        job.aiReviews[page.url] = {
          error: "AI provider request failed; this page was not assessed.",
        };
      }
      const done = Object.keys(job.aiReviews).length;
      const failed = Object.values(job.aiReviews).filter((r) => r.error).length;
      job.aiStatus = `AI page reviews: ${done - failed} succeeded, ${failed} failed, ${selected.length - done} pending. Scope: first ${selected.length} crawled pages.`;
      await saveJob(job);
      return done >= selected.length;
    })) ?? false
  );
}
async function failStep(id: string) {
  "use step";
  const { getJob, saveJob, withJobLock } = await import("@/lib/seo/job-store");
  await withJobLock(id, async () => {
    const job = await getJob(id);
    if (job && job.status !== "cancelled") {
      job.status = "failed";
      job.error =
        "Background execution stopped. Use Resume to continue from its last saved checkpoint.";
      await saveJob(job);
    }
  });
}
export async function fullSiteAuditWorkflow(id: string) {
  "use workflow";
  try {
    let crawlDone = false;
    for (let i = 0; i < 10000; i++) {
      const state = await crawlStep(id);
      if (state.done) {
        crawlDone = true;
        break;
      }
      await sleep(new Date(Date.now() + Math.max(500, state.delay)));
    }
    if (!crawlDone) {
      await failStep(id);
      return { id };
    }
    let aiDone = false;
    for (let i = 0; i < 1000; i++) {
      if (await aiStep(id)) {
        aiDone = true;
        break;
      }
      await sleep("1s");
    }
    if (!aiDone) await failStep(id);
  } catch {
    await failStep(id);
  }
  return { id };
}
