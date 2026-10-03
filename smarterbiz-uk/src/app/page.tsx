import Link from "next/link";
import { ArrowRight, BookOpen, CheckCircle2, Mail, ShieldCheck } from "lucide-react";
import { Hero3D } from "@/components/home/Hero3D";
import { TrendingTools } from "@/components/home/TrendingTools";
import { GuideCard } from "@/components/content/GuideCard";
import { GuideCover } from "@/components/content/GuideCover";
import { HouseAd } from "@/components/content/Disclosure";
import { NewsletterForm } from "@/components/forms/NewsletterForm";
import { Reveal } from "@/components/ui/Reveal";
import { Tilt } from "@/components/ui/Tilt";
import { SectionHead } from "@/components/ui/SectionHead";
import { Icon } from "@/components/ui/Icon";
import { FaqList } from "@/components/ui/Faq";
import { JsonLd } from "@/components/ui/JsonLd";
import { TOOLS, topTools, toolBySlug, toolsByCategory } from "@/data/tools";
import { GUIDES, featuredGuide } from "@/data/guides";
import { COMPARISONS } from "@/data/comparisons";
import { CATEGORIES } from "@/data/categories";
import { SITE } from "@/lib/site";
import { itemListLd, pageMetadata } from "@/lib/seo";
import { formatDate, readingMinutes, sectionsText } from "@/lib/content";

export const metadata = pageMetadata({
  title: `Best AI Tools for UK Small Businesses (${SITE.year}) | ${SITE.name}`,
  absoluteTitle: true,
  description: SITE.description,
  path: "/",
  keywords: ["ai tools for small businesses", "best ai tools uk", "ai tools directory", "ai for small businesses", "ai tools for business"],
});

const HOME_FAQS = [
  {
    q: "What are the best AI tools for small businesses in the UK?",
    a: "Our top picks for UK small businesses are Claude or ChatGPT as a general assistant, Microsoft 365 Copilot or Gemini for office suites, Xero or FreeAgent for MTD-ready accounting, Zapier for automation, Canva for design and HubSpot's free CRM. See our [full guide](/guides/best-ai-tools-for-uk-small-businesses).",
  },
  {
    q: "How does SmarterBiz.uk test AI tools?",
    a: "We score every tool on value for money in pounds, ease of use, UK fit (British English, UK GDPR, HMRC compatibility) and features, using real small-business tasks. Vendors cannot pay for placement. Read [how we test](/methodology).",
  },
  {
    q: "Are the prices on SmarterBiz.uk in pounds?",
    a: "Yes. We show indicative sterling prices for entry-level paid plans. Prices change often and may exclude VAT, so always confirm on the vendor's website before buying.",
  },
  {
    q: "Is it safe to use AI tools with customer data?",
    a: "It can be, if you choose business plans that don't train on your data, sign the vendor's data processing agreement and check where data is stored. Our [UK GDPR and AI checklist](/guides/uk-gdpr-ai-compliance-checklist) explains the steps.",
  },
];

