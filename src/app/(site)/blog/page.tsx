import type { Metadata } from "next";
import Link from "next/link";
import { BlogCard, BlogCover } from "@/components/blog/BlogCard";
import { PageHero } from "@/components/sections/shared";
import { JsonLd } from "@/components/seo/JsonLd";
import { Container } from "@/components/ui/Container";
import { Icon } from "@/components/ui/Icon";
import { getBlogPosts } from "@/lib/data";
import { buildMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema } from "@/lib/seo/schema";
import { cn, formatDate, slugify } from "@/lib/utils";

const PAGE_SIZE = 9;

type Props = { searchParams: Promise<{ q?: string; category?: string; page?: string }> };

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const { q, category, page } = await searchParams;
  const base = buildMetadata({
    title: "Insights — Digital Marketing, SEO & Growth Blog",
    description: "Practical guides on Meta & Google Ads, SEO, AI search, Shopify, web development and marketing costs in Pakistan, the UAE, the UK and beyond.",
    path: "/blog",
  });
  // Filtered / searched / paginated variants shouldn't compete with the main listing.
  return q || category || (page && page !== "1") ? { ...base, robots: { index: false, follow: true } } : base;
}

function hrefFor(params: { q?: string; category?: string; page?: number }) {
  const sp = new URLSearchParams();
  if (params.q) sp.set("q", params.q);
  if (params.category) sp.set("category", params.category);
  if (params.page && params.page > 1) sp.set("page", String(params.page));
  const s = sp.toString();
  return s ? `/blog?${s}` : "/blog";
}

