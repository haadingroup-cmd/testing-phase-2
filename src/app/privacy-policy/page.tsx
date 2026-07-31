import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy — HaadinGlobal",
  description: "HaadinGlobal privacy policy — how we collect, use, and protect your personal information.",
};

export default function PrivacyPage() {
  return (
    <>
      <section className="pt-36 pb-12 relative">
        <div className="absolute inset-0 bg-gradient-to-br from-[#020205] via-[#0a0215] to-[#020205]"/>
        <div className="container relative z-10 text-center">
          <h1 className="font-display font-black text-white mb-4">Privacy Policy</h1>
          <p className="text-slate-400">Last updated: January 1, 2025</p>
        </div>
      </section>
      <section className="py-16 bg-[#030306]">
        <div className="container max-w-3xl">
          <div className="prose prose-invert max-w-none space-y-8">
            {[
              { h:"1. Information We Collect", t:"We collect information you provide directly (name, email, phone, business details) when you fill out our contact forms, book consultations, or purchase services." },
              { h:"2. How We Use Your Information", t:"We use the information we collect to provide and improve our services, communicate with you about your projects, send relevant marketing communications (you can opt out anytime), and analyze how our website is used." },
              { h:"3. Information Sharing", t:"We do not sell or rent your personal information to third parties. We may share information with trusted service providers (Formspree for form processing, analytics tools) strictly to operate our business." },
              { h:"4. Cookies", t:"We use cookies to improve your browsing experience, analyze website traffic, and personalize content. You can disable cookies in your browser settings, though this may affect website functionality." },
              { h:"5. Data Security", t:"We implement industry-standard security measures to protect your information. However, no method of internet transmission is 100% secure." },
              { h:"6. Contact Us", t:"For any privacy-related questions, contact us at haadinglobal@gmail.com or WhatsApp +92 305 4782677." },
            ].map(s => (
              <div key={s.h}>
                <h2 className="font-display font-bold text-white text-xl mb-3">{s.h}</h2>
                <p className="text-slate-400 leading-relaxed">{s.t}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
