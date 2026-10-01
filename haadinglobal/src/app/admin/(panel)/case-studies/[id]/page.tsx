import Link from "next/link";
import { notFound } from "next/navigation";
import { AdminTitle, Card } from "@/components/admin/bits";
import { ActionForm, Checkbox, ConfirmSubmit, TextArea, TextField } from "@/components/admin/ui";
import { Icon } from "@/components/ui/Icon";
import { deleteCaseStudy, saveCaseStudy } from "@/app/admin/actions";
import { mapCaseStudy } from "@/lib/data/mappers";
import { getDb } from "@/lib/db";

export const metadata = { title: "Edit case study" };

export default async function EditCaseStudy({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const row = id === "new" ? null : await getDb().caseStudy.findUnique({ where: { id } });
  if (id !== "new" && !row) notFound();
  const c = row ? mapCaseStudy(row) : null;
  return (
    <>
      <Link href="/admin/case-studies" className="mb-3 inline-flex items-center gap-1 font-label-md text-label-md text-secondary"><Icon name="arrow_back" size={16} /> Case studies</Link>
      <AdminTitle title={c ? c.title : "New case study"} />
      <Card>
        <ActionForm action={saveCaseStudy.bind(null, row?.id ?? null)}>
          <div className="grid gap-4 md:grid-cols-3">
            <TextField name="title" label="Title" defaultValue={c?.title} />
            <TextField name="slug" label="Slug" defaultValue={c?.slug} />
            <TextField name="client" label="Client" defaultValue={c?.client} />
            <TextField name="industry" label="Industry" defaultValue={c?.industry} />
            <TextField name="country" label="Country" defaultValue={c?.country} />
            <TextField name="service" label="Service" defaultValue={c?.service} />
            <TextField name="tags" label="Filter tags (comma separated)" defaultValue={c?.tags.join(", ")} hint="meta, google, seo, ecommerce, gulf, web, ai, tiktok" />
            <TextField name="headlineValue" label="Headline metric" defaultValue={c?.headlineValue} hint="e.g. 4.2x" />
            <TextField name="headlineLabel" label="Headline metric label" defaultValue={c?.headlineLabel} hint="e.g. Performance Max ROAS" />
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            <TextArea name="problem" label="Problem" defaultValue={c?.problem} />
            <TextArea name="strategy" label="Strategy" defaultValue={c?.strategy} />
            <TextArea name="result" label="Result" defaultValue={c?.result} />
          </div>
          <TextArea name="metrics" label="Metrics" hint="One per line: Label | Value" defaultValue={c?.metrics.map((m) => `${m.label} | ${m.value}`).join("\n")} mono />
          <div className="grid gap-4 md:grid-cols-2">
            <TextArea name="before" label="Before (optional)" defaultValue={c?.beforeAfter?.before} rows={2} />
            <TextArea name="after" label="After (optional)" defaultValue={c?.beforeAfter?.after} rows={2} />
          </div>
          <TextField name="coverImage" label="Cover image" defaultValue={c?.coverImage} hint="/images/... or https://..." />
          <TextArea name="gallery" label="Gallery" hint="One per line: /images/results/file.png | Caption" defaultValue={c?.gallery.map((g) => `${g.src} | ${g.caption}`).join("\n")} mono />
          <div className="grid gap-4 md:grid-cols-2">
            <TextField name="liveUrl" label="Live URL" defaultValue={c?.liveUrl} />
            <TextField name="sortOrder" label="Sort order" type="number" defaultValue={c?.sortOrder ?? 0} />
          </div>
          <div className="flex flex-wrap gap-6">
            <Checkbox name="published" label="Published" defaultChecked={row?.published} />
            <Checkbox name="isPlaceholder" label="Placeholder (unverified — shows a label on the site)" defaultChecked={c?.isPlaceholder} />
          </div>
        </ActionForm>
      </Card>
      {row ? (
        <form action={deleteCaseStudy.bind(null, row.id)} className="mt-4">
          <ConfirmSubmit label="Delete case study" message="Delete this case study?" />
        </form>
      ) : null}
    </>
  );
}
