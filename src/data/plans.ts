/**
 * Pricing plans. PKR prices are shown to Pakistan visitors; USD prices are
 * shown to everyone else. Both values are stored explicitly — no auto-uplift.
 * English only — no Urdu.
 */
export const PLANS = [
  {
    name: "Basic Plan",
    tagline: "Startups & small businesses",
    badge: null as string | null,
    mo: 299, yr: 249,
    pkrMo: 15000, pkrYr: 12000,
    features: ["Facebook Page Management", "12 Social Media Posts", "Basic Graphic Design", "Monthly Report", "Google Ads", "SEO", "Video Content"],
    cta: "Get Started", href: "/consultation",
  },
  {
    name: "Standard Plan",
    tagline: "Growing brands",
    badge: "Most Popular",
    mo: 599, yr: 499,
    pkrMo: 35000, pkrYr: 30000,
    features: ["Facebook + Instagram", "20 Posts + Stories", "Professional Design", "Basic SEO (On-Page)", "Facebook Ads (Budget Separate)", "Email Marketing", "Google Ads"],
    cta: "Start Growing", href: "/consultation",
  },
  {
    name: "Pro Plan",
    tagline: "Scaling businesses",
    badge: "Professional",
    mo: 999, yr: 829,
    pkrMo: 70000, pkrYr: 58000,
    features: ["Complete Social Media", "30 Posts + Reels", "Full SEO (On + Off Page)", "Google + Facebook Ads", "Video Editing (4/month)", "WhatsApp Marketing", "Weekly Reports"],
    cta: "Go Premium", href: "/consultation",
  },
  {
    name: "Premium Plan",
    tagline: "Custom solutions",
    badge: "Elite",
    mo: null as number | null, yr: null as number | null, custom: true,
    pkrMo: 120000, pkrYr: 100000,
    features: ["Complete Digital Strategy", "Unlimited Posts", "Advanced SEO + Backlinks", "All Paid Ads", "Influencer Marketing", "E-commerce Management", "Dedicated Manager"],
    cta: "Contact Sales", href: "/contact",
  },
];
