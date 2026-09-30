"use client";

import { useId, useState } from "react";
import { Icon } from "@/components/ui/Icon";
import { cn } from "@/lib/utils";
import type { QA } from "@/types";

/** Stitch "Knowledge Base" accordion — one open at a time, keyboard accessible. */
export function FaqAccordion({ items, defaultOpen = -1 }: { items: QA[]; defaultOpen?: number }) {
  const [open, setOpen] = useState(defaultOpen);
  const baseId = useId();
  return (
    <div className="flex flex-col gap-space-sm">
      {items.map((item, i) => {
        const expanded = open === i;
        const panelId = `${baseId}-panel-${i}`;
        const buttonId = `${baseId}-button-${i}`;
        return (
          <div key={item.question} className="overflow-hidden rounded-2xl bg-surface-container-lowest shadow-sm">
            <h3>
              <button
                id={buttonId}
                type="button"
                aria-expanded={expanded}
                aria-controls={panelId}
                onClick={() => setOpen(expanded ? -1 : i)}
                className="flex w-full items-center justify-between gap-space-sm p-space-md text-left"
              >
                <span className="font-headline-sm text-[15px] font-semibold leading-6 text-on-surface">{item.question}</span>
                <Icon name="expand_more" size={24} className={cn("text-secondary transition-transform duration-300", expanded && "rotate-180")} />
              </button>
            </h3>
            <div
              id={panelId}
              role="region"
              aria-labelledby={buttonId}
              hidden={!expanded}
              className="px-space-md pb-space-md font-body-sm text-body-sm leading-relaxed text-on-surface-variant"
            >
              {item.answer}
            </div>
          </div>
        );
      })}
    </div>
  );
}
