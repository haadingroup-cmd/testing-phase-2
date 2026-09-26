import Link from "next/link";
import { Logo } from "@/components/ui/Logo";
import { NewsletterForm } from "@/components/forms/NewsletterForm";
import { CATEGORIES } from "@/data/categories";
import { SITE } from "@/lib/site";

const cols = [
  {
    title: "Directory",
    links: CATEGORIES.slice(0, 7).map((c) => ({ href: `/categories/${c.slug}`, label: c.short })),
  },
  {
    title: "Popular",
    links: [
      { href: "/guides/best-ai-tools-for-uk-small-businesses", label: "Best AI tools UK" },
      { href: "/compare/chatgpt-vs-claude", label: "ChatGPT vs Claude" },
      { href: "/guides/ai-model-comparison", label: "AI model comparison" },
      { href: "/guides/making-tax-digital-ai-accounting-software", label: "MTD software 2026" },
      { href: "/guides/best-ai-presentation-makers", label: "AI presentation makers" },
      { href: "/guides/is-deepseek-safe-for-uk-businesses", label: "Is DeepSeek safe?" },
    ],
  },
  {
    title: "Governance",
    links: [
      { href: "/about", label: "About us" },
      { href: "/methodology", label: "How we test" },
      { href: "/affiliate-disclosure", label: "Affiliate disclosure" },
      { href: "/privacy-policy", label: "UK GDPR & privacy" },
      { href: "/terms", label: "Terms of use" },
      { href: "/contact", label: "Contact & corrections" },
      { href: "/submit-tool", label: "Submit a tool" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="mt-16 border-t border-rule bg-surface-low pb-24 md:pb-0">
      <div className="container-site grid gap-10 py-12 lg:grid-cols-[1.2fr_2fr]">
        <div className="flex flex-col gap-5">
          <Link href="/" aria-label={`${SITE.name} home`} className="w-fit">
            <Logo />
          </Link>
          <p className="max-w-sm text-body-md text-slate-body">
            Independent reviews and guides to the AI tools and business software that help UK small businesses save time — with
            sterling pricing, UK GDPR notes and Making Tax Digital checks.
          </p>
          <div className="card p-5">
            <p className="text-label uppercase tracking-wider text-ink">The Thursday Briefing</p>
            <p className="mt-1 text-body-sm text-slate-body">Three tested AI tools, one workflow template and UK regulatory updates — weekly.</p>
            <div className="mt-3">
              <NewsletterForm source="footer" variant="compact" />
            </div>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
          {cols.map((c) => (
            <nav key={c.title} aria-label={c.title}>
              <p className="text-label uppercase text-ink">{c.title}</p>
              <ul className="mt-3 flex flex-col gap-2 text-body-md">
                {c.links.map((l) => (
                  <li key={l.href}>
                    <Link href={l.href} className="text-slate-body hover:text-ink hover:underline">{l.label}</Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>
      </div>
      <div className="border-t border-rule">
        <div className="container-site flex flex-col gap-2 py-6 text-caption text-slate-mute md:flex-row md:items-center md:justify-between">
          <p>
            © {new Date().getFullYear()} {SITE.legalName || SITE.name}.
            {SITE.companyNumber ? ` Registered in England & Wales, company no. ${SITE.companyNumber}.` : ""} All rights reserved.
          </p>
          <p>Prices shown are indicative and may exclude VAT — always confirm on the vendor&apos;s website.</p>
        </div>
      </div>
    </footer>
  );
}
