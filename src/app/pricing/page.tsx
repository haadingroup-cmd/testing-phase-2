import type { Metadata } from "next";
import { PricingCards } from "@/components/pricing/PricingCards";
import PricingCalculator from "@/components/pricing/PricingCalculator";
import { CTASection } from "@/components/home/SiteSections";
import LandingLeadForm from "@/components/landing/LandingLeadForm";

export const metadata: Metadata = {
  title: "Pricing — Transparent Plans | HaadinGlobal",
  description: "Clear, transparent pricing for Meta Ads, Google Ads, SEO, web development, and more. No hidden fees.",
};

export default function PricingPage() {
  return (
    <>
      <section className="pt-36 pb-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#020205] via-[#0a0215] to-[#020205]"/>
        <div className="container relative z-10 text-center">
          <div className="label mb-5">Pricing</div>
          <h1 className="font-display font-black text-white mb-5">Simple, <span className="gradient-text">Transparent Pricing</span></h1>
          <p className="text-slate-400 max-w-xl mx-auto">No hidden fees, no long-term contracts. Cancel anytime.</p>
        </div>
      </section>
      <section className="py-16 bg-[#030306]">
        <div className="container"><PricingCards /></div>
      </section>
      <PricingCalculator />
      {/* FREE QUOTE / LEAD FORM — captures straight into the CRM */}
      <section className="py-16 bg-[#020205]">
        <div className="container max-w-xl mx-auto">
          <div className="text-center mb-8">
            <div className="label mb-3">Free Quote</div>
            <h2 className="font-display font-black text-white text-3xl mb-3">Not Sure Which Plan Fits?</h2>
            <p className="text-slate-400">
              Tell us about your business and we&apos;ll recommend the right plan with a custom quote within 24 hours — no cost, no obligation.
            </p>
          </div>
          <div className="card p-6 md:p-8">
            <LandingLeadForm source="pricing" city="" priceNote="Free consultation" leadSource="website" />
          </div>
        </div>
      </section>

      <CTASection />
    </>
  );
}
