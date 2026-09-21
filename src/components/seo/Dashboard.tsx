"use client";
import { useState } from "react";
import {
  ArrowRight,
  ArrowUpRight,
  CheckCircle2,
  ChevronDown,
  Download,
  ExternalLink,
  FileDown,
  Info,
  Link2,
  Search,
  ShieldCheck,
  Sparkles,
  TriangleAlert,
  Zap,
} from "lucide-react";
import { brand, categoryLabels, scoreLabel } from "@/lib/seo/config";
import {
  categories,
  type AIResult,
  type Category,
  type Check,
  type ProviderMetric,
  type SignedReport,
  type Status,
} from "@/lib/seo/types";
import type { Features } from "./Analyzer";
import Tools, { Guidance, Modal } from "./Tools";

const priorities = { First: 0, High: 1, Medium: 2, Low: 3 };
function ScoreRing({ score }: { score: number | null }) {
  const value = score ?? 0;
  return (
    <div
      className="hg-score-ring"
      role="img"
      aria-label={`Checked signal score ${score === null ? "unavailable" : `${score} out of 100`}`}
    >
      <svg viewBox="0 0 180 180" aria-hidden="true">
        <circle
          cx="90"
          cy="90"
          r="76"
          fill="none"
          stroke="#e9edf3"
          strokeWidth="12"
        />
        <circle
          cx="90"
          cy="90"
          r="76"
          fill="none"
          stroke={value >= 75 ? "#248472" : value >= 50 ? "#b48738" : "#ca5656"}
          strokeWidth="12"
          strokeLinecap="round"
          strokeDasharray={`${value * 4.775} 477.5`}
          transform="rotate(-90 90 90)"
        />
      </svg>
      <div>
        <strong>{score ?? "—"}</strong>
        <span>OUT OF 100</span>
      </div>
    </div>
  );
}
function IssueCard({
  check,
  pro,
  ai,
  onFix,
}: {
  check: Check;
  pro: boolean;
  ai: boolean;
  onFix: () => void;
}) {
  return (
    <article className={`hg-issue hg-issue-${check.status}`}>
      <div className="hg-issue-top">
        <span className={`hg-status hg-status-${check.status}`}>
          {check.status === "passed" ? (
            <CheckCircle2 size={13} />
          ) : check.status === "unavailable" ? (
            <Info size={13} />
          ) : (
            <TriangleAlert size={13} />
          )}{" "}
          {check.status}
        </span>
        <span className="hg-source">{categoryLabels[check.category]}</span>
      </div>
      <h3>{check.title}</h3>
      <p>{check.explanation}</p>
      <div className="hg-fix">
        <strong>How to fix it</strong>
        <p>
          {check.status === "passed"
            ? "Keep this element accurate as the page changes. " + check.fix
            : check.fix}
        </p>
      </div>
      <details open={pro || undefined}>
        <summary>
          Technical evidence <ChevronDown size={14} />
        </summary>
        <div className="hg-evidence">
          <p>{check.evidence}</p>
          <a href={check.pageUrl} target="_blank" rel="noopener noreferrer">
            {check.pageUrl}
            <ExternalLink size={12} />
          </a>
          <p className="hg-source">
            Source: {check.source} · Check weight: {check.weight}
          </p>
        </div>
      </details>
      <div className="hg-issue-bottom">
        <span>
          {check.priority} priority · {check.difficulty}
        </span>
        {check.status !== "passed" && check.status !== "unavailable" && (
          <button
            className="hg-button hg-button-quiet"
            disabled={!ai}
            title={
              ai
                ? "Uses observed page content"
                : "AI provider is not configured"
            }
            onClick={onFix}
          >
            <Sparkles size={14} /> AI Fix
          </button>
        )}
      </div>
    </article>
  );
}
function uniqueActions(checks: Check[]) {
  const map = new Map<string, { check: Check; count: number }>();
  for (const check of checks.filter(
    (c) => c.status === "critical" || c.status === "warning",
  )) {
    const key = check.title;
    const existing = map.get(key);
    if (existing) existing.count++;
    else map.set(key, { check, count: 1 });
  }
  return [...map.values()].sort(
    (a, b) => priorities[a.check.priority] - priorities[b.check.priority],
  );
}
export default function Dashboard({
  signed,
  onReportChange,
  features,
}: {
  signed: SignedReport;
  onReportChange: (s: SignedReport) => void;
  features: Features;
}) {
  const report = signed.report;
  const home = report.pages[0];
  const [pro, setPro] = useState(false);
  const [tab, setTab] = useState("Overview");
  const [status, setStatus] = useState<"all" | Status>("all");
  const [category, setCategory] = useState<"all" | Category>("all");
  const [query, setQuery] = useState("");
  const [limit, setLimit] = useState(18);
  const [exporting, setExporting] = useState("");
  const [error, setError] = useState("");
  const [modal, setModal] = useState<string | null>(null);
  const [guidance, setGuidance] = useState<AIResult | null>(null);
  const [aiBusy, setAIBusy] = useState(false);
  const [aiError, setAIError] = useState("");
  const [psi, setPsi] = useState<ProviderMetric[]>([]);
  const [psiBusy, setPSIBusy] = useState(false);
  const [clientName, setClientName] = useState("");
  const [agencyName, setAgencyName] = useState("");
  const counts = {
    critical: report.checks.filter((c) => c.status === "critical").length,
    warning: report.checks.filter((c) => c.status === "warning").length,
    passed: report.checks.filter((c) => c.status === "passed").length,
    unavailable: report.checks.filter((c) => c.status === "unavailable").length,
  };
  const filtered = report.checks.filter(
    (c) =>
      (status === "all" || c.status === status) &&
      (category === "all" || c.category === category) &&
      `${c.title} ${c.evidence} ${c.pageUrl}`
        .toLowerCase()
        .includes(query.toLowerCase()),
  );
  const actions = uniqueActions(report.checks);
  async function download(format: "pdf" | "csv" | "json") {
    setExporting(format);
    setError("");
    try {
      const response = await fetch("/api/seo/export", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          signed,
          format,
          branding: { clientName, agencyName },
        }),
      });
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error);
      }
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `HaadinGlobal-SEO-Audit-${new URL(home.url).hostname}.${format}`;
      a.click();
      window.setTimeout(() => URL.revokeObjectURL(url), 1000);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "The export could not be downloaded.",
      );
    } finally {
      setExporting("");
    }
  }
  async function runAI(
    task: "summary" | "fix" | "meta" | "content",
    issueId?: string,
    fields?: Record<string, string>,
  ) {
    setModal(
      task === "fix"
        ? "AI Fix"
        : task === "meta"
          ? "AI Meta Generator"
          : task === "content"
            ? "Content assessment"
            : "AI recommendations",
    );
    setAIBusy(true);
    setAIError("");
    setGuidance(null);
    try {
      const response = await fetch("/api/seo/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ signed, task, issueId, fields }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error);
      setGuidance(result.guidance);
      if (result.signed) onReportChange(result.signed);
    } catch (err) {
      setAIError(
        err instanceof Error
          ? err.message
          : "The AI provider did not return a result.",
      );
    } finally {
      setAIBusy(false);
    }
  }
  async function pageSpeed() {
    setPSIBusy(true);
    setError("");
    try {
      const response = await fetch("/api/seo/performance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(signed),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error);
      setPsi(result.metrics);
      if (result.signed) onReportChange(result.signed);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "PageSpeed test unavailable.",
      );
    } finally {
      setPSIBusy(false);
    }
  }
  return (
    <section className="hg-report hg-wrap" aria-labelledby="report-heading">
      <div className="hg-report-toolbar">
        <div>
          <div className="hg-eyebrow">
            <span className="hg-dot" /> AUDIT COMPLETE
            {report.partial ? " · PARTIAL CRAWL" : ""}
          </div>
          <h2 id="report-heading">Your audit findings.</h2>
          <p className="hg-report-url">
            <GlobeMini />
            {new URL(home.url).hostname}
            <span>·</span>
            {new Date(report.createdAt).toLocaleDateString("en-GB")}
          </p>
        </div>
        <div className="hg-report-actions">
          <div className="hg-mode" aria-label="Detail level">
            <button
              aria-pressed={!pro}
              className={!pro ? "active" : ""}
              onClick={() => setPro(false)}
            >
              Beginner
            </button>
            <button
              aria-pressed={pro}
              className={pro ? "active" : ""}
              onClick={() => setPro(true)}
            >
              Pro
            </button>
          </div>
          <button
            className="hg-button hg-button-primary hg-download"
            disabled={!!exporting}
            onClick={() => download("pdf")}
          >
            <FileDown size={17} />
            {exporting === "pdf"
              ? "Preparing PDF…"
              : "Download Full SEO Report"}
          </button>
        </div>
      </div>
      {error && (
        <div role="alert" className="hg-error">
          {error}
        </div>
      )}
      <div
        className="hg-report-tabs"
        role="tablist"
        aria-label="Report sections"
      >
        {["Overview", "Findings", "Pages", "Competitors", "Data & tools"].map(
          (name) => (
            <button
              key={name}
              role="tab"
              aria-selected={tab === name}
              aria-controls="hg-report-content"
              onClick={() => setTab(name)}
              className={tab === name ? "active" : ""}
            >
              {name}
              {name === "Findings" && (
                <span>{counts.critical + counts.warning}</span>
              )}
              {name === "Pages" && <span>{report.pages.length}</span>}
            </button>
          ),
        )}
      </div>
      <div id="hg-report-content" role="tabpanel" aria-label={tab}>
        {tab === "Overview" && (
          <>
            <div className="hg-overview-grid">
              <section className="hg-panel hg-health-panel">
                <div>
                  <span className="hg-eyebrow">CHECKED SIGNALS</span>
                  <h3>{scoreLabel(report.overall)}</h3>
                  <p>
                    Measured signals.
                    <br />A clear starting point.
                  </p>
                </div>
                <ScoreRing score={report.overall} />
                <p className="hg-score-disclaimer">
                  This is the weighted pass rate for the checks performed.
                  Unchecked pages, content quality, rankings and real loading
                  speed are not represented by this number.
                </p>
              </section>
              <div className="hg-overview-right">
                <div className="hg-count-grid">
                  {(
                    [
                      ["critical", "Critical"],
                      ["warning", "Warnings"],
                      ["passed", "Passed"],
                    ] as const
                  ).map(([key, label]) => (
                    <button
                      key={key}
                      className={`hg-count hg-count-${key}`}
                      onClick={() => {
                        setStatus(key);
                        setCategory("all");
                        setTab("Findings");
                      }}
                    >
                      <span>{label}</span>
                      <strong>{counts[key]}</strong>
                      <span>
                        View checks <ArrowUpRight size={13} />
                      </span>
                    </button>
                  ))}
                </div>
                <div className="hg-coverage">
                  <ShieldCheck size={21} />
                  <div>
                    <strong>Every finding comes with evidence.</strong>
                    <p>
                      {report.pages.length} pages analyzed ·{" "}
                      {report.skipped.length} skips recorded ·{" "}
                      {counts.unavailable} unavailable checks excluded from the
                      score.
                    </p>
                    <span>
                      Counts include repeated checks across sampled pages.
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div className="hg-category-grid">
              {report.scores.map((s) => (
                <button
                  className="hg-category-card"
                  key={s.category}
                  onClick={() => {
                    setCategory(s.category);
                    setStatus("all");
                    setTab("Findings");
                  }}
                >
                  <span>{categoryLabels[s.category]}</span>
                  <strong>
                    {s.score ?? "—"}
                    <small>{s.score !== null ? "/100" : " unavailable"}</small>
                  </strong>
                  <div className="hg-bar">
                    <i style={{ width: `${s.score ?? 0}%` }} />
                  </div>
                  <span className="hg-source">
                    {s.evaluated} evaluated checks <ArrowUpRight size={12} />
                  </span>
                </button>
              ))}
            </div>
            <div className="hg-section-title">
              <div>
                <span className="hg-eyebrow">MAKE THE NEXT MOVE</span>
                <h2>What needs your attention?</h2>
              </div>
              <button
                className="hg-button hg-button-outline"
                disabled={!features.ai || aiBusy}
                onClick={() => runAI("summary")}
              >
                <Sparkles size={16} /> AI recommendations
              </button>
            </div>
            <p className="hg-note hg-ai-status">{report.aiStatus}</p>
            {report.ai && (
              <section className="hg-panel hg-ai-summary">
                <Guidance guidance={report.ai} />
              </section>
            )}
            <div className="hg-action-list">
              {actions
                .slice(0, pro ? actions.length : 6)
                .map(({ check, count }, i) => (
                  <article className="hg-action" key={check.title}>
                    <span className="hg-action-number">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <div>
                      <div className="hg-action-heading">
                        <h3>{check.title}</h3>
                        <span className={`hg-status hg-status-${check.status}`}>
                          {check.priority === "First"
                            ? "Do this first"
                            : `${check.priority} priority`}
                        </span>
                      </div>
                      <p>{check.fix}</p>
                      <div className="hg-action-meta">
                        <span>
                          Diagnostic impact:{" "}
                          {check.weight >= 3
                            ? "High"
                            : check.weight === 2
                              ? "Medium"
                              : "Low"}
                        </span>
                        <span>Difficulty: {check.difficulty}</span>
                        <span>
                          {count} check{count === 1 ? "" : "s"}
                        </span>
                      </div>
                    </div>
                    <button
                      className="hg-arrow-button"
                      aria-label={`View ${check.title} evidence`}
                      onClick={() => {
                        setQuery(check.title);
                        setStatus("all");
                        setCategory("all");
                        setTab("Findings");
                      }}
                    >
                      <ArrowUpRight size={18} />
                    </button>
                  </article>
                ))}
            </div>
            {!actions.length && (
              <div className="hg-panel">
                <CheckCircle2 size={25} />
                <h3>No failing checks in this sample.</h3>
                <p>
                  Review coverage and unavailable signals before drawing broader
                  conclusions.
                </p>
              </div>
            )}
            {actions.length > 6 && !pro && (
              <button
                className="hg-button hg-button-outline hg-more"
                onClick={() => setPro(true)}
              >
                Show all {actions.length} actions <ArrowRight size={15} />
              </button>
            )}
            <div className="hg-two-column">
              <section className="hg-panel">
                <h3>Content structure observations</h3>
                <p>
                  This audit measures structure and text availability. An
                  AI-assisted content assessment is available separately; it is
                  not a direct Google quality score.
                </p>
                <dl className="hg-facts">
                  <div>
                    <dt>Starting-page text</dt>
                    <dd>{home.wordCount} word-like tokens</dd>
                  </div>
                  <div>
                    <dt>Section headings</dt>
                    <dd>
                      {home.headings.filter((h) => h.level === 2).length} H2s
                    </dd>
                  </div>
                  <div>
                    <dt>Question headings</dt>
                    <dd>
                      {home.headings.filter((h) => /[?؟]/.test(h.text)).length}{" "}
                      with question marks
                    </dd>
                  </div>
                  <div>
                    <dt>Primary topic</dt>
                    <dd>{report.input.keyword || "Not supplied"}</dd>
                  </div>
                  <div>
                    <dt>Reading difficulty</dt>
                    <dd>Not assessed for this language</dd>
                  </div>
                </dl>
                <button
                  className="hg-button hg-button-outline"
                  disabled={!features.ai}
                  onClick={() => runAI("content")}
                >
                  <Sparkles size={15} /> Assess topics & intent
                </button>
              </section>
              <section className="hg-panel">
                <h3>Internal linking opportunities</h3>
                {report.internalLinks.length ? (
                  report.internalLinks.map((l, i) => (
                    <div className="hg-link-opportunity" key={i}>
                      <Link2 size={17} />
                      <div>
                        <strong>{l.anchor}</strong>
                        <p>
                          {new URL(l.from).pathname} → {new URL(l.to).pathname}
                        </p>
                        <p className="hg-note">{l.reason}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p>
                    No exact phrase-based linking opportunities were found in
                    the sampled text. This does not mean the website has no
                    opportunities.
                  </p>
                )}
                <p className="hg-note">
                  Suggestions use text actually found in the sample. Links are
                  never inserted automatically.
                </p>
              </section>
            </div>
          </>
        )}
        {tab === "Findings" && (
          <>
            <div className="hg-section-title">
              <div>
                <h2>Evidence, explained.</h2>
                <p>Understand the issue and the next practical step.</p>
              </div>
            </div>
            <div className="hg-filter-row">
              <div className="hg-filters">
                {(
                  [
                    "all",
                    "critical",
                    "warning",
                    "passed",
                    "unavailable",
                  ] as const
                ).map((s) => (
                  <button
                    key={s}
                    aria-pressed={status === s}
                    className={status === s ? "active" : ""}
                    onClick={() => {
                      setStatus(s);
                      setLimit(18);
                    }}
                  >
                    {s === "all"
                      ? "All"
                      : s === "warning"
                        ? "Warnings"
                        : s[0].toUpperCase() + s.slice(1)}
                  </button>
                ))}
              </div>
              <select
                aria-label="Filter by category"
                value={category}
                onChange={(e) => {
                  setCategory(e.target.value as Category | "all");
                  setLimit(18);
                }}
              >
                <option value="all">All categories</option>
                {categories.map((c) => (
                  <option key={c} value={c}>
                    {categoryLabels[c]}
                  </option>
                ))}
              </select>
              <div className="hg-search">
                <Search size={16} />
                <input
                  aria-label="Search findings"
                  placeholder="Search evidence or URL"
                  value={query}
                  onChange={(e) => {
                    setQuery(e.target.value);
                    setLimit(18);
                  }}
                />
              </div>
            </div>
            <p className="hg-note">
              {filtered.length} matching checks.{" "}
              {features.ai
                ? "AI Fix sends the selected issue and page excerpts to OpenAI."
                : "AI Fix is unavailable until an AI provider is configured."}
            </p>
            <div className="hg-issues-grid">
              {filtered.slice(0, limit).map((check) => (
                <IssueCard
                  key={check.id}
                  check={check}
                  pro={pro}
                  ai={features.ai}
                  onFix={() => runAI("fix", check.id)}
                />
              ))}
            </div>
            {!filtered.length && (
              <div className="hg-empty">No checks match these filters.</div>
            )}
            {filtered.length > limit && (
              <button
                className="hg-button hg-button-outline hg-more"
                onClick={() => setLimit(limit + 18)}
              >
                Show more findings <ChevronDown size={15} />
              </button>
            )}
          </>
        )}
        {tab === "Pages" && (
          <>
            <div className="hg-section-title">
              <div>
                <h2>Pages overview</h2>
                <p>
                  {report.pages.length} analyzed · {report.discovered} unique
                  URLs discovered in a bounded sample.
                </p>
              </div>
            </div>
            <div className="hg-table-wrap">
              <table>
                <caption className="hg-sr-only">
                  Page-level audit findings
                </caption>
                <thead>
                  <tr>
                    <th>Page</th>
                    <th>Status</th>
                    <th>Health</th>
                    <th>Title</th>
                    <th>Meta</th>
                    <th>H1</th>
                    <th>Issues</th>
                  </tr>
                </thead>
                <tbody>
                  {report.pages.map((p) => (
                    <tr key={p.url}>
                      <td>
                        <details>
                          <summary>{new URL(p.url).pathname || "/"}</summary>
                          <dl className="hg-page-details">
                            <dt>URL</dt>
                            <dd>{p.url}</dd>
                            <dt>Title</dt>
                            <dd>{p.title || "Missing"}</dd>
                            <dt>Meta description</dt>
                            <dd>{p.description || "Missing"}</dd>
                            <dt>H1</dt>
                            <dd>{p.h1.join(" | ") || "Missing"}</dd>
                            <dt>Canonical</dt>
                            <dd>{p.canonical || "Not detected"}</dd>
                            <dt>Schema types</dt>
                            <dd>
                              {p.schema.types.join(", ") || "None detected"}
                            </dd>
                            <dt>HTML / transfer</dt>
                            <dd>
                              {Math.round(p.bytes / 1024)} KB /{" "}
                              {Math.round(p.transferBytes / 1024)} KB
                            </dd>
                            <dt>Fetch time</dt>
                            <dd>
                              {p.fetchMs} ms (server request, not page load)
                            </dd>
                          </dl>
                        </details>
                      </td>
                      <td>
                        <span className="hg-status hg-status-passed">
                          {p.status}
                        </span>
                      </td>
                      <td>{p.score ?? "—"}</td>
                      <td>{p.title ? "Present" : "Missing"}</td>
                      <td>{p.description ? "Present" : "Missing"}</td>
                      <td>{p.h1.length}</td>
                      <td>
                        <button
                          className="hg-text-button"
                          onClick={() => {
                            setQuery(p.url);
                            setStatus("all");
                            setCategory("all");
                            setTab("Findings");
                          }}
                        >
                          {
                            p.checks.filter(
                              (c) =>
                                c.status === "critical" ||
                                c.status === "warning",
                            ).length
                          }
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <section className="hg-panel hg-spaced">
              <h3>Skipped pages & reasons</h3>
              {report.skipped.length ? (
                <ul className="hg-skipped">
                  {report.skipped.map((s, i) => (
                    <li key={i}>
                      <span>{s.url}</span>
                      <strong>{s.reason}</strong>
                    </li>
                  ))}
                </ul>
              ) : (
                <p>
                  No skips were recorded. This is a limited crawl, not
                  confirmation that every page on the website was discovered.
                </p>
              )}
            </section>
          </>
        )}
        {tab === "Competitors" && (
          <>
            <div className="hg-section-title">
              <div>
                <h2>Competitor SEO comparison</h2>
                <p>
                  Visible homepage elements, with the source behind each
                  observation.
                </p>
              </div>
            </div>
            {report.competitors.length ? (
              <div className="hg-competitor-grid">
                {[{ url: home.url, page: home }, ...report.competitors].map(
                  (c, i) => (
                    <section className="hg-panel" key={c.url + i}>
                      <span className="hg-eyebrow">
                        {i === 0
                          ? "YOUR STARTING PAGE"
                          : "COMPETITOR STARTING PAGE"}
                      </span>
                      <h3 className="hg-break">{new URL(c.url).hostname}</h3>
                      {c.page ? (
                        <>
                          <dl className="hg-facts">
                            <div>
                              <dt>HTTP response</dt>
                              <dd>{c.page.status}</dd>
                            </div>
                            <div>
                              <dt>Title</dt>
                              <dd>{c.page.title || "Not detected"}</dd>
                            </div>
                            <div>
                              <dt>Meta description</dt>
                              <dd>{c.page.description || "Not detected"}</dd>
                            </div>
                            <div>
                              <dt>Main headings</dt>
                              <dd>{c.page.h1.join(" | ") || "Not detected"}</dd>
                            </div>
                            <div>
                              <dt>JSON-LD types</dt>
                              <dd>
                                {c.page.schema.types.join(", ") ||
                                  "Not detected"}
                              </dd>
                            </div>
                            <div>
                              <dt>Extracted words</dt>
                              <dd>{c.page.wordCount}</dd>
                            </div>
                            <div>
                              <dt>Internal links</dt>
                              <dd>
                                {c.page.links.filter((l) => l.internal).length}
                              </dd>
                            </div>
                            <div>
                              <dt>Contact links</dt>
                              <dd>
                                {c.page.phone.length} phone;{" "}
                                {c.page.email.length} email
                              </dd>
                            </div>
                          </dl>
                          {i > 0 && c.page.description && !home.description && (
                            <p className="hg-comparison-note">
                              This competitor has a visible meta description;
                              your starting page lacks one.
                            </p>
                          )}
                          <p className="hg-source">
                            Source: website crawl · one starting page
                          </p>
                        </>
                      ) : (
                        <p>
                          {"error" in c
                            ? c.error
                            : "Data unavailable from the current source."}
                        </p>
                      )}
                    </section>
                  ),
                )}
              </div>
            ) : (
              <div className="hg-empty">
                <h3>No competitors supplied.</h3>
                <p>
                  Add up to three competitor websites under optional details and
                  run a new audit.
                </p>
              </div>
            )}
            <p className="hg-note hg-spaced">
              These observations do not predict who will outrank whom.
              Starting-page word and link counts are not site-wide counts, and
              no competitor traffic or backlink data has been inferred.
            </p>
          </>
        )}
        {tab === "Data & tools" && (
          <>
            <div className="hg-section-title">
              <div>
                <h2>Useful tools. Clear sources.</h2>
                <p>
                  Measured data stays separate from AI suggestions and
                  unavailable metrics.
                </p>
              </div>
            </div>
            <section className="hg-panel">
              <div className="hg-section-title">
                <div>
                  <h3>Google PageSpeed Insights</h3>
                  <p>
                    {features.pagespeed
                      ? "Run a real mobile Lighthouse test through the configured Google API."
                      : "The PageSpeed API is not configured. The audit’s performance category only measures observable HTML signals."}
                  </p>
                </div>
                <button
                  className="hg-button hg-button-outline"
                  disabled={!features.pagespeed || psiBusy}
                  onClick={pageSpeed}
                >
                  <Zap size={16} />
                  {psiBusy ? "Running Google test…" : "Run PageSpeed Test"}
                </button>
              </div>
              {psi.length > 0 && (
                <div className="hg-psi-grid">
                  {psi.map((m) => (
                    <div key={m.key}>
                      <strong>
                        {m.value ?? "—"}
                        <small>{m.unit || ""}</small>
                      </strong>
                      <span>{m.label}</span>
                      <p>{m.source}</p>
                    </div>
                  ))}
                </div>
              )}
            </section>
            <section className="hg-panel hg-spaced">
              <h3>Advanced SEO metrics</h3>
              <div className="hg-metrics-grid">
                {report.metrics
                  .filter((m) => m.value === null)
                  .map((m) => (
                    <div key={m.key}>
                      <span>{m.label}</span>
                      <strong>Unavailable</strong>
                      <p>Data unavailable from the current source.</p>
                    </div>
                  ))}
              </div>
              <p className="hg-note">
                Authorized Search Console and GA4 totals are available through the staff dashboard when configured. Backlink and keyword datasets are not connected.
              </p>
            </section>
            <div className="hg-spaced">
              <Tools
                signed={signed}
                features={features}
                onAI={(task, fields) => runAI(task, undefined, fields)}
              />
            </div>
            <section className="hg-panel hg-spaced">
              <h3>Agency report & exports</h3>
              <p>
                Personalize the PDF cover. Every report retains “Powered by
                HaadinGlobal AI SEO Analyzer.”
              </p>
              <div className="hg-form-grid">
                <label>
                  Client name
                  <input
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    maxLength={100}
                    placeholder="Optional"
                  />
                </label>
                <label>
                  Agency name
                  <input
                    value={agencyName}
                    onChange={(e) => setAgencyName(e.target.value)}
                    maxLength={100}
                    placeholder={brand.agency}
                  />
                </label>
              </div>
              <div className="hg-export-buttons">
                {(["pdf", "csv", "json"] as const).map((format) => (
                  <button
                    key={format}
                    className="hg-button hg-button-outline"
                    disabled={!!exporting}
                    onClick={() => download(format)}
                  >
                    <Download size={16} />
                    {exporting === format ? "Preparing…" : format.toUpperCase()}
                  </button>
                ))}
              </div>
              <p className="hg-note">
                Reports are not stored in a public database. Export this session
                within 24 hours; leaving or refreshing the page clears the
                report. No shareable report URL or email delivery is enabled.
              </p>
            </section>
          </>
        )}
      </div>
      <details className="hg-coverage-details">
        <summary>
          <Info size={17} /> Audit coverage, methodology & limitations{" "}
          <ChevronDown size={16} />
        </summary>
        <div>
          <p>
            <strong>Report ID:</strong> {report.id}
          </p>
          {report.coverage.map((c) => (
            <p key={c}>• {c}</p>
          ))}
          <p>Robots: {report.robots.detail}</p>
          <p>Sitemap: {report.sitemap.detail}</p>
          <p>
            Category weights:{" "}
            {report.scores
              .map((s) => `${categoryLabels[s.category]} ${s.weight}`)
              .join(" · ")}
            . See the methodology below.
          </p>
          {report.warnings.map((w) => (
            <p key={w} className="hg-warning-note">
              {w}
            </p>
          ))}
        </div>
      </details>
      <section className="hg-help-banner">
        <div>
          <span className="hg-eyebrow">FOUND SEO ISSUES?</span>
          <h2>Let’s turn findings into progress.</h2>
          <p>
            Let HaadinGlobal help you fix them, one useful improvement at a
            time.
          </p>
        </div>
        <div>
          <a href={brand.seo} className="hg-button hg-button-gold">
            Get SEO Help <ArrowUpRight size={17} />
          </a>
          <a
            href={brand.whatsapp}
            target="_blank"
            rel="noopener noreferrer"
            className="hg-help-link"
          >
            Talk on WhatsApp <ArrowUpRight size={14} />
          </a>
          <a href={brand.contact} className="hg-help-link">
            Request Professional Audit <ArrowUpRight size={14} />
          </a>
        </div>
      </section>
      {modal && (
        <Modal title={modal} onClose={() => setModal(null)}>
          {aiBusy ? (
            <div role="status" className="hg-ai-wait">
              <Sparkles size={28} />
              <h3>Working from your page evidence…</h3>
              <p>
                The configured AI provider is generating suggestions. Your
                measured score will stay unchanged.
              </p>
            </div>
          ) : aiError ? (
            <div className="hg-error" role="alert">
              {aiError}
            </div>
          ) : guidance ? (
            <Guidance guidance={guidance} />
          ) : null}
        </Modal>
      )}
    </section>
  );
}
function GlobeMini() {
  return (
    <span aria-hidden="true" className="hg-tiny-globe">
      ↗
    </span>
  );
}
