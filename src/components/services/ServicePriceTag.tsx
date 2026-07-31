"use client";
import { useCurrency } from "@/utils/useCurrency";

interface Props {
  pricePkr: number;
  priceUsd: number;
  /** "lg" for big detail-page hero price, "sm" for inline card chip. */
  size?: "lg" | "sm";
  /** Prefix text e.g. "from " (used on the services list page). */
  prefix?: string;
}

/**
 * Renders the service price in PKR or USD depending on the visitor's
 * country (read from the `hg-country` cookie set by middleware).
 *
 * Server render = PKR (matches the agency's home market and avoids
 * hydration mismatch). Client hydration switches to USD for non-PK visitors.
 */
export default function ServicePriceTag({ pricePkr, priceUsd, size = "lg", prefix }: Props) {
  const { currency } = useCurrency();
  const text =
    currency === "PKR" ? `PKR ${pricePkr.toLocaleString()}` : `$${priceUsd.toLocaleString()}`;

  if (size === "sm") {
    return (
      <span className="text-xs text-green-400 font-bold">
        {prefix}{text}/mo
      </span>
    );
  }

  return (
    <p className="text-5xl font-black gradient-text mb-1">
      {text}
      <span className="text-base text-slate-400 font-medium ml-1">/mo</span>
    </p>
  );
}
