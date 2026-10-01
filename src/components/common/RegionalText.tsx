"use client";
import { useCurrency } from "@/utils/useCurrency";

/**
 * Shows the PKR wording to visitors in Pakistan and the USD wording to
 * everyone else, so nobody sees the other market's price. Server render is
 * the PKR text (same rule as the price tags).
 */
export default function RegionalText({ pkr, usd }: { pkr: string; usd: string }) {
  const { currency } = useCurrency();
  return <>{currency === "PKR" ? pkr : usd}</>;
}
