"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { Icon } from "@/components/ui/Icon";
import { Logo, LogoMark } from "@/components/ui/Logo";
import { DRAWER_CORE, DRAWER_LEADERSHIP, PRIMARY_NAV, sectionTitle } from "@/content/navigation";
import { cn } from "@/lib/utils";

export type HeaderService = { slug: string; title: string; icon: string; tagline: string };

type Props = { services: HeaderService[]; founderImage: string; founderName: string };

function isActive(pathname: string, href: string) {
  const path = href.split("#")[0];
  return path === "/" ? pathname === "/" : pathname === path || pathname.startsWith(`${path}/`);
}

export function SiteHeader({ services, founderImage, founderName }: Props) {
  const pathname = usePathname() ?? "/";
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [mobileServicesOpen, setMobileServicesOpen] = useState(true);
  const [scrolled, setScrolled] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const drawerRef = useRef<HTMLElement>(null);
  const openerRef = useRef<HTMLButtonElement>(null);

  const closeDrawer = useCallback(() => {
    setDrawerOpen(false);
    openerRef.current?.focus();
  }, []);

  // Close menus when the route changes (adjusting state during render, per React docs).
  const [lastPath, setLastPath] = useState(pathname);
  if (lastPath !== pathname) {
    setLastPath(pathname);
    setDrawerOpen(false);
    setServicesOpen(false);
  }

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Drawer: lock scroll, focus first link, close on Escape.
  useEffect(() => {
    if (!drawerOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    drawerRef.current?.querySelector<HTMLElement>("a,button")?.focus();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && closeDrawer();
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
    };
  }, [drawerOpen, closeDrawer]);

  // Desktop dropdown: close on outside click / Escape.
  useEffect(() => {
    if (!servicesOpen) return;
    const onClick = (e: MouseEvent) => {
      if (!dropdownRef.current?.contains(e.target as Node)) setServicesOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setServicesOpen(false);
    document.addEventListener("mousedown", onClick);
    window.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      window.removeEventListener("keydown", onKey);
    };
  }, [servicesOpen]);

  return (
    <>
      <header
        className={cn(
          "pt-safe fixed inset-x-0 top-0 z-40 bg-surface-container-lowest/85 backdrop-blur-xl transition-shadow",
          scrolled ? "shadow-[0_1px_12px_rgba(7,26,53,0.08)]" : "shadow-[0_1px_8px_rgba(0,0,0,0.04)]",
        )}
      >
        {/* Mobile / tablet bar (Stitch mobile shell) */}
        <div className="flex h-16 items-center justify-between gap-space-sm px-gutter-mobile md:px-8 lg:hidden">
          <div className="flex min-w-0 items-center gap-space-sm">
            <button
              ref={openerRef}
              type="button"
              onClick={() => setDrawerOpen(true)}
              aria-label="Open menu"
              aria-expanded={drawerOpen}
              aria-controls="site-drawer"
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg text-on-surface transition-colors hover:bg-surface-container"
            >
              <Icon name="menu" size={24} />
            </button>
            <Link href="/" className="flex min-w-0 items-center gap-space-xs" aria-label="HaadinGlobal home">
              <LogoMark className="h-8 w-8" />
              <span className="flex min-w-0 flex-col">
                <span className="truncate font-headline-sm text-headline-sm font-bold tracking-tight text-on-surface">{sectionTitle(pathname)}</span>
                <span className="truncate font-label-eyebrow text-label-eyebrow uppercase text-secondary">HaadinGlobal</span>
              </span>
            </Link>
          </div>
          <div className="flex shrink-0 items-center gap-space-xs">
            <Link
              href="/audit"
              className="hidden items-center gap-1 rounded-lg bg-secondary px-3 py-1.5 font-label-md text-label-md text-on-secondary transition-colors hover:bg-primary-container sm:flex"
            >
              <Icon name="bolt" size={16} />
              Audit
            </Link>
            <Link href="/about" className="flex h-11 w-11 items-center justify-center rounded-full transition-colors hover:bg-surface-container" aria-label={`About ${founderName}`}>
              <Image src={founderImage} alt="" width={32} height={32} className="h-8 w-8 rounded-full object-cover" />
            </Link>
          </div>
        </div>

        {/* Desktop bar */}
        <div className="mx-auto hidden h-[72px] max-w-7xl items-center justify-between gap-6 px-margin lg:flex">
          <Link href="/" aria-label="HaadinGlobal home">
            <Logo eyebrow="Digital Growth & AI" />
          </Link>
          <nav aria-label="Main" className="flex items-center gap-1">
            {PRIMARY_NAV.map((item) =>
              item.href === "/services" ? (
                <div key={item.href} ref={dropdownRef} className="relative">
                  <button
                    type="button"
                    aria-expanded={servicesOpen}
                    aria-controls="services-menu"
                    onClick={() => setServicesOpen((v) => !v)}
                    className={cn(
                      "flex items-center gap-1 rounded-lg px-3 py-2 font-label-lg text-label-lg transition-colors hover:bg-surface-container",
                      isActive(pathname, "/services") ? "text-secondary" : "text-on-surface",
                    )}
                  >
                    Services
                    <Icon name="expand_more" size={18} className={cn("transition-transform", servicesOpen && "rotate-180")} />
                  </button>
                  {servicesOpen ? (
                    <div
                      id="services-menu"
                      className="absolute left-1/2 top-full mt-2 w-[640px] -translate-x-1/2 rounded-2xl border border-[rgba(148,163,184,0.18)] bg-surface-container-lowest p-space-md shadow-level-3"
                    >
                      <div className="grid grid-cols-2 gap-1">
                        {services.map((s) => (
                          <Link
                            key={s.slug}
                            href={`/services/${s.slug}`}
                            className="group flex items-start gap-space-sm rounded-xl p-space-sm transition-colors hover:bg-surface-container-low"
                          >
                            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-surface-container text-secondary">
                              <Icon name={s.icon} size={20} />
                            </span>
                            <span className="min-w-0">
                              <span className="block font-label-lg text-label-lg text-on-surface group-hover:text-secondary">{s.title}</span>
                              <span className="block truncate font-body-sm text-body-sm text-on-surface-variant">{s.tagline}</span>
                            </span>
                          </Link>
                        ))}
                      </div>
                      <div className="mt-space-sm flex items-center justify-between rounded-xl bg-surface-container-low p-space-sm">
                        <span className="font-body-sm text-body-sm text-on-surface-variant">Need a mix? Build a custom package in real time.</span>
                        <Link href="/pricing#package-builder" className="flex items-center gap-1 font-label-md text-label-md text-secondary hover:underline">
                          Package builder <Icon name="arrow_forward" size={16} />
                        </Link>
                      </div>
                    </div>
                  ) : null}
                </div>
              ) : (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={isActive(pathname, item.href) ? "page" : undefined}
                  className={cn(
                    "rounded-lg px-3 py-2 font-label-lg text-label-lg transition-colors hover:bg-surface-container",
                    isActive(pathname, item.href) ? "text-secondary" : "text-on-surface",
                  )}
                >
                  {item.label}
                </Link>
              ),
            )}
          </nav>
          <div className="flex items-center gap-2">
            <Link
              href="/audit"
              className="flex items-center gap-1.5 rounded-lg border border-[rgba(148,163,184,0.3)] bg-surface-container-lowest px-4 py-2.5 font-label-lg text-label-lg text-primary-container transition-colors hover:border-secondary"
            >
              <Icon name="bolt" size={18} className="text-secondary" />
              Free Audit
            </Link>
            <Link
              href="/contact"
              className="flex items-center gap-1.5 rounded-lg bg-secondary px-4 py-2.5 font-label-lg text-label-lg text-on-secondary transition-all hover:bg-primary-container hover:shadow-[0_4px_14px_rgba(20,85,217,0.35)] active:scale-[0.98]"
            >
              Book Consultation
              <Icon name="arrow_forward" size={18} />
            </Link>
          </div>
        </div>
      </header>

      {/* Mobile drawer */}
      <div
        className={cn(
          "fixed inset-0 z-50 bg-primary-container/60 backdrop-blur-md transition-opacity duration-300 lg:hidden",
          drawerOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0",
        )}
        onClick={closeDrawer}
        aria-hidden="true"
      />
      <aside
        id="site-drawer"
        ref={drawerRef}
        role="dialog"
        aria-modal="true"
        aria-label="Site menu"
        inert={!drawerOpen}
        className={cn(
          "pt-safe pb-safe fixed bottom-0 left-0 top-0 z-50 flex w-5/6 max-w-sm flex-col overflow-hidden bg-surface-container-lowest shadow-level-3 transition-transform duration-300 ease-out lg:hidden",
          drawerOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex items-center justify-between px-margin-mobile py-space-md">
          <Logo />
          <button
            type="button"
            onClick={closeDrawer}
            aria-label="Close menu"
            className="flex h-11 w-11 items-center justify-center rounded-full text-on-surface hover:bg-surface-container"
          >
            <Icon name="close" size={24} />
          </button>
        </div>
        <div className="flex-1 space-y-space-md overflow-y-auto px-margin-mobile py-space-sm">
          <DrawerGroup title="Core Architecture">
            {DRAWER_CORE.map((item) => (
              <DrawerLink key={item.href} {...item} active={isActive(pathname, item.href)} />
            ))}
          </DrawerGroup>
          <div className="space-y-space-xs">
            <button
              type="button"
              onClick={() => setMobileServicesOpen((v) => !v)}
              aria-expanded={mobileServicesOpen}
              className="flex w-full items-center justify-between px-space-xs font-label-eyebrow text-label-eyebrow uppercase tracking-wider text-on-surface-variant"
            >
              Global Capabilities
              <Icon name="expand_more" size={18} className={cn("transition-transform", mobileServicesOpen && "rotate-180")} />
            </button>
            {mobileServicesOpen ? (
              <div className="space-y-0.5 rounded-xl bg-surface-container-low p-space-xs">
                {services.map((s) => (
                  <Link
                    key={s.slug}
                    href={`/services/${s.slug}`}
                    className="flex items-center gap-space-sm rounded px-space-sm py-2 font-body-sm text-body-sm text-on-surface hover:bg-surface-container"
                  >
                    <Icon name={s.icon} size={18} className="text-secondary" />
                    {s.title}
                  </Link>
                ))}
                <Link href="/services" className="flex items-center gap-space-sm rounded px-space-sm py-2 font-label-md text-label-md text-secondary hover:bg-surface-container">
                  <Icon name="east" size={18} />
                  All services
                </Link>
              </div>
            ) : null}
          </div>
          <DrawerGroup title="Leadership & Contact">
            {DRAWER_LEADERSHIP.map((item) => (
              <DrawerLink key={item.href} {...item} iconClass="text-secondary" active={isActive(pathname, item.href)} />
            ))}
          </DrawerGroup>
        </div>
        <div className="bg-surface-container-low p-margin-mobile">
          <Link
            href="/contact"
            className="flex w-full items-center justify-center gap-space-xs rounded-lg bg-secondary px-space-md py-space-sm font-label-lg text-label-lg text-on-secondary shadow-md transition-all hover:bg-primary-container"
          >
            <Icon name="calendar_month" size={18} />
            Book Strategy Session
          </Link>
        </div>
      </aside>
    </>
  );
}

function DrawerGroup({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="space-y-space-xs">
      <span className="px-space-xs font-label-eyebrow text-label-eyebrow uppercase tracking-wider text-on-surface-variant">{title}</span>
      {children}
    </div>
  );
}

function DrawerLink({ label, href, icon, iconClass, active }: { label: string; href: string; icon: string; iconClass?: string; active: boolean }) {
  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      className={cn(
        "flex items-center justify-between rounded-lg px-space-sm py-space-sm font-label-lg text-label-lg text-on-surface transition-colors hover:bg-surface-container",
        active && "bg-surface-container-low",
      )}
    >
      <span className="flex items-center gap-space-sm">
        <Icon name={icon} size={20} className={iconClass} />
        {label}
      </span>
      <Icon name="chevron_right" size={16} className="text-outline" />
    </Link>
  );
}
