import type { ReactNode } from "react";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";

export function StaticPage({ title, path, lead, children, updated }: { title: string; path: string; lead?: string; children: ReactNode; updated?: string }) {
  return (
    <div className="container-read py-8">
      <Breadcrumbs items={[{ name: title, path }]} />
      <h1 className="mt-4 font-serif text-headline-xl-mobile text-ink md:text-headline-xl">{title}</h1>
      {lead && <p className="mt-3 font-serif text-body-lead text-slate-body">{lead}</p>}
      {updated && <p className="mt-2 text-caption text-slate-mute">Last updated {updated}</p>}
      <div className="prose-editorial mt-8">{children}</div>
    </div>
  );
}
