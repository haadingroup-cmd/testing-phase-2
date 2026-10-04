import type { MetadataRoute } from "next";
import { TOOLS } from "@/data/tools";
import { GUIDES } from "@/data/guides";
import { COMPARISONS } from "@/data/comparisons";
import { CATEGORIES } from "@/data/categories";
import { SITE, absoluteUrl } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = SITE.lastUpdated;
  const staticPages: [string, number, MetadataRoute.Sitemap[number]["changeFrequency"]][] = [
    ["/", 1, "daily"],
    ["/tools", 0.95, "weekly"],
    ["/guides", 0.9, "weekly"],
    ["/compare", 0.85, "weekly"],
    ["/categories", 0.8, "weekly"],
    ["/methodology", 0.5, "monthly"],
    ["/about", 0.5, "monthly"],
    ["/submit-tool", 0.4, "monthly"],
    ["/contact", 0.3, "yearly"],
    ["/affiliate-disclosure", 0.2, "yearly"],
    ["/privacy-policy", 0.2, "yearly"],
    ["/terms", 0.2, "yearly"],
  ];
  return [
    ...staticPages.map(([p, priority, changeFrequency]) => ({ url: absoluteUrl(p), lastModified: now, changeFrequency, priority })),
    ...GUIDES.map((g) => ({ url: absoluteUrl(`/guides/${g.slug}`), lastModified: g.updated, changeFrequency: "monthly" as const, priority: g.featured ? 0.95 : 0.85 })),
    ...COMPARISONS.map((c) => ({ url: absoluteUrl(`/compare/${c.slug}`), lastModified: c.updated, changeFrequency: "monthly" as const, priority: 0.8 })),
    ...TOOLS.map((t) => ({ url: absoluteUrl(`/tools/${t.slug}`), lastModified: now, changeFrequency: "monthly" as const, priority: 0.75 })),
    ...CATEGORIES.map((c) => ({ url: absoluteUrl(`/categories/${c.slug}`), lastModified: now, changeFrequency: "weekly" as const, priority: 0.8 })),
  ];
}
