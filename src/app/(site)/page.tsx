import { JsonLd } from "@/components/seo/JsonLd";
import { EditorialBreak, FounderSpotlight, Hero, ProcessTimeline, ServicesPreview, StatsGrid, WhyUs } from "@/components/sections/home";
import { ConsultationSection, FaqSection } from "@/components/sections/shared";
import { getFaqs, getServices, getSettings } from "@/lib/data";
import { buildMetadata } from "@/lib/seo/metadata";
import { faqSchema } from "@/lib/seo/schema";

export const revalidate = 300;

export const metadata = buildMetadata({
  title: "HaadinGlobal — Digital Marketing & Technology Agency",
  description:
    "Grow your business with Meta & Google Ads, SEO, web development, Shopify and AI automation. Results-driven agency serving Pakistan, the UAE, Saudi Arabia, Qatar, the UK and the USA.",
  path: "/",
});

export default async function HomePage() {
  const [settings, services, faqs] = await Promise.all([getSettings(), getServices(), getFaqs()]);
  const featured = services.filter((s) => s.featured).slice(0, 4);
  const preview = featured.length ? featured : services.slice(0, 4);
  const faqItems = faqs.slice(0, 4).map(({ question, answer }) => ({ question, answer }));

  return (
    <>
      <Hero settings={settings} />
      <StatsGrid settings={settings} />
      <EditorialBreak />
      <WhyUs />
      <ServicesPreview services={preview} total={services.length} />
      <ProcessTimeline />
      <FounderSpotlight settings={settings} />
      <FaqSection items={faqItems} />
      <ConsultationSection settings={settings} />
      <JsonLd data={faqSchema(faqItems)} />
    </>
  );
}
