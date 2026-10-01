"use client";

import { startTransition, useActionState } from "react";
import { Icon } from "@/components/ui/Icon";
import { login, type ActionState } from "@/app/admin/actions";

function Submit({ pending }: { pending: boolean }) {
  return (
    <button type="submit" disabled={pending} className="flex w-full items-center justify-center gap-2 rounded-xl bg-secondary py-3 font-label-lg text-label-lg text-on-secondary hover:bg-primary-container disabled:opacity-70">
      {pending ? <Icon name="progress_activity" size={18} className="animate-spin" /> : <Icon name="lock" size={18} />}
      {pending ? "Signing in..." : "Sign in"}
    </button>
  );
}

export function LoginForm({ next }: { next?: string }) {
  const [state, action, pending] = useActionState<ActionState, FormData>(login, { ok: false });
  return (
    <form
      className="space-y-4"
      onSubmit={(event) => {
        // Submit via a transition so React doesn't clear the email after a failed attempt.
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        startTransition(() => action(data));
      }}
    >
      <input type="hidden" name="next" value={next ?? ""} />
      <div className="space-y-1">
        <label htmlFor="email" className="font-label-md text-label-md text-on-surface">Email</label>
        <input id="email" name="email" type="email" autoComplete="username" required className="h-11 w-full rounded-xl bg-surface-container-low px-3 focus:outline-none focus:ring-2 focus:ring-electric-blue" />
        {state.fieldErrors?.email ? <p className="font-body-sm text-body-sm text-error">{state.fieldErrors.email}</p> : null}
      </div>
      <div className="space-y-1">
        <label htmlFor="password" className="font-label-md text-label-md text-on-surface">Password</label>
        <input id="password" name="password" type="password" autoComplete="current-password" required className="h-11 w-full rounded-xl bg-surface-container-low px-3 focus:outline-none focus:ring-2 focus:ring-electric-blue" />
      </div>
      {state.message ? (
        <p role="alert" className="flex items-center gap-2 rounded-lg bg-error-container p-3 font-body-sm text-body-sm text-on-error-container">
          <Icon name="error" size={18} /> {state.message}
        </p>
      ) : null}
      <Submit pending={pending} />
    </form>
  );
}
