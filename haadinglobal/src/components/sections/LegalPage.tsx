import { PageHero } from "@/components/sections/shared";
import { JsonLd } from "@/components/seo/JsonLd";
import { Container } from "@/components/ui/Container";
import type { LegalDoc } from "@/content/legal";
import { breadcrumbSchema } from "@/lib/seo/schema";
import { formatDate } from "@/lib/utils";

export function LegalPage({ doc }: { doc: LegalDoc }) {
  return (
    <>
      <PageHero eyebrow={`Last updated ${formatDate(doc.updated)}`} title={doc.title} description={doc.description} />
      <Container className="max-w-3xl pb-space-xl">
        <div className="space-y-space-lg rounded-3xl bg-surface-container-lowest p-space-lg shadow-sm lg:p-space-xl">
          {doc.sections.map((s) => (
            <section key={s.heading} className="space-y-space-xs">
              <h2 className="font-headline-sm text-headline-sm font-bold text-on-surface">{s.heading}</h2>
              {s.body.map((p) => (
                <p key={p} className="font-body-md text-body-md text-on-surface-variant">{p}</p>
              ))}
            </section>
          ))}
        </div>
      </Container>
      <JsonLd data={breadcrumbSchema([{ name: "Home", path: "/" }, { name: doc.title, path: `/${doc.slug}` }])} />
    </>
  );
}
