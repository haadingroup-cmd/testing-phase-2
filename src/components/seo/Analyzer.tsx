"use client";
import { useRef, useState, type FormEvent } from "react";
import dynamic from "next/dynamic";
import {
  ArrowRight,
  ArrowUpRight,
  BarChart3,
  Check,
  ChevronDown,
  FileText,
  Globe,
  Layers,
  Search,
  ShieldCheck,
  Sparkles,
  Target,
  X,
} from "lucide-react";
import { brand } from "@/lib/seo/config";
import type { AuditEvent, AuditInput, SignedReport } from "@/lib/seo/types";
const Dashboard = dynamic(() => import("./Dashboard"), {
  loading: () => <p className="hg-note">Opening your report…</p>,
});
export interface Features {
  ai: boolean;
  pagespeed: boolean;
}
export default function Analyzer({ features }: { features: Features }) {
  const [url, setUrl] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [progress, setProgress] = useState<string[]>([]);
  const [signed, setSigned] = useState<SignedReport | null>(null);
  const [expanded, setExpanded] = useState(false);
  const [completed, setCompleted] = useState(0);
  const controller = useRef<AbortController | null>(null);
  const reportRef = useRef<HTMLDivElement>(null);
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const social: AuditInput["social"] = {};
    for (const key of [
      "facebook",
      "instagram",
      "youtube",
      "tiktok",
      "linkedin",
    ] as const) {
      const value = String(form.get(key) || "").trim();
      if (value) social[key] = value;
    }
    const input: AuditInput = {
      url,
      competitors: String(form.get("competitors") || "")
        .split(/\n|,/)
        .map((s) => s.trim())
        .filter(Boolean),
      social,
    };
    for (const key of [
      "businessName",
      "businessType",
      "country",
      "city",
      "language",
      "keyword",
    ] as const)
      input[key] = String(form.get(key) || "").trim();
    if (input.competitors.length > 3) {
      setError("Add up to three competitor URLs, one per line.");
      return;
    }
    setBusy(true);
    setError("");
    setSigned(null);
    setProgress([]);
    setCompleted(0);
    controller.current = new AbortController();
    let received = false;
    try {
      const response = await fetch("/api/seo/audit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
        signal: controller.current.signal,
      });
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "The audit could not start.");
      }
      const reader = response.body?.getReader();
      if (!reader) throw new Error("The audit stream could not be opened.");
      const decoder = new TextDecoder();
      let buffer = "";
      const handle = (line: string) => {
        if (!line.trim()) return;
        const event = JSON.parse(line) as AuditEvent;
        if (event.type === "progress") {
          setProgress((p) => [...p, event.message]);
          if (event.completed !== undefined) setCompleted(event.completed);
        }
        if (event.type === "complete") {
          received = true;
          setSigned(event.data);
        }
        if (event.type === "error") throw new Error(event.message);
      };
      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() || "";
        for (const line of lines) handle(line);
      }
      buffer += decoder.decode();
      if (buffer.trim()) handle(buffer);
      if (!received)
        throw new Error(
          "The audit connection ended before the report was ready. Please try again.",
        );
      window.setTimeout(
        () =>
          reportRef.current?.scrollIntoView({
            behavior: "smooth",
            block: "start",
          }),
        100,
      );
    } catch (err) {
      setError(
        err instanceof Error && err.name === "AbortError"
          ? "Audit cancelled. You can start again when ready."
          : err instanceof Error
            ? err.message
            : "The audit could not be completed.",
      );
    } finally {
      setBusy(false);
      controller.current = null;
    }
  }
  return (
    <>
      <section className="hg-hero hg-wrap" aria-labelledby="analyzer-heading">
        <div className="hg-hero-copy">
          <div className="hg-eyebrow">
            <span className="hg-dot" /> YOUR NEXT STEP STARTS WITH CLARITY
          </div>
          <h1 id="analyzer-heading">
            Free <span>SEO</span>
            <br />
            Analyzer<span className="hg-gold-dot">.</span>
          </h1>
          <p className="hg-hero-description">
            Review observable website signals and get evidence-based
            recommendations. AI content review is a separate option when
            connected.
          </p>
          <div className="hg-promise">
            <span>
              <Check size={15} /> Real website evidence
            </span>
            <span>
              <Check size={15} /> Clear next steps
            </span>
            <span>
              <Check size={15} /> Free PDF report
            </span>
          </div>
          <p className="hg-built">
            <span className="hg-mini-mark">H</span> Built by{" "}
            <strong>{brand.agency}</strong>
          </p>
        </div>
        <div className="hg-analyzer-card" id="analyze">
          <div className="hg-card-top">
            <div className="hg-icon-box">
              <Search size={22} />
            </div>
            <div>
              <h2>Let’s look under the hood.</h2>
              <p>A useful audit starts with your website.</p>
            </div>
            <span className="hg-free-label">FREE</span>
          </div>
          <form onSubmit={submit}>
            <label htmlFor="website-url">
              Website URL <span className="hg-required">*</span>
            </label>
            <div className="hg-url-input">
              <Globe size={19} />
              <input
                id="website-url"
                name="url"
                type="text"
                inputMode="url"
                autoComplete="url"
                placeholder="https://example.com"
                required
                minLength={3}
                maxLength={2048}
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                disabled={busy}
              />
            </div>
            <button
              type="button"
              className="hg-expand"
              aria-expanded={expanded}
              aria-controls="business-context"
              onClick={() => setExpanded(!expanded)}
            >
              Make it more relevant <span>Optional business details</span>
              <ChevronDown size={16} className={expanded ? "hg-rotated" : ""} />
            </button>
            <div
              id="business-context"
              hidden={!expanded}
              className="hg-context"
            >
              <div className="hg-form-grid">
                {[
                  ["businessName", "Business name", "Your trading name"],
                  ["businessType", "Business type", "e.g. Taxi service"],
                  ["country", "Target country", "e.g. Saudi Arabia"],
                  ["city", "Target city", "e.g. Makkah"],
                  ["language", "Target language", "e.g. English"],
                  [
                    "keyword",
                    "Main topic or service",
                    "e.g. Jeddah airport transfer",
                  ],
                ].map(([name, label, placeholder]) => (
                  <label key={name}>
                    {label}
                    <input
                      name={name}
                      maxLength={160}
                      placeholder={placeholder}
                      disabled={busy}
                    />
                  </label>
                ))}
              </div>
              <label>
                Competitor websites <span className="hg-optional">Up to 3</span>
                <textarea
                  name="competitors"
                  rows={3}
                  placeholder={
                    "https://competitor-one.com\nhttps://competitor-two.com"
                  }
                  disabled={busy}
                  maxLength={6000}
                />
              </label>
              <details>
                <summary>Official social profiles</summary>
                <p className="hg-note">
                  We check supplied URLs and references on your website.
                  Restricted profile contents and audience metrics are not
                  fetched.
                </p>
                <div className="hg-form-grid">
                  {[
                    "facebook",
                    "instagram",
                    "youtube",
                    "tiktok",
                    "linkedin",
                  ].map((name) => (
                    <label key={name} className="hg-capitalize">
                      {name}
                      <input
                        name={name}
                        type="url"
                        placeholder={`https://${name}.com/…`}
                        maxLength={160}
                        disabled={busy}
                      />
                    </label>
                  ))}
                </div>
              </details>
            </div>
            <button
              className="hg-button hg-button-primary hg-analyze-button"
              type="submit"
              disabled={busy}
            >
              {busy ? "Analyzing your website…" : "Analyze My Website"}
              <ArrowRight size={19} />
            </button>
            <div className="hg-form-foot">
              <ShieldCheck size={14} /> Free analysis <span>•</span> No credit
              card required
            </div>
            <p className="hg-data-note">
              Quick sample: up to 11 public pages. For site-wide crawling, use
              the agency SEO Projects dashboard. Reports stay in this browser
              session; download yours before leaving.
            </p>
          </form>
          {error && (
            <div className="hg-error" role="alert">
              <strong>We couldn’t complete that request.</strong>
              <p>{error}</p>
            </div>
          )}
        </div>
      </section>
      {busy && (
        <section className="hg-wrap hg-progress" aria-label="Audit progress">
          <div className="hg-progress-title">
            <div>
              <span className="hg-eyebrow">LIVE AUDIT</span>
              <h2>Following the evidence.</h2>
            </div>
            <button
              className="hg-button hg-button-quiet"
              onClick={() => controller.current?.abort()}
            >
              <X size={15} /> Cancel
            </button>
          </div>
          <div aria-live="polite">
            <p>{progress.at(-1) || "Submitting your website for analysis…"}</p>
            <span className="hg-note">{completed} pages analyzed</span>
          </div>
          <div className="hg-progress-log">
            {progress.slice(-4, -1).map((item, i) => (
              <span key={i}>
                <Check size={13} />
                {item}
              </span>
            ))}
          </div>
        </section>
      )}
      <div ref={reportRef} className="hg-report-anchor">
        {signed && (
          <Dashboard
            signed={signed}
            onReportChange={setSigned}
            features={features}
          />
        )}
      </div>
      {!signed && !busy && (
        <div className="hg-signal-strip hg-wrap">
          <span>
            <Layers size={18} />
            Technical & on-page
          </span>
          <span>
            <Target size={18} />
            Content & local signals
          </span>
          <span>
            <BarChart3 size={18} />
            Transparent scoring
          </span>
          <span>
            <FileText size={18} />
            Actionable PDF report
          </span>
        </div>
      )}
    </>
  );
}
export function AnalyzerHeader() {
  return (
    <header className="hg-nav">
      <div className="hg-wrap hg-nav-inner">
        <a
          href={brand.website}
          className="hg-brand"
          aria-label="HaadinGlobal home"
        >
          <span className="hg-brand-symbol">
            H<span>G</span>
          </span>
          <span>
            Haadin<span className="hg-brand-gold">Global</span>
            <small>MARKETING AGENCY</small>
          </span>
        </a>
        <nav aria-label="Analyzer navigation">
          <a href="#how-it-works">How it works</a>
          <a href="#methodology">Our methodology</a>
          <a href={brand.seo} className="hg-nav-help">
            Get SEO help <ArrowUpRight size={15} />
          </a>
        </nav>
      </div>
    </header>
  );
}
