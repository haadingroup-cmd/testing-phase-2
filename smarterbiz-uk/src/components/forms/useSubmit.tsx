"use client";

import { useRef, useState } from "react";

type Status = "idle" | "loading" | "success" | "error";

export function useSubmit(endpoint: string) {
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("");
  const startedAt = useRef<number>(Date.now());

  async function submit(payload: Record<string, unknown>) {
    if (status === "loading") return false;
    setStatus("loading");
    setMessage("");
    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...payload, startedAt: startedAt.current }),
      });
      const data = (await res.json().catch(() => ({}))) as { ok?: boolean; error?: string };
      if (res.ok && data.ok) {
        setStatus("success");
        return true;
      }
      setStatus("error");
      setMessage(data.error || "Something went wrong. Please try again.");
      return false;
    } catch {
      setStatus("error");
      setMessage("Network error — please check your connection and try again.");
      return false;
    }
  }

  return { status, message, submit };
}

/** Hidden honeypot input. Humans never see it; bots fill it. */
export function Honeypot() {
  return (
    <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
      <label>
        Leave this field empty
        <input type="text" name="website" tabIndex={-1} autoComplete="off" defaultValue="" />
      </label>
    </div>
  );
}
