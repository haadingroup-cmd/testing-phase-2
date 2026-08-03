"use client";
import { motion } from "framer-motion";

const BADGES = [
  { icon:"🎯", label:"Meta Ads Experts" },
  { icon:"📊", label:"Google Ads Experts" },
  { icon:"🛍️", label:"Shopify Developers" },
  { icon:"🔍", label:"SEO Specialists" },
  { icon:"🤖", label:"AI Automation" },
  { icon:"🏆", label:"150+ Clients Served" },
  { icon:"⭐", label:"5.0 Client Rating" },
  { icon:"🌍", label:"6 Countries" },
];

export default function TrustBadges() {
  return (
    <section className="py-10 border-y border-white/8 bg-[#030306] overflow-hidden">
      <div className="container">
        <div className="grid grid-cols-4 sm:grid-cols-8 gap-4">
          {BADGES.map((b, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
              className="flex flex-col items-center text-center gap-1.5 group"
            >
              <div className="w-11 h-11 rounded-xl bg-white/5 border border-white/8 flex items-center justify-center text-xl group-hover:border-red-500/30 group-hover:bg-red-500/8 group-hover:scale-110 transition-all duration-300">
                {b.icon}
              </div>
              <p className="text-[10px] font-semibold text-slate-400 group-hover:text-white transition-colors leading-tight">{b.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
