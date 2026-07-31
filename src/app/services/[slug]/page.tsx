import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CheckCircle, ArrowRight, MessageCircle } from "lucide-react";
import { SERVICES } from "@/data/services";
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
    title: `${svc.title} — HaadinGlobal`,
    description: svc.shortDesc,
    keywords: [svc.title, svc.category, "Pakistan", "HaadinGlobal", "digital marketing"],
    alternates: { canonical: url },
    openGraph: {
      type: "website",
      url,
      title: `${svc.title} — HaadinGlobal`,
      description: svc.shortDesc,
      siteName: "HaadinGlobal",
      images: [{ url: "/logo.png", width: 1200, height: 630, alt: `HaadinGlobal — ${svc.title}` }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${svc.title} — HaadinGlobal`,
      description: svc.shortDesc,
    },
  };
}

export default function ServicePage({ params }: { params: { slug: string } }) {
  const svc = SERVICES.find(s => s.id === params.slug);
  if (!svc) notFound();

  return (
    <>
      {/* Service-level structured data for richer search results */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Service",
          name: svc.title,
          description: svc.shortDesc,
          provider: {
            "@type": "Organization",
            name: "HaadinGlobal",
            url: "https://www.haadinglobal.com",
          },
          areaServed: ["PK", "AE", "GB", "US", "SA"],
          category: svc.category,
          offers: {
            "@type": "Offer",
            price: svc.pricePkr,
            priceCurrency: "PKR",
            url: `https://www.haadinglobal.com/services/${svc.id}`,
          },
        }) }}
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
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/10 border border-green-500/25 text-green-400 font-bold text-sm mb-6">
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
                      <CheckCircle size={14} className="text-green-400 flex-shrink-0"/>{p}
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
      <CTASection />
    </>
  );
}
