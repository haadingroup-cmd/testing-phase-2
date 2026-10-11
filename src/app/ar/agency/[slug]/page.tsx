import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CheckCircle, MessageCircle, ArrowLeft } from "lucide-react";
import { LANDINGS_AR, getLandingAr } from "@/data/landings-ar";
import WhatsAppCTA from "@/components/common/WhatsAppCTA";
import { SITE } from "@/data/siteConfig";

const BASE = "https://www.haadinglobal.com";

// Only the Arabic hubs listed in LANDINGS_AR exist; any other /ar/agency URL is a real 404.
export const dynamicParams = false;

export function generateStaticParams() {
  return LANDINGS_AR.map((l) => ({ slug: l.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const l = getLandingAr(params.slug);
  if (!l) return { title: "Not Found" };
  const ar = `${BASE}/ar/agency/${l.slug}`;
  const en = `${BASE}/agency/${l.slug}`;
  return {
    title: { absolute: l.metaTitle },
    description: l.metaDescription,
    alternates: { canonical: ar, languages: { en, ar, "x-default": en } },
    openGraph: {
      type: "website",
      siteName: "HaadinGlobal",
      locale: l.locale,
      url: ar,
      title: l.metaTitle,
      description: l.metaDescription,
      images: [{ url: "/og-image.jpg", width: 1200, height: 630, alt: "HaadinGlobal" }],
    },
  };
}

export default function ArabicLandingPage({ params }: { params: { slug: string } }) {
  const l = getLandingAr(params.slug);
  if (!l) notFound();
  const url = `${BASE}/ar/agency/${l.slug}`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Service",
        name: l.h1,
        serviceType: "Digital marketing",
        description: l.metaDescription,
        url,
        inLanguage: "ar",
        provider: { "@id": `${BASE}/#org` },
        areaServed: { "@type": "Country", name: l.locale === "ar_SA" ? "Saudi Arabia" : "United Arab Emirates" },
      },
      {
        "@type": "FAQPage",
        inLanguage: "ar",
        mainEntity: l.faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
      },
    ],
  };

  return (
    // The site chrome is English; this page's own content is Arabic and right-to-left.
    <div lang="ar" dir="rtl">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <section className="pt-32 pb-16 relative overflow-hidden">
        <div className="absolute inset-0 hero-radial" />
        <div className="container relative z-10 max-w-4xl mx-auto">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
            <span className="inline-flex px-3 py-1.5 rounded-full bg-white/8 border border-white/15 text-white text-xs font-semibold">{l.badge}</span>
            <Link href={`/agency/${l.slug}`} hrefLang="en" lang="en" dir="ltr" className="text-sm text-slate-300 hover:text-white underline">
              Read in English
            </Link>
          </div>
          <h1 className="font-display font-black text-white text-3xl md:text-5xl leading-tight mb-5">{l.h1}</h1>
          <p className="text-slate-300 text-lg leading-relaxed mb-7">{l.subhead}</p>
          <div className="grid sm:grid-cols-2 gap-3 mb-8">
            {l.points.map((p) => (
              <div key={p} className="flex items-center gap-2 text-slate-200 text-sm">
                <CheckCircle size={15} className="text-green-300 flex-shrink-0" /> {p}
              </div>
            ))}
          </div>
          <div className="flex flex-wrap gap-3">
            <WhatsAppCTA source={`ar-${l.slug}-hero`} text={l.whatsappText} className="btn-primary inline-flex items-center gap-2">
              <MessageCircle size={16} /> تواصل معنا عبر واتساب
            </WhatsAppCTA>
            <Link href="/consultation" className="btn-ghost inline-flex items-center gap-2">
              احجز استشارة مجانية <ArrowLeft size={16} />
            </Link>
          </div>
        </div>
      </section>

      <section className="py-16 bg-[#030306]">
        <div className="container max-w-5xl mx-auto">
          <h2 className="font-display font-black text-white text-center mb-10">ما الذي نعالجه لك؟</h2>
          <div className="grid md:grid-cols-3 gap-5">
            {l.pains.map((p) => (
              <div key={p.problem} className="card p-6">
                <h3 className="text-white font-bold mb-3">{p.problem}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{p.solution}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container max-w-5xl mx-auto">
          <h2 className="font-display font-black text-white text-center mb-10">خدماتنا</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {l.services.map((s) => (
              <div key={s.name} className="card p-5">
                <h3 className="text-white font-bold mb-2">{s.name}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
          <p className="text-center mt-8">
            <Link href="/portfolio" className="text-red-400 hover:text-red-300 underline">شاهد أعمالنا</Link>
          </p>
        </div>
      </section>

      <section className="py-16 bg-[#020205]" id="faq">
        <div className="container max-w-3xl mx-auto">
          <h2 className="font-display font-black text-white text-center mb-10">الأسئلة الشائعة</h2>
          <div className="space-y-4">
            {l.faqs.map((f) => (
              <details key={f.q} className="card rounded-2xl p-5">
                <summary className="cursor-pointer list-none">
                  <h3 className="text-white font-bold text-[15px]">{f.q}</h3>
                </summary>
                <p className="text-slate-400 text-sm leading-relaxed mt-3">{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container max-w-3xl mx-auto text-center">
          <h2 className="font-display font-black text-white mb-4">ابدأ بمراجعة مجانية لموقعك</h2>
          <p className="text-slate-400 mb-7">أرسل لنا رابط موقعك عبر واتساب وسنخبرك بما يمنعه من جلب العملاء.</p>
          <div className="flex flex-wrap justify-center gap-3">
            <WhatsAppCTA source={`ar-${l.slug}-footer`} text={l.whatsappText} className="btn-primary inline-flex items-center gap-2">
              <MessageCircle size={16} /> واتساب
            </WhatsAppCTA>
            <a href={`tel:${SITE.phoneClean}`} className="btn-ghost" dir="ltr">{SITE.phone}</a>
          </div>
        </div>
      </section>
    </div>
  );
}
