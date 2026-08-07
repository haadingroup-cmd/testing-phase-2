import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { BLOG_POSTS } from "@/data/blog";
import { CTASection } from "@/components/home/SiteSections";

export async function generateStaticParams() {
  return BLOG_POSTS.map(p => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const post = BLOG_POSTS.find(p => p.slug === params.slug);
  if (!post) return { title: "Post Not Found" };
  return { title: post.title, description: post.excerpt };
}

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = BLOG_POSTS.find(p => p.slug === params.slug);
  if (!post) notFound();
  return (
    <>
      <section className="pt-36 pb-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#020205] via-[#0a0215] to-[#020205]"/>
        <div className="container relative z-10 max-w-3xl mx-auto">
          <div className="label mb-5">{post.category}</div>
          <h1 className="font-display font-black text-white text-3xl md:text-4xl mb-5">{post.title}</h1>
          <div className="flex items-center gap-4 text-sm text-slate-400">
            <span>By {post.author}</span><span>·</span><span>{post.date}</span><span>·</span><span>{post.readTime} read</span>
          </div>
        </div>
      </section>
      <section className="py-12 bg-[#030306]">
        <div className="container max-w-3xl mx-auto">
          <div className="relative h-64 w-full rounded-2xl overflow-hidden mb-10">
            <Image src={post.image} alt={post.title} fill className="object-cover"/>
          </div>
          <div className="prose prose-invert max-w-none text-slate-300 leading-relaxed blog-body">
            {"content" in post && (post as { content?: string }).content ? (
              <>
                <p className="text-xl mb-6">{post.excerpt}</p>
                <div dangerouslySetInnerHTML={{ __html: (post as { content: string }).content }} />
              </>
            ) : (
              <>
                <p className="text-xl mb-6">{post.excerpt}</p>
                <p>Full article coming soon. In the meantime, <Link href="/consultation" className="text-red-400 hover:underline">book a free consultation</Link> and our team will help you directly.</p>
              </>
            )}
          </div>
          <div className="mt-12 flex flex-wrap gap-2">
            {post.tags.map(tag => (
              <span key={tag} className="text-xs px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-slate-400"># {tag}</span>
            ))}
          </div>
        </div>
      </section>
      <CTASection />
    </>
  );
}
