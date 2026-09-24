"use client";

import { Check, Loader2 } from "lucide-react";
import { Honeypot, useSubmit } from "./useSubmit";
import { CATEGORIES } from "@/data/categories";

export function SubmitToolForm() {
  const { status, message, submit } = useSubmit("/api/submit-tool");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const keys = ["toolName", "toolUrl", "category", "contactName", "email", "description", "ukPricing", "website"];
    await submit(Object.fromEntries(keys.map((k) => [k, String(fd.get(k) ?? "")])));
  }

  if (status === "success") {
    return (
      <div role="status" className="card flex items-start gap-3 p-6">
        <Check className="mt-0.5 h-5 w-5 text-teal" aria-hidden="true" />
        <div>
          <p className="text-headline-sm text-ink">Submission received.</p>
          <p className="mt-1 text-body-md text-slate-body">Our editors review every submission. If your tool fits our audience we&apos;ll be in touch to arrange testing access.</p>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="card relative grid gap-4 p-6">
      <Honeypot />
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="grid gap-1.5 text-label text-ink">
          Tool name
          <input name="toolName" required minLength={2} maxLength={100} className="input font-normal" />
        </label>
        <label className="grid gap-1.5 text-label text-ink">
          Website (https://)
          <input name="toolUrl" type="url" required maxLength={300} pattern="https://.*" placeholder="https://" className="input font-normal" />
        </label>
        <label className="grid gap-1.5 text-label text-ink">
          Category
          <select name="category" required defaultValue="" className="input font-normal">
            <option value="" disabled>Choose a category</option>
            {CATEGORIES.map((c) => <option key={c.slug} value={c.slug}>{c.name}</option>)}
          </select>
        </label>
        <label className="grid gap-1.5 text-label text-ink">
          UK pricing (optional)
          <input name="ukPricing" maxLength={200} placeholder="e.g. £15/user/month ex. VAT" className="input font-normal" />
        </label>
        <label className="grid gap-1.5 text-label text-ink">
          Your name
          <input name="contactName" required minLength={2} maxLength={100} autoComplete="name" className="input font-normal" />
        </label>
        <label className="grid gap-1.5 text-label text-ink">
          Work email
          <input name="email" type="email" required maxLength={254} autoComplete="email" className="input font-normal" />
        </label>
      </div>
      <label className="grid gap-1.5 text-label text-ink">
        What does it do for UK small businesses?
        <textarea name="description" required minLength={30} maxLength={2000} className="textarea font-normal" />
      </label>
      {status === "error" && <p role="alert" className="text-body-sm text-red-700">{message}</p>}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-caption text-slate-mute">Submitting does not guarantee a listing or influence scores.</p>
        <button type="submit" className="btn-primary" disabled={status === "loading"}>
          {status === "loading" && <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />}
          Submit for review
        </button>
      </div>
    </form>
  );
}
