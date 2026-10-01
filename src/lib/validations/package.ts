import { z } from "zod";
import { CALCULATOR } from "@/content/calculator";
import { antiSpamSchema, optionalEmailSchema, optionalText, phoneSchema, text } from "@/lib/validations/common";

const stageIds = CALCULATOR.stages.map((s) => s.id) as [string, ...string[]];
const horizonIds = CALCULATOR.horizons.map((h) => h.id) as [string, ...string[]];

export const packageRequestSchema = z
  .object({
    name: text(2, 120, "Name"),
    phone: phoneSchema,
    email: optionalEmailSchema,
    business: optionalText(120, "Business"),
    message: optionalText(2000, "Notes"),
    services: z
      .array(z.string().regex(/^[a-z0-9-]{1,80}$/))
      .min(1, "Select at least one service")
      .max(20)
      .refine((list) => new Set(list).size === list.length, "Duplicate services"),
    stage: z.enum(stageIds, { error: "Select a business stage" }),
    horizon: z.enum(horizonIds, { error: "Select an engagement horizon" }),
  })
  .extend(antiSpamSchema.shape);

export type PackageRequestInput = z.input<typeof packageRequestSchema>;
