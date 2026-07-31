"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Star, Quote, MapPin, ShieldCheck } from "lucide-react";
import { TESTIMONIALS } from "@/data/testimonials";
import { useLanguage } from "@/components/providers/LanguageProvider";

export default function TestimonialsSection() {
  const { t } = useLanguage();
  const [idx, setIdx] = useState(0);
  const [dir, setDir] = useState(1);

  useEffect(() => {
    const id = setInterval(() => nav(1), 6000);
    return () => clearInterval(id);
  }, []);

  const nav = (d: number) => { setDir(d); setIdx(p => (p + d + TESTIMONIALS.length) % TESTIMONIALS.length); };
  const item = TESTIMONIALS[idx];

  return (
    <section className="section-pad relative overflow-hidden" id="testimonials">
      <div className="absolute inset-0 bg-gradient-to-b from-[#020205] via-[#080212] to-[#020205]" />
      <div className="absolute top-20 left-10 w-72 h-72 bg-red-600/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="container relative z-10">
        <motion.div initial={{ opacity:0, y:20 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }} className="text-center mb-14">
          <div className="label mb-4"><Star size={11}/> Client Stories</div>
          <h2 className="font-display font-black text-white mb-4">{t("testimonials_title")}</h2>
          <p className="text-slate-400 max-w-xl mx-auto">Real results from real businesses — verifiable ROI with every engagement.</p>
        </motion.div>

        <div className="max-w-4xl mx-auto mb-10">
          <AnimatePresence mode="wait" custom={dir}>
            <motion.div
              key={idx}
              custom={dir}
              initial={{ opacity:0, x: dir*50, scale:0.96 }}
              animate={{ opacity:1, x:0, scale:1 }}
              exit={{ opacity:0, x: dir*-50, scale:0.96 }}
              transition={{ duration:0.35 }}
              className="card p-8 md:p-10 relative overflow-hidden"
            >
              <div className={`absolute top-0 inset-x-0 h-0.5 bg-gradient-to-r ${item.color}`} />
              <div className="flex items-start justify-between mb-6">
                <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-red-600 to-rose-800 flex items-center justify-center">
                  <Quote size={22} className="text-white"/>
                </div>
                <div className="flex gap-0.5">{[...Array(item.rating)].map((_,i) => <Star key={i} size={17} className="text-amber-400 fill-amber-400"/>)}</div>
              </div>
              <p className="text-slate-200 text-lg leading-relaxed mb-8">"{item.text}"</p>
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div className="flex items-center gap-4">
                  <img src={item.avatarUrl} alt={item.name} width={56} height={56} loading="lazy"
                    className={`w-14 h-14 rounded-xl border border-white/10 bg-gradient-to-br ${item.color}`}/>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <p className="font-bold text-white">{item.name}</p>
                      <ShieldCheck size={15} className="text-red-400"/>
                    </div>
                    <p className="text-slate-400 text-sm">{item.role} · {item.company}</p>
                    <div className="flex items-center gap-1 mt-0.5">
                      <MapPin size={10} className="text-slate-500"/>
                      <span className="text-[11px] text-slate-500">{item.country} {item.flag}</span>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col gap-2 items-end">
                  <span className="px-3 py-1.5 rounded-full bg-green-500/10 border border-green-500/20 text-green-400 text-xs font-bold">✓ {item.result}</span>
                  <span className="px-3 py-1 rounded-lg bg-red-500/8 border border-red-500/15 text-red-300 text-xs">{item.service}</span>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          <div className="flex items-center justify-center gap-4 mt-6">
            <button aria-label="Previous testimonial" onClick={() => nav(-1)} className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:text-red-400 hover:border-red-500/30 transition-all">
              <ChevronLeft size={19}/>
            </button>
            <div className="flex gap-2">
              {TESTIMONIALS.map((_,i) => (
                <button key={i} aria-label={`Go to testimonial ${i+1}`} aria-current={i===idx} onClick={() => { setDir(i>idx?1:-1); setIdx(i); }}
                  className="w-6 h-6 flex items-center justify-center">
                  <span className={`block rounded-full transition-all ${i===idx ? "w-7 h-2.5 bg-gradient-to-r from-red-500 to-rose-700" : "w-2.5 h-2.5 bg-white/15 hover:bg-white/25"}`}/>
                </button>
              ))}
            </div>
            <button aria-label="Next testimonial" onClick={() => nav(1)} className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:text-red-400 hover:border-red-500/30 transition-all">
              <ChevronRight size={19}/>
            </button>
          </div>
        </div>

        {/* Avatar grid */}
        <div className="grid grid-cols-4 sm:grid-cols-8 gap-3">
          {TESTIMONIALS.map((item,i) => (
            <motion.button key={item.id}
              initial={{ opacity:0, y:12 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }} transition={{ delay:i*0.05 }}
              onClick={() => { setDir(i>idx?1:-1); setIdx(i); }}
              className={`p-3 rounded-xl text-center transition-all ${i===idx ? "bg-red-500/10 border border-red-500/40" : "bg-white/4 border border-white/8 hover:border-white/20"}`}
            >
              <img src={item.avatarUrl} alt={item.name} width={36} height={36} loading="lazy"
                className={`w-9 h-9 rounded-lg mx-auto mb-1.5 bg-gradient-to-br ${item.color}`}/>
              <p className="text-[10px] font-semibold text-white truncate">{item.name.split(" ")[0]}</p>
              <p className="text-[9px] text-green-400 font-bold truncate">{item.result.split(" ").slice(0,2).join(" ")}</p>
            </motion.button>
          ))}
        </div>
      </div>
    </section>
  );
}
