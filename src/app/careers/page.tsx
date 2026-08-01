import type { Metadata } from "next";
import Link from "next/link";
import { CTASection } from "@/components/home/SiteSections";

export const metadata: Metadata = {
  title: "Careers — Join HaadinGlobal Team",
  description: "Join results-driven digital marketing agency. Exciting roles in Meta Ads, SEO, web development, AI automation and more.",
};

const OPENINGS = [
  { title:"Meta Ads Specialist", type:"Full-time", location:"Sahiwal / Remote", dept:"Paid Media" },
  { title:"SEO Content Writer", type:"Full-time", location:"Sahiwal / Remote", dept:"Content" },
  { title:"Next.js Developer", type:"Full-time", location:"Sahiwal / Remote", dept:"Technology" },
  { title:"Graphic Designer", type:"Full-time", location:"Sahiwal", dept:"Design" },
  { title:"Social Media Manager", type:"Full-time", location:"Sahiwal / Remote", dept:"Marketing" },
  { title:"AI Automation Engineer", type:"Full-time", location:"Remote", dept:"Technology" },
];

export default function CareersPage() {
  return (
    <>
      <section className="pt-36 pb-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#020205] via-[#0a0215] to-[#020205]"/>
        <div className="container relative z-10 text-center">
          <div className="label mb-5">Join Our Team</div>
          <h1 className="font-display font-black text-white mb-5">Build the Future of <span className="gradient-text">Digital Marketing</span></h1>
          <p className="text-slate-400 max-w-xl mx-auto">Join results-driven digital marketing agency. Work on international clients, learn cutting-edge skills, and grow fast.</p>
        </div>
      </section>

      <section className="py-16 bg-[#030306]">
        <div className="container">
          <div className="grid md:grid-cols-3 gap-6 mb-14">
            {[{icon:"🚀",t:"Fast Growth",d:"Work on real campaigns from Day 1. Grow skills and career faster than anywhere else."},{icon:"🌍",t:"Global Clients",d:"Serve businesses in UAE, UK, USA & more. Build an international portfolio."},{icon:"💰",t:"Competitive Pay",d:"Market-rate salaries plus performance bonuses and learning allowances."}].map(b => (
              <div key={b.t} className="card p-6 text-center">
                <div className="text-4xl mb-4">{b.icon}</div>
                <h3 className="text-white font-bold mb-2">{b.t}</h3>
                <p className="text-slate-400 text-sm">{b.d}</p>
              </div>
            ))}
          </div>

          <h2 className="font-display font-black text-white text-3xl mb-8">Open <span className="gradient-text">Positions</span></h2>
          <div className="space-y-4">
            {OPENINGS.map(job => (
              <div key={job.title} className="card-plain rounded-2xl p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <span className="text-xs font-bold text-red-400 bg-red-500/10 px-2 py-1 rounded-md mb-2 inline-block">{job.dept}</span>
                  <h3 className="text-white font-bold text-lg">{job.title}</h3>
                  <div className="flex items-center gap-3 mt-1 text-xs text-slate-400">
                    <span>⏱ {job.type}</span>
                    <span>📍 {job.location}</span>
                  </div>
                </div>
                <Link href={`mailto:haadinglobal@gmail.com?subject=Application: ${job.title}`} className="btn-primary text-sm py-2.5 px-5 flex-shrink-0">
                  Apply Now →
                </Link>
              </div>
            ))}
          </div>

          <div className="mt-10 card p-8 text-center">
            <h3 className="text-white font-black text-xl mb-2">Don't see a role that fits?</h3>
            <p className="text-slate-400 mb-5">We're always looking for talented people. Send your CV and we'll reach out when a role opens up.</p>
            <Link href="mailto:haadinglobal@gmail.com?subject=General Application — HaadinGlobal" className="btn-primary inline-flex">
              Send Open Application →
            </Link>
          </div>
        </div>
      </section>
      <CTASection />
    </>
  );
}
