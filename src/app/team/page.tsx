import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Star } from "lucide-react";
import { TEAM } from "@/data/team";
import { CTASection } from "@/components/home/SiteSections";
import { supabaseServer } from "@/lib/supabase-server";

export const metadata: Metadata = {
  title: "Our Team",
  description:
    "Meet the HaadinGlobal team — developers, marketers, designers and strategists delivering results for clients across Pakistan, the UAE, Qatar, Saudi Arabia, the UK and the USA.",
  alternates: { canonical: "/team" },
};

export const dynamic = "force-dynamic";

interface DisplayMember {
  slug: string;
  full_name: string;
  title: string;
  level: string;
  photo_url: string;
  stars: number;
}

/**
 * Reads live team rows from Supabase when configured; otherwise falls back to
 * the static seed list. Either way the page always renders (SEO-safe).
 */
async function loadTeam(): Promise<DisplayMember[]> {
  const ready = Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
  if (ready) {
    try {
      const supabase = supabaseServer();
      const { data } = await supabase
        .from("profiles")
        .select("id, full_name, title, level, photo_url, stars, is_public")
        .eq("is_public", true)
        .order("sort_order", { ascending: true });
      if (data && data.length) {
        return data.map((m) => ({
          slug: m.id,
          full_name: m.full_name,
          title: m.title,
          level: m.level,
          photo_url: m.photo_url || "/logo-small.png",
          stars: m.stars,
        }));
      }
    } catch {
      /* fall through to static */
    }
  }
  return TEAM.filter((m) => m.is_public).map((m) => ({
    slug: m.slug, full_name: m.full_name, title: m.title, level: m.level,
    photo_url: m.photo_url, stars: m.stars,
  }));
}

export default async function TeamPage() {
  const members = await loadTeam();
  return (
    <>
      <section className="pt-36 pb-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#020205] via-[#0a0215] to-[#020205]" />
        <div className="container relative z-10 text-center max-w-2xl mx-auto">
          <div className="label mb-5">Our Team</div>
          <h1 className="font-display font-black text-white text-4xl md:text-5xl mb-5">
            The People Behind <span className="gradient-text">HaadinGlobal</span>
          </h1>
          <p className="text-slate-400 leading-relaxed">
            A focused team of developers, marketers, designers and strategists — building and running the work that grows our clients&apos; businesses.
          </p>
        </div>
      </section>

      <section className="pb-20 bg-[#030306]">
        <div className="container">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {members.map((m) => (
              <Link key={m.slug} href={`/team/${m.slug}`}
                className="card p-6 hover:-translate-y-1.5 transition-all group text-center">
                <div className="relative w-24 h-24 mx-auto mb-4 rounded-full overflow-hidden ring-2 ring-white/10 group-hover:ring-red-500/40 transition-all">
                  <Image src={m.photo_url} alt={m.full_name} fill className="object-cover" sizes="96px" />
                </div>
                <h2 className="font-bold text-white text-lg group-hover:text-red-300 transition-colors">{m.full_name}</h2>
                <p className="text-red-400 text-sm font-semibold mb-1">{m.title}</p>
                <p className="text-slate-500 text-xs mb-3">{m.level}</p>
                <div className="flex items-center justify-center gap-0.5">
                  {[...Array(5)].map((_, j) => (
                    <Star key={j} size={12} className={j < m.stars ? "text-amber-400 fill-amber-400" : "text-slate-700"} />
                  ))}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <CTASection />
    </>
  );
}
