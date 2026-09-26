export interface Service {
  id: string;
  title: string;
  titleAr?: string;
  shortDesc: string;
  shortDescAr?: string;
  fullDesc: string;
  icon: string;
  category: string;
  features: string[];
  color: string;
  /** "monthly" retainer, or a "one-time" project fee. */
  billing: "monthly" | "one-time";
  /** Pakistan starting price in PKR (per month, or per project if one-time). */
  pricePkr: number;
  /** International starting price in USD (per month, or per project if one-time). */
  priceUsd: number;
  results?: string;
}

export const SERVICES: Service[] = [
  {
    id: "meta-ads",
    title: "Meta Ads",
    titleAr: "إعلانات ميتا",
    shortDesc: "Hyper-targeted Facebook & Instagram campaigns that turn ad spend into real leads and sales.",
    shortDescAr: "حملات دقيقة الاستهداف بعائد استثمار 6x+ للشركات الباكستانية.",
    fullDesc: "Complete Meta Ads management: audience research, ad creative design, campaign setup, A/B testing, retargeting, and weekly ROAS optimization.",
    icon: "🎯",
    category: "Paid Ads",
    features: ["Audience Research","Ad Creative Design","Campaign Setup","A/B Testing","Retargeting","Pixel Setup","Catalog Ads","Weekly Reports"],
    color: "from-red-500 to-rose-700",
    billing: "monthly",
    pricePkr: 15000,
    priceUsd: 200,
    results: "ROI-focused campaigns",
  },
  {
    id: "google-ads",
    title: "Google Ads",
    titleAr: "إعلانات جوجل",
    shortDesc: "Capture high-intent buyers at the exact moment they search.",
    shortDescAr: "اجذب المشترين المهتمين في اللحظة المناسبة عند البحث.",
    fullDesc: "Strategic Google Search, Display, Shopping, and YouTube campaigns with precision targeting and smart bidding for maximum ROI.",
    icon: "📊",
    category: "Paid Ads",
    features: ["Search Campaigns","Display Ads","Shopping Ads","YouTube Ads","Smart Bidding","Conversion Tracking","Remarketing","Performance Max"],
    color: "from-orange-400 to-red-500",
    billing: "monthly",
    pricePkr: 25000,
    priceUsd: 250,
    results: "High-intent conversions",
  },
  {
    id: "seo",
    title: "SEO Services",
    titleAr: "خدمات تحسين محركات البحث",
    shortDesc: "Dominate search rankings and drive organic traffic that converts.",
    shortDescAr: "تصدّر نتائج البحث واجذب زيارات عضوية تتحول إلى عملاء.",
    fullDesc: "HaadinGlobal provides expert SEO services in Pakistan — combining technical SEO, keyword research, authoritative content and precision link-building to rank your business on Google and drive organic traffic that converts. As dedicated SEO experts, we focus on local and national rankings that bring real, long-term leads.",
    icon: "🔍",
    category: "Marketing",
    features: ["Keyword Research","On-Page SEO","Technical Audit","Link Building","Local SEO","Schema Markup","Core Web Vitals","Monthly Reports"],
    color: "from-red-400 to-red-700",
    billing: "monthly",
    pricePkr: 35000,
    priceUsd: 500,
    results: "Sustainable organic growth",
  },
  {
    id: "social-media",
    title: "Social Media Management",
    titleAr: "إدارة وسائل التواصل الاجتماعي",
    shortDesc: "Build an engaged community and amplify your brand voice.",
    shortDescAr: "ابنِ مجتمعًا متفاعلاً وعزّز صوت علامتك التجارية.",
    fullDesc: "Strategic content creation, scheduling, community management, and growth across Facebook, Instagram, TikTok, LinkedIn.",
    icon: "📱",
    category: "Marketing",
    features: ["Content Calendar","Custom Graphics","Reels & Stories","Community Management","Growth Strategy","Analytics","Hashtag Research","Competitor Analysis"],
    color: "from-pink-400 to-rose-600",
    billing: "monthly",
    pricePkr: 30000,
    priceUsd: 500,
    results: "Higher engagement & reach",
  },
  {
    id: "youtube-channel-management",
    title: "YouTube Channel Management",
    titleAr: "إدارة قناة يوتيوب",
    shortDesc: "Grow your business's YouTube channel with consistent, search-optimised videos.",
    shortDescAr: "نمِّ قناة يوتيوب لعملك بمقاطع فيديو منتظمة ومحسّنة للبحث.",
    fullDesc: "Complete YouTube channel management for businesses — content strategy, scripting, video editing, thumbnails, YouTube SEO and monthly analytics.",
    icon: "▶️",
    category: "Marketing",
    features: ["Channel Setup & Branding","Content Strategy","Script Writing","Video Editing","Thumbnail Design","YouTube SEO","Upload Scheduling","Monthly Analytics"],
    color: "from-red-500 to-rose-600",
    billing: "monthly",
    pricePkr: 40000,
    priceUsd: 300,
    results: "Built to grow your channel",
  },
  {
    id: "web-development",
    title: "Web Development",
    titleAr: "تطوير المواقع",
    shortDesc: "Blazing-fast, conversion-optimized websites built to impress.",
    shortDescAr: "مواقع سريعة وحديثة محسّنة لتحويل الزوار إلى عملاء.",
    fullDesc: "Custom websites using Next.js, React — from corporate sites to complex web applications, fully SEO optimized and mobile-first.",
    icon: "💻",
    category: "Technology",
    features: ["Custom Design","Next.js / React","Mobile-First","SEO Optimized","CMS Integration","Performance Optimization","Contact Forms","Analytics Setup"],
    color: "from-cyan-400 to-blue-600",
    billing: "one-time",
    pricePkr: 80000,
    priceUsd: 500,
    results: "100% mobile-optimized",
  },
  {
    id: "shopify",
    title: "Shopify Store",
    titleAr: "متجر شوبيفاي",
    shortDesc: "Premium eCommerce stores engineered to sell 24/7.",
    shortDescAr: "متجر إلكتروني احترافي جاهز للبيع مع تكامل كامل.",
    fullDesc: "Full Shopify store build — product setup, theme customization, payment gateway, apps integration, and conversion optimization.",
    icon: "🛍️",
    category: "Technology",
    features: ["Custom Theme","Product Setup","Payment Gateway","Inventory System","App Integration","Funnel Optimization","Mobile Optimization","Analytics"],
    color: "from-green-400 to-emerald-700",
    billing: "one-time",
    pricePkr: 25000,
    priceUsd: 400,
    results: "Built to grow online sales",
  },
  {
    id: "branding",
    title: "Branding & Design",
    titleAr: "الهوية والتصميم",
    shortDesc: "Craft a brand identity that commands attention and builds trust.",
    shortDescAr: "هوية بصرية متكاملة تُميز علامتك التجارية وتلهم الثقة.",
    fullDesc: "Complete brand strategy and visual identity — logo, color palette, typography, brand guidelines, and all brand touchpoints.",
    icon: "✨",
    category: "Design",
    features: ["Logo Design","Brand Strategy","Color System","Typography","Brand Guidelines","Stationery Design","Social Kit","Brand Assets"],
    color: "from-amber-400 to-orange-500",
    billing: "one-time",
    pricePkr: 50000,
    priceUsd: 500,
    results: "Professional brand identity",
  },
  {
    id: "ai-automation",
    title: "AI Automation",
    titleAr: "أتمتة الذكاء الاصطناعي",
    shortDesc: "Automate business workflows and scale with intelligent AI.",
    shortDescAr: "روبوتات وأنظمة ذكية توفر الوقت وتزيد التحويلات.",
    fullDesc: "Custom AI-powered automation — chatbots, CRM integration, lead nurturing, email sequences, and workflow automation.",
    icon: "🤖",
    category: "Technology",
    features: ["Chatbot Development","Workflow Automation","CRM Integration","Lead Nurturing","Email Sequences","WhatsApp Bot","Data Pipelines","AI Tools"],
    color: "from-violet-500 to-purple-700",
    billing: "one-time",
    pricePkr: 80000,
    priceUsd: 500,
    results: "Less repetitive manual work",
  },
  {
    id: "content-writing",
    title: "Content Writing",
    titleAr: "كتابة المحتوى",
    shortDesc: "SEO-optimized words that rank, resonate, and drive action.",
    shortDescAr: "محتوى يجذب الجمهور ويعزز ترتيبك في محركات البحث.",
    fullDesc: "Strategic content for authority building and SEO — blog articles, website copy, ad copy, email sequences, social media copy.",
    icon: "✍️",
    category: "Content",
    features: ["SEO Blog Writing","Website Copy","Email Sequences","Ad Copywriting","Social Media Copy","Content Strategy","Product Descriptions","Press Releases"],
    color: "from-teal-400 to-cyan-600",
    billing: "monthly",
    pricePkr: 30000,
    priceUsd: 500,
    results: "Content built to rank",
  },
  {
    id: "tiktok-ads",
    title: "TikTok Ads",
    titleAr: "إعلانات تيك توك",
    shortDesc: "Viral-ready TikTok campaigns that explode brand awareness.",
    shortDescAr: "محتوى فيروسي يصل إلى ملايين المشاهدات بميزانية ذكية.",
    fullDesc: "Creative TikTok video ads, influencer-style content, and precise audience targeting for viral reach and measurable results.",
    icon: "🎬",
    category: "Paid Ads",
    features: ["Video Ad Creation","In-Feed Ads","Brand Takeover","TikTok Pixel","Audience Targeting","Creator Marketplace","Hashtag Challenges","Analytics"],
    color: "from-pink-500 to-fuchsia-700",
    billing: "monthly",
    pricePkr: 15000,
    priceUsd: 250,
    results: "Built for viral reach",
  },
  {
    id: "graphic-design",
    title: "Graphic Design",
    titleAr: "التصميم الجرافيكي",
    shortDesc: "Visually stunning designs that communicate and convert.",
    shortDescAr: "تصاميم احترافية للسوشيال ميديا والمطبوعات تجذب الانتباه.",
    fullDesc: "Social media graphics, marketing collateral, infographics, and print — eye-catching designs that make your brand unforgettable.",
    icon: "🎨",
    category: "Design",
    features: ["Social Media Graphics","Marketing Materials","Infographics","Presentation Design","Print Design","Ad Creatives","Digital Assets","Packaging"],
    color: "from-amber-400 to-orange-500",
    billing: "monthly",
    pricePkr: 10000,
    priceUsd: 300,
    results: "Premium quality designs",
  },
];

