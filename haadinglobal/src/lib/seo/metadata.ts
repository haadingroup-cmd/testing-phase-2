import type { Metadata } from "next";
import { SITE_URL } from "@/lib/site";

type MetaInput = {
  title: string;
  description: string;
  path: string;
  image?: string | null;
  type?: "website" | "article";
  publishedTime?: string | null;
  modifiedTime?: string | null;
  noIndex?: boolean;
};

const DEFAULT_OG = "/opengraph-image";

/** Consistent metadata: canonical, Open Graph, Twitter and robots for every page. */
export function buildMetadata({ title, description, path, image, type = "website", publishedTime, modifiedTime, noIndex }: MetaInput): Metadata {
  const url = `${SITE_URL}${path === "/" ? "" : path}` || SITE_URL;
  const images = [{ url: image || DEFAULT_OG, width: 1200, height: 630, alt: title }];
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      type,
      url,
      title,
      description,
      siteName: "HaadinGlobal",
      locale: "en_US",
      images,
      ...(type === "article" && publishedTime ? { publishedTime, modifiedTime: modifiedTime ?? publishedTime } : {}),
    },
    twitter: { card: "summary_large_image", title, description, images: images.map((i) => i.url) },
    robots: noIndex ? { index: false, follow: false } : { index: true, follow: true },
  };
}
