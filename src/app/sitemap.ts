import type { MetadataRoute } from "next";
import { getBlogPosts, getCaseStudies, getServices } from "@/lib/data";
import { SITE_URL } from "@/lib/site";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [services, posts, studies] = await Promise.all([getServices(), getBlogPosts(), getCaseStudies()]);
  const staticPages: Array<[string, number, MetadataRoute.Sitemap[number]["changeFrequency"]]> = [
    ["/", 1, "weekly"],
    ["/services", 0.9, "monthly"],
    ["/pricing", 0.9, "monthly"],
    ["/results", 0.8, "monthly"],
    ["/audit", 0.8, "monthly"],
    ["/blog", 0.8, "weekly"],
    ["/about", 0.7, "monthly"],
    ["/contact", 0.7, "yearly"],
    ["/faq", 0.6, "monthly"],
    ["/privacy-policy", 0.2, "yearly"],
    ["/terms", 0.2, "yearly"],
    ["/refund-policy", 0.2, "yearly"],
    ["/security", 0.2, "yearly"],
  ];
  return [
    ...staticPages.map(([path, priority, changeFrequency]) => ({ url: `${SITE_URL}${path === "/" ? "" : path}`, priority, changeFrequency })),
    ...services.map((s) => ({ url: `${SITE_URL}/services/${s.slug}`, priority: 0.8, changeFrequency: "monthly" as const })),
    ...studies.map((c) => ({ url: `${SITE_URL}/results/${c.slug}`, priority: 0.6, changeFrequency: "monthly" as const })),
    ...posts.map((p) => ({
      url: `${SITE_URL}/blog/${p.slug}`,
      lastModified: p.updatedAt ?? p.publishedAt ?? undefined,
      priority: 0.6,
      changeFrequency: "monthly" as const,
    })),
  ];
}
