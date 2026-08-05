import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Star, Mail, Linkedin, ArrowLeft, MapPin, Briefcase, Quote, CheckCircle2, Globe, FileText } from "lucide-react";
import { TEAM, getMember, type TeamMember } from "@/data/team";
import { CTASection } from "@/components/home/SiteSections";
import { supabaseServer } from "@/lib/supabase-server";

export const dynamic = "force-dynamic";

interface MediaItem {
  id: string;
  kind: "image" | "pdf" | "link" | "text";
  title: string;
  url: string;
  body: string;
  sort_order: number;
}

type Display = Omit<TeamMember, "is_public"> & { website?: string; media?: MediaItem[] };

interface DbRow {
  id: string;
  full_name: string;
  title: string;
  level: string;
  bio: string;
  photo_url: string;
  email: string;
  linkedin: string;
  website: string;
  skills: string[];
  stars: number;
}

const norm = (s: string) => s.trim().toLowerCase();

async function load(slug: string): Promise<Display | null> {
  const ready = Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

  let staticM = getMember(slug);
  let db: DbRow | null = null;

  if (ready) {
    try {
      const supabase = supabaseServer();
      const cols = "id, full_name, title, level, bio, photo_url, email, linkedin, website, skills, stars";
      if (staticM) {
        // Real member: find their live (editable) row by name.
        const { data } = await supabase
          .from("profiles").select(cols)
          .ilike("full_name", staticM.full_name).eq("is_public", true).limit(1).maybeSingle();
        db = (data as DbRow) ?? null;
      } else {
        // Dashboard-only member: the slug is their id.
        const { data } = await supabase
          .from("profiles").select(cols)
          .eq("id", slug).eq("is_public", true).maybeSingle();
        db = (data as DbRow) ?? null;
        if (db) staticM = TEAM.find((t) => norm(t.full_name) === norm(db!.full_name));
      }
    } catch { /* fall through to static */ }
  }

  if (!staticM && !db) return null;

  let media: MediaItem[] = [];
  if (ready && db?.id) {
    try {
      const supabase = supabaseServer();
      const { data } = await supabase
        .from("profile_media").select("id, kind, title, url, body, sort_order")
        .eq("profile_id", db.id)
        .order("sort_order", { ascending: true }).order("created_at", { ascending: true });
      media = (data as MediaItem[]) ?? [];
    } catch { /* ignore */ }
  }

  // DB (live edits) override static per non-empty field; static keeps the rich extras.
  const pick = (a?: string, b?: string) => (a && a.trim() ? a : (b || ""));

  return {
    slug,
    full_name: db?.full_name || staticM?.full_name || "",
    title: pick(db?.title, staticM?.title),
    level: (staticM?.level || (db?.level as TeamMember["level"]) || "Junior") as TeamMember["level"],
    bio: pick(db?.bio, staticM?.bio),
    photo_url: pick(db?.photo_url, staticM?.photo_url) || "/logo-small.png",
    email: pick(db?.email, staticM?.email) || undefined,
    linkedin: pick(db?.linkedin, staticM?.linkedin) || undefined,
    website: pick(db?.website) || undefined,
    skills: (db?.skills && db.skills.length ? db.skills : staticM?.skills) || [],
    stars: db?.stars ?? staticM?.stars ?? 5,
    photo_position: staticM?.photo_position,
    tagline: staticM?.tagline,
    location: staticM?.location,
    experience: staticM?.experience,
    stats: staticM?.stats,
    expertise: staticM?.expertise,
    projects: staticM?.projects,
    quote: staticM?.quote,
    languages: staticM?.languages,
    media,
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
    description: (m.tagline || m.bio).slice(0, 155),
    alternates: { canonical: `/team/${params.slug}` },
    openGraph: {
      type: "profile",
      title: `${m.full_name} - ${m.title} at HaadinGlobal`,
      description: (m.tagline || m.bio).slice(0, 155),
      images: [{ url: m.photo_url }],
    },
  };
}

