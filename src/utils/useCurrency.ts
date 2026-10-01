"use client";
import { useEffect, useState } from "react";
import type { Currency } from "@/utils/pricing";

export type { Currency };

/**
 * Reads `hg-country` cookie (set by middleware from Vercel's edge geo
 * headers) to decide currency. Synchronous, no fetch, no rate limits.
 *
 * Server + first client render = PKR (matches the agency's home market
 * and avoids hydration mismatch). After mount we read the real cookie.
 */
function readCountryFromCookie(): string | null {
  if (typeof document === "undefined") return null;
  const m = document.cookie.match(/(?:^|;\s*)hg-country=([^;]+)/);
  return m ? decodeURIComponent(m[1]).toUpperCase() : null;
}

export function useCurrency() {
  const [currency, setCurrency] = useState<Currency>("PKR");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const cc = readCountryFromCookie();
    setCurrency(cc && cc !== "PK" ? "USD" : "PKR");
    setReady(true);
  }, []);

  return { currency, ready, isPk: currency === "PKR" };
}
