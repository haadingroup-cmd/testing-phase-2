"use client";
import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { ArrowRight, CheckCircle, Calculator, Zap, DollarSign, Calendar } from "lucide-react";
import { useLanguage } from "@/components/providers/LanguageProvider";
import { useCurrency } from "@/utils/useCurrency";

// Data Structure updated with fixed PKR and USD pricing according to your guidelines
const SVC_OPTS = [
  { id: "meta-ads",           label: "Meta Ads",           icon: "🎯", pkr: 15000,  usd: 54 },
  { id: "meta-graphics",      label: "Meta Ads + Graphics",icon: "🎨", pkr: 25000,  usd: 91 },
  { id: "google-ads",         label: "Google Ads",         icon: "📊", pkr: 25000,  usd: 91 },
  { id: "seo",                label: "SEO Services",       icon: "🔍", pkr: 35000,  usd: 127 },
  { id: "social-media",       label: "Social Media",       icon: "📱", pkr: 30000,  usd: 109 },
  { id: "youtube-automation", label: "YouTube Automation", icon: "▶️", pkr: 40000,  usd: 145 },
  { id: "web-development",    label: "Web Development",    icon: "💻", pkr: 80000,  usd: 291 },
  { id: "shopify",            label: "Shopify Store",      icon: "🛍️", pkr: 25000,  usd: 91 },
  { id: "branding",           label: "Branding",           icon: "✨", pkr: 50000,  usd: 182 },
  { id: "ai-automation",      label: "AI Automation",      icon: "🤖", pkr: 80000,  usd: 291 },
  { id: "content-writing",    label: "Content Writing",    icon: "✍️", pkr: 30000,  usd: 109 },
  { id: "tiktok-ads",         label: "TikTok Ads",         icon: "🎬", pkr: 15000,  usd: 54 },
  { id: "graphic-design",     label: "Graphic Design",     icon: "🎨", pkr: 10000,  usd: 36 },
];

const BUDGETS = [
  { key: "low",    label: "Flexible / Startup",  mult: 0.9 },
  { key: "medium", label: "Standard Growth",     mult: 1.0 },
  { key: "high",   label: "Premium Scale",       mult: 1.25 },
];

const TIMELINES = [
  { key: "1m",      label: "1 Month (Express)", urg: 1.2 },
  { key: "3m",      label: "3 Months (Standard)",urg: 1.0 },
  { key: "ongoing", label: "Ongoing Retainer",   urg: 0.9 },
];

const ROADMAP: Record<string, string[]> = {
  "meta-ads":           ["Audience research & pixel setup (Wk 1)","Ad creative design & launch (Wk 2)","A/B testing & optimization (Wk 3–4)","Scale winning campaigns (Month 2+)"],
  "meta-graphics":      ["Creative strategy & asset pipeline (Wk 1)","Ad copywriting & variant tests (Wk 2)","Scaling winning creative hooks (Month 2)"],
  "google-ads":         ["Keyword research & campaign structure (Wk 1)","Ad copy & extensions (Wk 2)","Bid optimization & quality score (Wk 3–4)","Performance Max & Shopping (Month 2+)"],
  "seo":                ["Technical audit & quick wins (Wk 1–2)","On-page optimization (Wk 3–4)","Content & link building (Month 2–3)","Ranking growth (Month 4–6)"],
  "web-development":    ["Design mockups & approval (Wk 1–2)","Development sprint (Wk 3–5)","Testing & revisions (Wk 6–7)","Launch & SEO setup (Wk 8)"],
  "shopify":            ["Store setup & theme customization (Wk 1–2)","Product upload & payment setup (Wk 3)","App integration (Wk 4)","Launch & marketing (Wk 5)"],
  "youtube-automation": ["Niche research & channel setup (Wk 1)","First 4 videos produced (Wk 2–3)","SEO optimization & thumbnails (Wk 4)","Monetization strategy (Month 2+)"],
  "ai-automation":      ["Process mapping & CRM setup (Wk 1–2)","Chatbot & workflow build (Wk 3–4)","Integration & testing (Wk 5–6)","Training & handover (Wk 7–8)"],
  "branding":           ["Brand discovery & strategy (Wk 1)","Logo concepts & revisions (Wk 2–3)","Full brand identity system (Wk 4)","Asset delivery & guidelines (Wk 5)"],
  "social-media":       ["Content strategy & calendar (Wk 1)","First month content creation (Wk 2)","Publishing & community mgmt (Ongoing)","Monthly performance review (Monthly)"],
};

