/**
 * Google Ads landing pages for Gulf markets.
 *
 * Each of these is a dedicated, conversion-focused page tuned for a specific
 * city/country so ad relevance (and therefore Quality Score) is high and the
 * message matches the searcher's intent. Prices shown in USD.
 *
 * Route: /agency/[slug]  (e.g. /agency/digital-marketing-agency-dubai)
 */
export interface Landing {
  slug: string;
  city: string;
  country: string;
  countryCode: string;
  currency: string;
  headline: string;
  subhead: string;
  metaTitle: string;
  metaDescription: string;
  heroPoints: string[];
  painPoints: { problem: string; solution: string }[];
  services: { name: string; desc: string }[];
  faqs: { q: string; a: string }[];
  priceNote: string;
}

const SHARED_SERVICES = [
  { name: "Meta Ads (Facebook & Instagram)", desc: "High-ROAS ad campaigns that turn scrollers into buyers, managed daily by specialists." },
  { name: "Google Ads (Search & Shopping)", desc: "Capture high-intent buyers the moment they search — optimized for a low cost per lead." },
  { name: "SEO & Local SEO", desc: "Rank on Google and Maps for the searches your customers actually make." },
  { name: "Website & Shopify Development", desc: "Fast, conversion-focused websites and online stores built to sell." },
  { name: "Social Media Management", desc: "Consistent, on-brand content that builds trust and keeps you top of mind." },
  { name: "Branding & Creative", desc: "Logos, identity and ad creative that make your business look premium." },
];

function faqsFor(city: string, country: string, currency: string) {
  return [
    { q: `Do you work with businesses in ${city}?`, a: `Yes. We work with clients across ${country} and the wider Gulf, managing campaigns remotely with regular reporting and fast communication across your time zone.` },
    { q: "How quickly will I see results?", a: "Paid ads (Meta/Google) typically show measurable results within 2–4 weeks. SEO builds over 3–6 months. We share a clear timeline before we start." },
    { q: "What does it cost?", a: `Management packages start from around ${currency} 199/month depending on scope, plus your ad budget. Book a free consultation for an exact quote tailored to your goals.` },
    { q: "Do I need a long contract?", a: "No. We recommend a 3-month minimum for meaningful results, but work month-to-month. Most clients stay because of the results, not a lock-in." },
    { q: "Can you communicate in Arabic?", a: "Yes — we serve Arabic-speaking clients and can run Arabic-language ad creative and landing pages for your local audience." },
  ];
}

function faqsForPK(city: string) {
  return [
    { q: `Do you work with businesses in ${city}?`, a: `Yes. HaadinGlobal is based in Sahiwal and works with businesses across ${city} and all of Pakistan. We manage everything online with regular reporting and fast WhatsApp communication, so location is never a barrier.` },
    { q: "How quickly will I see results?", a: "Paid ads (Meta/Google) usually show measurable results within 2–4 weeks. SEO builds over 3–6 months. We give you a clear timeline before starting." },
    { q: "What does it cost?", a: "Management packages start affordably depending on scope, plus your ad budget. Book a free consultation and we'll give you an exact quote for your goals and city." },
    { q: "Do I need a long contract?", a: "No. We suggest a 3-month minimum for meaningful results but work month-to-month. Most clients stay for the results, not a lock-in." },
    { q: `Why choose HaadinGlobal for ${city}?`, a: `We understand the local Pakistani market and buyer behaviour, run campaigns in English and Urdu, and focus on real ROI — leads and sales — not vanity metrics. We've helped 150+ businesses across Pakistan and the Gulf.` },
  ];
}

const SHARED_SERVICES_PK = [
  { name: "Meta Ads (Facebook & Instagram)", desc: "High-ROAS ad campaigns that turn scrollers into buyers, managed daily by specialists." },
  { name: "Google Ads (Search & Shopping)", desc: "Capture high-intent buyers the moment they search — optimized for a low cost per lead." },
  { name: "SEO & Local SEO", desc: "Rank on Google and Maps for the searches your customers in Pakistan actually make." },
  { name: "Website & Shopify Development", desc: "Fast, conversion-focused websites and online stores built to sell." },
  { name: "Social Media Management", desc: "Consistent, on-brand content in English and Urdu that builds trust and keeps you top of mind." },
  { name: "Branding & Creative", desc: "Logos, identity and ad creative that make your business look premium." },
];

function pkLanding(slug: string, city: string, blurb: string): Landing {
  return {
    slug,
    city,
    country: "Pakistan",
    countryCode: "PK",
    currency: "PKR",
    headline: `Digital Marketing Agency in ${city}`,
    subhead: `More leads, more sales, more growth for ${city} businesses — with Meta Ads, Google Ads and SEO managed by specialists who care about your ROI.`,
    metaTitle: `Digital Marketing Agency in ${city}, Pakistan`,
    metaDescription: `Grow your ${city} business with high-ROI Meta Ads, Google Ads, SEO and web development. Free consultation. Results-driven digital marketing agency serving ${city} and all of Pakistan.`,
    heroPoints: ["ROI-focused paid ads", "Free strategy consultation", "Fast WhatsApp response", "English & Urdu campaigns"],
    painPoints: [
      { problem: "Ad spend disappearing with no return", solution: `We rebuild your funnel and target high-intent buyers in ${city}, so every rupee works harder.` },
      { problem: "Website that looks good but doesn't sell", solution: "Conversion-focused pages engineered to turn visitors into enquiries." },
      { problem: "No consistent flow of leads", solution: "A dependable lead-generation system so your business always has new customers coming in." },
    ],
    services: SHARED_SERVICES_PK,
    faqs: faqsForPK(city),
    priceNote: `${blurb}`,
  };
}

