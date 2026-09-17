import { assertSameOrigin, parseAuditInput, readJSON } from "@/lib/seo/input";
import { rateLimit } from "@/lib/seo/rate-limit";
import { crawlWebsite } from "@/lib/seo/crawler";
import { signReport, signingSecret } from "@/lib/seo/seal";
import { apiError } from "@/lib/seo/http";
import { friendlyError } from "@/lib/seo/security";
import { aiConfigured } from "@/lib/seo/ai";
import type { AuditEvent } from "@/lib/seo/types";
export const runtime = "nodejs";
export const maxDuration = 120;
export async function POST(request: Request) {
  try {
    assertSameOrigin(request);
    const input = parseAuditInput(await readJSON(request, 16000));
    signingSecret();
    await rateLimit(request, "audit");
    const encoder = new TextEncoder();
    const abort = new AbortController();
    request.signal.addEventListener("abort", () => abort.abort(), {
      once: true,
    });
    const stream = new ReadableStream({
      async start(controller) {
        let active = true;
        const send = (event: AuditEvent) => {
          if (active) {
            try {
              controller.enqueue(encoder.encode(JSON.stringify(event) + "\n"));
            } catch {
              active = false;
              abort.abort();
            }
          }
        };
        try {
          const report = await crawlWebsite(input, {
            signal: abort.signal,
            progress: (message, completed) =>
              send({ type: "progress", message, completed }),
          });
          report.aiStatus = aiConfigured()
            ? "AI suggestions are available on request. They use page excerpts and the business context you provide."
            : "AI provider not configured. Recommendations below are evidence-based audit rules.";
          send({
            type: "progress",
            message: "Calculating measured checks and preparing your report…",
            completed: report.pages.length,
          });
          send({ type: "complete", data: signReport(report) });
        } catch (error) {
          send({ type: "error", message: friendlyError(error) });
        } finally {
          if (active) controller.close();
        }
      },
      cancel() {
        abort.abort();
      },
    });
    return new Response(stream, {
      headers: {
        "Content-Type": "application/x-ndjson; charset=utf-8",
        "Cache-Control": "no-store, no-transform",
        "X-Accel-Buffering": "no",
      },
    });
  } catch (error) {
    return apiError(error);
  }
}
