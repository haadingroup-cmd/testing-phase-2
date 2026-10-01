import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/Eyebrow";
import { Icon } from "@/components/ui/Icon";
import { MARKET_FLAGS } from "@/content/settings";
import { formatPKRShort } from "@/lib/utils";
import { whatsappLink } from "@/lib/whatsapp";
import type { ServiceData, SiteSettings } from "@/types";

export function Hero({ settings }: { settings: SiteSettings }) {
  const typicalRoas = settings.stats.find((s) => /roas/i.test(s.label));
  return (
    <section className="relative w-full overflow-hidden">
      <div className="pointer-events-none absolute -right-16 -top-12 h-64 w-64 rounded-full bg-surface-variant/40 blur-3xl lg:h-96 lg:w-96" />
      <div className="pointer-events-none absolute -left-20 top-1/3 h-72 w-72 rounded-full bg-secondary-fixed/30 blur-3xl" />
      <Container className="relative grid grid-cols-1 gap-space-lg pb-space-xl pt-space-md lg:grid-cols-12 lg:items-center lg:gap-12 lg:py-20">
        <div className="relative z-10 flex min-w-0 flex-col gap-space-lg lg:col-span-7">
          <div className="flex items-center gap-space-xs self-start rounded-full bg-surface-container-low px-3 py-1.5 shadow-sm">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-electric-blue opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-secondary" />
            </span>
            <span className="font-label-eyebrow text-label-eyebrow font-bold uppercase tracking-wider text-secondary">Results-Driven Digital Agency</span>
          </div>
          <div className="space-y-space-sm">
            <h1 className="font-headline-lg-mobile text-headline-lg-mobile font-extrabold tracking-tight text-on-surface sm:text-display-hero-mobile lg:text-display-hero">
              Grow Your Business. <br />
              <span className="text-secondary">Build Your Brand.</span> <br />
              Scale With Digital.
            </h1>
            <p className="max-w-[60ch] font-body-md text-body-md leading-relaxed text-on-surface-variant lg:text-body-lg">
              We combine strategy, creativity, paid media, SEO, technology and AI automation to build digital systems that generate measurable, high-velocity growth.
            </p>
          </div>
          <div className="flex w-full flex-col gap-space-sm sm:flex-row">
            <Link
              href="#consultation"
              className="group flex items-center justify-center gap-space-xs rounded-xl bg-primary-container px-space-lg py-3.5 font-label-lg text-label-lg text-on-primary shadow-md transition-all hover:bg-obsidian"
            >
              <span>Book Free Consultation</span>
              <span className="h-1.5 w-1.5 rounded-full bg-accent-gold-light transition-transform group-hover:scale-125" />
              <Icon name="arrow_forward" size={18} className="text-accent-gold-light" />
            </Link>
            <a
              href={whatsappLink(settings.whatsappMessage, settings.whatsapp)}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-space-xs rounded-xl bg-surface-container-lowest px-space-lg py-3.5 font-label-lg text-label-lg text-on-surface shadow-sm transition-all hover:bg-surface-container"
            >
              <Icon name="chat" size={20} className="text-whatsapp" />
              <span>Chat on WhatsApp</span>
            </a>
          </div>
        </div>

        <div className="relative z-10 min-w-0 space-y-space-md lg:col-span-5">
          {/* Growth card (Stitch "Live System ROAS Wave") — figures link to verified screenshots. */}
          <div className="w-full space-y-space-md rounded-2xl bg-surface-container-lowest p-space-md shadow-md lg:p-space-lg">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-space-xs">
                <div className="h-2.5 w-2.5 rounded-full bg-secondary" />
                <span className="font-label-eyebrow text-label-eyebrow uppercase tracking-wider text-on-surface-variant">Client ROAS Snapshot</span>
              </div>
              <Link href="/results/google-ads-performance-max" className="rounded-full bg-secondary-fixed px-2.5 py-0.5 font-label-md text-label-md font-bold text-on-secondary-fixed-variant hover:underline">
                Up to 9.7x on PMax
              </Link>
            </div>
            <div className="flex items-baseline justify-between gap-2">
              <div>
                <span className="font-headline-lg-mobile text-headline-lg-mobile font-bold text-primary lg:text-headline-lg">{typicalRoas?.value ?? "4x"}</span>
                <span className="ml-1 font-label-md text-label-md font-medium text-on-surface-variant">{typicalRoas?.label ?? "Typical Meta Ads ROAS"}</span>
              </div>
              <div className="flex items-center gap-1 font-label-md text-label-md font-semibold text-secondary">
                <Icon name="show_chart" size={16} />
                <span className="hidden sm:inline">Real dashboards</span>
              </div>
            </div>
            <div className="h-16 w-full pt-1 lg:h-24">
              <svg className="h-full w-full text-secondary" fill="none" preserveAspectRatio="none" viewBox="0 0 300 64" aria-hidden="true">
                <defs>
                  <linearGradient id="growthGlow" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor="#2F80FF" stopOpacity="0.35" />
                    <stop offset="100%" stopColor="#0851d5" stopOpacity="0" />
                  </linearGradient>
                </defs>
                <path d="M0 56 Q 30 52, 60 44 T 120 38 T 180 26 T 240 16 T 300 4 L 300 64 L 0 64 Z" fill="url(#growthGlow)" />
                <path d="M0 56 Q 30 52, 60 44 T 120 38 T 180 26 T 240 16 T 300 4" stroke="currentColor" strokeLinecap="round" strokeWidth="3" />
              </svg>
            </div>
            <div className="flex items-center justify-between pt-space-xs font-label-md text-label-md text-on-surface-variant">
              <span className="flex items-center gap-1">
                <span className="h-1.5 w-1.5 rounded-full bg-whatsapp" /> Active Attribution
              </span>
              <Link href="/results" className="font-medium text-secondary hover:underline">
                See verified results
              </Link>
            </div>
          </div>

          <div className="w-full space-y-space-xs pt-space-xs">
            <span className="block text-center font-label-eyebrow text-label-eyebrow font-semibold uppercase tracking-widest text-on-surface-variant">
              Trusted By Businesses Across Pakistan &amp; The Gulf
            </span>
            <ul className="no-scrollbar flex items-center gap-1.5 overflow-x-auto py-2 sm:flex-wrap sm:justify-center">
              {settings.markets.map((m) => (
                <li key={m} className="flex shrink-0 items-center gap-1.5 rounded-full bg-surface-container-low px-3 py-1 font-label-md text-label-md text-on-surface shadow-sm">
                  {MARKET_FLAGS[m] ? <span aria-hidden="true">{MARKET_FLAGS[m]}</span> : null}
                  <span>{m}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Container>
    </section>
  );
}

const STAT_TONES = ["text-secondary", "text-accent-gold-light", "text-electric-blue"];

export function StatsGrid({ settings }: { settings: SiteSettings }) {
  return (
    <Container as="section" className="py-space-md">
      <h2 className="sr-only">HaadinGlobal in numbers</h2>
      <div className="grid w-full grid-cols-2 gap-space-sm md:grid-cols-3 lg:grid-cols-6">
        {settings.stats.map((stat, i) => (
          <div key={stat.label} data-reveal className="flex flex-col justify-between rounded-2xl bg-surface-container-lowest p-space-md shadow-sm">
            <Icon name={stat.icon} size={24} className={STAT_TONES[i % STAT_TONES.length]} />
            <div className="mt-space-md">
              <div className="font-headline-lg-mobile text-headline-lg-mobile font-bold text-on-surface">{stat.value}</div>
              <div className="font-label-md text-label-md font-medium text-on-surface-variant">{stat.label}</div>
            </div>
          </div>
        ))}
      </div>
    </Container>
  );
}

export function EditorialBreak() {
  return (
    <Container as="section" className="py-space-md">
      <div data-reveal className="relative w-full overflow-hidden rounded-2xl shadow-md">
        <Image
          src="/images/services/shopify.jpg"
          alt="HaadinGlobal team reviewing live growth dashboards"
          width={1408}
          height={768}
          sizes="(min-width: 1280px) 1184px, 100vw"
          className="h-48 w-full object-cover md:h-72 lg:h-80"
        />
        <div className="absolute inset-0 flex items-end bg-gradient-to-t from-primary-container via-primary-container/40 to-transparent p-space-md lg:p-space-xl">
          <div className="max-w-xl space-y-1">
            <span className="rounded bg-secondary/80 px-2 py-0.5 font-label-eyebrow text-label-eyebrow font-bold uppercase tracking-wider text-on-secondary">Enterprise Scalability</span>
            <p className="font-headline-sm text-headline-sm font-bold text-on-primary lg:text-headline-md">Precision growth architecture engineered for modern founders.</p>
          </div>
        </div>
      </div>
    </Container>
  );
}

const VALUE_CARDS = [
  { icon: "analytics", badge: "Evidence-Led", badgeClass: "bg-secondary-fixed text-on-secondary-fixed-variant", title: "Data-Driven Strategy", body: "Every decision is grounded in real data, iterative conversion testing, and clear, measurable objectives." },
  { icon: "receipt_long", badge: "100% Clarity", badgeClass: "bg-surface-container text-on-surface", title: "Transparent Reporting", body: "Dashboards without vanity metrics. You always see exactly where every rupee or dollar produces return." },
  { icon: "support_agent", badge: "Direct Desk", badgeClass: "bg-surface-container text-on-surface", title: "Dedicated Support", body: "No generic ticket queues. You get a dedicated strategist and direct WhatsApp access for fast execution." },
  { icon: "language", badge: "Cross-Border", badgeClass: "bg-surface-container text-on-surface", title: "Global Experience", body: "Hands-on experience in competitive markets across Pakistan, the GCC, the UK, and North America." },
  { icon: "neurology", badge: "Autonomous", badgeClass: "bg-tertiary-fixed text-on-tertiary-fixed-variant", title: "AI-Powered Systems", body: "Automation workflows, AI-assisted creative pipelines, and conversational assistants that reduce overhead." },
  { icon: "all_inclusive", badge: "Full Stack", badgeClass: "bg-secondary-fixed text-on-secondary-fixed-variant", title: "One Digital Partner", body: "Media buying, high-converting web engineering, technical SEO, and video editing under one roof." },
];

export function WhyUs() {
  return (
    <Container as="section" className="space-y-space-md py-space-lg lg:py-16">
      <SectionHeading
        eyebrow="Strategic Edge"
        title="More Than an Agency. Your Digital Growth Partner."
        description="We don't just execute marketing tasks. We build complete digital systems designed around your bottom-line business goals."
      />
      <div className="grid gap-space-sm pt-space-xs md:grid-cols-2 lg:grid-cols-3">
        {VALUE_CARDS.map((card) => (
          <div
            key={card.title}
            data-reveal
            className="space-y-space-xs rounded-2xl border-t-2 border-transparent bg-surface-container-lowest p-space-md shadow-sm transition-all hover:border-secondary hover:shadow-level-2"
          >
            <div className="flex items-center justify-between">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-surface-container text-secondary">
                <Icon name={card.icon} size={22} />
              </div>
              <span className={`rounded-full px-2.5 py-0.5 font-label-md text-label-md font-semibold ${card.badgeClass}`}>{card.badge}</span>
            </div>
            <h3 className="pt-1 font-headline-sm text-headline-sm font-bold text-on-surface">{card.title}</h3>
            <p className="font-body-sm text-body-sm leading-relaxed text-on-surface-variant">{card.body}</p>
          </div>
        ))}
      </div>
    </Container>
  );
}

export function ServicesPreview({ services, total }: { services: ServiceData[]; total: number }) {
  return (
    <section className="w-full py-space-lg lg:py-16">
      <Container>
        <div className="space-y-space-md rounded-3xl bg-surface-container-low px-margin-mobile py-space-lg md:p-space-xl">
          <SectionHeading eyebrow="Capabilities" title="High-Growth Engines" description="Battle-tested solutions configured for fast business acceleration." />
          <div className="grid gap-space-sm md:grid-cols-2">
            {services.map((s) => (
              <Link
                key={s.slug}
                href={`/services/${s.slug}`}
                data-reveal
                className="group space-y-space-sm rounded-2xl bg-surface-container-lowest p-space-md shadow-sm transition-all hover:shadow-level-2"
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-space-xs">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-surface-container text-secondary">
                      <Icon name={s.icon} size={20} />
                    </div>
                    <h3 className="font-label-lg text-label-lg font-bold text-on-surface">{s.title}</h3>
                  </div>
                  <span className="shrink-0 font-label-md text-label-md font-semibold text-secondary">From {formatPKRShort(s.price)}</span>
                </div>
                <p className="font-body-sm text-body-sm leading-relaxed text-on-surface-variant">{s.shortDescription}</p>
                <div className="flex items-center justify-between pt-1 font-label-md text-label-md font-semibold text-secondary">
                  <span>Explore Service</span>
                  <Icon name="arrow_forward" size={16} className="transition-transform group-hover:translate-x-1" />
                </div>
              </Link>
            ))}
          </div>
          <Link
            href="/services"
            className="flex w-full items-center justify-center gap-space-xs rounded-xl bg-surface-container-lowest py-3.5 font-label-lg text-label-lg text-secondary shadow-sm transition-all hover:bg-surface-container"
          >
            <span>Explore All {total} Growth Services</span>
            <Icon name="east" size={18} />
          </Link>
        </div>
      </Container>
    </section>
  );
}

const STEPS = [
  { phase: "Phase 01", when: "Week 1", title: "Discover & Audit", body: "In-depth audit of your historical ad spend, tech stack, competitor gaps, and conversion roadblocks." },
  { phase: "Phase 02", when: "Week 2", title: "Strategize & Blueprint", body: "Unit economics, audience segmentation, creative briefs, and budget allocation." },
  { phase: "Phase 03", when: "Week 3", title: "Build & Launch", body: "Tracking, landing pages, high-converting hooks, and ad asset libraries go live." },
  { phase: "Phase 04", when: "Ongoing", title: "Optimize & Calibrate", body: "Continuous testing, creative refresh sprints, and funnel tuning to lower acquisition costs." },
  { phase: "Phase 05", when: "Continuous", title: "Scale Multi-Market", body: "Expand into new regions (Gulf, UK, US) and grow budgets while protecting ROAS targets." },
];

export function ProcessTimeline() {
  return (
    <Container as="section" className="space-y-space-md py-space-lg lg:py-16">
      <SectionHeading eyebrow="Execution Matrix" title="Our 5-Step Formula" description="A tested cycle delivering fast time-to-value." />
      {/* Mobile/tablet: vertical timeline (Stitch). Desktop: horizontal steps. */}
      <div className="relative">
      <div className="absolute bottom-3 left-2.5 top-3 w-0.5 bg-surface-container-highest lg:hidden" aria-hidden="true" />
      <div className="absolute left-3 right-3 top-3 hidden h-0.5 bg-surface-container-highest lg:block" aria-hidden="true" />
      <ol className="relative space-y-space-md pl-6 lg:grid lg:grid-cols-5 lg:gap-space-sm lg:space-y-0 lg:pl-0">
        {STEPS.map((step, i) => (
          <li key={step.title} data-reveal className="relative flex items-start gap-space-sm lg:flex-col lg:pt-10">
            <div
              className={`absolute -left-6 top-0 flex h-6 w-6 items-center justify-center rounded-full font-label-md text-label-md font-bold shadow-sm lg:left-0 ${
                i === 0 ? "bg-secondary text-on-secondary" : i === STEPS.length - 1 ? "bg-primary-container text-on-primary" : "bg-surface-container-highest text-secondary"
              }`}
            >
              {i + 1}
            </div>
            <div className="w-full space-y-1 rounded-2xl bg-surface-container-lowest p-space-md shadow-sm lg:h-full">
              <div className="flex items-center justify-between">
                <span className="font-label-eyebrow text-label-eyebrow font-bold uppercase text-secondary">{step.phase}</span>
                <span className="font-label-md text-label-md text-on-surface-variant">{step.when}</span>
              </div>
              <h3 className="font-headline-sm text-headline-sm font-bold text-on-surface">{step.title}</h3>
              <p className="font-body-sm text-body-sm leading-relaxed text-on-surface-variant">{step.body}</p>
            </div>
          </li>
        ))}
      </ol>
      </div>
    </Container>
  );
}

export function FounderSpotlight({ settings, ctaHref = "#consultation" }: { settings: SiteSettings; ctaHref?: string }) {
  const projects = settings.stats.find((s) => /project/i.test(s.label));
  const markets = settings.stats.find((s) => /market|countr/i.test(s.label));
  const clients = settings.stats.find((s) => /client/i.test(s.label) && !/retention/i.test(s.label));
  const ticker = [
    projects && { icon: "task_alt", text: `${projects.value} Completed Projects` },
    markets && { icon: "public", text: `${markets.value} Global Markets` },
    clients && { icon: "groups", text: `${clients.value} Clients Served` },
    { icon: "schedule", text: `${settings.responseTime} Response Desk` },
  ].filter(Boolean) as Array<{ icon: string; text: string }>;

  return (
    <Container as="section" className="py-space-lg lg:py-16" id="founder">
      <div className="relative space-y-space-md overflow-hidden rounded-3xl bg-primary-container p-space-lg text-on-primary shadow-xl lg:grid lg:grid-cols-12 lg:items-center lg:gap-space-xl lg:space-y-0 lg:p-12">
        <div className="absolute -bottom-10 -right-10 h-44 w-44 rounded-full bg-secondary/30 blur-2xl lg:h-80 lg:w-80" aria-hidden="true" />
        <div className="relative hidden lg:col-span-4 lg:block">
          <Image src={settings.founderImage} alt={`${settings.founderName}, ${settings.founderTitle}`} width={480} height={600} className="aspect-[4/5] w-full rounded-2xl object-cover shadow-level-3" />
        </div>
        <div className="relative space-y-space-md lg:col-span-8">
          <div className="flex items-center gap-space-sm">
            <Image src={settings.founderImage} alt="" width={64} height={64} className="h-16 w-16 rounded-2xl object-cover shadow-md lg:hidden" />
            <div>
              <h2 className="font-headline-sm text-headline-sm font-bold text-on-primary lg:text-headline-md">{settings.founderName}</h2>
              <span className="block font-label-eyebrow text-label-eyebrow uppercase tracking-wider text-accent-gold-light">{settings.founderTitle}</span>
              <span className="font-label-md text-label-md text-on-primary-container">{settings.address}</span>
            </div>
          </div>
          <blockquote className="pt-1 font-body-lg text-body-lg italic leading-relaxed text-on-secondary-container lg:text-[22px] lg:leading-[34px]">
            &ldquo;{settings.founderQuote}&rdquo;
          </blockquote>
          <div className="flex flex-wrap gap-1.5 pt-1">
            {["Digital Strategy", "Paid Media Ops", "Technical SEO", "AI Automation"].map((d) => (
              <span key={d} className="rounded-lg bg-surface-container-highest/20 px-2.5 py-1 font-label-md text-label-md text-on-primary">
                {d}
              </span>
            ))}
          </div>
          <div className="grid grid-cols-2 gap-space-xs pt-space-xs font-label-md text-label-md text-on-primary-container sm:grid-cols-4">
            {ticker.map((t) => (
              <div key={t.text} className="flex items-center gap-1.5">
                <Icon name={t.icon} size={16} className="text-accent-gold-light" />
                <span>{t.text}</span>
              </div>
            ))}
          </div>
          <Link
            href={ctaHref}
            className="flex w-full items-center justify-center gap-space-xs rounded-xl bg-secondary py-3 font-label-lg text-label-lg text-on-secondary shadow-md transition-colors hover:bg-electric-blue sm:w-auto sm:px-space-xl"
          >
            <span>Work With HaadinGlobal</span>
            <Icon name="handshake" size={18} />
          </Link>
        </div>
      </div>
    </Container>
  );
}
