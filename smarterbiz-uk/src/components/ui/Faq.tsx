import { ChevronDown } from "lucide-react";
import type { Faq as FaqT } from "@/lib/types";
import { RichText } from "./RichText";
import { JsonLd } from "./JsonLd";
import { faqLd } from "@/lib/seo";

export function FaqList({ faqs, heading = "Frequently asked questions", withSchema = true }: { faqs: FaqT[]; heading?: string; withSchema?: boolean }) {
  if (!faqs.length) return null;
  return (
    <section aria-labelledby="faq-heading" className="mt-12">
      {withSchema && <JsonLd data={faqLd(faqs)} />}
      <h2 id="faq-heading" className="font-serif text-headline-md text-ink md:text-headline-lg">{heading}</h2>
      <div className="mt-5 divide-y divide-rule overflow-hidden rounded-lg border border-rule bg-surface-lowest">
        {faqs.map((f) => (
          <details key={f.q} className="group">
            <summary className="flex cursor-pointer list-none items-start justify-between gap-4 px-5 py-4 text-headline-sm text-ink hover:bg-surface [&::-webkit-details-marker]:hidden">
              <h3 className="text-[16px] font-semibold leading-6">{f.q}</h3>
              <ChevronDown className="mt-0.5 h-5 w-5 shrink-0 text-slate-mute transition-transform group-open:rotate-180" aria-hidden="true" />
            </summary>
            <div className="px-5 pb-5 text-body-lg text-slate-body">
              <RichText text={f.a} />
            </div>
          </details>
        ))}
      </div>
    </section>
  );
}
