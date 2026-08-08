"use client";

import { useEffect, useState } from "react";
import { X, MessageCircle, Send, Sparkles } from "lucide-react";
import { SITE } from "@/data/siteConfig";
import { supabaseBrowser, SUPABASE_READY } from "@/lib/supabase";

/**
 * Entry popup — appears once per browser session, a few seconds after load
 * (top-agency pattern). Offers the two fastest paths to contact: WhatsApp
 * (the primary goal) and a quick route to the consultation page. Closing it
 * sets a sessionStorage flag so it never nags the same visitor again.
 */
const SERVICES = ["Meta Ads", "Google Ads", "SEO", "Website / Shopify", "Social Media", "Branding", "Not sure — need advice"];

export default function EntryPopup() {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [service, setService] = useState("");

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      if (sessionStorage.getItem("hg_popup_seen")) return;
    } catch { /* sessionStorage blocked — just show once in memory */ }

    const timer = setTimeout(() => setOpen(true), 3500);
    return () => clearTimeout(timer);
  }, []);

  function close() {
    setOpen(false);
    try { sessionStorage.setItem("hg_popup_seen", "1"); } catch { /* ignore */ }
  }

  function toWhatsApp() {
    const msg = `Hi HaadinGlobal! I'm ${name || "interested"} and I'd like help with ${service || "growing my business"}.`;
    // Capture the lead in the CRM too (fire-and-forget so the WhatsApp window opens instantly).
    if (SUPABASE_READY) {
      supabaseBrowser().from("leads").insert({
        name: name || "", service: service || "", source: "popup", status: "new",
        message: "Started via entry popup to WhatsApp",
      }).then(() => {}, () => {});
    }
    window.open(`${SITE.social.whatsapp}?text=${encodeURIComponent(msg)}`, "_blank", "noopener,noreferrer");
    close();
  }

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-[fadeIn_0.2s_ease]"
      onClick={close}
      role="dialog"
      aria-modal="true"
      aria-label="Get a free strategy session"
    >
      <div
        className="relative w-full max-w-md rounded-3xl border border-slate-200 bg-white p-6 md:p-8 shadow-[0_24px_70px_-15px_rgba(15,23,42,0.28)] animate-[popIn_0.25s_cubic-bezier(0.16,1,0.3,1)]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="absolute -top-16 -right-12 w-52 h-52 rounded-full bg-red-100/70 blur-3xl pointer-events-none" />

        <button
          onClick={close}
          aria-label="Close"
          className="absolute top-4 right-4 w-9 h-9 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
        >
          <X size={18} />
        </button>

        <div className="relative">
          <div className="inline-flex items-center gap-1.5 text-[11px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full bg-red-50 border border-red-100 text-red-600 mb-4">
            <Sparkles size={12} /> Free Strategy Session
          </div>

          <h2 className="font-display font-black text-slate-900 text-2xl md:text-3xl leading-tight mb-2">
            Get More Leads &amp; Sales
          </h2>
          <p className="text-slate-500 text-sm mb-6">
            Tell us what you need — we&apos;ll reply on WhatsApp within 24 hours with a plan. No cost, no obligation.
          </p>

          <div className="space-y-3">
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
              className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 text-sm placeholder:text-slate-400 focus:border-red-400 focus:ring-2 focus:ring-red-100 focus:outline-none transition-colors"
            />
            <select
              value={service}
              onChange={(e) => setService(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 text-sm focus:border-red-400 focus:ring-2 focus:ring-red-100 focus:outline-none transition-colors"
            >
              <option value="">What do you need help with?</option>
              {SERVICES.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>

            <button
              onClick={toWhatsApp}
              className="w-full flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-white font-black text-sm transition-colors shadow-md shadow-green-600/20"
            >
              <MessageCircle size={17} /> Chat on WhatsApp
            </button>

            <button
              onClick={() => { close(); window.location.assign("/consultation"); }}
              className="w-full flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-white border-2 border-red-200 hover:border-red-300 hover:bg-red-50 text-red-600 font-bold text-sm transition-colors"
            >
              <Send size={15} /> Book a Free Consultation
            </button>
          </div>

          <button onClick={close} className="w-full text-center text-slate-400 text-xs mt-4 hover:text-slate-600 transition-colors">
            No thanks, I&apos;m just browsing
          </button>
        </div>
      </div>
    </div>
  );
}
