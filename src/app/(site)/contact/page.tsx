import { ContactForm } from "@/components/forms/ContactForm";
import { DirectChannels, PageHero } from "@/components/sections/shared";
import { JsonLd } from "@/components/seo/JsonLd";
import { Container } from "@/components/ui/Container";
import { Icon } from "@/components/ui/Icon";
import { getServices, getSettings } from "@/lib/data";
import { buildMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema } from "@/lib/seo/schema";

export const revalidate = 300;

export const metadata = buildMetadata({
  title: "Contact HaadinGlobal",
  description: "Talk to HaadinGlobal about Meta & Google Ads, SEO, web development or AI automation. WhatsApp +92 305 4782677 or send an enquiry — reply within 24 hours.",
  path: "/contact",
});

type Props = { searchParams: Promise<{ service?: string }> };

export default async function ContactPage({ searchParams }: Props) {
  const [{ service }, services, settings] = await Promise.all([searchParams, getServices(), getSettings()]);
  return (
    <>
      <PageHero eyebrow="Contact Executive Team" title="Let's talk about your growth" description="Tell us where you are and where you want to be. A strategist replies within 24 hours — usually much sooner on WhatsApp." />
      <Container as="section" className="grid gap-space-lg pb-space-xl lg:grid-cols-12">
        <div className="rounded-3xl bg-surface-container-lowest p-space-lg shadow-lg lg:col-span-7 lg:p-space-xl">
          <h2 className="mb-space-md font-headline-sm text-headline-sm font-bold text-on-surface">Send an enquiry</h2>
          <ContactForm services={services.map((s) => s.title)} whatsapp={settings.whatsapp} defaultService={service} />
        </div>
        <div className="space-y-space-md lg:col-span-5">
          <DirectChannels settings={settings} />
          <div className="space-y-space-sm rounded-2xl bg-primary-container p-space-md text-on-primary">
            <h2 className="font-label-lg text-label-lg">What happens next</h2>
            <ol className="space-y-2 font-body-sm text-body-sm text-on-primary-container">
              {["We review your website, ads and goals.", "We reply with questions or a short call invite.", "You get a clear plan with scope and pricing — no obligation."].map((s, i) => (
                <li key={s} className="flex gap-2">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-secondary font-label-md text-label-md text-on-secondary">{i + 1}</span>
                  {s}
                </li>
              ))}
            </ol>
            <p className="flex items-center gap-1 font-label-md text-label-md text-accent-gold-light">
              <Icon name="schedule" size={16} /> Typical response: {settings.responseTime}
            </p>
          </div>
        </div>
      </Container>
      <JsonLd data={breadcrumbSchema([{ name: "Home", path: "/" }, { name: "Contact", path: "/contact" }])} />
    </>
  );
}
