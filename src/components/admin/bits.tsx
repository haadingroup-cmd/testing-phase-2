import Link from "next/link";
import { Icon } from "@/components/ui/Icon";
import { cn } from "@/lib/utils";
import type { LeadStatus } from "@/types";

export function AdminTitle({ title, description, action }: { title: string; description?: string; action?: { href: string; label: string } }) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
      <div>
        <h1 className="font-headline-md text-headline-md font-bold text-on-surface">{title}</h1>
        {description ? <p className="font-body-sm text-body-sm text-on-surface-variant">{description}</p> : null}
      </div>
      {action ? (
        <Link href={action.href} className="inline-flex items-center gap-1.5 rounded-lg bg-secondary px-4 py-2.5 font-label-lg text-label-lg text-on-secondary hover:bg-primary-container">
          <Icon name="add" size={18} /> {action.label}
        </Link>
      ) : null}
    </div>
  );
}

export const STATUS_STYLE: Record<LeadStatus, string> = {
  NEW: "bg-secondary-fixed text-on-secondary-fixed-variant",
  CONTACTED: "bg-tertiary-fixed text-on-tertiary-fixed-variant",
  QUALIFIED: "bg-surface-container-highest text-on-surface",
  CONVERTED: "bg-[#e3f6ea] text-[#16803d]",
  LOST: "bg-error-container text-on-error-container",
};

export function StatusBadge({ status }: { status: LeadStatus }) {
  return <span className={cn("inline-block rounded-full px-2.5 py-0.5 font-label-md text-label-md", STATUS_STYLE[status])}>{status}</span>;
}

export function Card({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn("rounded-2xl border border-[rgba(148,163,184,0.18)] bg-surface-container-lowest p-5 shadow-level-1", className)}>{children}</div>;
}

export function EmptyState({ message }: { message: string }) {
  return (
    <Card className="text-center">
      <Icon name="inbox" size={32} className="text-outline" />
      <p className="mt-2 font-body-sm text-body-sm text-on-surface-variant">{message}</p>
    </Card>
  );
}

export const tableClass = "w-full min-w-[720px] border-collapse text-left font-body-sm text-body-sm";
export const thClass = "border-b border-surface-container-high px-3 py-2 font-label-md text-label-md uppercase tracking-wide text-on-surface-variant";
export const tdClass = "border-b border-surface-container px-3 py-2.5 align-top";
