"use client";
import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2, Lock } from "lucide-react";
import { supabaseBrowser, SUPABASE_READY } from "@/lib/supabase";

function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const next = params.get("next") || "/dashboard";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [msg, setMsg] = useState("");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!SUPABASE_READY) {
      setStatus("error");
      setMsg("Login is not configured yet. Add Supabase keys in Vercel first.");
      return;
    }
    setStatus("loading");
    setMsg("");
    const supabase = supabaseBrowser();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setStatus("error");
      setMsg("Incorrect email or password.");
      return;
    }
    router.push(next);
    router.refresh();
  }

  return (
    <div className="w-full max-w-md card p-8">
      <div className="w-12 h-12 rounded-xl bg-red-500/10 flex items-center justify-center mb-6">
        <Lock size={20} className="text-red-400" />
      </div>
      <h1 className="font-display font-black text-white text-2xl mb-2">Team Login</h1>
      <p className="text-slate-400 text-sm mb-8">Sign in to your HaadinGlobal team account.</p>

      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label className="text-slate-300 text-sm font-medium">Email</label>
          <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
            placeholder="you@haadinglobal.com" autoComplete="email" />
        </div>
        <div>
          <label className="text-slate-300 text-sm font-medium">Password</label>
          <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)}
            placeholder="********" autoComplete="current-password" />
        </div>

        {status === "error" && (
          <p className="text-red-400 text-sm bg-red-500/10 px-4 py-2.5 rounded-lg">{msg}</p>
        )}

        <button type="submit" disabled={status === "loading"} className="btn-primary w-full justify-center py-3.5 disabled:opacity-50">
          {status === "loading" ? <><Loader2 size={16} className="animate-spin" /> Signing in...</> : "Sign In"}
        </button>
      </form>

      <p className="text-slate-500 text-xs text-center mt-6">
        Accounts are created by an administrator. There is no public sign-up.
      </p>
    </div>
  );
}

export default function LoginPage() {
  return (
    <section className="min-h-screen flex items-center justify-center px-4 pt-24 pb-16 bg-[#020205]">
      <Suspense fallback={<div className="text-slate-400"><Loader2 className="animate-spin" /></div>}>
        <LoginForm />
      </Suspense>
    </section>
  );
}
