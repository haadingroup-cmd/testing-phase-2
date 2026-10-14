import type { Metadata } from "next";
import { SITE, absoluteUrl } from "./site";
import type { Comparison, Faq, Guide, Tool } from "./types";
import { plain } from "./content";

interface PageMetaInput {
  title: string;
  description: string;
  path: string;
  keywords?: readonly string[];
  type?: "website" | "article";
  publishedTime?: string;
  modifiedTime?: string;
  noindex?: boolean;
  absoluteTitle?: boolean;
}

/** Trim to a SERP-friendly length on a word boundary. */
export const clip = (s: string, max = 158) => {
  if (s.length <= max) return s;
  const cut = s.slice(0, max - 1);
  return `${cut.slice(0, cut.lastIndexOf(" ")).replace(/[,;:—-]+$/, "")}…`;
};

const DEFAULT_OG = { url: "/opengraph-image", width: 1200, height: 630, alt: `${SITE.name} — ${SITE.tagline}` };

export function pageMetadata(input: PageMetaInput): Metadata {
  const url = absoluteUrl(input.path);
  const description = clip(input.description);
  return {
    title: input.absoluteTitle ? { absolute: input.title } : input.title,
    description,
    keywords: input.keywords ? [...input.keywords] : undefined,
    alternates: { canonical: url, languages: { "en-GB": url, "x-default": url } },
    robots: input.noindex ? { index: false, follow: true } : undefined,
    openGraph: {
      type: input.type ?? "website",
      url,
      title: input.title,
      description,
      siteName: SITE.name,
      // File-based opengraph-image routes (guides/tools/compare) take precedence over this default.
      images: [DEFAULT_OG],
      locale: SITE.locale,
      ...(input.type === "article"
        ? { publishedTime: input.publishedTime, modifiedTime: input.modifiedTime, authors: [SITE.author.name] }
        : {}),
    },
    twitter: { card: "summary_large_image", title: input.title, description, images: [DEFAULT_OG.url] },
  };
}

// ---------- JSON-LD builders (schema.org) ----------

const orgId = `${SITE.url}/#organization`;
const siteId = `${SITE.url}/#website`;

export function organizationLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": orgId,
    name: SITE.name,
    ...(SITE.legalName ? { legalName: SITE.legalName } : {}),
    url: SITE.url,
    logo: { "@type": "ImageObject", url: absoluteUrl("/logo.svg"), width: 240, height: 48 },
    description: SITE.description,
    email: SITE.email,
    address: { "@type": "PostalAddress", addressLocality: SITE.address.locality, addressCountry: SITE.address.country },
    areaServed: { "@type": "Country", name: "United Kingdom" },
    knowsAbout: ["Artificial intelligence", "Business software", "UK GDPR", "Making Tax Digital", "SaaS procurement"],
    ...(SITE.social.length ? { sameAs: SITE.social } : {}),
  };
}

export function websiteLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": siteId,
    url: SITE.url,
    name: SITE.name,
    description: SITE.description,
    inLanguage: SITE.language,
    publisher: { "@id": orgId },
    potentialAction: {
      "@type": "SearchAction",
      target: { "@type": "EntryPoint", urlTemplate: `${SITE.url}/search?q={search_term_string}` },
      "query-input": "required name=search_term_string",
    },
  };
}

export function breadcrumbLd(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.name,
      item: absoluteUrl(it.path),
    })),
  };
}

export function faqLd(faqs: Faq[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: plain(f.a) },
    })),
  };
}

const authorLd = () => ({
  "@type": "Organization",
  name: SITE.author.name,
  url: absoluteUrl("/about"),
});

export function articleLd(g: Guide) {
  const url = absoluteUrl(`/guides/${g.slug}`);
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    "@id": `${url}#article`,
    headline: g.title,
    description: g.description,
    abstract: g.quickAnswer,
    url,
    mainEntityOfPage: url,
    image: absoluteUrl(`/guides/${g.slug}/opengraph-image`),
    datePublished: g.published,
    dateModified: g.updated,
    inLanguage: SITE.language,
    keywords: g.keywords.join(", "),
    articleSection: g.kicker,
    author: authorLd(),
    publisher: { "@id": orgId },
    isPartOf: { "@id": siteId },
    speakable: { "@type": "SpeakableSpecification", cssSelector: ["[data-speakable]"] },
  };
}

export function toolLd(t: Tool) {
  const url = absoluteUrl(`/tools/${t.slug}`);
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "@id": `${url}#software`,
    name: t.name,
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web, Windows, macOS, iOS, Android",
    description: t.summary,
    url: t.website,
    image: absoluteUrl(`/tools/${t.slug}/opengraph-image`),
    publisher: { "@type": "Organization", name: t.vendor },
    ...(t.pricing.freePlan ? { offers: { "@type": "Offer", price: "0", priceCurrency: "GBP", description: "Free plan available" } } : {}),
    review: {
      "@type": "Review",
      name: `${t.name} review for UK small businesses`,
      url,
      author: authorLd(),
      publisher: { "@id": orgId },
      datePublished: SITE.lastUpdated,
      reviewBody: t.review.join(" "),
      reviewRating: { "@type": "Rating", ratingValue: t.score.toFixed(1), bestRating: "10", worstRating: "0" },
      positiveNotes: { "@type": "ItemList", itemListElement: t.pros.map((p, i) => ({ "@type": "ListItem", position: i + 1, name: p })) },
      negativeNotes: { "@type": "ItemList", itemListElement: t.cons.map((p, i) => ({ "@type": "ListItem", position: i + 1, name: p })) },
    },
  };
}

export function itemListLd(name: string, items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name,
    numberOfItems: items.length,
    itemListElement: items.map((it, i) => ({ "@type": "ListItem", position: i + 1, name: it.name, url: absoluteUrl(it.path) })),
  };
}

export function comparisonLd(c: Comparison, aName: string, bName: string) {
  const url = absoluteUrl(`/compare/${c.slug}`);
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    "@id": `${url}#article`,
    headline: c.title,
    description: c.description,
    abstract: c.verdict,
    url,
    mainEntityOfPage: url,
    image: absoluteUrl(`/compare/${c.slug}/opengraph-image`),
    datePublished: c.published,
    dateModified: c.updated,
    inLanguage: SITE.language,
    about: [
      { "@type": "SoftwareApplication", name: aName, applicationCategory: "BusinessApplication" },
      { "@type": "SoftwareApplication", name: bName, applicationCategory: "BusinessApplication" },
    ],
    author: authorLd(),
    publisher: { "@id": orgId },
  };
}
