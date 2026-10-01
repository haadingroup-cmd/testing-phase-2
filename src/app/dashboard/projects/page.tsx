import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { requireStaff } from "@/lib/auth";
import { supabaseServer } from "@/lib/supabase-server";
import ProjectReview from "@/components/dashboard/ProjectReview";

export const metadata = { title: "All Projects", robots: { index: false } };
export const dynamic = "force-dynamic";

interface ProjectWithOwner {
  id: string;
  title: string;
  description: string;
  file_paths: string[];
  status: "submitted" | "approved" | "rejected";
  created_at: string;
  owner_id: string;
  profiles: { full_name: string; title: string } | null;
}

export default async function ProjectsPage() {
  await requireStaff();
  const supabase = supabaseServer();
  const { data } = await supabase
    .from("projects")
    .select("*, profiles(full_name, title)")
    .order("created_at", { ascending: false });

  const projects = (data as ProjectWithOwner[]) ?? [];

  return (
    <div>
      <Link href="/dashboard" className="inline-flex items-center gap-1.5 text-slate-400 hover:text-red-400 text-sm font-semibold mb-6">
        <ArrowLeft size={15} /> Back to dashboard
      </Link>
      <h1 className="font-display font-black text-white text-2xl mb-1">All Projects</h1>
      <p className="text-slate-400 text-sm mb-8">Work submitted by the team. Approve or reject each one.</p>

      {projects.length === 0 ? (
        <div className="card p-8 text-center text-slate-400 text-sm">No projects submitted yet.</div>
      ) : (
        <div className="space-y-3">
          {projects.map((p) => (
            <ProjectReview
              key={p.id}
              id={p.id}
              title={p.title}
              description={p.description}
              fileCount={p.file_paths.length}
              status={p.status}
              ownerName={p.profiles?.full_name ?? "Unknown"}
              ownerTitle={p.profiles?.title ?? ""}
            />
          ))}
        </div>
      )}
    </div>
  );
}
