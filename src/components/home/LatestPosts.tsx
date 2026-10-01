import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { BLOG_POSTS } from "@/data/blog";

/**
 * "Latest from the blog" homepage strip — surfaces the 3 newest posts.
 * Purpose: internal linking to blog content (SEO), a freshness signal for
 * Google, and another soft conversion path for visitors not ready to book.
 * Server component (no client JS) so it renders instantly and is fully
 * crawlable by search + AI engines.
 */
export default function LatestPosts() {
  const posts = BLOG_POSTS.slice(0, 3);

  return (
    <section className="py-20 bg-[#030306] border-y border-white/8">
      <div className="container">
        <div className="flex items-end justify-between mb-10 gap-4 flex-wrap">
          <div>
            <div className="label mb-3">From Our Blog</div>
            <h2 className="font-display font-black text-white text-2xl md:text-3xl">
              Latest <span className="gradient-text">Insights</span>
            </h2>
            <p className="text-slate-400 mt-2 text-sm">Practical guides on SEO, paid ads and growth — updated for 2026.</p>
          </div>
          <Link href="/blog" className="btn-ghost text-sm whitespace-nowrap">
            View all articles <ArrowRight size={15} />
          </Link>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {posts.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="card group overflow-hidden flex flex-col hover:border-red-500/30 transition-colors"
            >
              <div className="relative aspect-[16/9] overflow-hidden bg-white/5">
                <Image
                  src={post.image}
                  alt={post.title}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-5 flex flex-col flex-1">
                <div className="flex items-center gap-2 mb-3 text-xs">
                  <span className="px-2.5 py-1 rounded-full bg-red-500/12 text-red-300 font-semibold">{post.category}</span>
                  <span className="text-slate-500">{post.date}</span>
                </div>
                <h3 className="text-white font-bold text-[15px] leading-snug mb-2 group-hover:text-red-300 transition-colors">
                  {post.title}
                </h3>
                <p className="text-slate-400 text-sm leading-relaxed line-clamp-3 flex-1">{post.excerpt}</p>
                <span className="inline-flex items-center gap-1.5 text-red-400 text-sm font-semibold mt-4">
                  Read more <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
