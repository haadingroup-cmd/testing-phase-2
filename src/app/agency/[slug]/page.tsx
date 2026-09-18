import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { CheckCircle, ArrowRight, Star, Shield, Clock, Globe } from "lucide-react";
import { LANDINGS, getLanding } from "@/data/landings";
import { SITE } from "@/data/siteConfig";
import LandingLeadForm from "@/components/landing/LandingLeadForm";

export function generateStaticParams() {
  return LANDINGS.map((l) => ({ slug: l.slug }));
}

// Open Graph locale per market — without this every landing page (Dubai,
// London, New York...) inherits the root layout's "en_PK" default, which
// misrepresents the target market to Google/Facebook for international pages.
const OG_LOCALE: Record<string, string> = {
  PK: "en_PK", AE: "en_AE", QA: "en_QA", SA: "en_SA", GB: "en_GB", US: "en_US",
};

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const l = getLanding(params.slug);
  if (!l) return { title: "Not Found" };
  return {
    title: l.metaTitle,
    description: l.metaDescription,
    alternates: { canonical: `/agency/${l.slug}` },
    openGraph: {
      title: l.metaTitle,
      description: l.metaDescription,
      url: `https://www.haadinglobal.com/agency/${l.slug}`,
      locale: OG_LOCALE[l.countryCode] ?? "en_PK",
      images: [{ url: "/logo.png", width: 1200, height: 630, alt: "HaadinGlobal" }],
    },
  };
}

