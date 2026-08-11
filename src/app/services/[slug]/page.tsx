import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CheckCircle, ArrowRight, MessageCircle } from "lucide-react";
import { SERVICES, serviceFaqs } from "@/data/services";
import { CTASection } from "@/components/home/SiteSections";
import LandingLeadForm from "@/components/landing/LandingLeadForm";
import ServicePriceTag from "@/components/services/ServicePriceTag";
import ServiceDetailHero from "@/components/services/ServiceDetailHero";

// Keyword-optimized SEO titles & meta descriptions per service (Phase 2).
const SEO_TITLES: Record<string, string> = {
  "meta-ads": "Meta & Facebook Ads Services in Pakistan",
  "google-ads": "Google Ads Management in Pakistan",
  "seo": "SEO Services in Pakistan",
  "social-media": "Social Media Marketing in Pakistan",
  "youtube-automation": "YouTube Automation Services",
  "web-development": "Website Development in Pakistan | From PKR 80,000",
  "shopify": "Shopify Store Development in Pakistan",
  "branding": "Branding & Logo Design in Pakistan",
  "ai-automation": "AI Automation for Business",
  "content-writing": "SEO Content Writing Services",
  "tiktok-ads": "TikTok Ads Management in Pakistan",
  "graphic-design": "Graphic Design Services in Pakistan",
};
const SEO_DESCS: Record<string, string> = {
  "meta-ads": "Expert Meta & Facebook ads management in Pakistan. Targeted campaigns that turn ad spend into real leads and sales. Free consultation: +92 305 4782677.",
  "google-ads": "Professional Google Ads management in Pakistan. Capture high-intent buyers the moment they search. ROI-focused, transparent reporting. Free consultation.",
  "seo": "Affordable SEO services in Pakistan to rank on Google and grow organic traffic. Local & national SEO for real leads. Free consultation: +92 305 4782677.",
  "social-media": "Social media marketing in Pakistan — content, management and growth across Facebook, Instagram & TikTok. Build a trusted brand. Free consultation.",
  "youtube-automation": "YouTube automation services — we build and run faceless channels the right way, with quality content built to grow. Free consultation with HaadinGlobal.",
  "web-development": "Custom Next.js websites built to load fast & convert visitors into leads. 4-8 week delivery, mobile-first, SEO-ready. Free quote: +92 305 4782677.",
  "shopify": "Shopify store development in Pakistan — premium, conversion-optimized online stores built to sell. Setup, design and growth. Free consultation.",
  "branding": "Branding and logo design in Pakistan. A clean, memorable brand identity that builds trust and stands out. Free consultation with HaadinGlobal.",
  "ai-automation": "AI automation for business — automate repetitive workflows and scale smarter. Custom AI solutions for growing companies. Free consultation.",
  "content-writing": "SEO content writing services that rank and convert. Blog posts, web copy and articles built around buyer intent. Free consultation with HaadinGlobal.",
  "tiktok-ads": "TikTok ads management in Pakistan — scroll-stopping campaigns that build awareness and drive sales. ROI-focused. Free consultation.",
  "graphic-design": "Professional graphic design services in Pakistan — visuals and creative that communicate and convert. Free consultation with HaadinGlobal.",
};

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
    title: SEO_TITLES[svc.id] ?? `${svc.title} in Pakistan`,
    description: SEO_DESCS[svc.id] ?? svc.shortDesc,
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
      {/* FREE QUOTE / LEAD FORM — captures straight into the CRM */}
      <section className="py-16 bg-[#030306]">
        <div className="container max-w-xl mx-auto">
          <div className="text-center mb-8">
            <div className="label mb-3">Free Quote</div>
            <h2 className="font-display font-black text-white text-3xl mb-3">
              Get a Free {svc.title} Plan
            </h2>
            <p className="text-slate-400">
              Tell us about your business and we&apos;ll send a tailored plan within 24 hours — no cost, no obligation.
            </p>
          </div>
          <div className="card p-6 md:p-8">
            <LandingLeadForm source={`service-${svc.id}`} city="" priceNote="Free consultation" leadSource="website" />
          </div>
        </div>
      </section>
      <CTASection />
    </>
  );
}
