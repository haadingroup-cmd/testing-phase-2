import { TOOLS } from "@/data/tools";
import { GUIDES } from "@/data/guides";
import { COMPARISONS } from "@/data/comparisons";
import { CATEGORIES } from "@/data/categories";
import { toolBySlug } from "@/data/tools";

export interface SearchResult {
  type: "Tool" | "Guide" | "Comparison" | "Category";
  title: string;
  description: string;
  href: string;
  score: number;
}

interface Doc extends Omit<SearchResult, "score"> {
  hay: string;
  titleHay: string;
  boost: number;
}

const norm = (s: string) => s.toLowerCase().normalize("NFKD").replace(/[^\p{L}\p{N}\s.£-]/gu, " ");

const DOCS: Doc[] = [
  ...TOOLS.map((t) => ({
    type: "Tool" as const,
    title: t.name,
    description: `${t.vendor} — ${t.tagline}`,
    href: `/tools/${t.slug}`,
    titleHay: norm(`${t.name} ${t.vendor}`),
    hay: norm(`${t.name} ${t.vendor} ${t.tagline} ${t.summary} ${t.bestFor} ${t.categories.join(" ")} ${t.features.join(" ")}`),
    boost: t.score / 10,
  })),
  ...GUIDES.map((g) => ({
    type: "Guide" as const,
    title: g.title,
    description: g.description,
    href: `/guides/${g.slug}`,
    titleHay: norm(g.title),
    hay: norm(`${g.title} ${g.description} ${g.keywords.join(" ")} ${g.sections.map((s) => s.heading).join(" ")}`),
    boost: 0.9,
  })),
  ...COMPARISONS.map((c) => ({
    type: "Comparison" as const,
    title: c.title,
    description: c.description,
    href: `/compare/${c.slug}`,
    titleHay: norm(`${c.title} ${toolBySlug(c.a)?.name ?? ""} ${toolBySlug(c.b)?.name ?? ""}`),
    hay: norm(`${c.title} ${c.description} ${c.keywords.join(" ")}`),
    boost: 0.85,
  })),
  ...CATEGORIES.map((c) => ({
    type: "Category" as const,
    title: c.name,
    description: c.intro.slice(0, 160),
    href: `/categories/${c.slug}`,
    titleHay: norm(`${c.name} ${c.short}`),
    hay: norm(`${c.name} ${c.short} ${c.intro} ${c.keyword}`),
    boost: 0.8,
  })),
];

export function search(query: string, limit = 20): SearchResult[] {
  const terms = norm(query).split(/\s+/).filter((t) => t.length > 1).slice(0, 8);
  if (!terms.length) return [];
  const results: SearchResult[] = [];
  for (const d of DOCS) {
    let score = 0;
    let matched = 0;
    for (const term of terms) {
      if (d.titleHay.includes(term)) {
        score += 3;
        matched++;
      } else if (d.hay.includes(term)) {
        score += 1;
        matched++;
      }
    }
    if (matched === 0 || matched < Math.ceil(terms.length / 2)) continue;
    results.push({ type: d.type, title: d.title, description: d.description, href: d.href, score: score * d.boost + matched / terms.length });
  }
  return results.sort((a, b) => b.score - a.score).slice(0, limit);
}
