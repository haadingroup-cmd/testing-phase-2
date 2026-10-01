"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { SERVICES } from "@/data/services";
import ServicePriceTag from "@/components/services/ServicePriceTag";
import { useLanguage } from "@/components/providers/LanguageProvider";

export default function ServicesSection() {
  const { t, lang } = useLanguage();
  const isAr = lang === "ar";
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
              <Link href={`/services/${svc.id}`} className="flex flex-col h-full card-plain rounded-2xl overflow-hidden group hover:-translate-y-2 transition-all duration-300">
                <div className={`h-1.5 bg-gradient-to-r ${svc.color}`} />
                <div className="p-5 flex flex-col flex-1">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${svc.color} flex items-center justify-center text-2xl shadow-lg`}>
                      {svc.icon}
                    </div>
                    <span className="text-[10px] text-slate-500 font-mono uppercase tracking-wider px-2 py-1 rounded-md bg-white/5">{svc.category}</span>
                  </div>
                  <h3 className="text-white font-bold text-lg mb-2 group-hover:text-red-300 transition-colors">{isAr && svc.titleAr ? svc.titleAr : svc.title}</h3>
                  <p className="text-slate-400 text-sm leading-relaxed mb-4">{isAr && svc.shortDescAr ? svc.shortDescAr : svc.shortDesc}</p>
                  {svc.results && (
                    <span className="self-start inline-block text-[11px] text-green-300 font-semibold bg-green-500/10 px-2 py-1 rounded-md mb-4">✓ {svc.results}</span>
                  )}
                  <div className="mt-auto flex items-end justify-between gap-3 pt-4 border-t border-white/8">
                    <ServicePriceTag pricePkr={svc.pricePkr} priceUsd={svc.priceUsd} billing={svc.billing} size="card" />
                    <ArrowRight size={16} className="text-red-400 group-hover:translate-x-1 transition-transform flex-shrink-0 mb-1" />
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
