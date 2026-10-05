import type { SignedReport } from "./types";

export const recoveryKey = "haadinglobal:seo:recovery:v1";
export const recoveryLimit = 2_000_000;
/** Local data is only a candidate. The restore endpoint verifies its signature. */
export function recoveryCandidate(raw: string, now = Date.now()): SignedReport | null {
  if (raw.length > recoveryLimit) return null;
  try {
    const value = JSON.parse(raw);
    if (!value?.report || !/^[a-f0-9]{64}$/.test(value.signature || "") ||
        !Array.isArray(value.report.pages) || !value.report.pages.length ||
        typeof value.report.input?.url !== "string" ||
        !Number.isFinite(Date.parse(value.report.expiresAt)) ||
        Date.parse(value.report.expiresAt) <= now) return null;
    return value;
  } catch { return null; }
}
