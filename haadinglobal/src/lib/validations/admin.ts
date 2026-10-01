import { z } from "zod";
import { ICON_NAMES } from "@/lib/icons";

const slug = z
  .string()
  .trim()
  .min(2, "Slug is required")
  .max(80)
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use lowercase letters, numbers and hyphens only");

const str = (max: number, label: string, min = 1) =>
  z.string().trim().min(min, `${label} is required`).max(max, `${label} must be at most ${max} characters`);

const optionalStr = (max: number) =>
  z
    .string()
    .trim()
    .max(max)
    .optional()
    .transform((v) => v || null);

/** Local path ("/images/x.jpg") or an https URL. */
const imagePath = z
  .string()
  .trim()
  .max(500)
  .optional()
  .transform((v) => v || null)
  .refine((v) => !v || v.startsWith("/") || /^https:\/\//.test(v), "Use a path starting with / or an https:// URL");

const lines = z
  .string()
  .optional()
  .transform((v) =>
    (v ?? "")
      .split("\n")
      .map((l) => l.trim())
      .filter(Boolean),
  );

/** "Title | Description" per line → [{ a, b }]. */
const pairs = <A extends string, B extends string>(a: A, b: B) =>
  z
    .string()
    .optional()
    .transform((v) =>
      (v ?? "")
        .split("\n")
        .map((l) => l.trim())
        .filter(Boolean)
        .map((l) => {
          const [first, ...rest] = l.split("|");
          return { [a]: first.trim(), [b]: rest.join("|").trim() } as Record<A | B, string>;
        }),
    );

const checkbox = z
  .union([z.literal("on"), z.literal("true"), z.literal(""), z.undefined(), z.null()])
  .transform((v) => v === "on" || v === "true");

const int = (label: string, min = 0, max = 100_000_000) =>
  z.coerce.number({ error: `${label} must be a number` }).int(`${label} must be a whole number`).min(min).max(max);

export const serviceInputSchema = z.object({
  slug,
  title: str(80, "Title"),
  tagline: str(80, "Tagline"),
  category: z.enum(["PERFORMANCE", "TECH", "CREATIVE"]),
  icon: z.enum(ICON_NAMES),
  shortDescription: str(300, "Short description"),
  description: str(3000, "Description"),
  price: int("Price", 0),
  priceUnit: z.enum(["MONTH", "PROJECT"]),
  highlights: lines,
  features: lines,
  benefits: lines,
  process: pairs("title", "description"),
  faqs: pairs("question", "answer"),
  ctaLabel: str(40, "CTA label"),
  whatsappMessage: optionalStr(300),
  seoTitle: optionalStr(70),
  seoDescription: optionalStr(170),
  image: imagePath,
  featured: checkbox,
  inBuilder: checkbox,
  builderLabel: optionalStr(40),
  sortOrder: int("Sort order", -1000, 1000),
  published: checkbox,
});

export const planInputSchema = z.object({
  slug,
  name: str(40, "Name"),
  eyebrow: str(40, "Eyebrow"),
  description: str(400, "Description"),
  price: int("Price", 0),
  billingPeriod: str(20, "Billing period"),
  projectDiscount: int("Project discount", 0, 90),
  features: lines,
  serviceLimits: optionalStr(120),
  popular: checkbox,
  variant: z.enum(["STANDARD", "POPULAR", "PREMIUM"]),
  ctaLabel: str(40, "CTA label"),
  whatsappMessage: optionalStr(300),
  sortOrder: int("Sort order", -1000, 1000),
  published: checkbox,
});

export const postInputSchema = z.object({
  slug,
  title: str(160, "Title"),
  excerpt: str(400, "Excerpt"),
  content: str(200_000, "Content", 20),
  coverImage: imagePath,
  category: str(40, "Category"),
  tags: z
    .string()
    .optional()
    .transform((v) =>
      (v ?? "")
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean)
        .slice(0, 12),
    ),
  author: str(80, "Author"),
  readTime: optionalStr(20),
  status: z.enum(["DRAFT", "PUBLISHED"]),
  featured: checkbox,
  publishedAt: z
    .string()
    .optional()
    .transform((v) => (v ? new Date(v) : null))
    .refine((d) => d === null || !Number.isNaN(d.getTime()), "Invalid date"),
  seoTitle: optionalStr(70),
  seoDescription: optionalStr(170),
});

export const caseStudyInputSchema = z.object({
  slug,
  title: str(160, "Title"),
  client: str(120, "Client"),
  industry: str(80, "Industry"),
  country: str(80, "Country"),
  service: str(120, "Service"),
  tags: z
    .string()
    .optional()
    .transform((v) =>
      (v ?? "")
        .split(",")
        .map((t) => t.trim().toLowerCase())
        .filter(Boolean),
    ),
  problem: str(1500, "Problem"),
  strategy: str(1500, "Strategy"),
  result: str(1500, "Result"),
  headlineValue: optionalStr(30),
  headlineLabel: optionalStr(60),
  metrics: pairs("label", "value"),
  before: optionalStr(800),
  after: optionalStr(800),
  coverImage: imagePath,
  gallery: pairs("src", "caption"),
  liveUrl: z
    .string()
    .trim()
    .optional()
    .transform((v) => v || null)
    .refine((v) => !v || /^https?:\/\//.test(v), "Use a full URL"),
  isPlaceholder: checkbox,
  published: checkbox,
  sortOrder: int("Sort order", -1000, 1000),
});

export const faqInputSchema = z.object({
  question: str(300, "Question"),
  answer: str(2000, "Answer"),
  category: str(60, "Category"),
  sortOrder: int("Sort order", -1000, 1000),
  published: checkbox,
});

export const loginSchema = z.object({
  email: z.string().trim().toLowerCase().pipe(z.email("Enter a valid email")),
  password: z.string().min(1, "Password is required").max(200),
});
