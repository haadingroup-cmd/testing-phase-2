import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { BLOG_POSTS } from "@/data/blog";

export const metadata: Metadata = {
  title: "Blog — Digital Marketing Insights | HaadinGlobal",
  description: "Expert insights on Meta Ads, Google Ads, SEO, YouTube Automation, Shopify, and digital marketing strategies from HaadinGlobal.",
};

export default function BlogPage() {
  return (
    <>
      <section className="pt-36 pb-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#020205] via-[#0a0215] to-[#020205]"/>
        <div className="container relative z-10 text-center">
          <div className="label mb-5">Blog</div>
          <h1 className="font-display font-black text-white mb-5">Digital Marketing <span className="gradient-text">Insights</span></h1>
          <p className="text-slate-400 max-w-xl mx-auto">Expert tips, case studies, and strategies from HaadinGlobal's team.</p>
        </div>
      </section>
      <section className="py-16 bg-[#030306]">
        <div className="container">
          <div className="grid md:grid-cols-2 gap-8">
            {BLOG_POSTS.map(post => (
              <Link key={post.slug} href={`/blog/${post.slug}`}
                className="card-plain rounded-2xl overflow-hidden group hover:-translate-y-2 transition-all"
              >
                <div className="relative h-48 w-full">
                  <Image src={post.image} alt={post.title} fill className="object-cover"/>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"/>
                  <span className="absolute top-4 left-4 text-xs font-bold text-white bg-red-600 px-2.5 py-1 rounded-full">{post.category}</span>
                </div>
                <div className="p-6">
                  <h2 className="text-white font-bold text-lg mb-2 group-hover:text-red-300 transition-colors">{post.title}</h2>
                  <p className="text-slate-400 text-sm leading-relaxed mb-4">{post.excerpt}</p>
                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <span>{post.author} · {post.date}</span>
                    <span>{post.readTime} read</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
