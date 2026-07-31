"use client";
import { useState, useTransition } from "react";
import { CheckCircle, XCircle, Clock, FileText, Loader2 } from "lucide-react";
import { reviewProject } from "@/app/dashboard/projects/actions";

export default function ProjectReview({
  id, title, description, fileCount, status, ownerName, ownerTitle,
}: {
  id: string; title: string; description: string; fileCount: number;
  status: "submitted" | "approved" | "rejected"; ownerName: string; ownerTitle: string;
}) {
  const [current, setCurrent] = useState(status);
  const [pending, start] = useTransition();
  const [msg, setMsg] = useState("");

  function decide(next: "approved" | "rejected") {
    setMsg("");
    start(async () => {
      const res = await reviewProject(id, next);
      if (!res.ok) setMsg(res.error || "Failed.");
      else setCurrent(next);
    });
  }

  const badge = {
    submitted: { icon: <Clock size={12} />, text: "Pending", cls: "text-amber-400 bg-amber-500/10" },
    approved: { icon: <CheckCircle size={12} />, text: "Approved", cls: "text-green-400 bg-green-500/10" },
    rejected: { icon: <XCircle size={12} />, text: "Rejected", cls: "text-red-400 bg-red-500/10" },
  }[current];

  return (
    <div className="card p-5">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div className="min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-bold text-white">{title}</h3>
            <span className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full ${badge.cls}`}>
              {badge.icon} {badge.text}
            </span>
          </div>
          <p className="text-slate-500 text-xs mb-2">by {ownerName}{ownerTitle ? ` · ${ownerTitle}` : ""}</p>
          {description && <p className="text-slate-400 text-sm mb-2">{description}</p>}
          <p className="text-slate-500 text-xs flex items-center gap-1"><FileText size={11} /> {fileCount} file(s)</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => decide("approved")} disabled={pending || current === "approved"}
            className="inline-flex items-center gap-1.5 text-sm font-semibold px-3 py-2 rounded-lg bg-green-500/10 text-green-400 hover:bg-green-500/20 disabled:opacity-40">
            {pending ? <Loader2 size={14} className="animate-spin" /> : <CheckCircle size={14} />} Approve
          </button>
          <button onClick={() => decide("rejected")} disabled={pending || current === "rejected"}
            className="inline-flex items-center gap-1.5 text-sm font-semibold px-3 py-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 disabled:opacity-40">
            <XCircle size={14} /> Reject
          </button>
        </div>
      </div>
      {msg && <p className="text-red-400 text-xs mt-2">{msg}</p>}
    </div>
  );
}
