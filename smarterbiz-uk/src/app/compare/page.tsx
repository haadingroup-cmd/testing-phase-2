import Link from "next/link";
import { COMPARISONS } from "@/data/comparisons";
import { toolBySlug } from "@/data/tools";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { ToolLogo } from "@/components/ui/ToolLogo";
import { Reveal } from "@/components/ui/Reveal";
import { JsonLd } from "@/components/ui/JsonLd";
import { itemListLd, pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "AI Tool Comparisons: Head-to-Head Verdicts for UK Businesses",
  description: "Head-to-head AI tool comparisons for UK small businesses: ChatGPT vs Claude, Copilot vs Gemini, Xero vs QuickBooks, Zapier vs Make and more.",
  path: "/compare",
  keywords: ["ai comparison", "ai tool comparison", "chatgpt vs claude", "xero vs quickbooks uk"],
});

export default function ComparePage() {
  return (
    <div className="container-site py-8">
      <JsonLd data={itemListLd("AI tool comparisons", COMPARISONS.map((c) => ({ name: c.title, path: `/compare/${c.slug}` })))} />
      <Breadcrumbs items={[{ name: "Compare", path: "/compare" }]} />
      <header className="mt-4 max-w-3xl">
        <h1 className="font-serif text-headline-xl-mobile text-ink md:text-headline-xl">Head-to-head comparisons</h1>
        <p className="mt-3 font-serif text-body-lead text-slate-body">Side-by-side verdicts on the tools UK small businesses most often choose between.</p>
      </header>
      <div className="mt-8 grid gap-4 md:grid-cols-2">
        {COMPARISONS.map((c, i) => {
          const a = toolBySlug(c.a)!;
          const b = toolBySlug(c.b)!;
          return (
            <Reveal key={c.slug} delay={(i % 2) * 80}>
              <Link href={`/compare/${c.slug}`} className="card group flex h-full flex-col gap-4 p-5 transition hover:shadow-pop">
                <span className="flex items-center gap-3">
                  <ToolLogo name={a.name} color={a.color} size={40} />
                  <span className="text-label uppercase text-slate-mute">vs</span>
                  <ToolLogo name={b.name} color={b.color} size={40} />
                </span>
                <span className="font-serif text-headline-md text-ink group-hover:underline">{c.title}</span>
                <span className="line-clamp-2 text-body-md text-slate-body">{c.verdict}</span>
              </Link>
            </Reveal>
          );
        })}
      </div>
    </div>
  );
}