export default async function MemberPage({ params }: { params: { slug: string } }) {
  const m = await load(params.slug);
  if (!m) notFound();

  const objPos = m.photo_position || "center";
  const media = m.media || [];

  const personLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: m.full_name,
    jobTitle: m.title,
    ...(m.tagline ? { description: m.tagline } : {}),
    worksFor: { "@type": "Organization", name: "HaadinGlobal", url: "https://www.haadinglobal.com" },
    ...(m.location ? { homeLocation: { "@type": "Place", name: m.location } } : {}),
    ...(m.skills?.length ? { knowsAbout: m.skills } : {}),
    image: m.photo_url.startsWith("http") ? m.photo_url : `https://www.haadinglobal.com${m.photo_url}`,
    sameAs: [m.linkedin, m.website].filter(Boolean),
    ...(m.email ? { email: m.email } : {}),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(personLd) }} />

      <section className="pt-32 pb-14 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#020205] via-[#0a0215] to-[#020205]" />
        <div className="absolute top-24 -left-24 w-96 h-96 rounded-full bg-red-600/10 blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-96 h-96 rounded-full bg-rose-700/10 blur-[120px] pointer-events-none" />

        <div className="container relative z-10 max-w-5xl mx-auto">
          <Link href="/team" className="inline-flex items-center gap-1.5 text-slate-400 hover:text-red-400 text-sm font-semibold mb-8 transition-colors">
            <ArrowLeft size={15} /> Back to team
          </Link>

          <div className="grid md:grid-cols-[minmax(0,340px)_1fr] gap-10 lg:gap-14 items-start">
            <div className="mx-auto md:mx-0 w-full max-w-[340px]">
              <div className="relative aspect-[4/5] rounded-3xl overflow-hidden ring-1 ring-white/15 shadow-[0_25px_80px_-15px_rgba(239,68,68,0.35)]">
                <div className="absolute -inset-1 bg-gradient-to-tr from-red-600/30 via-transparent to-rose-500/20 blur-2xl -z-10" />
                <Image src={m.photo_url} alt={m.full_name} fill className="object-cover"
                  style={{ objectPosition: objPos }} sizes="(max-width: 768px) 90vw, 340px" priority />
                <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/50 to-transparent" />
                <span className="absolute top-4 left-4 text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full bg-red-600 text-white shadow-lg">
                  {m.level}
                </span>
              </div>

              <div className="flex flex-wrap gap-3 mt-5 justify-center md:justify-start">
                {m.email && (
                  <a href={`mailto:${m.email}`} className="inline-flex items-center gap-2 text-sm text-slate-200 hover:text-white card px-4 py-2 transition-colors">
                    <Mail size={14} className="text-red-400" /> Email
                  </a>
                )}
                {m.linkedin && (
                  <a href={m.linkedin} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-sm text-slate-200 hover:text-white card px-4 py-2 transition-colors">
                    <Linkedin size={14} className="text-red-400" /> LinkedIn
                  </a>
                )}
                {m.website && (
                  <a href={m.website} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-sm text-slate-200 hover:text-white card px-4 py-2 transition-colors">
                    <Globe size={14} className="text-red-400" /> Website
                  </a>
                )}
              </div>
            </div>

            <div className="text-center md:text-left">
              <h1 className="font-display font-black text-white text-4xl md:text-5xl leading-tight mb-3">{m.full_name}</h1>
              <p className="text-red-400 font-bold text-xl mb-4">{m.title}</p>

              {m.tagline && (
                <p className="text-slate-200 text-lg leading-relaxed mb-6 max-w-xl mx-auto md:mx-0">{m.tagline}</p>
              )}

              <div className="flex flex-wrap items-center gap-x-6 gap-y-2 justify-center md:justify-start text-sm text-slate-400 mb-5">
                {m.location && (
                  <span className="inline-flex items-center gap-1.5"><MapPin size={14} className="text-red-400" /> {m.location}</span>
                )}
                {m.experience && (
                  <span className="inline-flex items-center gap-1.5"><Briefcase size={14} className="text-red-400" /> {m.experience}</span>
                )}
                {m.languages?.length ? (
                  <span className="inline-flex items-center gap-1.5"><Globe size={14} className="text-red-400" /> {m.languages.join(", ")}</span>
                ) : null}
              </div>

              <div className="flex items-center justify-center md:justify-start gap-0.5 mb-8">
                {[...Array(5)].map((_, j) => (
                  <Star key={j} size={18} className={j < m.stars ? "text-amber-400 fill-amber-400" : "text-slate-700"} />
                ))}
              </div>

              {m.stats?.length ? (
                <div className="grid grid-cols-3 gap-3 max-w-lg mx-auto md:mx-0">
                  {m.stats.map((s) => (
                    <div key={s.label} className="card rounded-2xl p-4 text-center">
                      <div className="font-display font-black text-white text-2xl md:text-3xl mb-1">{s.value}</div>
                      <div className="text-[11px] text-slate-400 font-semibold leading-tight">{s.label}</div>
                    </div>
                  ))}
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </section>

      <section className="pb-16 bg-[#030306]">
        <div className="container max-w-5xl mx-auto">
          <div className="grid lg:grid-cols-[1fr_320px] gap-12">
            <div>
              <h2 className="font-display font-black text-white text-2xl mb-4">About {m.full_name.split(" ")[0]}</h2>
              <p className="text-slate-300 leading-relaxed text-[15px] mb-10 whitespace-pre-line">{m.bio}</p>

              {m.expertise?.length ? (
                <>
                  <h2 className="font-display font-black text-white text-2xl mb-5">What {m.full_name.split(" ")[0]} Does</h2>
                  <div className="space-y-4 mb-10">
                    {m.expertise.map((e) => (
                      <div key={e.title} className="card rounded-2xl p-5">
                        <h3 className="text-white font-bold mb-1.5 flex items-center gap-2">
                          <CheckCircle2 size={16} className="text-red-400 flex-shrink-0" /> {e.title}
                        </h3>
                        <p className="text-slate-400 text-sm leading-relaxed pl-6">{e.detail}</p>
                      </div>
                    ))}
                  </div>
                </>
              ) : null}

              {m.quote && (
                <div className="relative card rounded-2xl p-6 md:p-8 mb-10 overflow-hidden">
                  <Quote size={40} className="text-red-600/20 absolute top-4 right-4" />
                  <p className="text-slate-200 text-lg md:text-xl font-display italic leading-relaxed relative z-10">
                    “{m.quote}”
                  </p>
                </div>
              )}
            </div>

            <aside className="space-y-8">
              {m.skills.length > 0 && (
                <div className="card rounded-2xl p-6">
                  <h3 className="font-bold text-white text-lg mb-4">Skills</h3>
                  <div className="flex flex-wrap gap-2">
                    {m.skills.map((s) => (
                      <span key={s} className="text-xs px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-slate-300">{s}</span>
                    ))}
                  </div>
                </div>
              )}

              {m.projects?.length ? (
                <div className="card rounded-2xl p-6">
                  <h3 className="font-bold text-white text-lg mb-4">Notable Work</h3>
                  <ul className="space-y-3">
                    {m.projects.map((p) => (
                      <li key={p} className="flex items-start gap-2.5 text-sm text-slate-300">
                        <CheckCircle2 size={15} className="text-red-400 flex-shrink-0 mt-0.5" />
                        <span>{p}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}

              {(m.email || m.linkedin || m.website) && (
                <div className="card rounded-2xl p-6">
                  <h3 className="font-bold text-white text-lg mb-4">Get in Touch</h3>
                  <div className="space-y-3">
                    {m.email && (
                      <a href={`mailto:${m.email}`} className="flex items-center gap-2.5 text-sm text-slate-300 hover:text-white transition-colors">
                        <Mail size={15} className="text-red-400" /> {m.email}
                      </a>
                    )}
                    {m.linkedin && (
                      <a href={m.linkedin} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2.5 text-sm text-slate-300 hover:text-white transition-colors">
                        <Linkedin size={15} className="text-red-400" /> LinkedIn Profile
                      </a>
                    )}
                    {m.website && (
                      <a href={m.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2.5 text-sm text-slate-300 hover:text-white transition-colors break-all">
                        <Globe size={15} className="text-red-400" /> Website
                      </a>
                    )}
                  </div>
                </div>
              )}
            </aside>
          </div>
        </div>
      </section>

      {media.length > 0 && (
        <section className="pb-20 bg-[#030306]">
          <div className="container max-w-5xl mx-auto">
            <h2 className="font-display font-black text-white text-2xl mb-6">Portfolio &amp; Media</h2>
            <div className="grid sm:grid-cols-2 gap-5">
              {media.map((item) => (
                <div key={item.id} className="card rounded-2xl overflow-hidden">
                  {item.kind === "image" && item.url && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={item.url} alt={item.title || "Portfolio image"} className="w-full h-56 object-cover" />
                  )}
                  <div className="p-5">
                    {item.title && <h3 className="text-white font-bold mb-1.5">{item.title}</h3>}
                    {item.kind === "text" && (
                      <p className="text-slate-300 text-sm leading-relaxed whitespace-pre-line">{item.body}</p>
                    )}
                    {item.kind === "pdf" && item.url && (
                      <a href={item.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-red-400 hover:text-red-300 text-sm font-semibold">
                        <FileText size={15} /> View PDF
                      </a>
                    )}
                    {item.kind === "link" && item.url && (
                      <a href={item.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-red-400 hover:text-red-300 text-sm font-semibold break-all">
                        <Globe size={15} /> {item.url}
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      <CTASection />
    </>
  );
}
