import { createHmac, randomBytes, timingSafeEqual } from "node:crypto";
import type { AuditReport, SignedReport } from "./types";
import { PublicError } from "./security";
const devState = globalThis as typeof globalThis & { seoDevSecret?: string };
export function signingSecret() {
  const secret = process.env.AUDIT_SIGNING_SECRET;
  if (secret && secret.length >= 32) return secret;
  if (process.env.NODE_ENV === "production")
    throw new PublicError(
      "Report signing is being configured. Please try again later.",
      503,
    );
  return (devState.seoDevSecret ??= randomBytes(32).toString("hex"));
}
function signature(report: AuditReport) {
  return createHmac("sha256", signingSecret())
    .update(JSON.stringify(report))
    .digest("hex");
}
export function signReport(report: AuditReport): SignedReport {
  return { report, signature: signature(report) };
}
export function verifyReport(input: unknown): AuditReport {
  const signed = input as Partial<SignedReport> | undefined;
  if (
    !signed?.report ||
    typeof signed.signature !== "string" ||
    !/^[a-f0-9]{64}$/.test(signed.signature)
  )
    throw new PublicError(
      "This report could not be verified. Please run a fresh audit.",
      400,
    );
  const expected = signature(signed.report);
  if (
    !timingSafeEqual(
      Buffer.from(expected, "hex"),
      Buffer.from(signed.signature, "hex"),
    )
  )
    throw new PublicError(
      "The report has changed. Please run a fresh audit.",
      400,
    );
  if (
    !Number.isFinite(Date.parse(signed.report.expiresAt)) ||
    Date.parse(signed.report.expiresAt) < Date.now()
  )
    throw new PublicError(
      "This report has expired. Please run a fresh audit.",
      410,
    );
  return signed.report;
}
