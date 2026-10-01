import Link from "next/link";
import { notFound } from "next/navigation";
import { AdminTitle, Card } from "@/components/admin/bits";
import { ActionForm, Checkbox, ConfirmSubmit, SelectField, TextArea, TextField } from "@/components/admin/ui";
import { Icon } from "@/components/ui/Icon";
import { deleteService, saveService } from "@/app/admin/actions";
import { mapService } from "@/lib/data/mappers";
import { getDb } from "@/lib/db";
import { ICON_NAMES } from "@/lib/icons";

export const metadata = { title: "Edit service" };

export default async function EditService({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const isNew = id === "new";
  const row = isNew ? null : await getDb().service.findUnique({ where: { id } });
  if (!isNew && !row) notFound();
  const s = row ? mapService(row) : null;
  return (
    <>
      <Link href="/admin/services" className="mb-3 inline-flex items-center gap-1 font-label-md text-label-md text-secondary"><Icon name="arrow_back" size={16} /> Services</Link>
      <AdminTitle title={s ? s.title : "New service"} description={s ? `/services/${s.slug}` : undefined} />
      <Card>
        <ActionForm action={saveService.bind(null, row?.id ?? null)}>
          <div className="grid gap-4 md:grid-cols-2">
            <TextField name="title" label="Title" defaultValue={s?.title} required />
            <TextField name="slug" label="Slug (URL)" defaultValue={s?.slug} hint="e.g. meta-ads" required />
            <TextField name="tagline" label="Tagline" defaultValue={s?.tagline} />
            <SelectField name="category" label="Category" defaultValue={s?.category ?? "PERFORMANCE"} options={[{ value: "PERFORMANCE", label: "Performance Marketing" }, { value: "TECH", label: "Development & Tech" }, { value: "CREATIVE", label: "Creative & AI" }]} />
            <SelectField name="icon" label="Icon (Material Symbols)" defaultValue={s?.icon ?? "star"} options={ICON_NAMES} />
            <div className="grid grid-cols-2 gap-3">
              <TextField name="price" label="Price (PKR)" type="number" min={0} defaultValue={s?.price ?? 0} />
              <SelectField name="priceUnit" label="Per" defaultValue={s?.priceUnit ?? "MONTH"} options={[{ value: "MONTH", label: "Month" }, { value: "PROJECT", label: "Project" }]} />
            </div>
          </div>
          <TextArea name="shortDescription" label="Short description (cards)" defaultValue={s?.shortDescription} rows={2} />
          <TextArea name="description" label="Full description" defaultValue={s?.description} rows={4} />
          <div className="grid gap-4 md:grid-cols-3">
            <TextArea name="highlights" label="Highlight tags (one per line)" defaultValue={s?.highlights.join("\n")} rows={4} />
            <TextArea name="features" label="Features (one per line)" defaultValue={s?.features.join("\n")} rows={6} />
            <TextArea name="benefits" label="Benefits (one per line)" defaultValue={s?.benefits.join("\n")} rows={6} />
          </div>
          <TextArea name="process" label="Process steps" hint="One per line: Step title | description" defaultValue={s?.process.map((p) => `${p.title} | ${p.description}`).join("\n")} rows={5} mono />
          <TextArea name="faqs" label="FAQs" hint="One per line: Question | Answer" defaultValue={s?.faqs.map((f) => `${f.question} | ${f.answer}`).join("\n")} rows={5} mono />
          <div className="grid gap-4 md:grid-cols-2">
            <TextField name="ctaLabel" label="CTA label" defaultValue={s?.ctaLabel ?? "Get started"} />
            <TextField name="whatsappMessage" label="WhatsApp pre-filled message" defaultValue={s?.whatsappMessage} />
            <TextField name="seoTitle" label="SEO title" defaultValue={s?.seoTitle} maxLength={70} />
            <TextField name="seoDescription" label="SEO description" defaultValue={s?.seoDescription} maxLength={170} />
            <TextField name="image" label="Image" hint="/images/... or https://..." defaultValue={s?.image} />
            <TextField name="builderLabel" label="Package builder label" defaultValue={s?.builderLabel} />
            <TextField name="sortOrder" label="Sort order" type="number" defaultValue={s?.sortOrder ?? 0} />
          </div>
          <div className="flex flex-wrap gap-6">
            <Checkbox name="published" label="Published" defaultChecked={row ? row.published : true} />
            <Checkbox name="featured" label="Featured on homepage" defaultChecked={s?.featured} />
            <Checkbox name="inBuilder" label="Available in package builder" defaultChecked={s ? s.inBuilder : true} />
          </div>
        </ActionForm>
      </Card>
      {row ? (
        <form action={deleteService.bind(null, row.id)} className="mt-4">
          <ConfirmSubmit label="Delete service" message="Delete this service? This cannot be undone." />
        </form>
      ) : null}
    </>
  );
}
