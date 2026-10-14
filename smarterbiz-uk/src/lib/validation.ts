import { z } from "zod";

const email = z
  .string()
  .trim()
  .toLowerCase()
  .min(5, "Please enter a valid email address.")
  .max(254, "Email address is too long.")
  .email("Please enter a valid email address.");

// Removes control characters (except newlines/tabs in long text) to keep stored data clean.
const cleanLine = (max: number, min = 1, label = "This field") =>
  z
    .string()
    .trim()
    .transform((s) => s.replace(/[\u0000-\u001F\u007F]/g, ""))
    .pipe(z.string().min(min, `${label} is required.`).max(max, `${label} is too long.`));

const cleanText = (max: number, min: number, label: string) =>
  z
    .string()
    .trim()
    .transform((s) => s.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, ""))
    .pipe(z.string().min(min, `${label} is too short.`).max(max, `${label} is too long.`));

// Honeypot: real users never see or fill this field.
// Accept any value here; the route silently discards the submission if it is non-empty.
const honeypot = z.string().max(500).optional().default("");
// Time the form was rendered (ms epoch) — bots submit instantly.
const startedAt = z.number().int().positive().optional();

export const subscribeSchema = z.object({
  email,
  source: z.string().trim().max(60).regex(/^[a-z0-9\-/]*$/i).optional().default("site"),
  website: honeypot,
  startedAt,
});

export const contactSchema = z.object({
  name: cleanLine(100, 2, "Name"),
  email,
  subject: z.enum(["general", "editorial", "correction", "partnership", "press"]),
  message: cleanText(5000, 20, "Message"),
  website: honeypot,
  startedAt,
});

export const submitToolSchema = z.object({
  toolName: cleanLine(100, 2, "Tool name"),
  toolUrl: z
    .string()
    .trim()
    .max(300)
    .url("Please enter a valid URL.")
    .refine((u) => /^https:\/\//i.test(u), "URL must start with https://"),
  category: cleanLine(60, 2, "Category"),
  contactName: cleanLine(100, 2, "Your name"),
  email,
  description: cleanText(2000, 30, "Description"),
  ukPricing: cleanLine(200, 0, "UK pricing").optional().default(""),
  website: honeypot,
  startedAt,
});

export const searchSchema = z.object({
  q: z.string().trim().min(1).max(80),
});

export type SubscribeInput = z.infer<typeof subscribeSchema>;
export type ContactInput = z.infer<typeof contactSchema>;
export type SubmitToolInput = z.infer<typeof submitToolSchema>;
