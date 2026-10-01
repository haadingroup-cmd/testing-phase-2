import { PackageBuilder } from "@/components/pricing/PackageBuilder";
import { PricingTiers } from "@/components/pricing/PricingTiers";
import { FaqSection } from "@/components/sections/shared";
import { JsonLd } from "@/components/seo/JsonLd";
import { Container } from "@/components/ui/Container";
import { Icon } from "@/components/ui/Icon";
import { PRICING_GUARANTEES } from "@/content/pricing";
import { getFaqs, getPricingPlans, getServices, getSettings } from "@/lib/data";
import { buildMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema } from "@/lib/seo/schema";

export const revalidate = 300;

export const metadata = buildMetadata({
  title: "Pricing & Custom Package Builder",
  description:
    "Transparent PKR pricing for digital marketing retainers — Starter, Growth, Pro and Premium — plus an interactive builder to estimate a custom package instantly.",
  path: "/pricing",
});

export default async function PricingPage() {
  const [plans, services, settings, faqs] = await Promise.all([getPricingPlans(), getServices(), getSettings(), getFaqs()]);
  const builderServices = services
    .filter((s) => s.inBuilder)
    .map((s) => ({ slug: s.slug, label: s.builderLabel || s.title, icon: s.icon, price: s.price }));
  const year = new Date().getFullYear();

  return (
    <>
      <Container className="pb-space-xs pt-space-md lg:pt-12">
        <div className="flex flex-col gap-space-xs rounded-xl bg-surface-container-low p-space-md shadow-sm lg:p-space-xl">
          <div className="flex items-center justify-between gap-2">
            <span className="flex items-center gap-1.5 rounded-full bg-surface-container px-2.5 py-1 font-label-eyebrow text-label-eyebrow uppercase tracking-wider text-secondary">
              <span className="h-2 w-2 animate-pulse rounded-full bg-electric-blue" /> Transparent Pricing
            </span>
            <span className="font-label-md text-label-md font-semibold text-on-surface-variant">{year} Standard</span>
          </div>
          <h1 className="font-headline-sm text-headline-sm font-bold tracking-tight text-on-surface md:text-headline-md lg:text-headline-lg">
            Zero hidden retainers. Precision engineered growth.
          </h1>
          <p className="max-w-2xl font-body-sm text-body-sm text-on-surface-variant lg:text-body-md">
            Scale your business across domestic and international markets. Choose a tier or build your custom package below.
          </p>
        </div>
      </Container>

      <Container>{plans.length ? <PricingTiers plans={plans} whatsapp={settings.whatsapp} /> : null}</Container>

      <Container as="section" className="py-space-md">
        {builderServices.length ? <PackageBuilder services={builderServices} whatsapp={settings.whatsapp} email={settings.email} /> : null}
      </Container>

      <Container as="section" className="py-space-md">
        <div className="flex flex-col gap-space-md rounded-2xl bg-surface-container-low p-space-md lg:p-space-xl">
          <div className="flex items-center gap-2">
            <Icon name="verified_user" size={24} className="text-secondary" />
            <div>
              <h2 className="font-headline-sm text-headline-sm font-bold text-on-surface">The {settings.companyName} Guarantee</h2>
              <span className="font-label-eyebrow text-label-eyebrow uppercase text-on-surface-variant">How we work with every client</span>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-space-xs md:grid-cols-2">
            {PRICING_GUARANTEES.map((g) => (
              <div key={g.title} className="flex items-start gap-3 p-space-xs">
                <Icon name={g.icon} size={20} className="mt-0.5 text-secondary" />
                <div>
                  <h3 className="font-label-lg text-label-lg font-semibold text-on-surface">{g.title}</h3>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">{g.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Container>

      <Container as="section" className="pb-space-lg">
        <div className="flex items-center justify-between gap-space-sm rounded-xl bg-surface-container-lowest p-space-md shadow-sm">
          <div className="flex flex-col">
            <span className="font-label-eyebrow text-label-eyebrow font-bold uppercase text-secondary">Direct Inquiry</span>
            <span className="font-label-lg text-label-lg font-semibold text-on-surface">Need an NDA before sharing details?</span>
            <span className="font-body-sm text-body-sm text-on-surface-variant">Email us and we&apos;ll send a mutual NDA for review.</span>
          </div>
          <a
            href={`mailto:${settings.email}?subject=${encodeURIComponent("NDA Request")}`}
            className="shrink-0 rounded-lg bg-surface-container px-3.5 py-2 font-label-md text-label-md font-bold text-secondary transition-colors hover:bg-secondary hover:text-on-secondary"
          >
            Request NDA
          </a>
        </div>
      </Container>

      <FaqSection items={faqs.slice(2, 6).map(({ question, answer }) => ({ question, answer }))} title="Pricing questions" />
      <JsonLd data={breadcrumbSchema([{ name: "Home", path: "/" }, { name: "Pricing", path: "/pricing" }])} />
    </>
  );
}
