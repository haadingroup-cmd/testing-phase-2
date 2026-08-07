import type { Metadata } from "next";
import { inter, playfair, notoArabic } from "./fonts";
import "../styles/globals.css";
import SiteChrome from "@/components/layout/SiteChrome";
import { LanguageProvider } from "@/components/providers/LanguageProvider";
import { ThemeProvider, themeInitScript } from "@/components/providers/ThemeProvider";
import Analytics from "@/components/analytics/Analytics";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.haadinglobal.com"),
  title: {
    default: "HaadinGlobal — Results-Driven Digital Marketing Agency | Meta Ads, SEO, YouTube Automation",
    template: "%s | HaadinGlobal",
  },
  description:
    "HaadinGlobal — results-driven digital marketing agency. Meta Ads, Google Ads, SEO, YouTube Automation, Shopify & AI automation. Real results for businesses in Pakistan, UAE, UK & USA.",
  keywords: [
    "digital marketing agency Pakistan","digital marketing agency Sahiwal",
    "Meta Ads agency Pakistan","Google Ads Pakistan","SEO services Pakistan",
    "social media marketing Pakistan","Shopify development Pakistan",
    "YouTube automation","lead generation agency Pakistan","HaadinGlobal",
  ],
  authors: [{ name: "HaadinGlobal", url: "https://www.haadinglobal.com" }],
  creator: "HaadinGlobal",
  openGraph: {
    type: "website", locale: "en_PK",
    url: "https://www.haadinglobal.com",
    siteName: "HaadinGlobal",
    title: "HaadinGlobal — Results-Driven Digital Marketing Agency",
    description: "Meta Ads, Google Ads, SEO, YouTube Automation, Shopify & AI. Serving businesses in Pakistan, UAE, UK & USA.",
    images: [{ url: "/logo.png", width: 1200, height: 630, alt: "HaadinGlobal Digital Agency" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "HaadinGlobal — Results-Driven Digital Marketing Agency",
    description: "Meta Ads, Google Ads, SEO, YouTube Automation & more. Proven results.",
    creator: "@haadinglobal",
  },
  robots: { index: true, follow: true },
  verification: {
    google: "TsWZj-bZ3ii9Q_Rfk9AoI1eFzagPGWpyqPoFjMJ_M7A",
  },
  alternates: { canonical: "https://www.haadinglobal.com" },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": "https://www.haadinglobal.com/#org",
      name: "HaadinGlobal",
      alternateName: "HaadinGlobal Digital Marketing Agency",
      url: "https://www.haadinglobal.com",
      logo: "https://www.haadinglobal.com/logo.png",
      image: "https://www.haadinglobal.com/logo.png",
      foundingDate: "2025",
      slogan: "Results-driven digital marketing that turns ad spend into real revenue.",
      description: "Results-driven digital marketing agency offering Meta Ads, Google Ads, SEO, social media marketing, Shopify & web development, YouTube automation and AI automation for businesses in Pakistan and worldwide.",
      knowsAbout: [
        "Meta Ads", "Facebook Advertising", "Google Ads", "Search Engine Optimization",
        "Local SEO", "Social Media Marketing", "Shopify Development", "Web Development",
        "YouTube Automation", "Lead Generation", "Branding", "AI Automation", "eCommerce Marketing",
      ],
      foundingLocation: { "@type": "Place", name: "Sahiwal, Pakistan" },
      address: {
        "@type": "PostalAddress",
        streetAddress: "M439+5P4, Pakpattan Chowk Flyover, near New Bulbul Hotel, Canal View Town",
        addressLocality: "Sahiwal",
        addressRegion: "Punjab",
        postalCode: "57000",
        addressCountry: "PK",
      },
      contactPoint: { "@type": "ContactPoint", telephone: "+92-305-4782677", contactType: "customer service", email: "haadinglobal@gmail.com" },
      areaServed: [
        { "@type": "Country", name: "Pakistan" },
        { "@type": "Country", name: "United Arab Emirates" },
        { "@type": "Country", name: "Qatar" },
        { "@type": "Country", name: "Saudi Arabia" },
        { "@type": "Country", name: "United Kingdom" },
        { "@type": "Country", name: "United States" },
      ],
      sameAs: [
        "https://web.facebook.com/haadinglobal",
        "https://www.instagram.com/haadinglobal",
        "https://www.tiktok.com/@haadinglobal",
        "https://www.linkedin.com/in/haadinglobal",
        "https://www.youtube.com/@haadinglobal",
      ],
    },
    {
      "@type": "WebSite",
      "@id": "https://www.haadinglobal.com/#website",
      url: "https://www.haadinglobal.com",
      name: "HaadinGlobal",
      publisher: { "@id": "https://www.haadinglobal.com/#org" },
    },
    {
      "@type": "ProfessionalService",
      "@id": "https://www.haadinglobal.com/#localbusiness",
      name: "HaadinGlobal — Digital Marketing Agency",
      image: "https://www.haadinglobal.com/logo.png",
      url: "https://www.haadinglobal.com",
      telephone: "+92-305-4782677",
      email: "haadinglobal@gmail.com",
      priceRange: "$$",
      parentOrganization: { "@id": "https://www.haadinglobal.com/#org" },
      address: {
        "@type": "PostalAddress",
        streetAddress: "M439+5P4, Pakpattan Chowk Flyover, near New Bulbul Hotel, Canal View Town",
        addressLocality: "Sahiwal",
        addressRegion: "Punjab",
        postalCode: "57000",
        addressCountry: "PK",
      },
      areaServed: [
        { "@type": "Country", name: "Pakistan" },
        { "@type": "Country", name: "United Arab Emirates" },
        { "@type": "Country", name: "Qatar" },
        { "@type": "Country", name: "Saudi Arabia" },
        { "@type": "Country", name: "United Kingdom" },
        { "@type": "Country", name: "United States" },
      ],
      geo: { "@type": "GeoCoordinates", latitude: 30.6641, longitude: 73.1114 },
      hasMap: "https://www.google.com/maps?q=HaadinGlobal+Sahiwal",
      openingHoursSpecification: [
        {
          "@type": "OpeningHoursSpecification",
          dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
          opens: "09:00",
          closes: "17:00",
        },
      ],
      sameAs: [
        "https://web.facebook.com/haadinglobal",
        "https://www.instagram.com/haadinglobal",
        "https://www.tiktok.com/@haadinglobal",
        "https://www.linkedin.com/in/haadinglobal",
        "https://www.youtube.com/@haadinglobal",
      ],
    },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      data-theme="dark"
      suppressHydrationWarning
      className={`${inter.variable} ${playfair.variable} ${notoArabic.variable}`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" type="image/png" href="/favicon.png" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#dc2626" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body>
        <Analytics />
        <ThemeProvider>
          <LanguageProvider>
            <SiteChrome>{children}</SiteChrome>
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
