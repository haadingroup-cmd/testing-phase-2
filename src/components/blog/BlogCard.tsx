import Image from "next/image";
import Link from "next/link";
import { Icon } from "@/components/ui/Icon";
import { cn, formatDate } from "@/lib/utils";
import type { BlogPostData } from "@/types";

export function BlogCover({ src, alt, className, priority, sizes }: { src: string | null; alt: string; className?: string; priority?: boolean; sizes: string }) {
  if (!src) {
    return (
      <div className={cn("flex items-center justify-center bg-gradient-to-br from-primary-container to-secondary", className)} aria-hidden="true">
        <Icon name="article" size={40} className="text-on-primary/40" />
      </div>
    );
  }
  if (src.startsWith("/")) {
    return <Image src={src} alt={alt} width={1200} height={630} sizes={sizes} priority={priority} className={cn("object-cover", className)} />;
  }
  // Remote covers set in the admin are shown as-is (not proxied through the image optimiser).
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={src} alt={alt} loading={priority ? "eager" : "lazy"} className={cn("object-cover", className)} />;
}

export function BlogCard({ post }: { post: BlogPostData }) {
  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl bg-surface-container-lowest shadow-sm transition-all hover:shadow-level-2">
      <Link href={`/blog/${post.slug}`} className="block overflow-hidden" tabIndex={-1} aria-hidden="true">
        <BlogCover src={post.coverImage} alt="" sizes="(min-width: 1280px) 400px, (min-width: 768px) 50vw, 100vw" className="aspect-[1200/630] w-full transition-transform duration-500 group-hover:scale-[1.03]" />
      </Link>
      <div className="flex flex-1 flex-col gap-space-xs p-space-md">
        <div className="flex items-center justify-between gap-2 font-label-md text-label-md">
          <span className="rounded-full bg-surface-container px-2 py-0.5 text-secondary">{post.category}</span>
          {post.readTime ? <span className="text-on-surface-variant">{post.readTime} read</span> : null}
        </div>
        <h3 className="font-headline-sm text-headline-sm font-bold text-on-surface">
          <Link href={`/blog/${post.slug}`} className="hover:text-secondary">
            {post.title}
          </Link>
        </h3>
        <p className="line-clamp-3 font-body-sm text-body-sm text-on-surface-variant">{post.excerpt}</p>
        <div className="mt-auto flex items-center justify-between pt-space-xs font-label-md text-label-md text-on-surface-variant">
          <span>{formatDate(post.publishedAt)}</span>
          <span className="flex items-center gap-1 text-secondary">
            Read <Icon name="arrow_forward" size={16} />
          </span>
        </div>
      </div>
    </article>
  );
}
