import type { BlogPostData } from "@/types";
import { LEGACY_BLOG_POSTS } from "@/content/blog-posts";

/** Legacy posts converted to the BlogPostData shape (seed + offline fallback). */
export const DEFAULT_BLOG_POSTS: BlogPostData[] = LEGACY_BLOG_POSTS.map((post, index) => {
  const parsed = new Date(post.date);
  const publishedAt = Number.isNaN(parsed.getTime()) ? null : new Date(parsed.getTime() + 12 * 3600_000).toISOString();
  return {
    slug: post.slug,
    title: post.title,
    excerpt: post.excerpt,
    content: post.content.trim(),
    coverImage: post.image || null,
    category: post.category,
    tags: post.tags,
    author: post.author,
    readTime: post.readTime,
    featured: index === 0,
    publishedAt,
    updatedAt: publishedAt,
    seoTitle: null,
    seoDescription: null,
  };
});
