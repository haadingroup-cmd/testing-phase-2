import Link from "next/link";
import { ChevronRight } from "lucide-react";

export function SectionHead({ kicker, title, href, linkLabel = "View all", as: H = "h2" }: { kicker?: string; title: string; href?: string; linkLabel?: string; as?: "h2" | "h3" }) {
  return (
    <div className="flex items-end justify-between gap-4">
      <div>
        {kicker && <p className="kicker">{kicker}</p>}
        <H className="mt-1 font-serif text-headline-md text-ink md:text-headline-lg">{title}</H>
      </div>
      {href && (
        <Link href={href} className="flex shrink-0 items-center gap-0.5 text-label text-brand hover:underline">
          {linkLabel} <ChevronRight className="h-4 w-4" aria-hidden="true" />
        </Link>
      )}
    </div>
  );
}