export const LANDINGS: Landing[] = [
  pkLanding("digital-marketing-agency-sahiwal", "Sahiwal", "Affordable packages + ad budget — free consultation"),
  pkLanding("digital-marketing-agency-multan", "Multan", "Affordable packages + ad budget — free consultation"),
  pkLanding("digital-marketing-agency-jhang", "Jhang", "Affordable packages + ad budget — free consultation"),
  pkLanding("digital-marketing-agency-okara", "Okara", "Affordable packages + ad budget — free consultation"),
  pkLanding("digital-marketing-agency-lahore", "Lahore", "Affordable packages + ad budget — free consultation"),
  pkLanding("digital-marketing-agency-faisalabad", "Faisalabad", "Affordable packages + ad budget — free consultation"),
  pkLanding("digital-marketing-agency-sargodha", "Sargodha", "Affordable packages + ad budget — free consultation"),
  pkLanding("digital-marketing-agency-pakpattan", "Pakpattan", "Affordable packages + ad budget — free consultation"),
  {
    slug: "digital-marketing-agency-dubai",
    city: "Dubai",
    country: "the UAE",
    countryCode: "AE",
    currency: "$",
    headline: "Digital Marketing Agency in Dubai",
    subhead: "More leads, more sales, more growth — with Meta Ads, Google Ads and SEO managed by specialists who care about your ROI.",
    metaTitle: "Digital Marketing Agency in Dubai, UAE",
    metaDescription: "Grow your Dubai business with high-ROI Meta Ads, Google Ads, SEO and web development. Free consultation. Results-driven digital marketing for the UAE.",
    heroPoints: ["ROI-focused paid ads", "Free strategy consultation", "24-hour response time", "Arabic & English campaigns"],
    painPoints: [
      { problem: "Ad spend disappearing with no return", solution: "We rebuild your funnel and target high-intent buyers, so every dirham works harder." },
      { problem: "Website that looks good but doesn't sell", solution: "Conversion-focused pages engineered to turn visitors into enquiries." },
      { problem: "Invisible on Google", solution: "Local SEO that puts you in front of Dubai customers searching right now." },
    ],
    services: SHARED_SERVICES,
    faqs: faqsFor("Dubai", "the UAE", "$"),
    priceNote: "Packages from $199/month + ad budget",
  },
  {
    slug: "digital-marketing-agency-qatar",
    city: "Doha",
    country: "Qatar",
    countryCode: "QA",
    currency: "$",
    headline: "Digital Marketing Agency in Qatar",
    subhead: "Win more customers in Doha and across Qatar with paid ads, SEO and websites built to convert — not just to look nice.",
    metaTitle: "Digital Marketing Agency in Qatar",
    metaDescription: "Grow your Qatar business with high-ROI Meta Ads, Google Ads, SEO and web development. Free consultation. Results-driven digital marketing for Doha & Qatar.",
    heroPoints: ["ROI-focused paid ads", "Free strategy consultation", "24-hour response time", "Arabic & English campaigns"],
    painPoints: [
      { problem: "Competitors outranking you online", solution: "SEO and ads strategy that gets you found first by Qatar customers." },
      { problem: "Leads that never convert", solution: "Sharper targeting and landing pages that qualify and convert buyers." },
      { problem: "No time to manage marketing", solution: "We run it end-to-end and report results — you focus on your business." },
    ],
    services: SHARED_SERVICES,
    faqs: faqsFor("Doha", "Qatar", "$"),
    priceNote: "Packages from $199/month + ad budget",
  },
  {
    slug: "digital-marketing-agency-saudi-arabia",
    city: "Riyadh",
    country: "Saudi Arabia",
    countryCode: "SA",
    currency: "$",
    headline: "Digital Marketing Agency in Saudi Arabia",
    subhead: "Scale your business in Riyadh, Jeddah and across the Kingdom with data-driven Meta Ads, Google Ads and SEO.",
    metaTitle: "Digital Marketing Agency in Saudi Arabia",
    metaDescription: "Grow your Saudi business with high-ROI Meta Ads, Google Ads, SEO and web development. Free consultation. Results-driven digital marketing for KSA.",
    heroPoints: ["ROI-focused paid ads", "Free strategy consultation", "24-hour response time", "Arabic & English campaigns"],
    painPoints: [
      { problem: "Marketing that doesn't reach Saudi buyers", solution: "Localized, Arabic-first campaigns tuned to the KSA market." },
      { problem: "Spending on ads with no clear ROI", solution: "Transparent tracking so you see exactly what every riyal returns." },
      { problem: "Outdated website losing customers", solution: "Modern, fast, mobile-first sites built to convert Saudi shoppers." },
    ],
    services: SHARED_SERVICES,
    faqs: faqsFor("Riyadh", "Saudi Arabia", "$"),
    priceNote: "Packages from $199/month + ad budget",
  },
];

export function getLanding(slug: string) {
  return LANDINGS.find((l) => l.slug === slug);
}
