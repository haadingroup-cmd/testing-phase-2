"use client";

import { useState, useTransition } from "react";
import { Plus, Phone, Mail, MessageSquare, ChevronDown, Trash2, X } from "lucide-react";
import { updateLeadStatus, updateLeadDetails, addLead, deleteLead } from "@/app/dashboard/leads/actions";
import type { Lead } from "@/app/dashboard/leads/page";

const STATUSES = [
  { key: "new", label: "New", cls: "bg-blue-500/15 text-blue-300 border-blue-500/30" },
  { key: "contacted", label: "Contacted", cls: "bg-amber-500/15 text-amber-300 border-amber-500/30" },
  { key: "meeting", label: "Meeting", cls: "bg-purple-500/15 text-purple-300 border-purple-500/30" },
  { key: "won", label: "Won", cls: "bg-green-500/15 text-green-300 border-green-500/30" },
  { key: "lost", label: "Lost", cls: "bg-red-500/15 text-red-300 border-red-500/30" },
];
const statusCls = (s: string) => STATUSES.find((x) => x.key === s)?.cls || STATUSES[0].cls;

export default function LeadsBoard({ initialLeads, isStaff }: { initialLeads: Lead[]; isStaff: boolean }) {
  const [leads, setLeads] = useState(initialLeads);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [showAdd, setShowAdd] = useState(false);
  const [, startTransition] = useTransition();

  function setStatus(id: string, status: Lead["status"]) {
    setLeads((prev) => prev.map((l) => (l.id === id ? { ...l, status } : l)));
    startTransition(() => { updateLeadStatus(id, status); });
  }

  function remove(id: string) {
    if (!confirm("Delete this lead permanently?")) return;
    setLeads((prev) => prev.filter((l) => l.id !== id));
    startTransition(() => { deleteLead(id); });
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <p className="text-slate-400 text-sm">{leads.length} lead{leads.length !== 1 ? "s" : ""}</p>
        {isStaff && (
          <button onClick={() => setShowAdd(true)} className="inline-flex items-center gap-1.5 text-sm bg-red-600 hover:bg-red-500 text-white font-semibold px-4 py-2 rounded-xl transition-colors">
            <Plus size={15} /> Add Lead
          </button>
        )}
      </div>

      {leads.length === 0 ? (
        <div className="card rounded-2xl p-10 text-center text-slate-500">
          No leads yet. New enquiries from your website form will appear here automatically.
        </div>
      ) : (
        <div className="space-y-3">
          {leads.map((lead) => (
            <div key={lead.id} className="card rounded-2xl overflow-hidden">
              <div className="p-4 flex flex-wrap items-center gap-3">
                <div className="flex-1 min-w-[180px]">
                  <p className="text-white font-bold">{lead.name || "Unnamed lead"}</p>
                  <p className="text-slate-400 text-xs">{lead.service || "—"} · {lead.source}</p>
                </div>

                {/* Contact quick links */}
                <div className="flex items-center gap-2">
                  {lead.phone && (
                    <a href={`https://wa.me/${lead.phone.replace(/[^0-9]/g, "")}`} target="_blank" rel="noopener noreferrer" title="WhatsApp" className="w-8 h-8 rounded-lg bg-white/5 hover:bg-green-500/20 flex items-center justify-center text-green-400">
                      <MessageSquare size={14} />
                    </a>
                  )}
                  {lead.phone && (
                    <a href={`tel:${lead.phone}`} title="Call" className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-slate-300">
                      <Phone size={14} />
                    </a>
                  )}
                  {lead.email && (
                    <a href={`mailto:${lead.email}`} title="Email" className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-slate-300">
                      <Mail size={14} />
                    </a>
                  )}
                </div>

                {/* Status selector */}
                <select
                  value={lead.status}
                  onChange={(e) => setStatus(lead.id, e.target.value as Lead["status"])}
                  className={`text-xs font-bold px-3 py-2 rounded-lg border cursor-pointer focus:outline-none ${statusCls(lead.status)}`}
                >
                  {STATUSES.map((s) => (
                    <option key={s.key} value={s.key} className="bg-[#0d0d14] text-white">{s.label}</option>
                  ))}
                </select>

                <button onClick={() => setExpanded(expanded === lead.id ? null : lead.id)} className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-slate-400">
                  <ChevronDown size={16} className={`transition-transform ${expanded === lead.id ? "rotate-180" : ""}`} />
                </button>
              </div>

              {expanded === lead.id && (
                <div className="border-t border-white/8 p-4 bg-black/20">
                  {lead.message && <p className="text-slate-300 text-sm mb-3"><span className="text-slate-500">Message:</span> {lead.message}</p>}
                  <LeadNotes lead={lead} />
                  {isStaff && (
                    <button onClick={() => remove(lead.id)} className="mt-3 inline-flex items-center gap-1.5 text-xs text-red-400 hover:text-red-300">
                      <Trash2 size={13} /> Delete lead
                    </button>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {showAdd && <AddLeadModal onClose={() => setShowAdd(false)} onAdded={(l) => setLeads((p) => [l, ...p])} />}
    </div>
  );
}

function LeadNotes({ lead }: { lead: Lead }) {
  const [notes, setNotes] = useState(lead.notes);
  const [value, setValue] = useState(String(lead.value || ""));
  const [saved, setSaved] = useState(false);
  const [, start] = useTransition();

  function save() {
    start(async () => {
      await updateLeadDetails(lead.id, notes, Number(value) || 0);
      setSaved(true); setTimeout(() => setSaved(false), 1500);
    });
  }
  return (
    <div className="space-y-2">
      <textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Notes about this lead…" rows={2}
        className="w-full text-sm px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white placeholder:text-slate-500 focus:outline-none focus:border-red-500/40" />
      <div className="flex items-center gap-2">
        <input value={value} onChange={(e) => setValue(e.target.value)} placeholder="Value (PKR)" inputMode="numeric"
          className="text-sm px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white placeholder:text-slate-500 focus:outline-none focus:border-red-500/40 w-40" />
        <button onClick={save} className="text-sm bg-white/10 hover:bg-white/15 text-white font-semibold px-4 py-2 rounded-lg">
          {saved ? "Saved ✓" : "Save"}
        </button>
      </div>
    </div>
  );
}

function AddLeadModal({ onClose, onAdded }: { onClose: () => void; onAdded: (l: Lead) => void }) {
  const [f, setF] = useState({ name: "", phone: "", email: "", service: "", message: "", source: "manual" });
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");

  async function submit() {
    setBusy(true); setErr("");
    const res = await addLead(f);
    setBusy(false);
    if (!res.ok) { setErr(res.error || "Failed to add"); return; }
    // Optimistic: add a temporary row (real one loads on refresh)
    onAdded({
      id: `temp-${Date.now()}`, ...f, status: "new", value: 0, notes: "", assigned_to: null,
      created_at: new Date().toISOString(),
    } as Lead);
    onClose();
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm" onClick={onClose}>
      <div className="w-full max-w-md card rounded-3xl p-6" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-white text-lg">Add Lead</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-white"><X size={18} /></button>
        </div>
        <div className="space-y-3">
          {[
            { k: "name", ph: "Name" }, { k: "phone", ph: "WhatsApp / Phone" },
            { k: "email", ph: "Email (optional)" }, { k: "service", ph: "Service they want" },
          ].map((x) => (
            <input key={x.k} placeholder={x.ph} value={(f as any)[x.k]}
              onChange={(e) => setF({ ...f, [x.k]: e.target.value })}
              className="w-full text-sm px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-slate-500 focus:outline-none focus:border-red-500/40" />
          ))}
          <textarea placeholder="Message / notes" rows={2} value={f.message}
            onChange={(e) => setF({ ...f, message: e.target.value })}
            className="w-full text-sm px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-slate-500 focus:outline-none focus:border-red-500/40" />
          {err && <p className="text-red-400 text-xs">{err}</p>}
          <button onClick={submit} disabled={busy}
            className="w-full bg-red-600 hover:bg-red-500 disabled:opacity-60 text-white font-bold py-3 rounded-xl transition-colors">
            {busy ? "Adding…" : "Add Lead"}
          </button>
        </div>
      </div>
    </div>
  );
}
