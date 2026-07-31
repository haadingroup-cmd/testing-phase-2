import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { requireStaff } from "@/lib/auth";
import { supabaseServer } from "@/lib/supabase-server";
import type { Profile } from "@/lib/auth";
import TeamManager from "@/components/dashboard/TeamManager";

export const metadata = { title: "Manage Team", robots: { index: false } };
export const dynamic = "force-dynamic";

export default async function TeamManagePage() {
  const me = await requireStaff();
  const supabase = supabaseServer();
  const { data } = await supabase
    .from("profiles").select("*")
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: true });

  const members = (data as Profile[]) ?? [];

  return (
    <div>
      <Link href="/dashboard" className="inline-flex items-center gap-1.5 text-slate-400 hover:text-red-400 text-sm font-semibold mb-6">
        <ArrowLeft size={15} /> Back to dashboard
      </Link>
      <h1 className="font-display font-black text-white text-2xl mb-1">Manage Team</h1>
      <p className="text-slate-400 text-sm mb-8">
        {me.role === "admin"
          ? "Add or remove members, set roles, levels and star ratings."
          : "Set levels and star ratings. Only an administrator can add or remove accounts."}
      </p>

      <TeamManager members={members} myRole={me.role} myId={me.id} />
    </div>
  );
}
