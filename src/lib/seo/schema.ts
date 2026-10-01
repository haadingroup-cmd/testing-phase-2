import { absoluteUrl, SITE_URL } from "@/lib/site";
import type { BlogPostData, QA, ServiceData, SiteSettings } from "@/types";

type Json = Record<string, unknown>;

export function organizationSchema(s: SiteSettings): Json {
  const sameAs = Object.values(s.social).filter(Boolean);
  return {
    "@context": "https://schema.org",
    "@type": ["Organization", "ProfessionalService"],
    "@id": `${SITE_URL}/#organization`,
    name: s.companyName,
    url: SITE_URL,
    logo: absoluteUrl("/logo.svg"),
    image: absoluteUrl("/opengraph-image"),
    description: s.description,
    email: s.email,
    telephone: s.phone,
    founder: { "@type": "Person", name: s.founderName, jobTitle: s.founderTitle },
    address: {
      "@type": "PostalAddress",
      addressLocality: s.city,
      addressRegion: s.region,
      addressCountry: s.country,
    },
    areaServed: s.markets,
    sameAs,
    contactPoint: {
      "@type": "ContactPoint",
      telephone: s.phone,
      email: s.email,
      contactType: "sales",
      availableLanguage: ["English", "Urdu", "Arabic"],
    },
  };
}

export function localBusinessSchema(s: SiteSettings): Json {
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": `${SITE_URL}/#localbusiness`,
    name: s.companyName,
    url: SITE_URL,
    image: absoluteUrl("/opengraph-image"),
    telephone: s.phone,
    email: s.email,
    priceRange: "PKR 10,000 – PKR 120,000",
    address: { "@type": "PostalAddress", addressLocality: s.city, addressRegion: s.region, addressCountry: s.country },
    parentOrganization: { "@id": `${SITE_URL}/#organization` },
  };
}

export function websiteSchema(s: SiteSettings): Json {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE_URL}/#website`,
    url: SITE_URL,
    name: s.companyName,
    publisher: { "@id": `${SITE_URL}/#organization` },
    potentialAction: {
      "@type": "SearchAction",
      target: { "@type": "EntryPoint", urlTemplate: `${SITE_URL}/blog?q={search_term_string}` },
      "query-input": "required name=search_term_string",
    },
  };
}

export function serviceSchema(service: ServiceData): Json {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: service.title,
    serviceType: service.tagline,
    description: service.description,
    url: absoluteUrl(`/services/${service.slug}`),
    provider: { "@id": `${SITE_URL}/#organization` },
    areaServed: ["Pakistan", "United Arab Emirates", "Saudi Arabia", "Qatar", "United Kingdom", "United States"],
    offers: {
      "@type": "Offer",
      priceCurrency: "PKR",
      price: service.price,
      description: service.priceUnit === "MONTH" ? "Starting price per month" : "Starting price per project",
    },
  };
}

export function faqSchema(items: QA[]): Json | null {
  if (!items.length) return null;
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((f) => ({ "@type": "Question", name: f.question, acceptedAnswer: { "@type": "Answer", text: f.answer } })),
  };
}

export function articleSchema(post: BlogPostData, publisher: string): Json {
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    image: post.coverImage ? absoluteUrl(post.coverImage) : undefined,
    datePublished: post.publishedAt ?? undefined,
    dateModified: post.updatedAt ?? post.publishedAt ?? undefined,
    author: { "@type": post.author.includes("Team") ? "Organization" : "Person", name: post.author },
    publisher: { "@type": "Organization", name: publisher, logo: { "@type": "ImageObject", url: absoluteUrl("/logo.svg") } },
    mainEntityOfPage: absoluteUrl(`/blog/${post.slug}`),
    keywords: post.tags.join(", "),
  };
}

export function breadcrumbSchema(items: Array<{ name: string; path: string }>): Json {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}
