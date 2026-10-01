import { useId } from "react";
import { cn } from "@/lib/utils";

/** HaadinGlobal mark from the Stitch logo (haadinglobal_logo/code.html). */
export function LogoMark({ className, title }: { className?: string; title?: string }) {
  // Unique gradient ids per instance: shared ids break when the first SVG is display:none.
  const id = useId().replace(/:/g, "");
  const blue = `hg-blue-${id}`;
  const gold = `hg-gold-${id}`;
  return (
    <svg viewBox="6 8 44 44" className={cn("shrink-0", className)} role={title ? "img" : undefined} aria-hidden={title ? undefined : true} aria-label={title}>
      <defs>
        <linearGradient id={blue} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#1455D9" />
          <stop offset="100%" stopColor="#2F80FF" />
        </linearGradient>
        <linearGradient id={gold} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#D9A441" />
          <stop offset="100%" stopColor="#F4C96B" />
        </linearGradient>
      </defs>
      <rect x="6" y="8" width="44" height="44" rx="12" fill="#071A35" />
      <path d="M18 18V42M38 18V42M18 30H38" stroke={`url(#${blue})`} strokeWidth="4.5" strokeLinecap="round" />
      <circle cx="38" cy="18" r="4" fill={`url(#${gold})`} />
      <path d="M12 40C16 46 34 47 42 36" stroke={`url(#${gold})`} strokeWidth="2" strokeLinecap="round" strokeDasharray="2 3" opacity="0.8" />
    </svg>
  );
}

/** Full lockup: mark + wordmark + eyebrow, rendered with the site fonts. */
export function Logo({ eyebrow = "Global Agency", className, inverted }: { eyebrow?: string; className?: string; inverted?: boolean }) {
  return (
    <span className={cn("flex min-w-0 items-center gap-space-sm", className)}>
      <LogoMark className="h-8 w-8" />
      <span className="flex min-w-0 flex-col">
        <span className={cn("truncate font-headline-sm text-headline-sm font-bold tracking-tight", inverted ? "text-on-primary" : "text-on-surface")}>
          Haadin<span className={inverted ? "text-electric-blue" : "text-secondary"}>Global</span>
        </span>
        <span className="truncate font-label-eyebrow text-label-eyebrow uppercase text-secondary">{eyebrow}</span>
      </span>
    </span>
  );
}
