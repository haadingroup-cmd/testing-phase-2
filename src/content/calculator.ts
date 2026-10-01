/**
 * Package builder configuration. The calculator UI and the server-side
 * validation both use this module, so the estimate a visitor sees is
 * recomputed on the server before a request is saved.
 */
export const CALCULATOR = {
  /** Approximate PKR per USD used for the "≈ $" display. Update when rates move. */
  usdRate: 280,
  /** Extra discount when this many or more services are selected. */
  bundleThreshold: 3,
  bundleDiscount: 0.05,
  stages: [
    { id: "startup", label: "Startup", icon: "rocket_launch", multiplier: 1.0, note: "1.0x Baseline" },
    { id: "growth", label: "Growth", icon: "trending_up", multiplier: 1.25, note: "1.25x Dynamic" },
    { id: "enterprise", label: "Enterprise", icon: "domain", multiplier: 1.6, note: "1.6x High Load" },
  ],
  horizons: [
    { id: "1m", label: "1 Month", months: 1, discount: 0, note: "Standard" },
    { id: "3m", label: "3 Months", months: 3, discount: 0.1, note: "10% Off" },
    { id: "6m", label: "6 Months", months: 6, discount: 0.15, note: "15% Off" },
  ],
} as const;

export type StageId = (typeof CALCULATOR.stages)[number]["id"];
export type HorizonId = (typeof CALCULATOR.horizons)[number]["id"];

export type BuilderService = { slug: string; label: string; icon: string; price: number };

export type Estimate = {
  subtotal: number;
  multiplier: number;
  discountRate: number;
  bundleApplied: boolean;
  monthlyPkr: number;
  monthlyUsd: number;
  months: number;
  totalPkr: number;
};

export function calculateEstimate(services: BuilderService[], stageId: StageId, horizonId: HorizonId): Estimate {
  const stage = CALCULATOR.stages.find((s) => s.id === stageId) ?? CALCULATOR.stages[0];
  const horizon = CALCULATOR.horizons.find((h) => h.id === horizonId) ?? CALCULATOR.horizons[0];
  const subtotal = services.reduce((sum, s) => sum + s.price, 0);
  const bundleApplied = services.length >= CALCULATOR.bundleThreshold;
  const discountRate = horizon.discount + (bundleApplied ? CALCULATOR.bundleDiscount : 0);
  const monthlyPkr = Math.round(subtotal * stage.multiplier * (1 - discountRate));
  return {
    subtotal,
    multiplier: stage.multiplier,
    discountRate,
    bundleApplied,
    monthlyPkr,
    monthlyUsd: Math.round(monthlyPkr / CALCULATOR.usdRate),
    months: horizon.months,
    totalPkr: monthlyPkr * horizon.months,
  };
}
