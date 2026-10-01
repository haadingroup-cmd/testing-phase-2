"use client";

import Link from "next/link";
import { useState } from "react";
import { Icon } from "@/components/ui/Icon";
import { SERVICE_CATEGORIES } from "@/content/services";
import { cn, formatPKR, priceUnitLabel } from "@/lib/utils";
import { whatsappLink } from "@/lib/whatsapp";
import type { ServiceData } from "@/types";

type Props = { services: ServiceData[]; whatsapp: string; deepDiveSlugs: Record<string, string> };

/** Stitch services hub: category pills + service cards. */
export function ServiceCatalog({ services, whatsapp, deepDiveSlugs }: Props) {
  const [category, setCategory] = useState<string>("all");
  const visible = category === "all" ? services : services.filter((s) => s.category === category);

  return (
    <>
      <div role="group" aria-label="Filter services by category" className="no-scrollbar -mx-margin-mobile flex items-center gap-space-xs overflow-x-auto px-margin-mobile py-space-sm md:mx-0 md:flex-wrap md:px-0">
        {SERVICE_CATEGORIES.map((c) => {
          const count = c.value === "all" ? services.length : services.filter((s) => s.category === c.value).length;
          const active = category === c.value;
          return (
            <button
              key={c.value}
              type="button"
              aria-pressed={active}
              onClick={() => setCategory(c.value)}
              className={cn(
                "shrink-0 rounded-full px-space-md py-2 font-label-md text-label-md transition-all",
                active ? "bg-secondary text-on-secondary shadow-sm" : "bg-surface-container-lowest text-on-surface-variant hover:bg-surface-container",
              )}
            >
              {c.label}
              {c.value === "all" ? ` (${count})` : ""}
            </button>
          );
        })}
      </div>

      <div className="mt-space-md grid gap-space-md md:grid-cols-2 xl:grid-cols-3" aria-live="polite">
        {visible.map((s) => {
          const deepDive = deepDiveSlugs[s.slug];
          return (
            <article key={s.slug} className="group flex flex-col rounded-xl bg-surface-container-lowest p-space-md shadow-sm transition-all hover:shadow-md">
              <div className="flex items-start justify-between gap-space-xs">
                <div className="flex min-w-0 items-center gap-space-sm">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-surface-container-high text-secondary">
                    <Icon name={s.icon} size={26} />
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-headline-sm text-headline-sm text-on-surface">
                      <Link href={`/services/${s.slug}`} className="hover:text-secondary">
                        {s.title}
                      </Link>
                    </h3>
                    <span className="font-label-eyebrow text-label-eyebrow uppercase text-secondary">{s.tagline}</span>
                  </div>
                </div>
                <div className="shrink-0 text-right">
                  <span className="block font-headline-sm text-headline-sm font-bold text-secondary">{formatPKR(s.price)}</span>
                  <span className="font-label-md text-label-md text-on-surface-variant">{priceUnitLabel(s.priceUnit)}</span>
                </div>
              </div>
              <p className="mt-space-sm font-body-sm text-body-sm text-on-surface-variant">{s.shortDescription}</p>
              <div className="mt-space-sm flex flex-wrap gap-1.5 pt-space-xs">
                {s.highlights.map((h) => (
                  <span key={h} className="rounded-full bg-surface-container px-2 py-0.5 font-label-md text-label-md text-on-surface">
                    {h}
                  </span>
                ))}
              </div>
              <div className="mt-auto flex items-center gap-space-xs pt-space-md">
                <Link
                  href={deepDive ? `#${deepDive}` : `/services/${s.slug}`}
                  className="flex-1 rounded-lg bg-surface-container px-3 py-2.5 text-center font-label-md text-label-md font-semibold text-secondary transition-colors hover:bg-surface-container-high"
                >
                  Service Scope
                </Link>
                <a
                  href={whatsappLink(s.whatsappMessage ?? `Hi HaadinGlobal, I'm interested in ${s.title}.`, whatsapp)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-1.5 rounded-lg bg-secondary px-4 py-2.5 font-label-md text-label-md font-semibold text-on-secondary shadow-sm transition-colors hover:bg-primary-container"
                >
                  <span>{s.ctaLabel}</span>
                  <Icon name="arrow_forward" size={16} />
                </a>
              </div>
            </article>
          );
        })}
      </div>
    </>
  );
}
