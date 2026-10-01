import Link from "next/link";
import { AdminTitle, Card, EmptyState, tableClass, tdClass, thClass } from "@/components/admin/bits";
import { Icon } from "@/components/ui/Icon";
import { getDb } from "@/lib/db";
import { formatPKR, priceUnitLabel } from "@/lib/utils";

export const metadata = { title: "Services" };

export default async function AdminServices() {
  const services = await getDb().service.findMany({ orderBy: [{ sortOrder: "asc" }, { title: "asc" }] });
  return (
    <>
      <AdminTitle title="Services" description="Shown on /services, service pages, the homepage and the package builder." action={{ href: "/admin/services/new", label: "New service" }} />
      {services.length ? (
        <Card className="overflow-x-auto p-0">
          <table className={tableClass}>
            <thead><tr>{["", "Title", "Slug", "Category", "Price", "Flags", "Order"].map((h) => <th key={h} className={thClass}>{h}</th>)}</tr></thead>
            <tbody>
              {services.map((s) => (
                <tr key={s.id} className="hover:bg-surface-container-low">
                  <td className={tdClass}><Icon name={s.icon} size={20} className="text-secondary" /></td>
                  <td className={tdClass}><Link href={`/admin/services/${s.id}`} className="font-semibold text-secondary hover:underline">{s.title}</Link></td>
                  <td className={tdClass}>/services/{s.slug}</td>
                  <td className={tdClass}>{s.category}</td>
                  <td className={tdClass}>{formatPKR(s.price)} {priceUnitLabel(s.priceUnit)}</td>
                  <td className={tdClass}>{[!s.published && "Hidden", s.featured && "Featured", s.inBuilder && "Builder"].filter(Boolean).join(" · ")}</td>
                  <td className={tdClass}>{s.sortOrder}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      ) : <EmptyState message="No services yet. Run the seed script or add one." />}
    </>
  );
}
