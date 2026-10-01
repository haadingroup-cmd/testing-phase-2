import Link from "next/link";
import { AdminTitle, Card, StatusBadge, tableClass, tdClass, thClass } from "@/components/admin/bits";
import { Icon } from "@/components/ui/Icon";
import { getDb } from "@/lib/db";
import { formatDate } from "@/lib/utils";

export const metadata = { title: "Dashboard" };

function daysAgo(days: number): Date {
  return new Date(Date.now() - days * 24 * 3600 * 1000);
}

export default async function AdminDashboard() {
  const db = getDb();
  const since = daysAgo(30);
  const [total, byStatus, recent, byService, last30, audits] = await Promise.all([
    db.lead.count(),
    db.lead.groupBy({ by: ["status"], _count: { _all: true } }),
    db.lead.findMany({ orderBy: { createdAt: "desc" }, take: 8 }),
    db.lead.groupBy({ by: ["service"], _count: { _all: true }, orderBy: { _count: { service: "desc" } }, take: 8 }),
    db.lead.count({ where: { createdAt: { gte: since } } }),
    db.auditRequest.count({ where: { status: "COMPLETED" } }),
  ]);
  const count = (s: string) => byStatus.find((b) => b.status === s)?._count._all ?? 0;
  const tiles = [
    { label: "Total leads", value: total, icon: "inbox" },
    { label: "New", value: count("NEW"), icon: "bolt" },
    { label: "Contacted", value: count("CONTACTED"), icon: "call" },
    { label: "Converted", value: count("CONVERTED"), icon: "handshake" },
    { label: "Leads (30 days)", value: last30, icon: "trending_up" },
    { label: "Audits run", value: audits, icon: "speed" },
  ];
  const maxService = Math.max(1, ...byService.map((s) => s._count._all));

  return (
    <>
      <AdminTitle title="Dashboard" description="Overview of enquiries and activity." />
      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-6">
        {tiles.map((t) => (
          <Card key={t.label}>
            <Icon name={t.icon} size={22} className="text-secondary" />
            <p className="mt-3 font-headline-md text-headline-md font-bold text-on-surface">{t.value}</p>
            <p className="font-label-md text-label-md text-on-surface-variant">{t.label}</p>
          </Card>
        ))}
      </div>
      <div className="mt-6 grid gap-4 xl:grid-cols-3">
        <Card className="overflow-x-auto xl:col-span-2">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="font-label-lg text-label-lg text-on-surface">Recent leads</h2>
            <Link href="/admin/leads" className="font-label-md text-label-md text-secondary hover:underline">View all</Link>
          </div>
          {recent.length ? (
            <table className={tableClass}>
              <thead>
                <tr>
                  <th className={thClass}>Name</th>
                  <th className={thClass}>Service</th>
                  <th className={thClass}>Source</th>
                  <th className={thClass}>Status</th>
                  <th className={thClass}>Date</th>
                </tr>
              </thead>
              <tbody>
                {recent.map((l) => (
                  <tr key={l.id}>
                    <td className={tdClass}><Link href={`/admin/leads/${l.id}`} className="font-semibold text-secondary hover:underline">{l.name}</Link></td>
                    <td className={tdClass}>{l.service ?? "—"}</td>
                    <td className={tdClass}>{l.source.replace("_", " ").toLowerCase()}</td>
                    <td className={tdClass}><StatusBadge status={l.status} /></td>
                    <td className={tdClass}>{formatDate(l.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="font-body-sm text-body-sm text-on-surface-variant">No leads yet. They&apos;ll appear here as soon as someone submits a form.</p>
          )}
        </Card>
        <Card>
          <h2 className="mb-3 font-label-lg text-label-lg text-on-surface">Enquiries by service</h2>
          {byService.length ? (
            <ul className="space-y-3">
              {byService.map((s) => (
                <li key={s.service ?? "none"}>
                  <div className="flex justify-between gap-2 font-body-sm text-body-sm">
                    <span className="truncate text-on-surface">{s.service ?? "Not specified"}</span>
                    <span className="font-semibold">{s._count._all}</span>
                  </div>
                  <div className="mt-1 h-1.5 rounded-full bg-surface-container">
                    <div className="h-full rounded-full bg-secondary" style={{ width: `${(s._count._all / maxService) * 100}%` }} />
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="font-body-sm text-body-sm text-on-surface-variant">No data yet.</p>
          )}
        </Card>
      </div>
    </>
  );
}
