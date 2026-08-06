import type { Metadata } from "next";
import Link from "next/link";
import { SERVICES } from "@/data/services";
import { ArrowRight } from "lucide-react";
import { CTASection } from "@/components/home/SiteSections";
import LandingLeadForm from "@/components/landing/LandingLeadForm";
import ServicePriceTag from "@/components/services/ServicePriceTag";
import ServiceCardText from "@/components/services/ServiceCardText";

export const metadata: Metadata = {
  title: "Digital Marketing Services — HaadinGlobal",
  description: "12 premium digital marketing services: Meta Ads, Google Ads, SEO, YouTube Automation, Shopify, Web Development, Branding & AI Automation.",
};

export default function ServicesPage() {
  return (
    <>
      <section className="pt-36 pb-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#020205] via-[#0a0215] to-[#020205]"/>
        <div className="container relative z-10 text-center">
          <div className="label mb-5">All Services</div>
          <h1 className="font-display font-black text-white mb-5">Complete Digital <span className="gradient-text">Growth Stack</span></h1>
          <p className="text-slate-400 max-w-xl mx-auto">12 premium services to grow your business at every stage.</p>
        </div>
      </section>
      <section className="py-16 bg-[#030306]">
        <div className="container">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {SERVICES.map(svc => (
              <Link key={svc.id} href={`/services/${svc.id}`}
                className="card-plain rounded-2xl overflow-hidden group hover:-translate-y-2 transition-all"
              >
                <div className={`h-1.5 bg-gradient-to-r ${svc.color}`}/>
                <div className="p-5">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${svc.color} flex items-center justify-center text-2xl mb-4`}>{svc.icon}</div>
                  <ServiceCardText title={svc.title} titleAr={svc.titleAr} desc={svc.shortDesc} descAr={svc.shortDescAr} />
                  <div className="flex items-center justify-between">
                    <ServicePriceTag pricePkr={svc.pricePkr} priceUsd={svc.priceUsd} size="sm" prefix="from " />
                    <ArrowRight size={15} className="text-red-400 group-hover:translate-x-1 transition-transform"/>
                  </div>
                </div>
              </Link>
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
