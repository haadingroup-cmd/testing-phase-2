import { SITE } from "@/data/siteConfig";
export const brand = {
  name: "HaadiGlobal",
  agency: "HaadiGlobal Marketing Agency",
  website: SITE.url,
  whatsapp: SITE.social.whatsapp,
  email: SITE.email,
  contact: "https://www.haadinglobal.com/contact",
  seo: "https://www.haadinglobal.com/services/seo",
};
export const categoryLabels = {
  technical: "Technical SEO",
  onpage: "On-page SEO",
  content: "Content structure",
  performance: "Performance signals",
  local: "Local signals",
  social: "Social & sharing",
};
export const scoreLabel = (n: number | null) =>
  n === null
    ? "Unavailable"
    : n >= 90
      ? "Excellent"
      : n >= 75
        ? "Good"
        : n >= 50
          ? "Needs improvement"
          : "Critical";
export const disclaimer =
  "This tool provides an automated SEO assessment based on publicly accessible information and available integrations. SEO scores are diagnostic indicators created by HaadiGlobal and are not official Google scores or guarantees of search rankings.";
export const pdfDisclaimer =
  "Important: This report is an automated SEO audit based on publicly accessible website data and available integrations. It is not a Google ranking guarantee and does not represent proprietary data from Ahrefs, Semrush, Google, or other third-party platforms unless explicitly stated.";
