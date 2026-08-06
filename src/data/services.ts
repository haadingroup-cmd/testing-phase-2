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
  basePrice: number;
  /** Pakistan price in PKR per month. */
  pricePkr: number;
  /** International price in USD per month. */
  priceUsd: number;
  results?: string;
}

export const SERVICES: Service[] = [
  {
    id: "meta-ads",
    title: "Meta Ads",
    titleAr: "إعلانات ميتا",
    shortDesc: "Hyper-targeted campaigns with 6x+ ROAS for Pakistani businesses.",
    shortDescAr: "حملات دقيقة الاستهداف بعائد استثمار 6x+ للشركات الباكستانية.",
    fullDesc: "Complete Meta Ads management: audience research, ad creative design, campaign setup, A/B testing, retargeting, and weekly ROAS optimization.",
    icon: "🎯",
    category: "Paid Ads",
    features: ["Audience Research","Ad Creative Design","Campaign Setup","A/B Testing","Retargeting","Pixel Setup","Catalog Ads","Weekly Reports"],
    color: "from-red-500 to-rose-700",
    basePrice: 399,
    pricePkr: 15000,
    priceUsd: 54,
    results: "Avg 4x+ ROAS",
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
    basePrice: 399,
    pricePkr: 25000,
    priceUsd: 91,
    results: "Avg 4.8x ROAS",
  },
  {
    id: "seo",
    title: "SEO Services",
    titleAr: "خدمات تحسين محركات البحث",
    shortDesc: "Dominate search rankings and drive organic traffic that converts.",
    shortDescAr: "تصدّر نتائج البحث واجذب زيارات عضوية تتحول إلى عملاء.",
    fullDesc: "Comprehensive SEO combining technical excellence, authoritative content, and precision link-building for long-term organic growth.",
    icon: "🔍",
    category: "Marketing",
    features: ["Keyword Research","On-Page SEO","Technical Audit","Link Building","Local SEO","Schema Markup","Core Web Vitals","Monthly Reports"],
    color: "from-red-400 to-red-700",
    basePrice: 299,
    pricePkr: 35000,
    priceUsd: 127,
    results: "+340% avg traffic",
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
    basePrice: 299,
    pricePkr: 30000,
    priceUsd: 109,
    results: "Avg 3x engagement",
  },
  {
    id: "youtube-automation",
    title: "YouTube Automation",
    titleAr: "أتمتة قناة يوتيوب",
    shortDesc: "Build a passive income YouTube channel on complete autopilot.",
    shortDescAr: "أنشئ قناة منتجة تحقق دخلاً سلبيًا وتنمو تلقائيًا.",
    fullDesc: "Full channel management — niche research, scriptwriting, video production, SEO optimization, thumbnails, and monetization strategy.",
    icon: "▶️",
    category: "Technology",
    features: ["Channel Setup","Niche Research","Script Writing","Video Editing","Thumbnail Design","SEO Optimization","Monetization","Analytics"],
    color: "from-red-500 to-rose-600",
    basePrice: 499,
    pricePkr: 40000,
    priceUsd: 145,
    results: "0→25K subscribers avg",
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
    basePrice: 999,
    pricePkr: 80000,
    priceUsd: 291,
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
    basePrice: 799,
    pricePkr: 25000,
    priceUsd: 91,
    results: "Avg 4.5x order growth",
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
    basePrice: 499,
    pricePkr: 50000,
    priceUsd: 182,
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
    basePrice: 1499,
    pricePkr: 80000,
    priceUsd: 291,
    results: "80% less manual work",
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
    basePrice: 199,
    pricePkr: 30000,
    priceUsd: 109,
    results: "Top Google rankings",
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
    basePrice: 349,
    pricePkr: 15000,
    priceUsd: 54,
    results: "Avg 500K+ views/mo",
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
    basePrice: 199,
    pricePkr: 10000,
    priceUsd: 36,
    results: "Premium quality designs",
  },
];

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
      a: `${title} at HaadinGlobal starts from PKR ${svc.pricePkr.toLocaleString()}/month for Pakistani businesses (around $${svc.priceUsd}/month for international clients), plus any ad budget. The exact price depends on your goals and scope — book a free consultation for a tailored quote.`,
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
  ];
}
