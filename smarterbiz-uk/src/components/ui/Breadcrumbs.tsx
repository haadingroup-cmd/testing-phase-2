import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { JsonLd } from "./JsonLd";
import { breadcrumbLd } from "@/lib/seo";

export function Breadcrumbs({ items }: { items: { name: string; path: string }[] }) {
  const all = [{ name: "Home", path: "/" }, ...items];
  return (
    <>
      <JsonLd data={breadcrumbLd(all)} />
      <nav aria-label="Breadcrumb" className="text-body-sm text-slate-mute">
        <ol className="flex flex-wrap items-center gap-1">
          {all.map((it, i) => (
            <li key={it.path} className="flex items-center gap-1">
              {i > 0 && <ChevronRight className="h-3.5 w-3.5" aria-hidden="true" />}
              {i === all.length - 1 ? (
                <span aria-current="page" className="line-clamp-1 text-slate-body">{it.name}</span>
              ) : (
                <Link href={it.path} className="hover:text-ink hover:underline">{it.name}</Link>
              )}
            </li>
          ))}
        </ol>
      </nav>
    </>
  );
}
