"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { CheckCircle, Clock, TrendingUp, Users, Send, MessageCircle, Zap, Shield, Star } from "lucide-react";
import { SITE } from "@/data/siteConfig";
import { supabaseBrowser, SUPABASE_READY } from "@/lib/supabase";
import { SERVICES } from "@/data/services";
import { useBudgetOptions } from "@/utils/useBudgetOptions";

export default function ConsultationPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name:"", email:"", phone:"", service:"", website_social:"", budget:"", business:"" });
  const budgetOptions = useBudgetOptions();
  const [status, setStatus] = useState<"idle"|"sending"|"err">("idle");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("sending");

    // Save into the CRM (Manage Leads) — best effort, doesn't block the redirect.
    if (SUPABASE_READY) {
      try {
        const notes = [
          form.business,
          form.website_social && `Website/Social: ${form.website_social}`,
          form.budget && `Budget: ${form.budget}`,
        ].filter(Boolean).join(" · ");
        await supabaseBrowser().from("leads").insert({
          name: form.name, email: form.email, phone: form.phone,
          service: form.service, message: notes, source: "website", status: "new",
        });
      } catch { /* ignore */ }
    }

    try {
      const r = await fetch(`https://formspree.io/f/${SITE.formspree}`, {
        method:"POST",
        headers:{"Content-Type":"application/json",Accept:"application/json"},
        body: JSON.stringify({...form, _subject:"Free Consultation Request — HaadinGlobal"}),
      });
      if (r.ok) {
        router.push(`/thank-you?name=${encodeURIComponent(form.name)}`);
      } else {
        setStatus("err");
      }
    } catch { setStatus("err"); }
  }

  return (
    <main className="min-h-screen bg-[#020205]">
      <section className="relative pt-32 pb-20 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#020205] via-[#0a0215] to-[#020205]"/>
        <div className="absolute top-20 left-10 w-80 h-80 bg-red-600/10 rounded-full blur-[120px] pointer-events-none"/>
        <div className="absolute bottom-0 right-10 w-80 h-80 bg-rose-800/8 rounded-full blur-[100px] pointer-events-none"/>

        <div className="relative max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-start">

            {/* LEFT */}
            <motion.div initial={{opacity:0,x:-30}} animate={{opacity:1,x:0}} transition={{duration:0.6}}>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/12 border border-green-500/25 text-green-300 text-sm font-bold mb-6">
                <Zap size={13}/> 100% Free · No Obligation
              </div>
              <h1 className="font-display font-black text-white mb-5">
                Free Strategy<span className="block gradient-text">Consultation</span>
              </h1>
              <p className="text-slate-300 text-lg mb-8 leading-relaxed">
                In 30 minutes, our expert will analyze your digital presence, identify growth opportunities, and create a custom roadmap — completely free.
              </p>
              <div className="space-y-4 mb-8">
                {[
                  {icon:<TrendingUp size={17}/>,t:"Full Digital Audit",d:"Complete review of your website, SEO, ads & social media"},
                  {icon:<CheckCircle size={17}/>,t:"Growth Opportunities",d:"Top 3 fastest ROI opportunities identified for your business"},
                  {icon:<Users size={17}/>,t:"Custom 90-Day Roadmap",d:"Actionable growth plan with clear milestones"},
                  {icon:<Clock size={17}/>,t:"Zero Pressure",d:"Genuinely free — no aggressive sales or hidden agenda"},
                  {icon:<Shield size={17}/>,t:"Pakistani Market Experts",d:"Team that understands your local and international market"},
                ].map((item,i) => (
                  <motion.div key={item.t}
                    initial={{opacity:0,x:-20}} animate={{opacity:1,x:0}} transition={{delay:0.15+i*0.08}}
                    className="flex items-start gap-4 p-4 rounded-xl bg-white/4 border border-white/8 hover:border-red-500/20 transition-all"
                  >
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-red-600 to-rose-800 flex items-center justify-center text-white flex-shrink-0">{item.icon}</div>
                    <div>
                      <p className="font-semibold text-white text-sm">{item.t}</p>
                      <p className="text-slate-400 text-xs mt-0.5">{item.d}</p>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Testimonial */}
              <div className="p-5 rounded-2xl bg-gradient-to-r from-red-500/8 to-rose-900/8 border border-red-500/18">
                <div className="flex text-amber-400 mb-2">{[...Array(5)].map((_,i) => <Star key={i} size={13} fill="currentColor"/>)}</div>
                <p className="text-slate-300 text-sm italic mb-3">"The free consultation gave us more clarity than 3 months with our previous agency. We had a complete strategy in 30 minutes!"</p>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-red-600 to-rose-800 flex items-center justify-center text-white text-xs font-black">JH</div>
                  <div>
                    <p className="text-white text-xs font-semibold">James Harrison</p>
                    <p className="text-slate-500 text-xs">CEO, NexaTech UK</p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* RIGHT */}
            <motion.div initial={{opacity:0,x:30}} animate={{opacity:1,x:0}} transition={{delay:0.2,duration:0.6}}>
              <div className="card p-8">
                {(
                  <>
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="text-white font-black text-xl">Book Your Free Session</h2>
                      <span className="text-xs text-green-300 px-2 py-1 rounded-full bg-green-500/10 border border-green-500/20 font-bold">FREE</span>
                    </div>
                    <form onSubmit={submit} className="space-y-4">
                      <div className="grid sm:grid-cols-2 gap-4">
                        <div>
                          <label>Your Name *</label>
                          <input type="text" required value={form.name} onChange={e=>setForm({...form,name:e.target.value})} placeholder="Your full name"/>
                        </div>
                        <div>
                          <label>WhatsApp Number *</label>
                          <input type="tel" required value={form.phone} onChange={e=>setForm({...form,phone:e.target.value})} placeholder="Your WhatsApp number"/>
                        </div>
                      </div>
                      <div>
                        <label>Email Address *</label>
                        <input type="email" required value={form.email} onChange={e=>setForm({...form,email:e.target.value})} placeholder="you@example.com"/>
                      </div>
                      <div>
                        <label>Service of Interest</label>
                        <select value={form.service} onChange={e=>setForm({...form,service:e.target.value})}>
                          <option value="">Select service...</option>
                          {SERVICES.map(s => <option key={s.id} value={s.title}>{s.title}</option>)}
                          <option value="Not sure — guide me">Not sure — guide me</option>
                        </select>
                      </div>
                      <div>
                        <label>Your Website or Social Media <span className="text-slate-500 text-xs font-normal">(optional)</span></label>
                        <input type="text" value={form.website_social} onChange={e=>setForm({...form,website_social:e.target.value})} placeholder="https://yoursite.com or @yourhandle"/>
                      </div>
                      <div>
                        <label>Monthly Budget</label>
                        <select value={form.budget} onChange={e=>setForm({...form,budget:e.target.value})}>
                          <option value="">Select budget range...</option>
                          {budgetOptions.map(b => <option key={b}>{b}</option>)}
                          <option>Project-based (one-time)</option>
                        </select>
                      </div>
                      <div>
                        <label>About Your Business</label>
                        <textarea rows={3} value={form.business} onChange={e=>setForm({...form,business:e.target.value})}
                          placeholder="What do you sell? What challenge are you facing? What results do you want?"/>
                      </div>
                      {status === "err" && (
                        <p className="text-red-400 text-sm bg-red-500/10 px-3 py-2 rounded-lg">
                          Failed to send. <button type="button" onClick={() => window.open(SITE.social.whatsapp, "_blank", "noopener,noreferrer")} className="underline font-semibold text-red-300">WhatsApp us directly</button>
                        </p>
                      )}
                      <button type="submit" disabled={status==="sending"}
                        className="btn-primary w-full py-4 justify-center text-base disabled:opacity-50"
                      >
                        {status==="sending"
                          ? <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"/> Sending...</>
                          : <><Send size={16}/> Book Free Consultation</>
                        }
                      </button>
                      <p className="text-center text-slate-500 text-xs">
                        Or WhatsApp: <button type="button" onClick={() => window.open(SITE.social.whatsapp, "_blank", "noopener,noreferrer")} className="text-green-300 font-semibold hover:underline">+{SITE.whatsapp}</button>
                      </p>
                    </form>
                  </>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </main>
  );
}
