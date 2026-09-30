import Link from "next/link";
import { Icon } from "@/components/ui/Icon";
import { SocialIcon } from "@/components/ui/SocialIcon";
import { COMPANY_NAV, LEGAL_NAV } from "@/content/navigation";
import { whatsappLink } from "@/lib/whatsapp";
import type { SiteSettings } from "@/types";

const MARKET_NAMES: Record<string, string> = {
  UAE: "United Arab Emirates",
  UK: "United Kingdom",
  USA: "United States",
};

export function SiteFooter({ settings, services }: { settings: SiteSettings; services: Array<{ slug: string; title: string }> }) {
  const social = Object.entries(settings.social).filter(([, url]) => Boolean(url));
  return (
    <footer className="mt-space-xl w-full bg-primary-container text-on-primary-container">
      <div className="mx-auto max-w-7xl space-y-space-lg px-margin-mobile pb-space-lg pt-space-xl md:px-8 lg:px-margin">
        <div className="grid gap-space-lg lg:grid-cols-12">
          <div className="space-y-space-sm lg:col-span-4">
            <div className="flex items-center gap-space-xs">
              <span className="font-headline-sm text-headline-sm font-bold tracking-tight text-on-primary">{settings.companyName}</span>
              <span className="rounded-full bg-secondary/30 px-2 py-0.5 font-label-eyebrow text-label-eyebrow uppercase text-secondary-fixed">Enterprise</span>
            </div>
            <p className="max-w-sm font-body-sm text-body-sm">
              Strategic growth engineering, performance ad operations, and high-converting web platforms for ambitious businesses.
            </p>
            {social.length ? (
              <ul className="flex flex-wrap gap-2 pt-1" aria-label="Social media">
                {social.map(([name, url]) => (
                  <li key={name}>
                    <a
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`${settings.companyName} on ${name.charAt(0).toUpperCase()}${name.slice(1)}`}
                      className="flex h-9 w-9 items-center justify-center rounded-lg bg-on-primary/5 text-on-primary transition-colors hover:bg-secondary"
                    >
                      <SocialIcon name={name} className="h-4 w-4" />
                    </a>
                  </li>
                ))}
              </ul>
            ) : null}
          </div>

          <div className="grid grid-cols-2 gap-space-md sm:grid-cols-4 lg:col-span-8">
            <div className="space-y-space-xs">
              <span className="font-label-eyebrow text-label-eyebrow uppercase tracking-widest text-on-primary">Global Markets</span>
              <ul className="space-y-1 font-body-sm text-body-sm">
                {settings.markets.map((m) => (
                  <li key={m} className="flex items-center gap-1.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-electric-blue" />
                    {MARKET_NAMES[m] ?? m}
                  </li>
                ))}
              </ul>
            </div>
            <div className="space-y-space-xs">
              <span className="font-label-eyebrow text-label-eyebrow uppercase tracking-widest text-on-primary">Official Desk</span>
              <div className="space-y-2 font-body-sm text-body-sm">
                <div className="flex flex-col">
                  <span className="font-label-md text-label-md text-on-primary">Inquiries</span>
                  <a className="break-all text-electric-blue hover:underline" href={`mailto:${settings.email}`}>
                    {settings.email}
                  </a>
                </div>
                <div className="flex flex-col">
                  <span className="font-label-md text-label-md text-on-primary">Operations Hub</span>
                  <span>{settings.address}</span>
                </div>
                <div className="flex flex-col">
                  <span className="font-label-md text-label-md text-on-primary">Direct Line</span>
                  <a className="text-accent-gold-light hover:underline" href={whatsappLink(settings.whatsappMessage, settings.whatsapp)} target="_blank" rel="noopener noreferrer">
                    {settings.phone}
                  </a>
                </div>
              </div>
            </div>
            <div className="space-y-space-xs">
              <span className="font-label-eyebrow text-label-eyebrow uppercase tracking-widest text-on-primary">Services</span>
              <ul className="space-y-1 font-body-sm text-body-sm">
                {services.slice(0, 8).map((s) => (
                  <li key={s.slug}>
                    <Link href={`/services/${s.slug}`} className="transition-colors hover:text-on-primary">
                      {s.title}
                    </Link>
                  </li>
                ))}
                <li>
                  <Link href="/services" className="inline-flex items-center gap-1 text-electric-blue hover:underline">
                    All services <Icon name="east" size={14} />
                  </Link>
                </li>
              </ul>
            </div>
            <div className="space-y-space-xs">
              <span className="font-label-eyebrow text-label-eyebrow uppercase tracking-widest text-on-primary">Company</span>
              <ul className="space-y-1 font-body-sm text-body-sm">
                {COMPANY_NAV.map((l) => (
                  <li key={l.href}>
                    <Link href={l.href} className="transition-colors hover:text-on-primary">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
        <div className="flex flex-wrap items-center justify-between gap-space-sm border-t border-on-primary-container/10 pt-space-md font-label-md text-label-md">
          <span>
            © {new Date().getFullYear()} {settings.companyName}. All rights reserved.
          </span>
          <nav aria-label="Legal" className="flex flex-wrap gap-space-md">
            {LEGAL_NAV.map((l) => (
              <Link key={l.href} href={l.href} className="transition-colors hover:text-on-primary">
                {l.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </footer>
  );
}
