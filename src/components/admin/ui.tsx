"use client";

import { createContext, startTransition, useActionState, useContext } from "react";
import { useFormStatus } from "react-dom";
import { Icon } from "@/components/ui/Icon";
import { cn } from "@/lib/utils";
import type { ActionState } from "@/app/admin/actions";

const ErrorsContext = createContext<Record<string, string>>({});

const inputClass =
  "w-full rounded-lg border border-[rgba(148,163,184,0.35)] bg-surface-container-lowest px-3 py-2 font-body-sm text-body-sm text-on-surface focus:border-electric-blue focus:outline-none focus:ring-[3px] focus:ring-electric-blue/15";

/**
 * Form bound to a server action, showing success/error feedback without a
 * full reload. Submitted via a transition (not the `action` prop) so React
 * doesn't reset the fields — edits survive a validation error.
 */
export function ActionForm({
  action,
  children,
  submitLabel = "Save",
  className,
}: {
  action: (state: ActionState, formData: FormData) => Promise<ActionState>;
  children: React.ReactNode;
  submitLabel?: string;
  className?: string;
}) {
  const [state, formAction, pending] = useActionState(action, { ok: false });
  return (
    <ErrorsContext.Provider value={state.fieldErrors ?? {}}>
      <form
        className={cn("space-y-4", className)}
        noValidate
        onSubmit={(event) => {
          event.preventDefault();
          const data = new FormData(event.currentTarget);
          startTransition(() => formAction(data));
        }}
      >
        {children}
        {state.message ? (
          <p
            role={state.ok ? "status" : "alert"}
            className={cn("flex items-center gap-2 rounded-lg p-3 font-body-sm text-body-sm", state.ok ? "bg-[#e3f6ea] text-[#16803d]" : "bg-error-container text-on-error-container")}
          >
            <Icon name={state.ok ? "check_circle" : "error"} size={18} /> {state.message}
          </p>
        ) : null}
        <SaveButton label={submitLabel} pending={pending} />
      </form>
    </ErrorsContext.Provider>
  );
}

export function SaveButton({ label = "Save", pending }: { label?: string; pending: boolean }) {
  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex items-center gap-2 rounded-lg bg-secondary px-5 py-2.5 font-label-lg text-label-lg text-on-secondary hover:bg-primary-container disabled:opacity-60"
    >
      {pending ? <Icon name="progress_activity" size={18} className="animate-spin" /> : <Icon name="done" size={18} />}
      {pending ? "Saving..." : label}
    </button>
  );
}

function FieldShell({ name, label, hint, children }: { name: string; label: string; hint?: string; children: React.ReactNode }) {
  const errors = useContext(ErrorsContext);
  const error = errors[name];
  return (
    <div className="space-y-1">
      <label htmlFor={`f-${name}`} className="block font-label-md text-label-md text-on-surface">
        {label}
      </label>
      {children}
      {error ? (
        <p role="alert" className="font-body-sm text-body-sm text-error">
          {error}
        </p>
      ) : hint ? (
        <p className="font-body-sm text-body-sm text-on-surface-variant">{hint}</p>
      ) : null}
    </div>
  );
}

type Common = { name: string; label: string; hint?: string; defaultValue?: string | number | null };

export function TextField({ name, label, hint, defaultValue, type = "text", ...rest }: Common & Omit<React.InputHTMLAttributes<HTMLInputElement>, "name" | "defaultValue">) {
  return (
    <FieldShell name={name} label={label} hint={hint}>
      <input id={`f-${name}`} name={name} type={type} defaultValue={defaultValue ?? ""} className={inputClass} {...rest} />
    </FieldShell>
  );
}

export function TextArea({ name, label, hint, defaultValue, rows = 4, mono }: Common & { rows?: number; mono?: boolean }) {
  return (
    <FieldShell name={name} label={label} hint={hint}>
      <textarea id={`f-${name}`} name={name} rows={rows} defaultValue={defaultValue ?? ""} className={cn(inputClass, mono && "font-mono text-[12px]")} />
    </FieldShell>
  );
}

export function SelectField({ name, label, hint, defaultValue, options }: Common & { options: ReadonlyArray<{ value: string; label: string }> | readonly string[] }) {
  return (
    <FieldShell name={name} label={label} hint={hint}>
      <select id={`f-${name}`} name={name} defaultValue={defaultValue ?? ""} className={inputClass}>
        {options.map((o) => {
          const opt = typeof o === "string" ? { value: o, label: o } : o;
          return (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          );
        })}
      </select>
    </FieldShell>
  );
}

export function Checkbox({ name, label, defaultChecked }: { name: string; label: string; defaultChecked?: boolean }) {
  return (
    <label className="flex items-center gap-2 font-body-sm text-body-sm text-on-surface">
      <input type="checkbox" name={name} defaultChecked={defaultChecked} className="h-[18px] w-[18px] accent-secondary" />
      {label}
    </label>
  );
}

/** Button that asks for confirmation before submitting a destructive server action. */
export function ConfirmSubmit({ label, message, className }: { label: string; message: string; className?: string }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      onClick={(e) => {
        if (!window.confirm(message)) e.preventDefault();
      }}
      className={cn("inline-flex items-center gap-1.5 rounded-lg bg-error-container px-4 py-2 font-label-md text-label-md text-on-error-container hover:bg-error hover:text-on-error disabled:opacity-60", className)}
    >
      <Icon name="delete" size={16} /> {pending ? "Deleting..." : label}
    </button>
  );
}
