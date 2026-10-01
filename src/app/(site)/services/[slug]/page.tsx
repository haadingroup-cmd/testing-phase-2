import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { FaqAccordion } from "@/components/sections/FaqAccordion";
import { ConsultationSection } from "@/components/sections/shared";
import { JsonLd } from "@/components/seo/JsonLd";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/Eyebrow";
import { Icon } from "@/components/ui/Icon";
import { getService, getServices, getSettings } from "@/lib/data";
import { buildMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema, faqSchema, serviceSchema } from "@/lib/seo/schema";
import { formatPKR, formatUSD, priceUnitLabel } from "@/lib/utils";
import { CALCULATOR } from "@/content/calculator";
import { whatsappLink } from "@/lib/whatsapp";

export const revalidate = 300;

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  const services = await getServices();
  return services.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const service = await getService(slug);
  if (!service) return { title: "Service not found", robots: { index: false } };
  return buildMetadata({
    title: service.seoTitle || service.title,
    description: service.seoDescription || service.shortDescription,
    path: `/services/${service.slug}`,
    image: service.image,
  });
}

export default async function ServiceDetailPage({ params }: Props) {
  const { slug } = await params;
  const [service, services, settings] = await Promise.all([getService(slug), getServices(), getSettings()]);
  if (!service) notFound();

  const related = services.filter((s) => s.slug !== service.slug && s.category === service.category).slice(0, 3);
  const waHref = whatsappLink(service.whatsappMessage ?? `Hi HaadinGlobal, I'm interested in ${service.title}.`, settings.whatsapp);

  return (
    <>
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute -right-16 -top-12 h-64 w-64 rounded-full bg-surface-variant/40 blur-3xl" aria-hidden="true" />
        <Container className="relative grid grid-cols-1 gap-space-lg pb-space-lg pt-space-md lg:grid-cols-12 lg:items-center lg:gap-12 lg:py-16">
          <div className="min-w-0 space-y-space-md lg:col-span-7">
            <nav aria-label="Breadcrumb" className="flex items-center gap-1 font-label-md text-label-md text-on-surface-variant">
              <Link href="/" className="hover:text-secondary">Home</Link>
              <Icon name="chevron_right" size={14} />
              <Link href="/services" className="hover:text-secondary">Services</Link>
              <Icon name="chevron_right" size={14} />
              <span className="text-on-surface" aria-current="page">{service.title}</span>
            </nav>
            <div className="flex items-center gap-space-sm">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-surface-container-high text-secondary">
                <Icon name={service.icon} size={30} />
              </div>
              <span className="font-label-eyebrow text-label-eyebrow uppercase tracking-widest text-secondary">{service.tagline}</span>
            </div>
            <h1 className="font-headline-lg-mobile text-headline-lg-mobile font-extrabold tracking-tight text-on-surface md:text-headline-lg lg:text-display-hero">{service.title}</h1>
            <p className="max-w-[62ch] font-body-md text-body-md text-on-surface-variant lg:text-body-lg">{service.description}</p>
            <div className="flex flex-wrap gap-1.5">
              {service.highlights.map((h) => (
                <span key={h} className="rounded-full bg-surface-container px-2.5 py-1 font-label-md text-label-md text-on-surface">
                  {h}
                </span>
              ))}
            </div>
            <div className="flex flex-col gap-space-sm sm:flex-row">
              <a href={waHref} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-space-xs rounded-xl bg-secondary px-space-lg py-3.5 font-label-lg text-label-lg text-on-secondary shadow-md transition-all hover:bg-primary-container">
                <Icon name="chat" size={20} /> {service.ctaLabel}
              </a>
              <Link href="#consultation" className="flex items-center justify-center gap-space-xs rounded-xl bg-surface-container-lowest px-space-lg py-3.5 font-label-lg text-label-lg text-on-surface shadow-sm hover:bg-surface-container">
                Get a free proposal <Icon name="arrow_forward" size={18} className="text-secondary" />
              </Link>
            </div>
          </div>
          <aside className="min-w-0 space-y-space-md lg:col-span-5">
            {service.image ? (
              <div className="relative h-52 overflow-hidden rounded-2xl shadow-md lg:h-64">
                <Image src={service.image} alt={`${service.title} by HaadinGlobal`} fill priority sizes="(min-width: 1024px) 480px, 100vw" className="object-cover" />
              </div>
            ) : null}
            <div className="space-y-space-sm rounded-2xl bg-primary-container p-space-lg text-on-primary shadow-xl">
              <span className="font-label-eyebrow text-label-eyebrow uppercase tracking-widest text-accent-gold-light">Starting investment</span>
              <div className="flex items-baseline gap-2">
                <span className="font-headline-lg-mobile text-headline-lg-mobile font-bold">{formatPKR(service.price)}</span>
                <span className="font-label-md text-label-md text-on-primary-container">{priceUnitLabel(service.priceUnit)}</span>
              </div>
              <p className="font-body-sm text-body-sm text-on-primary-container">
                ≈ {formatUSD(service.price / CALCULATOR.usdRate)} USD. Ad spend (where applicable) is paid directly to the platform from your own account.
              </p>
              <Link href="/pricing#package-builder" className="flex items-center justify-center gap-2 rounded-lg bg-accent-gold-light py-3 font-label-lg text-label-lg font-bold text-obsidian hover:bg-tertiary-fixed-dim">
                <Icon name="calculate" size={18} /> Combine in package builder
              </Link>
            </div>
          </aside>
        </Container>
      </section>

      <Container as="section" className="grid gap-space-md py-space-lg md:grid-cols-2 lg:py-16">
        <div className="space-y-space-sm rounded-2xl bg-surface-container-lowest p-space-lg shadow-sm">
          <h2 className="font-headline-sm text-headline-sm font-bold text-on-surface">What&apos;s included</h2>
          <ul className="space-y-2">
            {service.features.map((f) => (
              <li key={f} className="flex items-start gap-2 font-body-md text-body-md text-on-surface">
                <Icon name="check_circle" size={20} className="mt-0.5 text-secondary" /> {f}
              </li>
            ))}
          </ul>
        </div>
        <div className="space-y-space-sm rounded-2xl bg-surface-container-low p-space-lg">
          <h2 className="font-headline-sm text-headline-sm font-bold text-on-surface">What you get out of it</h2>
          <ul className="space-y-2">
            {service.benefits.map((b) => (
              <li key={b} className="flex items-start gap-2 font-body-md text-body-md text-on-surface">
                <Icon name="verified" size={20} className="mt-0.5 text-accent-gold-light" filled /> {b}
              </li>
            ))}
          </ul>
        </div>
      </Container>

      {service.process.length ? (
        <Container as="section" className="space-y-space-md py-space-lg lg:py-16">
          <SectionHeading eyebrow="How we work" title={`Our ${service.title} process`} />
          <ol className="grid gap-space-sm md:grid-cols-2 lg:grid-cols-4">
            {service.process.map((step, i) => (
              <li key={step.title} data-reveal className="space-y-1 rounded-2xl bg-surface-container-lowest p-space-md shadow-sm">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-secondary font-label-md text-label-md text-on-secondary">{i + 1}</span>
                <h3 className="pt-1 font-label-lg text-label-lg text-on-surface">{step.title}</h3>
                <p className="font-body-sm text-body-sm text-on-surface-variant">{step.description}</p>
              </li>
            ))}
          </ol>
        </Container>
      ) : null}

      {service.faqs.length ? (
        <Container as="section" className="grid gap-space-md py-space-lg lg:grid-cols-12 lg:py-16">
          <div className="lg:col-span-4">
            <SectionHeading eyebrow="Knowledge Base" title={`${service.title} FAQs`} />
          </div>
          <div className="lg:col-span-8">
            <FaqAccordion items={service.faqs} defaultOpen={0} />
          </div>
        </Container>
      ) : null}

      {related.length ? (
        <Container as="section" className="space-y-space-md py-space-lg">
          <SectionHeading eyebrow="Pairs well with" title="Related services" />
          <div className="grid gap-space-sm md:grid-cols-3">
            {related.map((s) => (
              <Link key={s.slug} href={`/services/${s.slug}`} className="group flex items-center justify-between gap-space-sm rounded-2xl bg-surface-container-lowest p-space-md shadow-sm hover:shadow-level-2">
                <span className="flex items-center gap-space-sm">
                  <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-surface-container text-secondary">
                    <Icon name={s.icon} size={22} />
                  </span>
                  <span>
                    <span className="block font-label-lg text-label-lg text-on-surface group-hover:text-secondary">{s.title}</span>
                    <span className="block font-body-sm text-body-sm text-on-surface-variant">From {formatPKR(s.price)}</span>
                  </span>
                </span>
                <Icon name="chevron_right" size={20} className="text-outline" />
              </Link>
            ))}
          </div>
        </Container>
      ) : null}

      <ConsultationSection settings={settings} />
      <JsonLd
        data={[
          serviceSchema(service),
          faqSchema(service.faqs),
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Services", path: "/services" },
            { name: service.title, path: `/services/${service.slug}` },
          ]),
        ]}
      />
    </>
  );
}
