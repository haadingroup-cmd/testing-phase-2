"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Icon } from "@/components/ui/Icon";
import { cn } from "@/lib/utils";
import type { CaseStudyData } from "@/types";

export const CASE_FILTERS = [
  { value: "all", label: "All Highlights", tags: [] as string[] },
  { value: "meta", label: "Meta Ads", tags: ["meta"] },
  { value: "google", label: "Google Ads", tags: ["google"] },
  { value: "seo", label: "SEO & Local", tags: ["seo"] },
  { value: "ecommerce", label: "eCommerce", tags: ["ecommerce"] },
  { value: "gulf", label: "Gulf Markets", tags: ["gulf"] },
  { value: "web", label: "Web & AI", tags: ["web", "ai"] },
  { value: "tiktok", label: "TikTok Ads", tags: ["tiktok"] },
];

const SERVICE_ICON: Array<[RegExp, string]> = [
  [/meta|facebook/i, "ads_click"],
  [/google/i, "campaign"],
  [/seo/i, "manage_search"],
  [/tiktok/i, "play_circle"],
  [/shopify|ecommerce/i, "shopping_bag"],
  [/software|web/i, "code"],
];

function serviceIcon(service: string) {
  return SERVICE_ICON.find(([re]) => re.test(service))?.[1] ?? "verified";
}

