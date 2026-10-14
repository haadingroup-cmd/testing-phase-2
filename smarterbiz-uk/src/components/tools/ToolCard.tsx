import Link from "next/link";
import { ArrowUpRight, ChevronRight, ShieldCheck } from "lucide-react";
import type { Tool } from "@/lib/types";
import { ToolLogo } from "@/components/ui/ToolLogo";
import { ScoreBadge, ToolChips } from "@/components/ui/Badges";
import { categoryName } from "@/data/categories";
import { outboundRel, outboundUrl } from "@/lib/outbound";

export function ToolCard({ tool, rank }: { tool: Tool; rank?: number }) {
  return (
    <article className="card group relative flex h-full flex-col gap-4 p-5 transition-shadow hover:border-rule-strong hover:shadow-pop">
      <header className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <ToolLogo name={tool.name} color={tool.color} />
          <div className="min-w-0">
            <h3 className="flex items-center gap-1.5 text-headline-sm text-ink">
              {rank ? <span className="tnum text-slate-mute">{rank}.</span> : null}
              <Link href={`/tools/${tool.slug}`} className="truncate after:absolute after:inset-0 hover:underline">
                {tool.name}
              </Link>
            </h3>
            <p className="truncate text-caption text-slate-mute">
              {tool.vendor} • {categoryName(tool.categories[0]!)}
            </p>
          </div>
        </div>
        <ScoreBadge score={tool.score} />
      </header>
      <p className="text-body-md text-slate-body">{tool.summary}</p>
      <ToolChips tool={tool} />
      <p className="text-body-sm text-slate-text">
        <span className="font-semibold text-ink">Best for:</span> {tool.bestFor}
      </p>
      <footer className="mt-auto flex items-center justify-between gap-3 border-t border-rule pt-4">
        <span className="flex min-w-0 items-center gap-1 text-caption text-teal-deep">
          <ShieldCheck className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
          <span className="truncate">UK notes inside</span>
        </span>
        <div className="relative z-10 flex items-center gap-2">
          <a
            href={outboundUrl(tool)}
            target="_blank"
            rel={outboundRel(tool)}
            className="btn-ghost px-2.5 py-1.5 text-body-sm"
            aria-label={`Visit ${tool.name} website (opens in new tab)`}
          >
            Visit <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
          </a>
          <Link href={`/tools/${tool.slug}`} className="btn-primary px-3 py-1.5 text-body-sm">
            Review <ChevronRight className="h-3.5 w-3.5" aria-hidden="true" />
          </Link>
        </div>
      </footer>
    </article>
  );
}
