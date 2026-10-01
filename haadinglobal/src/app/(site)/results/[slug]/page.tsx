import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ConsultationSection } from "@/components/sections/shared";
import { JsonLd } from "@/components/seo/JsonLd";
import { Container } from "@/components/ui/Container";
import { Icon } from "@/components/ui/Icon";
import { getCaseStudies, getCaseStudy, getSettings } from "@/lib/data";
import { buildMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema } from "@/lib/seo/schema";

export const revalidate = 300;

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return (await getCaseStudies()).map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const study = await getCaseStudy(slug);
  if (!study) return { title: "Case study not found", robots: { index: false } };
  return buildMetadata({
    title: `${study.title} — Case Study`,
    description: `${study.service} for ${study.client} (${study.country}). ${study.result}`.slice(0, 160),
    path: `/results/${study.slug}`,
    image: study.coverImage,
  });
}

export default async function CaseStudyPage({ params }: Props) {
  const { slug } = await params;
  const [study, settings] = await Promise.all([getCaseStudy(slug), getSettings()]);
  if (!study) notFound();

  return (
    <>
      <Container as="section" className="space-y-space-md pb-space-lg pt-space-md lg:pt-12">
        <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-1 font-label-md text-label-md text-on-surface-variant">
          <Link href="/" className="hover:text-secondary">Home</Link>
          <Icon name="chevron_right" size={14} />
          <Link href="/results" className="hover:text-secondary">Results</Link>
          <Icon name="chevron_right" size={14} />
          <span className="text-on-surface" aria-current="page">{study.client}</span>
        </nav>
        <div className="flex flex-wrap gap-2">
          <span className="rounded-full bg-surface-container-high px-3 py-1 font-label-md text-label-md text-secondary">{study.service}</span>
          <span className="rounded-full bg-surface-container px-3 py-1 font-label-md text-label-md text-on-surface">{study.industry}</span>
          <span className="rounded-full bg-surface-container px-3 py-1 font-label-md text-label-md text-on-surface">{study.country}</span>
          {study.isPlaceholder ? <span className="rounded-full bg-tertiary-fixed px-3 py-1 font-label-md text-label-md text-on-tertiary-fixed-variant">Placeholder content</span> : null}
        </div>
        <h1 className="max-w-3xl font-headline-lg-mobile text-headline-lg-mobile font-extrabold tracking-tight text-on-surface md:text-headline-lg">{study.title}</h1>
        <p className="font-body-md text-body-md text-on-surface-variant">
          Client: <strong className="text-on-surface">{study.client}</strong>
          {study.liveUrl ? (
            <>
              {" · "}
              <a href={study.liveUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 font-semibold text-secondary hover:underline">
                View live site <Icon name="open_in_new" size={14} />
              </a>
            </>
          ) : null}
        </p>

        {study.headlineValue || study.metrics.length ? (
          <div className="grid grid-cols-2 gap-space-sm md:grid-cols-4">
            {study.headlineValue ? (
              <div className="col-span-2 rounded-2xl bg-primary-container p-space-md text-on-primary shadow-md md:col-span-1">
                <span className="font-label-eyebrow text-label-eyebrow uppercase text-accent-gold-light">{study.headlineLabel}</span>
                <span className="block font-headline-lg-mobile text-headline-lg-mobile font-bold">{study.headlineValue}</span>
              </div>
            ) : null}
            {study.metrics.map((m) => (
              <div key={m.label} className="rounded-2xl bg-surface-container-lowest p-space-md shadow-sm">
                <span className="block font-headline-sm text-headline-sm font-bold text-on-surface">{m.value}</span>
                <span className="font-label-md text-label-md text-on-surface-variant">{m.label}</span>
              </div>
            ))}
          </div>
        ) : null}
      </Container>

      <Container as="section" className="grid gap-space-md py-space-md md:grid-cols-3">
        {[
          { icon: "warning", tone: "bg-error-container text-error", title: "The Problem", body: study.problem },
          { icon: "lightbulb", tone: "bg-surface-container-highest text-secondary", title: "The Strategy", body: study.strategy },
          { icon: "task_alt", tone: "bg-whatsapp/15 text-[#128c4a]", title: "The Result", body: study.result },
        ].map((b) => (
          <div key={b.title} className="space-y-space-xs rounded-2xl bg-surface-container-lowest p-space-md shadow-sm">
            <span className={`flex h-9 w-9 items-center justify-center rounded-full ${b.tone}`}>
              <Icon name={b.icon} size={20} />
            </span>
            <h2 className="font-headline-sm text-headline-sm font-bold text-on-surface">{b.title}</h2>
            <p className="font-body-md text-body-md text-on-surface-variant">{b.body}</p>
          </div>
        ))}
      </Container>

      {study.beforeAfter ? (
        <Container as="section" className="py-space-md">
          <div className="grid overflow-hidden rounded-2xl shadow-sm md:grid-cols-2">
            <div className="space-y-1 bg-surface-container-low p-space-lg">
              <span className="font-label-eyebrow text-label-eyebrow uppercase text-on-surface-variant">Before</span>
              <p className="font-body-md text-body-md text-on-surface">{study.beforeAfter.before}</p>
            </div>
            <div className="space-y-1 bg-primary-container p-space-lg text-on-primary">
              <span className="font-label-eyebrow text-label-eyebrow uppercase text-accent-gold-light">After</span>
              <p className="font-body-md text-body-md">{study.beforeAfter.after}</p>
            </div>
          </div>
        </Container>
      ) : null}

      {study.gallery.length ? (
        <Container as="section" className="space-y-space-md py-space-lg">
          <h2 className="font-headline-md text-headline-md font-bold text-on-surface">Proof gallery</h2>
          <div className="grid gap-space-md md:grid-cols-2">
            {study.gallery.map((img) => (
              <figure key={img.src} className="overflow-hidden rounded-2xl bg-surface-container-lowest shadow-sm">
                {img.src.startsWith("/") ? (
                  <Image src={img.src} alt={img.caption} width={820} height={500} sizes="(min-width: 768px) 50vw, 100vw" className="h-auto w-full" />
                ) : (
                  // eslint-disable-next-line @next/next/no-img-element -- remote admin-provided image, not optimised on purpose
                  <img src={img.src} alt={img.caption} loading="lazy" className="h-auto w-full" />
                )}
                <figcaption className="p-space-sm font-body-sm text-body-sm text-on-surface-variant">{img.caption}</figcaption>
              </figure>
            ))}
          </div>
        </Container>
      ) : null}

      <ConsultationSection settings={settings} />
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Results", path: "/results" },
          { name: study.title, path: `/results/${study.slug}` },
        ])}
      />
    </>
  );
}
