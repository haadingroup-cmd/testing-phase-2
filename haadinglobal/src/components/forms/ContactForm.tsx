"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import type { z } from "zod";
import { Field, Honeypot, Input, Select, Textarea } from "@/components/forms/fields";
import { FormError, FormSuccess, SubmitButton } from "@/components/forms/FormFeedback";
import { useApiForm } from "@/components/forms/useApiForm";
import { useStartedAt } from "@/components/forms/useStartedAt";
import { Icon } from "@/components/ui/Icon";
import { BUDGET_OPTIONS, contactSchema } from "@/lib/validations/lead";

type FormIn = z.input<typeof contactSchema>;
type FormOut = z.output<typeof contactSchema>;

export function ContactForm({ services, whatsapp, defaultService }: { services: string[]; whatsapp: string; defaultService?: string }) {
  const startedAt = useStartedAt();
  const {
    register,
    handleSubmit,
    setError,
    reset: resetForm,
    getValues,
    formState: { errors },
  } = useForm<FormIn, unknown, FormOut>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      source: "CONTACT",
      name: "",
      email: "",
      phone: "",
      business: "",
      website: "",
      service: defaultService && services.includes(defaultService) ? defaultService : "",
      budget: "",
      message: "",
      company_fax: "",
    },
  });
  const { status, message, submit, reset } = useApiForm<FormIn, { id: string }>("/api/leads", setError);

  if (status === "success") {
    return (
      <FormSuccess
        body="A strategist will review your enquiry and reply within 24 hours (usually much sooner). For the fastest response, continue the conversation on WhatsApp."
        whatsappNumber={whatsapp}
        whatsappMessage={`Hello HaadinGlobal, I just sent an enquiry via your website (${getValues("name")}). ${getValues("service") ? `Service: ${getValues("service")}.` : ""}`}
        onReset={() => {
          reset();
          resetForm();
        }}
      />
    );
  }

  return (
    <form noValidate className="relative space-y-space-sm" onSubmit={handleSubmit((values) => submit({ ...values, startedAt: startedAt.current }))}>
      <input type="hidden" {...register("source")} />
      <Honeypot {...register("company_fax")} />
      <div className="grid gap-space-sm sm:grid-cols-2">
        <Field id="f-name" label="Name" error={errors.name?.message} required>
          <Input id="f-name" autoComplete="name" placeholder="Your full name" invalid={Boolean(errors.name)} {...register("name")} />
        </Field>
        <Field id="f-email" label="Email" error={errors.email?.message} required>
          <Input id="f-email" type="email" autoComplete="email" placeholder="you@company.com" invalid={Boolean(errors.email)} {...register("email")} />
        </Field>
        <Field id="f-phone" label="Phone / WhatsApp" error={errors.phone?.message} required>
          <Input id="f-phone" type="tel" inputMode="tel" autoComplete="tel" placeholder="+92 300 1234567" invalid={Boolean(errors.phone)} {...register("phone")} />
        </Field>
        <Field id="f-business" label="Business" error={errors.business?.message}>
          <Input id="f-business" autoComplete="organization" placeholder="Company or brand name" invalid={Boolean(errors.business)} {...register("business")} />
        </Field>
        <Field id="f-website" label="Website" error={errors.website?.message}>
          <Input id="f-website" type="url" inputMode="url" autoComplete="url" placeholder="yourbrand.com" invalid={Boolean(errors.website)} {...register("website")} />
        </Field>
        <Field id="f-service" label="Service" error={errors.service?.message}>
          <Select id="f-service" {...register("service")}>
            <option value="">Select a service</option>
            {services.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
            <option value="Not sure — need advice">Not sure — need advice</option>
          </Select>
        </Field>
      </div>
      <Field id="f-budget" label="Monthly budget" error={errors.budget?.message}>
        <Select id="f-budget" {...register("budget")}>
          <option value="">Select a range</option>
          {BUDGET_OPTIONS.map((o) => (
            <option key={o} value={o}>
              {o}
            </option>
          ))}
        </Select>
      </Field>
      <Field id="f-message" label="Message" error={errors.message?.message} hint="Tell us about your goals, current challenges and timeline (min. 10 characters)." required>
        <Textarea id="f-message" rows={5} placeholder="What would you like to achieve?" invalid={Boolean(errors.message)} {...register("message")} />
      </Field>
      <FormError message={status === "error" ? message : null} />
      <SubmitButton submitting={status === "submitting"}>
        <span>Send Enquiry</span>
        <Icon name="arrow_forward" size={18} />
      </SubmitButton>
      <p className="text-center font-body-sm text-body-sm text-on-surface-variant">
        We only use your details to reply to this enquiry. See our <a href="/privacy-policy" className="text-secondary underline">privacy policy</a>.
      </p>
    </form>
  );
}
