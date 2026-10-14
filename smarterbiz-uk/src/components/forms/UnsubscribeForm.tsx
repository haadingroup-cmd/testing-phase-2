"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Check, Loader2 } from "lucide-react";
import { useState } from "react";

export function UnsubscribeForm() {
  const params = useSearchParams();
  const email = (params.get("e") ?? "").slice(0, 254);
  const token = (params.get("t") ?? "").slice(0, 100);
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [message, setMessage] = useState("");

  if (!email || !token) {
    return (
      <p className="card p-6 text-body-lg text-slate-body">
        This link is incomplete. Use the unsubscribe link in any of our emails, or <Link href="/contact" className="text-brand underline">contact us</Link> and we&apos;ll remove you.
      </p>
    );
  }

  if (status === "done") {
    return (
      <p role="status" className="card flex items-center gap-2 p-6 text-body-lg text-teal-deep">
        <Check className="h-5 w-5" aria-hidden="true" /> You&apos;ve been unsubscribed. Sorry to see you go.
      </p>
    );
  }

  // A button (not an automatic GET) so link scanners and prefetchers can't unsubscribe people by accident.
  async function confirm() {
    setStatus("loading");
    try {
      const res = await fetch("/api/unsubscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, token }),
      });
      const data = (await res.json().catch(() => ({}))) as { ok?: boolean; error?: string };
      if (res.ok && data.ok) setStatus("done");
      else {
        setStatus("error");
        setMessage(data.error ?? "Something went wrong.");
      }
    } catch {
      setStatus("error");
      setMessage("Network error — please try again.");
    }
  }

  return (
    <div className="card p-6">
      <p className="text-body-lg text-ink">
        Unsubscribe <strong className="break-all">{email}</strong> from the SmarterBiz Thursday Briefing?
      </p>
      {status === "error" && <p role="alert" className="mt-3 text-body-md text-red-700">{message}</p>}
      <button type="button" onClick={confirm} disabled={status === "loading"} className="btn-dark mt-5">
        {status === "loading" && <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />}
        Confirm unsubscribe
      </button>
    </div>
  );
}
