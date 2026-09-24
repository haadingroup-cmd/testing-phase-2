/** Neutral monogram tile — avoids reproducing third-party trademarks. */
export function ToolLogo({ name, color, size = 44 }: { name: string; color: string; size?: number }) {
  const letters = name.replace(/[^A-Za-z0-9 ]/g, "").split(/\s+/).filter(Boolean).slice(0, 2).map((w) => w[0]).join("").toUpperCase() || "AI";
  return (
    <span
      className="relative inline-flex shrink-0 items-center justify-center overflow-hidden rounded-lg font-serif font-semibold text-white shadow-[inset_0_-2px_0_rgba(0,0,0,0.15)]"
      style={{ width: size, height: size, background: `linear-gradient(135deg, ${color}, ${color}cc)`, fontSize: size * 0.4 }}
      aria-hidden="true"
    >
      <span className="absolute -right-2 -top-2 h-1/2 w-1/2 rounded-full bg-white/15" />
      {letters}
    </span>
  );
}
