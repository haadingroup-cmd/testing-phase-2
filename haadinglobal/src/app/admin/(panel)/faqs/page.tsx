import { AdminTitle, Card } from "@/components/admin/bits";
import { ActionForm, Checkbox, ConfirmSubmit, TextArea, TextField } from "@/components/admin/ui";
import { deleteFaq, saveFaq } from "@/app/admin/actions";
import { getDb } from "@/lib/db";

export const metadata = { title: "FAQs" };

function FaqFields({ faq }: { faq?: { question: string; answer: string; category: string; sortOrder: number; published: boolean } }) {
  return (
    <>
      <TextField name="question" label="Question" defaultValue={faq?.question} />
      <TextArea name="answer" label="Answer" defaultValue={faq?.answer} rows={3} />
      <div className="grid gap-4 sm:grid-cols-2">
        <TextField name="category" label="Category" defaultValue={faq?.category ?? "general"} hint="“general” appears on the homepage, pricing and /faq" />
        <TextField name="sortOrder" label="Sort order" type="number" defaultValue={faq?.sortOrder ?? 0} />
      </div>
      <Checkbox name="published" label="Published" defaultChecked={faq ? faq.published : true} />
    </>
  );
}

export default async function AdminFaqs() {
  const faqs = await getDb().fAQ.findMany({ orderBy: [{ category: "asc" }, { sortOrder: "asc" }] });
  return (
    <>
      <AdminTitle title="FAQs" description="Service-specific FAQs are edited on each service." />
      <Card className="mb-6">
        <h2 className="mb-3 font-label-lg text-label-lg">Add FAQ</h2>
        <ActionForm action={saveFaq.bind(null, null)} submitLabel="Add FAQ">
          <FaqFields />
        </ActionForm>
      </Card>
      <div className="space-y-4">
        {faqs.map((f) => (
          <Card key={f.id}>
            <details>
              <summary className="cursor-pointer font-label-lg text-label-lg text-on-surface">
                {f.question} <span className="font-body-sm text-body-sm text-on-surface-variant">· {f.category}{f.published ? "" : " · hidden"}</span>
              </summary>
              <div className="mt-4 space-y-4">
                <ActionForm action={saveFaq.bind(null, f.id)}>
                  <FaqFields faq={f} />
                </ActionForm>
                <form action={deleteFaq.bind(null, f.id)}>
                  <ConfirmSubmit label="Delete FAQ" message="Delete this FAQ?" />
                </form>
              </div>
            </details>
          </Card>
        ))}
      </div>
    </>
  );
}
