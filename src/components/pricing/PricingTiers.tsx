"use client";

import { useState } from "react";
import { Icon } from "@/components/ui/Icon";
import { cn, formatPKR } from "@/lib/utils";
import { whatsappLink } from "@/lib/whatsapp";
import type { PricingPlanData } from "@/types";

type Cycle = "monthly" | "project";

const VARIANT = {
  STANDARD: {
    card: "bg-surface-container-lowest shadow-sm hover:shadow-md",
    eyebrow: "text-on-surface-variant",
    name: "text-on-surface",
    price: "text-primary",
    unit: "text-on-surface-variant",
    desc: "text-on-surface-variant",
    list: "bg-surface-container-low",
    item: "text-on-surface",
    icon: "check_circle",
    iconClass: "text-secondary",
    cta: "bg-surface-container text-on-surface hover:bg-secondary hover:text-on-secondary",
    ctaIcon: "arrow_forward",
  },
  POPULAR: {
    card: "bg-surface-container-lowest shadow-md ring-1 ring-secondary/20",
    eyebrow: "text-secondary",
    name: "text-secondary",
    price: "text-secondary",
    unit: "text-on-surface-variant",
    desc: "text-on-surface",
    list: "bg-surface-container-high/40",
    item: "text-on-surface",
    icon: "verified",
    iconClass: "text-secondary",
    cta: "bg-secondary text-on-secondary shadow hover:bg-primary-container",
    ctaIcon: "bolt",
  },
  PREMIUM: {
    card: "bg-primary-container text-on-primary shadow-lg",
    eyebrow: "text-accent-gold-light",
    name: "text-on-primary",
    price: "text-accent-gold-light",
    unit: "text-on-primary-container",
    desc: "text-on-primary-container",
    list: "bg-inverse-surface",
    item: "text-on-primary",
    icon: "stars",
    iconClass: "text-accent-gold-light",
    cta: "bg-gradient-to-r from-accent-gold-light to-tertiary-fixed-dim text-obsidian shadow-md hover:opacity-95",
    ctaIcon: "workspace_premium",
  },
} as const;

/** Stitch "Verified Retainers" with the Monthly / Project billing switch. */
export function PricingTiers({ plans, whatsapp }: { plans: PricingPlanData[]; whatsapp: string }) {
  const [cycle, setCycle] = useState<Cycle>("monthly");
  const maxDiscount = Math.max(0, ...plans.map((p) => p.projectDiscount));

  return (
    <section className="flex flex-col gap-space-md py-space-md">
      <div className="flex flex-wrap items-center justify-between gap-space-sm">
        <div>
          <span className="block font-label-eyebrow text-label-eyebrow uppercase tracking-widest text-secondary">Deployment Models</span>
          <h2 className="font-headline-sm text-headline-sm font-bold text-on-surface lg:text-headline-md">Verified Retainers</h2>
        </div>
        <div role="group" aria-label="Billing cycle" className="flex items-center rounded-full bg-surface-container p-1 shadow-inner">
          <button
            type="button"
            aria-pressed={cycle === "monthly"}
            onClick={() => setCycle("monthly")}
            className={cn("rounded-full px-3 py-1 font-label-md text-label-md transition-all", cycle === "monthly" ? "bg-surface-container-lowest font-bold text-secondary shadow-sm" : "text-on-surface-variant")}
          >
            Monthly
          </button>
          <button
            type="button"
            aria-pressed={cycle === "project"}
            onClick={() => setCycle("project")}
            className={cn("flex items-center gap-1 rounded-full px-3 py-1 font-label-md text-label-md transition-all", cycle === "project" ? "bg-surface-container-lowest font-bold text-secondary shadow-sm" : "text-on-surface-variant")}
          >
            <span>Project</span>
            {maxDiscount > 0 ? <span className="rounded-full bg-accent-gold-light/20 px-1 text-[10px] font-bold text-on-tertiary-fixed">-{maxDiscount}%</span> : null}
          </button>
        </div>
      </div>

      <div className="grid gap-space-sm md:grid-cols-2 xl:grid-cols-4">
        {plans.map((plan) => {
          const v = VARIANT[plan.variant];
          const price = cycle === "monthly" ? plan.price : Math.round(plan.price * (1 - plan.projectDiscount / 100));
          const unit = cycle === "monthly" ? `/ ${plan.billingPeriod}` : "/ sprint";
          return (
            <div key={plan.slug} className={cn("relative flex flex-col gap-space-sm overflow-hidden rounded-xl p-space-md transition-all", v.card)}>
              {plan.popular ? (
                <div className="absolute right-0 top-0 flex items-center gap-1 rounded-bl-lg bg-secondary px-3 py-1 font-label-eyebrow text-label-eyebrow font-bold uppercase tracking-wider text-on-secondary">
                  <Icon name="local_fire_department" size={14} /> Most Popular
                </div>
              ) : null}
              <div className={cn("flex items-start justify-between gap-2", plan.popular && "pt-5")}>
                <div>
                  <span className={cn("font-label-eyebrow text-label-eyebrow font-bold uppercase tracking-wider", v.eyebrow)}>{plan.eyebrow}</span>
                  <h3 className={cn("font-headline-sm text-headline-sm font-bold", v.name)}>{plan.name}</h3>
                </div>
                <div className="text-right">
                  <div className={cn("font-headline-sm text-headline-sm font-bold", v.price)}>{formatPKR(price)}</div>
                  <span className={cn("font-label-md text-label-md", v.unit)}>{unit}</span>
                </div>
              </div>
              <p className={cn("font-body-sm text-body-sm", v.desc)}>{plan.description}</p>
              <ul className={cn("space-y-2 rounded-lg p-space-sm", v.list)}>
                {plan.features.map((f) => (
                  <li key={f} className={cn("flex items-start gap-2 font-body-sm text-body-sm", v.item)}>
                    <Icon name={v.icon} size={18} className={cn("mt-0.5", v.iconClass)} />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
              {plan.serviceLimits ? <p className={cn("font-label-md text-label-md", v.unit)}>{plan.serviceLimits}</p> : null}
              <a
                href={whatsappLink(`${plan.whatsappMessage ?? `Hello HaadinGlobal, I am interested in the ${plan.name} plan.`} (${cycle === "monthly" ? "monthly" : "project"} billing, ${formatPKR(price)} ${unit})`, whatsapp)}
                target="_blank"
                rel="noopener noreferrer"
                className={cn("mt-auto flex w-full items-center justify-center gap-1.5 rounded-lg py-2.5 text-center font-label-lg text-label-lg font-bold transition-all", v.cta)}
              >
                {plan.ctaLabel}
                <Icon name={v.ctaIcon} size={16} />
              </a>
            </div>
          );
        })}
      </div>
      <p className="font-body-sm text-body-sm text-on-surface-variant">
        Project billing applies the listed discount when you commit to a fixed-scope sprint. Prices exclude ad spend, which is paid directly to the ad platforms.
      </p>
    </section>
  );
}
