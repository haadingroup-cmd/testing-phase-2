import Link from "next/link";
import { DeepDive } from "@/components/services/DeepDive";
import { ServiceCatalog } from "@/components/services/ServiceCatalog";
import { JsonLd } from "@/components/seo/JsonLd";
import { Container } from "@/components/ui/Container";
import { Icon } from "@/components/ui/Icon";
import { DEEP_DIVES } from "@/content/services";
import { getServices, getSettings } from "@/lib/data";
import { buildMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema } from "@/lib/seo/schema";
import { whatsappLink } from "@/lib/whatsapp";

export const revalidate = 300;

export const metadata = buildMetadata({
  title: "Digital Marketing, Web & AI Services",
  description:
    "Meta Ads, Google Ads, SEO, social media, web development, Shopify, AI automation, YouTube, TikTok ads, branding, content and design — transparent PKR pricing.",
  path: "/services",
});

export default async function ServicesPage() {
  const [services, settings] = await Promise.all([getServices(), getSettings()]);
  const dives = DEEP_DIVES.flatMap((dive) => {
    const service = services.find((s) => s.slug === dive.serviceSlug);
    return service ? [{ dive, service }] : [];
  });
  const deepDiveSlugs = Object.fromEntries(dives.map(({ dive, service }) => [service.slug, dive.id]));

  return (
    <>
      <Container as="section" className="pb-space-lg pt-space-md lg:pt-16">
        <div className="space-y-space-xs">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-surface-container-high px-3 py-1 text-secondary">
            <Icon name="verified" size={16} />
            <span className="font-label-eyebrow text-label-eyebrow uppercase tracking-wider">Enterprise Growth Stack</span>
          </div>
          <h1 className="font-headline-lg-mobile text-headline-lg-mobile font-bold text-on-surface md:text-headline-lg lg:text-display-hero">Everything You Need to Grow Online</h1>
          <p className="max-w-2xl font-body-md text-body-md text-on-surface-variant lg:text-body-lg">
            A complete digital growth stack for businesses at every stage — from local lead generation to multinational scaling.
          </p>
        </div>
        <ServiceCatalog services={services} whatsapp={settings.whatsapp} deepDiveSlugs={deepDiveSlugs} />
      </Container>

      {dives.length ? (
        <Container as="section" className="space-y-space-md py-space-lg lg:py-16">
          <div className="space-y-space-xs">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-surface-container-high px-3 py-1 text-secondary">
              <Icon name="visibility" size={16} />
              <span className="font-label-eyebrow text-label-eyebrow uppercase tracking-wider">Strategic Playbooks</span>
            </div>
            <h2 className="font-headline-md text-headline-md font-bold text-on-surface lg:text-headline-lg">Deep-Dive Focus Frameworks</h2>
            <p className="font-body-md text-body-md text-on-surface-variant">Explore inside our two most requested engines: Paid Performance and Custom Web Architecture.</p>
          </div>
          <div className="grid gap-space-md lg:grid-cols-2">
            {dives.map(({ dive, service }) => (
              <DeepDive key={dive.id} dive={dive} service={service} whatsapp={settings.whatsapp} />
            ))}
          </div>
        </Container>
      ) : null}

      <Container as="section" className="py-space-lg">
        <div className="space-y-space-md rounded-2xl bg-primary-container p-space-lg text-on-primary shadow-lg lg:grid lg:grid-cols-2 lg:items-center lg:gap-space-xl lg:space-y-0 lg:p-12">
          <div className="space-y-space-xs">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-secondary/30 px-3 py-1 text-secondary-fixed">
              <Icon name="calculate" size={16} />
              <span className="font-label-eyebrow text-label-eyebrow uppercase tracking-wider">Smart Estimators</span>
            </div>
            <h2 className="font-headline-md text-headline-md font-bold">Need a Custom Multi-Service Bundle?</h2>
            <p className="font-body-sm text-body-sm text-on-primary-container">
              Mix and match services to unlock bundle discounts, or run a free health check on your current website.
            </p>
          </div>
          <div className="space-y-space-sm">
            <Link href="/pricing#package-builder" className="flex items-center justify-between rounded-xl bg-on-primary/5 p-space-sm transition-colors hover:bg-on-primary/10">
              <span className="flex items-center gap-space-sm">
                <Icon name="tune" size={24} className="text-accent-gold-light" />
                <span>
                  <span className="block font-label-lg text-label-lg">ROAS &amp; Bundle Calculator</span>
                  <span className="block font-body-sm text-body-sm text-on-primary-container">Build a package and see the estimate live</span>
                </span>
              </span>
              <Icon name="chevron_right" size={22} />
            </Link>
            <Link href="/audit" className="flex items-center justify-between rounded-xl bg-on-primary/5 p-space-sm transition-colors hover:bg-on-primary/10">
              <span className="flex items-center gap-space-sm">
                <Icon name="speed" size={24} className="text-electric-blue" />
                <span>
                  <span className="block font-label-lg text-label-lg">Free Website Audit</span>
                  <span className="block font-body-sm text-body-sm text-on-primary-container">SEO, speed, social and conversion checks</span>
                </span>
              </span>
              <Icon name="chevron_right" size={22} />
            </Link>
            <p className="pt-space-xs font-body-sm text-body-sm text-on-primary-container">
              Need executive advice?{" "}
              <a href={whatsappLink(settings.whatsappMessage, settings.whatsapp)} target="_blank" rel="noopener noreferrer" className="font-semibold text-accent-gold-light hover:underline">
                Talk to the founder directly →
              </a>
            </p>
          </div>
        </div>
      </Container>
      <JsonLd data={breadcrumbSchema([{ name: "Home", path: "/" }, { name: "Services", path: "/services" }])} />
    </>
  );
}
