"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import type { z } from "zod";
import { Field, Honeypot, Input, Textarea } from "@/components/forms/fields";
import { FormError, FormSuccess, SubmitButton } from "@/components/forms/FormFeedback";
import { useApiForm } from "@/components/forms/useApiForm";
import { useStartedAt } from "@/components/forms/useStartedAt";
import { Icon } from "@/components/ui/Icon";
import { CALCULATOR, calculateEstimate, type BuilderService, type HorizonId, type StageId } from "@/content/calculator";
import { cn, formatPKR, formatUSD } from "@/lib/utils";
import { whatsappLink } from "@/lib/whatsapp";
import { packageRequestSchema } from "@/lib/validations/package";

type FormIn = z.input<typeof packageRequestSchema>;
type FormOut = z.output<typeof packageRequestSchema>;

const DEFAULT_SELECTION = ["meta-ads", "seo"];

/** Stitch "Interactive Architecture Engine" — real calculation from shared config, server re-verified. */
export function PackageBuilder({ services, whatsapp, email }: { services: BuilderService[]; whatsapp: string; email: string }) {
  const [selected, setSelected] = useState<string[]>(() => DEFAULT_SELECTION.filter((slug) => services.some((s) => s.slug === slug)));
  const [stage, setStage] = useState<StageId>("startup");
  const [horizon, setHorizon] = useState<HorizonId>("1m");
  const [showForm, setShowForm] = useState(false);

  const chosen = useMemo(() => services.filter((s) => selected.includes(s.slug)), [services, selected]);
  const estimate = useMemo(() => calculateEstimate(chosen, stage, horizon), [chosen, stage, horizon]);
  const stageInfo = CALCULATOR.stages.find((s) => s.id === stage)!;
  const horizonInfo = CALCULATOR.horizons.find((h) => h.id === horizon)!;

  const toggle = (slug: string) => setSelected((prev) => (prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug]));

  const summaryText = [
    `Hello HaadinGlobal Team! I used your package builder:`,
    ``,
    `• Services (${chosen.length}): ${chosen.map((s) => s.label).join(", ")}`,
    `• Business stage: ${stageInfo.label} (${stageInfo.multiplier}x)`,
    `• Engagement: ${horizonInfo.label}`,
    `• Total discount: ${Math.round(estimate.discountRate * 100)}%`,
    `• Estimate: ${formatPKR(estimate.monthlyPkr)}/month (~${formatUSD(estimate.monthlyUsd)} USD)`,
    ``,
    `Please confirm scope and timelines.`,
  ].join("\n");

  return (
    <div id="package-builder" className="scroll-mt-24 rounded-2xl bg-surface-container-lowest p-space-md shadow-lg lg:p-space-xl">
      <div className="grid gap-space-lg lg:grid-cols-12">
        <div className="space-y-space-lg lg:col-span-7">
          <div className="space-y-space-xs">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-surface-container-high px-2.5 py-1 font-label-eyebrow text-label-eyebrow font-bold uppercase tracking-widest text-secondary">
              <Icon name="calculate" size={14} /> Interactive Architecture Engine
            </span>
            <h2 className="font-headline-md text-headline-md font-bold tracking-tight text-on-surface">Build Your Custom Digital Growth Package</h2>
            <p className="font-body-sm text-body-sm text-on-surface-variant">
              Select exactly what your business requires. The estimate updates instantly from our published prices.
            </p>
          </div>

          <fieldset className="space-y-space-sm">
            <div className="flex items-center justify-between">
              <legend className="flex items-center gap-1.5 font-label-lg text-label-lg font-bold text-on-surface">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-secondary font-label-md text-label-md text-on-secondary">1</span>
                Select Strategic Capabilities
              </legend>
              <span className="rounded-full bg-surface-container px-2 py-0.5 font-label-md text-label-md font-semibold text-secondary" aria-live="polite">
                {chosen.length} Selected
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
              {services.map((s) => {
                const on = selected.includes(s.slug);
                return (
                  <button
                    key={s.slug}
                    type="button"
                    aria-pressed={on}
                    onClick={() => toggle(s.slug)}
                    className={cn(
                      "group flex flex-col justify-between rounded-xl p-2.5 text-left transition-all duration-200 active:scale-[0.98]",
                      on ? "bg-surface-container shadow-sm ring-1 ring-secondary/30" : "bg-surface-container-low hover:bg-surface-container",
                    )}
                  >
                    <div className="flex w-full items-center justify-between">
                      <Icon name={s.icon} size={20} className="text-secondary" />
                      <span className={cn("flex h-4 w-4 items-center justify-center rounded-full", on ? "bg-secondary text-on-secondary" : "bg-surface-variant text-transparent")}>
                        <Icon name="done" size={12} />
                      </span>
                    </div>
                    <div className="mt-2">
                      <div className="font-label-md text-label-md font-semibold text-on-surface group-hover:text-secondary">{s.label}</div>
                      <div className="font-body-sm text-body-sm font-medium text-on-surface-variant">+{formatPKR(s.price)}</div>
                    </div>
                  </button>
                );
              })}
            </div>
          </fieldset>

          <fieldset className="space-y-space-sm">
            <legend className="flex items-center gap-1.5 font-label-lg text-label-lg font-bold text-on-surface">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-secondary font-label-md text-label-md text-on-secondary">2</span>
              Define Scale &amp; Market Velocity
            </legend>
            <div className="grid grid-cols-3 gap-2">
              {CALCULATOR.stages.map((s) => (
                <button
                  key={s.id}
                  type="button"
                  aria-pressed={stage === s.id}
                  onClick={() => setStage(s.id)}
                  className={cn(
                    "flex flex-col items-center gap-1 rounded-xl p-2.5 text-center font-label-md text-label-md font-bold transition-all",
                    stage === s.id ? "bg-surface-container text-secondary shadow-sm" : "bg-surface-container-low text-on-surface hover:bg-surface-container",
                  )}
                >
                  <Icon name={s.icon} size={20} />
                  <span>{s.label}</span>
                  <span className="font-body-sm text-body-sm font-normal text-on-surface-variant">{s.note}</span>
                </button>
              ))}
            </div>
          </fieldset>

          <fieldset className="space-y-space-sm">
            <legend className="flex items-center gap-1.5 font-label-lg text-label-lg font-bold text-on-surface">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-secondary font-label-md text-label-md text-on-secondary">3</span>
              Engagement Horizon
            </legend>
            <div className="grid grid-cols-3 gap-2">
              {CALCULATOR.horizons.map((h) => (
                <button
                  key={h.id}
                  type="button"
                  aria-pressed={horizon === h.id}
                  onClick={() => setHorizon(h.id)}
                  className={cn(
                    "rounded-xl p-2 text-center font-label-md text-label-md font-bold transition-all",
                    horizon === h.id ? "bg-surface-container text-secondary shadow-sm" : "bg-surface-container-low text-on-surface hover:bg-surface-container",
                  )}
                >
                  {h.label}
                  <span className={cn("block font-body-sm text-body-sm", h.discount ? "font-semibold text-secondary" : "font-normal text-on-surface-variant")}>{h.note}</span>
                </button>
              ))}
            </div>
          </fieldset>
        </div>

        <div className="lg:col-span-5">
          <div className="relative flex flex-col gap-space-sm overflow-hidden rounded-xl bg-primary-container p-space-md text-on-primary shadow-xl lg:sticky lg:top-24">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-electric-blue" />
                <span className="font-label-eyebrow text-label-eyebrow font-bold uppercase tracking-wider text-secondary-fixed">Execution Calculation</span>
              </div>
              {estimate.discountRate > 0 ? (
                <span className="rounded-full bg-accent-gold-light/20 px-2 py-0.5 font-label-eyebrow text-label-eyebrow font-bold uppercase text-accent-gold-light">
                  {estimate.bundleApplied ? "Bundle discount active" : "Commitment discount"}
                </span>
              ) : null}
            </div>
            <div className="flex flex-col gap-0.5 pt-1" aria-live="polite">
              <div className="flex flex-wrap items-baseline justify-between gap-x-2">
                <span className="font-headline-md text-headline-md font-bold tracking-tight">{formatPKR(estimate.monthlyPkr)}</span>
                <span className="font-headline-sm text-headline-sm font-semibold text-secondary-fixed">≈ {formatUSD(estimate.monthlyUsd)} USD</span>
              </div>
              <p className="font-body-sm text-body-sm text-on-primary-container">
                {chosen.length === 0
                  ? "No capabilities selected yet. Pick from the list to build your custom package."
                  : `Per month · ${chosen.length} service${chosen.length > 1 ? "s" : ""} (${chosen
                      .slice(0, 3)
                      .map((s) => s.label)
                      .join(", ")}${chosen.length > 3 ? "…" : ""}) scaled for a ${stageInfo.label.toLowerCase()} business.`}
              </p>
            </div>
            <dl className="grid grid-cols-2 gap-x-3 gap-y-1 rounded-lg bg-primary/40 p-2.5 font-body-sm text-body-sm">
              <dt className="text-on-primary-container">Subtotal</dt>
              <dd className="text-right">{formatPKR(estimate.subtotal)}</dd>
              <dt className="text-on-primary-container">Stage multiplier</dt>
              <dd className="text-right">{estimate.multiplier}x</dd>
              <dt className="text-on-primary-container">Discount</dt>
              <dd className="text-right">{Math.round(estimate.discountRate * 100)}%</dd>
              <dt className="text-on-primary-container">{horizonInfo.label} total</dt>
              <dd className="text-right font-bold text-accent-gold-light">{formatPKR(estimate.totalPkr)}</dd>
            </dl>
            <div className="flex flex-col gap-2 pt-2">
              <a
                href={chosen.length ? whatsappLink(summaryText, whatsapp) : undefined}
                aria-disabled={chosen.length === 0}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(
                  "flex w-full items-center justify-center gap-2 rounded-lg bg-accent-gold-light py-3 text-center font-label-lg text-label-lg font-bold text-obsidian shadow transition-all hover:bg-tertiary-fixed-dim",
                  chosen.length === 0 && "pointer-events-none opacity-50",
                )}
              >
                <Icon name="chat" size={20} /> Send Package via WhatsApp
              </a>
              <button
                type="button"
                disabled={chosen.length === 0}
                onClick={() => setShowForm(true)}
                aria-expanded={showForm}
                className="flex w-full items-center justify-center gap-1.5 rounded-lg bg-surface-container-low/20 py-2.5 text-center font-label-md text-label-md font-semibold text-on-primary transition-all hover:bg-surface-container-low/30 disabled:opacity-50"
              >
                <Icon name="description" size={18} /> Submit Official Package Request
              </button>
            </div>
            {showForm && chosen.length > 0 ? (
              <PackageRequestForm services={selected} stage={stage} horizon={horizon} whatsapp={whatsapp} summary={summaryText} onClose={() => setShowForm(false)} />
            ) : null}
            <p className="font-body-sm text-body-sm text-on-primary-container">
              Estimates use our published starting prices and are confirmed after a free scoping call. Questions? <a className="underline" href={`mailto:${email}`}>{email}</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function PackageRequestForm({
  services,
  stage,
  horizon,
  whatsapp,
  summary,
  onClose,
}: {
  services: string[];
  stage: StageId;
  horizon: HorizonId;
  whatsapp: string;
  summary: string;
  onClose: () => void;
}) {
  const startedAt = useStartedAt();
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<FormIn, unknown, FormOut>({
    resolver: zodResolver(packageRequestSchema),
    defaultValues: { name: "", phone: "", email: "", business: "", message: "", services, stage, horizon, company_fax: "" },
  });
  const { status, message, submit, result } = useApiForm<FormIn, { id: string; monthlyPkr: number }>("/api/package-request", setError);

  if (status === "success" && result) {
    return (
      <FormSuccess
        tone="dark"
        body={`We've saved your package request (${formatPKR(result.monthlyPkr)}/month estimate). A strategist will confirm scope and timelines within 24 hours.`}
        whatsappNumber={whatsapp}
        whatsappMessage={summary}
        onReset={onClose}
      />
    );
  }

  return (
    <form
      noValidate
      className="relative space-y-space-sm rounded-lg bg-on-primary/5 p-space-sm"
      onSubmit={handleSubmit((values) => submit({ ...values, services, stage, horizon, startedAt: startedAt.current }))}
    >
      <Honeypot {...register("company_fax")} />
      <Field id="p-name" label="Name" tone="dark" error={errors.name?.message} required>
        <Input id="p-name" tone="dark" autoComplete="name" invalid={Boolean(errors.name)} {...register("name")} />
      </Field>
      <Field id="p-phone" label="WhatsApp / Phone" tone="dark" error={errors.phone?.message} required>
        <Input id="p-phone" tone="dark" type="tel" inputMode="tel" autoComplete="tel" placeholder="+92 300 1234567" invalid={Boolean(errors.phone)} {...register("phone")} />
      </Field>
      <Field id="p-email" label="Email" tone="dark" error={errors.email?.message}>
        <Input id="p-email" tone="dark" type="email" autoComplete="email" invalid={Boolean(errors.email)} {...register("email")} />
      </Field>
      <Field id="p-business" label="Business" tone="dark" error={errors.business?.message}>
        <Input id="p-business" tone="dark" autoComplete="organization" {...register("business")} />
      </Field>
      <Field id="p-notes" label="Notes (optional)" tone="dark" error={errors.message?.message}>
        <Textarea id="p-notes" tone="dark" rows={3} {...register("message")} />
      </Field>
      {errors.services?.message ? <FormError tone="dark" message={errors.services.message} /> : null}
      <FormError tone="dark" message={status === "error" ? message : null} />
      <SubmitButton submitting={status === "submitting"}>
        Submit Request <Icon name="arrow_forward" size={18} />
      </SubmitButton>
    </form>
  );
}