export default function LandingPage({ params }: { params: { slug: string } }) {
  const l = getLanding(params.slug);
  if (!l) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "ProfessionalService",
        name: `HaadinGlobal — Digital Marketing Agency in ${l.city}`,
        description: l.metaDescription,
        url: `https://www.haadinglobal.com/agency/${l.slug}`,
        areaServed: { "@type": "Country", name: l.country },
        telephone: SITE.phone,
        email: SITE.email,
        priceRange: "$$",
      },
      {
        "@type": "FAQPage",
        mainEntity: l.faqs.map((f) => ({
          "@type": "Question",
          name: f.q,
          acceptedAnswer: { "@type": "Answer", text: f.a },
        })),
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: "https://www.haadinglobal.com" },
          { "@type": "ListItem", position: 2, name: `Digital Marketing Agency in ${l.city}`, item: `https://www.haadinglobal.com/agency/${l.slug}` },
        ],
      },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* Hero */}
      <section className="pt-32 pb-16 relative overflow-hidden">
        <div className="absolute inset-0 hero-radial" />
        <div className="container relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/8 border border-white/15 text-white text-xs font-semibold mb-6">
                <Globe size={12} className="text-red-400" /> Serving {l.country}
              </div>
              <h1 className="font-display font-black text-white text-4xl md:text-5xl leading-tight mb-5">
                {l.headline.replace(l.city, "")}<span className="gradient-text">{l.city}</span>
              </h1>
              <p className="text-slate-300 text-lg leading-relaxed mb-7">{l.subhead}</p>
              <div className="grid sm:grid-cols-2 gap-3 mb-8">
                {l.heroPoints.map((p) => (
                  <div key={p} className="flex items-center gap-2 text-slate-200 text-sm">
                    <CheckCircle size={15} className="text-green-300 flex-shrink-0" /> {p}
                  </div>
                ))}
              </div>
              <div className="flex flex-wrap items-center gap-5 text-slate-400 text-sm">
                <span className="flex items-center gap-1.5"><Shield size={14} className="text-red-400" /> No lock-in contracts</span>
                <span className="flex items-center gap-1.5"><Clock size={14} className="text-red-400" /> 24hr response</span>
                <span className="flex items-center gap-1.5">
                  {[...Array(5)].map((_, i) => <Star key={i} size={12} className="text-amber-400 fill-amber-400 inline" />)}
                </span>
              </div>
            </div>

            {/* Lead form — the conversion point */}
            <div className="card p-6 md:p-8">
              <h2 className="font-bold text-white text-xl mb-1">Get a Free Strategy Session</h2>
              <p className="text-slate-400 text-sm mb-5">Tell us about your business — we&apos;ll reply within 24 hours with a plan.</p>
              <LandingLeadForm source={l.slug} city={l.city} priceNote={l.priceNote} />
            </div>
          </div>
        </div>
      </section>

      {/* Pain / Solution */}
      <section className="section-pad bg-[#030306]">
        <div className="container">
          <h2 className="font-display font-black text-white text-3xl text-center mb-12">
            We Fix What&apos;s <span className="gradient-text">Holding You Back</span>
          </h2>
          <div className="grid md:grid-cols-3 gap-5">
            {l.painPoints.map((p) => (
              <div key={p.problem} className="card p-6">
                <p className="text-red-400 font-semibold text-sm mb-2">✕ {p.problem}</p>
                <p className="text-slate-300 text-sm leading-relaxed flex gap-2">
                  <CheckCircle size={16} className="text-green-300 flex-shrink-0 mt-0.5" /> {p.solution}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="section-pad">
        <div className="container">
          <div className="text-center mb-12">
            <div className="label mb-4">What We Do</div>
            <h2 className="font-display font-black text-white text-3xl">Everything to Grow Your Business</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {l.services.map((s) => (
              <div key={s.name} className="card p-6">
                <h3 className="font-bold text-white mb-2">{s.name}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process — new, unique per-page content: how we work with this city's businesses */}
      <section className="section-pad">
        <div className="container">
          <div className="text-center mb-12">
            <div className="label mb-4">How It Works</div>
            <h2 className="font-display font-black text-white text-3xl">
              Getting Started in <span className="gradient-text">{l.city}</span>
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              { step: "1", title: "Free Consultation", desc: `We learn about your ${l.city} business, your goals and your budget — no pressure, no obligation.` },
              { step: "2", title: "Custom Strategy", desc: `We build a plan around what actually works for your industry and market in ${l.country}.` },
              { step: "3", title: "Launch & Optimise", desc: "Campaigns, content or your website go live, then we test and refine based on real performance." },
              { step: "4", title: "Report & Scale", desc: "You get clear, regular reporting — then we scale what's working and cut what isn't." },
            ].map((s) => (
              <div key={s.step} className="card p-6">
                <div className="w-9 h-9 rounded-lg bg-red-600/15 border border-red-500/25 flex items-center justify-center text-red-300 font-black text-sm mb-4">
                  {s.step}
                </div>
                <h3 className="font-bold text-white mb-2">{s.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="section-pad bg-[#030306]">
        <div className="container max-w-3xl">
          <h2 className="font-display font-black text-white text-3xl text-center mb-10">
            Frequently Asked <span className="gradient-text">Questions</span>
          </h2>
          <div className="space-y-3">
            {l.faqs.map((f) => (
              <details key={f.q} className="card p-5 group">
                <summary className="font-semibold text-white cursor-pointer list-none flex items-center justify-between">
                  {f.q}
                  <ArrowRight size={16} className="text-red-400 group-open:rotate-90 transition-transform" />
                </summary>
                <p className="text-slate-400 text-sm leading-relaxed mt-3 pt-3 border-t border-white/8">{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Nearby cities — internal linking for topical/local SEO signal */}
      <section className="py-14 bg-[#030306] border-t border-white/8">
        <div className="container max-w-4xl mx-auto text-center">
          <p className="text-slate-500 text-xs uppercase tracking-widest font-semibold mb-5">
            Also Serving Nearby Cities
          </p>
          <div className="flex flex-wrap justify-center gap-2.5">
            {LANDINGS.filter((o) => o.slug !== l.slug && o.countryCode === l.countryCode)
              .slice(0, 6)
              .map((o) => (
                <Link
                  key={o.slug}
                  href={`/agency/${o.slug}`}
                  className="text-sm text-slate-300 hover:text-white px-4 py-2 rounded-full bg-white/5 border border-white/10 hover:border-red-500/30 transition-colors"
                >
                  {o.city}
                </Link>
              ))}
          </div>
        </div>
      </section>

      {/* Service links — internal linking to service pages for SEO */}
      <section className="py-14 border-t border-white/8">
        <div className="container max-w-4xl mx-auto text-center">
          <p className="text-slate-500 text-xs uppercase tracking-widest font-semibold mb-5">
            Our Services in {l.city}
          </p>
          <div className="flex flex-wrap justify-center gap-2.5">
            {[
              { slug: "seo", name: "SEO" },
              { slug: "meta-ads", name: "Meta Ads" },
              { slug: "google-ads", name: "Google Ads" },
              { slug: "social-media", name: "Social Media" },
              { slug: "web-development", name: "Web Development" },
              { slug: "shopify", name: "Shopify" },
            ].map((sv) => (
              <Link
                key={sv.slug}
                href={`/services/${sv.slug}`}
                className="text-sm text-slate-300 hover:text-white px-4 py-2 rounded-full bg-white/5 border border-white/10 hover:border-red-500/30 transition-colors"
              >
                {sv.name}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#020205] via-[#0a0212] to-[#020205]" />
        <div className="container relative z-10 text-center max-w-2xl">
          <h2 className="font-display font-black text-white text-3xl md:text-4xl mb-5">
            Ready to Grow in {l.city}?
          </h2>
          <p className="text-slate-300 text-lg mb-8">{l.priceNote}. Free consultation, no obligation.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href={SITE.social.whatsapp} target="_blank" rel="noopener noreferrer" className="btn-primary text-base py-4 px-10 inline-flex justify-center">
              Chat on WhatsApp <ArrowRight size={17} />
            </a>
            <a href={`tel:${SITE.phoneClean}`} aria-label="Call HaadinGlobal" className="btn-ghost text-base py-4 px-8 inline-flex justify-center">
              Call {SITE.phone}
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
