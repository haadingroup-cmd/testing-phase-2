import { BadgeCheck, Landmark } from "lucide-react";
import type { Tool } from "@/lib/types";

export function ScoreBadge({ score, size = "md" }: { score: number; size?: "md" | "lg" }) {
  return (
    <div className={`flex flex-col items-end`}>
      <span
        className={`tnum rounded bg-ink font-bold text-white ${size === "lg" ? "px-3 py-1.5 text-[22px] leading-none" : "px-2 py-0.5 text-price"}`}
        aria-label={`Editorial score ${score.toFixed(1)} out of 10`}
      >
        {score.toFixed(1)}
        <span className="font-medium text-white/60"> /10</span>
      </span>
      {size === "lg" && <span className="mt-1 text-caption text-slate-mute">Editorial score</span>}
    </div>
  );
}

export function ToolChips({ tool, max = 4 }: { tool: Tool; max?: number }) {
  const chips = [
    <span key="p" className="chip-price">{tool.pricing.from}</span>,
    tool.pricing.freePlan ? <span key="f" className="chip-free">Free plan</span> : tool.pricing.trial ? <span key="t" className="chip-free">{tool.pricing.trial}</span> : null,
    tool.mtdCompatible ? (
      <span key="m" className="chip-teal"><Landmark className="h-3 w-3" aria-hidden="true" />MTD ready</span>
    ) : null,
    tool.ukBuilt ? <span key="u" className="chip-teal">🇬🇧 UK built</span> : null,
    tool.editorsChoice ? (
      <span key="e" className="chip border-teal bg-teal text-white"><BadgeCheck className="h-3 w-3" aria-hidden="true" />Editor&apos;s Choice</span>
    ) : null,
  ].filter(Boolean);
  return <div className="flex flex-wrap items-center gap-1.5">{chips.slice(0, max)}</div>;
}
