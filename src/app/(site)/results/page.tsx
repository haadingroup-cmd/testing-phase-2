import { AuditPromo } from "@/components/audit/AuditPromo";
import { CaseStudyList } from "@/components/results/CaseStudyList";
import { JsonLd } from "@/components/seo/JsonLd";
import { Container } from "@/components/ui/Container";
import { Icon } from "@/components/ui/Icon";
import { getCaseStudies } from "@/lib/data";
import { buildMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema } from "@/lib/seo/schema";

export const revalidate = 300;

export const metadata = buildMetadata({
  title: "Results & Case Studies",
  description:
    "Real results from HaadinGlobal campaigns and projects — Google Ads ROAS, SEO growth, TikTok reach, eCommerce sales and websites we've built for clients in Pakistan, the Gulf and beyond.",
  path: "/results",
});

export default async function ResultsPage() {
  const studies = await getCaseStudies();
  return (
    <>
      <Container as="section" className="pb-space-lg pt-space-md lg:pt-16">
        <div className="mb-space-xs flex items-center gap-space-xs">
          <span className="h-2 w-2 animate-pulse rounded-full bg-electric-blue" />
          <span className="font-label-eyebrow text-label-eyebrow uppercase tracking-widest text-secondary">Verified Portfolio &amp; Intelligence</span>
        </div>
        <h1 className="mb-space-xs font-headline-lg-mobile text-headline-lg-mobile font-extrabold tracking-tight text-on-surface md:text-headline-lg lg:text-display-hero">Proof Over Promises</h1>
        <p className="max-w-2xl font-body-md text-body-md text-on-surface-variant lg:text-body-lg">
          Real strategies. Real campaigns. Real business outcomes across domestic and international markets.
        </p>
        {studies.length ? (
          <CaseStudyList studies={studies} />
        ) : (
          <div className="mt-space-lg rounded-xl bg-surface-container-low p-space-xl text-center">
            <Icon name="inbox" size={32} className="text-outline" />
            <p className="mt-space-sm text-on-surface-variant">Case studies are being prepared. Ask us for examples relevant to your industry on WhatsApp.</p>
          </div>
        )}
      </Container>

      <Container as="section" className="mt-space-lg">
        <AuditPromo />
      </Container>

      <Container as="section" className="space-y-space-xs pt-space-lg text-center">
        <div className="inline-flex items-center justify-center gap-1.5 rounded-full bg-surface-container-high px-3 py-1 font-label-eyebrow text-label-eyebrow uppercase text-on-surface-variant">
          <Icon name="verified_user" size={16} className="text-secondary" /> Transparent Data Attribution
        </div>
        <p className="mx-auto max-w-lg font-body-sm text-body-sm text-on-surface-variant">
          Figures shown come from screenshots of client dashboards (Google Search Console, Google Analytics, Google Ads, TikTok Ads and store platforms). Client names are withheld where we don&apos;t have permission to share them.
        </p>
      </Container>
      <JsonLd data={breadcrumbSchema([{ name: "Home", path: "/" }, { name: "Results", path: "/results" }])} />
    </>
  );
}
