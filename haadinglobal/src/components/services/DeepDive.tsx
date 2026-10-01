import Image from "next/image";
import { Icon } from "@/components/ui/Icon";
import { formatPKR, priceUnitLabel } from "@/lib/utils";
import { whatsappLink } from "@/lib/whatsapp";
import type { ServiceData } from "@/types";

type DeepDiveData = {
  id: string;
  badge: string;
  title: string;
  intro: string;
  image: string | null;
  problem: string;
  solution: string;
  roadmapLabel: string;
  stats: ReadonlyArray<{ label: string; value: string }>;
  ctaIcon: string;
};

/** Code-editor visual used when a deep dive has no photo. */
function CodeVisual() {
  const lines = [
    ["text-[#c792ea]", "export default", "text-[#82aaff]", " async function Page() {"],
    ["text-[#89ddff]", "  const leads =", "text-[#c3e88d]", " await getLeads();"],
    ["text-[#89ddff]", "  return <Hero", "text-[#f4c96b]", " fast mobileFirst />;"],
    ["text-[#82aaff]", "}", "text-white", ""],
  ];
  return (
    <div className="flex h-full w-full flex-col justify-center gap-1.5 bg-gradient-to-br from-primary-container to-[#0f2d5c] p-space-md font-mono text-[12px]" aria-hidden="true">
      <div className="mb-1 flex gap-1.5">
        <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
      </div>
      {lines.map(([c1, t1, c2, t2]) => (
        <p key={t1} className="truncate">
          <span className={c1}>{t1}</span>
          <span className={c2}>{t2}</span>
        </p>
      ))}
    </div>
  );
}

export function DeepDive({ dive, service, whatsapp }: { dive: DeepDiveData; service: ServiceData; whatsapp: string }) {
  return (
    <div id={dive.id} className="scroll-mt-24 space-y-space-md rounded-xl bg-surface-container-lowest p-space-md shadow-sm lg:p-space-lg">
      <div className="relative h-40 overflow-hidden rounded-lg lg:h-52">
        {dive.image ? (
          <Image src={dive.image} alt={dive.title} fill sizes="(min-width: 1024px) 600px, 100vw" className="object-cover" />
        ) : (
          <CodeVisual />
        )}
        <div className="absolute inset-0 flex items-end bg-gradient-to-t from-primary-container/80 via-transparent to-transparent p-space-sm">
          <span className="rounded-full bg-surface-container-lowest/90 px-2.5 py-1 font-label-eyebrow text-label-eyebrow font-bold uppercase text-primary backdrop-blur">{dive.badge}</span>
        </div>
      </div>
      <div className="space-y-space-xs">
        <h3 className="font-headline-sm text-headline-sm text-on-surface">{dive.title}</h3>
        <p className="font-body-sm text-body-sm text-on-surface-variant">{dive.intro}</p>
      </div>
      <div className="grid grid-cols-2 gap-space-xs">
        <div className="space-y-1 rounded-lg bg-surface-container-low p-space-sm">
          <div className="flex items-center gap-1 text-error">
            <Icon name="report_problem" size={18} />
            <span className="font-label-md text-label-md font-bold">The Problem</span>
          </div>
          <p className="font-body-sm text-body-sm text-on-surface-variant">{dive.problem}</p>
        </div>
        <div className="space-y-1 rounded-lg bg-surface-container-high p-space-sm">
          <div className="flex items-center gap-1 text-secondary">
            <Icon name="check_circle" size={18} />
            <span className="font-label-md text-label-md font-bold">The Solution</span>
          </div>
          <p className="font-body-sm text-body-sm text-on-surface-variant">{dive.solution}</p>
        </div>
      </div>
      <div className="space-y-space-xs">
        <span className="font-label-eyebrow text-label-eyebrow uppercase text-secondary">{dive.roadmapLabel}</span>
        <ol className="space-y-space-xs">
          {service.process.slice(0, 4).map((step, i) => (
            <li key={step.title} className="flex items-start gap-space-sm rounded bg-surface p-space-xs">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-secondary font-label-md text-label-md text-on-secondary">{i + 1}</span>
              <div>
                <h4 className="font-label-lg text-label-lg text-on-surface">{step.title}</h4>
                <p className="font-body-sm text-body-sm text-on-surface-variant">{step.description}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
      <div className="flex items-center justify-between rounded-lg bg-surface-container p-space-sm">
        {dive.stats.map((stat, i) => (
          <div key={stat.label} className={i === 1 ? "text-right" : undefined}>
            <span className="font-label-eyebrow text-label-eyebrow uppercase text-on-surface-variant">{stat.label}</span>
            <span className={`block font-headline-sm text-headline-sm font-bold ${i === 1 ? "text-secondary" : "text-on-surface"}`}>{stat.value}</span>
          </div>
        ))}
      </div>
      <a
        href={whatsappLink(service.whatsappMessage ?? `Hi HaadinGlobal, I'm interested in ${service.title}.`, whatsapp)}
        target="_blank"
        rel="noopener noreferrer"
        className="flex w-full items-center justify-center gap-2 rounded-lg bg-secondary px-4 py-3 font-label-lg text-label-lg text-on-secondary shadow-sm transition-colors hover:bg-primary-container"
      >
        <Icon name={dive.ctaIcon} size={20} />
        <span>
          Start {service.title} ({formatPKR(service.price)} {priceUnitLabel(service.priceUnit)})
        </span>
      </a>
    </div>
  );
}