export default function PricingCalculator() {
  const { t } = useLanguage();
  const [selected, setSelected] = useState<string[]>([]);
  const [budget, setBudget] = useState("");
  const [timeline, setTimeline] = useState("");
  const [shown, setShown] = useState(false);
  const { currency, ready } = useCurrency();
  const geoLoading = !ready;

  const toggle = (id: string) => {
    setSelected(p => p.includes(id) ? p.filter(s => s !== id) : [...p, id]);
    setShown(false);
  };

  const est = useMemo(() => {
    if (!selected.length) return { min: 0, max: 0 };

    // Sum prices; international (USD) figures get the +35% uplift.
    const base = selected.reduce((s, id) => {
      const option = SVC_OPTS.find(o => o.id === id);
      if (!option) return s;
      return s + (currency === "PKR" ? option.pkr : option.usd);
    }, 0);

    const bm = BUDGETS.find(b => b.key === budget)?.mult || 1;
    const tm = TIMELINES.find(t => t.key === timeline)?.urg || 1;
    const disc = selected.length >= 3 ? 0.85 : selected.length >= 2 ? 0.9 : 1;

    const mo = Math.round(base * bm * tm * disc);
    return { min: mo, max: Math.round(mo * 1.2) };
  }, [selected, budget, timeline, currency]);

  const roadmapItems = selected.slice(0, 3).flatMap(id => (ROADMAP[id] || []).slice(0, 2));

  return (
    <section className="section-pad relative overflow-hidden" id="calculator">
      <div className="absolute inset-0 bg-gradient-to-b from-[#020205] via-[#060210] to-[#020205]" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[280px] bg-red-600/8 rounded-full blur-[100px] pointer-events-none"/>

      <div className="container relative z-10">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
          <div className="label mb-4"><Calculator size={11}/> {t("calc_title")}</div>
          <h2 className="font-display font-black text-white mb-4">{t("calc_title")}</h2>
          <p className="text-slate-400 max-w-xl mx-auto">{t("calc_sub")}</p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {/* Steps Column */}
          <div className="lg:col-span-2">
            <div className="p-6 md:p-8 space-y-8 rounded-3xl border border-[var(--border-2)] bg-gradient-to-br from-[var(--bg-card)] to-[var(--bg-elev)] shadow-[0_20px_60px_rgba(0,0,0,0.30)]">
              {/* Step 1: Select Services */}
              <div>
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-8 h-8 rounded-lg bg-red-500/20 border border-red-500/30 flex items-center justify-center text-red-400 font-black text-sm">1</div>
                  <h3 className="text-white font-bold text-lg">{t("calc_step1")}</h3>
                  {selected.length > 0 && <span className="ml-auto text-xs text-red-400 font-bold bg-red-500/10 px-2 py-1 rounded-full">{selected.length} selected</span>}
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {SVC_OPTS.map(s => (
                    <button key={s.id} onClick={() => toggle(s.id)}
                      className={`relative p-3 rounded-xl border text-left transition-all duration-200 ${selected.includes(s.id)?"border-red-500/60 bg-red-500/10 shadow-[0_4px_18px_rgba(239,68,68,0.18)] -translate-y-0.5":"border-[var(--border-2)] bg-[var(--surface-soft)] hover:border-red-500/30 hover:-translate-y-0.5 hover:shadow-[0_6px_18px_rgba(0,0,0,0.18)]"}`}
                    >
                      {selected.includes(s.id) && (
                        <div className="absolute top-2 right-2 w-4 h-4 rounded-full bg-red-500 flex items-center justify-center">
                          <CheckCircle size={9} className="text-white"/>
                        </div>
                      )}
                      <span className="text-xl block mb-1">{s.icon}</span>
                      <span className="text-white text-xs font-semibold leading-tight block">{s.label}</span>
                      <span className="text-slate-500 text-[10px]">
                        {geoLoading ? "Loading..." : currency === "PKR" ? `from PKR ${s.pkr.toLocaleString()}/mo` : `from $${s.usd.toLocaleString()}/mo`}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Step 2: Budget Scale */}
              <div>
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-8 h-8 rounded-lg bg-red-500/20 border border-red-500/30 flex items-center justify-center text-red-400 font-black text-sm">2</div>
                  <h3 className="text-white font-bold text-lg">{t("calc_step2")}</h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {BUDGETS.map(b => (
                    <button key={b.key} onClick={() => { setBudget(b.key); setShown(false); }}
                      className={`p-3 rounded-xl border text-left text-sm font-semibold transition-all ${budget===b.key?"border-red-500/60 bg-red-500/10 text-white shadow-[0_4px_16px_rgba(239,68,68,0.15)]":"border-[var(--border-2)] bg-[var(--surface-soft)] text-slate-400 hover:border-red-500/30"}`}
                    >
                      <DollarSign size={13} className="inline mr-0.5 text-red-400"/>{b.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Step 3: Timeline Management */}
              <div>
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-8 h-8 rounded-lg bg-red-500/20 border border-red-500/30 flex items-center justify-center text-red-400 font-black text-sm">3</div>
                  <h3 className="text-white font-bold text-lg">{t("calc_step3")}</h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {TIMELINES.map(tl => (
                    <button key={tl.key} onClick={() => { setTimeline(tl.key); setShown(false); }}
                      className={`p-3 rounded-xl border text-left text-sm font-semibold transition-all ${timeline===tl.key?"border-red-500/60 bg-red-500/10 text-white shadow-[0_4px_16px_rgba(239,68,68,0.15)]":"border-[var(--border-2)] bg-[var(--surface-soft)] text-slate-400 hover:border-red-500/30"}`}
                    >
                      <Calendar size={13} className="inline mr-1 text-red-400"/>{tl.label}
                    </button>
                  ))}
                </div>
              </div>

              <button
                disabled={!selected.length || !budget || !timeline}
                onClick={() => setShown(true)}
                className="btn-primary w-full py-4 justify-center text-base font-bold disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <Zap size={17}/> {t("calc_btn")}
              </button>
            </div>
          </div>

          {/* Dynamic Generated Results Column */}
          <div>
            <AnimatePresence mode="wait">
              {shown && est.min > 0 ? (
                <motion.div key="result"
                  initial={{ opacity: 0, x: 28, scale: 0.95 }} animate={{ opacity: 1, x: 0, scale: 1 }} exit={{ opacity: 0 }}
                  className="p-6 sticky top-24 rounded-3xl border border-[var(--border-2)] bg-gradient-to-br from-[var(--bg-card)] to-[var(--bg-elev)] shadow-[0_20px_55px_rgba(0,0,0,0.35)]"
                >
                  <div className="label mb-4"><Zap size={11}/> {t("calc_result_title")}</div>
                  <div className="mb-6 p-5 rounded-2xl bg-gradient-to-br from-red-500/10 to-red-900/10 border border-red-500/20">
                    <p className="text-slate-400 text-xs mb-1">{t("calc_monthly_inv")}</p>
                    <p className="text-4xl font-black gradient-text">
                      {currency === "PKR" ? `PKR ${est.min.toLocaleString()}` : `$${est.min}`}
                    </p>
                    <p className="text-slate-500 text-xs mt-1">
                      – {currency === "PKR" ? `PKR ${est.max.toLocaleString()}` : `$${est.max.toLocaleString()}`}/month
                    </p>
                    {selected.length >= 2 && <p className="text-green-400 text-xs mt-2 font-bold">🎉 Bundle discount applied!</p>}
                  </div>
                  <div className="mb-5">
                    <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold mb-3">{t("calc_included")}</p>
                    <div className="space-y-2">
                      {selected.map(id => {
                        const s = SVC_OPTS.find(o=>o.id===id);
                        return s ? (
                          <div key={id} className="flex items-center gap-2 text-sm">
                            <CheckCircle size={13} className="text-red-400 flex-shrink-0"/>
                            <span className="text-white">{s.icon} {s.label}</span>
                          </div>
                        ) : null;
                      })}
                    </div>
                  </div>
                  {roadmapItems.length > 0 && (
                    <div className="mb-6">
                      <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold mb-3">{t("calc_roadmap")}</p>
                      <div className="space-y-2">
                        {roadmapItems.slice(0, 4).map((step, i) => (
                          <div key={i} className="flex items-start gap-2 text-xs text-slate-400">
                            <div className="w-1.5 h-1.5 rounded-full bg-red-400 flex-shrink-0 mt-1.5"/>
                            {step}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  <Link href="/consultation" className="btn-primary w-full justify-center py-3 text-sm font-bold flex items-center gap-2">
                    {t("calc_proposal")} <ArrowRight size={15}/>
                  </Link>
                  <p className="text-center text-slate-500 text-[11px] mt-3">Free consultation · No commitment</p>
                </motion.div>
              ) : (
                <motion.div key="ph" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  className="p-6 sticky top-24 flex flex-col items-center justify-center min-h-[420px] text-center rounded-3xl border border-[var(--border-2)] bg-gradient-to-br from-[var(--bg-card)] to-[var(--bg-elev)] shadow-[0_20px_55px_rgba(0,0,0,0.3)]"
                >
                  <Calculator size={44} className="text-red-500/25 mb-4"/>
                  <h3 className="text-white font-bold text-lg mb-2">{t("calc_result_title")}</h3>
                  <p className="text-slate-500 text-sm">Select services, budget & timeline to see your personalized estimate.</p>
                  <div className="mt-6 space-y-2 w-full">
                    {["Select services →","Choose budget →","Pick timeline →"].map((s,i) => (
                      <div key={i} className="h-10 rounded-xl bg-white/3 animate-pulse"/>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
