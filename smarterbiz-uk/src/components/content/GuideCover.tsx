import { Icon } from "@/components/ui/Icon";
import type { Guide } from "@/lib/types";

const TONES = {
  navy: ["#0F172A", "#1E3A8A", "#38BDF8"],
  blue: ["#1D4ED8", "#2563EB", "#BFDBFE"],
  teal: ["#005049", "#0D9488", "#89f5e7"],
  slate: ["#334155", "#475569", "#CBD5E1"],
} as const;

/** Generated editorial cover art (no stock images, no external requests). */
export function GuideCover({ guide, className = "h-44" }: { guide: Guide; className?: string }) {
  const [a, b, c] = TONES[guide.cover.tone];
  return (
    <div className={`relative w-full overflow-hidden ${className}`} style={{ background: `linear-gradient(135deg, ${a}, ${b})` }} aria-hidden="true">
      <div className="bg-grid-dark absolute inset-0 opacity-60" />
      <svg className="absolute -right-10 -top-10 h-56 w-56 opacity-40" viewBox="0 0 200 200">
        <circle cx="100" cy="100" r="80" fill="none" stroke={c} strokeWidth="1" />
        <circle cx="100" cy="100" r="56" fill="none" stroke={c} strokeWidth="1" />
        <circle cx="100" cy="100" r="32" fill="none" stroke={c} strokeWidth="1" />
      </svg>
      <div className="absolute bottom-4 left-4 flex items-center gap-3">
        <span className="flex h-12 w-12 items-center justify-center rounded-lg bg-white/10 ring-1 ring-white/20 backdrop-blur">
          <Icon name={guide.cover.icon} className="h-6 w-6 text-white" />
        </span>
        <span className="text-caption font-semibold uppercase tracking-[0.18em] text-white/80">{guide.kicker}</span>
      </div>
      <div className="absolute right-5 top-5 flex gap-1">
        {[0.9, 0.6, 0.35].map((o, i) => (
          <span key={i} className="h-10 w-2 rounded-full" style={{ background: c, opacity: o, transform: `translateY(${i * 6}px)` }} />
        ))}
      </div>
    </div>
  );
}
