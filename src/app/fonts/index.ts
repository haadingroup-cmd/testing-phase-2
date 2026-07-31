import localFont from "next/font/local";

/**
 * Self-hosted fonts via next/font/local.
 * --------------------------------------
 * Files are the @fontsource woff2s (latin/arabic subsets only) copied into
 * this folder. Using next/font/local instead of @fontsource CSS imports gives:
 *   • Automatic <link rel="preload"> for the fonts used on each route
 *     (kills the render-blocking discovery chain — the old ~2s LCP delay).
 *   • font-display: swap baked in (text paints immediately in fallback).
 *   • Only the weights/subsets we actually ship (no cyrillic/greek/vietnamese).
 *   • Offline, deterministic builds (no build-time fetch to Google Fonts).
 * Exposed as CSS variables consumed by tailwind.config + globals.css.
 */

export const inter = localFont({
  src: [
    { path: "./inter-latin-400-normal.woff2", weight: "400", style: "normal" },
    { path: "./inter-latin-500-normal.woff2", weight: "500", style: "normal" },
    { path: "./inter-latin-600-normal.woff2", weight: "600", style: "normal" },
    { path: "./inter-latin-700-normal.woff2", weight: "700", style: "normal" },
    { path: "./inter-latin-900-normal.woff2", weight: "900", style: "normal" },
  ],
  variable: "--font-inter",
  display: "swap",
  preload: true,
  fallback: ["system-ui", "sans-serif"],
});

export const playfair = localFont({
  src: [
    { path: "./playfair-display-latin-700-normal.woff2", weight: "700", style: "normal" },
    { path: "./playfair-display-latin-800-normal.woff2", weight: "800", style: "normal" },
    { path: "./playfair-display-latin-900-normal.woff2", weight: "900", style: "normal" },
  ],
  variable: "--font-playfair",
  display: "swap",
  preload: true,
  fallback: ["Georgia", "serif"],
});

// Arabic: not preloaded — English is the default, so we don't ship Arabic
// bytes on first paint. Loads on demand when the UI switches to dir=rtl.
export const notoArabic = localFont({
  src: [
    { path: "./noto-naskh-arabic-arabic-400-normal.woff2", weight: "400", style: "normal" },
    { path: "./noto-naskh-arabic-arabic-700-normal.woff2", weight: "700", style: "normal" },
  ],
  variable: "--font-arabic",
  display: "swap",
  preload: false,
  fallback: ["Georgia", "serif"],
});
