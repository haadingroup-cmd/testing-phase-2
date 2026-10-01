import Link from "next/link";
import Image from "next/image";
import { requireProfile } from "@/lib/auth";
import SignOutButton from "@/components/dashboard/SignOutButton";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const profile = await requireProfile();
  const roleLabel = profile.role === "admin" ? "Administrator" : profile.role === "manager" ? "Manager" : "Team Member";

  return (
    <div className="min-h-screen bg-[#020205]">
      <header className="border-b border-white/8 bg-[#030306] sticky top-0 z-40">
        <div className="container flex items-center justify-between h-16">
          <Link href="/dashboard" className="flex items-center gap-3">
            <div className="relative w-8 h-8">
              <Image src="/logo-small.png" alt="HaadinGlobal" fill className="rounded-full object-cover" />
            </div>
            <div className="leading-tight">
              <p className="text-white font-black text-sm">HaadinGlobal</p>
              <p className="text-red-400 text-[10px] font-mono uppercase tracking-wider">{roleLabel}</p>
            </div>
          </Link>
          <div className="flex items-center gap-4">
            <span className="text-slate-400 text-sm hidden sm:inline">{profile.full_name}</span>
            <Link href="/" className="text-slate-400 hover:text-white text-sm">View site</Link>
            <SignOutButton />
          </div>
        </div>
      </header>
      <main className="container py-8">{children}</main>
    </div>
  );
}
