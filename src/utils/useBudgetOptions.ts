"use client";
import { useCurrency } from "@/utils/useCurrency";

/**
 * Returns budget dropdown options in the visitor's currency.
 * Server render = PKR options (home market default) → hydration-safe.
 */
export function useBudgetOptions(): string[] {
  const { currency } = useCurrency();

  if (currency === "PKR") {
    return [
      "Under PKR 50,000/month",
      "PKR 50,000 – 150,000/month",
      "PKR 150,000 – 300,000/month",
      "PKR 300,000+/month",
    ];
  }
  return [
    "Under $300/month",
    "$300 – $600/month",
    "$600 – $1,200/month",
    "$1,200+/month",
  ];
}
