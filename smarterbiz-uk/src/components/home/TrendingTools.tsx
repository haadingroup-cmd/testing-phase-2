"use client";

import { useMemo, useState } from "react";
import type { Tool } from "@/lib/types";
import { ToolCard } from "@/components/tools/ToolCard";

const FILTERS = [
  { key: "all", label: "All tools" },
  { key: "ai-assistants", label: "AI Assistants" },
  { key: "finance-vat", label: "Finance & VAT" },
  { key: "automation", label: "Automation" },
  { key: "marketing", label: "Marketing" },
  { key: "customer-support", label: "Customer Support" },
  { key: "writing", label: "Writing" },
  { key: "meetings", label: "Meetings" },
] as const;

export function TrendingTools({ tools }: { tools: Tool[] }) {
  const [active, setActive] = useState<string>("all");
  const shown = useMemo(
    () => (active === "all" ? tools : tools.filter((t) => t.categories.includes(active as Tool["categories"][number]))).slice(0, 6),
    [active, tools],
  );

  return (
    <div>
      <div role="tablist" aria-label="Filter tools by category" className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 pb-2 md:mx-0 md:flex-wrap md:px-0">
        {FILTERS.map((f) => (
          <button
            key={f.key}
            role="tab"
            type="button"
            aria-selected={active === f.key}
            onClick={() => setActive(f.key)}
            className={`shrink-0 rounded-full px-3.5 py-1.5 text-label transition-colors ${
              active === f.key ? "bg-ink text-white shadow-sm" : "bg-surface-base text-on-surface hover:bg-surface-high"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>
      <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3" aria-live="polite">
        {shown.map((t) => <ToolCard key={t.slug} tool={t} />)}
      </div>
    </div>
  );
}
