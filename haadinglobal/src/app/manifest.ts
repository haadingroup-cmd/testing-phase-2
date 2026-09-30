import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "HaadinGlobal — Digital Marketing & Technology Agency",
    short_name: "HaadinGlobal",
    description: "Meta & Google Ads, SEO, web development, Shopify and AI automation.",
    start_url: "/",
    display: "standalone",
    background_color: "#f8f9ff",
    theme_color: "#091b36",
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png" },
      { src: "/icon.svg", sizes: "any", type: "image/svg+xml" },
    ],
  };
}
