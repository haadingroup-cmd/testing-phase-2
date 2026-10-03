// Content integrity check: unique slugs, valid tool references and resolvable internal links.
// Run with `npm run check:content`. Exits non-zero on any problem.
import { TOOLS } from "../src/data/tools";
import { GUIDES } from "../src/data/guides";
import { COMPARISONS } from "../src/data/comparisons";
import { CATEGORIES } from "../src/data/categories";
import type { Block, Section } from "../src/lib/types";

const errors: string[] = [];
const toolSlugs = new Set(TOOLS.map((t) => t.slug));
const catSlugs = new Set(CATEGORIES.map((c) => c.slug));

const dupes = (name: string, slugs: string[]) =>
  slugs.filter((s, i) => slugs.indexOf(s) !== i).forEach((s) => errors.push(`duplicate ${name} slug: ${s}`));
dupes("tool", TOOLS.map((t) => t.slug));
dupes("guide", GUIDES.map((g) => g.slug));
dupes("comparison", COMPARISONS.map((c) => c.slug));

const routes = new Set<string>([
  "/", "/tools", "/categories", "/compare", "/guides", "/search", "/about", "/methodology", "/affiliate-disclosure",
  "/privacy-policy", "/terms", "/contact", "/submit-tool", "/unsubscribe",
  ...TOOLS.map((t) => `/tools/${t.slug}`),
  ...GUIDES.map((g) => `/guides/${g.slug}`),
  ...COMPARISONS.map((c) => `/compare/${c.slug}`),
  ...CATEGORIES.map((c) => `/categories/${c.slug}`),
]);

const checkText = (where: string, text: string) => {
  for (const m of text.matchAll(/\[[^\]]+\]\(([^)\s]+)\)/g)) {
    const href = m[1]!;
    if (href.startsWith("/") && !routes.has(href.split("#")[0]!)) errors.push(`${where}: broken internal link ${href}`);
    if (!href.startsWith("/") && !href.startsWith("https://")) errors.push(`${where}: non-https link ${href}`);
  }
};
const checkBlock = (where: string, b: Block) => {
  if (b.type === "p" || b.type === "h3" || b.type === "quote") checkText(where, b.text);
  if (b.type === "ul" || b.type === "ol") b.items.forEach((i) => checkText(where, i));
  if (b.type === "callout") checkText(where, b.text);
  if (b.type === "table") b.rows.flat().forEach((c) => checkText(where, c));
  if (b.type === "tools") b.slugs.forEach((s) => toolSlugs.has(s) || errors.push(`${where}: unknown tool ${s}`));
};
const checkSections = (where: string, sections: Section[]) => {
  const ids = sections.map((s) => s.id);
  ids.filter((s, i) => ids.indexOf(s) !== i).forEach((s) => errors.push(`${where}: duplicate section id ${s}`));
  sections.forEach((s) => s.blocks.forEach((b) => checkBlock(`${where}#${s.id}`, b)));
};

for (const t of TOOLS) {
  t.alternatives.forEach((a) => toolSlugs.has(a) || errors.push(`tool ${t.slug}: unknown alternative ${a}`));
  t.categories.forEach((c) => catSlugs.has(c) || errors.push(`tool ${t.slug}: unknown category ${c}`));
  if (t.score < 0 || t.score > 10) errors.push(`tool ${t.slug}: score out of range`);
  if (!t.website.startsWith("https://")) errors.push(`tool ${t.slug}: website must be https`);
}
for (const g of GUIDES) {
  checkSections(`guide ${g.slug}`, g.sections);
  g.faqs.forEach((f) => checkText(`guide ${g.slug} faq`, f.a));
  g.relatedTools.forEach((s) => toolSlugs.has(s) || errors.push(`guide ${g.slug}: unknown related tool ${s}`));
  if (!/^\d{4}-\d{2}-\d{2}$/.test(g.updated) || !/^\d{4}-\d{2}-\d{2}$/.test(g.published)) errors.push(`guide ${g.slug}: bad date`);
}
for (const c of COMPARISONS) {
  [c.a, c.b].forEach((s) => toolSlugs.has(s) || errors.push(`comparison ${c.slug}: unknown tool ${s}`));
  checkSections(`comparison ${c.slug}`, c.sections);
  c.faqs.forEach((f) => checkText(`comparison ${c.slug} faq`, f.a));
}
for (const c of CATEGORIES) if (!TOOLS.some((t) => t.categories.includes(c.slug))) errors.push(`category ${c.slug}: has no tools`);

if (errors.length) {
  console.error(`✗ ${errors.length} content problem(s):\n${errors.map((e) => `  - ${e}`).join("\n")}`);
  process.exit(1);
}
console.log(`✓ content OK — ${TOOLS.length} tools, ${GUIDES.length} guides, ${COMPARISONS.length} comparisons, ${CATEGORIES.length} categories`);
