import Link from "next/link";
import { ConsultationForm } from "@/components/forms/ConsultationForm";
import { FaqAccordion } from "@/components/sections/FaqAccordion";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/Eyebrow";
import { Icon } from "@/components/ui/Icon";
import { whatsappLink } from "@/lib/whatsapp";
import type { QA, SiteSettings } from "@/types";

export function FaqSection({ items, title = "Frequently Asked Questions", description = "Straight answers on how we work, timelines and budgets.", withLink = true }: { items: QA[]; title?: string; description?: string; withLink?: boolean }) {
  if (!items.length) return null;
  return (
    <Container as="section" className="py-space-lg lg:py-16">
      <div className="grid gap-space-md lg:grid-cols-12 lg:gap-space-xl">
        <div className="space-y-space-md lg:col-span-4">
          <SectionHeading eyebrow="Knowledge Base" title={title} description={description} />
          {withLink ? (
            <Link href="/faq" className="inline-flex items-center gap-1 font-label-lg text-label-lg text-secondary hover:underline">
              View all FAQs <Icon name="arrow_forward" size={16} />
            </Link>
          ) : null}
        </div>
        <div className="lg:col-span-8">
          <FaqAccordion items={items} />
        </div>
      </div>
    </Container>
  );
}

export function DirectChannels({ settings }: { settings: SiteSettings }) {
  return (
    <div className="space-y-space-sm rounded-2xl bg-surface-container-low p-space-md">
      <span className="font-label-eyebrow text-label-eyebrow font-bold uppercase tracking-wider text-on-surface-variant">Direct Executive Channels</span>
      <div className="flex flex-col gap-space-xs">
        <a
          className="flex items-center gap-space-sm rounded-xl p-space-xs transition-colors hover:bg-surface-container"
          href={whatsappLink(settings.whatsappMessage, settings.whatsapp)}
          rel="noopener noreferrer"
          target="_blank"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-surface-container-lowest text-whatsapp shadow-sm">
            <Icon name="chat" size={20} />
          </div>
          <div className="flex flex-col">
            <span className="font-label-md text-label-md font-bold text-on-surface">{settings.phone}</span>
            <span className="font-body-sm text-body-sm text-on-surface-variant">WhatsApp Agency Support</span>
          </div>
        </a>
        <a className="flex items-center gap-space-sm rounded-xl p-space-xs transition-colors hover:bg-surface-container" href={`mailto:${settings.email}`}>
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-surface-container-lowest text-secondary shadow-sm">
            <Icon name="mail" size={20} />
          </div>
          <div className="flex min-w-0 flex-col">
            <span className="break-all font-label-md text-label-md font-bold text-on-surface">{settings.email}</span>
            <span className="font-body-sm text-body-sm text-on-surface-variant">Official Strategy Inbox</span>
          </div>
        </a>
        <a className="flex items-center gap-space-sm rounded-xl p-space-xs transition-colors hover:bg-surface-container" href={`tel:+${settings.whatsapp}`}>
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-surface-container-lowest text-secondary shadow-sm">
            <Icon name="call" size={20} />
          </div>
          <div className="flex flex-col">
            <span className="font-label-md text-label-md font-bold text-on-surface">Call {settings.phone}</span>
            <span className="font-body-sm text-body-sm text-on-surface-variant">Mon–Sat, Pakistan time (PKT)</span>
          </div>
        </a>
        <div className="flex items-center gap-space-sm rounded-xl p-space-xs">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-surface-container-lowest text-on-surface-variant shadow-sm">
            <Icon name="location_on" size={20} />
          </div>
          <div className="flex flex-col">
            <span className="font-label-md text-label-md font-bold text-on-surface">{settings.address}</span>
            <span className="font-body-sm text-body-sm text-on-surface-variant">{settings.companyName} HQ Desk</span>
          </div>
        </div>
      </div>
    </div>
  );
}

/** Stitch "Priority Intake" block with the consultation form and direct channels. */
export function ConsultationSection({ settings }: { settings: SiteSettings }) {
  return (
    <Container as="section" id="consultation" className="scroll-mt-24 pb-space-xl pt-space-lg lg:py-16">
      <div className="grid gap-space-lg lg:grid-cols-12">
        <div className="space-y-space-md rounded-3xl bg-surface-container-lowest p-space-lg shadow-lg lg:col-span-7 lg:p-space-xl">
          <div className="space-y-space-xs">
            <div className="flex items-center gap-space-xs">
              <span className="h-2.5 w-2.5 rounded-full bg-secondary" />
              <span className="font-label-eyebrow text-label-eyebrow font-bold uppercase tracking-widest text-secondary">Priority Intake</span>
            </div>
            <h2 className="font-headline-md text-headline-md font-bold tracking-tight text-on-surface">Book Your Free Strategy Audit</h2>
            <p className="font-body-sm text-body-sm text-on-surface-variant">
              Complete this 30-second form. Our team will review your digital footprint and respond with tailored growth roadmap options within 24 hours.
            </p>
          </div>
          <ConsultationForm whatsapp={settings.whatsapp} />
          <div className="flex items-center gap-space-xs rounded-xl bg-surface-container-low p-space-sm font-label-md text-label-md text-on-surface-variant">
            <Icon name="bolt" size={20} className="text-secondary" />
            <span>Personally reviewed by {settings.founderName} within 24 hours.</span>
          </div>
        </div>
        <div className="space-y-space-md lg:col-span-5">
          <DirectChannels settings={settings} />
          <Link href="/audit" className="group flex items-center justify-between gap-space-sm rounded-2xl bg-primary-container p-space-md text-on-primary shadow-md">
            <span className="flex items-center gap-space-sm">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-secondary/30 text-secondary-fixed">
                <Icon name="speed" size={22} />
              </span>
              <span>
                <span className="block font-label-lg text-label-lg">Prefer instant answers?</span>
                <span className="block font-body-sm text-body-sm text-on-primary-container">Run the free website audit now</span>
              </span>
            </span>
            <Icon name="chevron_right" size={22} className="transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </Container>
  );
}

/** Compact page hero shared by inner pages. */
export function PageHero({ eyebrow, title, description, children }: { eyebrow: string; title: React.ReactNode; description?: React.ReactNode; children?: React.ReactNode }) {
  return (
    <section className="relative overflow-hidden">
      <div className="pointer-events-none absolute -right-16 -top-12 h-64 w-64 rounded-full bg-surface-variant/40 blur-3xl" aria-hidden="true" />
      <Container className="relative pb-space-lg pt-space-md lg:pb-space-xl lg:pt-16">
        <div className="mb-space-xs flex items-center gap-space-xs">
          <span className="h-2 w-2 animate-pulse rounded-full bg-electric-blue" />
          <span className="font-label-eyebrow text-label-eyebrow uppercase tracking-widest text-secondary">{eyebrow}</span>
        </div>
        <h1 className="mb-space-xs max-w-3xl font-headline-lg-mobile text-headline-lg-mobile font-extrabold tracking-tight text-on-surface md:text-headline-lg lg:text-display-hero">
          {title}
        </h1>
        {description ? <p className="max-w-2xl font-body-md text-body-md text-on-surface-variant lg:text-body-lg">{description}</p> : null}
        {children}
      </Container>
    </section>
  );
}
