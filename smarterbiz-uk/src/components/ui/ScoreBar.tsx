export function ScoreBar({ label, value, tone = "brand" }: { label: string; value: number; tone?: "brand" | "teal" }) {
  return (
    <div>
      <div className="flex items-center justify-between text-body-sm">
        <span className="text-slate-body">{label}</span>
        <span className="tnum font-semibold text-ink">{value.toFixed(1)}</span>
      </div>
      <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-surface-high" role="presentation">
        <div
          className={`score-fill h-full rounded-full ${tone === "teal" ? "bg-teal" : "bg-brand"}`}
          style={{ ["--fill" as string]: String(value / 10) }}
        />
      </div>
    </div>
  );
}
