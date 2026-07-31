import type { Config } from "tailwindcss";
const config: Config = {
  // Theme controlled via data-theme attribute on <html>; "dark" is the default look.
  darkMode: ["selector", '[data-theme="dark"]'],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ["var(--font-playfair)", "Georgia", "serif"],
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        arabic: ["var(--font-arabic)", "Georgia", "serif"],
      },
      colors: {
        brand: { 500: "#ef4444", 600: "#dc2626", 700: "#b91c1c", 800: "#991b1b" },
        dark: { 950: "#020205", 900: "#0a0a0f", 800: "#111118", 700: "#1a1a25" },
      },
      animation: {
        "spin-slow": "spin 20s linear infinite",
        "float": "float 6s ease-in-out infinite",
        "float2": "float 6s ease-in-out 2s infinite",
        "float4": "float 6s ease-in-out 4s infinite",
        "shimmer": "shimmer 2s linear infinite",
        "ping-slow": "ping 3s cubic-bezier(0, 0, 0.2, 1) infinite",
        "glow-pulse": "glow-pulse 2s ease-in-out infinite",
      },
      keyframes: {
        float: {
          "0%,100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-18px)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        "glow-pulse": {
          "0%,100%": { boxShadow: "0 0 8px #ef4444, 0 0 16px rgba(239,68,68,0.5)" },
          "50%": { boxShadow: "0 0 16px #ef4444, 0 0 32px rgba(239,68,68,0.8)" },
        },
      },
    },
  },
  plugins: [],
};
export default config;
