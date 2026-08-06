"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Send, Loader2 } from "lucide-react";
import { SITE } from "@/data/siteConfig";
import { supabaseBrowser, SUPABASE_READY } from "@/lib/supabase";

/**
 * Compact lead-capture form. Saves straight into the CRM (Manage Leads) and
 * also emails an alert via Formspree. Has a honeypot ("company_website") to
 * block spam bots. `leadSource` sets how the lead is tagged in the CRM.
 */
export default function LandingLeadForm({ source, city, priceNote, leadSource = "ads" }: { source: string; city: string; priceNote: string; leadSource?: string }) {
  const router = useRouter();
  const [status, setStatus] = useState<"idle" | "sending" | "err">("idle");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);

    if ((fd.get("company_website") as string)?.length) return; // honeypot

    const name = String(fd.get("name") || "").trim();
    const email = String(fd.get("email") || "").trim();
    const phone = String(fd.get("phone") || "").trim();
    const service = String(fd.get("service") || "").trim();
    const userMsg = String(fd.get("message") || "").trim();
    const message = city ? `(${city} landing) ${userMsg}`.trim() : userMsg;

    setStatus("sending");
    let saved = false;

    if (SUPABASE_READY) {
      try {
        const { error } = await supabaseBrowser().from("leads").insert({
          name, email, phone, service, message, source: leadSource, status: "new",
        });
        if (!error) saved = true;
      } catch { /* fall through to email */ }
    }

    try {
      fd.append("_landing", source);
      fd.append("_city", city);
      const r = await fetch(`https://formspree.io/f/${SITE.formspree}`, {
        method: "POST", body: fd, headers: { Accept: "application/json" },
      });
      if (r.ok) saved = true;
    } catch { /* ignore */ }

    if (saved) { router.push("/thank-you"); return; }
    setStatus("err");
  }

  return (
    <form onSubmit={onSubmit} className="space-y-3">
      <input type="text" name="company_website" tabIndex={-1} autoComplete="off"
        className="hidden" aria-hidden="true" />

      <input name="name" required placeholder="Your name" autoComplete="name" />
      <input name="email" type="email" required placeholder="Email address" autoComplete="email" />
      <input name="phone" required placeholder="Phone / WhatsApp" autoComplete="tel" />
      <select name="service" defaultValue="" aria-label="What do you need help with">
        <option value="" disabled>What do you need help with?</option>
        <option>Meta Ads</option>
        <option>Google Ads</option>
        <option>SEO</option>
        <option>Website / Shopify</option>
        <option>Social Media</option>
        <option>Branding</option>
        <option>Not sure — need advice</option>
      </select>
      <textarea name="message" rows={2} placeholder="Tell us briefly about your business (optional)" />

      {status === "err" && (
        <p className="text-red-400 text-sm bg-red-500/10 px-3 py-2 rounded-lg">
          Something went wrong. Please WhatsApp us instead.
        </p>
      )}

      <button type="submit" disabled={status === "sending"} className="btn-primary w-full justify-center py-3.5 disabled:opacity-50">
        {status === "sending" ? <><Loader2 size={16} className="animate-spin" /> Sending…</> : <><Send size={16} /> Get My Free Plan</>}
      </button>
      <p className="text-slate-500 text-[11px] text-center">{priceNote}. We reply within 24 hours.</p>
    </form>
  );
}
