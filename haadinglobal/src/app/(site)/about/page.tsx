import { FounderSpotlight, ProcessTimeline, StatsGrid, WhyUs } from "@/components/sections/home";
import { ConsultationSection, PageHero } from "@/components/sections/shared";
import { JsonLd } from "@/components/seo/JsonLd";
import { Container } from "@/components/ui/Container";
import { getSettings } from "@/lib/data";
import { buildMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema } from "@/lib/seo/schema";

export const revalidate = 300;

export const metadata = buildMetadata({
  title: "About HaadinGlobal & Founder Muhammad Haseeb",
  description: "HaadinGlobal is a digital marketing and technology agency founded by Muhammad Haseeb in Sahiwal, Pakistan, serving clients across Pakistan, the Gulf, the UK and the USA.",
  path: "/about",
});

export default async function AboutPage() {
  const settings = await getSettings();
  return (
    <>
      <PageHero eyebrow="Founder & Agency" title="Built in Sahiwal. Trusted across borders." description={settings.description} />
      <FounderSpotlight settings={settings} ctaHref="/contact" />
      <Container as="section" className="py-space-md">
        <div className="space-y-space-sm rounded-3xl bg-surface-container-lowest p-space-lg shadow-sm lg:p-space-xl">
          <span className="font-label-eyebrow text-label-eyebrow uppercase tracking-widest text-secondary">A letter from the founder</span>
          <div className="max-w-3xl space-y-space-sm font-body-md text-body-md text-on-surface-variant lg:text-body-lg">
            <p>
              I started {settings.companyName} because too many businesses were paying for marketing they couldn&apos;t measure. Boosted posts, vanity metrics and monthly reports that
              said nothing about leads or sales.
            </p>
            <p>
              We work differently: every campaign starts with tracking you can trust, every recommendation is tied to a business number, and you always have a direct line to the
              people doing the work — usually on WhatsApp.
            </p>
            <p>
              From Sahiwal we serve clients in Pakistan, the UAE, Saudi Arabia, Qatar, the UK and the USA. Whether you need your first leads or want to scale into a new market, we&apos;d
              be glad to help.
            </p>
            <p className="font-semibold text-on-surface">— {settings.founderName}, {settings.founderTitle}</p>
          </div>
        </div>
      </Container>
      <StatsGrid settings={settings} />
      <WhyUs />
      <ProcessTimeline />
      <ConsultationSection settings={settings} />
      <JsonLd data={breadcrumbSchema([{ name: "Home", path: "/" }, { name: "About", path: "/about" }])} />
    </>
  );
}
