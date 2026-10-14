"use client";

import { Check, Loader2 } from "lucide-react";
import { Honeypot, useSubmit } from "./useSubmit";

export function ContactForm() {
  const { status, message, submit } = useSubmit("/api/contact");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const payload = Object.fromEntries(["name", "email", "subject", "message", "website"].map((k) => [k, String(fd.get(k) ?? "")]));
    await submit(payload);
  }

  if (status === "success") {
    return (
      <div role="status" className="card flex items-start gap-3 p-6">
        <Check className="mt-0.5 h-5 w-5 text-teal" aria-hidden="true" />
        <div>
          <p className="text-headline-sm text-ink">Thanks — message received.</p>
          <p className="mt-1 text-body-md text-slate-body">We aim to reply within two working days.</p>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="card relative grid gap-4 p-6">
      <Honeypot />
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="grid gap-1.5 text-label text-ink">
          Your name
          <input name="name" required minLength={2} maxLength={100} autoComplete="name" className="input font-normal" />
        </label>
        <label className="grid gap-1.5 text-label text-ink">
          Email
          <input name="email" type="email" required maxLength={254} autoComplete="email" className="input font-normal" />
        </label>
      </div>
      <label className="grid gap-1.5 text-label text-ink">
        Subject
        <select name="subject" required defaultValue="general" className="input font-normal">
          <option value="general">General enquiry</option>
          <option value="editorial">Editorial / tool tip-off</option>
          <option value="correction">Report a correction</option>
          <option value="partnership">Partnerships</option>
          <option value="press">Press</option>
        </select>
      </label>
      <label className="grid gap-1.5 text-label text-ink">
        Message
        <textarea name="message" required minLength={20} maxLength={5000} className="textarea font-normal" />
      </label>
      {status === "error" && <p role="alert" className="text-body-sm text-red-700">{message}</p>}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-caption text-slate-mute">We use your details only to reply. See our <a className="underline" href="/privacy-policy">privacy policy</a>.</p>
        <button type="submit" className="btn-primary" disabled={status === "loading"}>
          {status === "loading" && <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />}
          Send message
        </button>
      </div>
    </form>
  );
}
