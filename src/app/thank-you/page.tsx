"use client";
import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { CheckCircle2, MessageCircle, Clock, Phone, Sparkles, ArrowRight, Home } from "lucide-react";

function ThankYouInner() {
  const params = useSearchParams();
  const rawName = params.get("name") || "";
  // Sanitize: trim, collapse whitespace, cap at 50 chars, grab first name + last initial if long.
  const cleanName = rawName.trim().replace(/\s+/g, " ").slice(0, 50);
  const firstName = cleanName.split(" ")[0] || "";

  return (
    <main className="min-h-screen flex items-center justify-center px-4 py-32 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-[#020205] via-[#0a0215] to-[#020205] pointer-events-none" />
      <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-green-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-red-600/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="relative z-10 max-w-2xl w-full">
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.6, ease: [0.2, 0.8, 0.4, 1] }}
          className="card p-8 md:p-12 text-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200, damping: 12 }}
            className="relative w-24 h-24 mx-auto mb-6"
          >
            <div className="absolute inset-0 rounded-full bg-green-500/15 animate-ping" />
            <div className="relative w-24 h-24 rounded-full bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center shadow-[0_0_40px_rgba(34,197,94,0.4)]">
              <CheckCircle2 size={52} className="text-white" strokeWidth={2.5} />
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-500/10 border border-green-500/30 text-green-300 text-xs font-bold mb-4">
              <Sparkles size={11} /> MESSAGE RECEIVED
            </div>

            {/* Big personalised heading: "Thank You, {firstName}!" — falls back gracefully if no name. */}
            <h1 className="font-display font-black text-white mb-4 text-4xl md:text-6xl leading-[1.05]">
              {firstName ? (
                <>Thank You,<br/><span className="gradient-text">{firstName}!</span></>
              ) : (
                <>Thank <span className="gradient-text">You!</span></>
              )}
            </h1>
            <p className="text-slate-300 text-lg leading-relaxed mb-2">
              Your message has been successfully sent to our team.
            </p>
            <p className="text-slate-400 text-base leading-relaxed mb-8">
              We&apos;ve received your details and our experts are already reviewing your request.
            </p>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.55 }}
            className="rounded-2xl border border-red-500/25 bg-gradient-to-br from-red-500/10 to-rose-900/5 p-5 md:p-6 mb-6"
          >
            <div className="flex items-center justify-center gap-2 mb-2">
              <Clock size={18} className="text-red-400" />
              <p className="text-red-300 font-bold text-sm uppercase tracking-widest">Quick Response</p>
            </div>
            <p className="text-white font-black text-2xl md:text-3xl mb-2">
              We&apos;ll contact you within <span className="gradient-text">2 – 5 hours</span>
            </p>
            <p className="text-slate-400 text-sm">
              Our team works fast — usually you&apos;ll hear back the same day, during business hours.
            </p>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }}
            className="rounded-xl border border-[var(--border-2)] bg-[var(--surface-soft)] p-4 mb-6"
          >
            <p className="text-slate-300 text-sm mb-3">
              <strong className="text-white">Need urgent help?</strong> WhatsApp us directly for an instant response:
            </p>
            <a
              href={`https://wa.me/923054782677?text=${encodeURIComponent("Hi HaadinGlobal, I just submitted a form on your website.")}`}
              target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-[#25D366] text-white font-bold text-sm hover:opacity-90 hover:-translate-y-0.5 transition-all shadow-lg"
            >
              <MessageCircle size={16} /> WhatsApp: +92 305 4782677
            </a>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.85 }}
            className="text-left mb-6"
          >
            <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold mb-3 text-center">What happens next</p>
            <div className="grid sm:grid-cols-3 gap-3">
              {[
                { n: 1, t: "We review", d: "Your message reaches our team instantly." },
                { n: 2, t: "We call/email", d: "Expert reaches out within 2–5 hours." },
                { n: 3, t: "Strategy session", d: "Custom growth plan tailored for you." },
              ].map((step) => (
                <div key={step.n} className="rounded-xl border border-[var(--border)] bg-[var(--surface-soft)] p-3">
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-red-500 to-red-700 text-white text-xs font-black flex items-center justify-center mb-2">{step.n}</div>
                  <p className="text-white font-bold text-sm">{step.t}</p>
                  <p className="text-slate-400 text-xs leading-relaxed mt-0.5">{step.d}</p>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-3"
          >
            <Link href="/" className="btn-ghost text-sm inline-flex"><Home size={15} /> Back to Home</Link>
            <Link href="/services" className="btn-primary text-sm inline-flex">Explore Services <ArrowRight size={15} /></Link>
          </motion.div>
        </motion.div>

        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 }}
          className="text-center text-slate-500 text-xs mt-5"
        >
          <Phone size={11} className="inline mr-1" />
          Prefer a direct call? Reach us at <span className="text-slate-400 font-semibold">+92 305 4782677</span>
        </motion.p>
      </div>
    </main>
  );
}

export default function ThankYouPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-slate-400">Loading…</div>}>
      <ThankYouInner />
    </Suspense>
  );
}
