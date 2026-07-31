"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { SERVICES } from "@/data/services";
import { useLanguage } from "@/components/providers/LanguageProvider";
import { useCurrency } from "@/utils/useCurrency";

export default function ServicesSection() {
  const { t, lang } = useLanguage();
  const { currency } = useCurrency();
  const isAr = lang === "ar";
  const priceOf = (s: typeof SERVICES[number]) =>
    currency === "PKR" ? `PKR ${s.pricePkr.toLocaleString()}` : `$${s.priceUsd.toLocaleString()}`;
  return (
    <section className="section-pad" id="services">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="label mb-4">What We Offer</div>
          <h2 className="font-display font-black text-white mb-4 tracking-tight">{t("services_title")}</h2>
          <p className="text-slate-400 max-w-2xl mx-auto text-lg" style={{ fontFamily: "'Plus Jakarta Sans', 'Inter', sans-serif" }}>{t("services_sub")}</p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {SERVICES.map((svc, i) => (
            <motion.div
              key={svc.id}
              initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ delay: i * 0.04 }}
            >
              <Link href={`/services/${svc.id}`} className="block h-full card-plain rounded-2xl overflow-hidden group hover:-translate-y-2 transition-all duration-300">
                <div className={`h-1.5 bg-gradient-to-r ${svc.color}`} />
                <div className="p-5">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${svc.color} flex items-center justify-center text-2xl shadow-lg`}>
                      {svc.icon}
                    </div>
                    <span className="text-[10px] text-slate-500 font-mono uppercase tracking-wider px-2 py-1 rounded-md bg-white/5">{svc.category}</span>
                  </div>
                  <h3 className="text-white font-bold text-lg mb-2 group-hover:text-red-300 transition-colors">{isAr && svc.titleAr ? svc.titleAr : svc.title}</h3>
                  <p className="text-slate-400 text-sm leading-relaxed mb-4">{isAr && svc.shortDescAr ? svc.shortDescAr : svc.shortDesc}</p>
                  <div className="flex items-center justify-between pt-3 border-t border-white/8 gap-2">
                    <span className="text-base font-black text-white">
                      {priceOf(svc)}
                      <span className="text-[10px] font-medium text-slate-500 ml-0.5">/mo</span>
                    </span>
                    {svc.results && (
                      <span className="text-[10px] text-green-400 font-bold bg-green-500/8 px-2 py-1 rounded-md whitespace-nowrap">✓ {svc.results}</span>
                    )}
                    <ArrowRight size={15} className="text-red-400 group-hover:translate-x-1 transition-transform flex-shrink-0" />
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Funnel strip */}
        <motion.div
          initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
          className="mt-12 funnel-strip rounded-2xl overflow-hidden"
        >
          <div className="max-w-4xl mx-auto flex items-center justify-between gap-4 px-6 py-5 flex-wrap">
            <p className="text-white font-bold text-sm md:text-base">🚀 Free Strategy Consultation — Limited Slots This Month</p>
            <Link href="/consultation" className="flex-shrink-0 px-5 py-2.5 rounded-xl bg-white text-red-600 font-bold text-sm hover:bg-slate-50 transition-colors flex items-center gap-1">
              Book Now <ArrowRight size={14}/>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
