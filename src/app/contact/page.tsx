import type { Metadata } from "next";
import ContactForm from "@/components/contact/ContactForm";
import { SITE } from "@/data/siteConfig";

export const metadata: Metadata = {
  title: "Contact Us — HaadinGlobal",
  description: "Get in touch with HaadinGlobal. Book a free consultation or reach us via WhatsApp, email, or phone.",
};

export default function ContactPage() {
  return (
    <>
      <section className="pt-36 pb-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#020205] via-[#0a0215] to-[#020205]"/>
        <div className="container relative z-10 text-center">
          <div className="label mb-5">Contact Us</div>
          <h1 className="font-display font-black text-white mb-5">Let's Start a <span className="gradient-text">Conversation</span></h1>
          <p className="text-slate-400 max-w-xl mx-auto">We respond within 2–4 hours during business hours. For urgent matters, WhatsApp is fastest.</p>
        </div>
      </section>
      <section className="py-16 bg-[#030306]">
        <div className="container">
          <div className="grid lg:grid-cols-2 gap-16">
            <div>
              <h2 className="font-display font-black text-white mb-8 text-3xl">Reach <span className="gradient-text">Us Directly</span></h2>
              <div className="space-y-4">
                {[
                  {icon:"📞",t:"Phone & WhatsApp",v:SITE.phone,h:SITE.social.whatsapp,cta:"Chat Now"},
                  {icon:"📧",t:"Primary Email",v:SITE.email,h:`mailto:${SITE.email}`,cta:"Send Email"},
                  {icon:"📍",t:"Office",v:SITE.address,h:"#",cta:""},
                  {icon:"🕐",t:"Business Hours",v:"Mon–Sat: 9AM–8PM PKT",h:"#",cta:""},
                  {icon:"⚡",t:"Avg Response",v:"Within 2–4 hours",h:"#",cta:""},
                ].map(c => (
                  <div key={c.t} className="card p-5 flex items-start gap-4">
                    <span className="text-2xl">{c.icon}</span>
                    <div className="flex-1">
                      <p className="text-xs text-slate-500 mb-0.5">{c.t}</p>
                      <p className="text-white font-semibold text-sm">{c.v}</p>
                      {c.cta && c.h !== "#" && <a href={c.h} target="_blank" rel="noopener noreferrer" className="text-xs font-bold text-red-400 hover:underline mt-1 inline-block">{c.cta} →</a>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <ContactForm />
          </div>
        </div>
      </section>
    </>
  );
}
