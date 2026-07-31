"use client";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { supabaseBrowser } from "@/lib/supabase";

export default function SignOutButton() {
  const router = useRouter();
  async function signOut() {
    await supabaseBrowser().auth.signOut();
    router.push("/login");
    router.refresh();
  }
  return (
    <button onClick={signOut} className="inline-flex items-center gap-1.5 text-slate-400 hover:text-red-400 text-sm font-semibold">
      <LogOut size={15} /> Sign out
    </button>
  );
}
