import "server-only";
import { getDb, hasDatabase } from "@/lib/db";
import { mapCaseStudy, mapFaq, mapPlan, mapPost, mapService } from "@/lib/data/mappers";
import { settingsSchema } from "@/lib/validations/settings";
import { DEFAULT_SERVICES } from "@/content/services";
import { DEFAULT_PRICING_PLANS } from "@/content/pricing";
import { DEFAULT_FAQS } from "@/content/faqs";
import { DEFAULT_SETTINGS } from "@/content/settings";
import { DEFAULT_BLOG_POSTS } from "@/content/blog";
import { CASE_STUDIES } from "@/content/case-studies";
import type { BlogPostData, CaseStudyData, FaqData, PricingPlanData, ServiceData, SiteSettings } from "@/types";

/**
 * Public read layer. Every loader reads from PostgreSQL; if the database is
 * not configured yet (first deploy) or temporarily unreachable, it falls back
 * to the built-in default content so the public site keeps rendering.
 */
async function withFallback<T>(label: string, query: () => Promise<T>, fallback: () => T): Promise<T> {
  if (!hasDatabase) return fallback();
  try {
    return await query();
  } catch (error) {
    console.error(`[data] ${label} failed, using defaults:`, error instanceof Error ? error.message : error);
    return fallback();
  }
}

const bySort = <T extends { sortOrder: number }>(a: T, b: T) => a.sortOrder - b.sortOrder;

export function getServices(): Promise<ServiceData[]> {
  return withFallback(
    "services",
    async () => {
      const rows = await getDb().service.findMany({ where: { published: true }, orderBy: [{ sortOrder: "asc" }, { title: "asc" }] });
      return rows.map(mapService);
    },
    () => [...DEFAULT_SERVICES].sort(bySort),
  );
}

export async function getService(slug: string): Promise<ServiceData | null> {
  return withFallback(
    "service",
    async () => {
      const row = await getDb().service.findFirst({ where: { slug, published: true } });
      return row ? mapService(row) : null;
    },
    () => DEFAULT_SERVICES.find((s) => s.slug === slug) ?? null,
  );
}

export function getPricingPlans(): Promise<PricingPlanData[]> {
  return withFallback(
    "pricing",
    async () => {
      const rows = await getDb().pricingPlan.findMany({ where: { published: true }, orderBy: { sortOrder: "asc" } });
      return rows.map(mapPlan);
    },
    () => [...DEFAULT_PRICING_PLANS].sort(bySort),
  );
}

export function getFaqs(category = "general"): Promise<FaqData[]> {
  return withFallback(
    "faqs",
    async () => {
      const rows = await getDb().fAQ.findMany({ where: { category, published: true }, orderBy: { sortOrder: "asc" } });
      return rows.map(mapFaq);
    },
    () => DEFAULT_FAQS.filter((f) => f.category === category).sort(bySort),
  );
}

export function getSettings(): Promise<SiteSettings> {
  return withFallback(
    "settings",
    async () => {
      const row = await getDb().siteSetting.findUnique({ where: { key: "general" } });
      if (!row) return DEFAULT_SETTINGS;
      const parsed = settingsSchema.safeParse({ ...DEFAULT_SETTINGS, ...(row.value as object) });
      return parsed.success ? parsed.data : DEFAULT_SETTINGS;
    },
    () => DEFAULT_SETTINGS,
  );
}

const publishedWhere = () => ({ status: "PUBLISHED" as const, publishedAt: { lte: new Date() } });

export function getBlogPosts(): Promise<BlogPostData[]> {
  return withFallback(
    "blog",
    async () => {
      const rows = await getDb().blogPost.findMany({ where: publishedWhere(), orderBy: { publishedAt: "desc" } });
      return rows.map(mapPost);
    },
    () => [...DEFAULT_BLOG_POSTS].sort((a, b) => (b.publishedAt ?? "").localeCompare(a.publishedAt ?? "")),
  );
}

export function getBlogPost(slug: string): Promise<BlogPostData | null> {
  return withFallback(
    "blog post",
    async () => {
      const row = await getDb().blogPost.findFirst({ where: { slug, ...publishedWhere() } });
      return row ? mapPost(row) : null;
    },
    () => DEFAULT_BLOG_POSTS.find((p) => p.slug === slug) ?? null,
  );
}

export function getCaseStudies(): Promise<CaseStudyData[]> {
  return withFallback(
    "case studies",
    async () => {
      const rows = await getDb().caseStudy.findMany({ where: { published: true }, orderBy: { sortOrder: "asc" } });
      return rows.map(mapCaseStudy);
    },
    () => [...CASE_STUDIES].sort(bySort),
  );
}

export function getCaseStudy(slug: string): Promise<CaseStudyData | null> {
  return withFallback(
    "case study",
    async () => {
      const row = await getDb().caseStudy.findFirst({ where: { slug, published: true } });
      return row ? mapCaseStudy(row) : null;
    },
    () => CASE_STUDIES.find((c) => c.slug === slug) ?? null,
  );
}
