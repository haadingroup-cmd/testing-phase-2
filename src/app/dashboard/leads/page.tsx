import { requireProfile } from "@/lib/auth";
import { supabaseServer } from "@/lib/supabase-server";
import { Users2, TrendingUp, Target, CheckCircle2, XCircle } from "lucide-react";
import LeadsBoard from "@/components/dashboard/LeadsBoard";

export const metadata = { title: "Leads / CRM", robots: { index: false } };
export const dynamic = "force-dynamic";

export interface Lead {
  id: string;
  name: string;
  phone: string;
  email: string;
  service: string;
  message: string;
  source: string;
  status: "new" | "contacted" | "meeting" | "won" | "lost";
  value: number;
  notes: string;
  assigned_to: string | null;
  created_at: string;
}

export default async function LeadsPage() {
  const profile = await requireProfile();
  const supabase = supabaseServer();

  // Staff see all; members see only theirs (RLS enforces this too).
  const { data: leads } = await supabase
    .from("leads")
    .select("*")
    .order("created_at", { ascending: false });

  const list = (leads as Lead[]) ?? [];

  // Simple counts for the top cards
  const byStatus = (s: string) => list.filter((l) => l.status === s).length;
  const wonValue = list.filter((l) => l.status === "won").reduce((sum, l) => sum + Number(l.value || 0), 0);

  const cards = [
    { label: "New", value: byStatus("new"), icon: <Target size={18} />, color: "text-blue-400" },
    { label: "Contacted", value: byStatus("contacted"), icon: <Users2 size={18} />, color: "text-amber-400" },
    { label: "Meeting", value: byStatus("meeting"), icon: <TrendingUp size={18} />, color: "text-purple-400" },
    { label: "Won", value: byStatus("won"), icon: <CheckCircle2 size={18} />, color: "text-green-400" },
    { label: "Lost", value: byStatus("lost"), icon: <XCircle size={18} />, color: "text-red-400" },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <h1 className="font-display font-black text-white text-2xl">Leads / CRM</h1>
      </div>
      <p className="text-slate-400 text-sm mb-8">
        Every enquiry in one place. Move leads through the pipeline as you work them.
      </p>

      {/* Pipeline summary */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-6">
        {cards.map((c) => (
          <div key={c.label} className="card rounded-2xl p-4">
            <div className={`flex items-center gap-2 mb-1 ${c.color}`}>{c.icon}<span className="text-xs font-semibold text-slate-400">{c.label}</span></div>
            <p className="text-2xl font-black text-white">{c.value}</p>
          </div>
        ))}
      </div>

      {/* Won value banner */}
      <div className="card rounded-2xl p-4 mb-8 flex items-center justify-between">
        <span className="text-slate-400 text-sm">Total won value</span>
        <span className="font-display font-black text-green-400 text-xl">
          PKR {wonValue.toLocaleString()}
        </span>
      </div>

      {/* Interactive board */}
      <LeadsBoard initialLeads={list} isStaff={profile.role === "admin" || profile.role === "manager"} />
    </div>
  );
}
