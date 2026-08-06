"use client";
import { motion } from "framer-motion";
import { MessageSquare, ShieldCheck, BadgeCheck, Clock, UserCheck, LineChart, Globe } from "lucide-react";

/**
 * Trust section built on HONEST, verifiable commitments (not self-declared
 * ratings or fake badges). These are real policies the agency controls, which
 * are the strongest and safest trust signals.
 */
const PILLARS = [
  { icon: MessageSquare, title: "Free strategy session", desc: "A no-cost consultation and custom plan before you commit to anything." },
  { icon: ShieldCheck, title: "No long-term lock-in", desc: "Month-to-month. Cancel anytime — we earn your business every month." },
  { icon: BadgeCheck, title: "Transparent pricing", desc: "Clear plans, no hidden fees. You always know what you're paying for." },
  { icon: Clock, title: "24-hour response", desc: "We reply to every enquiry within one business day." },
  { icon: UserCheck, title: "Dedicated manager", desc: "One point of contact who knows your account inside out." },
  { icon: LineChart, title: "Regular reporting", desc: "Weekly & monthly reports so you see exactly what's working." },
];

const MARKETS = [
  { flag: "🇵🇰", name: "Pakistan" }, { flag: "🇦🇪", name: "UAE" }, { flag: "🇶🇦", name: "Qatar" },
  { flag: "🇸🇦", name: "Saudi Arabia" }, { flag: "🇬🇧", name: "UK" }, { flag: "🇺🇸", name: "USA" },
];

export default function TrustBadges() {
  return (
    <section className="py-14 border-y border-white/8 bg-[#030306]">
      <div className="container">
        <div className="text-center mb-10">
          <div className="label mb-3">Why Businesses Trust Us</div>
          <h2 className="font-display font-black text-white text-2xl md:text-3xl">
            A partner that earns your trust — <span className="gradient-text">every month</span>
          </h2>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
          {PILLARS.map((p, i) => {
            const Icon = p.icon;
            return (
              <motion.div
                key={p.title}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06 }}
                className="card p-5 flex items-start gap-3.5"
              >
                <div className="w-10 h-10 rounded-xl bg-red-500/12 border border-red-500/20 flex items-center justify-center flex-shrink-0">
                  <Icon size={18} className="text-red-400" />
                </div>
                <div>
                  <h3 className="text-white font-bold text-sm mb-1">{p.title}</h3>
                  <p className="text-slate-400 text-xs leading-relaxed">{p.desc}</p>
                </div>
              </motion.div>
            );
          })}
        </div>

        <div className="flex flex-col items-center gap-3">
          <p className="text-slate-500 text-[11px] uppercase tracking-widest font-semibold flex items-center gap-2">
            <Globe size={13} className="text-red-400" /> Serving clients in
          </p>
          <div className="flex flex-wrap justify-center gap-2.5">
            {MARKETS.map((m) => (
              <span key={m.name} className="inline-flex items-center gap-1.5 text-sm text-slate-300 px-3 py-1.5 rounded-full bg-white/5 border border-white/10">
                <span>{m.flag}</span> {m.name}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
