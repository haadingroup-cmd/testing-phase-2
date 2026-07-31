import Link from "next/link";
import { requireProfile } from "@/lib/auth";
import { supabaseServer } from "@/lib/supabase-server";
import { Users, FolderOpen, Upload, Star } from "lucide-react";
import MemberProjects from "@/components/dashboard/MemberProjects";

export const metadata = { title: "Dashboard", robots: { index: false } };
export const dynamic = "force-dynamic";

export default async function DashboardHome() {
  const profile = await requireProfile();
  const isStaff = profile.role === "admin" || profile.role === "manager";

  // ── Staff (admin/manager): overview + link to team management ─────────────
  if (isStaff) {
    const supabase = supabaseServer();
    const { count: memberCount } = await supabase
      .from("profiles").select("id", { count: "exact", head: true });
    const { count: projectCount } = await supabase
      .from("projects").select("id", { count: "exact", head: true });
    const { count: pendingCount } = await supabase
      .from("projects").select("id", { count: "exact", head: true }).eq("status", "submitted");

    return (
      <div>
        <h1 className="font-display font-black text-white text-2xl mb-1">
          Welcome, {profile.full_name.split(" ")[0]}
        </h1>
        <p className="text-slate-400 text-sm mb-8">
          {profile.role === "admin" ? "Full administrator access." : "Manager access — team & projects."}
        </p>

        <div className="grid sm:grid-cols-3 gap-4 mb-8">
          <Stat icon={<Users size={18} />} label="Team members" value={memberCount ?? 0} />
          <Stat icon={<FolderOpen size={18} />} label="Total projects" value={projectCount ?? 0} />
          <Stat icon={<Upload size={18} />} label="Pending review" value={pendingCount ?? 0} />
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <Link href="/dashboard/team" className="card p-6 hover:-translate-y-1 transition-all">
            <Users size={22} className="text-red-400 mb-3" />
            <h2 className="font-bold text-white mb-1">Manage Team</h2>
            <p className="text-slate-400 text-sm">
              {profile.role === "admin"
                ? "Add or remove members, set roles, levels and star ratings."
                : "View members, set levels and star ratings, review their work."}
            </p>
          </Link>
          <Link href="/dashboard/projects" className="card p-6 hover:-translate-y-1 transition-all">
            <FolderOpen size={22} className="text-red-400 mb-3" />
            <h2 className="font-bold text-white mb-1">All Projects</h2>
            <p className="text-slate-400 text-sm">Review, approve or reject work submitted by the team.</p>
          </Link>
        </div>
      </div>
    );
  }

  // ── Member: their own profile summary + their projects + upload ──────────
  return (
    <div>
      <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
        <div>
          <h1 className="font-display font-black text-white text-2xl mb-1">
            Hi, {profile.full_name.split(" ")[0]}
          </h1>
          <p className="text-slate-400 text-sm">{profile.title} · {profile.level}</p>
        </div>
        <div className="flex items-center gap-1 card px-4 py-2.5">
          <span className="text-slate-400 text-sm mr-1">Rating:</span>
          {[...Array(5)].map((_, j) => (
            <Star key={j} size={14} className={j < profile.stars ? "text-amber-400 fill-amber-400" : "text-slate-700"} />
          ))}
        </div>
      </div>

      <MemberProjects ownerId={profile.id} />
    </div>
  );
}

function Stat({ icon, label, value }: { icon: React.ReactNode; label: string; value: number }) {
  return (
    <div className="card p-5">
      <div className="text-red-400 mb-2">{icon}</div>
      <p className="text-3xl font-black text-white">{value}</p>
      <p className="text-slate-500 text-xs uppercase tracking-wide mt-1">{label}</p>
    </div>
  );
}
