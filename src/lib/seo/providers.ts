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
    return ["performance", "accessibility", "best-practices", "seo"].map(
      (key) => ({
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
      }),
    );
  }
}
// GSC, GA4, Bing and commercial SEO providers can implement this interface.
// They are not registered, connected or advertised as working integrations.
export const providers: SEODataProvider[] = [new PageSpeedProvider()];
