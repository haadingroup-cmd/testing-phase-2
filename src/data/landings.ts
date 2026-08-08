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
  {
    slug: "digital-marketing-agency-jhang",
    city: "Jhang",
    country: "Pakistan",
    countryCode: "PK",
    currency: "PKR",
    headline: "Digital Marketing Agency in Jhang",
    subhead:
      "HaadinGlobal helps Jhang businesses — local shops, agriculture, real estate and services — get discovered online and win more customers with affordable, results-focused Meta Ads, Google Ads and SEO.",
    metaTitle: "Digital Marketing Agency in Jhang | HaadinGlobal",
    metaDescription:
      "Grow your Jhang business with HaadinGlobal — affordable SEO, Meta & Google Ads, social media and websites. ROI-focused, English & Urdu. Free consultation: +92 305 4782677.",
    heroPoints: [
      "Affordable, results-focused",
      "Serving Jhang & nearby areas",
      "Free strategy consultation",
      "Fast WhatsApp response",
    ],
    painPoints: [
      {
        problem: "Your business isn't showing up online",
        solution:
          "We put you on Google Search, Maps and social media so Jhang customers can find and contact you easily.",
      },
      {
        problem: "Boosting posts but getting no real customers",
        solution:
          "We replace random boosts with proper targeted ads aimed at real buyers in and around Jhang.",
      },
      {
        problem: "No professional website or online presence",
        solution:
          "We build a clean, mobile-friendly website that makes your business look credible and brings enquiries.",
      },
    ],
    services: [
      { name: "SEO & Local SEO", desc: "Get found on Google and Maps when people in Jhang search for what you offer." },
      { name: "Meta Ads (Facebook & Instagram)", desc: "Affordable, targeted campaigns that reach the right local customers around Jhang." },
      { name: "Google Ads", desc: "Show up at the top when someone searches for your product or service." },
      { name: "Website & Shopify Development", desc: "Simple, fast, mobile-friendly websites and online stores built to bring enquiries." },
      { name: "Social Media Management", desc: "Consistent Urdu & English content that builds trust and a local following." },
      { name: "Branding & Graphic Design", desc: "A clean, professional identity that makes your Jhang business stand out." },
    ],
    faqs: [
      { q: "Do you work with businesses in Jhang?", a: "Yes. HaadinGlobal is based in Sahiwal and works with businesses across Jhang and nearby areas — everything is managed online with fast WhatsApp communication." },
      { q: "I have a small local business — can you still help?", a: "Absolutely. We specialise in affordable, targeted campaigns for small and local businesses that bring in real leads and sales." },
      { q: "How much does it cost?", a: "Packages start affordably for small businesses and scale as you grow, plus your ad budget. Book a free consultation for an exact quote." },
      { q: "How soon will I see results?", a: "Paid ads usually show results in 2-4 weeks; SEO builds over 3-6 months. We share a clear timeline upfront." },
      { q: "Do you handle everything for me?", a: "Yes. We plan, create, run and report — you focus on your business while we handle the marketing." },
    ],
    priceNote: "Affordable local packages + ad budget",
  },
  {
    slug: "digital-marketing-agency-okara",
    city: "Okara",
    country: "Pakistan",
    countryCode: "PK",
    currency: "PKR",
    headline: "Digital Marketing Agency in Okara",
    subhead:
      "HaadinGlobal helps Okara businesses — from agriculture and dairy to retail shops, real estate and services — grow with affordable, ROI-focused Meta Ads, Google Ads and SEO.",
    metaTitle: "Digital Marketing Agency in Okara | HaadinGlobal",
    metaDescription:
      "Grow your Okara business with HaadinGlobal — affordable SEO, Meta & Google Ads, social media and websites. ROI-focused, English & Urdu. Free consultation: +92 305 4782677.",
    heroPoints: [
      "Affordable & ROI-focused",
      "Serving Okara & nearby areas",
      "Free strategy consultation",
      "Fast WhatsApp response",
    ],
    painPoints: [
      {
        problem: "Customers can't find you on Google",
        solution:
          "We optimise your Google presence and Maps listing so Okara customers discover you first.",
      },
      {
        problem: "Ad money spent with nothing to show",
        solution:
          "Targeted Meta and Google campaigns built around real buyers, tracked for a clear return.",
      },
      {
        problem: "Outdated or missing website",
        solution:
          "We build a fast, mobile-friendly website that turns visitors into calls and orders.",
      },
    ],
    services: [
      { name: "SEO & Local SEO", desc: "Rank on Google and Maps for the products and services Okara customers search for." },
      { name: "Meta Ads (Facebook & Instagram)", desc: "Cost-effective, targeted campaigns reaching the right customers around Okara." },
      { name: "Google Ads", desc: "Capture ready-to-buy customers the moment they search." },
      { name: "Website & Shopify Development", desc: "Fast, mobile-friendly websites and online stores designed to convert." },
      { name: "Social Media Management", desc: "Consistent Urdu & English content that builds trust and grows your following." },
      { name: "Branding & Graphic Design", desc: "A memorable brand identity and creative for your Okara business." },
    ],
    faqs: [
      { q: "Do you work with businesses in Okara?", a: "Yes. HaadinGlobal works with businesses across Okara — agriculture, dairy, retail, real estate and services — managed online with fast WhatsApp support." },
      { q: "Can you help agriculture or dairy businesses sell more?", a: "Yes. We build targeted campaigns and simple online systems to help agriculture, dairy and local businesses reach more buyers." },
      { q: "How much does it cost?", a: "Packages start affordably and scale with your goals, plus your ad budget. Book a free consultation for an exact quote." },
      { q: "How quickly will I see results?", a: "Paid ads usually work within 2-4 weeks; SEO builds over 3-6 months. You get a clear timeline first." },
      { q: "Do you run campaigns in Urdu?", a: "Yes — we run campaigns in both Urdu and English to reach your local Okara audience." },
    ],
    priceNote: "Affordable local packages + ad budget",
  },
  {
    slug: "digital-marketing-agency-lahore",
    city: "Lahore",
    country: "Pakistan",
    countryCode: "PK",
    currency: "PKR",
    headline: "Digital Marketing Agency in Lahore",
    subhead:
      "HaadinGlobal helps Lahore businesses cut through a crowded market — from retail and real estate to restaurants, fashion, education and startups — with Meta Ads, Google Ads and SEO engineered for real ROI, not vanity metrics.",
    metaTitle: "Digital Marketing Agency in Lahore | HaadinGlobal",
    metaDescription:
      "Grow your Lahore business with HaadinGlobal — SEO, Meta & Google Ads, social media and web development. ROI-focused, English & Urdu. Free consultation: +92 305 4782677.",
    heroPoints: [
      "Built for Lahore's competitive market",
      "ROI-focused Meta & Google Ads",
      "Free strategy consultation",
      "Fast WhatsApp response",
    ],
    painPoints: [
      {
        problem: "In a crowded Lahore market, you get lost in the noise",
        solution:
          "We sharpen your positioning and run tightly targeted campaigns so the right Lahore customers find you first — not your competitors.",
      },
      {
        problem: "Spending on ads without knowing what actually works",
        solution:
          "Transparent tracking and constant optimisation so every rupee is tied to real leads and sales, not guesswork.",
      },
      {
        problem: "A good-looking website that still doesn't convert",
        solution:
          "We build fast, mobile-first pages designed to turn Lahore's fast-moving buyers into calls, WhatsApp chats and orders.",
      },
    ],
    services: [
      { name: "SEO & Local SEO", desc: "Rank across Lahore's competitive search results and on Google Maps for the terms your customers actually use." },
      { name: "Meta Ads (Facebook & Instagram)", desc: "Precision-targeted campaigns for retail, real estate, food and fashion brands across Lahore and beyond." },
      { name: "Google Ads", desc: "Appear at the top the moment high-intent Lahore customers search for your product or service." },
      { name: "Website & Shopify Development", desc: "Fast, modern, conversion-focused websites and online stores that match Lahore's competitive standard." },
      { name: "Social Media Management", desc: "Scroll-stopping English & Urdu content that builds a premium brand presence in a crowded feed." },
      { name: "Branding & Graphic Design", desc: "Standout identity and ad creative that make your Lahore business impossible to ignore." },
    ],
    faqs: [
      { q: "Do you work with businesses in Lahore?", a: "Yes. HaadinGlobal works with businesses across Lahore — retail, real estate, restaurants, fashion, education, startups and online stores — with fast communication and clear reporting." },
      { q: "Lahore is competitive — can you help me stand out?", a: "That's exactly our focus. We combine sharp positioning, strong creative and precise targeting so you win attention and customers in a crowded Lahore market." },
      { q: "How much does digital marketing cost in Lahore?", a: "It depends on your goals and scope. Packages start affordably and scale up for competitive campaigns, plus your ad budget. Book a free consultation for an exact quote." },
      { q: "How quickly will I see results?", a: "Paid ads usually show results within 2-4 weeks; SEO builds over 3-6 months for lasting organic traffic. You get a clear timeline before we start." },
      { q: "Do you run campaigns in Urdu and English?", a: "Yes. We create and run campaigns in both languages to connect with Lahore's diverse audience." },
    ],
    priceNote: "Affordable local packages + ad budget",
  },
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
  {
    slug: "digital-marketing-agency-sargodha",
    city: "Sargodha",
    country: "Pakistan",
    countryCode: "PK",
    currency: "PKR",
    headline: "Digital Marketing Agency in Sargodha",
    subhead:
      "HaadinGlobal helps Sargodha businesses — retail, citrus and agriculture exporters, real estate, education and services — reach more customers with ROI-focused Meta Ads, Google Ads and SEO.",
    metaTitle: "Digital Marketing Agency in Sargodha | HaadinGlobal",
    metaDescription:
      "Grow your Sargodha business with HaadinGlobal — SEO, Meta & Google Ads, social media and websites. ROI-focused, English & Urdu. Free consultation: +92 305 4782677.",
    heroPoints: [
      "ROI-focused campaigns",
      "Serving Sargodha & nearby areas",
      "Free strategy consultation",
      "Fast WhatsApp response",
    ],
    painPoints: [
      {
        problem: "You're invisible when locals search online",
        solution:
          "Local SEO and an optimised Google profile so Sargodha customers find you on Search and Maps.",
      },
      {
        problem: "Ads that spend budget without results",
        solution:
          "Properly targeted Meta and Google campaigns aimed at real buyers, tracked for ROI.",
      },
      {
        problem: "A website that brings no enquiries",
        solution:
          "Fast, mobile-first pages that turn visitors into calls, WhatsApp messages and orders.",
      },
    ],
    services: [
      { name: "SEO & Local SEO", desc: "Get found on Google and Maps for what Sargodha customers actually search for." },
      { name: "Meta Ads (Facebook & Instagram)", desc: "Targeted campaigns reaching the right customers across Sargodha and nearby districts." },
      { name: "Google Ads", desc: "Appear at the top when high-intent customers search for your product or service." },
      { name: "Website & Shopify Development", desc: "Fast, mobile-friendly websites and online stores that sell around the clock." },
      { name: "Social Media Management", desc: "Consistent Urdu & English content that builds trust and a loyal following." },
      { name: "Branding & Graphic Design", desc: "A professional identity and creative that make your Sargodha business memorable." },
    ],
    faqs: [
      { q: "Do you work with businesses in Sargodha?", a: "Yes. HaadinGlobal works with businesses across Sargodha — retail, agriculture and citrus exporters, real estate, education and services — managed online with fast communication." },
      { q: "Can you help exporters or agriculture businesses?", a: "Yes. We build websites and targeted campaigns to help Sargodha's citrus, agriculture and export businesses reach more buyers, locally and beyond." },
      { q: "How much does it cost?", a: "Packages start affordably and scale with your goals, plus your ad budget. Book a free consultation for an exact quote." },
      { q: "How soon will I see results?", a: "Paid ads usually show results in 2-4 weeks; SEO builds over 3-6 months. We give you a clear timeline upfront." },
      { q: "Do you run campaigns in Urdu and English?", a: "Yes — both, so you connect with your full Sargodha audience." },
    ],
    priceNote: "Affordable local packages + ad budget",
  },
  {
    slug: "digital-marketing-agency-pakpattan",
    city: "Pakpattan",
    country: "Pakistan",
    countryCode: "PK",
    currency: "PKR",
    headline: "Digital Marketing Agency in Pakpattan",
    subhead:
      "HaadinGlobal helps Pakpattan businesses — local shops, agriculture, real estate and services — get online and bring in more customers with affordable, results-driven Meta Ads, Google Ads and SEO.",
    metaTitle: "Digital Marketing Agency in Pakpattan | HaadinGlobal",
    metaDescription:
      "Grow your Pakpattan business with HaadinGlobal — affordable SEO, Meta & Google Ads, social media and websites. ROI-focused, English & Urdu. Free consultation: +92 305 4782677.",
    heroPoints: [
      "Affordable & results-driven",
      "Serving Pakpattan & nearby areas",
      "Free strategy consultation",
      "Fast WhatsApp response",
    ],
    painPoints: [
      {
        problem: "Your business has no online presence",
        solution:
          "We get you on Google Search, Maps and social media so Pakpattan customers can find you.",
      },
      {
        problem: "Boosting posts with no real return",
        solution:
          "We run proper targeted ads aimed at genuine buyers in and around Pakpattan.",
      },
      {
        problem: "No proper website to build trust",
        solution:
          "We build a clean, fast, mobile-friendly website that makes your business look credible.",
      },
    ],
    services: [
      { name: "SEO & Local SEO", desc: "Get found on Google and Maps when Pakpattan customers search for what you offer." },
      { name: "Meta Ads (Facebook & Instagram)", desc: "Affordable, targeted campaigns reaching the right local customers." },
      { name: "Google Ads", desc: "Show up at the top when someone searches for your product or service." },
      { name: "Website & Shopify Development", desc: "Simple, fast, mobile-friendly websites and online stores built to bring enquiries." },
      { name: "Social Media Management", desc: "Consistent Urdu & English content that builds trust and a local following." },
      { name: "Branding & Graphic Design", desc: "A clean, professional identity for your Pakpattan business." },
    ],
    faqs: [
      { q: "Do you work with businesses in Pakpattan?", a: "Yes. HaadinGlobal is based in nearby Sahiwal and works with businesses across Pakpattan — everything managed online with fast WhatsApp communication." },
      { q: "I run a small local business — can you help?", a: "Absolutely. We focus on affordable, targeted campaigns for small and local businesses that bring in real leads." },
      { q: "How much does it cost?", a: "Packages start affordably and scale as you grow, plus your ad budget. Book a free consultation for an exact quote." },
      { q: "How quickly will I see results?", a: "Paid ads usually work within 2-4 weeks; SEO builds over 3-6 months. You get a clear timeline first." },
      { q: "Do you handle everything?", a: "Yes — we plan, create, run and report, so you can focus on running your business." },
    ],
    priceNote: "Affordable local packages + ad budget",
  },
  {
    slug: "digital-marketing-agency-karachi",
    city: "Karachi",
    country: "Pakistan",
    countryCode: "PK",
    currency: "PKR",
    headline: "Digital Marketing Agency in Karachi",
    subhead:
      "HaadinGlobal helps Karachi businesses win in Pakistan's most competitive market — from retail and e-commerce to real estate, restaurants, import/export and startups — with Meta Ads, Google Ads and SEO built for real ROI.",
    metaTitle: "Digital Marketing Agency in Karachi | HaadinGlobal",
    metaDescription:
      "Grow your Karachi business with HaadinGlobal — SEO, Meta & Google Ads, social media and web development. ROI-focused, English & Urdu. Free consultation: +92 305 4782677.",
    heroPoints: [
      "Built for Karachi's huge, fast market",
      "ROI-focused Meta & Google Ads",
      "Free strategy consultation",
      "Fast WhatsApp response",
    ],
    painPoints: [
      {
        problem: "Lost in Karachi's massive, crowded market",
        solution:
          "We sharpen your positioning and run precisely targeted campaigns so the right Karachi customers find you — not the dozens of competitors around you.",
      },
      {
        problem: "High ad spend with unclear returns",
        solution:
          "Transparent tracking and ongoing optimisation so every rupee is tied to real leads and sales across Karachi.",
      },
      {
        problem: "Website gets traffic but few orders",
        solution:
          "Fast, mobile-first pages engineered to convert Karachi's on-the-go buyers into calls, chats and orders.",
      },
    ],
    services: [
      { name: "SEO & Local SEO", desc: "Rank across Karachi's competitive search results and on Google Maps for the terms your customers actually use." },
      { name: "Meta Ads (Facebook & Instagram)", desc: "Precision-targeted campaigns for retail, e-commerce and service brands across Karachi's diverse audience." },
      { name: "Google Ads", desc: "Appear at the top the moment high-intent Karachi customers search for your product or service." },
      { name: "Website & Shopify Development", desc: "Fast, modern, conversion-focused websites and online stores built for Karachi's e-commerce market." },
      { name: "Social Media Management", desc: "Scroll-stopping English & Urdu content that builds a strong brand presence in a busy feed." },
      { name: "Branding & Graphic Design", desc: "Standout identity and ad creative that make your Karachi business memorable." },
    ],
    faqs: [
      { q: "Do you work with businesses in Karachi?", a: "Yes. HaadinGlobal works with businesses across Karachi — retail, e-commerce, real estate, restaurants, import/export and startups — with fast communication and clear reporting." },
      { q: "Karachi is very competitive — can you help me stand out?", a: "That's our focus. We combine sharp positioning, strong creative and precise targeting so you win attention and customers even in Karachi's crowded market." },
      { q: "How much does digital marketing cost in Karachi?", a: "It depends on your goals and scope. Packages start affordably and scale up for competitive campaigns, plus your ad budget. Book a free consultation for an exact quote." },
      { q: "How quickly will I see results?", a: "Paid ads usually show results within 2-4 weeks; SEO builds over 3-6 months for lasting organic traffic. You get a clear timeline before we start." },
      { q: "Do you run campaigns in Urdu and English?", a: "Yes. We create and run campaigns in both languages to connect with Karachi's diverse audience." },
    ],
    priceNote: "Affordable local packages + ad budget",
  },
  {
    slug: "digital-marketing-agency-islamabad",
    city: "Islamabad",
    country: "Pakistan",
    countryCode: "PK",
    currency: "PKR",
    headline: "Digital Marketing Agency in Islamabad",
    subhead:
      "HaadinGlobal helps Islamabad businesses — from corporate and tech to real estate, education, clinics and upscale retail — grow with professional, ROI-focused Meta Ads, Google Ads and SEO.",
    metaTitle: "Digital Marketing Agency in Islamabad | HaadinGlobal",
    metaDescription:
      "Grow your Islamabad business with HaadinGlobal — SEO, Meta & Google Ads, social media and web development. ROI-focused, English & Urdu. Free consultation: +92 305 4782677.",
    heroPoints: [
      "Professional, ROI-focused campaigns",
      "Serving Islamabad & the twin cities",
      "Free strategy consultation",
      "Fast WhatsApp response",
    ],
    painPoints: [
      {
        problem: "A quality brand that isn't visible online",
        solution:
          "We build a strong digital presence — search, social and Google — so Islamabad's professional audience discovers and trusts you.",
      },
      {
        problem: "Ad budget spent without clear results",
        solution:
          "Targeted Meta and Google campaigns aimed at real buyers in Islamabad, tracked transparently for ROI.",
      },
      {
        problem: "Website that doesn't reflect your standard",
        solution:
          "Modern, fast, polished websites that match Islamabad's professional expectations and convert visitors.",
      },
    ],
    services: [
      { name: "SEO & Local SEO", desc: "Rank on Google and Maps for the services Islamabad's professional and corporate audience searches for." },
      { name: "Meta Ads (Facebook & Instagram)", desc: "Targeted campaigns reaching the right customers across Islamabad and the twin cities." },
      { name: "Google Ads", desc: "Capture high-intent buyers the moment they search for your product or service." },
      { name: "Website & Shopify Development", desc: "Modern, fast, conversion-focused websites and online stores built to a professional standard." },
      { name: "Social Media Management", desc: "Polished English & Urdu content that builds a credible, premium brand presence." },
      { name: "Branding & Graphic Design", desc: "A refined brand identity and creative that fit Islamabad's professional market." },
    ],
    faqs: [
      { q: "Do you work with businesses in Islamabad?", a: "Yes. HaadinGlobal works with businesses across Islamabad — corporate, tech, real estate, education, clinics and retail — managed online with clear reporting and fast communication." },
      { q: "Can you help a corporate or professional business?", a: "Yes. We build professional campaigns and polished websites suited to Islamabad's corporate, tech and service businesses." },
      { q: "How much does digital marketing cost in Islamabad?", a: "It depends on your goals and scope. Packages start affordably and scale with your needs, plus your ad budget. Book a free consultation for an exact quote." },
      { q: "How quickly will I see results?", a: "Paid ads usually show results within 2-4 weeks; SEO builds over 3-6 months. We give you a clear timeline upfront." },
      { q: "Do you run campaigns in Urdu and English?", a: "Yes — both, to connect with Islamabad's full audience." },
    ],
    priceNote: "Affordable local packages + ad budget",
  },
  {
    slug: "digital-marketing-agency-rawalpindi",
    city: "Rawalpindi",
    country: "Pakistan",
    countryCode: "PK",
    currency: "PKR",
    headline: "Digital Marketing Agency in Rawalpindi",
    subhead:
      "HaadinGlobal helps Rawalpindi businesses — retail, wholesale and trade, real estate, restaurants and services — reach more customers with affordable, results-driven Meta Ads, Google Ads and SEO across Pindi and the twin cities.",
    metaTitle: "Digital Marketing Agency in Rawalpindi | HaadinGlobal",
    metaDescription:
      "Grow your Rawalpindi business with HaadinGlobal — SEO, Meta & Google Ads, social media and web development. ROI-focused, English & Urdu. Free consultation: +92 305 4782677.",
    heroPoints: [
      "Affordable & results-driven",
      "Serving Rawalpindi & the twin cities",
      "Free strategy consultation",
      "Fast WhatsApp response",
    ],
    painPoints: [
      {
        problem: "Customers can't find your business online",
        solution:
          "We put you on Google Search, Maps and social so Rawalpindi customers discover you first.",
      },
      {
        problem: "Boosting posts with no real return",
        solution:
          "We run properly targeted Meta and Google campaigns aimed at real buyers across Pindi and the twin cities.",
      },
      {
        problem: "Website that brings no enquiries",
        solution:
          "Fast, mobile-first pages that turn visitors into calls, WhatsApp messages and orders.",
      },
    ],
    services: [
      { name: "SEO & Local SEO", desc: "Get found on Google and Maps for what Rawalpindi customers actually search for." },
      { name: "Meta Ads (Facebook & Instagram)", desc: "Targeted campaigns reaching the right customers across Rawalpindi and Islamabad." },
      { name: "Google Ads", desc: "Show up at the top when high-intent customers search for your product or service." },
      { name: "Website & Shopify Development", desc: "Fast, mobile-friendly websites and online stores that sell around the clock." },
      { name: "Social Media Management", desc: "Consistent Urdu & English content that builds trust and a loyal local following." },
      { name: "Branding & Graphic Design", desc: "A professional identity and creative that make your Rawalpindi business stand out." },
    ],
    faqs: [
      { q: "Do you work with businesses in Rawalpindi?", a: "Yes. HaadinGlobal works with businesses across Rawalpindi and the twin cities — retail, wholesale, trade, real estate, restaurants and services — managed online with fast WhatsApp support." },
      { q: "Can you help my retail or wholesale business?", a: "Absolutely. We build targeted campaigns and simple online systems to help Rawalpindi's retail, wholesale and trade businesses reach more buyers." },
      { q: "How much does digital marketing cost in Rawalpindi?", a: "It depends on your goals and scope. Packages start affordably and scale as you grow, plus your ad budget. Book a free consultation for an exact quote." },
      { q: "How quickly will I see results?", a: "Paid ads usually show results within 2-4 weeks; SEO builds over 3-6 months. You get a clear timeline first." },
      { q: "Do you run campaigns in Urdu and English?", a: "Yes — both, so you connect with your full Rawalpindi and twin-cities audience." },
    ],
    priceNote: "Affordable local packages + ad budget",
  },
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
