import Link from "next/link";
import { AdminTitle, Card, EmptyState, tableClass, tdClass, thClass } from "@/components/admin/bits";
import { getDb } from "@/lib/db";
import { formatPKR } from "@/lib/utils";

export const metadata = { title: "Pricing" };

export default async function AdminPricing() {
  const plans = await getDb().pricingPlan.findMany({ orderBy: { sortOrder: "asc" } });
  return (
    <>
      <AdminTitle title="Pricing plans" description="Retainer tiers on /pricing." action={{ href: "/admin/pricing/new", label: "New plan" }} />
      {plans.length ? (
        <Card className="overflow-x-auto p-0">
          <table className={tableClass}>
            <thead><tr>{["Name", "Price", "Variant", "Popular", "Published", "Order"].map((h) => <th key={h} className={thClass}>{h}</th>)}</tr></thead>
            <tbody>
              {plans.map((p) => (
                <tr key={p.id} className="hover:bg-surface-container-low">
                  <td className={tdClass}><Link href={`/admin/pricing/${p.id}`} className="font-semibold text-secondary hover:underline">{p.name}</Link></td>
                  <td className={tdClass}>{formatPKR(p.price)} / {p.billingPeriod}</td>
                  <td className={tdClass}>{p.variant}</td>
                  <td className={tdClass}>{p.popular ? "Yes" : "—"}</td>
                  <td className={tdClass}>{p.published ? "Yes" : "No"}</td>
                  <td className={tdClass}>{p.sortOrder}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      ) : <EmptyState message="No plans yet." />}
    </>
  );
}
