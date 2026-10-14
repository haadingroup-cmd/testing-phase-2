import Link from "next/link";
import { notFound } from "next/navigation";
import { CATEGORIES, categoryBySlug } from "@/data/categories";
import { toolsByCategory } from "@/data/tools";
import { GUIDES } from "@/data/guides";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { JsonLd } from "@/components/ui/JsonLd";
import { ToolCard } from "@/components/tools/ToolCard";
import { AffiliateDisclosure } from "@/components/content/Disclosure";
import { FaqList } from "@/components/ui/Faq";
import { Icon } from "@/components/ui/Icon";
import { itemListLd, pageMetadata } from "@/lib/seo";
import { SITE } from "@/lib/site";

export const dynamicParams = false;
export const generateStaticParams = () => CATEGORIES.map((c) => ({ slug: c.slug }));

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const c = categoryBySlug(slug);
  if (!c) return {};
  const n = toolsByCategory(c.slug).length;
  return pageMetadata({
    title: `Best ${c.name} for UK SMEs (${SITE.year})`,
    description: `The ${n} best ${c.name.toLowerCase()} for UK small businesses, ranked by independent editorial score with sterling pricing and UK GDPR notes.`,
    path: `/categories/${c.slug}`,
    keywords: [c.keyword, `best ${c.short.toLowerCase()} tools uk`],
  });
}

export default async function CategoryPage({ params }: Props) {
  const { slug } = await params;
  const c = categoryBySlug(slug);
  if (!c) notFound();
  const tools = toolsByCategory(c.slug);
  const guides = GUIDES.filter((g) => g.relatedTools.some((s) => tools.some((t) => t.slug === s))).slice(0, 4);
  const top = tools[0];

  return (
    <div className="container-site py-8">
      <JsonLd data={itemListLd(`Best ${c.name} for UK small businesses`, tools.map((t) => ({ name: t.name, path: `/tools/${t.slug}` })))} />
      <Breadcrumbs items={[{ name: "Categories", path: "/categories" }, { name: c.name, path: `/categories/${c.slug}` }]} />
      <header className="mt-4 max-w-3xl">
        <p className="kicker flex items-center gap-2"><Icon name={c.icon} className="h-4 w-4" /> Category</p>
        <h1 className="mt-2 font-serif text-headline-xl-mobile text-ink md:text-headline-xl">Best {c.name} for UK small businesses</h1>
        <p className="mt-3 text-body-lg text-slate-body" data-speakable="">{c.intro}</p>
        {top && (
          <p className="mt-4 rounded-lg border border-rule bg-surface-lowest p-4 text-body-md">
            <strong className="text-ink">Our top pick:</strong>{" "}
            <Link href={`/tools/${top.slug}`} className="font-semibold text-brand hover:underline">{top.name}</Link> ({top.score.toFixed(1)}/10) — {top.bestFor.toLowerCase()}.
          </p>
        )}
      </header>
      <div className="mt-6"><AffiliateDisclosure /></div>
      <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {tools.map((t, i) => <ToolCard key={t.slug} tool={t} rank={i + 1} />)}
      </div>
      {guides.length > 0 && (
        <section className="mt-12">
          <h2 className="font-serif text-headline-md text-ink">Related guides</h2>
          <ul className="mt-4 grid gap-3 md:grid-cols-2">
            {guides.map((g) => (
              <li key={g.slug}><Link href={`/guides/${g.slug}`} className="card block p-4 text-body-md font-semibold text-ink hover:shadow-pop hover:underline">{g.title}</Link></li>
            ))}
          </ul>
        </section>
      )}
      <div className="max-w-read">
        <FaqList
          faqs={[
            { q: `What is the best ${c.short.toLowerCase()} tool for small businesses?`, a: top ? `Our top-rated option is [${top.name}](/tools/${top.slug}), scoring ${top.score.toFixed(1)}/10. It is best for ${top.bestFor.toLowerCase()}.` : "See our ranked list above." },
            { q: `Are there free ${c.short.toLowerCase()} tools?`, a: (() => { const free = tools.filter((t) => t.pricing.freePlan); return free.length ? `Yes — ${free.map((t) => `[${t.name}](/tools/${t.slug})`).join(", ")} offer free plans.` : "Most tools in this category offer free trials rather than free plans."; })() },
          ]}
        />
      </div>
    </div>
  );
}
