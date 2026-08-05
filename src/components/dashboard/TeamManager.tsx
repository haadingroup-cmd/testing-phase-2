"use client";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Star, Trash2, Plus, Loader2, X, ShieldCheck, Download } from "lucide-react";
import type { Profile, Role } from "@/lib/auth";
import {
  createMember, removeMember, setRole, setLevel, setStars, setPublic, importStaticTeam,
} from "@/app/dashboard/team/actions";

const LEVELS = ["Junior", "Mid", "Senior", "Lead"] as const;
const ROLES: Role[] = ["member", "manager", "admin"];

export default function TeamManager({ members, myRole, myId }: { members: Profile[]; myRole: Role; myId: string }) {
  const [showAdd, setShowAdd] = useState(false);
  const isAdmin = myRole === "admin";

  return (
    <div>
      {isAdmin && (
        <div className="mb-6">
          <div className="flex flex-wrap gap-3">
            <button onClick={() => setShowAdd((v) => !v)} className="btn-primary text-sm py-2.5 px-5 inline-flex">
              {showAdd ? <><X size={15} /> Close</> : <><Plus size={15} /> Add Member</>}
            </button>
            <ImportButton />
          </div>
          {showAdd && <AddMemberForm onDone={() => setShowAdd(false)} />}
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-4">
        {members.map((m) => (
          <MemberCard key={m.id} member={m} isAdmin={isAdmin} isSelf={m.id === myId} />
        ))}
      </div>
    </div>
  );
}

function ImportButton() {
  const router = useRouter();
  const [pending, start] = useTransition();

  function run() {
    if (!confirm("Import your original team (Malaika, Arooba, Nafia, Rohab) as editable accounts?\n\nEach gets the login firstname@haadinglobal.com with temp password Haadin@2026.")) return;
    start(async () => {
      const res = await importStaticTeam();
      if (!res.ok) { alert(res.error || "Import failed."); return; }
      const created = res.created || [];
      if (created.length) {
        alert(
          "Imported: " + created.join(", ") +
          "\n\nLogin email:  firstname@haadinglobal.com  (e.g. malaika@haadinglobal.com)" +
          "\nTemp password:  Haadin@2026" +
          "\n\nShare these with each member. They can log in and update their own profile."
        );
      } else {
        alert("Nothing new to import — they may already exist.");
      }
      router.refresh();
    });
  }

  return (
    <button onClick={run} disabled={pending}
      className="text-sm py-2.5 px-5 inline-flex items-center gap-2 rounded-xl border border-white/15 text-slate-200 hover:bg-white/5 disabled:opacity-50">
      {pending ? <><Loader2 size={15} className="animate-spin" /> Importing…</> : <><Download size={15} /> Import previous team</>}
    </button>
  );
}

function AddMemberForm({ onDone }: { onDone: () => void }) {
  const [pending, start] = useTransition();
  const [err, setErr] = useState("");

  function submit(formData: FormData) {
    setErr("");
    start(async () => {
      const res = await createMember(formData);
      if (!res.ok) setErr(res.error || "Failed.");
      else onDone();
    });
  }

  return (
    <form action={submit} className="card p-6 mt-4 space-y-4">
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="text-slate-300 text-sm font-medium">Full name</label>
          <input name="full_name" placeholder="Arooba Shafique" />
        </div>
        <div>
          <label className="text-slate-300 text-sm font-medium">Job title</label>
          <input name="title" placeholder="Full-Stack Developer" />
        </div>
        <div>
          <label className="text-slate-300 text-sm font-medium">Login email *</label>
          <input name="email" type="email" required placeholder="arooba@haadinglobal.com" />
        </div>
        <div>
          <label className="text-slate-300 text-sm font-medium">Password * (min 8 chars)</label>
          <input name="password" type="text" required placeholder="Set a password" minLength={8} />
        </div>
        <div>
          <label className="text-slate-300 text-sm font-medium">Role</label>
          <select name="role" defaultValue="member">
            <option value="member">Member</option>
            <option value="manager">Manager</option>
            <option value="admin">Admin</option>
          </select>
        </div>
        <div>
          <label className="text-slate-300 text-sm font-medium">Level</label>
          <select name="level" defaultValue="Junior">
            {LEVELS.map((l) => <option key={l} value={l}>{l}</option>)}
          </select>
        </div>
      </div>
      {err && <p className="text-red-400 text-sm bg-red-500/10 px-4 py-2.5 rounded-lg">{err}</p>}
      <p className="text-slate-500 text-xs">You set the email &amp; password here — the member uses them to log in. There is no public sign-up.</p>
      <button type="submit" disabled={pending} className="btn-primary justify-center py-3 disabled:opacity-50">
        {pending ? <><Loader2 size={16} className="animate-spin" /> Creating…</> : "Create Account"}
      </button>
    </form>
  );
}

function MemberCard({ member, isAdmin, isSelf }: { member: Profile; isAdmin: boolean; isSelf: boolean }) {
  const [pending, start] = useTransition();
  const [stars, setStarsLocal] = useState(member.stars);
  const [level, setLevelLocal] = useState(member.level);
  const [role, setRoleLocal] = useState(member.role);
  const [pub, setPub] = useState(member.is_public);
  const [msg, setMsg] = useState("");

  function run(fn: () => Promise<{ ok: boolean; error?: string }>) {
    setMsg("");
    start(async () => {
      const res = await fn();
      if (!res.ok) setMsg(res.error || "Failed.");
    });
  }

  return (
    <div className="card p-5">
      <div className="flex items-start justify-between gap-3 mb-4">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="font-bold text-white truncate">{member.full_name || "(no name)"}</h3>
            {member.role === "admin" && <ShieldCheck size={14} className="text-red-400 flex-shrink-0" />}
          </div>
          <p className="text-slate-400 text-sm truncate">{member.title || "—"}</p>
          <p className="text-slate-600 text-xs truncate">{member.email}</p>
        </div>
        {isAdmin && !isSelf && (
          <button
            onClick={() => { if (confirm(`Remove ${member.full_name}? This deletes their account permanently.`)) run(() => removeMember(member.id)); }}
            disabled={pending} className="text-slate-500 hover:text-red-400 flex-shrink-0" aria-label="Remove member"
          >
            <Trash2 size={16} />
          </button>
        )}
      </div>

      <div className="flex items-center gap-1 mb-3">
        {[1, 2, 3, 4, 5].map((n) => (
          <button key={n} onClick={() => { setStarsLocal(n); run(() => setStars(member.id, n)); }} disabled={pending} aria-label={`${n} stars`}>
            <Star size={18} className={n <= stars ? "text-amber-400 fill-amber-400" : "text-slate-700 hover:text-slate-500"} />
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-2 mb-3">
        <div>
          <label className="text-slate-500 text-[11px] uppercase tracking-wide">Level</label>
          <select value={level} disabled={pending}
            onChange={(e) => { const v = e.target.value as typeof level; setLevelLocal(v); run(() => setLevel(member.id, v)); }}>
            {LEVELS.map((l) => <option key={l} value={l}>{l}</option>)}
          </select>
        </div>
        {isAdmin && (
          <div>
            <label className="text-slate-500 text-[11px] uppercase tracking-wide">Role</label>
            <select value={role} disabled={pending || isSelf}
              onChange={(e) => { const v = e.target.value as Role; setRoleLocal(v); run(() => setRole(member.id, v)); }}>
              {ROLES.map((r) => <option key={r} value={r}>{r[0].toUpperCase() + r.slice(1)}</option>)}
            </select>
          </div>
        )}
      </div>

      <label className="flex items-center gap-2 text-slate-400 text-sm">
        <input type="checkbox" checked={pub} disabled={pending}
          onChange={(e) => { setPub(e.target.checked); run(() => setPublic(member.id, e.target.checked)); }}
          className="w-auto" />
        Show on public team page
      </label>

      {msg && <p className="text-red-400 text-xs mt-2">{msg}</p>}
    </div>
  );
}
