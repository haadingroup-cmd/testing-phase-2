import "server-only";
import { createHmac, timingSafeEqual } from "node:crypto";
import { absoluteUrl } from "./site";

/**
 * Stateless unsubscribe tokens: HMAC-SHA256 of the normalised email with NEWSLETTER_SECRET.
 * A token only ever authorises unsubscribing that one address.
 */
const secret = () => {
  const s = process.env.NEWSLETTER_SECRET;
  return s && s.length >= 32 ? s : null;
};

export const tokensConfigured = () => secret() !== null;

export function unsubscribeToken(email: string): string | null {
  const s = secret();
  if (!s) return null;
  return createHmac("sha256", s).update(`unsubscribe:${email.trim().toLowerCase()}`).digest("base64url");
}

export function verifyUnsubscribeToken(email: string, token: string): boolean {
  const expected = unsubscribeToken(email);
  if (!expected || typeof token !== "string" || token.length !== expected.length) return false;
  return timingSafeEqual(Buffer.from(expected), Buffer.from(token));
}

export function unsubscribeUrl(email: string): string | null {
  const t = unsubscribeToken(email);
  if (!t) return null;
  return absoluteUrl(`/unsubscribe?e=${encodeURIComponent(email)}&t=${t}`);
}

/** Endpoint for RFC 8058 one-click unsubscribe (mail providers POST here directly). */
export function oneClickUrl(email: string): string | null {
  const t = unsubscribeToken(email);
  if (!t) return null;
  return absoluteUrl(`/api/unsubscribe?e=${encodeURIComponent(email)}&t=${t}`);
}
