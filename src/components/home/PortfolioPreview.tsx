"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useLanguage } from "@/components/providers/LanguageProvider";

const CASES = [
  { id:"fashionhub",  title:"FashionHub — Shopify Growth",    client:"Hassan Raza · Faisalabad",    cat:"Shopify + Meta Ads",  color:"from-green-500 to-emerald-700",  icon:"🛍️", stats:[{l:"Daily Orders",v:"102"},{l:"Revenue",v:"Rs 1.2M"},{l:"ROAS",v:"4.2x"}],    result:"80K→1.2M/month",      period:"3 months" },
  { id:"glamourstudio",title:"Glamour Studio — Meta Ads",    client:"Ayesha Siddiqui · Karachi",   cat:"Meta Ads + Branding", color:"from-pink-500 to-rose-700",      icon:"🎯", stats:[{l:"ROAS",v:"6.2x"},{l:"Sales",v:"+180%"},{l:"Followers",v:"200K+"}],        result:"6.2x ROAS month 1",   period:"3 months" },
  { id:"techvision",  title:"TechVision — SEO Campaign",     client:"Usman Tariq · Lahore",        cat:"SEO + Content",       color:"from-red-500 to-rose-700",       icon:"🔍", stats:[{l:"Traffic",v:"+340%"},{l:"Keywords",v:"85+"},{l:"Leads",v:"180/mo"}],        result:"+340% organic traffic",period:"6 months" },
  { id:"khanprops",   title:"Khan Properties — Google Ads",  client:"Bilal Ahmed · Lahore",        cat:"Google Ads",          color:"from-amber-400 to-orange-600",   icon:"📊", stats:[{l:"Leads",v:"2x"},{l:"CPL",v:"Rs 850"},{l:"Appts",v:"50/mo"}],              result:"2x qualified leads",  period:"3 months" },
  { id:"youtube",     title:"EduTech — YouTube Automation",  client:"Nadia Farooq · Rawalpindi",   cat:"YouTube Automation",  color:"from-red-500 to-rose-600",       icon:"▶️", stats:[{l:"Subscribers",v:"25K"},{l:"Views",v:"800K/mo"},{l:"Revenue",v:"Rs 45K"}], result:"0→25K subscribers",   period:"4 months" },
  { id:"euroscale",   title:"EuroScale — AI Automation",     client:"Tobias Müller · Germany",     cat:"AI Automation",       color:"from-violet-500 to-purple-700",  icon:"🤖", stats:[{l:"Hours Saved",v:"40+/wk"},{l:"Response",v:"<2min"},{l:"CVR",v:"+65%"}],    result:"80% faster response", period:"2 months" },
];

export default function PortfolioPreview() {
  const { t } = useLanguage();
  return (
    <section className="section-pad" id="portfolio">
      <div className="container">
        <motion.div initial={{ opacity:0, y:20 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }} className="text-center mb-12">
          <div className="label mb-4">🏆 Case Studies</div>
          <h2 className="font-display font-black text-white mb-4">{t("portfolio_title")}</h2>
          <p className="text-slate-400 max-w-2xl mx-auto">{t("portfolio_sub")}</p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
          {CASES.map((item, i) => (
            <motion.div key={item.id}
              initial={{ opacity:0, y:28 }} whileInView={{ opacity:1, y:0 }}
              viewport={{ once:true }} transition={{ delay:i*0.07 }}
              className="card-plain rounded-2xl overflow-hidden group hover:-translate-y-2 transition-all duration-300"
            >
              <div className={`h-28 bg-gradient-to-br ${item.color} p-5 flex flex-col justify-between`}>
                <div className="flex items-start justify-between">
                  <div className="w-11 h-11 rounded-xl bg-white/20 flex items-center justify-center text-2xl">{item.icon}</div>
                  <span className="px-2 py-1 rounded-full bg-black/20 text-white text-[10px] font-bold">⏱ {item.period}</span>
                </div>
                <p className="text-white/70 text-xs font-medium">{item.cat}</p>
              </div>
              <div className="p-5">
                <h3 className="font-bold text-white mb-1 text-sm group-hover:text-red-300 transition-colors">{item.title}</h3>
                <p className="text-xs text-slate-500 mb-4">👤 {item.client}</p>
                <div className="grid grid-cols-3 gap-2 mb-4">
                  {item.stats.map((s, j) => (
                    <div key={j} className="bg-white/5 rounded-xl p-2 text-center border border-white/8">
                      <p className="text-sm font-black text-white">{s.v}</p>
                      <p className="text-[10px] text-slate-500">{s.l}</p>
                    </div>
                  ))}
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-green-300 bg-green-500/8 px-3 py-1.5 rounded-lg">✓ {item.result}</span>
                  <ArrowRight size={14} className="text-red-400 group-hover:translate-x-1 transition-transform"/>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="text-center">
          <Link href="/portfolio" className="btn-primary inline-flex">View All Case Studies <ArrowRight size={16}/></Link>
        </div>
      </div>
    </section>
  );
}
