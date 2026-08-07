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
  {
    slug: "digital-marketing-agency-sahiwal",
    city: "Sahiwal",
    country: "Pakistan",
    countryCode: "PK",
    currency: "PKR",
    headline: "Digital Marketing Agency in Sahiwal",
    subhead:
      "HaadinGlobal is a Sahiwal-based digital marketing agency helping local shops, academies, clinics, property dealers and online stores get more customers with Meta Ads, Google Ads and SEO — managed by specialists who care about your ROI.",
    metaTitle: "Digital Marketing Agency in Sahiwal | HaadinGlobal",
    metaDescription:
      "Grow your Sahiwal business with HaadinGlobal — expert SEO, Meta & Google Ads, social media and web development. Local team, real ROI. Free consultation: +92 305 4782677.",
    heroPoints: [
      "Based in Sahiwal — local team",
      "ROI-focused Meta & Google Ads",
      "Free strategy consultation",
      "Fast WhatsApp response",
    ],
    painPoints: [
      {
        problem: "Boosting posts but getting no real customers",
        solution:
          "We replace random boosts with properly targeted Meta & Google Ad campaigns aimed at real buyers in Sahiwal and nearby areas — so your budget brings leads, not just likes.",
      },
      {
        problem: "Invisible on Google when people search locally",
        solution:
          "Local SEO and Google Business Profile optimization so you show up for searches like 'best [your service] in Sahiwal' and on Google Maps.",
      },
      {
        problem: "A website that looks fine but never brings enquiries",
        solution:
          "Fast, mobile-first, conversion-focused pages built to turn visitors into WhatsApp messages, calls and orders.",
      },
    ],
    services: [
      { name: "SEO & Local SEO", desc: "Rank on Google and Maps for what Sahiwal customers actually search, and bring in steady free organic traffic." },
      { name: "Meta Ads (Facebook & Instagram)", desc: "Location-targeted campaigns that reach the right customers in Sahiwal and surrounding areas with a clear return on spend." },
      { name: "Google Ads", desc: "Appear at the top of Google the moment someone searches for your product or service — perfect for ready-to-buy customers." },
      { name: "Website & Shopify Development", desc: "Fast, mobile-friendly websites and online stores designed to convert visitors into customers 24/7." },
      { name: "Social Media Management", desc: "Consistent, professional content in English and Urdu that builds trust and keeps your brand top of mind." },
      { name: "Branding & Graphic Design", desc: "A clean, memorable brand identity and ad creative that make your Sahiwal business look premium." },
    ],
    faqs: [
      { q: "Do you have an office in Sahiwal?", a: "Yes. HaadinGlobal is based in Sahiwal, near Pakpattan Chowk Flyover in Canal View Town. We work with local businesses both in person and online, with fast WhatsApp communication." },
      { q: "How much does digital marketing cost in Sahiwal?", a: "It depends on your goals and the services you need. Our packages start affordably for small local businesses and scale up as you grow, plus your ad budget. Book a free consultation for an exact quote." },
      { q: "How quickly will I see results?", a: "Paid ads on Meta and Google usually show measurable results within 2-4 weeks. SEO builds over 3-6 months and delivers lasting organic traffic. We give you a clear timeline before we start." },
      { q: "Can you help a small business in Sahiwal get more customers?", a: "Absolutely. Many of the businesses we help are small and local. We build affordable, targeted campaigns designed to bring in real leads and sales — not just online engagement." },
      { q: "Which types of businesses do you work with in Sahiwal?", a: "Retail shops, academies and schools, clinics, restaurants and cafes, property dealers, boutiques and online sellers — any Sahiwal business that wants more customers from Google, Facebook and Instagram." },
    ],
    priceNote: "Affordable local packages + ad budget",
  },
  {
    slug: "digital-marketing-agency-multan",
    city: "Multan",
    country: "Pakistan",
    countryCode: "PK",
    currency: "PKR",
    headline: "Digital Marketing Agency in Multan",
    subhead:
      "HaadinGlobal helps Multan businesses — retailers, real estate, clinics, agriculture and online sellers — grow with Meta Ads, Google Ads and SEO focused on real leads and sales across South Punjab.",
    metaTitle: "Digital Marketing Agency in Multan | HaadinGlobal",
    metaDescription:
      "Grow your Multan business with HaadinGlobal — SEO, Meta & Google Ads, social media and web development. ROI-focused, English & Urdu. Free consultation: +92 305 4782677.",
    heroPoints: [
      "ROI-focused Meta & Google Ads",
      "Serving Multan & South Punjab",
      "Free strategy consultation",
      "Fast WhatsApp response",
    ],
    painPoints: [
      { problem: "Customers can't find you online", solution: "We put your business on Google Search, Maps and social so Multan customers discover you first." },
      { problem: "Ad money spent with no clear return", solution: "Targeted Meta & Google campaigns aimed at real buyers in Multan and South Punjab, tracked for ROI." },
      { problem: "Website that doesn't bring enquiries", solution: "Mobile-first, conversion-focused pages that turn visitors into calls, WhatsApp messages and orders." },
    ],
    services: [
      { name: "SEO & Local SEO", desc: "Rank on Google and Maps for what Multan customers actually search for." },
      { name: "Meta Ads (Facebook & Instagram)", desc: "Location-targeted campaigns reaching the right customers across Multan and South Punjab." },
      { name: "Google Ads", desc: "Show up at the top when someone searches for your product or service in Multan." },
      { name: "Website & Shopify Development", desc: "Fast, mobile-friendly websites and online stores that sell around the clock." },
      { name: "Social Media Management", desc: "Consistent English & Urdu content that builds trust and grows your local following." },
      { name: "Branding & Graphic Design", desc: "A polished brand identity and creative that make your Multan business memorable." },
    ],
    faqs: [
      { q: "Do you work with businesses in Multan?", a: "Yes. HaadinGlobal works with Multan and South Punjab businesses — retail, real estate, clinics, agriculture, food and online sellers — managing everything online with fast WhatsApp support." },
      { q: "How much does digital marketing cost in Multan?", a: "It depends on your goals and services. Packages start affordably for small local businesses and scale up as you grow, plus your ad budget. Book a free consultation for an exact quote." },
      { q: "How quickly will I see results?", a: "Paid ads on Meta and Google usually show results within 2-4 weeks. SEO builds over 3-6 months for lasting organic traffic. You get a clear timeline before we start." },
      { q: "Can you help a small Multan business get more customers?", a: "Absolutely. We build affordable, targeted campaigns for small and local Multan businesses designed to bring in real leads and sales." },
      { q: "Do you run campaigns in Urdu and English?", a: "Yes. We run campaigns in both Urdu and English to connect with your Multan and wider Pakistani audience." },
    ],
    priceNote: "Affordable local packages + ad budget",
  },
  pkLanding("digital-marketing-agency-jhang", "Jhang", "Affordable packages + ad budget — free consultation"),
  pkLanding("digital-marketing-agency-okara", "Okara", "Affordable packages + ad budget — free consultation"),
  pkLanding("digital-marketing-agency-lahore", "Lahore", "Affordable packages + ad budget — free consultation"),
  {
    slug: "digital-marketing-agency-faisalabad",
    city: "Faisalabad",
    country: "Pakistan",
    countryCode: "PK",
    currency: "PKR",
    headline: "Digital Marketing Agency in Faisalabad",
    subhead:
      "HaadinGlobal helps Faisalabad businesses — from textile and industrial units to retailers, wholesalers and online stores — win more customers with Meta Ads, Google Ads and SEO built around real ROI, not vanity metrics.",
    metaTitle: "Digital Marketing Agency in Faisalabad | HaadinGlobal",
    metaDescription:
      "Grow your Faisalabad business with HaadinGlobal — SEO, Meta & Google Ads, social media and web development. ROI-focused, English & Urdu. Free consultation: +92 305 4782677.",
    heroPoints: [
      "ROI-focused Meta & Google Ads",
      "Built for Faisalabad's business market",
      "Free strategy consultation",
      "Fast WhatsApp response",
    ],
    painPoints: [
      { problem: "Great products, but weak online presence", solution: "We build your digital storefront — website, Google and social — so Faisalabad and export customers can find and trust you." },
      { problem: "Boosting posts with nothing to show for it", solution: "Properly structured Meta & Google Ad campaigns targeting real buyers, so your budget turns into enquiries and orders." },
      { problem: "Competitors ranking above you on Google", solution: "Local SEO that gets your business found for high-intent searches across Faisalabad." },
    ],
    services: [
      { name: "SEO & Local SEO", desc: "Rank on Google and Maps for the products and services Faisalabad customers search for." },
      { name: "Meta Ads (Facebook & Instagram)", desc: "Targeted campaigns for retail, wholesale and B2B buyers in Faisalabad and beyond." },
      { name: "Google Ads", desc: "Capture ready-to-buy customers the moment they search for your product or service." },
      { name: "Website & Shopify Development", desc: "Fast, mobile-first websites and online stores that showcase your products and convert." },
      { name: "Social Media Management", desc: "Consistent English & Urdu content that builds a trusted brand for your business." },
      { name: "Branding & Graphic Design", desc: "Professional identity and creative that makes your Faisalabad business stand out." },
    ],
    faqs: [
      { q: "Do you work with businesses in Faisalabad?", a: "Yes. HaadinGlobal works with Faisalabad businesses — textile and industrial units, wholesalers, retailers, real estate and online stores — managing everything online with fast WhatsApp communication." },
      { q: "How much does digital marketing cost in Faisalabad?", a: "It depends on your goals and services. Packages start affordably for small businesses and scale up for larger brands, plus your ad budget. Book a free consultation for an exact quote." },
      { q: "How quickly will I see results?", a: "Paid ads on Meta and Google usually show results within 2-4 weeks. SEO builds over 3-6 months for lasting organic traffic. We give you a clear timeline upfront." },
      { q: "Can you help my textile or wholesale business sell online?", a: "Yes. We build websites, Shopify stores and lead-generation systems suited to Faisalabad's textile, wholesale and export businesses, plus retail and services." },
      { q: "Do you run ads in Urdu and English?", a: "Yes. We create and run campaigns in both Urdu and English to connect with your specific Faisalabad and Pakistani audience." },
    ],
    priceNote: "Affordable local packages + ad budget",
  },
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
