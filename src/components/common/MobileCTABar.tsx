"use client";

import { MessageCircle, Send } from "lucide-react";
import { SITE } from "@/data/siteConfig";

/**
 * Sticky mobile action bar (mobile only).
 * Top-agency conversion pattern: the path to contact is never more than one
 * tap away as the visitor scrolls any page. Hidden on desktop (md+) where the
 * floating WhatsApp button + in-page CTAs already cover this.
 */
export default function MobileCTABar() {
  return (
    <div className="md:hidden fixed bottom-0 inset-x-0 z-40 flex gap-2 p-3 bg-[#050508]/95 backdrop-blur border-t border-white/10">
      <a
        href="/consultation"
        className="flex-1 flex items-center justify-center gap-1.5 py-3 rounded-xl bg-red-600 text-white font-bold text-sm active:scale-95 transition-transform"
      >
        <Send size={15} /> Free Quote
      </a>
      <a
        href={SITE.social.whatsapp}
        target="_blank"
        rel="noopener noreferrer"
        className="flex-1 flex items-center justify-center gap-1.5 py-3 rounded-xl bg-[#25D366] text-white font-bold text-sm active:scale-95 transition-transform"
      >
        <MessageCircle size={15} /> WhatsApp
      </a>
    </div>
  );
}
