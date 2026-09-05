export type Lang = "en" | "ar";

export const LANGS: Record<Lang, { name: string; native: string; flag: string; dir: "ltr" | "rtl" }> = {
  en: { name: "English", native: "English", flag: "🇬🇧", dir: "ltr" },
  ar: { name: "Arabic",  native: "العربية",  flag: "🇸🇦", dir: "rtl" },
};

export const ARABIC_COUNTRIES = ["AE","SA","QA","KW","BH","OM","EG","JO","IQ","LB","SY","YE","LY","TN","DZ","MA","SD"];

export function detectLangFromCountry(cc: string): Lang {
  return ARABIC_COUNTRIES.includes(cc.toUpperCase()) ? "ar" : "en";
}

export const T: Record<Lang, Record<string, string>> = {
  en: {
    // Nav
    nav_home: "Home",
    nav_services: "Services",
    nav_portfolio: "Portfolio",
    nav_courses: "Courses",
    nav_pricing: "Pricing",
    nav_about: "About",
    nav_blog: "Blog",
    nav_contact: "Contact",
    nav_cta: "Free Consultation",
    // Hero
    hero_badge: "Grow Your Business Online",
    hero_h1a: "Pakistan's Results-Driven",
    hero_h1b: "Digital Marketing Agency",
    hero_sub: "HaadinGlobal is a digital marketing agency in Pakistan helping businesses grow with Meta Ads, Google Ads, SEO, Shopify and web development — with real, measurable ROI, locally and worldwide.",
    hero_cta1: "Book Free Consultation",
    hero_cta2: "WhatsApp Us",
    // Sections
    services_title: "Our Services",
    services_sub: "Complete digital growth stack — from paid ads to AI automation",
    portfolio_title: "Real Results, Real Clients",
    portfolio_sub: "Businesses achieving measurable growth",
    testimonials_title: "What Our Clients Say",
    courses_title: "Master Digital Skills",
    pricing_title: "Simple, Transparent Pricing",
    about_title: "The Agency Built for Global Growth",
    // Stats
    stats_projects: "Projects Delivered",
    stats_clients: "Happy Clients",
    stats_retention: "Client Retention",
    stats_roas: "Avg Ad ROAS",
    stats_countries: "Countries Served",
    stats_revenue: "Revenue Generated",
    // CTA
    cta_get_started: "Get Started",
    cta_learn_more: "Learn More",
    cta_view_all: "View All",
    cta_book_free: "Book Free Consultation",
    cta_whatsapp: "WhatsApp Now",
    // Form
    form_name: "Your Name",
    form_email: "Email Address",
    form_phone: "Phone / WhatsApp",
    form_service: "Service Interested In",
    form_budget: "Monthly Budget",
    form_message: "Your Message",
    form_submit: "Send Message",
    form_sending: "Sending...",
    form_success: "Message received! Our team will contact you within 24 hours.",
    // Calculator
    calc_title: "Build Your Custom Package",
    calc_sub: "Select services & get an instant price estimate",
    calc_step1: "Select Services",
    calc_step2: "Budget Range",
    calc_step3: "Timeline",
    calc_btn: "Calculate My Package",
    calc_result_title: "Your Estimate",
    calc_proposal: "Get Detailed Proposal",
    calc_monthly_inv: "Estimated Monthly Investment",
    calc_included: "Included Services",
    calc_roadmap: "Roadmap Preview",
    // Footer
    footer_rights: "All rights reserved",
    footer_made: "Built with ❤️ in Pakistan",
  },
  ar: {
    // Nav
    nav_home: "الرئيسية",
    nav_services: "الخدمات",
    nav_portfolio: "أعمالنا",
    nav_courses: "الدورات",
    nav_pricing: "الأسعار",
    nav_about: "من نحن",
    nav_blog: "المدونة",
    nav_contact: "تواصل",
    nav_cta: "استشارة مجانية",
    // Hero
    hero_badge: "وكالة تسويق رقمي قائمة على النتائج",
    hero_h1a: "نمّ أعمالك",
    hero_h1b: "إلى المستوى التالي",
    hero_sub: "شركات في باكستان والإمارات والمملكة المتحدة والولايات المتحدة والسعودية تحقق عائداً حقيقياً مع ميتا وجوجل والسيو.",
    hero_cta1: "استشارة مجانية",
    hero_cta2: "واتساب",
    // Sections
    services_title: "خدماتنا",
    services_sub: "حزمة نمو رقمية كاملة — من الإعلانات المدفوعة إلى أتمتة الذكاء الاصطناعي",
    portfolio_title: "نتائج حقيقية، عملاء حقيقيون",
    portfolio_sub: "شركات تحقق نمواً قابلاً للقياس",
    testimonials_title: "ماذا يقول عملاؤنا",
    courses_title: "أتقن المهارات الرقمية",
    pricing_title: "أسعار بسيطة وشفافة",
    about_title: "الوكالة المبنية للنمو العالمي",
    // Stats
    stats_projects: "مشروع منجز",
    stats_clients: "عميل سعيد",
    stats_retention: "معدل الاحتفاظ",
    stats_roas: "متوسط العائد على الإعلانات",
    stats_countries: "دولة نخدمها",
    stats_revenue: "عائد محقق",
    // CTA
    cta_get_started: "ابدأ الآن",
    cta_learn_more: "اعرف المزيد",
    cta_view_all: "عرض الكل",
    cta_book_free: "احجز استشارة مجانية",
    cta_whatsapp: "واتساب الآن",
    // Form
    form_name: "اسمك",
    form_email: "البريد الإلكتروني",
    form_phone: "الهاتف / واتساب",
    form_service: "الخدمة المطلوبة",
    form_budget: "الميزانية الشهرية",
    form_message: "رسالتك",
    form_submit: "إرسال",
    form_sending: "جارٍ الإرسال...",
    form_success: "تم استلام رسالتك! سيتواصل معك فريقنا خلال 24 ساعة.",
    // Calculator
    calc_title: "ابنِ حزمتك المخصصة",
    calc_sub: "اختر الخدمات واحصل على تقدير فوري للسعر",
    calc_step1: "اختر الخدمات",
    calc_step2: "نطاق الميزانية",
    calc_step3: "الجدول الزمني",
    calc_btn: "احسب حزمتي",
    calc_result_title: "تقديرك",
    calc_proposal: "احصل على عرض مفصّل",
    calc_monthly_inv: "الاستثمار الشهري المقدّر",
    calc_included: "الخدمات المشمولة",
    calc_roadmap: "معاينة خريطة الطريق",
    // Footer
    footer_rights: "جميع الحقوق محفوظة",
    footer_made: "صُنع بـ ❤️ في باكستان",
  },
};
