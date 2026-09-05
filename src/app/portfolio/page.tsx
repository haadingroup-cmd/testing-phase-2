import type { Metadata } from "next";
import Link from "next/link";
import { ProofCallSection, CTASection } from "@/components/home/SiteSections";
import ResultsGallery from "@/components/portfolio/ResultsGallery";
import { PROJECTS } from "@/data/portfolio";
import { TrendingUp, Search, ShoppingBag, Megaphone, ExternalLink, ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Our Work & Client Results | HaadinGlobal",
  description:
    "Real projects HaadinGlobal has delivered — Shopify stores, custom web apps, SEO and Google/Meta Ads for clients in Pakistan, UAE and Saudi Arabia. See our work and results.",
  alternates: { canonical: "/portfolio" },
};

const focus = [
  { icon: <Megaphone size={20} />, title: "Paid Ads (Meta & Google)", detail: "High-ROAS campaigns that turn ad spend into real leads and sales." },
  { icon: <Search size={20} />, title: "SEO & Local SEO", detail: "Organic visibility that brings steady, compounding traffic over time." },
  { icon: <ShoppingBag size={20} />, title: "Shopify & Web", detail: "Fast, conversion-focused stores and websites built to sell." },
  { icon: <TrendingUp size={20} />, title: "Growth Systems", detail: "Full-funnel strategies that scale what works and cut what doesn't." },
];

// ItemList structured data — helps search engines understand the portfolio.
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  name: "HaadinGlobal Client Projects",
  itemListElement: PROJECTS.map((p, i) => ({
    "@type": "ListItem",
    position: i + 1,
    name: `${p.name} — ${p.category}`,
    ...(p.liveUrl ? { url: p.liveUrl } : {}),
  })),
};

export default function PortfolioPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* HERO */}
      <section className="pt-32 pb-16 relative overflow-hidden">
        <div className="absolute inset-0 hero-radial" />
        <div className="container relative z-10 text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-600/10 border border-red-500/20 text-red-300 text-sm font-semibold mb-5">
            Our Work
          </div>
          <h1 className="font-display font-black text-white mb-5">
            Real Clients, <span className="gradient-text">Real Work</span>
          </h1>
          <p className="text-slate-300 text-lg leading-relaxed">
            From Shopify stores and custom web apps to SEO and paid ads — here&apos;s a look at the businesses we&apos;ve helped grow across Pakistan, the UAE and Saudi Arabia.
          </p>
        </div>
      </section>

      {/* CLIENTS GRID */}
      <section className="pb-4">
        <div className="container">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 max-w-6xl mx-auto">
            {PROJECTS.map((p) => (
              <div key={p.slug} className="card overflow-hidden flex flex-col group">
                {/* Header band */}
                <div className={`relative h-28 bg-gradient-to-br ${p.gradient} flex items-center justify-center`}>
                  <span className="text-5xl drop-shadow-lg">{p.icon}</span>
                  <span className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-black/25 backdrop-blur text-white text-[11px] font-semibold">
                    {p.category}
                  </span>
                </div>
                {/* Body */}
                <div className="p-5 flex flex-col flex-1">
                  <h3 className="text-white font-bold text-[15px] leading-snug">{p.name}</h3>
                  <p className="text-slate-500 text-xs mb-3">{p.location}</p>
                  <p className="text-slate-300 text-sm leading-relaxed mb-3">{p.summary}</p>
                  {p.result && (
                    <p className="text-slate-400 text-xs leading-relaxed border-l-2 border-red-500/40 pl-3 mb-4">
                      {p.result}
                    </p>
                  )}
                  <div className="mt-auto pt-2">
                    {p.liveUrl ? (
                      <a
                        href={p.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-red-400 text-sm font-semibold hover:text-red-300 transition-colors"
                      >
                        View Live Site <ExternalLink size={14} />
                      </a>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 text-slate-500 text-xs font-medium">
                        {p.status}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <p className="text-center text-slate-500 text-sm mt-8">
            Want something similar for your business?{" "}
            <Link href="/consultation" className="text-red-400 font-semibold inline-flex items-center gap-1 hover:text-red-300">
              Book a free consultation <ArrowRight size={14} />
            </Link>
          </p>
        </div>
      </section>

      {/* REAL RESULTS (renders once proof screenshots are added) */}
      <ResultsGallery />

      {/* WHAT WE DRIVE */}
      <section className="section-pad bg-[#030306]">
        <div className="container">
          <div className="text-center mb-10">
            <div className="label mb-3">What We Drive</div>
            <h2 className="font-display font-black text-white">Where we deliver <span className="gradient-text">growth</span></h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 max-w-6xl mx-auto">
            {focus.map((f) => (
              <div key={f.title} className="card rounded-2xl p-6">
                <div className="w-12 h-12 rounded-xl bg-red-600/15 border border-red-500/25 flex items-center justify-center text-red-300 mb-4">
                  {f.icon}
                </div>
                <h3 className="text-white font-bold mb-2">{f.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{f.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <ProofCallSection />
      <CTASection />
    </>
  );
}
