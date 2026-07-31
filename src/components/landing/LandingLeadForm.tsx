"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Send, Loader2 } from "lucide-react";
import { SITE } from "@/data/siteConfig";

/**
 * Compact lead-capture form for Gulf Ads landing pages.
 * Includes a honeypot field ("company_website") to block spam bots:
 * real users never fill a hidden field, so if it's filled we drop the submit.
 */
export default function LandingLeadForm({ source, city, priceNote }: { source: string; city: string; priceNote: string }) {
  const router = useRouter();
  const [status, setStatus] = useState<"idle" | "sending" | "err">("idle");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);

    // Honeypot: bots fill everything; humans can't see this field.
    if ((fd.get("company_website") as string)?.length) return;

    fd.append("_landing", source);
    fd.append("_city", city);
    setStatus("sending");
    try {
      const r = await fetch(`https://formspree.io/f/${SITE.formspree}`, {
        method: "POST", body: fd, headers: { Accept: "application/json" },
      });
      if (r.ok) { router.push("/thank-you"); return; }
      setStatus("err");
    } catch {
      setStatus("err");
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-3">
      {/* honeypot (hidden from humans) */}
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
