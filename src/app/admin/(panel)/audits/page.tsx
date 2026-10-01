import Link from "next/link";
import { AdminTitle, Card, EmptyState, tableClass, tdClass, thClass } from "@/components/admin/bits";
import { ConfirmSubmit } from "@/components/admin/ui";
import { deleteAudit } from "@/app/admin/actions";
import { getDb } from "@/lib/db";
import { formatDate } from "@/lib/utils";

export const metadata = { title: "Audit requests" };

export default async function AdminAudits() {
  const audits = await getDb().auditRequest.findMany({ orderBy: { createdAt: "desc" }, take: 100, include: { lead: { select: { id: true, name: true } } } });
  return (
    <>
      <AdminTitle title="Audit requests" description="Latest 100 runs of the free website audit." />
      {audits.length ? (
        <Card className="overflow-x-auto p-0">
          <table className={tableClass}>
            <thead><tr>{["URL", "Score", "Status", "Phone", "Lead", "Date", ""].map((h) => <th key={h} className={thClass}>{h}</th>)}</tr></thead>
            <tbody>
              {audits.map((a) => (
                <tr key={a.id}>
                  <td className={`${tdClass} max-w-[260px] break-all`}>{a.status === "COMPLETED" ? <Link href={`/audit/report/${a.id}`} target="_blank" className="text-secondary hover:underline">{a.finalUrl ?? a.url}</Link> : a.url}</td>
                  <td className={tdClass}>{a.score ?? "—"}</td>
                  <td className={tdClass}>{a.status}{a.error ? <span className="block text-[11px] text-error">{a.error.slice(0, 80)}</span> : null}</td>
                  <td className={tdClass}>{a.phone ?? "—"}</td>
                  <td className={tdClass}>{a.lead ? <Link href={`/admin/leads/${a.lead.id}`} className="text-secondary hover:underline">{a.lead.name}</Link> : "—"}</td>
                  <td className={tdClass}>{formatDate(a.createdAt)}</td>
                  <td className={tdClass}>
                    <form action={deleteAudit.bind(null, a.id)}>
                      <ConfirmSubmit label="Delete" message="Delete this audit record?" className="px-2 py-1" />
                    </form>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      ) : <EmptyState message="No audits have been run yet." />}
    </>
  );
}
