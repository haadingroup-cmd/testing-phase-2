"use client";
import { useState } from "react";
import { Download, Loader2, CheckCircle, FileText } from "lucide-react";
import { SITE } from "@/data/siteConfig";
import { supabaseBrowser, SUPABASE_READY } from "@/lib/supabase";

/**
 * Top-of-funnel lead magnet: a free "2026 Digital Marketing Audit Checklist"
 * PDF in exchange for name + email. Captures visitors who aren't ready to book
 * a call yet. Leads save into the CRM (Supabase `leads`) and fire a Formspree
 * alert — same pipeline as every other form. On success the PDF is revealed
 * and auto-downloaded, so the visitor gets instant value.
 */
const PDF_PATH = "/downloads/haadinglobal-2026-digital-marketing-audit-checklist.pdf";

const INSIDE = [
  "40-point self-audit across website, SEO, ads & funnel",
  "Google Business & local ranking checklist",
  "AI-search (ChatGPT / Perplexity) visibility checks",
  "Conversion & lead-capture fixes you can do this week",
];

export default function LeadMagnet() {
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "err">("idle");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    if ((fd.get("company_website") as string)?.length) return; // honeypot

    const name = String(fd.get("name") || "").trim();
    const email = String(fd.get("email") || "").trim();

    setStatus("sending");
    let saved = false;

    if (SUPABASE_READY) {
      try {
        const { error } = await supabaseBrowser().from("leads").insert({
          name, email, phone: "", service: "Audit Checklist",
          message: "Downloaded the free 2026 Digital Marketing Audit Checklist",
          source: "lead-magnet", status: "new",
        });
        if (!error) saved = true;
      } catch { /* fall through to email */ }
    }

    try {
      fd.append("_subject", "New lead magnet download — Audit Checklist");
      const r = await fetch(`https://formspree.io/f/${SITE.formspree}`, {
        method: "POST", body: fd, headers: { Accept: "application/json" },
      });
      if (r.ok) saved = true;
    } catch { /* ignore */ }

    if (saved) {
      setStatus("done");
      // Give the visitor the file straight away.
      const a = document.createElement("a");
      a.href = PDF_PATH;
      a.download = "";
      document.body.appendChild(a);
      a.click();
      a.remove();
      return;
    }
    setStatus("err");
  }

  return (
    <section className="py-20 bg-[#020205]" id="free-checklist">
      <div className="container">
        <div className="card overflow-hidden grid lg:grid-cols-2">
          {/* LEFT: pitch */}
          <div className="p-8 md:p-10 bg-gradient-to-br from-[#1a0505] to-[#020205]">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-red-500/12 border border-red-500/25 text-red-300 text-xs font-bold mb-5">
              <FileText size={13} /> FREE DOWNLOAD
            </div>
            <h2 className="font-display font-black text-white text-2xl md:text-3xl mb-4 leading-tight">
              The 2026 Digital Marketing <span className="gradient-text">Audit Checklist</span>
            </h2>
            <p className="text-slate-400 leading-relaxed mb-6 text-sm">
              A practical, 40-point checklist to audit your own website, SEO, Google presence, ads and lead funnel — and spot the quick wins that grow your business. No fluff, built by our team.
            </p>
            <ul className="space-y-2.5">
              {INSIDE.map((t) => (
                <li key={t} className="flex items-start gap-2.5 text-slate-300 text-sm">
                  <CheckCircle size={16} className="text-green-400 flex-shrink-0 mt-0.5" />
                  {t}
                </li>
              ))}
            </ul>
          </div>

          {/* RIGHT: form */}
          <div className="p-8 md:p-10 flex flex-col justify-center">
            {status === "done" ? (
              <div className="text-center">
                <div className="w-14 h-14 rounded-2xl bg-green-500/12 border border-green-500/25 flex items-center justify-center mx-auto mb-4">
                  <CheckCircle size={26} className="text-green-400" />
                </div>
                <h3 className="text-white font-bold text-lg mb-2">Your checklist is downloading!</h3>
                <p className="text-slate-400 text-sm mb-5">
                  If it didn&apos;t start automatically, click below.
                </p>
                <a href={PDF_PATH} download className="btn-primary inline-flex justify-center">
                  <Download size={16} /> Download the checklist
                </a>
              </div>
            ) : (
              <form onSubmit={onSubmit} className="space-y-3">
                <h3 className="text-white font-bold text-lg mb-1">Get it free — instant download</h3>
                <p className="text-slate-500 text-sm mb-3">Enter your details and the PDF is yours right away.</p>

                <input type="text" name="company_website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />
                <input name="name" required placeholder="Your name" autoComplete="name" />
                <input name="email" type="email" required placeholder="Email address" autoComplete="email" />

                {status === "err" && (
                  <p className="text-red-400 text-sm bg-red-500/10 px-3 py-2 rounded-lg">
                    Something went wrong. Please WhatsApp us and we&apos;ll send it over.
                  </p>
                )}

                <button type="submit" disabled={status === "sending"} className="btn-primary w-full justify-center py-3.5 disabled:opacity-50">
                  {status === "sending" ? <><Loader2 size={16} className="animate-spin" /> Preparing…</> : <><Download size={16} /> Send Me the Free Checklist</>}
                </button>
                <p className="text-slate-500 text-[11px] text-center">No spam. Unsubscribe anytime.</p>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
