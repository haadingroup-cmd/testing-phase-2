import { z } from "zod";
import {
  antiSpamSchema,
  emailSchema,
  optionalEmailSchema,
  optionalText,
  optionalWebsiteSchema,
  phoneSchema,
  text,
} from "@/lib/validations/common";

export const BUDGET_OPTIONS = [
  "PKR 30k – 75k (Starter)",
  "PKR 75k – 200k (Growth Tier)",
  "PKR 200k – 500k+ (Enterprise Tier)",
  "$1,000 – $3,000 (GCC / Global)",
  "$3,000+ (High Velocity Scale)",
  "Not sure yet",
] as const;

export const OBJECTIVE_OPTIONS = [
  "Meta Ads (Scaling ROAS)",
  "Google Ads & Performance Max",
  "SEO & Organic Growth",
  "Full-Stack Web Development",
  "AI Automation & CRM Pipelines",
  "Complete Digital Transformation Retainer",
] as const;

/** Full contact form (/contact). */
export const contactSchema = z
  .object({
    source: z.literal("CONTACT"),
    name: text(2, 100, "Name"),
    email: emailSchema,
    phone: phoneSchema,
    business: optionalText(120, "Business"),
    website: optionalWebsiteSchema,
    service: optionalText(120, "Service"),
    budget: optionalText(80, "Budget"),
    message: text(10, 3000, "Message"),
  })
  .extend(antiSpamSchema.shape);

/** Short consultation / audit intake used on the homepage (Stitch "Priority Intake"). */
export const consultationSchema = z
  .object({
    source: z.literal("CONSULTATION"),
    name: text(2, 120, "Name"),
    phone: phoneSchema,
    email: optionalEmailSchema,
    service: optionalText(120, "Objective"),
    budget: optionalText(80, "Budget"),
    message: optionalText(2000, "Message"),
  })
  .extend(antiSpamSchema.shape);

export const leadSchema = z.discriminatedUnion("source", [contactSchema, consultationSchema]);

export type ContactInput = z.input<typeof contactSchema>;
export type ConsultationInput = z.input<typeof consultationSchema>;
export type LeadInput = z.output<typeof leadSchema>;
