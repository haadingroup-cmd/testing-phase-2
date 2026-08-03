"use client";

import { useEffect, useState } from "react";
import { X, MessageCircle, Send, Sparkles } from "lucide-react";
import { SITE } from "@/data/siteConfig";

/**
 * Entry popup — appears once per browser session, a few seconds after load
 * (top-agency pattern). Offers the two fastest paths to contact: WhatsApp
 * (the primary goal) and a 3-field quick form that also routes to WhatsApp
 * with a pre-filled message. Closing it sets a sessionStorage flag so it
 * never nags the same visitor again in that session.
 */
const SERVICES = ["Meta Ads", "Google Ads", "SEO", "Website / Shopify", "Social Media", "Branding", "Not sure — need advice"];

export default function EntryPopup() {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [service, setService] = useState("");

  useEffect(() => {
    // Only once per session
    if (typeof window === "undefined") return;
    try {
      if (sessionStorage.getItem("hg_popup_seen")) return;
    } catch { /* sessionStorage blocked — just show once in memory */ }

    const timer = setTimeout(() => setOpen(true), 3500); // 3.5s delay
    return () => clearTimeout(timer);
  }, []);

  function close() {
    setOpen(false);
    try { sessionStorage.setItem("hg_popup_seen", "1"); } catch { /* ignore */ }
  }

  function toWhatsApp() {
    const msg = `Hi HaadinGlobal! I'm ${name || "interested"} and I'd like help with ${service || "growing my business"}.`;
    window.open(`${SITE.social.whatsapp}?text=${encodeURIComponent(msg)}`, "_blank", "noopener,noreferrer");
    close();
  }

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-[fadeIn_0.2s_ease]"
      onClick={close}
      role="dialog"
      aria-modal="true"
      aria-label="Get a free strategy session"
    >
      <div
        className="relative w-full max-w-md rounded-3xl border border-white/10 bg-gradient-to-br from-[#0d0d14] to-[#050508] p-6 md:p-8 shadow-2xl animate-[popIn_0.25s_cubic-bezier(0.16,1,0.3,1)]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* glow */}
        <div className="absolute -top-20 -right-16 w-56 h-56 rounded-full bg-red-600/20 blur-3xl pointer-events-none" />

        <button
          onClick={close}
          aria-label="Close"
          className="absolute top-4 right-4 w-9 h-9 rounded-full flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
        >
          <X size={18} />
        </button>

        <div className="relative">
          <div className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full bg-red-600/15 border border-red-500/25 text-red-300 mb-4">
            <Sparkles size={12} /> Free Strategy Session
          </div>

          <h2 className="font-display font-black text-white text-2xl md:text-3xl leading-tight mb-2">
            Get More Leads &amp; Sales
          </h2>
          <p className="text-slate-400 text-sm mb-6">
            Tell us what you need — we&apos;ll reply on WhatsApp within 24 hours with a plan. No cost, no obligation.
          </p>

          <div className="space-y-3">
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm placeholder:text-slate-500 focus:border-red-500/50 focus:outline-none transition-colors"
            />
            <select
              value={service}
              onChange={(e) => setService(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:border-red-500/50 focus:outline-none transition-colors"
            >
              <option value="" className="bg-[#0d0d14]">What do you need help with?</option>
              {SERVICES.map((s) => (
                <option key={s} value={s} className="bg-[#0d0d14]">{s}</option>
              ))}
            </select>

            <button
              onClick={toWhatsApp}
              className="w-full flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl bg-green-600 hover:bg-green-500 text-white font-bold text-sm transition-colors shadow-lg shadow-green-900/30"
            >
              <MessageCircle size={17} /> Chat on WhatsApp
            </button>

            <a
              href="/consultation"
              onClick={close}
              className="w-full flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white font-semibold text-sm transition-colors"
            >
              <Send size={15} /> Book a Free Consultation
            </a>
          </div>

          <button onClick={close} className="w-full text-center text-slate-500 text-xs mt-4 hover:text-slate-300 transition-colors">
            No thanks, I&apos;m just browsing
          </button>
        </div>
      </div>
    </div>
  );
}
