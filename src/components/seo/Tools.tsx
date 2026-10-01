"use client";
import { useRef, useEffect, useState } from "react";
import { Copy, Check, Sparkles, X, Code2 } from "lucide-react";
import type { AIResult, SignedReport } from "@/lib/seo/types";
import type { Features } from "./Analyzer";
export function CopyButton({ value }: { value: string }) {
  const [copied, setCopied] = useState(false);
  const [failed, setFailed] = useState(false);
  return (
    <button
      className="hg-button hg-button-quiet hg-copy"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(value);
          setCopied(true);
          setFailed(false);
          window.setTimeout(() => setCopied(false), 2000);
        } catch {
          setFailed(true);
        }
      }}
    >
      {copied ? <Check size={14} /> : <Copy size={14} />}{" "}
      {failed ? "Select text to copy" : copied ? "Copied" : "Copy"}
    </button>
  );
}
export function Guidance({ guidance }: { guidance: AIResult }) {
  return (
    <div className="hg-guidance">
      <h3>{guidance.headline}</h3>
      <p>{guidance.explanation}</p>
      {guidance.items.map((item, i) => (
        <div className="hg-generated-item" key={i}>
          <div>
            <strong>{item.label}</strong>
            <CopyButton value={item.value} />
          </div>
          <p>{item.value}</p>
        </div>
      ))}
      <p className="hg-source">
        {guidance.source}. Check every suggestion before publishing.
      </p>
    </div>
  );
}
export function Modal({
  title,
  children,
  onClose,
}: {
  title: string;
  children: React.ReactNode;
  onClose: () => void;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    ref.current?.showModal();
    const current = ref.current;
    return () => current?.close();
  }, []);
  return (
    <dialog
      ref={ref}
      className="hg-modal"
      onCancel={onClose}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="hg-modal-head">
        <h2>{title}</h2>
        <button
          autoFocus
          className="hg-button hg-button-quiet"
          aria-label="Close dialog"
          onClick={onClose}
        >
          <X size={20} />
        </button>
      </div>
      {children}
    </dialog>
  );
}
export default function Tools({
  signed,
  features,
  onAI,
}: {
  signed: SignedReport;
  features: Features;
  onAI: (task: "meta" | "content", fields?: Record<string, string>) => void;
}) {
  const home = signed.report.pages[0];
  const [schema, setSchema] = useState("");
  const [error, setError] = useState("");
  return (
    <div className="hg-tools-grid">
      <section className="hg-panel">
        <div className="hg-section-heading">
          <Sparkles size={21} />
          <h3>AI Meta Generator</h3>
        </div>
        <p>
          Draft metadata grounded in your actual page and factual business
          details.
        </p>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            onAI(
              "meta",
              Object.fromEntries(new FormData(e.currentTarget)) as Record<
                string,
                string
              >,
            );
          }}
        >
          <div className="hg-form-grid">
            {[
              ["topic", "Page topic", home.h1[0] || home.title],
              ["keyword", "Target keyword", signed.report.input.keyword || ""],
              [
                "businessName",
                "Business name",
                signed.report.input.businessName || "",
              ],
              [
                "location",
                "Location genuinely served",
                signed.report.input.city || "",
              ],
              ["pageType", "Page type", "Service page"],
            ].map(([name, label, value]) => (
              <label key={name}>
                {label}
                <input name={name} defaultValue={value} maxLength={300} />
              </label>
            ))}
          </div>
          <button
            className="hg-button hg-button-primary"
            disabled={!features.ai}
          >
            <Sparkles size={16} /> Generate metadata
          </button>
          <p className="hg-note">
            {features.ai
              ? "Page excerpts and these fields will be sent to the configured OpenAI provider."
              : "AI provider not configured. Metadata generation will be available after it is connected."}
          </p>
        </form>
      </section>
      <section className="hg-panel">
        <div className="hg-section-heading">
          <Code2 size={21} />
          <h3>Factual Schema Builder</h3>
        </div>
        <p>
          Create an editable JSON-LD example from facts you enter. This is a
          template tool, not an AI claim.
        </p>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            setError("");
            const f = new FormData(e.currentTarget);
            const name = String(f.get("name") || "").trim();
            const raw = String(f.get("url") || "");
            try {
              const url = new URL(raw);
              if (!["http:", "https:"].includes(url.protocol))
                throw new Error();
              const type = String(f.get("type"));
              const result: Record<string, unknown> = {
                "@context": "https://schema.org",
                "@type": type,
                name,
                url: url.href,
              };
              if (f.get("phone"))
                result.telephone = String(f.get("phone")).trim();
              if (type === "LocalBusiness") {
                if (!f.get("street") || !f.get("city") || !f.get("country")) {
                  setError(
                    "A LocalBusiness example needs a real street address, city and country. Use Organization for a business without a public location.",
                  );
                  return;
                }
                result.address = {
                  "@type": "PostalAddress",
                  streetAddress: f.get("street"),
                  addressLocality: f.get("city"),
                  addressCountry: f.get("country"),
                };
              }
              setSchema(JSON.stringify(result, null, 2));
            } catch {
              setError("Enter a valid public website URL.");
            }
          }}
        >
          <div className="hg-form-grid">
            <label>
              Schema type
              <select name="type">
                <option>Organization</option>
                <option>LocalBusiness</option>
              </select>
            </label>
            <label>
              Business name
              <input
                name="name"
                required
                defaultValue={signed.report.input.businessName || ""}
                maxLength={160}
              />
            </label>
            <label>
              Website URL
              <input name="url" type="url" required defaultValue={home.url} />
            </label>
            <label>
              Public phone
              <input name="phone" placeholder="Optional" maxLength={50} />
            </label>
            <label>
              Real street address
              <input
                name="street"
                placeholder="Required for LocalBusiness"
                maxLength={200}
              />
            </label>
            <label>
              City
              <input name="city" maxLength={100} />
            </label>
            <label>
              Country code
              <input name="country" placeholder="e.g. SA or PK" maxLength={2} />
            </label>
          </div>
          <button className="hg-button hg-button-outline" type="submit">
            <Code2 size={16} /> Generate Schema
          </button>
        </form>
        {error && (
          <p className="hg-error" role="alert">
            {error}
          </p>
        )}
        {schema && (
          <>
            <label className="hg-schema-label">
              Review and edit JSON-LD
              <textarea
                aria-label="Generated structured data"
                rows={12}
                value={schema}
                onChange={(e) => setSchema(e.target.value)}
                spellCheck={false}
              />
            </label>
            <CopyButton value={schema} />
          </>
        )}
        <p className="hg-note">
          Verify all facts and validate the edited JSON-LD before publishing.
          Never add invented addresses, ratings, opening hours or locations.
        </p>
      </section>
    </div>
  );
}
