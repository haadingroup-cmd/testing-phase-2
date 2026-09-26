import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowUpRight, Check, Minus, ShieldCheck } from "lucide-react";
import { TOOLS, toolBySlug } from "@/data/tools";
import { COMPARISONS } from "@/data/comparisons";
import { GUIDES } from "@/data/guides";
import { categoryBySlug } from "@/data/categories";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { JsonLd } from "@/components/ui/JsonLd";
import { ToolLogo } from "@/components/ui/ToolLogo";
import { ScoreBadge, ToolChips } from "@/components/ui/Badges";
import { ScoreBar } from "@/components/ui/ScoreBar";
import { Reveal } from "@/components/ui/Reveal";
import { FaqList } from "@/components/ui/Faq";
import { ToolMini } from "@/components/tools/ToolMini";
import { AffiliateDisclosure } from "@/components/content/Disclosure";
import { pageMetadata, toolLd } from "@/lib/seo";
import { outboundRel, outboundUrl } from "@/lib/outbound";
import { SITE } from "@/lib/site";
import { formatDate } from "@/lib/content";
import type { Faq, Tool } from "@/lib/types";

export const dynamicParams = false;
export const generateStaticParams = () => TOOLS.map((t) => ({ slug: t.slug }));

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const t = toolBySlug(slug);
  if (!t) return {};
  return pageMetadata({
    title: `${t.name} Review UK (${SITE.year}): Pricing, Pros & Cons`,
    description: `${t.name} review for UK small businesses: ${t.tagline.toLowerCase()}. Score ${t.score.toFixed(1)}/10, ${t.pricing.from}, pros and cons, UK GDPR notes and best alternatives.`,
    path: `/tools/${t.slug}`,
    keywords: [`${t.name.toLowerCase()} review`, `${t.name.toLowerCase()} uk`, `${t.name.toLowerCase()} pricing uk`, `${t.name.toLowerCase()} alternatives`],
  });
}

function toolFaqs(t: Tool, alts: Tool[]): Faq[] {
  return [
    {
      q: `Is ${t.name} free?`,
      a: t.pricing.freePlan
        ? `Yes — ${t.name} offers a free plan. Paid plans start at ${t.pricing.from}.${t.pricing.note ? ` ${t.pricing.note}` : ""}`
        : `${t.name} does not have a permanent free plan${t.pricing.trial ? `, but offers a ${t.pricing.trial.toLowerCase()}` : ""}. Pricing starts at ${t.pricing.from}.`,
    },
    {
      q: `How much does ${t.name} cost in the UK?`,
      a: `Entry pricing is ${t.pricing.from} (indicative, may exclude VAT). Prices change often, so confirm on the ${t.vendor} website before buying.`,
    },
    { q: `Is ${t.name} GDPR compliant for UK businesses?`, a: `${t.ukNotes} Compliance also depends on how you use the tool — see our [UK GDPR and AI checklist](/guides/uk-gdpr-ai-compliance-checklist).` },
    ...(alts.length
      ? [{ q: `What are the best alternatives to ${t.name}?`, a: `The best alternatives are ${alts.map((a) => `[${a.name}](/tools/${a.slug})`).join(", ")}.` }]
      : []),
    { q: `Who is ${t.name} best for?`, a: `${t.bestFor}.` },
  ];
}

