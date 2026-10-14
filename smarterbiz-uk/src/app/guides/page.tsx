import { GUIDES } from "@/data/guides";
import { GuideCard } from "@/components/content/GuideCard";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Reveal } from "@/components/ui/Reveal";
import { JsonLd } from "@/components/ui/JsonLd";
import { itemListLd, pageMetadata } from "@/lib/seo";
import { SITE } from "@/lib/site";

export const metadata = pageMetadata({
  title: `AI Guides for UK Small Businesses (${SITE.year})`,
  description: "Practical, independent guides to using AI in a UK small business: best tools, Making Tax Digital, UK GDPR, AI workflows, research tools, presentation makers and more.",
  path: "/guides",
  keywords: ["ai for small businesses", "ai guides uk", "how to use ai in business"],
});

export default function GuidesPage() {
  return (
    <div className="container-site py-8">
      <JsonLd data={itemListLd("SmarterBiz.uk guides", GUIDES.map((g) => ({ name: g.title, path: `/guides/${g.slug}` })))} />
      <Breadcrumbs items={[{ name: "Guides", path: "/guides" }]} />
      <header className="mt-4 max-w-3xl">
        <h1 className="font-serif text-headline-xl-mobile text-ink md:text-headline-xl">Guides &amp; investigations</h1>
        <p className="mt-3 font-serif text-body-lead text-slate-body">In-depth, regularly updated guides for British founders, SMEs and sole traders.</p>
      </header>
      <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {GUIDES.map((g, i) => (
          <Reveal key={g.slug} delay={(i % 3) * 80}>
            <GuideCard guide={g} />
          </Reveal>
        ))}
      </div>
    </div>
  );
}