/**
 * Single source for how a service price is phrased, so every page, the
 * structured data and llms.txt say exactly the same thing.
 */
export function billingSuffix(svc: Service): string {
  return svc.billing === "monthly" ? "/mo" : " one-time";
}

/** Short terms shown under a price. Null when nothing extra applies. */
export function priceTerms(svc: Service): string | null {
  if (svc.category === "Paid Ads") return "Ad spend is separate and paid directly to the platform.";
  if (svc.billing === "one-time") return "Free revisions until delivery. Later changes and maintenance are quoted separately.";
  return null;
}

const MONTHLY = SERVICES.filter((s) => s.billing === "monthly");
/** Lowest monthly price in each market — the honest "starts from" figure. */
export const STARTING_PRICE = {
  pkr: Math.min(...MONTHLY.map((s) => s.pricePkr)),
  usd: Math.min(...MONTHLY.map((s) => s.priceUsd)),
};

function pricePhrase(svc: Service): string {
  const pkr = svc.pricePkr.toLocaleString();
  return svc.billing === "monthly"
    ? `starts from PKR ${pkr}/month in Pakistan and $${svc.priceUsd}/month for international clients`
    : `is a one-time project starting from PKR ${pkr} in Pakistan and $${svc.priceUsd} for international clients`;
}

