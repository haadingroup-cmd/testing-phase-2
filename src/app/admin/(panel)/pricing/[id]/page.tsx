import Link from "next/link";
import { notFound } from "next/navigation";
import { AdminTitle, Card } from "@/components/admin/bits";
import { ActionForm, Checkbox, ConfirmSubmit, SelectField, TextArea, TextField } from "@/components/admin/ui";
import { Icon } from "@/components/ui/Icon";
import { deletePlan, savePlan } from "@/app/admin/actions";
import { getDb } from "@/lib/db";

export const metadata = { title: "Edit plan" };

export default async function EditPlan({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const p = id === "new" ? null : await getDb().pricingPlan.findUnique({ where: { id } });
  if (id !== "new" && !p) notFound();
  return (
    <>
      <Link href="/admin/pricing" className="mb-3 inline-flex items-center gap-1 font-label-md text-label-md text-secondary"><Icon name="arrow_back" size={16} /> Pricing</Link>
      <AdminTitle title={p ? p.name : "New plan"} />
      <Card>
        <ActionForm action={savePlan.bind(null, p?.id ?? null)}>
          <div className="grid gap-4 md:grid-cols-3">
            <TextField name="name" label="Package name" defaultValue={p?.name} />
            <TextField name="slug" label="Slug" defaultValue={p?.slug} />
            <TextField name="eyebrow" label="Eyebrow label" defaultValue={p?.eyebrow} />
            <TextField name="price" label="Price (PKR)" type="number" min={0} defaultValue={p?.price ?? 0} />
            <TextField name="billingPeriod" label="Billing period" defaultValue={p?.billingPeriod ?? "month"} />
            <TextField name="projectDiscount" label="Project discount (%)" type="number" min={0} max={90} defaultValue={p?.projectDiscount ?? 10} />
            <SelectField name="variant" label="Card style" defaultValue={p?.variant ?? "STANDARD"} options={["STANDARD", "POPULAR", "PREMIUM"]} />
            <TextField name="ctaLabel" label="CTA label" defaultValue={p?.ctaLabel ?? "Select plan"} />
            <TextField name="sortOrder" label="Sort order" type="number" defaultValue={p?.sortOrder ?? 0} />
          </div>
          <TextArea name="description" label="Description" defaultValue={p?.description} rows={2} />
          <TextArea name="features" label="Features (one per line)" defaultValue={p?.features.join("\n")} rows={6} />
          <TextField name="serviceLimits" label="Service limits" defaultValue={p?.serviceLimits} hint="e.g. 2 ad platforms · 20 posts / month" />
          <TextField name="whatsappMessage" label="WhatsApp pre-filled message" defaultValue={p?.whatsappMessage} />
          <div className="flex flex-wrap gap-6">
            <Checkbox name="published" label="Published" defaultChecked={p ? p.published : true} />
            <Checkbox name="popular" label="“Most popular” badge" defaultChecked={p?.popular} />
          </div>
        </ActionForm>
      </Card>
      {p ? (
        <form action={deletePlan.bind(null, p.id)} className="mt-4">
          <ConfirmSubmit label="Delete plan" message="Delete this plan?" />
        </form>
      ) : null}
    </>
  );
}
