import Link from "next/link";
import type { Guide } from "@/lib/types";
import { GuideCover } from "./GuideCover";
import { formatDate, readingMinutes, sectionsText } from "@/lib/content";

export function GuideCard({ guide }: { guide: Guide }) {
  const mins = readingMinutes(guide.quickAnswer, sectionsText(guide.sections));
  return (
    <article className="card group relative flex h-full flex-col overflow-hidden transition-shadow hover:shadow-pop">
      <GuideCover guide={guide} className="h-36" />
      <div className="flex flex-1 flex-col gap-2 p-5">
        <p className="flex items-center gap-2 text-caption text-slate-mute">
          <span className="rounded bg-ink px-1.5 py-0.5 text-[10px] font-semibold uppercase text-white">{guide.kicker}</span>
          {mins} min read
        </p>
        <h3 className="font-serif text-headline-md text-ink">
          <Link href={`/guides/${guide.slug}`} className="after:absolute after:inset-0 group-hover:underline">
            {guide.title}
          </Link>
        </h3>
        <p className="line-clamp-3 text-body-md text-slate-body">{guide.description}</p>
        <p className="mt-auto pt-2 text-caption text-slate-mute">
          Updated <time dateTime={guide.updated}>{formatDate(guide.updated)}</time>
        </p>
      </div>
    </article>
  );
}
