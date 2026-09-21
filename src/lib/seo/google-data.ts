import { createSign } from "node:crypto";
import { PublicError, normalizeURL } from "./security";
import type { ProviderMetric } from "./types";
interface Mapping {
  gsc?: string;
  ga4?: string;
  allowedProfileIds: string[];
}
function mappingFor(raw: string, owner: string): Mapping {
  let mappings: Record<string, Mapping>;
  try {
    mappings = JSON.parse(process.env.SEO_GOOGLE_PROPERTIES_JSON || "{}");
  } catch {
    throw new PublicError("Google property mapping is invalid.", 503);
  }
  const host = normalizeURL(raw).hostname;
  const mapping = mappings && mappings[host];
  if (
    !mapping ||
    !Array.isArray(mapping.allowedProfileIds) ||
    !mapping.allowedProfileIds.includes(owner)
  )
    throw new PublicError(
      "Google data is not connected for this website and agency account.",
      403,
    );
  return mapping;
}
async function googleToken(scope: string) {
  let credentials: { client_email?: string; private_key?: string };
  try {
    credentials = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_JSON || "{}");
  } catch {
    throw new PublicError(
      "Google service credentials are not configured.",
      503,
    );
  }
  if (!credentials.client_email || !credentials.private_key)
    throw new PublicError("Google service credentials are not connected.", 503);
  const now = Math.floor(Date.now() / 1000),
    base64 = (value: object) =>
      Buffer.from(JSON.stringify(value)).toString("base64url");
  const body = `${base64({ alg: "RS256", typ: "JWT" })}.${base64({ iss: credentials.client_email, scope, aud: "https://oauth2.googleapis.com/token", iat: now, exp: now + 3600 })}`;
  const jwt = `${body}.${createSign("RSA-SHA256").update(body).sign(credentials.private_key, "base64url")}`;
  const response = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion: jwt,
    }),
    signal: AbortSignal.timeout(10000),
    cache: "no-store",
  });
  if (!response.ok)
    throw new PublicError(
      "Google could not authorize the service account. Check its configuration.",
      502,
    );
  const data = await response.json();
  if (typeof data.access_token !== "string")
    throw new PublicError(
      "Google authorization returned no access token.",
      502,
    );
  return data.access_token as string;
}
async function googlePost(url: string, body: unknown, scope: string) {
  const token = await googleToken(scope);
  const r = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(20000),
    cache: "no-store",
  });
  if (!r.ok)
    throw new PublicError(
      "Google data could not be retrieved. Check API enablement, property access and quota.",
      502,
    );
  return r.json();
}
export async function authorizedGoogleMetrics(raw: string, owner: string) {
  const mapping = mappingFor(raw, owner);
  const end = new Date(Date.now() - 3 * 86400_000),
    start = new Date(end.getTime() - 27 * 86400_000);
  const startDate = start.toISOString().slice(0, 10),
    endDate = end.toISOString().slice(0, 10);
  const metrics: ProviderMetric[] = [];
  const errors: string[] = [];
  if (mapping.gsc) {
    try {
      const data = await googlePost(
        `https://www.googleapis.com/webmasters/v3/sites/${encodeURIComponent(mapping.gsc)}/searchAnalytics/query`,
        { startDate, endDate, type: "web", dataState: "final", rowLimit: 1 },
        "https://www.googleapis.com/auth/webmasters.readonly",
      );
      const row = data.rows?.[0];
      for (const [key, label, unit, multiplier] of [
        ["clicks", "Google Search clicks", "", 1],
        ["impressions", "Google Search impressions", "", 1],
        ["ctr", "Google Search CTR", "%", 100],
        ["position", "Google Search average position", "", 1],
      ] as const) {
        metrics.push({
          key: `gsc-${key}`,
          label,
          value:
            typeof row?.[key] === "number"
              ? Math.round(row[key] * multiplier * 100) / 100
              : null,
          unit,
          source: "Google Search Console · authorized property totals",
          status: row
            ? `${startDate} to ${endDate}. Search Console aggregation; average position is not a fixed keyword ranking.`
            : "No rows returned for this period; do not infer a zero ranking or zero traffic.",
        });
      }
    } catch (e) {
      errors.push(
        e instanceof PublicError ? e.message : "Search Console request failed.",
      );
    }
  }
  if (mapping.ga4) {
    try {
      if (!/^\d+$/.test(mapping.ga4))
        throw new PublicError("GA4 property ID is invalid.");
      const data = await googlePost(
        `https://analyticsdata.googleapis.com/v1beta/properties/${mapping.ga4}:runReport`,
        {
          dateRanges: [{ startDate, endDate }],
          metrics: [
            { name: "sessions" },
            { name: "totalUsers" },
            { name: "keyEvents" },
          ],
        },
        "https://www.googleapis.com/auth/analytics.readonly",
      );
      const values = data.rows?.[0]?.metricValues;
      for (const [i, label] of [
        "GA4 sessions",
        "GA4 total users",
        "GA4 key events",
      ].entries()) {
        const number = values?.[i]?.value;
        metrics.push({
          key: `ga4-${i}`,
          label,
          value:
            number !== undefined && Number.isFinite(Number(number))
              ? Number(number)
              : null,
          source: "Google Analytics 4 · authorized property totals",
          status: `${startDate} to ${endDate}. All traffic channels; tracking, consent and reporting settings affect totals.`,
        });
      }
    } catch (e) {
      errors.push(e instanceof PublicError ? e.message : "GA4 request failed.");
    }
  }
  return {
    startDate,
    endDate,
    fetchedAt: new Date().toISOString(),
    metrics,
    errors,
  };
}
