import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Star, Mail, Linkedin, ArrowLeft } from "lucide-react";
import { TEAM, getMember } from "@/data/team";
import { CTASection } from "@/components/home/SiteSections";
import { supabaseServer } from "@/lib/supabase-server";

export const dynamic = "force-dynamic";

interface Display {
  full_name: string;
  title: string;
  level: string;
  bio: string;
  photo_url: string;
  email?: string;
  linkedin?: string;
  skills: string[];
  stars: number;
}

async function load(slug: string): Promise<Display | null> {
  const ready = Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
  if (ready) {
    try {
      const supabase = supabaseServer();
      const { data } = await supabase
        .from("profiles")
        .select("full_name, title, level, bio, photo_url, email, linkedin, skills, stars, is_public")
        .eq("id", slug).eq("is_public", true).single();
      if (data) {
        return {
          full_name: data.full_name, title: data.title, level: data.level, bio: data.bio,
          photo_url: data.photo_url || "/logo-small.png", email: data.email || undefined,
          linkedin: data.linkedin || undefined, skills: data.skills || [], stars: data.stars,
        };
      }
    } catch { /* fall through */ }
  }
  const m = getMember(slug);
  if (!m) return null;
  return {
    full_name: m.full_name, title: m.title, level: m.level, bio: m.bio, photo_url: m.photo_url,
    email: m.email, linkedin: m.linkedin, skills: m.skills, stars: m.stars,
  };
}

export function generateStaticParams() {
  return TEAM.map((m) => ({ slug: m.slug }));
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const m = await load(params.slug);
  if (!m) return { title: "Team Member Not Found" };
  return {
    title: `${m.full_name} - ${m.title}`,
    description: m.bio.slice(0, 155),
    alternates: { canonical: `/team/${params.slug}` },
    openGraph: {
      type: "profile",
      title: `${m.full_name} - ${m.title} at HaadinGlobal`,
      description: m.bio.slice(0, 155),
      images: [{ url: m.photo_url }],
    },
  };
}

export default async function MemberPage({ params }: { params: { slug: string } }) {
  const m = await load(params.slug);
  if (!m) notFound();

  const personLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: m.full_name,
    jobTitle: m.title,
    worksFor: { "@type": "Organization", name: "HaadinGlobal", url: "https://www.haadinglobal.com" },
    image: m.photo_url.startsWith("http") ? m.photo_url : `https://www.haadinglobal.com${m.photo_url}`,
    ...(m.linkedin ? { sameAs: [m.linkedin] } : {}),
    ...(m.email ? { email: m.email } : {}),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(personLd) }} />

      <section className="pt-36 pb-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#020205] via-[#0a0215] to-[#020205]" />
        <div className="container relative z-10 max-w-3xl mx-auto">
          <Link href="/team" className="inline-flex items-center gap-1.5 text-slate-400 hover:text-red-400 text-sm font-semibold mb-8 transition-colors">
            <ArrowLeft size={15} /> Back to team
          </Link>

          <div className="flex flex-col sm:flex-row gap-8 items-center sm:items-start">
            <div className="relative w-40 h-40 flex-shrink-0 rounded-2xl overflow-hidden ring-2 ring-white/10">
              <Image src={m.photo_url} alt={m.full_name} fill className="object-cover" sizes="160px" priority />
            </div>
            <div className="text-center sm:text-left">
              <h1 className="font-display font-black text-white text-3xl md:text-4xl mb-2">{m.full_name}</h1>
              <p className="text-red-400 font-semibold text-lg">{m.title}</p>
              <p className="text-slate-500 text-sm mb-3">{m.level}</p>
              <div className="flex items-center justify-center sm:justify-start gap-0.5 mb-5">
                {[...Array(5)].map((_, j) => (
                  <Star key={j} size={16} className={j < m.stars ? "text-amber-400 fill-amber-400" : "text-slate-700"} />
                ))}
              </div>
              <div className="flex flex-wrap gap-3 justify-center sm:justify-start">
                {m.email && (
                  <a href={`mailto:${m.email}`} className="inline-flex items-center gap-2 text-sm text-slate-300 hover:text-white card px-4 py-2">
                    <Mail size={14} className="text-red-400" /> Email
                  </a>
                )}
                {m.linkedin && (
                  <a href={m.linkedin} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-sm text-slate-300 hover:text-white card px-4 py-2">
                    <Linkedin size={14} className="text-red-400" /> LinkedIn
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="pb-20 bg-[#030306]">
        <div className="container max-w-3xl mx-auto">
          <h2 className="font-bold text-white text-xl mb-4">About</h2>
          <p className="text-slate-300 leading-relaxed mb-10">{m.bio}</p>

          {m.skills.length > 0 && (
            <>
              <h2 className="font-bold text-white text-xl mb-4">Skills</h2>
              <div className="flex flex-wrap gap-2">
                {m.skills.map((s) => (
                  <span key={s} className="text-xs px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-slate-300">{s}</span>
                ))}
              </div>
            </>
          )}
        </div>
      </section>

      <CTASection />
    </>
  );
}
