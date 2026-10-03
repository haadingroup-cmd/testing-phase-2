"use client";

import { Check, Loader2, ShieldCheck } from "lucide-react";
import { useId } from "react";
import { Honeypot, useSubmit } from "./useSubmit";

export function NewsletterForm({ source = "site", variant = "light" }: { source?: string; variant?: "light" | "compact" }) {
  const { status, message, submit } = useSubmit("/api/subscribe");
  const id = useId();

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const ok = await submit({ email: String(fd.get("email") ?? ""), website: String(fd.get("website") ?? ""), source });
    if (ok) e.currentTarget?.reset();
  }

  if (status === "success") {
    return (
      <p role="status" className="flex items-center gap-2 rounded bg-teal/10 p-3 text-body-md font-medium text-teal-deep">
        <Check className="h-4 w-4" aria-hidden="true" /> Cheers — you&apos;re subscribed. Look out for Thursday&apos;s briefing.
      </p>
    );
  }

  return (
    <form onSubmit={onSubmit} className="relative flex flex-col gap-2" noValidate={false}>
      <Honeypot />
      <div className={`flex gap-2 ${variant === "compact" ? "flex-row" : "flex-col sm:flex-row"}`}>
        <label htmlFor={`${id}-email`} className="sr-only">Work email address</label>
        <input
          id={`${id}-email`}
          name="email"
          type="email"
          required
          maxLength={254}
          autoComplete="email"
          inputMode="email"
          placeholder="you@company.co.uk"
          className="input"
        />
        <button type="submit" className="btn-dark shrink-0" disabled={status === "loading"}>
          {status === "loading" ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : null}
          Subscribe
        </button>
      </div>
      {status === "error" && <p role="alert" className="text-body-sm text-red-700">{message}</p>}
      {variant !== "compact" && (
        <p className="flex items-center gap-1 text-caption text-slate-mute">
          <ShieldCheck className="h-3.5 w-3.5 text-teal" aria-hidden="true" />
          No spam. Unsubscribe anytime. See our <a href="/privacy-policy" className="underline">privacy policy</a>.
        </p>
      )}
    </form>
  );
}
