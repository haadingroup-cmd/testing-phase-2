"use client";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/components/providers/ThemeProvider";

/**
 * Premium pill-style light/dark switch. Sits next to the language switcher
 * in the navbar. Renders a stable shell on the server (defaults to dark) and
 * animates the knob to the correct side once mounted — no hydration mismatch.
 */
export default function ThemeToggle({ className = "" }: { className?: string }) {
  const { theme, toggleTheme, mounted } = useTheme();
  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      title={isDark ? "Switch to light mode" : "Switch to dark mode"}
      className={`theme-toggle relative inline-flex h-9 w-[68px] flex-shrink-0 items-center rounded-full border p-1 transition-all duration-300 ${className}`}
    >
      {/* Track icons */}
      <span className="pointer-events-none absolute inset-0 flex items-center justify-between px-2">
        <Sun
          size={14}
          className={`transition-all duration-300 ${isDark ? "opacity-40 text-slate-400" : "opacity-100 text-amber-500"}`}
        />
        <Moon
          size={13}
          className={`transition-all duration-300 ${isDark ? "opacity-100 text-indigo-300" : "opacity-40 text-slate-400"}`}
        />
      </span>

      {/* Sliding knob */}
      <span
        className={`theme-toggle-knob relative z-10 flex h-7 w-7 items-center justify-center rounded-full shadow-md transition-transform duration-300 ease-[cubic-bezier(0.2,0.8,0.4,1)] ${
          mounted && !isDark ? "translate-x-[32px]" : "translate-x-0"
        }`}
      >
        {isDark ? (
          <Moon size={13} className="text-indigo-200" />
        ) : (
          <Sun size={14} className="text-amber-500" />
        )}
      </span>
    </button>
  );
}
