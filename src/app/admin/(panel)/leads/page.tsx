import Link from "next/link";
import { AdminTitle, Card, EmptyState, StatusBadge, tableClass, tdClass, thClass } from "@/components/admin/bits";
import { getDb } from "@/lib/db";
import { cn, formatDate } from "@/lib/utils";
import type { Prisma } from "@/generated/prisma/client";
import type { LeadStatus } from "@/types";

export const metadata = { title: "Leads" };

const STATUSES: LeadStatus[] = ["NEW", "CONTACTED", "QUALIFIED", "CONVERTED", "LOST"];
const PAGE_SIZE = 25;

type Props = { searchParams: Promise<{ status?: string; q?: string; page?: string }> };

export default async function LeadsPage({ searchParams }: Props) {
  const sp = await searchParams;
  const status = STATUSES.includes(sp.status as LeadStatus) ? (sp.status as LeadStatus) : undefined;
  const q = (sp.q ?? "").trim().slice(0, 80);
  const page = Math.max(1, Number.parseInt(sp.page ?? "1", 10) || 1);
  const where: Prisma.LeadWhereInput = {
    ...(status ? { status } : {}),
    ...(q
      ? { OR: [{ name: { contains: q, mode: "insensitive" } }, { email: { contains: q, mode: "insensitive" } }, { phone: { contains: q } }, { business: { contains: q, mode: "insensitive" } }] }
      : {}),
  };
  const [leads, total] = await Promise.all([
    getDb().lead.findMany({ where, orderBy: { createdAt: "desc" }, skip: (page - 1) * PAGE_SIZE, take: PAGE_SIZE }),
    getDb().lead.count({ where }),
  ]);
  const pages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const href = (p: Record<string, string | undefined>) => {
    const s = new URLSearchParams(Object.entries({ status, q: q || undefined, ...p }).filter(([, v]) => v) as [string, string][]);
    return `/admin/leads${s.toString() ? `?${s}` : ""}`;
  };

  return (
    <>
      <AdminTitle title="Leads" description={`${total} lead${total === 1 ? "" : "s"}${status ? ` · ${status}` : ""}`} />
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <Link href={href({ status: undefined, page: undefined })} className={cn("rounded-full px-3 py-1.5 font-label-md text-label-md", !status ? "bg-secondary text-on-secondary" : "bg-surface-container-lowest")}>All</Link>
        {STATUSES.map((s) => (
          <Link key={s} href={href({ status: s, page: undefined })} className={cn("rounded-full px-3 py-1.5 font-label-md text-label-md", status === s ? "bg-secondary text-on-secondary" : "bg-surface-container-lowest")}>
            {s}
          </Link>
        ))}
        <form action="/admin/leads" className="ml-auto flex gap-2">
          {status ? <input type="hidden" name="status" value={status} /> : null}
          <input name="q" defaultValue={q} placeholder="Search name, email, phone…" aria-label="Search leads" className="h-9 rounded-lg border border-[rgba(148,163,184,0.35)] bg-surface-container-lowest px-3 font-body-sm text-body-sm" />
          <button className="rounded-lg bg-surface-container px-3 font-label-md text-label-md text-secondary">Search</button>
        </form>
      </div>
      {leads.length ? (
        <Card className="overflow-x-auto p-0">
          <table className={tableClass}>
            <thead>
              <tr>
                {["Name", "Phone", "Email", "Business", "Service", "Budget", "Status", "Date"].map((h) => (
                  <th key={h} className={thClass}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {leads.map((l) => (
                <tr key={l.id} className="hover:bg-surface-container-low">
                  <td className={tdClass}><Link href={`/admin/leads/${l.id}`} className="font-semibold text-secondary hover:underline">{l.name}</Link></td>
                  <td className={tdClass}><a href={`https://wa.me/${l.phone.replace(/\D/g, "")}`} target="_blank" rel="noopener noreferrer" className="hover:underline">{l.phone}</a></td>
                  <td className={tdClass}>{l.email ? <a href={`mailto:${l.email}`} className="hover:underline">{l.email}</a> : "—"}</td>
                  <td className={tdClass}>{l.business ?? "—"}</td>
                  <td className={cn(tdClass, "max-w-[200px] truncate")}>{l.service ?? "—"}</td>
                  <td className={tdClass}>{l.budget ?? "—"}</td>
                  <td className={tdClass}><StatusBadge status={l.status} /></td>
                  <td className={cn(tdClass, "whitespace-nowrap")}>{formatDate(l.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      ) : (
        <EmptyState message="No leads match these filters." />
      )}
      {pages > 1 ? (
        <div className="mt-4 flex items-center gap-3 font-label-md text-label-md">
          {page > 1 ? <Link href={href({ page: String(page - 1) })} className="text-secondary">← Previous</Link> : null}
          <span>Page {page} of {pages}</span>
          {page < pages ? <Link href={href({ page: String(page + 1) })} className="text-secondary">Next →</Link> : null}
        </div>
      ) : null}
    </>
  );
}
