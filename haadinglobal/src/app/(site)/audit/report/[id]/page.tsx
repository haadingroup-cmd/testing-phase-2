import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Container } from "@/components/ui/Container";
import { Icon } from "@/components/ui/Icon";
import { getAuditReport } from "@/lib/audit/store";
import { scoreTone } from "@/lib/audit/score";
import type { AuditCheck, CheckStatus } from "@/lib/audit/types";
import { getSettings } from "@/lib/data";
import { hasDatabase } from "@/lib/db";
import { cn, formatDate } from "@/lib/utils";
import { whatsappLink } from "@/lib/whatsapp";

export const dynamic = "force-dynamic";

export const metadata: Metadata = { title: "Website Audit Report", robots: { index: false, follow: false } };

const STATUS: Record<CheckStatus, { label: string; icon: string; chip: string }> = {
  pass: { label: "Pass", icon: "check_circle", chip: "bg-[#e3f6ea] text-[#16803d]" },
  warning: { label: "Warning", icon: "warning", chip: "bg-tertiary-fixed text-on-tertiary-fixed-variant" },
  error: { label: "Error", icon: "error", chip: "bg-error-container text-on-error-container" },
};

const TONE = {
  good: "text-[#16803d]",
  ok: "text-[#b46e00]",
  poor: "text-error",
};

const ORDER: Record<CheckStatus, number> = { error: 0, warning: 1, pass: 2 };

function CheckRow({ check }: { check: AuditCheck }) {
  const s = STATUS[check.status];
  return (
    <li className="rounded-xl bg-surface-container-lowest p-space-md shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <h3 className="font-label-lg text-label-lg text-on-surface">{check.title}</h3>
        <span className={cn("inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 font-label-md text-label-md", s.chip)}>
          <Icon name={s.icon} size={14} filled /> {s.label}
        </span>
      </div>
      {check.value ? <p className="mt-1 break-words font-body-sm text-body-sm text-on-surface-variant">{check.value}</p> : null}
      {check.status !== "pass" ? (
        <div className="mt-space-sm grid gap-2 md:grid-cols-2">
          <div className="rounded-lg bg-surface-container-low p-space-sm">
            <span className="font-label-eyebrow text-label-eyebrow uppercase text-on-surface-variant">Why it matters</span>
            <p className="font-body-sm text-body-sm text-on-surface">{check.why}</p>
          </div>
          <div className="rounded-lg bg-surface-container-high/50 p-space-sm">
            <span className="font-label-eyebrow text-label-eyebrow uppercase text-secondary">How to fix it</span>
            <p className="font-body-sm text-body-sm text-on-surface">{check.fix}</p>
          </div>
        </div>
      ) : null}
    </li>
  );
}

