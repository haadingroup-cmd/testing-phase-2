import { forwardRef } from "react";
import { Icon } from "@/components/ui/Icon";
import { cn } from "@/lib/utils";

type Tone = "light" | "dark";

const inputBase =
  "w-full rounded-xl border font-body-sm text-body-sm transition-colors focus:outline-none focus:ring-[3px] focus:ring-electric-blue/15 disabled:opacity-60";

const toneClass: Record<Tone, string> = {
  light: "border-transparent bg-surface-container-low text-on-surface placeholder:text-[#94A3B8] focus:border-electric-blue focus:bg-surface-container",
  dark: "border-transparent bg-surface-container-lowest text-primary placeholder:text-outline focus:border-electric-blue",
};

type FieldProps = {
  id: string;
  label: string;
  error?: string;
  hint?: string;
  required?: boolean;
  tone?: Tone;
  icon?: string;
  children: React.ReactNode;
};

export function Field({ id, label, error, hint, required, tone = "light", icon, children }: FieldProps) {
  return (
    <div className="space-y-1">
      <label htmlFor={id} className={cn("block font-label-md text-label-md font-semibold", tone === "dark" ? "text-on-primary" : "text-on-surface")}>
        {label}
        {required ? <span className={tone === "dark" ? "text-accent-gold-light" : "text-error"}> *</span> : null}
      </label>
      <div className="relative">
        {icon ? (
          <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-outline">
            <Icon name={icon} size={18} />
          </span>
        ) : null}
        {children}
      </div>
      {error ? (
        <p id={`${id}-error`} role="alert" className={cn("flex items-center gap-1 font-body-sm text-body-sm", tone === "dark" ? "text-[#ffb4ab]" : "text-error")}>
          <Icon name="error" size={14} /> {error}
        </p>
      ) : hint ? (
        <p className={cn("font-body-sm text-body-sm", tone === "dark" ? "text-on-primary-container" : "text-on-surface-variant")}>{hint}</p>
      ) : null}
    </div>
  );
}

type InputProps = React.InputHTMLAttributes<HTMLInputElement> & { tone?: Tone; hasIcon?: boolean; invalid?: boolean };

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input({ tone = "light", hasIcon, invalid, className, ...props }, ref) {
  return (
    <input
      ref={ref}
      aria-invalid={invalid || undefined}
      aria-describedby={invalid && props.id ? `${props.id}-error` : undefined}
      className={cn(inputBase, toneClass[tone], "h-11 px-space-sm", hasIcon && "pl-10", invalid && "!border-error", className)}
      {...props}
    />
  );
});

type SelectProps = React.SelectHTMLAttributes<HTMLSelectElement> & { tone?: Tone; hasIcon?: boolean; invalid?: boolean };

export const Select = forwardRef<HTMLSelectElement, SelectProps>(function Select({ tone = "light", hasIcon, invalid, className, children, ...props }, ref) {
  return (
    <>
      <select
        ref={ref}
        aria-invalid={invalid || undefined}
        aria-describedby={invalid && props.id ? `${props.id}-error` : undefined}
        className={cn(inputBase, toneClass[tone], "h-11 appearance-none px-space-sm pr-9", hasIcon && "pl-10", invalid && "!border-error", className)}
        {...props}
      >
        {children}
      </select>
      <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-outline">
        <Icon name="expand_more" size={18} />
      </span>
    </>
  );
});

type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement> & { tone?: Tone; invalid?: boolean };

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea({ tone = "light", invalid, className, ...props }, ref) {
  return (
    <textarea
      ref={ref}
      aria-invalid={invalid || undefined}
      aria-describedby={invalid && props.id ? `${props.id}-error` : undefined}
      className={cn(inputBase, toneClass[tone], "min-h-28 px-space-sm py-2.5", invalid && "!border-error", className)}
      {...props}
    />
  );
});

/** Hidden honeypot field — real users never see or fill it. */
export function Honeypot(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
      <label>
        Company fax
        <input type="text" tabIndex={-1} autoComplete="off" {...props} />
      </label>
    </div>
  );
}
