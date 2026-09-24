import { SubmitToolForm } from "@/components/forms/SubmitToolForm";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Submit an AI Tool for Review",
  description: "Built an AI tool for UK small businesses? Submit it for independent editorial review by SmarterBiz.uk.",
  path: "/submit-tool",
});

export default function SubmitToolPage() {
  return (
    <div className="container-read py-8">
      <Breadcrumbs items={[{ name: "Submit a tool", path: "/submit-tool" }]} />
      <h1 className="mt-4 font-serif text-headline-xl-mobile text-ink md:text-headline-xl">Submit a tool for review</h1>
      <p className="mt-3 font-serif text-body-lead text-slate-body">
        We review tools that genuinely help UK small businesses. Submission is free and does not guarantee a listing — and payment can never
        buy a score.
      </p>
      <div className="mt-8"><SubmitToolForm /></div>
    </div>
  );
}
