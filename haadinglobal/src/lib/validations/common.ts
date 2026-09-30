import { z } from "zod";

/** Collapse whitespace and strip control characters from free text. */
export function cleanText(value: string): string {
  return value
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "")
    .replace(/[ \t]+/g, " ")
    .trim();
}

export const text = (min: number, max: number, label: string) =>
  z
    .string({ error: `${label} is required` })
    .transform(cleanText)
    .pipe(
      z
        .string()
        .min(min, min <= 1 ? `${label} is required` : `${label} must be at least ${min} characters`)
        .max(max, `${label} must be at most ${max} characters`),
    );

export const optionalText = (max: number, label: string) =>
  z
    .string()
    .optional()
    .transform((v) => (v ? cleanText(v) : ""))
    .pipe(z.string().max(max, `${label} must be at most ${max} characters`))
    .transform((v) => v || undefined);

export const phoneSchema = z
  .string({ error: "Phone number is required" })
  .transform(cleanText)
  .pipe(
    z
      .string()
      .min(1, "Phone number is required")
      .max(25, "Phone number is too long")
      .regex(/^\+?[\d\s\-().]+$/, "Use digits, spaces and an optional leading +")
      .refine((v) => {
        const digits = v.replace(/\D/g, "").length;
        return digits >= 7 && digits <= 15;
      }, "Enter a valid phone number with country code"),
  );

export const emailSchema = z
  .string({ error: "Email is required" })
  .trim()
  .toLowerCase()
  .pipe(z.email("Enter a valid email address").max(160));

export const optionalEmailSchema = z
  .string()
  .trim()
  .toLowerCase()
  .optional()
  .transform((v) => v || undefined)
  .pipe(z.email("Enter a valid email address").max(160).optional());

/** Accepts "example.com" or a full URL; normalises to https:// when no scheme is given. */
export const optionalWebsiteSchema = z
  .string()
  .trim()
  .max(300, "Website is too long")
  .optional()
  .transform((v) => {
    if (!v) return undefined;
    return /^https?:\/\//i.test(v) ? v : `https://${v}`;
  })
  .refine((v) => {
    if (!v) return true;
    try {
      const url = new URL(v);
      return (url.protocol === "http:" || url.protocol === "https:") && url.hostname.includes(".");
    } catch {
      return false;
    }
  }, "Enter a valid website address");

/** Anti-spam fields sent by every public form. */
export const antiSpamSchema = z.object({
  // Honeypot: hidden from humans, bots tend to fill it.
  company_fax: z.string().max(200).optional(),
  // Epoch ms when the form was rendered.
  startedAt: z.coerce.number().int().nonnegative().optional(),
});
