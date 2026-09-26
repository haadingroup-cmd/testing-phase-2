import Link from "next/link";
import { CATEGORIES } from "@/data/categories";
import { toolsByCategory } from "@/data/tools";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Icon } from "@/components/ui/Icon";
import { Reveal } from "@/components/ui/Reveal";
import { JsonLd } from "@/components/ui/JsonLd";
import { itemListLd, pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "AI Tool Categories for UK Small Businesses",
  description: "Browse AI tools for UK small businesses by category: assistants, writing, accounting & MTD, CRM, marketing, customer support, automation, meetings, design, presentations and more.",
  path: "/categories",
});

export default function CategoriesPage() {
  return (
    <div className="container-site py-8">
      <JsonLd data={itemListLd("AI tool categories", CATEGORIES.map((c) => ({ name: c.name, path: `/categories/${c.slug}` })))} />
      <Breadcrumbs items={[{ name: "Categories", path: "/categories" }]} />
      <header className="mt-4 max-w-3xl">
        <h1 className="font-serif text-headline-xl-mobile text-ink md:text-headline-xl">AI tools by category</h1>
        <p className="mt-3 font-serif text-body-lead text-slate-body">Find the right AI software for each job in your business.</p>
      </header>
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {CATEGORIES.map((c, i) => {
          const tools = toolsByCategory(c.slug);
          return (
            <Reveal key={c.slug} delay={(i % 3) * 80}>
              <Link href={`/categories/${c.slug}`} className="card group flex h-full flex-col gap-3 p-5 transition hover:-translate-y-0.5 hover:shadow-pop">
                <span className="flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-tint text-brand group-hover:bg-brand group-hover:text-white">
                    <Icon name={c.icon} className="h-5 w-5" />
                  </span>
                  <span className="text-headline-sm text-ink">{c.name}</span>
                </span>
                <span className="line-clamp-3 text-body-md text-slate-body">{c.intro}</span>
                <span className="mt-auto text-caption text-slate-mute">
                  {tools.length} tools • Top pick: <strong className="text-ink">{tools[0]?.name}</strong>
                </span>
              </Link>
            </Reveal>
          );
        })}
      </div>
    </div>
  );
}