/**
 * A short, direct "quick answer" paragraph for AEO -- structured so AI
 * Overviews, ChatGPT and featured snippets can lift a clean, quotable
 * summary of the service straight from the page. Auto-generated from
 * existing service data (no separate content to keep in sync).
 */
export function serviceQuickAnswer(svc: Service): string {
  const priceLine = `${svc.title} ${pricePhrase(svc)}.`;
  return `${svc.title} at HaadinGlobal means ${svc.fullDesc.charAt(0).toLowerCase()}${svc.fullDesc.slice(1)} ${priceLine}`;
}

/**
 * AEO/GEO — generates snippet-ready FAQs per service.
 * -------------------------------------------------------------
 * 2026 answer-engine best practice: question-format headings + concise,
 * definitive 40–60 word answers that AI Overviews / People Also Ask can
 * extract directly. Built from each service's real data so every one of the
 * 12 service pages ships unique, factual Q&A (and FAQPage structured data).
 */
export function serviceFaqs(svc: Service): { q: string; a: string }[] {
  const title = svc.title.replace(/ Services?$/i, "");
  const resultLine = svc.results ? ` Clients typically see results like ${svc.results.toLowerCase()}.` : "";
  return [
    {
      q: `How much does ${title} cost in Pakistan?`,
      a: `${title} at HaadinGlobal ${pricePhrase(svc)}.${svc.category === "Paid Ads" ? " Ad spend is separate and paid directly to the platform." : ""} The exact price depends on your goals and scope — book a free consultation for a tailored quote.`,
    },
    {
      q: `What does your ${title} service include?`,
      a: `Our ${title} service covers ${svc.features.slice(0, 5).join(", ")} and more. Everything is managed by specialists and reported regularly, so you always know exactly what's being done and what results it's driving.${resultLine}`,
    },
    {
      q: `How long until I see results from ${title}?`,
      a: svc.category === "Paid Ads"
        ? `Paid campaigns like ${title} usually show measurable results within 2–4 weeks as we test and optimise. We share a clear timeline and regular performance reports from the start.`
        : `${title} builds over time — typically meaningful results in 1–3 months, with SEO and organic work compounding over 3–6 months. We set clear expectations before we begin.`,
    },
    {
      q: `Do you offer ${title} for international clients?`,
      a: `Yes. HaadinGlobal is based in Sahiwal, Pakistan and delivers ${title} to clients across Pakistan, the UAE, Qatar, Saudi Arabia, the UK and the USA. Everything is managed remotely with fast communication across time zones.`,
    },
    {
      q: `Why choose HaadinGlobal for ${title}?`,
      a: `We combine international-level expertise with ROI-focused execution — every ${title} campaign is data-backed and optimised for real business growth, not vanity metrics. We've served businesses and report on the KPIs that actually matter to you.`,
    },
    svc.billing === "one-time"
      ? {
          q: `Is ${title} a one-time cost?`,
          a: `Yes. ${title} is a one-time project fee, not a monthly contract. Revisions are free until the project is delivered; any changes or maintenance after delivery are quoted separately based on the work needed.`,
        }
      : {
          q: `Do I need a long-term contract for ${title}?`,
          a: `No. We recommend a 3-month minimum for ${title} so there's enough time to see meaningful results, but after that it's month-to-month — no long lock-in contracts. Most clients stay long-term because of results, not because they're locked in.`,
        },
    {
      q: `How do you measure success for ${title}?`,
      a: `We track the metrics that actually matter for ${title} — leads, sales, ROAS or rankings, depending on the service — not vanity numbers like impressions or likes. You get a dedicated dashboard and regular reports so you always know exactly how it's performing.`,
    },
  ];
}
