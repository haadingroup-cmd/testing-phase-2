import type { Metadata } from "next";
import { inter, playfair, notoArabic } from "./fonts";
import "../styles/globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import WhatsAppButton from "@/components/common/WhatsAppButton";
import { LanguageProvider } from "@/components/providers/LanguageProvider";
import { ThemeProvider, themeInitScript } from "@/components/providers/ThemeProvider";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.haadinglobal.com"),
  title: {
    default: "HaadinGlobal — Results-Driven Digital Marketing Agency | Meta Ads, SEO, YouTube Automation",
    template: "%s | HaadinGlobal",
  },
  description:
    "HaadinGlobal — results-driven digital marketing agency. Meta Ads, Google Ads, SEO, YouTube Automation, Shopify & AI automation. Proven results for 150+ clients in Pakistan, UAE, UK, USA.",
  keywords: [
    "digital marketing agency Pakistan","Meta Ads Pakistan","Google Ads Pakistan",
    "SEO Pakistan","YouTube automation","Shopify Pakistan","HaadinGlobal",
    "digital marketing Faisalabad","best digital agency Pakistan",
  ],
  authors: [{ name: "HaadinGlobal", url: "https://www.haadinglobal.com" }],
  creator: "HaadinGlobal",
  openGraph: {
    type: "website", locale: "en_PK",
    url: "https://www.haadinglobal.com",
    siteName: "HaadinGlobal",
    title: "HaadinGlobal — Results-Driven Digital Marketing Agency",
    description: "Meta Ads, Google Ads, SEO, YouTube Automation, Shopify & AI. 150+ happy clients worldwide.",
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
      url: "https://www.haadinglobal.com",
      logo: "https://www.haadinglobal.com/logo.png",
      foundingDate: "2020",
      description: "Results-driven digital marketing agency offering Meta Ads, Google Ads, SEO, web development and more.",
      address: { "@type": "PostalAddress", addressLocality: "Faisalabad", addressRegion: "Punjab", addressCountry: "PK" },
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
        <ThemeProvider>
          <LanguageProvider>
            <Navbar />
            <main id="main">{children}</main>
            <Footer />
            <WhatsAppButton />
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
