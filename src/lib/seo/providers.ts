import type { ProviderMetric } from "./types";
import { PublicError, resolvePublic, normalizeURL } from "./security";
export interface SEODataProvider {
  id: string;
  name: string;
  isConfigured(): boolean;
  getMetrics(url: string): Promise<ProviderMetric[]>;
}
export function unavailableMetrics(): ProviderMetric[] {
  return [
    "Organic traffic",
    "Google positions",
    "Backlinks",
    "Domain authority",
    "Search volume",
    "Keyword difficulty",
    "CPC",
  ].map((label) => ({
    key: label.toLowerCase().replaceAll(" ", "-"),
    label,
    value: null,
    source: "Unavailable",
    status:
      "Data unavailable from the current source. Connect an authorized SEO data provider to unlock this metric.",
  }));
}
export class PageSpeedProvider implements SEODataProvider {
  id = "pagespeed";
  name = "Google PageSpeed Insights";
  isConfigured() {
    return Boolean(process.env.PAGESPEED_API_KEY);
  }
  async getMetrics(raw: string): Promise<ProviderMetric[]> {
    if (!this.isConfigured())
      throw new PublicError(
        "PageSpeed Insights is not configured on this deployment.",
        503,
      );
    const url = normalizeURL(raw);
    await resolvePublic(url.hostname);
    const endpoint = new URL(
      "https://www.googleapis.com/pagespeedonline/v5/runPagespeed",
    );
    endpoint.searchParams.set("url", url.href);
    endpoint.searchParams.set("strategy", "mobile");
    endpoint.searchParams.set("key", process.env.PAGESPEED_API_KEY!);
    for (const c of ["performance", "accessibility", "best-practices", "seo"])
      endpoint.searchParams.append("category", c);
    const response = await fetch(endpoint, {
      signal: AbortSignal.timeout(70000),
    });
    if (!response.ok)
      throw new PublicError(
        "PageSpeed Insights could not complete the test. Its quota, credentials or the target website may need attention.",
        502,
      );
    const data = await response.json();
    const cats = data.lighthouseResult?.categories;
    if (!cats)
      throw new PublicError(
        "PageSpeed Insights did not return Lighthouse categories.",
        502,
      );
    const metrics: ProviderMetric[] = [
      "performance",
      "accessibility",
      "best-practices",
      "seo",
    ].map((key) => ({
      key,
      label: key,
      value:
        typeof cats[key]?.score === "number"
          ? Math.round(cats[key].score * 100)
          : null,
      unit: "/100",
      source: "Google PageSpeed Insights · mobile lab test",
      status:
        typeof cats[key]?.score === "number"
          ? `Fetched ${new Date().toISOString()}; lab conditions, not a ranking prediction.`
          : "Data unavailable from the current source.",
    }));
    const audits = data.lighthouseResult?.audits || {};
    for (const [key, label, unit] of [
      ["largest-contentful-paint", "LCP (mobile lab)", "ms"],
      ["cumulative-layout-shift", "CLS (mobile lab)", ""],
      ["total-blocking-time", "Total blocking time (mobile lab)", "ms"],
    ]) {
      const value = audits[key]?.numericValue;
      metrics.push({
        key: `lab-${key}`,
        label,
        value: typeof value === "number" ? Math.round(value * 100) / 100 : null,
        unit,
        source: "Google PageSpeed Insights · mobile lab test",
        status:
          "A synthetic test of this URL. Lab results do not establish real-user Core Web Vitals.",
      });
    }
    const field = data.loadingExperience?.metrics;
    for (const [key, label, unit, divisor] of [
      ["LARGEST_CONTENTFUL_PAINT_MS", "LCP (URL field p75)", "ms", 1],
      ["INTERACTION_TO_NEXT_PAINT", "INP (URL field p75)", "ms", 1],
      ["CUMULATIVE_LAYOUT_SHIFT_SCORE", "CLS (URL field p75)", "", 100],
    ] as const) {
      const value = field?.[key]?.percentile;
      metrics.push({
        key: `field-${key}`,
        label,
        value: typeof value === "number" ? value / divisor : null,
        unit,
        source: "Google PageSpeed Insights · CrUX URL field data",
        status:
          typeof value === "number"
            ? "75th percentile from the provider's real-user dataset. URL-level field data is separate from the lab run."
            : "No URL-level field data returned. Missing data does not mean a failed Core Web Vitals assessment.",
      });
    }
    return metrics;
  }
}
// Authorized GSC/GA4 totals use the separate staff-only google-data adapter.
// Bing and commercial SEO datasets are not connected.
export const providers: SEODataProvider[] = [new PageSpeedProvider()];
