"use client";
import { SITE } from "@/data/siteConfig";
import { trackLead } from "@/lib/trackLead";

/**
 * Every WhatsApp CTA on the site should go through this component instead of
 * a raw <a href={SITE.social.whatsapp}> — WhatsApp is the primary conversion
 * action (more clicks than the lead forms in most places), but until this
 * existed those clicks fired no GA4 event at all, so they were invisible in
 * Analytics next to the form-based leads that trackLead() already covers.
 */
export default function WhatsAppCTA({
  source,
  text,
  className,
  ariaLabel,
  children,
}: {
  /** Identifies which page/placement this click came from, e.g. "hero", "agency-lahore". */
  source: string;
  /** Optional pre-filled WhatsApp message. */
  text?: string;
  className?: string;
  ariaLabel?: string;
  children: React.ReactNode;
}) {
  const href = text ? `${SITE.social.whatsapp}?text=${encodeURIComponent(text)}` : SITE.social.whatsapp;
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
      aria-label={ariaLabel}
      onClick={() => trackLead(`whatsapp-${source}`)}
    >
      {children}
    </a>
  );
}
