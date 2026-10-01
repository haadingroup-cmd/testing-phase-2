import { LegalPage } from "@/components/sections/LegalPage";
import { LEGAL_DOCS } from "@/content/legal";
import { buildMetadata } from "@/lib/seo/metadata";

const doc = LEGAL_DOCS.terms;

export const metadata = buildMetadata({ title: doc.title, description: doc.description, path: `/${doc.slug}` });

export default function Page() {
  return <LegalPage doc={doc} />;
}
