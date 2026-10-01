export const categories = [
  "technical",
  "onpage",
  "content",
  "performance",
  "local",
  "social",
] as const;
export type Category = (typeof categories)[number];
export type Status = "critical" | "warning" | "passed" | "unavailable";
export type Priority = "First" | "High" | "Medium" | "Low";
export interface AuditInput {
  url: string;
  businessName?: string;
  businessType?: string;
  country?: string;
  city?: string;
  language?: string;
  keyword?: string;
  competitors: string[];
  social: Partial<
    Record<"facebook" | "instagram" | "youtube" | "tiktok" | "linkedin", string>
  >;
}
export interface Check {
  id: string;
  category: Category;
  status: Status;
  title: string;
  explanation: string;
  fix: string;
  evidence: string;
  pageUrl: string;
  priority: Priority;
  weight: number;
  source: string;
  difficulty: "Easy" | "Moderate" | "Developer";
}
export interface Link {
  url: string;
  text: string;
  internal: boolean;
}
export interface Page {
  url: string;
  requestedUrl: string;
  status: number;
  redirects: string[];
  title: string;
  description: string;
  h1: string[];
  headings: { level: number; text: string }[];
  canonical: string;
  robots: string;
  xRobots: string;
  lang: string;
  viewport: string;
  charset: string;
  wordCount: number;
  text: string;
  links: Link[];
  images: {
    total: number;
    missingAlt: number;
    emptyAlt: number;
    examples: string[];
  };
  schema: {
    types: string[];
    errors: string[];
    objects: Record<string, unknown>[];
  };
  social: string[];
  og: Record<string, string>;
  twitter: Record<string, string>;
  contentType: string;
  bytes: number;
  transferBytes: number;
  fetchMs: number;
  compression: string;
  cacheControl: string;
  favicon: boolean;
  mixedContent: string[];
  phone: string[];
  email: string[];
  maps: string[];
  dateModified: string[];
  score: number | null;
  checks: Check[];
}
export interface CategoryScore {
  category: Category;
  score: number | null;
  weight: number;
  evaluated: number;
  unavailable: number;
}
export interface Resource {
  url: string;
  status: number | null;
  state: "found" | "missing" | "unavailable";
  detail: string;
}
export interface Competitor {
  url: string;
  page?: Page;
  error?: string;
}
export interface ProviderMetric {
  key: string;
  label: string;
  value: number | null;
  unit?: string;
  source: string;
  status: string;
}
export interface AIResult {
  headline: string;
  explanation: string;
  items: { label: string; value: string }[];
  source: string;
}
export interface AuditReport {
  version: "1.0";
  id: string;
  createdAt: string;
  expiresAt: string;
  input: AuditInput;
  pages: Page[];
  skipped: { url: string; reason: string }[];
  discovered: number;
  maxPages: number;
  partial: boolean;
  robots: Resource;
  sitemap: Resource;
  checks: Check[];
  scores: CategoryScore[];
  overall: number | null;
  competitors: Competitor[];
  internalLinks: { from: string; to: string; anchor: string; reason: string }[];
  metrics: ProviderMetric[];
  ai: AIResult | null;
  aiStatus: string;
  coverage: string[];
  warnings: string[];
}
export interface SignedReport {
  report: AuditReport;
  signature: string;
}
export type AuditEvent =
  | { type: "progress"; message: string; completed?: number }
  | { type: "complete"; data: SignedReport }
  | { type: "error"; message: string };
