import { SITE } from "@/data/siteConfig";
export const brand = {
  name: SITE.name,
  agency: "HaadinGlobal Marketing Agency",
  website: SITE.url,
  whatsapp: SITE.social.whatsapp,
  email: SITE.email,
  contact: "https://www.haadinglobal.com/contact",
  seo: "https://www.haadinglobal.com/services/seo",
};
export const categoryLabels = {
  technical: "Technical SEO",
  onpage: "On-page SEO",
  content: "HTML content structure",
  performance: "HTML delivery checks",
  local: "On-site local signals",
  social: "Social & sharing",
};
export const scoreLabel = (n: number | null) =>
  n === null
    ? "Unavailable"
    : n >= 90
      ? "Most checked signals pass"
      : n >= 75
        ? "Some checks need attention"
        : n >= 50
          ? "Several checks need attention"
          : "Many checks need attention";
export const disclaimer =
  "This tool provides an automated SEO assessment based on publicly accessible information and available integrations. SEO scores are diagnostic indicators created by HaadinGlobal and are not official Google scores or guarantees of search rankings.";
export const pdfDisclaimer =
  "Important: This report is an automated SEO audit based on publicly accessible website data and available integrations. It is not a Google ranking guarantee and does not represent proprietary data from Ahrefs, Semrush, Google, or other third-party platforms unless explicitly stated.";