export default async function AuditReportPage({ params }: { params: Promise<{ id: string }> }) {
  if (!hasDatabase) notFound();
  const { id } = await params;
  const [audit, settings] = await Promise.all([getAuditReport(id), getSettings()]);
  if (!audit) notFound();
  const { report } = audit;
  const tone = scoreTone(report.score);
  const issues = report.checks.filter((c) => c.status !== "pass").length;

  return (
    <>
      <Container as="section" className="pb-space-md pt-space-md lg:pt-12">
        <div className="grid gap-space-md rounded-2xl bg-primary-container p-space-lg text-on-primary shadow-xl lg:grid-cols-12 lg:items-center lg:p-space-xl">
          <div className="space-y-space-xs lg:col-span-8">
            <span className="font-label-eyebrow text-label-eyebrow uppercase tracking-widest text-accent-gold-light">Website Audit Report</span>
            <h1 className="break-all font-headline-md text-headline-md font-bold">{new URL(report.finalUrl).hostname}</h1>
            <p className="break-all font-body-sm text-body-sm text-on-primary-container">
              {report.finalUrl} · analysed {formatDate(report.fetchedAt)} · HTTP {report.httpStatus} · {report.responseTimeMs} ms
            </p>
            <div className="flex flex-col gap-2 pt-space-sm sm:flex-row">
              <a href={`/api/audit/${audit.id}/pdf`} className="flex items-center justify-center gap-2 rounded-lg bg-accent-gold-light px-space-md py-3 font-label-lg text-label-lg font-bold text-obsidian hover:bg-tertiary-fixed-dim">
                <Icon name="download" size={18} /> Download PDF Report
              </a>
              <a
                href={whatsappLink(`Hello HaadinGlobal, I ran your website audit for ${report.finalUrl} (score ${report.score}/100). Can you help me fix the issues?`, settings.whatsapp)}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 rounded-lg bg-whatsapp px-space-md py-3 font-label-lg text-label-lg font-bold text-white"
              >
                <Icon name="chat" size={18} /> Get help fixing {issues} issue{issues === 1 ? "" : "s"}
              </a>
            </div>
          </div>
          <div className="flex items-center gap-space-md lg:col-span-4 lg:justify-end">
            <div className="relative h-32 w-32">
              <svg viewBox="0 0 36 36" className="h-full w-full -rotate-90" aria-hidden="true">
                <circle cx="18" cy="18" r="15.9" fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="3" />
                <circle cx="18" cy="18" r="15.9" fill="none" stroke="#F4C96B" strokeWidth="3" strokeLinecap="round" strokeDasharray={`${report.score} 100`} />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="font-headline-lg-mobile text-headline-lg-mobile font-bold">{report.score}</span>
                <span className="font-label-md text-label-md text-on-primary-container">/ 100</span>
              </div>
            </div>
            <p className="sr-only">Overall score {report.score} out of 100</p>
          </div>
        </div>
      </Container>

      <Container as="section" className="py-space-md">
        <h2 className="mb-space-sm font-headline-sm text-headline-sm font-bold text-on-surface">Category scores</h2>
        <div className="grid grid-cols-2 gap-space-sm md:grid-cols-4 xl:grid-cols-7">
          {report.categories.map((c) => (
            <a key={c.id} href={`#cat-${c.id}`} className="rounded-2xl bg-surface-container-lowest p-space-md shadow-sm hover:shadow-level-2">
              <span className={cn("block font-headline-md text-headline-md font-bold", TONE[scoreTone(c.score)])}>{c.score}</span>
              <span className="block font-label-md text-label-md text-on-surface">{c.label}</span>
              <span className="font-body-sm text-body-sm text-on-surface-variant">
                {c.pass}✓ · {c.warning}! · {c.error}✕
              </span>
            </a>
          ))}
        </div>
        <p className={cn("mt-space-sm font-body-sm text-body-sm", TONE[tone])}>
          {tone === "good" ? "Strong foundations — focus on the remaining warnings." : tone === "ok" ? "Solid start, with clear quick wins below." : "Several important issues are holding this page back. Start with the errors."}
        </p>
      </Container>

      {report.categories.map((c) => (
        <Container as="section" key={c.id} id={`cat-${c.id}`} className="scroll-mt-24 py-space-md">
          <h2 className="mb-space-sm flex items-center gap-2 font-headline-sm text-headline-sm font-bold text-on-surface">
            {c.label} <span className={cn("font-label-lg text-label-lg", TONE[scoreTone(c.score)])}>{c.score}/100</span>
          </h2>
          <ul className="space-y-space-sm">
            {report.checks
              .filter((check) => check.category === c.id)
              .sort((a, b) => ORDER[a.status] - ORDER[b.status])
              .map((check) => (
                <CheckRow key={check.id} check={check} />
              ))}
          </ul>
        </Container>
      ))}

      <Container as="section" className="py-space-lg">
        <div className="rounded-2xl bg-surface-container-low p-space-md">
          <h2 className="font-label-lg text-label-lg text-on-surface">Scope &amp; limitations</h2>
          <ul className="mt-space-xs list-disc space-y-1 pl-5 font-body-sm text-body-sm text-on-surface-variant">
            {report.limitations.map((l) => (
              <li key={l}>{l}</li>
            ))}
          </ul>
          <Link href="/audit" className="mt-space-sm inline-flex items-center gap-1 font-label-lg text-label-lg text-secondary hover:underline">
            <Icon name="refresh" size={16} /> Audit another page
          </Link>
        </div>
      </Container>
    </>
  );
}
