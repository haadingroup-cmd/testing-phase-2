"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Menu, Search, X } from "lucide-react";
import { Logo } from "@/components/ui/Logo";
import { NAV, SITE } from "@/lib/site";

export function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setOpen(false);
    setSearchOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (searchOpen) inputRef.current?.focus();
  }, [searchOpen]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        setSearchOpen(false);
      }
      if (e.key === "/" && !(e.target instanceof HTMLInputElement) && !(e.target instanceof HTMLTextAreaElement)) {
        e.preventDefault();
        setSearchOpen(true);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const onSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const q = String(new FormData(e.currentTarget).get("q") ?? "").trim().slice(0, 80);
    if (q) router.push(`/search?q=${encodeURIComponent(q)}`);
  };

  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`);

  return (
    <header className="glass sticky top-0 z-50 border-b border-rule">
      <div className="hidden bg-surface-low md:block">
        <div className="container-site flex h-8 items-center justify-between text-caption text-slate-body">
          <span className="flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 animate-pulse2 rounded-full bg-brand" aria-hidden="true" />
            UK SME Software Index {SITE.year} • Independent reviews • Prices in £
          </span>
          <span>
            <strong className="font-semibold text-ink">Editorial independence:</strong> no paid rankings.{" "}
            <Link href="/methodology" className="underline hover:text-ink">Our standards</Link>
          </span>
        </div>
      </div>
      <div className="container-site flex h-16 items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <button
            type="button"
            className="-ml-2 flex h-11 w-11 items-center justify-center rounded text-ink hover:bg-surface-low lg:hidden"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
          <Link href="/" aria-label={`${SITE.name} home`} className="rounded">
            <Logo />
          </Link>
        </div>
        <nav aria-label="Main" className="hidden items-center gap-1 lg:flex">
          {NAV.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              aria-current={isActive(n.href) ? "page" : undefined}
              className={`rounded px-3 py-2 text-body-md font-medium transition-colors ${isActive(n.href) ? "text-brand" : "text-slate-body hover:bg-surface-low hover:text-ink"}`}
            >
              {n.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setSearchOpen((v) => !v)}
            className="flex h-11 w-11 items-center justify-center rounded text-slate-body hover:bg-surface-low hover:text-ink"
            aria-label="Search"
            aria-expanded={searchOpen}
          >
            <Search className="h-5 w-5" />
          </button>
          <Link href="/tools" className="btn-primary hidden sm:inline-flex">Explore AI tools</Link>
        </div>
      </div>
      {searchOpen && (
        <div className="border-t border-rule bg-surface-lowest">
          <form role="search" onSubmit={onSearch} className="container-site flex gap-2 py-3">
            <label htmlFor="site-search" className="sr-only">Search tools, guides and comparisons</label>
            <input
              ref={inputRef}
              id="site-search"
              name="q"
              type="search"
              maxLength={80}
              placeholder="Search tools, guides and comparisons… e.g. ‘MTD’ or ‘ChatGPT’"
              className="input"
            />
            <button type="submit" className="btn-dark">Search</button>
          </form>
        </div>
      )}
      {open && (
        <nav id="mobile-menu" aria-label="Mobile" className="border-t border-rule bg-surface-lowest lg:hidden">
          <ul className="container-site flex flex-col py-2">
            {[...NAV, { href: "/about", label: "About" }, { href: "/contact", label: "Contact" }].map((n) => (
              <li key={n.href}>
                <Link
                  href={n.href}
                  aria-current={isActive(n.href) ? "page" : undefined}
                  className={`block rounded px-2 py-3 text-body-lg font-medium ${isActive(n.href) ? "text-brand" : "text-ink"}`}
                >
                  {n.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  );
}
