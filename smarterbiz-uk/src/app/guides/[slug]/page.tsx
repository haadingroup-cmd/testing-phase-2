import Link from "next/link";
import { notFound } from "next/navigation";
import { CheckCircle2, Clock, Zap } from "lucide-react";
import { GUIDES, guideBySlug } from "@/data/guides";
import { toolBySlug } from "@/data/tools";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { JsonLd } from "@/components/ui/JsonLd";
import { FaqList } from "@/components/ui/Faq";
import { Sections } from "@/components/content/Blocks";
import { GuideCover } from "@/components/content/GuideCover";
import { AffiliateDisclosure } from "@/components/content/Disclosure";
import { ReadingProgress } from "@/components/content/ReadingProgress";
import { ToolMini } from "@/components/tools/ToolMini";
import { NewsletterForm } from "@/components/forms/NewsletterForm";
import { LogoMark } from "@/components/ui/Logo";
import { articleLd, pageMetadata } from "@/lib/seo";
import { formatDate, readingMinutes, sectionsText } from "@/lib/content";
import { SITE } from "@/lib/site";
import type { Tool } from "@/lib/types";

export const dynamicParams = false;
export const generateStaticParams = () => GUIDES.map((g) => ({ slug: g.slug }));

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const g = guideBySlug(slug);
  if (!g) return {};
  return pageMetadata({
    title: g.metaTitle,
    absoluteTitle: true,
    description: g.description,
    path: `/guides/${g.slug}`,
    keywords: g.keywords,
    type: "article",
    publishedTime: g.published,
    modifiedTime: g.updated,
  });
}

export default async function GuidePage({ params }: Props) {
  const { slug } = await params;
  const g = guideBySlug(slug);
  if (!g) notFound();
  const mins = readingMinutes(g.quickAnswer, sectionsText(g.sections));
  const tools = g.relatedTools.map(toolBySlug).filter((t): t is Tool => Boolean(t));
  const more = GUIDES.filter((x) => x.slug !== g.slug).slice(0, 3);

  return (
    <>
      <ReadingProgress />
      <JsonLd data={articleLd(g)} />
      <div className="container-site py-8">
        <Breadcrumbs items={[{ name: "Guides", path: "/guides" }, { name: g.title, path: `/guides/${g.slug}` }]} />
        <div className="mt-6 grid gap-10 lg:grid-cols-[minmax(0,1fr)_300px]">
          <article className="min-w-0">
            <header>
              <p className="kicker">{g.kicker}</p>
              <h1 className="mt-2 font-serif text-headline-xl-mobile text-ink md:text-display-hero">{g.title}</h1>
              <p className="mt-4 font-serif text-body-lead text-slate-body">{g.description}</p>
              <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2 border-y border-rule py-3 text-body-sm text-slate-body">
                <span className="flex items-center gap-2">
                  <LogoMark className="h-7 w-7" />
                  <span>
                    <Link href="/about" className="font-semibold text-ink hover:underline">{SITE.author.name}</Link>
                    <span className="block text-caption text-slate-mute">{SITE.author.role}</span>
                  </span>
                </span>
                <span>Updated <time dateTime={g.updated}>{formatDate(g.updated)}</time></span>
                <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" aria-hidden="true" />{mins} min read</span>
              </div>
            </header>

            <div className="mt-6 overflow-hidden rounded-lg"><GuideCover guide={g} className="h-48 md:h-64" /></div>

            <div className="mt-6"><AffiliateDisclosure /></div>

            <section aria-labelledby="quick-answer" className="mt-6 rounded-lg border border-brand-line bg-brand-tint p-5">
              <h2 id="quick-answer" className="flex items-center gap-2 text-label uppercase tracking-wider text-brand-active">
                <Zap className="h-4 w-4" aria-hidden="true" /> Quick answer
              </h2>
              <p className="mt-2 text-body-lg text-ink" data-speakable="">{g.quickAnswer}</p>
            </section>

            <section aria-labelledby="takeaways" className="mt-6 rounded-lg border border-rule bg-surface-lowest p-5">
              <h2 id="takeaways" className="text-headline-sm text-ink">Key takeaways</h2>
              <ul className="mt-3 space-y-2 text-body-md">
                {g.takeaways.map((t) => (
                  <li key={t} className="flex gap-2"><CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-teal" aria-hidden="true" />{t}</li>
                ))}
              </ul>
            </section>

            <div className="prose-editorial mt-4">
              <Sections sections={g.sections} />
            </div>

            <FaqList faqs={g.faqs} />

            <section className="mt-12 flex items-start gap-4 rounded-lg border border-rule bg-surface-low p-5" aria-label="About the author">
              <LogoMark className="h-12 w-12 shrink-0" />
              <div>
                <p className="text-headline-sm text-ink">{SITE.author.name}</p>
                <p className="mt-1 text-body-md text-slate-body">{SITE.author.bio}</p>
                <p className="mt-2 text-body-sm">
                  <Link href="/methodology" className="text-brand hover:underline">How we test</Link> ·{" "}
                  <Link href="/contact" className="text-brand hover:underline">Report a correction</Link>
                </p>
              </div>
            </section>
          </article>

          <aside className="min-w-0">
            <div className="sticky top-28 flex flex-col gap-5">
              <nav aria-label="On this page" className="card p-4">
                <p className="text-label uppercase tracking-wider text-ink">On this page</p>
                <ol className="mt-3 space-y-2 text-body-sm">
                  {g.sections.map((s) => (
                    <li key={s.id}><a href={`#${s.id}`} className="text-slate-body hover:text-brand">{s.heading}</a></li>
                  ))}
                  <li><a href="#faq-heading" className="text-slate-body hover:text-brand">FAQs</a></li>
                </ol>
              </nav>
              {tools.length > 0 && (
                <div>
                  <p className="mb-2 text-label uppercase tracking-wider text-ink">Tools in this guide</p>
                  <div className="flex flex-col gap-2">{tools.map((t) => <ToolMini key={t.slug} tool={t} />)}</div>
                </div>
              )}
              <div className="card p-4">
                <p className="text-label uppercase tracking-wider text-ink">The Thursday Briefing</p>
                <p className="mt-1 text-body-sm text-slate-body">Tested AI tools and UK regulatory updates, weekly.</p>
                <div className="mt-3"><NewsletterForm source={`guide/${g.slug}`} variant="compact" /></div>
              </div>
            </div>
          </aside>
        </div>

        <section className="mt-14">
          <h2 className="font-serif text-headline-md text-ink">Keep reading</h2>
          <ul className="mt-4 grid gap-3 md:grid-cols-3">
            {more.map((m) => (
              <li key={m.slug}><Link href={`/guides/${m.slug}`} className="card block h-full p-4 hover:shadow-pop"><span className="text-caption uppercase text-brand">{m.kicker}</span><span className="mt-1 block font-serif text-headline-sm text-ink">{m.title}</span></Link></li>
            ))}
          </ul>
        </section>
      </div>
    </>
  );
}
