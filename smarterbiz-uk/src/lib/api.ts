import "server-only";
import type { ZodError } from "zod";
import { DbNotConfiguredError } from "./db";
import { json } from "./security";

export const firstIssue = (err: ZodError) => err.issues[0]?.message ?? "Please check the form and try again.";

export function handleWriteError(err: unknown) {
  if (err instanceof DbNotConfiguredError) {
    console.error("[api] SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY are not set — submission not stored.");
    return json({ ok: false, error: "This form is temporarily unavailable. Please email us instead." }, 503);
  }
  return json({ ok: false, error: "Something went wrong. Please try again in a moment." }, 500);
}

// Uniform "success" for bot traps so bots can't tell they were filtered.
export const fakeOk = () => json({ ok: true });
