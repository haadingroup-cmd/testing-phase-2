/**
 * Pure pricing helpers — safe to import from server (API routes) and client.
 * No "use client", no React, no browser APIs.
 *
 * Both PKR and USD prices are now stored EXPLICITLY in the data files —
 * we no longer compute USD from a base value × uplift. This keeps numbers
 * round and predictable for both markets.
 */

export type Currency = "PKR" | "USD";

export interface DualPrice {
  pkr: number;
  usd: number;
}

export function formatPrice(currency: Currency, price: DualPrice): string {
  return currency === "PKR"
    ? `PKR ${price.pkr.toLocaleString()}`
    : `$${price.usd.toLocaleString()}`;
}

export function priceFor(currency: Currency, price: DualPrice): number {
  return currency === "PKR" ? price.pkr : price.usd;
}
