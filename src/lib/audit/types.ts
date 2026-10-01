export type CheckStatus = "pass" | "warning" | "error";

export type AuditCategoryId =
  | "technical"
  | "content"
  | "onpage"
  | "performance"
  | "social"
  | "accessibility"
  | "conversion";

export const AUDIT_CATEGORIES: Array<{ id: AuditCategoryId; label: string; icon: string }> = [
  { id: "technical", label: "Technical SEO", icon: "settings" },
  { id: "onpage", label: "On-Page SEO", icon: "manage_search" },
  { id: "content", label: "Content", icon: "article" },
  { id: "performance", label: "Performance", icon: "speed" },
  { id: "social", label: "Social", icon: "share" },
  { id: "accessibility", label: "Accessibility", icon: "accessibility_new" },
  { id: "conversion", label: "Conversion", icon: "ads_click" },
];

export type AuditCheck = {
  id: string;
  category: AuditCategoryId;
  title: string;
  status: CheckStatus;
  /** What we found (e.g. "58 characters"). */
  value?: string;
  /** Why it matters. */
  why: string;
  /** How to fix it (shown for warnings and errors). */
  fix: string;
};

export type CategoryScore = {
  id: AuditCategoryId;
  label: string;
  score: number;
  pass: number;
  warning: number;
  error: number;
};

export type PageSpeedResult = {
  strategy: "mobile";
  performanceScore: number | null;
  lcpMs: number | null;
  cls: number | null;
  tbtMs: number | null;
  fcpMs: number | null;
};

export type AuditReport = {
  version: 1;
  requestedUrl: string;
  finalUrl: string;
  fetchedAt: string;
  httpStatus: number;
  responseTimeMs: number;
  htmlBytes: number;
  redirects: string[];
  title: string | null;
  score: number;
  categories: CategoryScore[];
  checks: AuditCheck[];
  pagespeed: PageSpeedResult | null;
  /** Data sources that were NOT used, so the report never over-claims. */
  limitations: string[];
};
