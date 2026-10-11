import type { Metadata } from "next";

const SITE = "https://www.haadinglobal.com";
const OG_IMAGE = { url: "/og-image.jpg", width: 1200, height: 630, alt: "HaadinGlobal — Digital Marketing Agency" };

/**
 * Metadata for a static page. Next.js replaces the whole `openGraph` object of
 * the root layout when a page sets its own, and inherits it unchanged when it
 * doesn't — so pages without this helper shared the homepage's og:url, title
 * and description. Always building the full object keeps them page-specific.
 */
export function pageMeta({ title, description, path }: { title: string; description: string; path: string }): Metadata {
  const url = `${SITE}${path}`;
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      type: "website",
      locale: "en_PK",
      siteName: "HaadinGlobal",
      url,
      title: `${title} | HaadinGlobal`,
      description,
      images: [OG_IMAGE],
    },
    twitter: { card: "summary_large_image", title: `${title} | HaadinGlobal`, description },
  };
}