export default function HomePage() {
  const lead = featuredGuide();
  const leadMins = readingMinutes(lead.quickAnswer, sectionsText(lead.sections));
  const h2h = COMPARISONS.find((c) => c.slug === "chatgpt-vs-claude")!;
  const [ta, tb] = [toolBySlug(h2h.a)!, toolBySlug(h2h.b)!];
  const total = ta.score + tb.score;
  const ranked = topTools(TOOLS.length);

  return (
    <>
      <JsonLd data={itemListLd("Top-rated AI tools for UK small businesses", topTools(10).map((t) => ({ name: t.name, path: `/tools/${t.slug}` })))} />

      {/* Hero */}
      <section className="relative overflow-hidden border-b border-rule bg-surface-lowest">
        <div className="bg-grid absolute inset-0 [mask-image:linear-gradient(to_bottom,black,transparent)]" aria-hidden="true" />
        <div className="container-site relative grid items-center gap-8 py-10 md:py-16 lg:grid-cols-[1.1fr_1fr]">
          <div className="animate-fade-up">
            <p className="inline-flex items-center gap-2 rounded-full bg-surface-low px-3 py-1.5 text-caption text-slate-body">
              <span className="h-2 w-2 rounded-full bg-teal" aria-hidden="true" /> Independent UK SME research • No sponsored rankings
            </p>
            <p className="mt-5 flex items-center gap-2 text-label">
              <span className="uppercase tracking-widest text-brand">UK SME Technology Desk</span>
              <span className="text-rule-strong">•</span>
              <span className="text-slate-body">{SITE.year} Edition</span>
            </p>
            <h1 className="mt-3 font-serif text-display-hero-mobile text-ink md:text-display-hero">
              Practical AI Tools for <em className="font-medium text-brand">Smarter</em> Small Businesses
            </h1>
            <p className="mt-4 max-w-xl font-serif text-body-lead text-slate-body">
              Hands-on reviews of the AI software that saves British founders, SMEs and sole traders real hours — with sterling pricing, UK GDPR
              notes and Making Tax Digital checks.
            </p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Link href="/tools" className="btn-primary px-5 py-3">
                Explore {TOOLS.length} AI tools <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
              <Link href="/guides" className="btn-secondary px-5 py-3">
                <BookOpen className="h-4 w-4" aria-hidden="true" /> Read the latest guides
              </Link>
            </div>
          </div>
          <Hero3D />
        </div>
      </section>

      {/* Metrics */}
      <section aria-label="At a glance" className="container-site -mt-px py-6">
        <Reveal className="grid grid-cols-2 gap-2 rounded-xl border border-rule bg-surface-lowest p-2 md:grid-cols-4">
          {[
            [`${TOOLS.length}+`, "Tools reviewed", "text-ink"],
            ["£ GBP", "Pricing checked", "text-brand"],
            ["UK GDPR", "Data notes on every tool", "text-teal"],
            [`${GUIDES.length + COMPARISONS.length}`, "Guides & comparisons", "text-ink"],
          ].map(([v, l, c]) => (
            <div key={l} className="flex flex-col items-center rounded-lg bg-surface-low p-3 text-center">
              <span className={`tnum text-[20px] font-bold ${c}`}>{v}</span>
              <span className="mt-0.5 text-caption text-slate-body">{l}</span>
            </div>
          ))}
        </Reveal>
      </section>

      {/* Lead feature + sidebar */}
      <section className="container-site grid gap-8 py-8 lg:grid-cols-[2fr_1fr]">
        <Reveal>
          <div className="mb-3 flex items-center justify-between">
            <p className="text-label uppercase tracking-wider text-ink">Editor&apos;s lead feature</p>
            <p className="text-caption font-semibold text-teal">Flagship report</p>
          </div>
          <Tilt max={3}>
            <article className="card group relative overflow-hidden transition-shadow hover:shadow-lift">
              <GuideCover guide={lead} className="h-48 md:h-60" />
              <div className="p-5 md:p-7">
                <p className="flex items-center gap-2 text-caption text-slate-mute">
                  <span className="rounded bg-ink px-2 py-0.5 text-[10px] font-semibold uppercase text-white">Deep dive</span>
                  {leadMins} min read • Updated <time dateTime={lead.updated}>{formatDate(lead.updated)}</time>
                </p>
                <h2 className="mt-2 font-serif text-headline-md text-ink md:text-headline-lg">
                  <Link href={`/guides/${lead.slug}`} className="after:absolute after:inset-0 group-hover:underline">
                    {lead.title}
                  </Link>
                </h2>
                <p className="mt-2 text-body-lg text-slate-body">{lead.description}</p>
                <p className="mt-4 flex items-center gap-2 text-label text-ink">
                  {SITE.author.name} <span className="font-normal text-slate-mute">• {SITE.author.role}</span>
                </p>
              </div>
            </article>
          </Tilt>
        </Reveal>
        <Reveal delay={120} className="flex flex-col gap-4">
          <p className="text-label uppercase tracking-wider text-ink">Top rated right now</p>
          <ol className="card divide-y divide-rule">
            {ranked.slice(0, 6).map((t, i) => (
              <li key={t.slug}>
                <Link href={`/tools/${t.slug}`} className="flex items-center gap-3 px-4 py-3 hover:bg-surface">
                  <span className="tnum w-5 font-serif text-headline-sm text-slate-mute">{i + 1}</span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-body-md font-semibold text-ink">{t.name}</span>
                    <span className="block truncate text-caption text-slate-mute">{t.bestFor}</span>
                  </span>
                  <span className="tnum rounded bg-ink px-1.5 py-0.5 text-[12px] font-bold text-white">{t.score.toFixed(1)}</span>
                </Link>
              </li>
            ))}
          </ol>
          <HouseAd />
        </Reveal>
      </section>

      {/* Trending with filters */}
      <section className="container-site py-8">
        <Reveal>
          <SectionHead kicker="Trending SME benchmarks" title="Explore AI tools by category" href="/tools" linkLabel="Full directory" />
          <div className="mt-5">
            <TrendingTools tools={ranked} />
          </div>
        </Reveal>
      </section>

      {/* Head to head */}
      <section className="container-site py-8">
        <Reveal>
          <div className="relative overflow-hidden rounded-xl bg-ink-soft p-6 text-white md:p-10">
            <div className="bg-grid-dark absolute inset-0" aria-hidden="true" />
            <div className="relative grid gap-6 md:grid-cols-[1.4fr_1fr] md:items-center">
              <div>
                <p className="flex items-center gap-2 text-label uppercase tracking-wider text-brand-fixed">
                  Head-to-head benchmark <span className="rounded bg-brand px-2 py-0.5 text-[10px] text-white">UK battle</span>
                </p>
                <h2 className="mt-2 font-serif text-headline-md md:text-headline-xl">
                  {ta.name} vs {tb.name} for UK business workflows
                </h2>
                <p className="mt-2 text-body-lg text-periwinkle">
                  Which handles British English, contract review and GDPR-sensitive work better? We ran both through real SME tasks.
                </p>
              </div>
              <div className="rounded-lg bg-white/10 p-4 backdrop-blur">
                <div className="flex items-center justify-between text-caption">
                  <span className="text-periwinkle-light">{ta.name}</span>
                  <span className="tnum font-bold">{ta.score.toFixed(1)} vs {tb.score.toFixed(1)}</span>
                  <span className="text-brand-fixed">{tb.name}</span>
                </div>
                <div className="mt-2 flex h-2 overflow-hidden rounded-full bg-white/20">
                  <div className="h-full bg-teal-dim" style={{ width: `${(ta.score / total) * 100}%` }} />
                  <div className="h-full bg-brand-fixed" style={{ width: `${(tb.score / total) * 100}%` }} />
                </div>
                <div className="mt-1.5 flex justify-between text-[10px] text-periwinkle">
                  <span>Versatility winner</span>
                  <span>Writing & documents winner</span>
                </div>
                <Link href={`/compare/${h2h.slug}`} className="btn mt-4 w-full bg-white text-ink hover:bg-surface">
                  Read the full verdict <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              </div>
            </div>
          </div>
        </Reveal>
      </section>

      {/* Categories grid */}
      <section className="container-site py-8">
        <Reveal>
          <SectionHead kicker="Directory" title="Browse every category" href="/categories" />
          <div className="mt-5 grid grid-cols-2 gap-3 md:grid-cols-4 lg:grid-cols-7">
            {CATEGORIES.map((c) => (
              <Link key={c.slug} href={`/categories/${c.slug}`} className="card group flex flex-col gap-2 p-4 transition hover:-translate-y-0.5 hover:border-rule-strong hover:shadow-pop">
                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-tint text-brand transition group-hover:bg-brand group-hover:text-white">
                  <Icon name={c.icon} className="h-5 w-5" />
                </span>
                <span className="text-body-md font-semibold leading-tight text-ink">{c.short}</span>
                <span className="text-caption text-slate-mute">{toolsByCategory(c.slug).length} tools</span>
              </Link>
            ))}
          </div>
        </Reveal>
      </section>

      {/* Latest guides */}
      <section className="container-site py-8">
        <Reveal>
          <SectionHead kicker="Guides" title="Latest UK SME guides" href="/guides" />
          <div className="mt-5 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {GUIDES.filter((g) => g.slug !== lead.slug).slice(0, 6).map((g) => <GuideCard key={g.slug} guide={g} />)}
          </div>
        </Reveal>
      </section>

      {/* Methodology + newsletter */}
      <section className="container-site grid gap-6 py-8 lg:grid-cols-2">
        <Reveal className="card bg-surface-low p-6">
          <p className="flex items-center gap-2 text-headline-sm text-ink">
            <ShieldCheck className="h-5 w-5 text-brand" aria-hidden="true" /> How we test software for UK companies
          </p>
          <ul className="mt-4 space-y-3 text-body-md text-on-surface">
            {[
              ["UK GDPR & DPA 2018", "we check training defaults, data location and processing agreements."],
              ["Sterling pricing", "real costs in pounds, with VAT treatment noted where we can."],
              ["UK workflows", "British English, HMRC Making Tax Digital and UK integrations."],
              ["Zero pay-to-win", "rankings can never be bought by vendors."],
            ].map(([t, d]) => (
              <li key={t} className="flex gap-2">
                <CheckCircle2 className="mt-0.5 h-[18px] w-[18px] shrink-0 text-teal" aria-hidden="true" />
                <span><strong className="font-semibold">{t}:</strong> {d}</span>
              </li>
            ))}
          </ul>
          <Link href="/methodology" className="mt-5 inline-flex items-center gap-1 text-label text-brand hover:underline">
            Read our full testing methodology <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </Reveal>
        <Reveal delay={120} className="card p-6">
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-fixed text-brand-deep">
            <Mail className="h-5 w-5" aria-hidden="true" />
          </span>
          <h2 className="mt-3 font-serif text-headline-md text-ink">Useful AI tools and software insights — without the hype.</h2>
          <p className="mt-2 text-body-md text-slate-body">
            Every Thursday: three tested AI tools, one time-saving workflow and the UK regulatory updates (HMRC, ICO) that matter.
          </p>
          <div className="mt-4">
            <NewsletterForm source="home" />
          </div>
        </Reveal>
      </section>

      <div className="container-site">
        <div className="max-w-read">
          <FaqList faqs={HOME_FAQS} heading="Your questions, answered" />
        </div>
      </div>
    </>
  );
}
