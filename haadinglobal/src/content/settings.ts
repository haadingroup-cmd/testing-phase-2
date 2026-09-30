import type { SiteSettings } from "@/types";

/** Default business settings. Editable in /admin/settings once seeded. */
export const DEFAULT_SETTINGS: SiteSettings = {
  companyName: "HaadinGlobal",
  tagline: "Digital Marketing & Technology Agency",
  description:
    "HaadinGlobal combines strategy, creativity, paid media, SEO, technology and AI automation to build digital systems that generate measurable growth for businesses in Pakistan, the Gulf, the UK and the USA.",
  email: "haadinglobal@gmail.com",
  phone: "+92 305 4782677",
  whatsapp: "923054782677",
  whatsappMessage: "Hello HaadinGlobal, I would like to discuss your digital marketing services.",
  address: "Sahiwal, Punjab, Pakistan",
  city: "Sahiwal",
  region: "Punjab",
  country: "PK",
  founderName: "Muhammad Haseeb",
  founderTitle: "Founder & CEO — HaadinGlobal",
  founderImage: "/images/founder.webp",
  founderQuote:
    "Businesses deserve digital marketing that is transparent, measurable and relentlessly focused on real growth — not vanity metrics.",
  responseTime: "< 24h",
  markets: ["Pakistan", "UAE", "Saudi Arabia", "Qatar", "UK", "USA"],
  stats: [
    { icon: "rocket_launch", value: "60+", label: "Projects Delivered" },
    { icon: "verified", value: "20+", label: "Happy Clients" },
    { icon: "public", value: "6", label: "Markets Served" },
    { icon: "handshake", value: "90%", label: "Client Retention" },
    { icon: "trending_up", value: "4x", label: "Typical Meta Ads ROAS" },
    { icon: "schedule", value: "< 24h", label: "Response Time" },
  ],
  social: {
    facebook: "https://web.facebook.com/haadinglobal",
    instagram: "https://www.instagram.com/haadinglobal/",
    linkedin: "https://www.linkedin.com/in/haadinglobal/",
    tiktok: "https://www.tiktok.com/@haadinglobal",
    youtube: "https://www.youtube.com/@haadinglobal",
    clutch: "https://clutch.co/profile/haadinglobal",
  },
};

export const MARKET_FLAGS: Record<string, string> = {
  Pakistan: "🇵🇰",
  UAE: "🇦🇪",
  "Saudi Arabia": "🇸🇦",
  Qatar: "🇶🇦",
  UK: "🇬🇧",
  USA: "🇺🇸",
};