export default async function BlogPage({ searchParams }: Props) {
  const { q: rawQ, category: rawCategory, page: rawPage } = await searchParams;
  const q = (rawQ ?? "").trim().slice(0, 80);
  const posts = await getBlogPosts();
  // Categories are addressed by URL-safe slugs (?category=ai-aeo).
  const categories = [...new Set(posts.map((p) => p.category))].sort().map((name) => ({ name, slug: slugify(name) }));
  const activeCategory = categories.find((c) => c.slug === rawCategory);
  const category = activeCategory?.slug;

  const needle = q.toLowerCase();
  const filtered = posts.filter(
    (p) =>
      (!activeCategory || p.category === activeCategory.name) &&
      (!needle || p.title.toLowerCase().includes(needle) || p.excerpt.toLowerCase().includes(needle) || p.tags.some((t) => t.toLowerCase().includes(needle))),
  );
  const isDefaultView = !q && !category;
  const featured = isDefaultView ? (posts.find((p) => p.featured) ?? posts[0]) : undefined;
  const list = featured ? filtered.filter((p) => p.slug !== featured.slug) : filtered;
  const totalPages = Math.max(1, Math.ceil(list.length / PAGE_SIZE));
  const page = Math.min(Math.max(1, Number.parseInt(rawPage ?? "1", 10) || 1), totalPages);
  const pageItems = list.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <>
      <PageHero eyebrow="Insights & Playbooks" title="Growth Insights" description="Practical, no-fluff guides on paid ads, SEO, AI search, eCommerce and web — written from real campaign experience.">
        <form action="/blog" method="get" role="search" className="mt-space-md flex max-w-xl gap-2">
          {category ? <input type="hidden" name="category" value={category} /> : null}
          <label htmlFor="blog-q" className="sr-only">
            Search articles
          </label>
          <div className="relative flex-1">
            <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-outline">
              <Icon name="search" size={18} />
            </span>
            <input
              id="blog-q"
              name="q"
              defaultValue={q}
              type="search"
              placeholder="Search articles…"
              className="h-11 w-full rounded-xl border border-transparent bg-surface-container-lowest pl-10 pr-3 font-body-sm text-body-sm shadow-sm focus:border-electric-blue focus:outline-none focus:ring-[3px] focus:ring-electric-blue/15"
            />
          </div>
          <button type="submit" className="rounded-xl bg-secondary px-space-md font-label-lg text-label-lg text-on-secondary hover:bg-primary-container">
            Search
          </button>
        </form>
      </PageHero>

      <Container>
        <nav aria-label="Categories" className="no-scrollbar -mx-margin-mobile flex gap-2 overflow-x-auto px-margin-mobile pb-space-md md:mx-0 md:flex-wrap md:px-0">
          <Link
            href={hrefFor({ q })}
            aria-current={!category ? "page" : undefined}
            className={cn("shrink-0 rounded-full px-4 py-2 font-label-md text-label-md", !category ? "bg-secondary text-on-secondary" : "bg-surface-container-high text-on-surface-variant hover:bg-surface-variant")}
          >
            All
          </Link>
          {categories.map((c) => (
            <Link
              key={c.slug}
              href={hrefFor({ q, category: c.slug })}
              aria-current={category === c.slug ? "page" : undefined}
              className={cn("shrink-0 rounded-full px-4 py-2 font-label-md text-label-md", category === c.slug ? "bg-secondary text-on-secondary" : "bg-surface-container-high text-on-surface-variant hover:bg-surface-variant")}
            >
              {c.name}
            </Link>
          ))}
        </nav>

        {featured && page === 1 ? (
          <article className="group mb-space-lg grid overflow-hidden rounded-2xl bg-surface-container-lowest shadow-md lg:grid-cols-2">
            <Link href={`/blog/${featured.slug}`} className="block overflow-hidden" tabIndex={-1} aria-hidden="true">
              <BlogCover src={featured.coverImage} alt="" priority sizes="(min-width: 1024px) 640px, 100vw" className="aspect-[1200/630] h-full w-full" />
            </Link>
            <div className="flex flex-col justify-center gap-space-sm p-space-lg">
              <span className="font-label-eyebrow text-label-eyebrow uppercase tracking-widest text-secondary">Featured · {featured.category}</span>
              <h2 className="font-headline-md text-headline-md font-bold text-on-surface">
                <Link href={`/blog/${featured.slug}`} className="hover:text-secondary">
                  {featured.title}
                </Link>
              </h2>
              <p className="font-body-md text-body-md text-on-surface-variant">{featured.excerpt}</p>
              <span className="font-label-md text-label-md text-on-surface-variant">
                {featured.author} · {formatDate(featured.publishedAt)} {featured.readTime ? `· ${featured.readTime} read` : ""}
              </span>
            </div>
          </article>
        ) : null}

        {q ? (
          <p className="mb-space-md font-body-md text-body-md text-on-surface-variant" aria-live="polite">
            {filtered.length} result{filtered.length === 1 ? "" : "s"} for &ldquo;{q}&rdquo; ·{" "}
            <Link href={hrefFor({ category })} className="text-secondary hover:underline">
              clear search
            </Link>
          </p>
        ) : null}

        {pageItems.length ? (
          <div className="grid gap-space-md md:grid-cols-2 xl:grid-cols-3">
            {pageItems.map((p) => (
              <BlogCard key={p.slug} post={p} />
            ))}
          </div>
        ) : !featured ? (
          <div className="rounded-2xl bg-surface-container-low p-space-xl text-center">
            <Icon name="search" size={32} className="text-outline" />
            <p className="mt-space-sm text-on-surface-variant">No articles found. Try a different search or category.</p>
          </div>
        ) : null}

        {totalPages > 1 ? (
          <nav aria-label="Pagination" className="mt-space-lg flex items-center justify-center gap-2">
            {page > 1 ? (
              <Link href={hrefFor({ q, category, page: page - 1 })} className="flex items-center gap-1 rounded-lg bg-surface-container-lowest px-3 py-2 font-label-md text-label-md shadow-sm hover:bg-surface-container">
                <Icon name="chevron_left" size={16} /> Previous
              </Link>
            ) : null}
            <span className="px-3 font-label-md text-label-md text-on-surface-variant">
              Page {page} of {totalPages}
            </span>
            {page < totalPages ? (
              <Link href={hrefFor({ q, category, page: page + 1 })} className="flex items-center gap-1 rounded-lg bg-surface-container-lowest px-3 py-2 font-label-md text-label-md shadow-sm hover:bg-surface-container">
                Next <Icon name="chevron_right" size={16} />
              </Link>
            ) : null}
          </nav>
        ) : null}
      </Container>
      <JsonLd data={breadcrumbSchema([{ name: "Home", path: "/" }, { name: "Blog", path: "/blog" }])} />
    </>
  );
}
