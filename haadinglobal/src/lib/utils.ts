/** Join class names, skipping falsy values. */
export function cn(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(" ");
}

export function formatPKR(amount: number): string {
  return `PKR ${Math.round(amount).toLocaleString("en-US")}`;
}

export function formatUSD(amount: number): string {
  return `$${Math.round(amount).toLocaleString("en-US")}`;
}

/** "PKR 15k" style short price used in compact cards. */
export function formatPKRShort(amount: number): string {
  if (amount >= 1000) return `PKR ${Math.round(amount / 1000)}k`;
  return formatPKR(amount);
}

export function formatDate(value: string | Date | null | undefined): string {
  if (!value) return "";
  const date = typeof value === "string" ? new Date(value) : value;
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

export function slugify(input: string): string {
  return input
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

export function priceUnitLabel(unit: "MONTH" | "PROJECT"): string {
  return unit === "MONTH" ? "/ month" : "/ project";
}

/** Split a textarea value into trimmed, non-empty lines. */
export function linesToArray(value: string): string[] {
  return value
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}
