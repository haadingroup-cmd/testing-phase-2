import Link from "next/link";
import { notFound } from "next/navigation";
import { AdminTitle, Card } from "@/components/admin/bits";
import { ActionForm, Checkbox, ConfirmSubmit, SelectField, TextArea, TextField } from "@/components/admin/ui";
import { Icon } from "@/components/ui/Icon";
import { deletePost, savePost } from "@/app/admin/actions";
import { getDb } from "@/lib/db";

export const metadata = { title: "Edit post" };

export default async function EditPost({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const p = id === "new" ? null : await getDb().blogPost.findUnique({ where: { id } });
  if (id !== "new" && !p) notFound();
  return (
    <>
      <Link href="/admin/blog" className="mb-3 inline-flex items-center gap-1 font-label-md text-label-md text-secondary"><Icon name="arrow_back" size={16} /> Blog</Link>
      <AdminTitle title={p ? p.title : "New post"} />
      <Card>
        <ActionForm action={savePost.bind(null, p?.id ?? null)}>
          <div className="grid gap-4 md:grid-cols-2">
            <TextField name="title" label="Title" defaultValue={p?.title} />
            <TextField name="slug" label="Slug" defaultValue={p?.slug} />
            <TextField name="category" label="Category" defaultValue={p?.category} />
            <TextField name="author" label="Author" defaultValue={p?.author ?? "HaadinGlobal Team"} />
            <TextField name="coverImage" label="Cover image" defaultValue={p?.coverImage} hint="/images/blog/... or https://..." />
            <TextField name="readTime" label="Read time" defaultValue={p?.readTime} hint="e.g. 6 min" />
            <SelectField name="status" label="Status" defaultValue={p?.status ?? "DRAFT"} options={[{ value: "DRAFT", label: "Draft" }, { value: "PUBLISHED", label: "Published" }]} />
            <TextField name="publishedAt" label="Publish date" type="datetime-local" defaultValue={p?.publishedAt ? p.publishedAt.toISOString().slice(0, 16) : ""} hint="Leave empty to use now when publishing. Future dates schedule the post." />
          </div>
          <TextArea name="excerpt" label="Excerpt" defaultValue={p?.excerpt} rows={2} />
          <TextArea name="content" label="Content (HTML)" hint="Allowed: h2–h4, p, lists, links, images, tables, blockquote, code. Unsafe markup is removed on save." defaultValue={p?.content} rows={18} mono />
          <TextField name="tags" label="Tags (comma separated)" defaultValue={p?.tags.join(", ")} />
          <div className="grid gap-4 md:grid-cols-2">
            <TextField name="seoTitle" label="SEO title" defaultValue={p?.seoTitle} maxLength={70} />
            <TextField name="seoDescription" label="SEO description" defaultValue={p?.seoDescription} maxLength={170} />
          </div>
          <Checkbox name="featured" label="Featured on blog index" defaultChecked={p?.featured} />
        </ActionForm>
      </Card>
      {p ? (
        <form action={deletePost.bind(null, p.id)} className="mt-4">
          <ConfirmSubmit label="Delete post" message="Delete this post permanently?" />
        </form>
      ) : null}
    </>
  );
}
