import Link from "next/link";
import { StaticPage } from "@/components/content/StaticPage";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "How We Test AI Tools: Our 7-Point Method",
  description: "How SmarterBiz.uk tests and scores AI tools for UK small businesses: value in pounds, ease of use, UK fit (GDPR, HMRC, British English) and features — with no paid rankings.",
  path: "/methodology",
});

export default function MethodologyPage() {
  return (
    <StaticPage title="How we test" path="/methodology" lead="Our 7-point protocol for testing AI and business software against the realities of running a UK small business.">
      <h2>The 7-point testing protocol</h2>
      <ol>
        <li><strong>Real tasks:</strong> we use each tool for genuine small-business jobs — quotes, contracts, bookkeeping, customer replies, reports.</li>
        <li><strong>Sterling pricing:</strong> we record entry-level UK pricing and note VAT treatment where the vendor makes it clear.</li>
        <li><strong>UK GDPR & DPA 2018:</strong> we check whether the vendor trains on your data, where data is stored and whether a data processing agreement is available.</li>
        <li><strong>HMRC compatibility:</strong> for finance tools, we check recognition for Making Tax Digital.</li>
        <li><strong>British English & UK context:</strong> we check spelling, date formats and UK-specific knowledge.</li>
        <li><strong>Ease of use:</strong> how quickly a non-technical owner can get value.</li>
        <li><strong>Features & integrations:</strong> how well it fits with Microsoft 365, Google Workspace, UK banks and common SME apps.</li>
      </ol>
      <h2>How scores work</h2>
      <p>
        Each tool receives sub-scores out of 10 for <strong>value</strong>, <strong>ease of use</strong>, <strong>UK fit</strong> and{" "}
        <strong>features</strong>. The overall score reflects these with editorial judgement about the tool&apos;s usefulness to UK small
        businesses. Scores are opinions based on our testing, not guarantees.
      </p>
      <h2>Independence</h2>
      <p>
        Vendors cannot pay for inclusion, placement or scores. Some outbound links may be affiliate links; these are marked as sponsored in our
        code and never influence rankings. Read our <Link href="/affiliate-disclosure">affiliate disclosure</Link>.
      </p>
      <h2>Updates and corrections</h2>
      <p>
        AI tools change quickly. We review guides regularly and show the last-updated date on every page. Spotted an error? <Link href="/contact">Tell us</Link> and we&apos;ll fix it.
      </p>
    </StaticPage>
  );
}
