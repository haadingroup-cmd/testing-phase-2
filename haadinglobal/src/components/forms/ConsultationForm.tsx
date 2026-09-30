"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import type { z } from "zod";
import { Field, Honeypot, Input, Select } from "@/components/forms/fields";
import { FormError, FormSuccess, SubmitButton } from "@/components/forms/FormFeedback";
import { useApiForm } from "@/components/forms/useApiForm";
import { useStartedAt } from "@/components/forms/useStartedAt";
import { Icon } from "@/components/ui/Icon";
import { BUDGET_OPTIONS, OBJECTIVE_OPTIONS, consultationSchema } from "@/lib/validations/lead";

type FormIn = z.input<typeof consultationSchema>;
type FormOut = z.output<typeof consultationSchema>;

/** Stitch "Priority Intake — Book Your Free Strategy Audit" form. */
export function ConsultationForm({ whatsapp }: { whatsapp: string }) {
  const startedAt = useStartedAt();
  const {
    register,
    handleSubmit,
    setError,
    reset: resetForm,
    getValues,
    formState: { errors },
  } = useForm<FormIn, unknown, FormOut>({
    resolver: zodResolver(consultationSchema),
    defaultValues: { source: "CONSULTATION", name: "", phone: "", service: OBJECTIVE_OPTIONS[0], budget: BUDGET_OPTIONS[0], company_fax: "" },
  });
  const { status, message, submit, reset } = useApiForm<FormIn, { id: string }>("/api/leads", setError);

  if (status === "success") {
    const name = getValues("name");
    return (
      <FormSuccess
        body="Our team will review your digital footprint and reach out on WhatsApp within 24 hours. Want to speed things up? Message us now."
        whatsappNumber={whatsapp}
        whatsappMessage={`Hello HaadinGlobal, I just requested a free strategy audit${name ? ` (${name})` : ""}. Objective: ${getValues("service") ?? ""}.`}
        onReset={() => {
          reset();
          resetForm();
        }}
      />
    );
  }

  return (
    <form
      noValidate
      className="relative space-y-space-sm"
      onSubmit={handleSubmit((values) => submit({ ...values, startedAt: startedAt.current }))}
    >
      <input type="hidden" {...register("source")} />
      <Honeypot {...register("company_fax")} />
      <Field id="c-name" label="Full Name or Company" error={errors.name?.message} required>
        <Input id="c-name" autoComplete="name" placeholder="e.g. Tariq Khan / Apex Retail" invalid={Boolean(errors.name)} {...register("name")} />
      </Field>
      <Field id="c-phone" label="WhatsApp Number (with country code)" error={errors.phone?.message} required>
        <Input id="c-phone" type="tel" autoComplete="tel" inputMode="tel" placeholder="+92 300 1234567" invalid={Boolean(errors.phone)} {...register("phone")} />
      </Field>
      <Field id="c-objective" label="Primary Growth Objective" error={errors.service?.message}>
        <Select id="c-objective" {...register("service")}>
          {OBJECTIVE_OPTIONS.map((o) => (
            <option key={o}>{o}</option>
          ))}
        </Select>
      </Field>
      <Field id="c-budget" label="Estimated Monthly Marketing Budget" error={errors.budget?.message}>
        <Select id="c-budget" {...register("budget")}>
          {BUDGET_OPTIONS.map((o) => (
            <option key={o}>{o}</option>
          ))}
        </Select>
      </Field>
      <FormError message={status === "error" ? message : null} />
      <SubmitButton submitting={status === "submitting"} className="mt-space-sm">
        <span>Claim Free Performance Audit</span>
        <Icon name="verified" size={18} />
      </SubmitButton>
    </form>
  );
}
