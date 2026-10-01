import Link from "next/link";
import { notFound } from "next/navigation";
import { AdminTitle, Card, StatusBadge } from "@/components/admin/bits";
import { ActionForm, ConfirmSubmit, SelectField, TextArea } from "@/components/admin/ui";
import { Icon } from "@/components/ui/Icon";
import { deleteLead, updateLead } from "@/app/admin/actions";
import { getDb } from "@/lib/db";
import { formatDate } from "@/lib/utils";
import { whatsappLink } from "@/lib/whatsapp";

export const metadata = { title: "Lead" };

export default async function LeadDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const lead = await getDb().lead.findUnique({ where: { id }, include: { auditRequests: { select: { id: true, score: true } } } });
  if (!lead) notFound();
  const rows: Array<[string, React.ReactNode]> = [
    ["Phone / WhatsApp", <a key="p" href={whatsappLink(`Hello ${lead.name}, this is HaadinGlobal following up on your enquiry.`, lead.phone)} target="_blank" rel="noopener noreferrer" className="text-secondary hover:underline">{lead.phone}</a>],
    ["Email", lead.email ? <a key="e" href={`mailto:${lead.email}`} className="text-secondary hover:underline">{lead.email}</a> : "—"],
    ["Business", lead.business ?? "—"],
    ["Website", lead.website ? <a key="w" href={lead.website} target="_blank" rel="noopener noreferrer nofollow" className="break-all text-secondary hover:underline">{lead.website}</a> : "—"],
    ["Service", lead.service ?? "—"],
    ["Budget", lead.budget ?? "—"],
    ["Source", lead.source.replace("_", " ")],
    ["Received", `${formatDate(lead.createdAt)} ${lead.createdAt.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit", timeZone: "Asia/Karachi" })} PKT`],
  ];
  return (
    <>
      <Link href="/admin/leads" className="mb-3 inline-flex items-center gap-1 font-label-md text-label-md text-secondary"><Icon name="arrow_back" size={16} /> All leads</Link>
      <AdminTitle title={lead.name} />
      <div className="grid gap-4 xl:grid-cols-3">
        <Card className="space-y-4 xl:col-span-2">
          <div className="flex items-center gap-2"><StatusBadge status={lead.status} /></div>
          <dl className="grid gap-x-6 gap-y-3 sm:grid-cols-2">
            {rows.map(([k, v]) => (
              <div key={k}>
                <dt className="font-label-md text-label-md text-on-surface-variant">{k}</dt>
                <dd className="font-body-md text-body-md text-on-surface">{v}</dd>
              </div>
            ))}
          </dl>
          {lead.message ? (
            <div>
              <h2 className="font-label-md text-label-md text-on-surface-variant">Message</h2>
              <p className="whitespace-pre-wrap rounded-lg bg-surface-container-low p-3 font-body-md text-body-md">{lead.message}</p>
            </div>
          ) : null}
          {lead.details ? (
            <details>
              <summary className="cursor-pointer font-label-md text-label-md text-secondary">Package / audit details</summary>
              <pre className="mt-2 overflow-x-auto rounded-lg bg-surface-container-low p-3 text-[12px]">{JSON.stringify(lead.details, null, 2)}</pre>
            </details>
          ) : null}
          {lead.auditRequests.map((a) => (
            <Link key={a.id} href={`/audit/report/${a.id}`} target="_blank" className="inline-flex items-center gap-1 font-label-md text-label-md text-secondary hover:underline">
              <Icon name="speed" size={16} /> View audit report ({a.score ?? "–"}/100)
            </Link>
          ))}
        </Card>
        <div className="space-y-4">
          <Card>
            <h2 className="mb-3 font-label-lg text-label-lg">Update lead</h2>
            <ActionForm action={updateLead.bind(null, lead.id)}>
              <SelectField name="status" label="Status" defaultValue={lead.status} options={["NEW", "CONTACTED", "QUALIFIED", "CONVERTED", "LOST"]} />
              <TextArea name="notes" label="Internal notes" defaultValue={lead.notes} rows={5} />
            </ActionForm>
          </Card>
          <Card>
            <form action={deleteLead.bind(null, lead.id)}>
              <ConfirmSubmit label="Delete lead" message="Delete this lead permanently?" />
            </form>
          </Card>
        </div>
      </div>
    </>
  );
}
