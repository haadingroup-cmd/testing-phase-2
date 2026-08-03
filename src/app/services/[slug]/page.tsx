import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CheckCircle, ArrowRight, MessageCircle } from "lucide-react";
import { SERVICES, serviceFaqs } from "@/data/services";
import { CTASection } from "@/components/home/SiteSections";
import ServicePriceTag from "@/components/services/ServicePriceTag";
import ServiceDetailHero from "@/components/services/ServiceDetailHero";

export async function generateStaticParams() {
  return SERVICES.map(s => ({ slug: s.id }));
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const svc = SERVICES.find(s => s.id === params.slug);
  if (!svc) return { title: "Service Not Found" };
  const url = `https://www.haadinglobal.com/services/${svc.id}`;
  return {
    // Keyword-rich title; the root layout template adds "| HaadinGlobal" once,
    // so we don't repeat the brand here (was producing "… — HaadinGlobal | HaadinGlobal").
    title: `${svc.title} Services in Pakistan`,
    description: svc.shortDesc,
    keywords: [svc.title, `${svc.title} Pakistan`, svc.category, "HaadinGlobal", "digital marketing agency"],
    alternates: { canonical: url },
    openGraph: {
      type: "website",
      url,
      title: `${svc.title} Services | HaadinGlobal`,
      description: svc.shortDesc,
      siteName: "HaadinGlobal",
      images: [{ url: "/logo.png", width: 1200, height: 630, alt: `HaadinGlobal — ${svc.title}` }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${svc.title} Services | HaadinGlobal`,
      description: svc.shortDesc,
    },
  };
}

export default function ServicePage({ params }: { params: { slug: string } }) {
  const svc = SERVICES.find(s => s.id === params.slug);
  if (!svc) notFound();

  const faqs = serviceFaqs(svc);
  const url = `https://www.haadinglobal.com/services/${svc.id}`;

  // Combined structured data (@graph): Service + FAQPage + Breadcrumb.
  // FAQPage feeds People Also Ask / AI Overviews; Breadcrumb gives search
  // engines clear site hierarchy; Service describes the offering + price.
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Service",
        name: svc.title,
        description: svc.shortDesc,
        provider: { "@type": "Organization", name: "HaadinGlobal", url: "https://www.haadinglobal.com" },
        areaServed: ["PK", "AE", "GB", "US", "SA", "QA"],
        category: svc.category,
        offers: {
          "@type": "Offer",
          price: svc.pricePkr,
          priceCurrency: "PKR",
          url,
        },
      },
      {
        "@type": "FAQPage",
        mainEntity: faqs.map((f) => ({
          "@type": "Question",
          name: f.q,
          acceptedAnswer: { "@type": "Answer", text: f.a },
        })),
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: "https://www.haadinglobal.com" },
          { "@type": "ListItem", position: 2, name: "Services", item: "https://www.haadinglobal.com/services" },
          { "@type": "ListItem", position: 3, name: svc.title, item: url },
        ],
      },
    ],
  };

  return (
    <>
      {/* Service + FAQ + Breadcrumb structured data for rich results & AI answers */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {/* HERO — 2-column on desktop: title + description on left, pricing card on right (instantly visible) */}
      <section className="pt-32 pb-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#020205] via-[#0a0215] to-[#020205]"/>
        <div className="container relative z-10">
          <div className="grid lg:grid-cols-5 gap-8 items-start">
            {/* Left: hero text */}
            <div className="lg:col-span-3">
              <div className="label mb-4">{svc.category}</div>
              <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${svc.color} flex items-center justify-center text-3xl mb-5 shadow-xl`}>{svc.icon}</div>
              <ServiceDetailHero title={svc.title} titleAr={svc.titleAr} fullDesc={svc.fullDesc} />
              {svc.results && (
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/10 border border-green-500/25 text-green-300 font-bold text-sm mb-6">
                  ✓ {svc.results}
                </div>
              )}
              <div className="flex flex-wrap gap-3">
                <Link href="/consultation" className="btn-primary">Get Started <ArrowRight size={16}/></Link>
                <a href="https://wa.me/923054782677" target="_blank" rel="noopener noreferrer" className="btn-ghost">
                  <MessageCircle size={16}/> WhatsApp Us
                </a>
              </div>
            </div>

            {/* Right: pricing card — visible immediately, no scroll needed */}
            <div className="lg:col-span-2">
              <div className="card p-6 md:p-7 lg:sticky lg:top-24">
                <h3 className="font-bold text-white text-lg mb-2">Pricing Starts From</h3>
                <ServicePriceTag pricePkr={svc.pricePkr} priceUsd={svc.priceUsd} size="lg" />
                <p className="text-slate-400 text-sm mb-5">Custom plans available</p>
                <ul className="space-y-2 mb-6">
                  {["Free initial consultation","Dedicated account manager","Weekly/monthly reports","Cancel anytime"].map(p => (
                    <li key={p} className="flex items-center gap-2 text-sm text-slate-300">
                      <CheckCircle size={14} className="text-green-300 flex-shrink-0"/>{p}
                    </li>
                  ))}
                </ul>
                <Link href="/consultation" className="btn-primary w-full justify-center py-3 text-sm">
                  Book Free Consultation <ArrowRight size={15}/>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* WHAT'S INCLUDED — full-width section below */}
      <section className="py-16 bg-[#030306]">
        <div className="container">
          <div className="text-center mb-10">
            <h2 className="font-display font-black text-white mb-3">What&apos;s <span className="gradient-text">Included</span></h2>
            <p className="text-slate-400">Everything you need for results — nothing missing.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 max-w-5xl mx-auto">
            {svc.features.map(f => (
              <div key={f} className="flex items-start gap-2 p-3 rounded-xl bg-white/4 border border-white/8">
                <CheckCircle size={15} className="text-red-400 flex-shrink-0 mt-0.5"/>
                <span className="text-slate-300 text-sm">{f}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
      {/* FAQ — question headings + concise answers, optimised for AI Overviews
          & People Also Ask (matches the FAQPage schema above). */}
      <section className="py-16 bg-[#020205]" id="faq">
        <div className="container max-w-3xl mx-auto">
          <div className="text-center mb-10">
            <div className="label mb-3">FAQ</div>
            <h2 className="font-display font-black text-white mb-3">
              {svc.title} — <span className="gradient-text">Common Questions</span>
            </h2>
            <p className="text-slate-400">Everything you need to know before getting started.</p>
          </div>
          <div className="space-y-4">
            {faqs.map((f) => (
              <details key={f.q} className="card rounded-2xl p-5 group">
                <summary className="flex items-center justify-between cursor-pointer list-none">
                  <h3 className="text-white font-bold text-[15px] pr-4">{f.q}</h3>
                  <ArrowRight size={16} className="text-red-400 flex-shrink-0 transition-transform group-open:rotate-90" />
                </summary>
                <p className="text-slate-400 text-sm leading-relaxed mt-3">{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>
      <CTASection />
    </>
  );
}
