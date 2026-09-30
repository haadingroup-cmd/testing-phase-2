import Link from "next/link";
import { SiteChrome } from "@/components/layout/SiteChrome";
import { Container } from "@/components/ui/Container";
import { Icon } from "@/components/ui/Icon";

export const metadata = { title: "Page not found", robots: { index: false } };

export default function NotFound() {
  return (
    <SiteChrome>
      <Container className="flex flex-col items-center py-24 text-center">
        <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-surface-container text-secondary">
          <Icon name="troubleshoot" size={28} />
        </span>
        <p className="mt-space-md font-label-eyebrow text-label-eyebrow uppercase tracking-widest text-secondary">Error 404</p>
        <h1 className="mt-space-xs font-headline-lg-mobile text-headline-lg-mobile font-extrabold md:text-headline-lg">This page doesn&apos;t exist</h1>
        <p className="mt-space-sm max-w-md text-on-surface-variant">The link may be outdated or mistyped. Try one of these instead:</p>
        <div className="mt-space-lg flex flex-wrap justify-center gap-space-sm">
          <Link href="/" className="flex items-center gap-1.5 rounded-xl bg-secondary px-space-lg py-3 font-label-lg text-label-lg text-on-secondary hover:bg-primary-container">
            <Icon name="home" size={18} /> Home
          </Link>
          <Link href="/services" className="rounded-xl bg-surface-container-lowest px-space-lg py-3 font-label-lg text-label-lg shadow-sm hover:bg-surface-container">
            Services
          </Link>
          <Link href="/contact" className="rounded-xl bg-surface-container-lowest px-space-lg py-3 font-label-lg text-label-lg shadow-sm hover:bg-surface-container">
            Contact
          </Link>
        </div>
      </Container>
    </SiteChrome>
  );
}
