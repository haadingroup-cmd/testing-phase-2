import { AlertTriangle, Info, Lightbulb } from "lucide-react";
import type { Block, Section } from "@/lib/types";
import { RichText } from "@/components/ui/RichText";
import { ToolMini } from "@/components/tools/ToolMini";
import { toolBySlug } from "@/data/tools";

function BlockView({ b }: { b: Block }) {
  switch (b.type) {
    case "p":
      return <p><RichText text={b.text} /></p>;
    case "h3":
      return <h3>{b.text}</h3>;
    case "ul":
      return <ul>{b.items.map((it) => <li key={it}><RichText text={it} /></li>)}</ul>;
    case "ol":
      return <ol>{b.items.map((it) => <li key={it}><RichText text={it} /></li>)}</ol>;
    case "quote":
      return (
        <blockquote className="border-l-[3px] border-brand bg-surface-lowest px-5 py-4 font-serif text-body-lead italic text-ink">
          <RichText text={b.text} />
          {b.cite && <footer className="mt-2 font-sans text-body-sm not-italic text-slate-mute">— {b.cite}</footer>}
        </blockquote>
      );
    case "callout": {
      const tone = b.tone ?? "info";
      const Icon = tone === "warn" ? AlertTriangle : tone === "tip" ? Lightbulb : Info;
      const cls =
        tone === "warn" ? "border-l-amber-500 bg-amber-50" : tone === "tip" ? "border-l-teal bg-teal/5" : "border-l-brand bg-brand-tint";
      return (
        <aside className={`rounded-r-lg border border-l-[3px] border-rule ${cls} p-4 text-body-md`}>
          <p className="flex items-center gap-2 font-semibold text-ink">
            <Icon className="h-4 w-4" aria-hidden="true" />
            {b.title}
          </p>
          <p className="mt-1 text-slate-body"><RichText text={b.text} /></p>
        </aside>
      );
    }
    case "table":
      return (
        <div className="-mx-4 overflow-x-auto px-4 md:mx-0 md:px-0">
          <table className="w-full min-w-[560px] border-collapse overflow-hidden rounded-lg border border-rule bg-surface-lowest text-left text-body-md">
            {b.caption && <caption className="mb-2 text-left text-caption uppercase text-slate-mute">{b.caption}</caption>}
            <thead className="bg-ink text-white">
              <tr>{b.head.map((h) => <th key={h} scope="col" className="px-3 py-2.5 text-label">{h}</th>)}</tr>
            </thead>
            <tbody className="tnum">
              {b.rows.map((r, i) => (
                <tr key={i} className="border-t border-rule odd:bg-surface-lowest even:bg-surface">
                  {r.map((c, j) =>
                    j === 0 ? (
                      <th key={j} scope="row" className="px-3 py-2.5 font-semibold text-ink"><RichText text={c} /></th>
                    ) : (
                      <td key={j} className="px-3 py-2.5 text-slate-body"><RichText text={c} /></td>
                    ),
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    case "tools": {
      const tools = b.slugs.map(toolBySlug).filter((t): t is NonNullable<typeof t> => Boolean(t));
      return (
        <div className="not-prose grid gap-3 sm:grid-cols-2">
          {tools.map((t) => <ToolMini key={t.slug} tool={t} />)}
        </div>
      );
    }
  }
}

export function Sections({ sections }: { sections: Section[] }) {
  return (
    <>
      {sections.map((s) => (
        <section key={s.id} aria-labelledby={s.id}>
          <h2 id={s.id}>{s.heading}</h2>
          {s.blocks.map((b, i) => (
            <div key={i} className="mt-5 first-of-type:mt-4">
              <BlockView b={b} />
            </div>
          ))}
        </section>
      ))}
    </>
  );
}
