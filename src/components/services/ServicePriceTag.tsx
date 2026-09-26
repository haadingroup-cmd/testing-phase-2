"use client";
import { useCurrency } from "@/utils/useCurrency";

interface Props {
  pricePkr: number;
  priceUsd: number;
  /** "monthly" shows "/mo"; "one-time" shows "one-time". */
  billing: "monthly" | "one-time";
  /** "lg" for big detail-page hero price, "sm" for inline card chip. */
  size?: "lg" | "sm";
  /** Prefix text e.g. "from " (used on the services list page). */
  prefix?: string;
  /** Small print under the big price (ad spend / revisions note). */
  terms?: string | null;
}

/**
 * Renders the service price in PKR or USD depending on the visitor's
 * country (read from the `hg-country` cookie set by middleware).
 *
 * Server render = PKR (matches the agency's home market and avoids
 * hydration mismatch). Client hydration switches to USD for non-PK visitors.
 */
export default function ServicePriceTag({ pricePkr, priceUsd, billing, size = "lg", prefix, terms }: Props) {
  const { currency } = useCurrency();
  const text =
    currency === "PKR" ? `PKR ${pricePkr.toLocaleString()}` : `$${priceUsd.toLocaleString()}`;
  const suffix = billing === "monthly" ? "/mo" : " one-time";

  if (size === "sm") {
    return (
      <span className="text-xs text-green-300 font-bold">
        {prefix}{text}{suffix}
      </span>
    );
  }

  return (
    <>
      <p className="text-5xl font-black gradient-text mb-1">
        {text}
        <span className="text-base text-slate-400 font-medium ml-1">
          {currency === "USD" ? "USD " : ""}{billing === "monthly" ? "/ month" : "one-time"}
        </span>
      </p>
      {terms && <p className="text-slate-500 text-xs mt-1">{terms}</p>}
    </>
  );
}
