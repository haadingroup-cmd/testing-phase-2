import { z } from "zod";

const url = z.union([z.literal(""), z.url({ protocol: /^https?$/, error: "Enter a full https:// URL" })]);

export const settingsSchema = z.object({
  companyName: z.string().trim().min(1).max(80),
  tagline: z.string().trim().max(160),
  description: z.string().trim().max(600),
  email: z.email().max(160),
  phone: z.string().trim().min(5).max(30),
  whatsapp: z.string().trim().regex(/^\d{7,15}$/, "Digits only, with country code (e.g. 923054782677)"),
  whatsappMessage: z.string().trim().min(1).max(300),
  address: z.string().trim().max(200),
  city: z.string().trim().max(80),
  region: z.string().trim().max(80),
  country: z.string().trim().max(2),
  founderName: z.string().trim().max(80),
  founderTitle: z.string().trim().max(120),
  founderImage: z.string().trim().max(500),
  founderQuote: z.string().trim().max(500),
  responseTime: z.string().trim().max(40),
  markets: z.array(z.string().trim().min(1).max(40)).max(20),
  stats: z
    .array(z.object({ icon: z.string().trim().max(40), value: z.string().trim().max(20), label: z.string().trim().max(60) }))
    .max(8),
  social: z.object({
    facebook: url,
    instagram: url,
    linkedin: url,
    tiktok: url,
    youtube: url,
    clutch: url,
  }),
});
