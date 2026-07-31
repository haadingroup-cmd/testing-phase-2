"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Send, Loader2 } from "lucide-react";
import { SITE } from "@/data/siteConfig";
import { useLanguage } from "@/components/providers/LanguageProvider";
import { useBudgetOptions } from "@/utils/useBudgetOptions";

const SERVICES_LIST = [
  "Meta Ads","Google Ads","TikTok Ads","SEO Services","Social Media Management",
  "YouTube Automation","Web Development","Shopify Store","Branding & Design",
  "AI Automation","Content Writing","Graphic Design","Other / Multiple",
];

export default function ContactForm() {
  const { t } = useLanguage();
  const router = useRouter();
  const budgetOptions = useBudgetOptions();
  const [status, setStatus] = useState<"idle"|"sending"|"err">("idle");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sending");
    const fd = new FormData(e.currentTarget);
    const name = (fd.get("name") as string) || "";
    try {
      const r = await fetch(`https://formspree.io/f/${SITE.formspree}`, {
        method: "POST", body: fd, headers: { Accept: "application/json" },
      });
      if (r.ok) {
        router.push(`/thank-you?name=${encodeURIComponent(name)}`);
      } else {
        setStatus("err");
      }
    } catch { setStatus("err"); }
  }

  return (
    <div className="card p-6 md:p-8">
      <h3 className="text-xl font-black text-white mb-6">Get Free Consultation</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input type="hidden" name="_subject" value="New Lead — HaadinGlobal Website"/>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label>{t("form_name")} *</label>
            <input type="text" name="name" required placeholder="Your full name"/>
          </div>
          <div>
            <label>{t("form_phone")} *</label>
            <input type="tel" name="phone" required placeholder="Your phone number"/>
          </div>
        </div>
        <div>
          <label>{t("form_email")}</label>
          <input type="email" name="email" placeholder="you@example.com"/>
        </div>
        <div>
          <label>{t("form_service")} *</label>
          <select name="service" required aria-label="Select a service">
            <option value="">Select a service...</option>
            {SERVICES_LIST.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
        <div>
          <label>Your Website or Social Media <span className="text-slate-500 text-xs font-normal">(optional)</span></label>
          <input type="text" name="website_social" placeholder="https://yoursite.com or @yourhandle"/>
        </div>
        <div>
          <label>{t("form_budget")}</label>
          <select name="budget" aria-label="Select your budget">
            <option value="">Select budget...</option>
            {budgetOptions.map(b => <option key={b}>{b}</option>)}
            <option>Project-based (one-time)</option>
          </select>
        </div>
        <div>
          <label>{t("form_message")} *</label>
          <textarea name="message" required rows={4} placeholder="Tell us about your business and goals..."/>
        </div>
        {status === "err" && (
          <motion.p initial={{ opacity:0, y:-5 }} animate={{ opacity:1, y:0 }}
            className="text-red-400 text-sm bg-red-500/10 px-4 py-2 rounded-lg">
            ❌ Failed to send. Please WhatsApp: <a href={SITE.social.whatsapp} className="underline">+92 305 4782677</a>
          </motion.p>
        )}
        <button type="submit" disabled={status === "sending"} className="btn-primary w-full justify-center py-4 disabled:opacity-50">
          {status === "sending"
            ? <><Loader2 size={17} className="animate-spin"/> Sending...</>
            : <><Send size={17}/> {t("form_submit")}</>
          }
        </button>
        <p className="text-center text-slate-500 text-xs">
          💬 Or WhatsApp:{" "}
          <a href={SITE.social.whatsapp} target="_blank" rel="noopener noreferrer" className="text-red-400 font-semibold hover:underline">
            +92 305 4782677
          </a>
        </p>
      </form>
    </div>
  );
}
