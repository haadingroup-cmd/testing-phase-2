"use client";
import { useState, useTransition } from "react";
import Link from "next/link";
import {
  Loader2, Save, Trash2, Plus, Image as ImageIcon, FileText,
  Link as LinkIcon, Type, ExternalLink, ArrowLeft,
} from "lucide-react";
import { supabaseBrowser } from "@/lib/supabase";
import { updateMyProfile } from "@/app/dashboard/profile/actions";

export interface MediaItem {
  id: string;
  kind: "image" | "pdf" | "link" | "text";
  title: string;
  url: string;
  body: string;
  file_path: string;
  sort_order: number;
}

interface Initial {
  full_name: string;
  title: string;
  bio: string;
  photo_url: string;
  linkedin: string;
  website: string;
  skills: string[];
  is_public: boolean;
}

const BUCKET = "profile-media";

export default function ProfileEditor({
  profileId,
  initial,
  media: initialMedia,
}: {
  profileId: string;
  initial: Initial;
  media: MediaItem[];
}) {
  const [title, setTitle] = useState(initial.title);
  const [bio, setBio] = useState(initial.bio);
  const [linkedin, setLinkedin] = useState(initial.linkedin);
  const [website, setWebsite] = useState(initial.website);
  const [skills, setSkills] = useState(initial.skills.join(", "));
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState(initial.photo_url);
  const [pending, startTransition] = useTransition();
  const [msg, setMsg] = useState<{ type: "ok" | "err"; text: string } | null>(null);

  function onPhoto(f: File | null) {
    if (!f) return;
    if (f.size > 5 * 1024 * 1024) { setMsg({ type: "err", text: "Photo must be under 5 MB." }); return; }
    setPhotoFile(f);
    setPhotoPreview(URL.createObjectURL(f));
    setMsg(null);
  }

  function saveProfile(e: React.FormEvent) {
    e.preventDefault();
    const fd = new FormData();
    fd.set("title", title);
    fd.set("bio", bio);
    fd.set("linkedin", linkedin);
    fd.set("website", website);
    fd.set("skills", skills);
    if (photoFile) fd.set("photo", photoFile);
    setMsg(null);
    startTransition(async () => {
      const res = await updateMyProfile(fd);
      if (res.ok) { setMsg({ type: "ok", text: "Saved. Your public profile is updated." }); setPhotoFile(null); }
      else setMsg({ type: "err", text: res.error || "Could not save." });
    });
  }

  const [media, setMedia] = useState<MediaItem[]>(initialMedia);
  const [showAdd, setShowAdd] = useState(false);

  return (
    <div className="space-y-8">
      <Link href="/dashboard" className="inline-flex items-center gap-1.5 text-slate-400 hover:text-red-400 text-sm font-semibold">
        <ArrowLeft size={15} /> Back to dashboard
      </Link>

      <form onSubmit={saveProfile} className="card p-6 space-y-5">
        <h2 className="font-bold text-white text-lg">Profile details</h2>

        <div className="flex items-center gap-5">
          <div className="w-20 h-20 rounded-full overflow-hidden ring-2 ring-white/10 bg-white/5 flex-shrink-0">
            {photoPreview ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={photoPreview} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full grid place-items-center text-slate-600"><ImageIcon size={22} /></div>
            )}
          </div>
          <div>
            <label className="text-slate-300 text-sm font-medium block mb-1">Profile photo</label>
            <input type="file" accept=".jpg,.jpeg,.png,.webp" onChange={(e) => onPhoto(e.target.files?.[0] || null)}
              className="block text-sm text-slate-400 file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-red-500/15 file:text-red-300 file:font-semibold hover:file:bg-red-500/25" />
            <p className="text-slate-500 text-xs mt-1">JPG/PNG/WebP · under 5 MB. Square works best.</p>
          </div>
        </div>

        <div>
          <label className="text-slate-300 text-sm font-medium">Name</label>
          <input value={initial.full_name} disabled className="opacity-60 cursor-not-allowed" />
          <p className="text-slate-500 text-xs mt-1">Your name is set by an admin.</p>
        </div>
        <div>
          <label className="text-slate-300 text-sm font-medium">Title / Role</label>
          <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Full-Stack Developer" />
        </div>
        <div>
          <label className="text-slate-300 text-sm font-medium">Bio</label>
          <textarea rows={4} value={bio} onChange={(e) => setBio(e.target.value)} placeholder="A short introduction shown on your public profile…" />
        </div>
        <div>
          <label className="text-slate-300 text-sm font-medium">Skills (comma separated)</label>
          <input value={skills} onChange={(e) => setSkills(e.target.value)} placeholder="SEO, Meta Ads, React, Shopify" />
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="text-slate-300 text-sm font-medium">LinkedIn URL</label>
            <input value={linkedin} onChange={(e) => setLinkedin(e.target.value)} placeholder="https://linkedin.com/in/…" />
          </div>
          <div>
            <label className="text-slate-300 text-sm font-medium">Website / Portfolio URL</label>
            <input value={website} onChange={(e) => setWebsite(e.target.value)} placeholder="https://…" />
          </div>
        </div>

        {msg && (
          <p className={`text-sm px-4 py-2.5 rounded-lg ${msg.type === "ok" ? "text-green-300 bg-green-500/10" : "text-red-400 bg-red-500/10"}`}>{msg.text}</p>
        )}

        <button type="submit" disabled={pending} className="btn-primary justify-center py-3 disabled:opacity-50">
          {pending ? <><Loader2 size={16} className="animate-spin" /> Saving…</> : <><Save size={16} /> Save profile</>}
        </button>
      </form>

      <div className="card p-6">
        <div className="flex items-center justify-between mb-4 gap-4 flex-wrap">
          <div>
            <h2 className="font-bold text-white text-lg">Portfolio &amp; media</h2>
            <p className="text-slate-400 text-sm">Add images, PDFs, links or notes shown on your public profile.</p>
          </div>
          <button onClick={() => setShowAdd((v) => !v)} className="btn-primary text-sm py-2 px-4 inline-flex">
            <Plus size={15} /> Add
          </button>
        </div>

        {showAdd && (
          <AddMedia profileId={profileId} onAdded={(m) => { setMedia((prev) => [...prev, m]); setShowAdd(false); }} />
        )}

        {media.length === 0 ? (
          <p className="text-slate-500 text-sm py-4">No media yet.</p>
        ) : (
          <div className="space-y-3 mt-2">
            {media.map((m) => (
              <MediaRow key={m.id} item={m} onDeleted={(id) => setMedia((prev) => prev.filter((x) => x.id !== id))} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

const KINDS = [
  { key: "image", label: "Image", icon: <ImageIcon size={14} /> },
  { key: "pdf", label: "PDF", icon: <FileText size={14} /> },
  { key: "link", label: "Link", icon: <LinkIcon size={14} /> },
  { key: "text", label: "Text note", icon: <Type size={14} /> },
] as const;

function AddMedia({ profileId, onAdded }: { profileId: string; onAdded: (m: MediaItem) => void }) {
  const supabase = supabaseBrowser();
  const [kind, setKind] = useState<MediaItem["kind"]>("image");
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [body, setBody] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setErr("");
    if ((kind === "image" || kind === "pdf") && !file) { setErr("Please choose a file."); return; }
    if (kind === "link" && !url.trim()) { setErr("Please enter a URL."); return; }
    if (kind === "text" && !body.trim()) { setErr("Please enter some text."); return; }
    setBusy(true);
    try {
      let finalUrl = url.trim();
      let filePath = "";
      if (file) {
        if (file.size > 10 * 1024 * 1024) { setErr("File must be under 10 MB."); setBusy(false); return; }
        const safe = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
        filePath = `${profileId}/${Date.now()}-${safe}`;
        const up = await supabase.storage.from(BUCKET).upload(filePath, file);
        if (up.error) throw up.error;
        finalUrl = supabase.storage.from(BUCKET).getPublicUrl(filePath).data.publicUrl;
      }
      const { data, error } = await supabase
        .from("profile_media")
        .insert({ profile_id: profileId, kind, title: title.trim(), url: finalUrl, body: body.trim(), file_path: filePath })
        .select("id, kind, title, url, body, file_path, sort_order")
        .single();
      if (error) throw error;
      onAdded(data as MediaItem);
    } catch {
      setErr("Could not add. Please try again.");
      setBusy(false);
    }
  }

  return (
    <form onSubmit={submit} className="p-5 mb-4 space-y-4 border border-white/10 rounded-xl bg-white/[0.02]">
      <div className="flex flex-wrap gap-2">
        {KINDS.map((k) => (
          <button type="button" key={k.key} onClick={() => setKind(k.key)}
            className={`inline-flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-full border transition-colors ${kind === k.key ? "bg-red-500/15 border-red-500/40 text-red-300" : "border-white/10 text-slate-400 hover:text-white"}`}>
            {k.icon} {k.label}
          </button>
        ))}
      </div>
      <div>
        <label className="text-slate-300 text-sm font-medium">Title / caption</label>
        <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Shopify store I built" />
      </div>
      {(kind === "image" || kind === "pdf") && (
        <div>
          <label className="text-slate-300 text-sm font-medium">{kind === "image" ? "Image file" : "PDF file"} (max 10 MB)</label>
          <input type="file" accept={kind === "image" ? ".jpg,.jpeg,.png,.webp,.gif" : ".pdf"} onChange={(e) => setFile(e.target.files?.[0] || null)}
            className="block w-full text-sm text-slate-400 file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-red-500/15 file:text-red-300 file:font-semibold hover:file:bg-red-500/25" />
        </div>
      )}
      {kind === "link" && (
        <div>
          <label className="text-slate-300 text-sm font-medium">URL</label>
          <input value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://…" />
        </div>
      )}
      {kind === "text" && (
        <div>
          <label className="text-slate-300 text-sm font-medium">Text</label>
          <textarea rows={3} value={body} onChange={(e) => setBody(e.target.value)} placeholder="Write a note, testimonial, or details…" />
        </div>
      )}
      {err && <p className="text-red-400 text-sm bg-red-500/10 px-4 py-2.5 rounded-lg">{err}</p>}
      <button type="submit" disabled={busy} className="btn-primary w-full justify-center py-2.5 disabled:opacity-50">
        {busy ? <><Loader2 size={15} className="animate-spin" /> Adding…</> : <><Plus size={15} /> Add to profile</>}
      </button>
    </form>
  );
}

function MediaRow({ item, onDeleted }: { item: MediaItem; onDeleted: (id: string) => void }) {
  const supabase = supabaseBrowser();
  const [busy, setBusy] = useState(false);
  const icon = { image: <ImageIcon size={15} />, pdf: <FileText size={15} />, link: <LinkIcon size={15} />, text: <Type size={15} /> }[item.kind];

  async function remove() {
    if (!confirm("Remove this item?")) return;
    setBusy(true);
    if (item.file_path) await supabase.storage.from(BUCKET).remove([item.file_path]);
    const { error } = await supabase.from("profile_media").delete().eq("id", item.id);
    if (!error) onDeleted(item.id);
    else setBusy(false);
  }

  return (
    <div className="flex items-center justify-between gap-3 border border-white/8 rounded-xl px-4 py-3">
      <div className="flex items-center gap-3 min-w-0">
        <span className="text-red-400 flex-shrink-0">{icon}</span>
        <div className="min-w-0">
          <p className="text-white text-sm font-semibold truncate">{item.title || item.kind}</p>
          {item.kind === "text" ? (
            <p className="text-slate-400 text-xs truncate">{item.body}</p>
          ) : item.url ? (
            <a href={item.url} target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-red-300 text-xs inline-flex items-center gap-1 truncate">
              <ExternalLink size={11} /> {item.url}
            </a>
          ) : null}
        </div>
      </div>
      <button onClick={remove} disabled={busy} className="text-slate-500 hover:text-red-400 flex-shrink-0" aria-label="Remove">
        {busy ? <Loader2 size={15} className="animate-spin" /> : <Trash2 size={15} />}
      </button>
    </div>
  );
}
