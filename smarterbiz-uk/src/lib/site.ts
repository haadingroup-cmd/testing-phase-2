// Central site configuration. Edit these values before going live.
const rawUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.smarterbiz.uk";

export const SITE = {
  name: "SmarterBiz.uk",
  shortName: "SmarterBiz",
  url: rawUrl.replace(/\/+$/, ""),
  locale: "en_GB",
  language: "en-GB",
  tagline: "Practical AI tools for smarter UK small businesses",
  description:
    "Independent reviews, comparisons and guides to the best AI tools for UK small businesses — with sterling pricing, UK GDPR notes and Making Tax Digital compatibility.",
  email: "hello@smarterbiz.uk",
  editorialEmail: "editorial@smarterbiz.uk",
  // Fill in once your company is registered — shown in the footer and Organization schema only when set.
  legalName: "",
  companyNumber: "",
  address: { locality: "London", country: "GB" },
  // Add real profile URLs (LinkedIn, X, YouTube, Medium…) — they become Organization "sameAs" signals.
  social: [] as string[],
  author: {
    name: "SmarterBiz Editorial Team",
    role: "UK SME Technology Desk",
    bio: "Our editors test AI and business software against the realities of running a UK small business: sterling pricing and VAT, UK GDPR, HMRC's Making Tax Digital rules and British English output.",
  },
  // Year shown in edition labels and titles.
  year: 2026,
  lastUpdated: "2026-09-24",
} as const;

export const absoluteUrl = (path = "/") => `${SITE.url}${path.startsWith("/") ? path : `/${path}`}`;

export const NAV = [
  { href: "/tools", label: "AI Tools Directory" },
  { href: "/categories", label: "Categories" },
  { href: "/compare", label: "Compare" },
  { href: "/guides", label: "Guides" },
  { href: "/methodology", label: "How We Test" },
] as const;
