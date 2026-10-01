import Link from "next/link";
import { AdminTitle, Card, EmptyState, tableClass, tdClass, thClass } from "@/components/admin/bits";
import { getDb } from "@/lib/db";

export const metadata = { title: "Case studies" };

export default async function AdminCaseStudies() {
  const rows = await getDb().caseStudy.findMany({ orderBy: { sortOrder: "asc" } });
  return (
    <>
      <AdminTitle title="Case studies" description="Only add results you can verify. Mark unverified entries as placeholders." action={{ href: "/admin/case-studies/new", label: "New case study" }} />
      {rows.length ? (
        <Card className="overflow-x-auto p-0">
          <table className={tableClass}>
            <thead><tr>{["Title", "Client", "Country", "Service", "Status", "Order"].map((h) => <th key={h} className={thClass}>{h}</th>)}</tr></thead>
            <tbody>
              {rows.map((c) => (
                <tr key={c.id} className="hover:bg-surface-container-low">
                  <td className={tdClass}><Link href={`/admin/case-studies/${c.id}`} className="font-semibold text-secondary hover:underline">{c.title}</Link></td>
                  <td className={tdClass}>{c.client}</td>
                  <td className={tdClass}>{c.country}</td>
                  <td className={tdClass}>{c.service}</td>
                  <td className={tdClass}>{[c.published ? "Published" : "Hidden", c.isPlaceholder && "Placeholder"].filter(Boolean).join(" · ")}</td>
                  <td className={tdClass}>{c.sortOrder}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      ) : <EmptyState message="No case studies yet." />}
    </>
  );
}
