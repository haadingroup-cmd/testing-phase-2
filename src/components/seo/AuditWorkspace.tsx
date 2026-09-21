"use client";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type FormEvent,
} from "react";
import type { Check, AIResult } from "@/lib/seo/types";
type Job = {
  id: string;
  url: string;
  status: string;
  createdAt: string;
  pages: number;
  maxPages: number;
  pending: number;
  skipped: number;
  error?: string;
  aiStatus: string;
  aiRequested: boolean;
  aiReviewed: number;
  aiLimit: number;
};
type Detail = Omit<Job, "pages"> & {
  totalPages: number;
  overall: number | null;
  partial: boolean;
  coverage: string[];
  counts: Record<string, number>;
  pages: {
    url: string;
    title: string;
    score: number | null;
    checks: Check[];
    ai?: { result?: AIResult; error?: string };
  }[];
  skippedURLs: { url: string; reason: string }[];
};
const field =
  "w-full rounded-lg border border-slate-600 bg-slate-900 p-3 text-white";
const button =
  "rounded-lg bg-blue-700 px-4 py-2 font-semibold text-white disabled:opacity-40";
export default function AuditWorkspace() {
  const [notice, setNotice] = useState("");
  const [googleData, setGoogleData] = useState<{
    metrics: {
      key: string;
      label: string;
      value: number | null;
      unit?: string;
      source: string;
      status: string;
    }[];
    errors: string[];
  } | null>(null);
  const [jobs, setJobs] = useState<Job[]>([]),
    [configured, setConfigured] = useState(false),
    [ai, setAI] = useState(false),
    [error, setError] = useState(""),
    [busy, setBusy] = useState(false),
    [selected, setSelected] = useState(""),
    [detail, setDetail] = useState<Detail | null>(null),
    [offset, setOffset] = useState(0);
  const selectedRef = useRef(selected);
  selectedRef.current = selected;
  const refresh = useCallback(async (signal?: AbortSignal) => {
    const r = await fetch("/api/seo/jobs", { cache: "no-store", signal }),
      d = await r.json();
    if (!r.ok) throw new Error(d.error);
    if (signal?.aborted) return;
    setJobs(d.jobs);
    setConfigured(d.configured);
    setAI(d.ai);
  }, []);
  const load = useCallback(
    async (signal?: AbortSignal) => {
      if (!selected) return;
      const r = await fetch(`/api/seo/jobs/${selected}?offset=${offset}`, {
          cache: "no-store",
          signal,
        }),
        d = await r.json();
      if (!r.ok) throw new Error(d.error);
      if (!signal?.aborted && selectedRef.current === selected) setDetail(d);
    },
    [selected, offset],
  );
  useEffect(() => {
    const controller = new AbortController();
    let timer: ReturnType<typeof setTimeout>;
    const update = async () => {
      try {
        await refresh(controller.signal);
      } catch (e) {
        if (!controller.signal.aborted)
          setError(e instanceof Error ? e.message : "History unavailable.");
      }
      if (!controller.signal.aborted) timer = setTimeout(update, 15000);
    };
    void update();
    return () => {
      controller.abort();
      clearTimeout(timer);
    };
  }, [refresh]);
  useEffect(() => {
    const controller = new AbortController();
    let timer: ReturnType<typeof setTimeout>;
    setDetail(null);
    const update = async () => {
      try {
        await load(controller.signal);
      } catch (e) {
        if (!controller.signal.aborted)
          setError(e instanceof Error ? e.message : "Audit unavailable.");
      }
      if (!controller.signal.aborted) timer = setTimeout(update, 10000);
    };
    void update();
    return () => {
      controller.abort();
      clearTimeout(timer);
    };
  }, [load]);
  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    setError("");
    const f = new FormData(e.currentTarget);
    try {
      const r = await fetch("/api/seo/jobs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          input: {
            url: f.get("url"),
            businessName: f.get("businessName"),
            keyword: f.get("keyword"),
            competitors: [],
            social: {},
          },
          maxPages: Number(f.get("maxPages")),
          ai: f.get("ai") === "on",
          aiLimit: Number(f.get("aiLimit")),
        }),
      });
      const d = await r.json();
      if (!r.ok) throw new Error(d.error);
      setSelected(d.id);
      setOffset(0);
      await refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Audit could not start.");
    } finally {
      setBusy(false);
    }
  }
  async function fetchGoogle(url: string) {
    setError("");
    setBusy(true);
    try {
      const r = await fetch("/api/seo/search-data", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });
      const d = await r.json();
      if (!r.ok) throw new Error(d.error);
      if (selectedRef.current === selected) setGoogleData(d);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Google data unavailable.");
    } finally {
      setBusy(false);
    }
  }
  async function repeat(
    jobId: string,
    cadence: "daily" | "weekly",
    enabled: boolean,
  ) {
    setError("");
    try {
      const r = await fetch("/api/seo/schedules", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jobId, cadence, enabled }),
      });
      const d = await r.json();
      if (!r.ok) throw new Error(d.error);
      setNotice(
        enabled
          ? `${cadence} audit saved. Next due: ${new Date(d.nextAt).toLocaleString()}`
          : "Repeated audits disabled for this website.",
      );
    } catch (e) {
      setError(e instanceof Error ? e.message : "Schedule could not be saved.");
    }
  }
  async function action(id: string, action: string) {
    setBusy(true);
    setError("");
    try {
      const r = await fetch(`/api/seo/jobs/${id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action }),
      });
      const d = await r.json();
      if (!r.ok) throw new Error(d.error);
      await refresh();
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Action failed.");
    } finally {
      setBusy(false);
    }
  }
  return (
    <div className="space-y-6 text-slate-200">
      <h1 className="text-3xl font-bold text-white">
        HaadinGlobal SEO projects
      </h1>
      <p>
        Discover public pages through sitemaps and internal links. Audits run in
        the background and save checkpoints. History is retained for 30 days.
      </p>
      {!configured && (
        <p role="status" className="rounded-lg bg-amber-950 p-4">
          Background audits are awaiting Redis storage and workflow
          configuration. The public quick audit remains separate.
        </p>
      )}
      {notice && <p role="status">{notice}</p>}
      {error && (
        <p role="alert" className="rounded-lg bg-red-950 p-4">
          {error}
        </p>
      )}
      <form
        onSubmit={submit}
        className="grid gap-4 rounded-xl border border-slate-700 p-5 md:grid-cols-2"
      >
        <label>
          Website URL
          <input
            name="url"
            type="url"
            placeholder="https://example.com"
            required
            maxLength={2048}
            className={field}
          />
        </label>
        <label>
          Business name
          <input name="businessName" maxLength={160} className={field} />
        </label>
        <label>
          Main topic or service
          <input name="keyword" maxLength={160} className={field} />
        </label>
        <label>
          Maximum pages
          <input
            name="maxPages"
            type="number"
            min={1}
            max={500}
            defaultValue={250}
            required
            className={field}
          />
        </label>
        <label className="flex items-center gap-3">
          <input name="ai" type="checkbox" disabled={!ai} />
          Request AI content review for individual pages
          {!ai && " — provider not connected"}
        </label>
        <label>
          Maximum AI page reviews
          <input
            name="aiLimit"
            type="number"
            min={1}
            max={500}
            defaultValue={20}
            required
            className={field}
          />
        </label>
        <p className="text-sm md:col-span-2">
          AI sends page excerpts and supplied business context to OpenAI. Each
          selected page uses a separate provider request. This does not measure
          Google rankings, backlinks or visibility in AI answers. Restricted
          pages are skipped; URL limits and coverage are always reported.
        </p>
        <button className={button} disabled={busy || !configured}>
          {busy ? "Saving…" : "Start site-wide audit"}
        </button>
      </form>
      <section>
        <h2 className="mb-3 text-xl font-bold">Saved audits</h2>
        <div className="space-y-3">
          {jobs.map((j) => (
            <div
              key={j.id}
              className="flex flex-wrap items-center gap-4 rounded-xl border border-slate-700 p-4"
            >
              <button
                className="text-left text-blue-300"
                onClick={() => {
                  setSelected(j.id);
                  setOffset(0);
                  setDetail(null);
                  setGoogleData(null);
                }}
              >
                {j.url}
                <span className="block text-sm text-slate-400">
                  {new Date(j.createdAt).toLocaleString()}
                </span>
              </button>
              <span>
                {j.status} · {j.pages}/{j.maxPages} pages · {j.pending} queued
              </span>
              {["running", "queued", "completed"].includes(j.status) && (
                <button
                  className={button}
                  disabled={busy}
                  onClick={() => action(j.id, "cancel")}
                >
                  Cancel further work
                </button>
              )}
              {["failed", "cancelled"].includes(j.status) && (
                <button
                  className={button}
                  disabled={busy}
                  onClick={() => action(j.id, "resume")}
                >
                  Resume checkpoint
                </button>
              )}
            </div>
          ))}
          {!jobs.length && <p>No saved audits yet.</p>}
        </div>
      </section>
      {detail && (
        <section className="space-y-4 rounded-xl border border-slate-700 p-5">
          <h2 className="text-2xl font-bold">{detail.url}</h2>
          <p>
            {detail.totalPages} pages analyzed ·{" "}
            {detail.partial
              ? "Partial coverage"
              : "Discovered eligible queue completed"}{" "}
            · Weighted check pass rate: {detail.overall ?? "unavailable"}
            {detail.overall !== null && "/100"}
          </p>
          <p>
            This number describes the checks performed, not whole-site SEO
            quality or predicted rankings.
          </p>
          <p>{detail.aiStatus}</p>
          {detail.error && <p role="alert">{detail.error}</p>}
          <div className="flex flex-wrap gap-3">
            {["pdf", "csv", "json"].map((f) => (
              <a
                className={button}
                key={f}
                href={`/api/seo/jobs/${detail.id}/export?format=${f}`}
              >
                Download {f.toUpperCase()}
              </a>
            ))}
          </div>
          <div className="flex flex-wrap gap-3">
            <button
              className={button}
              onClick={() => repeat(detail.id, "weekly", true)}
            >
              Repeat weekly
            </button>
            <button
              className={button}
              onClick={() => repeat(detail.id, "daily", true)}
            >
              Repeat daily
            </button>
            <button
              className={button}
              onClick={() => repeat(detail.id, "weekly", false)}
            >
              Stop repeats
            </button>
          </div>
          <p className="text-sm">
            Repeats reuse this audit’s page and AI limits. Provider usage
            repeats too. The scheduler checks due projects once daily; exact
            start times are not guaranteed.
          </p>
          <button
            className={button}
            disabled={busy}
            onClick={() => fetchGoogle(detail.url)}
          >
            Load authorized Search Console / GA4 data
          </button>
          {googleData && (
            <div>
              {googleData.metrics.map((m) => (
                <p key={m.key}>
                  <strong>
                    {m.label}: {m.value ?? "Unavailable"} {m.unit}
                  </strong>
                  <br />
                  {m.source} · {m.status}
                </p>
              ))}
              {googleData.errors.map((e, i) => (
                <p key={i}>{e}</p>
              ))}
            </div>
          )}
          <details>
            <summary>Coverage and exclusions</summary>
            <ul className="list-disc space-y-2 pl-5">
              {detail.coverage.map((c) => (
                <li key={c}>{c}</li>
              ))}
            </ul>
          </details>
          {detail.pages.map((p) => (
            <article
              key={p.url}
              className="rounded-lg border border-slate-700 p-4"
            >
              <h3 className="font-bold">{p.title || "Untitled page"}</h3>
              <a
                href={p.url}
                target="_blank"
                rel="noreferrer"
                className="break-all text-blue-300"
              >
                {p.url}
              </a>
              <details>
                <summary>Measured checks ({p.checks.length})</summary>
                {p.checks.map((c) => (
                  <div
                    key={c.id}
                    className="mt-3 border-t border-slate-700 pt-3"
                  >
                    <strong>
                      {c.status}: {c.title}
                    </strong>
                    <p className="break-words">Evidence: {c.evidence}</p>
                    <p>{c.explanation}</p>
                    {c.status !== "passed" && <p>Next step: {c.fix}</p>}
                  </div>
                ))}
              </details>
              {p.ai?.error && <p>{p.ai.error}</p>}
              {p.ai?.result && (
                <details>
                  <summary>AI content review — suggestions to verify</summary>
                  <h4>{p.ai.result.headline}</h4>
                  <p>{p.ai.result.explanation}</p>
                  {p.ai.result.items.map((i, n) => (
                    <p key={n}>
                      <strong>{i.label}: </strong>
                      {i.value}
                    </p>
                  ))}
                  <small>{p.ai.result.source}</small>
                </details>
              )}
            </article>
          ))}
          <div className="flex gap-3">
            <button
              className={button}
              disabled={!offset}
              onClick={() => setOffset(Math.max(0, offset - 10))}
            >
              Previous pages
            </button>
            <button
              className={button}
              disabled={offset + 10 >= detail.totalPages}
              onClick={() => setOffset(offset + 10)}
            >
              Next pages
            </button>
          </div>
          <details>
            <summary>Skipped URLs (up to 20 in this window)</summary>
            <p>
              Download JSON for the complete list of skipped URLs and reasons.
            </p>
            {detail.skippedURLs.map((s, i) => (
              <p key={i} className="break-all">
                {s.url} — {s.reason}
              </p>
            ))}
          </details>
        </section>
      )}
    </div>
  );
}
