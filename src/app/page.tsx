import type { Metadata } from "next";
import HeroSection from "@/components/home/HeroSection";
import TrustBadges from "@/components/home/TrustBadges";
import ServicesSection from "@/components/home/ServicesSection";
import StatsSection from "@/components/home/StatsSection";
import AboutSection from "@/components/home/AboutSection";
import LatestPosts from "@/components/home/LatestPosts";
import LeadMagnet from "@/components/home/LeadMagnet";
import { FAQSection, CTASection, ProofCallSection } from "@/components/home/SiteSections";
import { faqJsonLd } from "@/data/faqs";
import { PricingCards } from "@/components/pricing/PricingCards";
import PricingCalculator from "@/components/pricing/PricingCalculator";
import ContactForm from "@/components/contact/ContactForm";

export const metadata: Metadata = {
  title: "HaadinGlobal — Results-Driven Digital Marketing Agency",
  description:
    "results-driven digital marketing agency. Meta Ads, Google Ads, SEO, YouTube Automation, Shopify & AI. Serving businesses in Pakistan, UAE, UK & USA. Book free consultation.",
  alternates: { canonical: "https://www.haadinglobal.com" },
};

export default function HomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <HeroSection />
      <TrustBadges />
      <ServicesSection />
      <StatsSection />
      <AboutSection />
      <ProofCallSection />
      <LeadMagnet />

      {/* Pricing */}
      <section className="section-pad bg-[#020205]" id="pricing">
        <div className="container">
          <div className="text-center mb-12">
            <div className="label mb-4">Pricing Plans</div>
            <h2 className="font-display font-black text-white mb-4">Simple, Transparent Pricing</h2>
            <p className="text-slate-400 max-w-xl mx-auto">No hidden fees. No contracts. Choose the plan that fits your growth.</p>
          </div>
          <PricingCards />
        </div>
      </section>

      <PricingCalculator />
      <LatestPosts />
      <FAQSection />

      {/* Contact */}
      <section className="section-pad bg-gradient-to-b from-[#020205] to-[#060210]" id="contact">
        <div className="container">
          <div className="grid lg:grid-cols-2 gap-16 items-start">
            <div>
              <div className="label mb-5">Contact Us</div>
              <h2 className="font-display font-black text-white mb-5">
                Grow Your Business <span className="gradient-text">Today</span>
              </h2>
              <p className="text-slate-400 leading-relaxed mb-8">
                Our team provides a free strategy consultation — no hidden charges. We'll contact you within 24 hours.
              </p>
              <div className="space-y-3">
                {[
                  { icon:"📞", t:"Phone & WhatsApp", v:"+92 305 4782677", href:"https://wa.me/923054782677" },
                  { icon:"📧", t:"Email", v:"haadinglobal@gmail.com", href:"mailto:haadinglobal@gmail.com" },
                  { icon:"📍", t:"Office", v:"Sahiwal, Punjab, Pakistan", href:"#" },
                  { icon:"🕐", t:"Response Time", v:"Within 2–4 hours", href:"#" },
                ].map(c => (
                  <a key={c.t} href={c.href} target={c.href.startsWith("http") ? "_blank" : undefined} rel="noopener noreferrer"
                    className="flex items-center gap-4 card px-5 py-4 border border-transparent hover:border-red-500/25 transition-all"
                  >
                    <span className="text-2xl">{c.icon}</span>
                    <div>
                      <p className="text-[11px] text-slate-500 font-medium">{c.t}</p>
                      <p className="text-white font-semibold text-sm">{c.v}</p>
                    </div>
                  </a>
                ))}
              </div>
            </div>
            <ContactForm />
          </div>
        </div>
      </section>

      <CTASection />
    </>
  );
}
