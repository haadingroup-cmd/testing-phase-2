import "server-only";
import type { PageSpeedResult } from "@/lib/audit/types";

/**
 * Optional integration with Google PageSpeed Insights (Lighthouse lab data).
 * Enabled only when PAGESPEED_API_KEY is set — otherwise the audit reports
 * server-side performance indicators only and says so in its limitations.
 * API docs: https://developers.google.com/speed/docs/insights/v5/get-started
 */
export function isPageSpeedEnabled(): boolean {
  return Boolean(process.env.PAGESPEED_API_KEY);
}

type LighthouseAudit = { numericValue?: number };
type PsiResponse = {
  lighthouseResult?: {
    categories?: { performance?: { score?: number | null } };
    audits?: Record<string, LighthouseAudit | undefined>;
  };
};

export async function runPageSpeed(url: string): Promise<PageSpeedResult | null> {
  const key = process.env.PAGESPEED_API_KEY;
  if (!key) return null;
  const endpoint = new URL("https://www.googleapis.com/pagespeedonline/v5/runPagespeed");
  endpoint.searchParams.set("url", url);
  endpoint.searchParams.set("strategy", "mobile");
  endpoint.searchParams.set("category", "performance");
  endpoint.searchParams.set("key", key);
  try {
    const response = await fetch(endpoint, { signal: AbortSignal.timeout(45_000), cache: "no-store" });
    if (!response.ok) {
      console.error("[pagespeed] HTTP", response.status);
      return null;
    }
    const data = (await response.json()) as PsiResponse;
    const lh = data.lighthouseResult;
    const num = (id: string) => {
      const value = lh?.audits?.[id]?.numericValue;
      return typeof value === "number" ? value : null;
    };
    const perf = lh?.categories?.performance?.score;
    return {
      strategy: "mobile",
      performanceScore: typeof perf === "number" ? Math.round(perf * 100) : null,
      lcpMs: num("largest-contentful-paint"),
      cls: num("cumulative-layout-shift"),
      tbtMs: num("total-blocking-time"),
      fcpMs: num("first-contentful-paint"),
    };
  } catch (error) {
    console.error("[pagespeed] failed:", error instanceof Error ? error.message : error);
    return null;
  }
}
