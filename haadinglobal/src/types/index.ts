/**
 * Shared, framework-agnostic domain types. The Prisma models are the source
 * of truth in the database; these types describe the shape the UI consumes
 * (JSON columns parsed, dates serialised) so pages work identically whether
 * data comes from the database or from the built-in defaults.
 */

export type ServiceCategory = "PERFORMANCE" | "TECH" | "CREATIVE";
export type PriceUnit = "MONTH" | "PROJECT";
export type PlanVariant = "STANDARD" | "POPULAR" | "PREMIUM";
export type LeadStatus = "NEW" | "CONTACTED" | "QUALIFIED" | "CONVERTED" | "LOST";
export type LeadSource = "CONTACT" | "CONSULTATION" | "PACKAGE_BUILDER" | "AUDIT";

export type ProcessStep = { title: string; description: string };
export type QA = { question: string; answer: string };

export type ServiceData = {
  slug: string;
  title: string;
  tagline: string;
  category: ServiceCategory;
  icon: string;
  shortDescription: string;
  description: string;
  price: number;
  priceUnit: PriceUnit;
  highlights: string[];
  features: string[];
  benefits: string[];
  process: ProcessStep[];
  faqs: QA[];
  ctaLabel: string;
  whatsappMessage: string | null;
  seoTitle: string | null;
  seoDescription: string | null;
  image: string | null;
  featured: boolean;
  inBuilder: boolean;
  builderLabel: string | null;
  sortOrder: number;
};

export type PricingPlanData = {
  slug: string;
  name: string;
  eyebrow: string;
  description: string;
  price: number;
  billingPeriod: string;
  projectDiscount: number;
  features: string[];
  serviceLimits: string | null;
  popular: boolean;
  variant: PlanVariant;
  ctaLabel: string;
  whatsappMessage: string | null;
  sortOrder: number;
};

export type BlogPostData = {
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  coverImage: string | null;
  category: string;
  tags: string[];
  author: string;
  readTime: string | null;
  featured: boolean;
  publishedAt: string | null;
  updatedAt: string | null;
  seoTitle: string | null;
  seoDescription: string | null;
};

export type Metric = { label: string; value: string };
export type GalleryImage = { src: string; caption: string };

export type CaseStudyData = {
  slug: string;
  title: string;
  client: string;
  industry: string;
  country: string;
  service: string;
  tags: string[];
  problem: string;
  strategy: string;
  result: string;
  headlineValue: string | null;
  headlineLabel: string | null;
  metrics: Metric[];
  beforeAfter: { before: string; after: string } | null;
  coverImage: string | null;
  gallery: GalleryImage[];
  liveUrl: string | null;
  isPlaceholder: boolean;
  sortOrder: number;
};

export type FaqData = { id?: string; question: string; answer: string; category: string; sortOrder: number };

export type Stat = { icon: string; value: string; label: string };

export type SiteSettings = {
  companyName: string;
  tagline: string;
  description: string;
  email: string;
  phone: string;
  whatsapp: string;
  whatsappMessage: string;
  address: string;
  city: string;
  region: string;
  country: string;
  founderName: string;
  founderTitle: string;
  founderImage: string;
  founderQuote: string;
  responseTime: string;
  markets: string[];
  stats: Stat[];
  social: {
    facebook: string;
    instagram: string;
    linkedin: string;
    tiktok: string;
    youtube: string;
    clutch: string;
  };
};

export type ApiSuccess<T> = { ok: true; data: T };
export type ApiError = { ok: false; error: string; fieldErrors?: Record<string, string[] | undefined> };
export type ApiResponse<T> = ApiSuccess<T> | ApiError;
