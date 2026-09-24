export const SITE = {
  name: "HaadinGlobal",
  tagline: "Global Digital Excellence",
  url: "https://www.haadinglobal.com",
  phone: "+92 305 4782677",
  phoneClean: "+923054782677",
  whatsapp: "923054782677",
  email: "haadinglobal@gmail.com",
  emailInfo: "haadinglobal@gmail.com",
  formspree: "mbdwvpyp",
    social: {
    facebook:  "https://web.facebook.com/haadinglobal",
    tiktok:    "https://www.tiktok.com/@haadinglobal",
    whatsapp:  "https://wa.me/923054782677",
    linkedin:  "https://www.linkedin.com/in/haadinglobal/",
    instagram: "https://www.instagram.com/haadinglobal/",
    youtube:   "https://www.youtube.com/@haadinglobal",
    clutch:    "https://clutch.co/profile/haadinglobal",
  },
  address: "Sahiwal, Punjab, Pakistan",
  markets: ["Pakistan 🇵🇰","UAE 🇦🇪","Qatar 🇶🇦","Saudi Arabia 🇸🇦","United Kingdom 🇬🇧","United States 🇺🇸"],
  // Google Business Profile. Paste the profile's Share link (maps.app.goo.gl/…
  // or g.page/…) into profileUrl and the "Ask for reviews" link
  // (g.page/r/…/review) into reviewUrl. While empty, the site falls back to a
  // Google Maps search, and the profile is left out of the schema sameAs.
  gbp: {
    profileUrl: "",
    reviewUrl: "",
  },
};

const GBP_SEARCH_URL = "https://www.google.com/maps/search/?api=1&query=HaadinGlobal%20Sahiwal";
export const GBP_MAPS_URL = SITE.gbp.profileUrl || GBP_SEARCH_URL;
export const GBP_REVIEW_URL = SITE.gbp.reviewUrl || GBP_MAPS_URL;

export const NAV_SERVICES = [
  { label: "Meta Ads",           href: "/services/meta-ads",           icon: "🎯" },
  { label: "Google Ads",         href: "/services/google-ads",         icon: "📊" },
  { label: "TikTok Ads",         href: "/services/tiktok-ads",         icon: "🎬" },
  { label: "SEO Services",       href: "/services/seo",                icon: "🔍" },
  { label: "Social Media Mgmt",  href: "/services/social-media",       icon: "📱" },
  { label: "YouTube Automation", href: "/services/youtube-automation", icon: "▶️" },
  { label: "Web Development",    href: "/services/web-development",    icon: "💻" },
  { label: "Shopify Store",      href: "/services/shopify",            icon: "🛍️" },
  { label: "Branding & Design",  href: "/services/branding",           icon: "✨" },
  { label: "AI Automation",      href: "/services/ai-automation",      icon: "🤖" },
  { label: "Content Writing",    href: "/services/content-writing",    icon: "✍️" },
  { label: "Graphic Design",     href: "/services/graphic-design",     icon: "🎨" },
];

export const FOOTER_COMPANY = [
  { label: "About Us",     href: "/about" },
  { label: "Careers",      href: "/careers" },
  { label: "Case Studies", href: "/portfolio" },
  { label: "Blog",         href: "/blog" },
  { label: "Contact",      href: "/contact" },
];

export const FOOTER_SERVICES = [
  { label: "Meta Ads",           href: "/services/meta-ads" },
  { label: "Google Ads",         href: "/services/google-ads" },
  { label: "SEO Services",       href: "/services/seo" },
  { label: "Social Media",       href: "/services/social-media" },
  { label: "YouTube Automation", href: "/services/youtube-automation" },
  { label: "Web Development",    href: "/services/web-development" },
  { label: "Shopify Store",      href: "/services/shopify" },
  { label: "AI Automation",      href: "/services/ai-automation" },
];

// City/country landing pages linked site-wide from the footer. Without these
// links the /agency pages are orphans (sitemap-only) and Google leaves them
// "Discovered – currently not indexed". Kept as a small label+href list rather
// than importing LANDINGS, because the footer ships in the client bundle.
// Add a row here whenever a new landing is added to src/data/landings.ts.
export const FOOTER_AREAS = [
  { label: "Sahiwal", href: "/agency/digital-marketing-agency-sahiwal" },
  { label: "Multan", href: "/agency/digital-marketing-agency-multan" },
  { label: "Jhang", href: "/agency/digital-marketing-agency-jhang" },
  { label: "Okara", href: "/agency/digital-marketing-agency-okara" },
  { label: "Lahore", href: "/agency/digital-marketing-agency-lahore" },
  { label: "Faisalabad", href: "/agency/digital-marketing-agency-faisalabad" },
  { label: "Sargodha", href: "/agency/digital-marketing-agency-sargodha" },
  { label: "Pakpattan", href: "/agency/digital-marketing-agency-pakpattan" },
  { label: "Karachi", href: "/agency/digital-marketing-agency-karachi" },
  { label: "Islamabad", href: "/agency/digital-marketing-agency-islamabad" },
  { label: "Rawalpindi", href: "/agency/digital-marketing-agency-rawalpindi" },
  { label: "Dubai", href: "/agency/digital-marketing-agency-dubai" },
  { label: "Qatar", href: "/agency/digital-marketing-agency-qatar" },
  { label: "Saudi Arabia", href: "/agency/digital-marketing-agency-saudi-arabia" },
  { label: "UK", href: "/agency/digital-marketing-agency-uk" },
  { label: "London", href: "/agency/digital-marketing-agency-london" },
  { label: "USA", href: "/agency/digital-marketing-agency-usa" },
  { label: "New York", href: "/agency/digital-marketing-agency-new-york" },
];
