import { ToolDirectory } from "@/components/tools/ToolDirectory";
import { AffiliateDisclosure } from "@/components/content/Disclosure";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { JsonLd } from "@/components/ui/JsonLd";
import { FaqList } from "@/components/ui/Faq";
import { TOOLS, topTools } from "@/data/tools";
import { SITE } from "@/lib/site";
import { itemListLd, pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: `AI Tools Directory UK: ${TOOLS.length} Tools Reviewed (${SITE.year})`,
  description: `Search and compare ${TOOLS.length}+ AI tools for UK small businesses. Independent scores, sterling pricing, free-plan and Making Tax Digital filters, and UK GDPR notes on every tool.`,
  path: "/tools",
  keywords: ["ai tools directory", "ai tools list", "ai tools for business", "online ai tools", "different ai tools"],
});

export default function ToolsPage() {
  return (
    <div className="container-site py-8">
      <JsonLd data={itemListLd("AI tools directory for UK small businesses", topTools(TOOLS.length).map((t) => ({ name: t.name, path: `/tools/${t.slug}` })))} />
      <Breadcrumbs items={[{ name: "AI Tools Directory", path: "/tools" }]} />
      <header className="mt-4 max-w-3xl">
        <p className="kicker">{SITE.year} Directory</p>
        <h1 className="mt-2 font-serif text-headline-xl-mobile text-ink md:text-headline-xl">Directory of AI Tools for UK Small Businesses</h1>
        <p className="mt-3 font-serif text-body-lead text-slate-body">
          Independent UK benchmarks with sterling pricing, HMRC Making Tax Digital flags and UK GDPR notes on every listing. Filter by what
          matters to your business.
        </p>
      </header>
      <div className="mt-6">
        <AffiliateDisclosure />
      </div>
      <div className="mt-6">
        <ToolDirectory tools={TOOLS} />
      </div>
      <div className="max-w-read">
        <FaqList
          faqs={[
            { q: "How are tools scored?", a: "Each tool gets a score out of 10, weighted across value for money in pounds, ease of use, UK fit and features. See [how we test](/methodology)." },
            { q: "Can vendors pay to be listed?", a: "No. Listings and scores are editorial. Vendors can [submit a tool](/submit-tool) for consideration, but cannot pay for inclusion or ranking." },
            { q: "What does 'MTD ready' mean?", a: "It means the software is recognised by HMRC for Making Tax Digital submissions. Check HMRC's list on GOV.UK for the specific service you need." },
          ]}
        />
      </div>
    </div>
  );
}
