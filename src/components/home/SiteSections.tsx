"use client";
import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Plus, Minus, CheckCircle, MessageCircle, Phone, Zap, Video, BarChart3, ShieldCheck, Eye } from "lucide-react";
import { useLanguage } from "@/components/providers/LanguageProvider";
import { SITE } from "@/data/siteConfig";
import { FAQS } from "@/data/faqs";

/**
 * Shared marketing sections used across many pages.
 * FAQ + CTA were previously exported from CoursesTeaser; that coupling is gone.
 * The FAQ list is also emitted as FAQPage structured data (AEO / rich results).
 */

// FAQ content now lives in a single source of truth — src/data/faqs.ts —
// which also generates the FAQPage JSON-LD rendered on the homepage. Keeping
// the visible list and the structured data in one place means they can never
// drift apart (a mismatch would make Google drop the FAQ rich result). To edit
// FAQ copy, edit src/data/faqs.ts only. Re-exported here for backward compat.
export { FAQS };

export function FAQSection() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section className="section-pad bg-[#020205]" id="faq">
      <div className="container">
        <div className="grid lg:grid-cols-5 gap-16">
          <div className="lg:col-span-2">
            <div className="label mb-5">FAQ</div>
            <h2 className="font-display font-black text-white mb-5">Frequently Asked <span className="gradient-text">Questions</span></h2>
            <p className="text-slate-400 leading-relaxed mb-8">Have more questions? Our team responds within 24 hours.</p>
            <a href={SITE.social.whatsapp} target="_blank" rel="noopener noreferrer" className="btn-primary inline-flex">Chat on WhatsApp</a>
          </div>
          <div className="lg:col-span-3 space-y-3">
            {FAQS.map((faq, i) => (
              <motion.div key={i}
                initial={{ opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.05 }}
                className="card overflow-hidden"
              >
                <button
                  onClick={() => setOpen(open === i ? null : i)}
                  className="w-full flex items-center justify-between px-6 py-5 text-left"
                  aria-expanded={open === i}
                >
                  <span className="font-semibold text-white pr-4 text-sm">{faq.q}</span>
                  <div className="w-7 h-7 rounded-lg bg-red-500/10 flex items-center justify-center text-red-400 flex-shrink-0">
                    {open === i ? <Minus size={13} /> : <Plus size={13} />}
                  </div>
                </button>
                <AnimatePresence>
                  {open === i && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.22 }}>
                      <div className="px-6 pb-5 text-slate-400 text-sm leading-relaxed border-t border-white/8 pt-4">{faq.a}</div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export function ProofCallSection() {
  const points = [
    { icon: <Eye size={20} />, title: "See real dashboards, live", detail: "On a quick video call we'll screen-share actual client ad accounts, analytics and results — not screenshots you have to take on faith." },
    { icon: <BarChart3 size={20} />, title: "Real numbers, real accounts", detail: "ROAS, leads, traffic growth — shown live from the platforms themselves, so you know exactly what we deliver." },
    { icon: <ShieldCheck size={20} />, title: "No contracts to find out", detail: "Judge us on proof before you commit. If the results don't convince you, there's no obligation to continue." },
  ];
  return (
    <section className="py-20 bg-[#030306] relative overflow-hidden">
      <div className="absolute top-1/2 left-0 w-96 h-96 rounded-full bg-red-600/8 blur-[120px] pointer-events-none -translate-y-1/2" />
      <div className="container relative z-10">
        <div className="max-w-2xl mx-auto text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-600/10 border border-red-500/20 text-red-300 text-sm font-semibold mb-5">
            <Video size={14} /> Proof Over Promises
          </div>
          <h2 className="font-display font-black text-white mb-4">
            Don&apos;t Just Take Our Word — <span className="gradient-text">We&apos;ll Show You Live</span>
          </h2>
          <p className="text-slate-400 text-lg leading-relaxed">
            Anyone can put big numbers on a website. On a free video call, we&apos;ll screen-share real client results — live dashboards, real ad accounts, real ROI — so you can see exactly what we deliver before you ever pay a rupee.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-5 max-w-5xl mx-auto mb-12">
          {points.map((p) => (
            <div key={p.title} className="card rounded-2xl p-6 text-center">
              <div className="w-12 h-12 rounded-xl bg-red-600/15 border border-red-500/25 flex items-center justify-center text-red-300 mx-auto mb-4">
                {p.icon}
              </div>
              <h3 className="text-white font-bold mb-2">{p.title}</h3>
              <p className="text-slate-400 text-sm leading-relaxed">{p.detail}</p>
            </div>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/consultation" className="btn-primary text-base py-4 px-9 inline-flex justify-center">
            Book a Free Results Call <ArrowRight size={17} />
          </Link>
          <a href={SITE.social.whatsapp} target="_blank" rel="noopener noreferrer" className="btn-ghost text-base py-4 px-8 inline-flex justify-center">
            <MessageCircle size={17} className="text-green-300" /> Ask on WhatsApp
          </a>
        </div>
      </div>
    </section>
  );
}

export function CTASection() {
  const { t } = useLanguage();
  return (
    <section className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-[#020205] via-[#080212] to-[#020205]" />
      <div className="absolute inset-0 opacity-12 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full bg-red-500 blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 rounded-full bg-red-600 blur-[120px]" />
      </div>
      <div className="container relative z-10">
        <motion.div initial={{ opacity: 0, scale: 0.96 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}
          className="max-w-4xl mx-auto text-center"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/8 border border-white/15 text-white text-sm font-medium mb-8">
            <Zap size={13} className="text-amber-400" /> Limited slots available this month
          </div>
          <h2 className="font-display font-black text-white mb-6">
            Grow Your Business<br /><span className="gradient-text">Starting Today</span>
          </h2>
          <p className="text-slate-300 text-xl leading-relaxed mb-10 max-w-2xl mx-auto">
            Businesses across five countries have started their digital journey with HaadinGlobal. When will you start?
          </p>
          <div className="flex flex-wrap justify-center gap-4 mb-10">
            {["Free consultation, no payment", "24hr response guaranteed", "ROI-focused strategy", "Global market expertise"].map(g => (
              <div key={g} className="flex items-center gap-2 text-sm text-slate-300">
                <CheckCircle size={13} className="text-green-300 flex-shrink-0" /> {g}
              </div>
            ))}
          </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Link href="/consultation" className="btn-primary text-base py-4 px-10 inline-flex justify-center shadow-[0_0_30px_rgba(239,68,68,0.4)]">
              {t("cta_book_free")} <ArrowRight size={17} />
            </Link>
            <a href={SITE.social.whatsapp} target="_blank" rel="noopener noreferrer" className="btn-ghost text-base py-4 px-8 justify-center inline-flex">
              <MessageCircle size={17} className="text-green-300" /> WhatsApp Us
            </a>
          </div>
          <div className="flex flex-wrap justify-center gap-6 text-slate-400 text-sm">
            <a href={`tel:${SITE.phoneClean}`} aria-label="Call HaadinGlobal" className="flex items-center gap-1.5 hover:text-white transition-colors">
              <Phone size={14} /> {SITE.phone}
            </a>
            <span>📧 {SITE.email}</span>
            <span>📍 {SITE.address}</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
