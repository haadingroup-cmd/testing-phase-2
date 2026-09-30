/**
 * Public, build-time site configuration. The production domain comes from
 * NEXT_PUBLIC_SITE_URL so it can be changed without touching code.
 */
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "https://www.haadinglobal.com").replace(/\/+$/, "");

export const DEFAULT_WHATSAPP = (process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "923054782677").replace(/\D/g, "");

export function absoluteUrl(path = "/"): string {
  if (/^https?:\/\//i.test(path)) return path;
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}
