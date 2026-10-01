import { AuditForm } from "@/components/audit/AuditForm";
import { Icon } from "@/components/ui/Icon";
import { AUDIT_CATEGORIES } from "@/lib/audit/types";

export const CHECKLIST_PDF = "/downloads/haadinglobal-2026-digital-marketing-audit-checklist.pdf";

/** Stitch "How Strong Is Your Digital Presence?" lead magnet, wired to the real audit engine. */
export function AuditPromo({ headingLevel = "h2" }: { headingLevel?: "h1" | "h2" }) {
  const Heading = headingLevel;
  return (
    <div className="relative space-y-space-md overflow-hidden rounded-xl bg-primary-container p-6 text-on-primary-container shadow-xl lg:p-10">
      <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-secondary opacity-30 blur-3xl" aria-hidden="true" />
      <div className="relative z-10 grid gap-space-lg lg:grid-cols-2 lg:gap-space-xl">
        <div className="space-y-space-md">
          <div className="space-y-space-xs">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-secondary/30 px-3 py-1 font-label-eyebrow text-label-eyebrow uppercase text-secondary-fixed">
              <Icon name="troubleshoot" size={14} /> No Obligation Diagnostic
            </div>
            <Heading className="font-headline-md text-headline-md font-bold tracking-tight text-on-primary lg:text-headline-lg">How Strong Is Your Digital Presence?</Heading>
            <p className="font-body-sm text-body-sm lg:text-body-md">
              Get an objective, automated assessment of your website&apos;s technical SEO, content, speed signals, social previews, accessibility and conversion setup — with fixes for every issue.
            </p>
          </div>
          <AuditForm />
        </div>
        <div className="space-y-3">
          <span className="block font-label-eyebrow text-label-eyebrow uppercase tracking-wider text-on-primary">What the audit checks</span>
          <div className="grid grid-cols-2 gap-2.5">
            {AUDIT_CATEGORIES.map((c) => (
              <div key={c.id} className="space-y-1 rounded-lg bg-surface-container-lowest/10 p-3 backdrop-blur-md">
                <Icon name={c.icon} size={18} className="text-accent-gold-light" />
                <span className="block font-label-md text-label-md font-semibold text-on-primary">{c.label}</span>
              </div>
            ))}
            <div className="space-y-1 rounded-lg bg-surface-container-lowest/10 p-3 backdrop-blur-md">
              <Icon name="picture_as_pdf" size={18} className="text-electric-blue" />
              <span className="block font-label-md text-label-md font-semibold text-on-primary">PDF report</span>
            </div>
          </div>
          <p className="font-body-sm text-body-sm">Scores are calculated only from checks we can actually run on your page — no invented numbers.</p>
          <div className="flex items-center justify-between gap-3 rounded-xl bg-surface-container-lowest p-4 text-primary shadow-md">
            <div className="flex min-w-0 items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-surface-container-high">
                <Icon name="menu_book" size={24} className="text-secondary" />
              </div>
              <div className="flex min-w-0 flex-col">
                <span className="truncate font-label-md text-label-md font-bold">FREE Digital Marketing Audit Checklist</span>
                <span className="truncate font-body-sm text-body-sm text-outline">Instant PDF download</span>
              </div>
            </div>
            <a
              href={CHECKLIST_PDF}
              download
              className="flex shrink-0 items-center gap-1 rounded-lg bg-primary-container px-3 py-2 font-label-md text-label-md font-bold text-on-primary transition-all active:scale-95"
            >
              <Icon name="download" size={16} /> Get PDF
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
