import { Icon } from "@/components/ui/Icon";
import { whatsappLink } from "@/lib/whatsapp";
import { cn } from "@/lib/utils";

export function FormError({ message, tone = "light" }: { message: string | null; tone?: "light" | "dark" }) {
  if (!message) return null;
  return (
    <div
      role="alert"
      className={cn(
        "flex items-start gap-2 rounded-xl p-space-sm font-body-sm text-body-sm",
        tone === "dark" ? "bg-error/25 text-[#ffdad6]" : "bg-error-container text-on-error-container",
      )}
    >
      <Icon name="error" size={18} className="mt-0.5" />
      <span>{message}</span>
    </div>
  );
}

export function FormSuccess({
  title = "Thank you! Your request has been received.",
  body,
  whatsappMessage,
  whatsappNumber,
  onReset,
  tone = "light",
}: {
  title?: string;
  body: string;
  whatsappMessage: string;
  whatsappNumber?: string;
  onReset?: () => void;
  tone?: "light" | "dark";
}) {
  return (
    <div role="status" aria-live="polite" className={cn("space-y-space-sm rounded-2xl p-space-md", tone === "dark" ? "bg-on-primary/5" : "bg-surface-container-low")}>
      <div className="flex items-start gap-2">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-whatsapp/15 text-[#128c4a]">
          <Icon name="check_circle" size={22} filled />
        </span>
        <p className={cn("font-headline-sm text-headline-sm font-bold", tone === "dark" ? "text-on-primary" : "text-on-surface")}>{title}</p>
      </div>
      <p className={cn("font-body-sm text-body-sm", tone === "dark" ? "text-on-primary-container" : "text-on-surface-variant")}>{body}</p>
      <div className="flex flex-col gap-2 sm:flex-row">
        <a
          href={whatsappLink(whatsappMessage, whatsappNumber)}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 rounded-xl bg-whatsapp px-space-md py-3 font-label-lg text-label-lg font-bold text-white transition-transform hover:scale-[1.02]"
        >
          <Icon name="chat" size={18} /> Chat on WhatsApp
        </a>
        {onReset ? (
          <button
            type="button"
            onClick={onReset}
            className={cn(
              "rounded-xl px-space-md py-3 font-label-lg text-label-lg",
              tone === "dark" ? "text-on-primary hover:bg-on-primary/10" : "text-secondary hover:bg-surface-container",
            )}
          >
            Send another request
          </button>
        ) : null}
      </div>
    </div>
  );
}

export function SubmitButton({
  submitting,
  children,
  submittingLabel = "Submitting...",
  className,
}: {
  submitting: boolean;
  children: React.ReactNode;
  submittingLabel?: string;
  className?: string;
}) {
  return (
    <button
      type="submit"
      disabled={submitting}
      aria-busy={submitting}
      className={cn(
        "flex w-full items-center justify-center gap-space-xs rounded-xl bg-secondary py-3.5 font-label-lg text-label-lg font-bold text-on-secondary shadow-md transition-all hover:bg-electric-blue active:scale-[0.98] disabled:cursor-wait disabled:opacity-80",
        className,
      )}
    >
      {submitting ? (
        <>
          <Icon name="progress_activity" size={18} className="animate-spin" />
          {submittingLabel}
        </>
      ) : (
        children
      )}
    </button>
  );
}
