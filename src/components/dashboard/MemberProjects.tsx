"use client";
import { useEffect, useState, useCallback } from "react";
import { Loader2, Upload, FileText, Trash2, Plus, CheckCircle, Clock, XCircle } from "lucide-react";
import { supabaseBrowser } from "@/lib/supabase";

const MAX_BYTES = 10 * 1024 * 1024; // 10 MB
const ACCEPT = ".jpg,.jpeg,.png,.gif,.pdf,.doc,.docx,.txt";
const ALLOWED = [
  "image/jpeg", "image/png", "image/gif",
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "text/plain",
];

interface Project {
  id: string;
  title: string;
  description: string;
  file_paths: string[];
  status: "submitted" | "approved" | "rejected";
  created_at: string;
}

export default function MemberProjects({ ownerId }: { ownerId: string }) {
  const supabase = supabaseBrowser();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase
      .from("projects").select("*").eq("owner_id", ownerId)
      .order("created_at", { ascending: false });
    setProjects((data as Project[]) ?? []);
    setLoading(false);
  }, [supabase, ownerId]);

  useEffect(() => { load(); }, [load]);

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <h2 className="font-bold text-white text-lg">My Projects</h2>
        <button onClick={() => setShowForm((v) => !v)} className="btn-primary text-sm py-2 px-4 inline-flex">
          <Plus size={15} /> Add Project
        </button>
      </div>

      {showForm && (
        <UploadForm ownerId={ownerId} onDone={() => { setShowForm(false); load(); }} />
      )}

      {loading ? (
        <div className="flex items-center gap-2 text-slate-400 text-sm py-8">
          <Loader2 size={16} className="animate-spin" /> Loading…
        </div>
      ) : projects.length === 0 ? (
        <div className="card p-8 text-center">
          <FolderIcon />
          <p className="text-slate-400 text-sm mt-3">No projects yet. Add your first completed project above.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {projects.map((p) => (
            <ProjectRow key={p.id} project={p} onDeleted={load} />
          ))}
        </div>
      )}
    </div>
  );
}

function UploadForm({ ownerId, onDone }: { ownerId: string; onDone: () => void }) {
  const supabase = supabaseBrowser();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");

  function pickFiles(list: FileList | null) {
    if (!list) return;
    const arr = Array.from(list);
    for (const f of arr) {
      if (f.size > MAX_BYTES) { setErr(`"${f.name}" is larger than 10 MB.`); return; }
      if (!ALLOWED.includes(f.type)) { setErr(`"${f.name}" type is not allowed.`); return; }
    }
    setErr("");
    setFiles(arr);
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) { setErr("Please enter a project title."); return; }
    setBusy(true);
    setErr("");
    try {
      const paths: string[] = [];
      for (const f of files) {
        const safe = f.name.replace(/[^a-zA-Z0-9._-]/g, "_");
        const path = `${ownerId}/${Date.now()}-${safe}`;
        const { error } = await supabase.storage.from("project-files").upload(path, f);
        if (error) throw error;
        paths.push(path);
      }
      const { error: insErr } = await supabase.from("projects").insert({
        owner_id: ownerId, title: title.trim(), description: description.trim(), file_paths: paths,
      });
      if (insErr) throw insErr;
      onDone();
    } catch {
      setErr("Upload failed. Please try again.");
      setBusy(false);
    }
  }

  return (
    <form onSubmit={submit} className="card p-6 mb-5 space-y-4">
      <div>
        <label className="text-slate-300 text-sm font-medium">Project title *</label>
        <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Royal Painters Dubai — Website" />
      </div>
      <div>
        <label className="text-slate-300 text-sm font-medium">Description</label>
        <textarea rows={3} value={description} onChange={(e) => setDescription(e.target.value)} placeholder="What you built, tools used, results…" />
      </div>
      <div>
        <label className="text-slate-300 text-sm font-medium">Files (images, GIF, PDF, Word, text · max 10 MB each)</label>
        <input type="file" multiple accept={ACCEPT} onChange={(e) => pickFiles(e.target.files)}
          className="block w-full text-sm text-slate-400 file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-red-500/15 file:text-red-300 file:font-semibold hover:file:bg-red-500/25" />
        {files.length > 0 && <p className="text-slate-500 text-xs mt-2">{files.length} file(s) selected.</p>}
      </div>
      {err && <p className="text-red-400 text-sm bg-red-500/10 px-4 py-2.5 rounded-lg">{err}</p>}
      <button type="submit" disabled={busy} className="btn-primary w-full justify-center py-3 disabled:opacity-50">
        {busy ? <><Loader2 size={16} className="animate-spin" /> Uploading…</> : <><Upload size={16} /> Submit Project</>}
      </button>
    </form>
  );
}

function ProjectRow({ project, onDeleted }: { project: Project; onDeleted: () => void }) {
  const supabase = supabaseBrowser();
  const [busy, setBusy] = useState(false);

  async function remove() {
    if (!confirm("Delete this project?")) return;
    setBusy(true);
    if (project.file_paths.length) {
      await supabase.storage.from("project-files").remove(project.file_paths);
    }
    await supabase.from("projects").delete().eq("id", project.id);
    onDeleted();
  }

  const badge = {
    submitted: { icon: <Clock size={12} />, text: "Pending", cls: "text-amber-400 bg-amber-500/10" },
    approved: { icon: <CheckCircle size={12} />, text: "Approved", cls: "text-green-300 bg-green-500/10" },
    rejected: { icon: <XCircle size={12} />, text: "Rejected", cls: "text-red-400 bg-red-500/10" },
  }[project.status];

  return (
    <div className="card p-5 flex items-start justify-between gap-4">
      <div className="min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <h3 className="font-bold text-white truncate">{project.title}</h3>
          <span className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full ${badge.cls}`}>
            {badge.icon} {badge.text}
          </span>
        </div>
        {project.description && <p className="text-slate-400 text-sm mb-2">{project.description}</p>}
        <p className="text-slate-500 text-xs flex items-center gap-1">
          <FileText size={11} /> {project.file_paths.length} file(s)
        </p>
      </div>
      <button onClick={remove} disabled={busy} className="text-slate-500 hover:text-red-400 flex-shrink-0" aria-label="Delete project">
        {busy ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}
      </button>
    </div>
  );
}

function FolderIcon() {
  return <Upload size={28} className="text-slate-600 mx-auto" />;
}