export default async function ToolPage({ params }: Props) {
  const { slug } = await params;
  const t = toolBySlug(slug);
  if (!t) notFound();
  const primary = categoryBySlug(t.categories[0]!);
  const alts = t.alternatives.map(toolBySlug).filter((x): x is Tool => Boolean(x));
  const comps = COMPARISONS.filter((c) => c.a === t.slug || c.b === t.slug);
  const guides = GUIDES.filter((g) => g.relatedTools.includes(t.slug)).slice(0, 4);

  return (
    <div className="container-site py-8">
      <JsonLd data={toolLd(t)} />
      <Breadcrumbs
        items={[
          { name: "AI Tools", path: "/tools" },
          ...(primary ? [{ name: primary.short, path: `/categories/${primary.slug}` }] : []),
          { name: t.name, path: `/tools/${t.slug}` },
        ]}
      />

      <header className="mt-5 flex flex-col gap-5 border-b border-rule pb-8 md:flex-row md:items-start md:justify-between">
        <div className="flex gap-4">
          <ToolLogo name={t.name} color={t.color} size={64} />
          <div>
            <p className="kicker">{t.vendor} • Tested {SITE.year}</p>
            <h1 className="mt-1 font-serif text-headline-xl-mobile text-ink md:text-headline-xl">{t.name} review</h1>
            <p className="mt-1 font-serif text-body-lead text-slate-body">{t.tagline}</p>
            <div className="mt-3"><ToolChips tool={t} max={5} /></div>
          </div>
        </div>
        <div className="flex items-center gap-4 md:flex-col md:items-end">
          <ScoreBadge score={t.score} size="lg" />
          <a href={outboundUrl(t)} target="_blank" rel={outboundRel(t)} className="btn-primary">
            Visit {t.name} <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
          </a>
        </div>
      </header>

      <div className="mt-8 grid gap-10 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
        <article className="min-w-0">
          <AffiliateDisclosure />
          <section className="mt-6 rounded-lg border border-rule bg-surface-lowest p-5" aria-labelledby="verdict">
            <h2 id="verdict" className="text-label uppercase tracking-wider text-brand">The short verdict</h2>
            <p className="mt-2 font-serif text-body-lead text-ink" data-speakable="">{t.summary}</p>
          </section>

          <div className="prose-editorial mt-8">
            <h2 id="review">Our {t.name} review</h2>
            {t.review.map((p, i) => <p key={i}>{p}</p>)}
          </div>

          <Reveal className="mt-10 grid gap-4 sm:grid-cols-2">
            <section className="card p-5" aria-labelledby="pros">
              <h2 id="pros" className="text-headline-sm text-teal-deep">What we like</h2>
              <ul className="mt-3 space-y-2 text-body-md">
                {t.pros.map((p) => <li key={p} className="flex gap-2"><Check className="mt-0.5 h-4 w-4 shrink-0 text-teal" aria-hidden="true" />{p}</li>)}
              </ul>
            </section>
            <section className="card p-5" aria-labelledby="cons">
              <h2 id="cons" className="text-headline-sm text-red-800">Watch out for</h2>
              <ul className="mt-3 space-y-2 text-body-md">
                {t.cons.map((p) => <li key={p} className="flex gap-2"><Minus className="mt-0.5 h-4 w-4 shrink-0 text-red-700" aria-hidden="true" />{p}</li>)}
              </ul>
            </section>
          </Reveal>

          <section className="mt-10" aria-labelledby="features">
            <h2 id="features" className="font-serif text-headline-md text-ink">Key features</h2>
            <ul className="mt-4 grid gap-2 sm:grid-cols-2">
              {t.features.map((f, i) => (
                <li key={f} className={`flex items-center gap-2 rounded px-3 py-2 text-body-md ${i % 2 ? "bg-surface" : "bg-surface-lowest"} border border-rule`}>
                  <Check className="h-4 w-4 text-brand" aria-hidden="true" />{f}
                </li>
              ))}
            </ul>
          </section>

          <section className="mt-10 rounded-lg border border-teal/30 bg-teal/5 p-5" aria-labelledby="uk-notes">
            <h2 id="uk-notes" className="flex items-center gap-2 text-headline-sm text-teal-deep">
              <ShieldCheck className="h-5 w-5" aria-hidden="true" /> UK business &amp; GDPR notes
            </h2>
            <p className="mt-2 text-body-lg text-on-surface">{t.ukNotes}</p>
          </section>

          <section className="mt-10" aria-labelledby="pricing">
            <h2 id="pricing" className="font-serif text-headline-md text-ink">{t.name} pricing (UK)</h2>
            <table className="mt-4 w-full border-collapse overflow-hidden rounded-lg border border-rule text-left text-body-md">
              <tbody className="tnum">
                <tr className="bg-surface-lowest"><th scope="row" className="w-1/3 px-4 py-3 font-semibold text-ink">Entry paid plan</th><td className="px-4 py-3">{t.pricing.from}</td></tr>
                <tr className="border-t border-rule bg-surface"><th scope="row" className="px-4 py-3 font-semibold text-ink">Free plan</th><td className="px-4 py-3">{t.pricing.freePlan ? "Yes" : "No"}</td></tr>
                {t.pricing.trial && <tr className="border-t border-rule bg-surface-lowest"><th scope="row" className="px-4 py-3 font-semibold text-ink">Trial</th><td className="px-4 py-3">{t.pricing.trial}</td></tr>}
                {t.pricing.note && <tr className="border-t border-rule bg-surface"><th scope="row" className="px-4 py-3 font-semibold text-ink">Notes</th><td className="px-4 py-3">{t.pricing.note}</td></tr>}
              </tbody>
            </table>
            <p className="mt-2 text-caption text-slate-mute">Indicative pricing, may exclude VAT. Last reviewed {formatDate(SITE.lastUpdated)} — confirm on the vendor&apos;s site.</p>
          </section>

          {comps.length > 0 && (
            <section className="mt-10" aria-labelledby="comparisons">
              <h2 id="comparisons" className="font-serif text-headline-md text-ink">Head-to-head comparisons</h2>
              <ul className="mt-4 grid gap-3 sm:grid-cols-2">
                {comps.map((c) => (
                  <li key={c.slug}>
                    <Link href={`/compare/${c.slug}`} className="card block p-4 hover:border-rule-strong hover:shadow-pop">
                      <span className="text-body-md font-semibold text-ink">{c.title}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          )}

          <FaqList faqs={toolFaqs(t, alts)} heading={`${t.name}: frequently asked questions`} />
        </article>

        <aside className="min-w-0">
          <div className="sticky top-28 flex flex-col gap-4">
            <Reveal className="card p-5">
              <p className="text-label uppercase tracking-wider text-ink">SmarterBiz scorecard</p>
              <div className="mt-3 flex items-baseline gap-2">
                <span className="tnum font-serif text-[44px] font-semibold leading-none text-ink">{t.score.toFixed(1)}</span>
                <span className="text-body-md text-slate-mute">/ 10</span>
              </div>
              <div className="mt-4 space-y-3">
                <ScoreBar label="Value for money (£)" value={t.scores.value} />
                <ScoreBar label="Ease of use" value={t.scores.easeOfUse} />
                <ScoreBar label="UK fit & compliance" value={t.scores.ukFit} tone="teal" />
                <ScoreBar label="Features" value={t.scores.features} />
              </div>
              <dl className="mt-5 space-y-2 border-t border-rule pt-4 text-body-sm">
                <div className="flex justify-between gap-3"><dt className="text-slate-mute">Best for</dt><dd className="text-right font-medium text-ink">{t.bestFor}</dd></div>
                <div className="flex justify-between gap-3"><dt className="text-slate-mute">From</dt><dd className="tnum text-right font-medium text-ink">{t.pricing.from}</dd></div>
                <div className="flex justify-between gap-3"><dt className="text-slate-mute">Free plan</dt><dd className="text-right font-medium text-ink">{t.pricing.freePlan ? "Yes" : "No"}</dd></div>
              </dl>
              <a href={outboundUrl(t)} target="_blank" rel={outboundRel(t)} className="btn-primary mt-5 w-full">
                Visit {t.name} <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
              </a>
            </Reveal>
            {alts.length > 0 && (
              <div>
                <p className="mb-2 text-label uppercase tracking-wider text-ink">Alternatives</p>
                <div className="flex flex-col gap-2">{alts.map((a) => <ToolMini key={a.slug} tool={a} />)}</div>
              </div>
            )}
            {guides.length > 0 && (
              <div>
                <p className="mb-2 text-label uppercase tracking-wider text-ink">Featured in</p>
                <ul className="card divide-y divide-rule">
                  {guides.map((g) => (
                    <li key={g.slug}><Link href={`/guides/${g.slug}`} className="block px-4 py-3 text-body-md text-ink hover:bg-surface hover:underline">{g.title}</Link></li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}
