import type { Config } from "tailwindcss";

// Tokens from the "British Editorial Intelligence" Stitch design system (DESIGN.md).
const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: { DEFAULT: "#0F172A", soft: "#131b2e" },
        surface: {
          DEFAULT: "#f7f9fb",
          lowest: "#ffffff",
          low: "#f2f4f6",
          base: "#eceef0",
          high: "#e6e8ea",
          highest: "#e0e3e5",
        },
        "on-surface": { DEFAULT: "#191c1e", variant: "#45464d" },
        brand: { DEFAULT: "#2563EB", hover: "#1D4ED8", active: "#1E40AF", tint: "#EFF6FF", line: "#BFDBFE", fixed: "#dbe1ff", deep: "#00174b" },
        teal: { DEFAULT: "#0D9488", deep: "#005049", light: "#89f5e7", dim: "#6bd8cb" },
        rule: { DEFAULT: "#E2E8F0", strong: "#CBD5E1", hover: "#94A3B8" },
        slate: { mute: "#64748B", body: "#475569", text: "#334155" },
        periwinkle: { DEFAULT: "#bec6e0", light: "#dae2fd" },
      },
      fontFamily: {
        serif: ["var(--font-newsreader)", "Georgia", "serif"],
        sans: ["var(--font-inter)", "system-ui", "-apple-system", "Segoe UI", "sans-serif"],
      },
      fontSize: {
        "display-hero": ["52px", { lineHeight: "60px", letterSpacing: "-0.02em", fontWeight: "600" }],
        "display-hero-mobile": ["36px", { lineHeight: "42px", letterSpacing: "-0.015em", fontWeight: "600" }],
        "headline-xl": ["40px", { lineHeight: "48px", letterSpacing: "-0.015em", fontWeight: "600" }],
        "headline-xl-mobile": ["30px", { lineHeight: "36px", fontWeight: "600" }],
        "headline-lg": ["32px", { lineHeight: "38px", letterSpacing: "-0.01em", fontWeight: "500" }],
        "headline-md": ["24px", { lineHeight: "30px", fontWeight: "500" }],
        "headline-sm": ["18px", { lineHeight: "26px", letterSpacing: "-0.005em", fontWeight: "600" }],
        "body-lead": ["20px", { lineHeight: "32px" }],
        "body-lg": ["16px", { lineHeight: "26px" }],
        "body-md": ["14px", { lineHeight: "22px" }],
        "body-sm": ["12px", { lineHeight: "18px" }],
        "label": ["13px", { lineHeight: "18px", letterSpacing: "0.02em", fontWeight: "600" }],
        "price": ["14px", { lineHeight: "18px", letterSpacing: "-0.01em", fontWeight: "700" }],
        "caption": ["11px", { lineHeight: "16px", letterSpacing: "0.03em", fontWeight: "500" }],
      },
      maxWidth: { site: "1280px", read: "760px" },
      boxShadow: {
        pop: "0 4px 16px -2px rgba(15, 23, 42, 0.06), 0 1px 2px 0 rgba(15, 23, 42, 0.04)",
        lift: "0 18px 40px -12px rgba(15, 23, 42, 0.18), 0 2px 6px -1px rgba(15, 23, 42, 0.06)",
      },
      keyframes: {
        "fade-up": { "0%": { opacity: "0", transform: "translateY(16px)" }, "100%": { opacity: "1", transform: "translateY(0)" } },
        float: { "0%,100%": { transform: "translateY(0)" }, "50%": { transform: "translateY(-8px)" } },
        "grow-x": { "0%": { transform: "scaleX(0)" }, "100%": { transform: "scaleX(1)" } },
        ticker: { "0%": { transform: "translateX(0)" }, "100%": { transform: "translateX(-50%)" } },
        pulse2: { "0%,100%": { opacity: "1" }, "50%": { opacity: ".35" } },
      },
      animation: {
        "fade-up": "fade-up .7s cubic-bezier(.2,.7,.2,1) both",
        float: "float 6s ease-in-out infinite",
        "grow-x": "grow-x 1.1s cubic-bezier(.2,.7,.2,1) both",
        ticker: "ticker 40s linear infinite",
        pulse2: "pulse2 2s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
