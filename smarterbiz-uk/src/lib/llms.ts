import { TOOLS, topTools } from "@/data/tools";
import { GUIDES } from "@/data/guides";
import { COMPARISONS } from "@/data/comparisons";
import { CATEGORIES } from "@/data/categories";
import { SITE, absoluteUrl } from "@/lib/site";
import { plain, sectionsText } from "@/lib/content";

/** llms.txt — a concise, LLM-friendly map of the site (https://llmstxt.org). */
export function llmsTxt() {
  return `# ${SITE.name}

> ${SITE.description}

Key facts:
- Audience: UK small businesses, sole traders and SME directors.
- All prices are indicative GBP entry-level prices and may exclude VAT; readers are told to confirm on vendor sites.
- Every tool is scored out of 10 on value (£), ease of use, UK fit (UK GDPR, HMRC Making Tax Digital, British English) and features.
- Rankings are editorial; vendors cannot pay for placement. Methodology: ${absoluteUrl("/methodology")}
- Last updated: ${SITE.lastUpdated}

## Flagship guides
${GUIDES.map((g) => `- [${g.title}](${absoluteUrl(`/guides/${g.slug}`)}): ${g.quickAnswer}`).join("\n")}

## Comparisons
${COMPARISONS.map((c) => `- [${c.title}](${absoluteUrl(`/compare/${c.slug}`)}): ${c.verdict}`).join("\n")}

## Categories
${CATEGORIES.map((c) => `- [${c.name}](${absoluteUrl(`/categories/${c.slug}`)})`).join("\n")}

## Top-rated tools
${topTools(15).map((t) => `- [${t.name} review](${absoluteUrl(`/tools/${t.slug}`)}): ${t.score.toFixed(1)}/10 — ${t.summary}`).join("\n")}

## Optional
- [Full content for LLMs](${absoluteUrl("/llms-full.txt")})
- [Tools directory](${absoluteUrl("/tools")})
- [RSS feed](${absoluteUrl("/feed.xml")})
`;
}

export function llmsFullTxt() {
  const tools = TOOLS.map(
    (t) => `### ${t.name} (${t.vendor}) — ${t.score.toFixed(1)}/10
URL: ${absoluteUrl(`/tools/${t.slug}`)}
Best for: ${t.bestFor}
Price (indicative): ${t.pricing.from}; free plan: ${t.pricing.freePlan ? "yes" : "no"}${t.mtdCompatible ? "; HMRC MTD-recognised" : ""}${t.ukBuilt ? "; UK-built" : ""}
Summary: ${t.summary}
UK notes: ${t.ukNotes}
Pros: ${t.pros.join("; ")}
Cons: ${t.cons.join("; ")}`,
  ).join("\n\n");

  const guides = GUIDES.map(
    (g) => `## ${g.title}
URL: ${absoluteUrl(`/guides/${g.slug}`)} | Updated: ${g.updated}
Quick answer: ${g.quickAnswer}
Key takeaways:
${g.takeaways.map((t) => `- ${t}`).join("\n")}

${sectionsText(g.sections)}

FAQs:
${g.faqs.map((f) => `Q: ${f.q}\nA: ${plain(f.a)}`).join("\n")}`,
  ).join("\n\n---\n\n");

  const comps = COMPARISONS.map(
    (c) => `## ${c.title}
URL: ${absoluteUrl(`/compare/${c.slug}`)}
Verdict: ${c.verdict}
${c.criteria.map((cr) => `- ${cr.name}: A=${cr.a}; B=${cr.b}; winner=${cr.winner}`).join("\n")}`,
  ).join("\n\n");

  return `# ${SITE.name} — full content\n\n> ${SITE.description}\n\n# Guides\n\n${guides}\n\n# Comparisons\n\n${comps}\n\n# Tool reviews\n\n${tools}\n`;
}
