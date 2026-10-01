import { FaqAccordion } from "@/components/sections/FaqAccordion";
import { ConsultationSection, PageHero } from "@/components/sections/shared";
import { JsonLd } from "@/components/seo/JsonLd";
import { Container } from "@/components/ui/Container";
import { getFaqs, getServices, getSettings } from "@/lib/data";
import { buildMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema, faqSchema } from "@/lib/seo/schema";

export const revalidate = 300;

export const metadata = buildMetadata({
  title: "Agency FAQ",
  description: "Answers about how HaadinGlobal works: timelines, ad budgets, contracts, reporting, international clients and service-specific questions.",
  path: "/faq",
});

export default async function FaqPage() {
  const [faqs, services, settings] = await Promise.all([getFaqs(), getServices(), getSettings()]);
  const general = faqs.map(({ question, answer }) => ({ question, answer }));
  const byService = services.filter((s) => s.faqs.length);
  return (
    <>
      <PageHero eyebrow="Knowledge Base" title="Frequently Asked Questions" description="Straight answers on our operating model, timelines, budgets and guarantees." />
      <Container as="section" className="space-y-space-xl pb-space-xl">
        <div className="space-y-space-md">
          <h2 className="font-headline-sm text-headline-sm font-bold text-on-surface">General</h2>
          <FaqAccordion items={general} defaultOpen={0} />
        </div>
        {byService.map((s) => (
          <div key={s.slug} id={s.slug} className="scroll-mt-24 space-y-space-md">
            <h2 className="font-headline-sm text-headline-sm font-bold text-on-surface">{s.title}</h2>
            <FaqAccordion items={s.faqs} />
          </div>
        ))}
      </Container>
      <ConsultationSection settings={settings} />
      <JsonLd data={[faqSchema([...general, ...byService.flatMap((s) => s.faqs)]), breadcrumbSchema([{ name: "Home", path: "/" }, { name: "FAQ", path: "/faq" }])]} />
    </>
  );
}
