import { Suspense } from "react";
import { SearchClient } from "@/components/content/SearchClient";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Search AI Tools, Guides & Comparisons",
  description: "Search SmarterBiz.uk's directory of AI tools, guides and comparisons for UK small businesses.",
  path: "/search",
  noindex: true,
});

export default function SearchPage() {
  return (
    <div className="container-read py-8">
      <Breadcrumbs items={[{ name: "Search", path: "/search" }]} />
      <h1 className="mt-4 font-serif text-headline-xl-mobile text-ink md:text-headline-xl">Search</h1>
      <div className="mt-6">
        <Suspense fallback={<div className="input animate-pulse" />}>
          <SearchClient />
        </Suspense>
      </div>
    </div>
  );
}
