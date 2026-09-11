/**
 * Fires a GA4 "generate_lead" event whenever a visitor successfully submits
 * any lead form on the site (contact form, lead magnet, landing pages).
 *
 * This is what lets GA4 (and the "Qualified Leads" / "Converted Leads" cards)
 * actually count real leads — without this, GA4 only sees generic page views
 * and has no signal that a form submission ever happened.
 *
 * Safe to call anywhere: does nothing if gtag hasn't loaded (e.g. GA_ID env
 * var not set yet, or the script hasn't finished loading).
 *
 * To use this GA4 event as a "Key Event": in GA4 go to
 * Admin → Events → find "generate_lead" → toggle "Mark as key event".
 *
 * TEMP DEBUG: console.log lines added below to verify this fires — remove
 * both console.log lines once confirmed working.
 */
export function trackLead(source: string) {
  if (typeof window === "undefined") return;
  const w = window as unknown as { gtag?: (...args: unknown[]) => void };
  console.log("[trackLead] called with source:", source, "— gtag exists?", typeof w.gtag === "function");
  if (typeof w.gtag !== "function") return;
  w.gtag("event", "generate_lead", { lead_source: source });
  console.log("[trackLead] gtag event sent");
}
