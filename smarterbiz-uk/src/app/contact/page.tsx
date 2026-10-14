import { ContactForm } from "@/components/forms/ContactForm";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { pageMetadata } from "@/lib/seo";
import { SITE } from "@/lib/site";

export const metadata = pageMetadata({
  title: "Contact & Corrections",
  description: "Contact the SmarterBiz.uk editorial team, report a correction or ask about partnerships.",
  path: "/contact",
});

export default function ContactPage() {
  return (
    <div className="container-read py-8">
      <Breadcrumbs items={[{ name: "Contact", path: "/contact" }]} />
      <h1 className="mt-4 font-serif text-headline-xl-mobile text-ink md:text-headline-xl">Contact us</h1>
      <p className="mt-3 font-serif text-body-lead text-slate-body">
        Questions, tip-offs or corrections — we read everything. Prefer email? Write to{" "}
        <a href={`mailto:${SITE.editorialEmail}`} className="text-brand underline">{SITE.editorialEmail}</a>.
      </p>
      <div className="mt-8"><ContactForm /></div>
    </div>
  );
}
