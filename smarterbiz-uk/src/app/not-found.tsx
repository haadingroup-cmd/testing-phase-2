import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Page not found", robots: { index: false, follow: true } };

export default function NotFound() {
  return (
    <div className="container-read py-20 text-center">
      <p className="kicker">404</p>
      <h1 className="mt-2 font-serif text-headline-xl-mobile text-ink md:text-headline-xl">We couldn&apos;t find that page</h1>
      <p className="mt-3 text-body-lg text-slate-body">It may have moved. Try the directory, our guides or search.</p>
      <div className="mt-6 flex flex-wrap justify-center gap-3">
        <Link href="/tools" className="btn-primary">AI tools directory</Link>
        <Link href="/guides" className="btn-secondary">Guides</Link>
        <Link href="/search" className="btn-ghost">Search</Link>
      </div>
    </div>
  );
}
