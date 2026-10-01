"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import type { z } from "zod";
import { Field, Honeypot, Input, Select } from "@/components/forms/fields";
import { FormError, SubmitButton } from "@/components/forms/FormFeedback";
import { useApiForm } from "@/components/forms/useApiForm";
import { useStartedAt } from "@/components/forms/useStartedAt";
import { Icon } from "@/components/ui/Icon";
import { AUDIT_SECTORS, auditRequestSchema } from "@/lib/validations/audit";

type FormIn = z.input<typeof auditRequestSchema>;
type FormOut = z.output<typeof auditRequestSchema>;

const PHASES = ["Fetching your page", "Checking technical SEO", "Reviewing content & on-page SEO", "Measuring performance signals", "Scoring social, accessibility & conversion"];

/** Real website audit: submits to /api/audit, then opens the saved report. */
export function AuditForm({ defaultUrl = "", tone = "dark" }: { defaultUrl?: string; tone?: "light" | "dark" }) {
  const router = useRouter();
  const startedAt = useStartedAt();
  const [phase, setPhase] = useState(0);
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<FormIn, unknown, FormOut>({
    resolver: zodResolver(auditRequestSchema),
    defaultValues: { url: defaultUrl, phone: "", email: "", sector: "", company_fax: "" },
  });
  const { status, message, submit } = useApiForm<FormIn, { id: string }>("/api/audit", setError);
  const running = status === "submitting";

  // Progress messaging while the (real) audit runs on the server.
  useEffect(() => {
    if (!running) return;
    const timer = setInterval(() => setPhase((p) => Math.min(p + 1, PHASES.length - 1)), 1800);
    return () => {
      clearInterval(timer);
      setPhase(0);
    };
  }, [running]);

  return (
    <form
      noValidate
      className="relative space-y-3"
      onSubmit={handleSubmit(async (values) => {
        const result = await submit({ ...values, startedAt: startedAt.current });
        if (result?.id) router.push(`/audit/report/${result.id}`);
      })}
    >
      <Honeypot {...register("company_fax")} />
      <Field id="a-url" label="Website URL" tone={tone} icon="link" error={errors.url?.message} required>
        <Input id="a-url" tone={tone} hasIcon type="url" inputMode="url" placeholder="https://yourbrand.com" invalid={Boolean(errors.url)} {...register("url")} />
      </Field>
      <div className="grid gap-3 sm:grid-cols-2">
        <Field id="a-phone" label="WhatsApp or Direct Phone" tone={tone} icon="phone_iphone" error={errors.phone?.message} hint="Optional — so we can walk you through the fixes">
          <Input id="a-phone" tone={tone} hasIcon type="tel" inputMode="tel" autoComplete="tel" placeholder="+92 300 1234567 / +971..." invalid={Boolean(errors.phone)} {...register("phone")} />
        </Field>
        <Field id="a-sector" label="Business Scale & Sector" tone={tone} icon="domain" error={errors.sector?.message}>
          <Select id="a-sector" tone={tone} hasIcon {...register("sector")}>
            <option value="">Select category</option>
            {AUDIT_SECTORS.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </Select>
        </Field>
      </div>
      <Field id="a-email" label="Email (optional)" tone={tone} icon="mail" error={errors.email?.message}>
        <Input id="a-email" tone={tone} hasIcon type="email" autoComplete="email" placeholder="you@company.com" invalid={Boolean(errors.email)} {...register("email")} />
      </Field>
      <FormError tone={tone} message={status === "error" ? message : null} />
      <SubmitButton submitting={running} submittingLabel="Running Diagnostics...">
        <Icon name="speed" size={18} />
        <span>Run Free Website Audit</span>
      </SubmitButton>
      {running ? (
        <div role="status" className="space-y-3 rounded-lg bg-primary-container/80 p-4 backdrop-blur-md">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Icon name="refresh" size={20} className="animate-spin text-accent-gold-light" />
              <span className="font-label-md text-label-md text-on-primary">{PHASES[phase]}...</span>
            </div>
            <span className="font-label-eyebrow text-label-eyebrow uppercase text-electric-blue">
              Step {phase + 1}/{PHASES.length}
            </span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-surface-container-high">
            <div className="h-full rounded-full bg-accent-gold-light transition-all duration-700" style={{ width: `${((phase + 1) / PHASES.length) * 90}%` }} />
          </div>
          <p className="text-center font-body-sm text-body-sm italic text-on-primary-container">This usually takes 5–20 seconds.</p>
        </div>
      ) : null}
    </form>
  );
}
