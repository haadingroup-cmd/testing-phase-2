import type {
  BlogPost,
  CaseStudy,
  FAQ,
  PricingPlan,
  Service,
} from "@/generated/prisma/client";
import type {
  BlogPostData,
  CaseStudyData,
  FaqData,
  GalleryImage,
  Metric,
  PricingPlanData,
  ProcessStep,
  QA,
  ServiceData,
} from "@/types";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function asArray<T>(value: unknown, pick: (item: Record<string, unknown>) => T | null): T[] {
  if (!Array.isArray(value)) return [];
  return value.flatMap((item) => {
    if (!isRecord(item)) return [];
    const mapped = pick(item);
    return mapped ? [mapped] : [];
  });
}

const str = (v: unknown) => (typeof v === "string" ? v : "");

export const toProcess = (v: unknown): ProcessStep[] =>
  asArray(v, (i) => (str(i.title) ? { title: str(i.title), description: str(i.description) } : null));

export const toQA = (v: unknown): QA[] =>
  asArray(v, (i) => (str(i.question) ? { question: str(i.question), answer: str(i.answer) } : null));

export const toMetrics = (v: unknown): Metric[] =>
  asArray(v, (i) => (str(i.label) ? { label: str(i.label), value: str(i.value) } : null));

export const toGallery = (v: unknown): GalleryImage[] =>
  asArray(v, (i) => (str(i.src) ? { src: str(i.src), caption: str(i.caption) } : null));

export function mapService(s: Service): ServiceData {
  return {
    slug: s.slug,
    title: s.title,
    tagline: s.tagline,
    category: s.category,
    icon: s.icon,
    shortDescription: s.shortDescription,
    description: s.description,
    price: s.price,
    priceUnit: s.priceUnit,
    highlights: s.highlights,
    features: s.features,
    benefits: s.benefits,
    process: toProcess(s.process),
    faqs: toQA(s.faqs),
    ctaLabel: s.ctaLabel,
    whatsappMessage: s.whatsappMessage,
    seoTitle: s.seoTitle,
    seoDescription: s.seoDescription,
    image: s.image,
    featured: s.featured,
    inBuilder: s.inBuilder,
    builderLabel: s.builderLabel,
    sortOrder: s.sortOrder,
  };
}

export function mapPlan(p: PricingPlan): PricingPlanData {
  return {
    slug: p.slug,
    name: p.name,
    eyebrow: p.eyebrow,
    description: p.description,
    price: p.price,
    billingPeriod: p.billingPeriod,
    projectDiscount: p.projectDiscount,
    features: p.features,
    serviceLimits: p.serviceLimits,
    popular: p.popular,
    variant: p.variant,
    ctaLabel: p.ctaLabel,
    whatsappMessage: p.whatsappMessage,
    sortOrder: p.sortOrder,
  };
}

export function mapPost(p: BlogPost): BlogPostData {
  return {
    slug: p.slug,
    title: p.title,
    excerpt: p.excerpt,
    content: p.content,
    coverImage: p.coverImage,
    category: p.category,
    tags: p.tags,
    author: p.author,
    readTime: p.readTime,
    featured: p.featured,
    publishedAt: p.publishedAt ? p.publishedAt.toISOString() : null,
    updatedAt: p.updatedAt.toISOString(),
    seoTitle: p.seoTitle,
    seoDescription: p.seoDescription,
  };
}

export function mapCaseStudy(c: CaseStudy): CaseStudyData {
  const ba = isRecord(c.beforeAfter) ? { before: str(c.beforeAfter.before), after: str(c.beforeAfter.after) } : null;
  return {
    slug: c.slug,
    title: c.title,
    client: c.client,
    industry: c.industry,
    country: c.country,
    service: c.service,
    tags: c.tags,
    problem: c.problem,
    strategy: c.strategy,
    result: c.result,
    headlineValue: c.headlineValue,
    headlineLabel: c.headlineLabel,
    metrics: toMetrics(c.metrics),
    beforeAfter: ba && (ba.before || ba.after) ? ba : null,
    coverImage: c.coverImage,
    gallery: toGallery(c.gallery),
    liveUrl: c.liveUrl,
    isPlaceholder: c.isPlaceholder,
    sortOrder: c.sortOrder,
  };
}

export function mapFaq(f: FAQ): FaqData {
  return { id: f.id, question: f.question, answer: f.answer, category: f.category, sortOrder: f.sortOrder };
}
