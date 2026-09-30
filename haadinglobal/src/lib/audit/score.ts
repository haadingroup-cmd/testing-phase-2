import { AUDIT_CATEGORIES, type AuditCheck, type CategoryScore } from "@/lib/audit/types";

const WEIGHT = { pass: 1, warning: 0.5, error: 0 } as const;

/** Scores are derived only from checks that actually ran: pass = 1, warning = 0.5, error = 0. */
export function scoreChecks(checks: AuditCheck[]): { score: number; categories: CategoryScore[] } {
  const categories = AUDIT_CATEGORIES.map(({ id, label }) => {
    const items = checks.filter((c) => c.category === id);
    const pass = items.filter((c) => c.status === "pass").length;
    const warning = items.filter((c) => c.status === "warning").length;
    const error = items.filter((c) => c.status === "error").length;
    const total = items.reduce((sum, c) => sum + WEIGHT[c.status], 0);
    const score = items.length ? Math.round((total / items.length) * 100) : 0;
    return { id, label, score, pass, warning, error };
  }).filter((c) => c.pass + c.warning + c.error > 0);

  const all = checks.reduce((sum, c) => sum + WEIGHT[c.status], 0);
  const score = checks.length ? Math.round((all / checks.length) * 100) : 0;
  return { score, categories };
}

export function scoreTone(score: number): "good" | "ok" | "poor" {
  if (score >= 80) return "good";
  if (score >= 50) return "ok";
  return "poor";
}
