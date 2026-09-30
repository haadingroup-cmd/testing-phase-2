import "server-only";
import { getDb } from "@/lib/db";
import { renderLeadEmail, sendNotification } from "@/lib/email";
import { absoluteUrl } from "@/lib/site";
import type { Prisma } from "@/generated/prisma/client";
import type { LeadSource } from "@/types";

export type NewLead = {
  name: string;
  phone: string;
  email?: string;
  business?: string;
  website?: string;
  service?: string;
  budget?: string;
  message?: string;
  source: LeadSource;
  details?: Prisma.InputJsonValue;
};

const SOURCE_LABEL: Record<LeadSource, string> = {
  CONTACT: "Contact form",
  CONSULTATION: "Free strategy audit (homepage)",
  PACKAGE_BUILDER: "Custom package builder",
  AUDIT: "Website audit tool",
};

/** Persist a lead, then (best-effort) email the team. Email failure never loses the lead. */
export async function createLead(lead: NewLead, extraRows: Array<[string, string]> = []) {
  const saved = await getDb().lead.create({
    data: {
      name: lead.name,
      phone: lead.phone,
      email: lead.email ?? null,
      business: lead.business ?? null,
      website: lead.website ?? null,
      service: lead.service ?? null,
      budget: lead.budget ?? null,
      message: lead.message ?? null,
      source: lead.source,
      details: lead.details,
    },
  });

  const { html, text } = renderLeadEmail(
    `New lead: ${lead.name}`,
    [
      ["Source", SOURCE_LABEL[lead.source]],
      ["Name", lead.name],
      ["Phone / WhatsApp", lead.phone],
      ["Email", lead.email],
      ["Business", lead.business],
      ["Website", lead.website],
      ["Service", lead.service],
      ["Budget", lead.budget],
      ...extraRows,
      ["Message", lead.message],
    ],
    absoluteUrl(`/admin/leads/${saved.id}`),
  );
  await sendNotification({ subject: `New lead — ${lead.name} (${SOURCE_LABEL[lead.source]})`, html, text, replyTo: lead.email });
  return saved;
}
