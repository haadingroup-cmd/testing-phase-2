import Link from "next/link";
import type { Tool } from "@/lib/types";
import { ToolLogo } from "@/components/ui/ToolLogo";

export function ToolMini({ tool }: { tool: Tool }) {
  return (
    <Link
      href={`/tools/${tool.slug}`}
      className="card flex items-center gap-3 p-3 no-underline transition hover:border-rule-strong hover:shadow-pop"
    >
      <ToolLogo name={tool.name} color={tool.color} size={36} />
      <span className="min-w-0 flex-1">
        <span className="block truncate text-body-md font-semibold text-ink">{tool.name}</span>
        <span className="block truncate text-caption text-slate-mute">{tool.pricing.from}</span>
      </span>
      <span className="tnum rounded bg-ink px-1.5 py-0.5 text-[12px] font-bold text-white">{tool.score.toFixed(1)}</span>
    </Link>
  );
}
