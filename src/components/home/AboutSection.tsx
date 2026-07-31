"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { CheckCircle, ArrowRight, Globe, TrendingUp, Target, Award } from "lucide-react";
import { useLanguage } from "@/components/providers/LanguageProvider";

const WHY = [
  { text: "Data-driven strategies — never guesswork", route: "/services/seo" },
  { text: "Dedicated account manager per client", route: "/contact" },
  { text: "Full transparency — real-time dashboards", route: "/services" },
  { text: "International expertise (UAE, UK, USA, PK, KSA)", route: "/portfolio" },
  { text: "All services under one roof", route: "/services" },
  { text: "AI-powered tools and automation", route: "/services/ai-automation" },
  { text: "14-day money-back guarantee", route: "/pricing" },
];

export default function AboutSection() {
  const { t } = useLanguage();
  return (
    <section className="section-pad relative" id="about">
      <div className="absolute inset-0 bg-gradient-to-b from-[#020205] via-[#060210] to-[#020205]" />
      <div className="container relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">

          {/* ── Left: CEO card ── */}
          <motion.div
            initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.7 }}
            className="relative"
          >
            <div className="card p-6">
              {/* Agency header (Clickable Logo and Title) */}
              <Link href="/" className="flex items-center gap-3 mb-5 group dynamic-link">
                <div className="relative w-9 h-9 flex-shrink-0">
                  <Image src="/logo-small.png" alt="HaadinGlobal" fill className="object-contain" />
                </div>
                <div>
                  <p className="font-black text-white text-base group-hover:text-red-400 transition-colors">HaadinGlobal</p>
                  <p className="text-xs text-slate-500">Premium Digital Agency</p>
                </div>
                <span className="ml-auto text-xs font-semibold px-3 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-red-400">Est. 2020</span>
              </Link>

              {/* CEO Photo — square frame with object-cover crops out excess
                  curtains/background and centers the person properly. Object-position
                  bias toward the upper portion keeps the face well-framed. */}
              <div className="rounded-2xl overflow-hidden mb-5 bg-gradient-to-b from-[var(--bg-elev)] to-[var(--bg-card)] border border-[var(--border)]">
                <div className="relative w-full aspect-square sm:aspect-[4/5] md:aspect-square lg:aspect-[4/5] max-h-[460px] mx-auto">
                  <Image
                    src="/muhammad-haseeb.webp"
                    alt="Muhammad Haseeb — Founder & CEO, HaadinGlobal"
                    fill
                    sizes="(max-width: 640px) 90vw, (max-width: 1024px) 45vw, 420px"
                    className="object-cover"
                    style={{ objectPosition: "center 30%" }}
                    priority
                  />
                </div>
                <div className="px-4 py-3 border-t border-[var(--border)]">
                  <p className="text-white font-black text-lg leading-tight">Muhammad Haseeb</p>
                  <p className="text-red-400 text-sm font-semibold">Founder &amp; CEO</p>
                  <p className="text-slate-400 text-xs mt-0.5">Digital Strategy · SEO · Paid Media · AI Automation</p>
                </div>
              </div>

              {/* Mini stats (Every Stat box is now Clickable) */}
              <div className="grid grid-cols-2 gap-3">
                {[
                  { icon:<TrendingUp size={15} className="text-red-400"/>,  v:"500+",  l:"Projects", route:"/portfolio" },
                  { icon:<Target size={15} className="text-amber-400"/>,     v:"98%",   l:"Retention", route:"/about" },
                  { icon:<Globe size={15} className="text-green-300"/>,      v:"5",     l:"Countries", route:"/portfolio" },
                  { icon:<Award size={15} className="text-blue-400"/>,       v:"5.0★",  l:"Rating", route:"/#testimonials" },
                ].map(m => (
                  <Link 
                    href={m.route} 
                    key={m.l} 
                    className="bg-white/5 border border-white/8 rounded-xl p-3 flex items-center gap-2.5 hover:bg-white/10 hover:border-red-500/30 transition-all duration-300"
                  >
                    {m.icon}
                    <div>
                      <p className="font-black text-white text-lg leading-none">{m.v}</p>
                      <p className="text-[11px] text-slate-500">{m.l}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Floating badge (Clickable link to pricing or case studies) */}
            <Link href="/portfolio" className="absolute -bottom-5 -right-4 card px-5 py-4 shadow-[0_0_30px_rgba(239,68,68,0.2)] hover:scale-105 transition-transform duration-300">
              <p className="text-2xl font-black gradient-text">$2M+</p>
              <p className="text-xs text-slate-500">Ad Spend Managed</p>
            </Link>
          </motion.div>

          {/* ── Right: copy ── */}
          <motion.div
            initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.7 }}
          >
            <div className="label mb-5">About HaadinGlobal</div>
            <h2 className="font-display font-black text-white mb-5">{t("about_title")}</h2>
            <p className="text-slate-400 leading-relaxed mb-4">
              HaadinGlobal is a premium international digital marketing agency founded on one principle:
              <strong className="text-white"> every client deserves measurable, real-world results</strong>.
            </p>
            <p className="text-slate-400 leading-relaxed mb-8">
              We combine cutting-edge technology, creative excellence, and data intelligence to build digital systems
              that generate leads, drive revenue, and scale businesses across Pakistan, UAE, the UK, and beyond.
            </p>
            
            {/* Features List (Now each point links directly to a relevant sub-page) */}
            <ul className="space-y-3 mb-8">
              {WHY.map(item => (
                <li key={item.text}>
                  <Link href={item.route} className="flex items-start gap-3 text-sm text-slate-300 hover:text-red-400 transition-colors group">
                    <CheckCircle size={17} className="text-red-400 flex-shrink-0 mt-0.5 group-hover:scale-110 transition-transform" />
                    <span>{item.text}</span>
                  </Link>
                </li>
              ))}
            </ul>
            
            <div className="flex flex-wrap gap-3">
              <Link href="/about" className="btn-primary">Our Story <ArrowRight size={16}/></Link>
              <Link href="/consultation" className="btn-ghost">Free Consultation</Link>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
