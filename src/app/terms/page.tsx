import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms & Conditions — HaadinGlobal",
  description: "HaadinGlobal terms and conditions for digital marketing services.",
};

export default function TermsPage() {
  return (
    <>
      <section className="pt-36 pb-12 relative">
        <div className="absolute inset-0 bg-gradient-to-br from-[#020205] via-[#0a0215] to-[#020205]"/>
        <div className="container relative z-10 text-center">
          <h1 className="font-display font-black text-white mb-4">Terms & Conditions</h1>
          <p className="text-slate-400">Last updated: January 1, 2025</p>
        </div>
      </section>
      <section className="py-16 bg-[#030306]">
        <div className="container max-w-3xl">
          <div className="space-y-8">
            {[
              { h:"1. Acceptance of Terms", t:"By using HaadinGlobal's services, you agree to these terms. If you do not agree, please do not use our services." },
              { h:"2. Services", t:"HaadinGlobal provides digital marketing services including Meta Ads, Google Ads, SEO, social media management, web development, Shopify development, branding, AI automation, YouTube automation, content writing, and graphic design." },
              { h:"3. Payment Terms", t:"Services are billed monthly in advance. Project-based work requires a 50% deposit. Payments are due within 5 business days of invoicing. Late payments may result in service suspension." },
              { h:"4. Service Delivery", t:"We will use commercially reasonable efforts to meet agreed timelines. However, results in digital marketing (SEO rankings, ROAS, follower growth) depend on multiple factors and cannot be guaranteed." },
              { h:"5. Intellectual Property", t:"All creative work produced by HaadinGlobal for clients becomes the client's property upon full payment. HaadinGlobal retains the right to showcase work in our portfolio unless otherwise agreed." },
              { h:"6. Termination", t:"Either party may terminate services with 30 days written notice. Clients are responsible for fees incurred up to the termination date." },
              { h:"7. Limitation of Liability", t:"HaadinGlobal's liability is limited to the amount paid for services in the preceding 3 months. We are not liable for indirect or consequential damages." },
              { h:"8. Governing Law", t:"These terms are governed by the laws of Pakistan. Any disputes will be resolved through arbitration in Faisalabad, Punjab, Pakistan." },
              { h:"9. Contact", t:"Questions about these terms: haadinglobal@gmail.com or WhatsApp +92 305 4782677." },
            ].map(s => (
              <div key={s.h}>
                <h2 className="font-display font-bold text-white text-xl mb-3">{s.h}</h2>
                <p className="text-slate-400 leading-relaxed text-sm">{s.t}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
