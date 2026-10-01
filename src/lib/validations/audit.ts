import { z } from "zod";
import { antiSpamSchema, optionalEmailSchema, phoneSchema } from "@/lib/validations/common";

export const AUDIT_SECTORS = [
  { value: "ecommerce", label: "Direct-to-Consumer / eCommerce" },
  { value: "b2b", label: "B2B Manufacturing & Wholesale" },
  { value: "healthcare", label: "Healthcare & Professional Clinic" },
  { value: "realestate", label: "Real Estate & Construction" },
  { value: "saas", label: "SaaS, Technology & Services" },
  { value: "other", label: "Other" },
] as const;

const sectorValues = AUDIT_SECTORS.map((s) => s.value) as [string, ...string[]];

/**
 * Only public http(s) URLs with a real hostname are accepted. Private
 * network targets are additionally rejected after DNS resolution
 * (see src/lib/audit/safe-fetch.ts).
 */
export const auditUrlSchema = z
  .string({ error: "Website URL is required" })
  .trim()
  .min(4, "Website URL is required")
  .max(2048, "URL is too long")
  .transform((v) => (/^[a-z][a-z0-9+.-]*:/i.test(v) ? v : `https://${v}`))
  .superRefine((value, ctx) => {
    let url: URL;
    try {
      url = new URL(value);
    } catch {
      ctx.addIssue({ code: "custom", message: "Enter a valid website URL" });
      return;
    }
    if (url.protocol !== "http:" && url.protocol !== "https:") {
      ctx.addIssue({ code: "custom", message: "Only http and https URLs can be audited" });
    }
    if (url.username || url.password) {
      ctx.addIssue({ code: "custom", message: "URLs with credentials are not allowed" });
    }
    if (url.port && url.port !== "80" && url.port !== "443") {
      ctx.addIssue({ code: "custom", message: "Only standard ports (80/443) are supported" });
    }
    const host = url.hostname.toLowerCase();
    if (!host.includes(".") || host.endsWith(".local") || host.endsWith(".internal") || host === "localhost") {
      ctx.addIssue({ code: "custom", message: "Enter a public website address" });
    }
  });

export const auditRequestSchema = z
  .object({
    url: auditUrlSchema,
    phone: phoneSchema.optional().or(z.literal("").transform(() => undefined)),
    email: optionalEmailSchema,
    sector: z.enum(sectorValues).optional().or(z.literal("").transform(() => undefined)),
  })
  .extend(antiSpamSchema.shape);

export type AuditRequestInput = z.input<typeof auditRequestSchema>;
