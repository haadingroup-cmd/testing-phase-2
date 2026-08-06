import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { CheckCircle, ArrowRight } from "lucide-react";
import StatsSection from "@/components/home/StatsSection";
import { CTASection } from "@/components/home/SiteSections";

export const metadata: Metadata = {
  title: "About Us — HaadinGlobal Digital Agency",
  description: "Learn about HaadinGlobal — our story, mission, values, and the team behind results-driven digital marketing agency.",
};

const TEAM = [
  { name:"Muhammad Haseeb", role:"Founder & CEO", spec:"Digital Strategy, SEO, PPC", img:"/muhammad-haseeb.webp" },
  { name:"Hadi Nasser", role:"Head of Technology", spec:"Web Dev, AI Automation", emoji:"👨‍💻" },
  { name:"Sara Ahmed", role:"Creative Director", spec:"Branding, Design, UX", emoji:"👩‍🎨" },
  { name:"Ali Raza", role:"PPC Specialist", spec:"Google & Meta Ads", emoji:"🎯" },
  { name:"Fatima Khan", role:"Content Strategist", spec:"SEO Writing, Copywriting", emoji:"✍️" },
  { name:"Umar Farooq", role:"Social Media Lead", spec:"SMM, Influencer Marketing", emoji:"📱" },
];

export default function AboutPage() {
  return (
    <>
      <section className="pt-36 pb-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#020205] via-[#0a0215] to-[#020205]"/>
        <div className="container relative z-10 text-center">
          <div className="label mb-5">Our Story</div>
          <h1 className="font-display font-black text-white mb-6">Built for Businesses That <span className="gradient-text">Refuse to Settle</span></h1>
          <p className="text-slate-400 max-w-2xl mx-auto text-lg">HaadinGlobal was founded on a simple belief: every business deserves access to world-class digital marketing.</p>
        </div>
      </section>

      <section className="py-20 bg-[#030306]">
        <div className="container">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="font-display font-black text-white mb-5">From Sahiwal to the <span className="gradient-text">World Stage</span></h2>
              <div className="space-y-4 text-slate-400 leading-relaxed">
                <p>Founded in 2020, HaadinGlobal started with a mission: bring international-quality digital marketing to businesses of all sizes across Pakistan and beyond.</p>
                <p>What began as a small passionate team has grown into a full-service digital agency serving clients in Pakistan, UAE, the UK, the USA, and Saudi Arabia — managing meaningful ad spend and delivering successful projects for our clients.</p>
                <p>Today, HaadinGlobal is recognized as one of the most trusted and results-driven digital agencies in the region, with a strong client retention rate and a focus on measurable, verifiable results.</p>
              </div>
              <div className="mt-8 grid grid-cols-2 gap-4">
                {[{v:"$500K+",l:"Ad Spend Managed"},{v:"120+",l:"Projects"},{v:"40+",l:"Happy Clients"},{v:"6",l:"Markets"}].map(s => (
                  <div key={s.l} className="card px-5 py-4">
                    <p className="text-2xl font-black gradient-text">{s.v}</p>
                    <p className="text-sm text-slate-500">{s.l}</p>
                  </div>
                ))}
              </div>
              <div className="mt-8 flex gap-3">
                <Link href="/consultation" className="btn-primary">Free Consultation <ArrowRight size={16}/></Link>
                <Link href="/portfolio" className="btn-ghost">Our Work</Link>
              </div>
            </div>
            <div className="card p-6">
              <div className="rounded-2xl overflow-hidden mb-5 bg-gradient-to-b from-[var(--bg-elev)] to-[var(--bg-card)] border border-[var(--border)]">
                <div className="relative w-full aspect-square sm:aspect-[4/5] max-h-[440px] mx-auto">
                  <Image
                    src="/muhammad-haseeb.webp"
                    alt="Muhammad Haseeb — Founder & CEO"
                    fill
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="object-cover"
                    style={{ objectPosition: "center 30%" }}
                    priority
                  />
                </div>
                <div className="px-4 py-3 border-t border-[var(--border)]">
                  <p className="text-white font-black text-xl">Muhammad Haseeb</p>
                  <p className="text-red-400 text-sm font-semibold">Founder &amp; CEO, HaadinGlobal</p>
                </div>
              </div>
              <p className="text-slate-400 text-sm leading-relaxed italic">&quot;From Sahiwal to serving clients globally — our mission has always been to deliver real, measurable results for every business we work with.&quot;</p>
            </div>
          </div>
        </div>
      </section>

      <StatsSection />

      <section className="py-20 bg-[#030306]">
        <div className="container">
          <div className="text-center mb-12">
            <div className="label mb-4">The Team</div>
            <h2 className="font-display font-black text-white">Meet the <span className="gradient-text">Experts</span></h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {TEAM.map(m => (
              <div key={m.name} className="card p-7 text-center hover:-translate-y-2 transition-all">
                {m.img ? (
                  <div className="relative w-20 h-20 rounded-2xl overflow-hidden mx-auto mb-4">
                    <Image src={m.img} alt={m.name} fill className="object-cover object-top"/>
                  </div>
                ) : (
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-red-600 to-rose-800 flex items-center justify-center text-3xl mx-auto mb-4">{m.emoji}</div>
                )}
                <h3 className="font-black text-white text-lg">{m.name}</h3>
                <p className="text-red-400 text-sm font-semibold mb-1">{m.role}</p>
                <p className="text-slate-500 text-xs">{m.spec}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <CTASection />
    </>
  );
}
