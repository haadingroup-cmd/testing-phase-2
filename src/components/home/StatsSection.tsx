"use client";
import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { useLanguage } from "@/components/providers/LanguageProvider";

function Counter({ to, suffix, duration = 1800 }: { to: number; suffix: string; duration?: number }) {
  const [count, setCount] = useState(0);
  const [started, setStarted] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) setStarted(true); }, { threshold: 0.3 });
    if (ref.current) io.observe(ref.current);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!started) return;
    let start = 0;
    const tick = (ts: number) => {
      if (!start) start = ts;
      const prog = Math.min((ts - start) / duration, 1);
      const ease = 1 - Math.pow(1 - prog, 3);
      setCount(Math.round(ease * to));
      if (prog < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [started, to, duration]);

  return <div ref={ref} className="font-black text-4xl lg:text-5xl gradient-text">{count}{suffix}</div>;
}

const STATS = [
  { to:120, suffix:"+",  icon:"🏆", key:"stats_projects" },
  { to:40,  suffix:"+",  icon:"😊", key:"stats_clients" },
  { to:90,  suffix:"%",  icon:"❤️", key:"stats_retention" },
  { to:1,   suffix:"+",  icon:"⚡", key:"stats_years" },
  { to:6,   suffix:"",   icon:"🌍", key:"stats_countries" },
  { to:500, suffix:"K+", icon:"💰", key:"stats_revenue" },
];

export default function StatsSection() {
  const { t } = useLanguage();
  return (
    <section className="py-20 relative overflow-hidden">
      <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse at 50% 50%, rgba(239,68,68,0.07) 0%, transparent 70%)" }} />
      <div className="container relative z-10">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-8">
          {STATS.map((s, i) => (
            <motion.div
              key={s.key}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="text-center group"
            >
              <div className="text-3xl mb-3 group-hover:scale-110 transition-transform duration-300">{s.icon}</div>
              <Counter to={s.to} suffix={s.suffix} />
              <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider mt-2">{t(s.key)}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
