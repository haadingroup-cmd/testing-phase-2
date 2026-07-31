"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { CheckCircle, Star, Sparkles } from "lucide-react";
import { useCurrency } from "@/utils/useCurrency";

/**
 * Pricing plans. PKR prices are shown to Pakistan visitors; USD prices are
 * shown to everyone else. Both values are stored explicitly — no auto-uplift.
 * English only — no Urdu.
 */
const PLANS = [
  {
    name: "Basic Plan",
    tagline: "Startups & small businesses",
    badge: null as string | null,
    mo: 54, yr: 43,
    pkrMo: 15000, pkrYr: 12000,
    features: ["Facebook Page Management", "12 Social Media Posts", "Basic Graphic Design", "Monthly Report", "Google Ads", "SEO", "Video Content"],
    cta: "Get Started", href: "/consultation",
  },
  {
    name: "Standard Plan",
    tagline: "Growing brands",
    badge: "Most Popular",
    mo: 127, yr: 109,
    pkrMo: 35000, pkrYr: 30000,
    features: ["Facebook + Instagram", "20 Posts + Stories", "Professional Design", "Basic SEO (On-Page)", "Facebook Ads (Budget Separate)", "Email Marketing", "Google Ads"],
    cta: "Start Growing", href: "/consultation",
  },
  {
    name: "Pro Plan",
    tagline: "Scaling businesses",
    badge: "Professional",
    mo: 254, yr: 211,
    pkrMo: 70000, pkrYr: 58000,
    features: ["Complete Social Media", "30 Posts + Reels", "Full SEO (On + Off Page)", "Google + Facebook Ads", "Video Editing (4/month)", "WhatsApp Marketing", "Weekly Reports"],
    cta: "Go Premium", href: "/consultation",
  },
  {
    name: "Premium Plan",
    tagline: "Custom solutions",
    badge: "Elite",
    mo: null as number | null, yr: null as number | null, custom: true,
    pkrMo: 120000, pkrYr: 100000,
    features: ["Complete Digital Strategy", "Unlimited Posts", "Advanced SEO + Backlinks", "All Paid Ads", "Influencer Marketing", "E-commerce Management", "Dedicated Manager"],
    cta: "Contact Sales", href: "/contact",
  },
];

export function PricingCards() {
  const [yearly, setYearly] = useState(false);
  const { currency } = useCurrency();
  const isPkr = currency === "PKR";

  return (
    <div>
      {/* Billing toggle */}
      <div className="flex items-center justify-center gap-3 mb-10">
        <span className={`text-sm font-semibold ${!yearly ? "text-white" : "text-slate-500"}`}>Monthly</span>
        <button
          onClick={() => setYearly(!yearly)}
          aria-label="Toggle billing period"
          className={`relative h-7 rounded-full transition-colors ${yearly ? "bg-gradient-to-r from-red-500 to-red-700" : "bg-white/10"}`}
          style={{ width: "52px" }}
        >
          <div className={`absolute top-1 w-5 h-5 bg-white rounded-full shadow transition-transform ${yearly ? "translate-x-7" : "translate-x-1"}`} />
        </button>
        <span className={`text-sm font-semibold ${yearly ? "text-white" : "text-slate-500"}`}>
          Yearly <span className="text-green-400 text-xs font-bold">Save 17%</span>
        </span>
      </div>

      {/* Cards */}
      <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-5 items-stretch">
        {PLANS.map((plan, i) => {
          const popular = plan.badge === "Most Popular";

          const rawPrice = isPkr ? (yearly ? plan.pkrYr : plan.pkrMo) : (yearly ? plan.yr : plan.mo);
          const priceNum = rawPrice;

          const priceDisplay = isPkr
            ? `PKR ${priceNum?.toLocaleString()}`
            : `$${priceNum?.toLocaleString()}`;

          const savingYear = isPkr
            ? (plan.pkrMo && plan.pkrYr ? `Rs ${((plan.pkrMo - plan.pkrYr) * 12).toLocaleString()}` : null)
            : (plan.mo && plan.yr ? `$${((plan.mo - plan.yr) * 12).toLocaleString()}` : null);

          return (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 28 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ delay: i * 0.08 }}
              className={`group relative rounded-2xl overflow-hidden h-full flex flex-col justify-between transition-all duration-300 ${
                popular
                  ? "border-2 border-red-500/60 bg-gradient-to-b from-red-500/10 to-[var(--bg-card)] shadow-[0_18px_50px_rgba(239,68,68,0.18)] xl:scale-[1.03]"
                  : "border border-[var(--border-2)] bg-[var(--bg-card)] hover:border-red-500/30 hover:-translate-y-1"
              }`}
              style={{ background: popular ? undefined : "var(--bg-card)" }}
            >
              <div className="w-full flex flex-col h-full justify-between">
                <div>
                  {/* Badge */}
                  {plan.badge ? (
                    <div className={`text-white text-[10px] font-black uppercase tracking-widest py-2 text-center flex items-center justify-center gap-1 ${
                      popular ? "bg-gradient-to-r from-red-500 to-red-700" : "bg-gradient-to-r from-slate-600 to-slate-800"
                    }`}>
                      {popular ? <Star size={10} fill="white" /> : <Sparkles size={10} />}
                      {plan.badge}
                    </div>
                  ) : (
                    <div className="h-[30px]" />
                  )}

                  <div className="p-6 pt-5">
                    <h3 className="text-2xl font-black mb-1 text-[var(--text)]">{plan.name}</h3>
                    <p className="text-slate-400 text-xs mb-5">{plan.tagline}</p>

                    {/* Price block */}
                    <div className="mb-6 pb-6 border-b border-[var(--border)] min-h-[78px] flex flex-col justify-center">
                      {plan.custom ? (
                        <div>
                          <p className="text-3xl font-black text-[var(--text)]">{isPkr ? priceDisplay : "Custom"}</p>
                          <p className="text-slate-500 text-[11px] mt-0.5">{isPkr ? "per month" : "Tailored to your goals"}</p>
                        </div>
                      ) : (
                        <div>
                          <div className="flex items-baseline gap-1">
                            <span className="text-2xl md:text-[1.7rem] font-black text-[var(--text)]">{priceDisplay}</span>
                            <span className="text-slate-500 text-sm font-semibold">/mo</span>
                          </div>
                          {yearly && savingYear && (
                            <p className="text-green-400 text-[11px] font-bold mt-1">Save {savingYear}/year</p>
                          )}
                        </div>
                      )}
                    </div>

                    <ul className="space-y-2.5 mb-6">
                      {plan.features.map((f) => (
                        <li key={f} className="flex items-start gap-2 text-sm">
                          <CheckCircle size={15} className="text-red-400 flex-shrink-0 mt-0.5" />
                          <span className="text-slate-300">{f}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="p-6 pt-0">
                  <Link
                    href={plan.href}
                    className={`block w-full text-center py-3 px-5 rounded-xl font-bold text-sm transition-all ${
                      popular
                        ? "bg-gradient-to-r from-red-500 to-red-700 text-white hover:shadow-[0_0_24px_rgba(239,68,68,0.45)] hover:-translate-y-0.5"
                        : "bg-[var(--surface-soft-2)] text-[var(--text)] border border-[var(--border-2)] hover:border-red-500/40 hover:-translate-y-0.5"
                    }`}
                  >
                    {plan.cta} →
                  </Link>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      <p className="text-center text-slate-500 text-xs mt-8">
        💡 14-day money-back guarantee · Cancel anytime · No setup fees
        {!isPkr && <span className="block mt-1 text-slate-500">Prices shown in USD for international clients.</span>}
      </p>
    </div>
  );
}
