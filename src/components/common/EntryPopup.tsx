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
        className="relative w-full max-w-md rounded-3xl border border-red-400/30 bg-gradient-to-br from-[#e11d48] via-[#b91c1c] to-[#7f1d1d] p-6 md:p-8 shadow-[0_20px_70px_-10px_rgba(225,29,72,0.6)] animate-[popIn_0.25s_cubic-bezier(0.16,1,0.3,1)]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* glow */}
        <div className="absolute -top-20 -right-16 w-56 h-56 rounded-full bg-white/20 blur-3xl pointer-events-none" />

        <button
          onClick={close}
          aria-label="Close"
          className="absolute top-4 right-4 w-9 h-9 rounded-full flex items-center justify-center text-white/70 hover:text-white hover:bg-white/20 transition-colors"
        >
          <X size={18} />
        </button>

        <div className="relative">
          <div className="inline-flex items-center gap-1.5 text-[11px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full bg-white/20 border border-white/30 text-white mb-4">
            <Sparkles size={12} /> Free Strategy Session
          </div>

          <h2 className="font-display font-black text-white text-2xl md:text-3xl leading-tight mb-2">
            Get More Leads &amp; Sales
          </h2>
          <p className="text-white/90 text-sm mb-6 font-medium">
            Tell us what you need — we&apos;ll reply on WhatsApp within 24 hours with a plan. No cost, no obligation.
          </p>

          <div className="space-y-3">
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
              className="w-full px-4 py-3 rounded-xl bg-white/15 border border-white/30 text-white text-sm placeholder:text-white/60 focus:border-white focus:bg-white/20 focus:outline-none transition-colors"
            />
            <select
              value={service}
              onChange={(e) => setService(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-white/15 border border-white/30 text-white text-sm focus:border-white focus:bg-white/20 focus:outline-none transition-colors"
            >
              <option value="" className="bg-[#7f1d1d] text-white">What do you need help with?</option>
              {SERVICES.map((s) => (
                <option key={s} value={s} className="bg-[#7f1d1d] text-white">{s}</option>
              ))}
            </select>

            <button
              onClick={toWhatsApp}
              className="w-full flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-white font-black text-sm transition-colors shadow-lg shadow-black/30"
            >
              <MessageCircle size={17} /> Chat on WhatsApp
            </button>

            <a
              href="/consultation"
              onClick={close}
              className="w-full flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-white hover:bg-white/90 text-red-700 font-bold text-sm transition-colors shadow-lg"
            >
              <Send size={15} /> Book a Free Consultation
            </a>
          </div>

          <button onClick={close} className="w-full text-center text-white/70 text-xs mt-4 hover:text-white transition-colors">
            No thanks, I&apos;m just browsing
          </button>
        </div>
      </div>
    </div>
  );
}
