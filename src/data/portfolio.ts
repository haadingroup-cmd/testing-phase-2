/**
 * Real client projects for the Portfolio / Our Work page.
 * Only public, honest facts — no confidential invoice/contract data.
 * `liveUrl` is shown as a "View Live Site" button; omit it for private/
 * login-gated apps or sites still in development (use `status` instead).
 * `image` (optional) is a screenshot at /portfolio/<file>; if absent, the
 * card shows a branded gradient + icon instead.
 */
export type Project = {
  slug: string;
  name: string;
  location: string;
  category: "Web Development" | "Shopify" | "SEO" | "Google Ads" | "Local SEO" | "Software";
  icon: string;         // emoji shown on the card
  gradient: string;     // tailwind gradient classes for the card header
  summary: string;      // one-line what we built / did
  result?: string;      // optional outcome / scope highlight
  liveUrl?: string;     // public site — shows "View Live Site"
  status?: string;      // used when there's no public link (e.g. "Private app")
};

export const PROJECTS: Project[] = [
  {
    slug: "royal-school",
    name: "Royal International School System",
    location: "Multan, Pakistan",
    category: "Software",
    icon: "🎓",
    gradient: "from-indigo-600 to-blue-800",
    summary: "Custom-built School Management System — admissions, class & student management, and dashboards.",
    result: "Full data ownership, self-serve dashboard, built end-to-end to the school's requirements.",
    status: "Custom web app — live demo on request",
  },
  {
    slug: "kaashan",
    name: "Kaashan",
    location: "Sahiwal, Pakistan",
    category: "Shopify",
    icon: "🛍️",
    gradient: "from-rose-600 to-red-800",
    summary: "Shopify store design & setup for a growing clothing brand — built to browse and sell.",
    result: "Conversion-focused product pages and a clean, mobile-first storefront.",
    liveUrl: "https://www.kaashan.com",
  },
  {
    slug: "core-sportswears",
    name: "Core Sportswears",
    location: "Sialkot, Pakistan",
    category: "Web Development",
    icon: "🏂",
    gradient: "from-cyan-600 to-blue-800",
    summary: "Digital catalogue & flipbook website (Ski & Snow Wear, Streetwear, Sportswear, Bags) with PDF download and WhatsApp ordering.",
    result: "One-tap catalogue browsing and instant WhatsApp enquiries for custom orders.",
    liveUrl: "https://catalogue-nine-brown.vercel.app",
  },
  {
    slug: "royal-painter-dubai",
    name: "Royal Painter Dubai",
    location: "Dubai, UAE",
    category: "Web Development",
    icon: "🎨",
    gradient: "from-amber-500 to-orange-700",
    summary: "Painting-services landing page + brand logo, on-page SEO and Google Ads setup for the Dubai market.",
    result: "Lead-focused site with WhatsApp & call CTAs, built to capture 'near me' searches.",
    liveUrl: "https://royalpainterdubai.com",
  },
  {
    slug: "abdulla-events",
    name: "Abdulla Events",
    location: "Saudi Arabia",
    category: "SEO",
    icon: "🎪",
    gradient: "from-emerald-600 to-teal-800",
    summary: "Event-rental website & SEO — tables, chairs, tents, qahwa service and full event setups.",
    result: "Website development plus an SEO foundation for Saudi event-rental searches.",
    status: "Website & SEO — in progress",
  },
  {
    slug: "isp-portal",
    name: "ISP Management Portal",
    location: "Sahiwal, Pakistan",
    category: "Software",
    icon: "🌐",
    gradient: "from-violet-600 to-purple-800",
    summary: "Custom management portal for an Internet Service Provider — customers, packages and billing in one place.",
    result: "A single dashboard to run day-to-day ISP operations.",
    status: "Private web app — live demo on request",
  },
  {
    slug: "markhor-college",
    name: "Markhor College",
    location: "Sahiwal, Pakistan",
    category: "Local SEO",
    icon: "🏫",
    gradient: "from-sky-600 to-indigo-800",
    summary: "Google Business Profile optimization for an education institution — categories, info and local presence.",
    result: "Stronger local visibility for 'college in Sahiwal' style searches.",
    liveUrl: "https://markhorcollege.com",
  },
];

/**
 * Real results screenshots, grouped by channel. Populated as curated,
 * cropped proof images are added under /public/portfolio/results/.
 * Each item: { src, caption }. The gallery only renders channels that
 * have at least one item, so this can grow over time.
 */
export type ResultChannel = "SEO" | "Google Ads" | "Meta Ads" | "TikTok Ads" | "eCommerce";
export type ResultItem = { src: string; caption: string };

export const RESULTS: Record<ResultChannel, ResultItem[]> = {
  "SEO": [
    { src: "/portfolio/results/seo-329k.png", caption: "329K clicks & 50.6M impressions from Google Search (3-month period)" },
    { src: "/portfolio/results/seo-177m.png", caption: "Organic growth to 19.8K clicks & 1.77M impressions" },
    { src: "/portfolio/results/seo-589k.png", caption: "Steady SEO climb — 4.63K clicks, avg position 7.1" },
    { src: "/portfolio/results/seo-682k.png", caption: "From near-zero to 5.91K clicks & 682K impressions" },
    { src: "/portfolio/results/seo-pos49.png", caption: "New site breakout — avg position 4.9 within weeks" },
    { src: "/portfolio/results/seo-ga4.png", caption: "Website visitors up 413% (Google Analytics)" },
  ],
  "Google Ads": [
    { src: "/portfolio/results/gads-roas97.png", caption: "Performance Max: 9.7x return on ad spend" },
    { src: "/portfolio/results/gads-roas42.png", caption: "Performance Max: $14K spend → $58.8K conversion value (4.2x ROAS)" },
    { src: "/portfolio/results/gads-71k.png", caption: "71.5K conversions driven (+584% period-on-period)" },
    { src: "/portfolio/results/gads-109.png", caption: "109 conversions at just $14.79 cost per conversion" },
  ],
  "Meta Ads": [],
  "TikTok Ads": [
    { src: "/portfolio/results/tiktok-68m.png", caption: "TikTok Ads: 6.8M impressions at 19.6% CTR" },
  ],
  "eCommerce": [
    { src: "/portfolio/results/ecom-revenue.png", caption: "eCommerce store — $13.5K revenue across 232 sales" },
    { src: "/portfolio/results/ecom-orders.png", caption: "Live store orders coming in from campaigns" },
  ],
};
