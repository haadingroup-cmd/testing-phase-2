import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Logo } from "@/components/ui/Logo";
import { getCurrentAdmin } from "@/lib/auth/session";
import { LoginForm } from "./LoginForm";

export const metadata: Metadata = { title: "Admin sign in", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

export default async function AdminLoginPage({ searchParams }: { searchParams: Promise<{ next?: string }> }) {
  if (await getCurrentAdmin()) redirect("/admin");
  const { next } = await searchParams;
  return (
    <main className="flex min-h-dvh items-center justify-center bg-surface px-margin-mobile py-12">
      <div className="w-full max-w-sm space-y-6 rounded-3xl bg-surface-container-lowest p-8 shadow-level-3">
        <Logo eyebrow="Admin Console" />
        <div>
          <h1 className="font-headline-sm text-headline-sm font-bold text-on-surface">Sign in</h1>
          <p className="font-body-sm text-body-sm text-on-surface-variant">Authorised staff only.</p>
        </div>
        <LoginForm next={next} />
        <Link href="/" className="block text-center font-label-md text-label-md text-secondary hover:underline">← Back to website</Link>
      </div>
    </main>
  );
}
