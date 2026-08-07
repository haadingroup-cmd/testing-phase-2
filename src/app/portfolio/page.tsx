import type { Metadata } from "next";
import { ProofCallSection, CTASection } from "@/components/home/SiteSections";
import { TrendingUp, Search, ShoppingBag, Megaphone } from "lucide-react";

export const metadata: Metadata = {
  title: "Our Work & Results | HaadinGlobal",
  description:
    "How HaadinGlobal drives real results with Meta Ads, Google Ads, SEO, Shopify and web development. See our approach — and view real client dashboards live on a free call.",
  alternates: { canonical: "/portfolio" },
};

const focus = [
  { icon: <Megaphone size={20} />, title: "Paid Ads (Meta & Google)", detail: "High-ROAS campaigns that turn ad spend into real leads and sales." },
  { icon: <Search size={20} />, title: "SEO & Local SEO", detail: "Organic visibility that brings steady, compounding traffic over time." },
  { icon: <ShoppingBag size={20} />, title: "Shopify & Web", detail: "Fast, conversion-focused stores and websites built to sell." },
  { icon: <TrendingUp size={20} />, title: "Growth Systems", detail: "Full-funnel strategies that scale what works and cut what doesn't." },
];

export default function PortfolioPage() {
  return (
    <>
      <section className="pt-32 pb-16 relative overflow-hidden">
        <div className="absolute inset-0 hero-radial" />
        <div className="container relative z-10 text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-600/10 border border-red-500/20 text-red-300 text-sm font-semibold mb-5">
            Our Work
          </div>
          <h1 className="font-display font-black text-white mb-5">
            Real Results, <span className="gradient-text">Shown Live</span>
          </h1>
          <p className="text-slate-300 text-lg leading-relaxed">
            We believe in proof over polished screenshots. Instead of posting numbers you&apos;d have to take on faith, we show you real client dashboards and results live on a free call. Here&apos;s where we drive growth for the businesses we work with.
          </p>
        </div>
      </section>

      <section className="section-pad">
        <div className="container">
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
