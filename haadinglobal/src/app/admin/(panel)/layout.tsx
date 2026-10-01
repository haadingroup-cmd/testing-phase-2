import type { Metadata } from "next";
import Link from "next/link";
import { AdminNav } from "@/components/admin/AdminNav";
import { Icon } from "@/components/ui/Icon";
import { LogoMark } from "@/components/ui/Logo";
import { requireAdmin } from "@/lib/auth/session";
import { logout } from "@/app/admin/actions";

export const metadata: Metadata = { title: { default: "Admin", template: "%s · Admin" }, robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const admin = await requireAdmin();
  return (
    <div className="min-h-dvh bg-canvas-slate lg:grid lg:grid-cols-[260px_1fr]">
      <aside className="bg-primary-container p-4 text-on-primary lg:sticky lg:top-0 lg:h-dvh lg:overflow-y-auto">
        <div className="flex items-center justify-between gap-2 lg:mb-6 lg:block">
          <Link href="/admin" className="flex items-center gap-2 py-1">
            <LogoMark className="h-8 w-8" />
            <span className="font-headline-sm text-headline-sm font-bold">Admin</span>
          </Link>
          <AdminNav />
        </div>
        <div className="mt-6 hidden space-y-2 border-t border-on-primary/10 pt-4 lg:block">
          <p className="truncate font-body-sm text-body-sm text-on-primary-container">{admin.email}</p>
          <Link href="/" target="_blank" className="flex items-center gap-2 font-label-md text-label-md text-on-primary-container hover:text-on-primary">
            <Icon name="open_in_new" size={16} /> View website
          </Link>
          <form action={logout}>
            <button type="submit" className="flex items-center gap-2 font-label-md text-label-md text-on-primary-container hover:text-on-primary">
              <Icon name="logout" size={16} /> Sign out
            </button>
          </form>
        </div>
      </aside>
      <div className="min-w-0 p-4 md:p-8">
        <div className="mb-4 flex items-center justify-end gap-3 lg:hidden">
          <form action={logout}>
            <button type="submit" className="flex items-center gap-1 font-label-md text-label-md text-secondary">
              <Icon name="logout" size={16} /> Sign out
            </button>
          </form>
        </div>
        {children}
      </div>
    </div>
  );
}