/** Stitch "Proof Over Promises" card stack with filters and expandable metrics. */
export function CaseStudyList({ studies }: { studies: CaseStudyData[] }) {
  const [filter, setFilter] = useState("all");
  const [open, setOpen] = useState<string | null>(null);
  const filters = CASE_FILTERS.filter((f) => f.value === "all" || studies.some((s) => s.tags.some((t) => f.tags.includes(t))));
  const active = CASE_FILTERS.find((f) => f.value === filter) ?? CASE_FILTERS[0];
  const visible = filter === "all" ? studies : studies.filter((s) => s.tags.some((t) => active.tags.includes(t)));

  return (
    <>
      <div role="group" aria-label="Filter case studies" className="no-scrollbar -mx-margin-mobile flex items-center gap-2 overflow-x-auto px-margin-mobile pb-1 pt-space-md md:mx-0 md:flex-wrap md:px-0">
        {filters.map((f) => (
          <button
            key={f.value}
            type="button"
            aria-pressed={filter === f.value}
            onClick={() => setFilter(f.value)}
            className={cn(
              "shrink-0 rounded-full px-4 py-2 font-label-md text-label-md transition-all active:scale-95",
              filter === f.value ? "bg-secondary text-on-secondary shadow-sm" : "bg-surface-container-high text-on-surface-variant hover:bg-surface-variant",
            )}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className="mt-space-lg grid gap-space-lg md:grid-cols-2 xl:grid-cols-3" aria-live="polite">
        {visible.map((study) => {
          const expanded = open === study.slug;
          const panelId = `metrics-${study.slug}`;
          return (
            <article key={study.slug} className="flex flex-col gap-4 rounded-xl bg-surface-container-lowest p-5 shadow-md transition-all duration-300">
              <div className="relative h-44 w-full overflow-hidden rounded-lg bg-surface-container">
                {study.coverImage ? (
                  <Image src={study.coverImage} alt={`${study.title} — results screenshot`} fill sizes="(min-width: 1280px) 400px, (min-width: 768px) 50vw, 100vw" className="object-cover object-top" />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-primary-container via-[#0f2d5c] to-secondary" aria-hidden="true">
                    <Icon name={serviceIcon(study.service)} size={56} className="text-on-primary/30" />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-primary-container/85 via-transparent to-transparent" />
                <div className="absolute left-3 top-3 flex items-center gap-1.5 rounded-full bg-surface-container-lowest/90 px-2.5 py-1 backdrop-blur-md">
                  <span className="h-2 w-2 rounded-full bg-secondary" />
                  <span className="font-label-eyebrow text-label-eyebrow uppercase text-primary">{study.country}</span>
                </div>
                <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between gap-2">
                  <div className="flex min-w-0 flex-col">
                    <span className="font-label-eyebrow text-label-eyebrow uppercase text-accent-gold-light">{study.headlineLabel ?? study.industry}</span>
                    <span className="truncate font-headline-md text-headline-md font-bold text-on-primary">{study.headlineValue ?? study.client}</span>
                  </div>
                  {study.liveUrl ? (
                    <span className="shrink-0 rounded bg-electric-blue/30 px-2 py-0.5 font-label-md text-label-md font-bold text-secondary-fixed">Live site</span>
                  ) : null}
                </div>
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Icon name={serviceIcon(study.service)} size={18} className="text-secondary" />
                  <span className="font-label-md text-label-md font-semibold text-secondary">{study.service}</span>
                </div>
                <h2 className="font-headline-sm text-headline-sm font-bold tracking-tight text-on-surface">
                  <Link href={`/results/${study.slug}`} className="hover:text-secondary">
                    {study.title}
                  </Link>
                </h2>
                {study.isPlaceholder ? (
                  <span className="inline-block rounded bg-tertiary-fixed px-2 py-0.5 font-label-md text-label-md text-on-tertiary-fixed-variant">Placeholder — awaiting verified data</span>
                ) : null}
              </div>
              <div className="grid grid-cols-1 gap-2.5 rounded-lg bg-surface-container-low p-3">
                <div className="flex items-start gap-2">
                  <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-error-container text-error">
                    <Icon name="warning" size={14} />
                  </div>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">
                    <strong className="font-semibold text-on-surface">Bottleneck:</strong> {study.problem}
                  </p>
                </div>
                <div className="flex items-start gap-2">
                  <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-surface-container-highest text-secondary">
                    <Icon name="lightbulb" size={14} />
                  </div>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">
                    <strong className="font-semibold text-on-surface">Execution:</strong> {study.strategy}
                  </p>
                </div>
              </div>
              <div className="mt-auto flex items-center justify-between gap-2 pt-1">
                <div className="flex min-w-0 items-center gap-2">
                  <Icon name="verified" size={20} filled className="text-accent-gold-light" />
                  <span className="truncate font-label-md text-label-md text-on-surface-variant">{study.client}</span>
                </div>
                {study.metrics.length ? (
                  <button
                    type="button"
                    aria-expanded={expanded}
                    aria-controls={panelId}
                    onClick={() => setOpen(expanded ? null : study.slug)}
                    className="flex shrink-0 items-center gap-1 font-label-md text-label-md font-bold text-secondary hover:underline"
                  >
                    <span>View Metrics</span>
                    <Icon name="expand_more" size={16} className={cn("transition-transform duration-200", expanded && "rotate-180")} />
                  </button>
                ) : (
                  <Link href={`/results/${study.slug}`} className="flex shrink-0 items-center gap-1 font-label-md text-label-md font-bold text-secondary hover:underline">
                    Details <Icon name="arrow_forward" size={16} />
                  </Link>
                )}
              </div>
              {study.metrics.length ? (
                <div id={panelId} hidden={!expanded} className="space-y-2">
                  <div className="space-y-2 rounded-lg bg-surface-container p-3">
                    {study.metrics.map((m) => (
                      <div key={m.label} className="flex items-center justify-between gap-2 font-body-sm text-body-sm">
                        <span className="text-on-surface-variant">{m.label}</span>
                        <span className="text-right font-bold text-on-surface">{m.value}</span>
                      </div>
                    ))}
                  </div>
                  <Link href={`/results/${study.slug}`} className="inline-flex items-center gap-1 font-label-md text-label-md font-bold text-secondary hover:underline">
                    See screenshots & full case study <Icon name="arrow_forward" size={16} />
                  </Link>
                </div>
              ) : null}
            </article>
          );
        })}
      </div>
      {visible.length === 0 ? (
        <p className="mt-space-lg rounded-xl bg-surface-container-low p-space-lg text-center text-on-surface-variant">No case studies in this category yet.</p>
      ) : null}
    </>
  );
}
