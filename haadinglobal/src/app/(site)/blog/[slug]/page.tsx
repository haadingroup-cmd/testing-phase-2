import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BlogCard, BlogCover } from "@/components/blog/BlogCard";
import { ShareButtons } from "@/components/blog/ShareButtons";
import { JsonLd } from "@/components/seo/JsonLd";
import { Container } from "@/components/ui/Container";
import { Icon } from "@/components/ui/Icon";
import { getBlogPost, getBlogPosts, getSettings } from "@/lib/data";
import { sanitizeRichText } from "@/lib/sanitize";
import { buildMetadata } from "@/lib/seo/metadata";
import { articleSchema, breadcrumbSchema } from "@/lib/seo/schema";
import { absoluteUrl } from "@/lib/site";
import { formatDate, slugify } from "@/lib/utils";
import { whatsappLink } from "@/lib/whatsapp";

export const revalidate = 300;

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return (await getBlogPosts()).map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlogPost(slug);
  if (!post) return { title: "Article not found", robots: { index: false } };
  return buildMetadata({
    title: post.seoTitle || post.title,
    description: post.seoDescription || post.excerpt,
    path: `/blog/${post.slug}`,
    image: post.coverImage,
    type: "article",
    publishedTime: post.publishedAt,
    modifiedTime: post.updatedAt,
  });
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const [post, posts, settings] = await Promise.all([getBlogPost(slug), getBlogPosts(), getSettings()]);
  if (!post) notFound();

  const related = [
    ...posts.filter((p) => p.slug !== post.slug && p.category === post.category),
    ...posts.filter((p) => p.slug !== post.slug && p.category !== post.category),
  ].slice(0, 3);
  const url = absoluteUrl(`/blog/${post.slug}`);

  return (
    <>
      <article>
        <Container className="max-w-4xl pb-space-md pt-space-md lg:pt-12">
          <nav aria-label="Breadcrumb" className="mb-space-md flex flex-wrap items-center gap-1 font-label-md text-label-md text-on-surface-variant">
            <Link href="/" className="hover:text-secondary">Home</Link>
            <Icon name="chevron_right" size={14} />
            <Link href="/blog" className="hover:text-secondary">Blog</Link>
            <Icon name="chevron_right" size={14} />
            <Link href={`/blog?category=${slugify(post.category)}`} className="hover:text-secondary">{post.category}</Link>
          </nav>
          <h1 className="font-headline-lg-mobile text-headline-lg-mobile font-extrabold tracking-tight text-on-surface md:text-headline-lg">{post.title}</h1>
          <p className="mt-space-sm font-body-lg text-body-lg text-on-surface-variant">{post.excerpt}</p>
          <div className="mt-space-md flex flex-wrap items-center gap-x-4 gap-y-2 font-label-md text-label-md text-on-surface-variant">
            <span className="flex items-center gap-1"><Icon name="person" size={16} /> {post.author}</span>
            {post.publishedAt ? <time dateTime={post.publishedAt} className="flex items-center gap-1"><Icon name="calendar_month" size={16} /> {formatDate(post.publishedAt)}</time> : null}
            {post.readTime ? <span className="flex items-center gap-1"><Icon name="schedule" size={16} /> {post.readTime} read</span> : null}
          </div>
          <BlogCover src={post.coverImage} alt={post.title} priority sizes="(min-width: 1024px) 896px, 100vw" className="mt-space-lg aspect-[1200/630] w-full rounded-2xl shadow-md" />
        </Container>
        <Container className="max-w-3xl">
          <div className="prose prose-hg max-w-none prose-headings:font-bold prose-a:font-semibold prose-img:rounded-xl" dangerouslySetInnerHTML={{ __html: sanitizeRichText(post.content) }} />
          {post.tags.length ? (
            <ul className="mt-space-lg flex flex-wrap gap-2" aria-label="Tags">
              {post.tags.map((t) => (
                <li key={t} className="rounded-full bg-surface-container px-3 py-1 font-label-md text-label-md text-on-surface">#{t}</li>
              ))}
            </ul>
          ) : null}
          <div className="mt-space-lg border-t border-surface-container-high pt-space-md">
            <ShareButtons url={url} title={post.title} />
          </div>
          <div className="mt-space-lg flex flex-col gap-space-sm rounded-2xl bg-primary-container p-space-lg text-on-primary sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="font-headline-sm text-headline-sm font-bold">Want this applied to your business?</p>
              <p className="font-body-sm text-body-sm text-on-primary-container">Get a free strategy review from the {settings.companyName} team.</p>
            </div>
            <div className="flex shrink-0 gap-2">
              <Link href="/contact" className="rounded-lg bg-secondary px-4 py-2.5 font-label-lg text-label-lg text-on-secondary hover:bg-electric-blue">Contact us</Link>
              <a href={whatsappLink(`Hello HaadinGlobal, I read "${post.title}" and would like to discuss it for my business.`, settings.whatsapp)} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 rounded-lg bg-whatsapp px-4 py-2.5 font-label-lg text-label-lg text-white">
                <Icon name="chat" size={18} /> WhatsApp
              </a>
            </div>
          </div>
        </Container>
      </article>
      {related.length ? (
        <Container as="section" className="py-space-xl">
          <h2 className="mb-space-md font-headline-md text-headline-md font-bold text-on-surface">Related articles</h2>
          <div className="grid gap-space-md md:grid-cols-2 xl:grid-cols-3">
            {related.map((p) => <BlogCard key={p.slug} post={p} />)}
          </div>
        </Container>
      ) : null}
      <JsonLd
        data={[
          articleSchema(post, settings.companyName),
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Blog", path: "/blog" },
            { name: post.title, path: `/blog/${post.slug}` },
          ]),
        ]}
      />
    </>
  );
}
