"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Menu, X, ChevronDown, Globe, Check, Phone } from "lucide-react";
import { SITE, NAV_SERVICES } from "@/data/siteConfig";
import { useLanguage } from "@/components/providers/LanguageProvider";
import { LANGS, Lang } from "@/data/translations";
import ThemeToggle from "@/components/common/ThemeToggle";

function LangSwitcher() {
  const { lang, setLang } = useLanguage();
  const [open, setOpen] = useState(false);
  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        onBlur={() => setTimeout(() => setOpen(false), 150)}
        className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-white/5 border border-white/10 hover:border-red-500/30 hover:bg-white/8 transition-all text-white text-sm font-semibold"
      >
        <Globe size={14} className="text-red-400" />
        <span className="text-base">{LANGS[lang].flag}</span>
        <span className="hidden sm:inline text-sm">{LANGS[lang].native}</span>
        <ChevronDown size={12} className={`transition-transform text-slate-400 ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <div className="absolute right-0 top-full mt-2 w-36 rounded-xl bg-[#0d0d14] border border-white/10 shadow-2xl overflow-hidden z-[60]">
          {(Object.entries(LANGS) as [Lang, typeof LANGS[Lang]][]).map(([code, info]) => (
            <button
              key={code}
              onMouseDown={e => { e.preventDefault(); setLang(code); setOpen(false); }}
              className={`w-full flex items-center justify-between gap-2 px-4 py-3 text-sm font-medium transition-colors ${lang === code ? "bg-red-500/10 text-red-300" : "text-white hover:bg-white/5"}`}
            >
              <span className="flex items-center gap-2">
                <span className="text-lg">{info.flag}</span>
                <span>{info.native}</span>
              </span>
              {lang === code && <Check size={13} className="text-red-400" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default function Navbar() {
  const { t } = useLanguage();
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);
  useEffect(() => { setMobileOpen(false); setServicesOpen(false); }, [pathname]);

  const navLinks = [
    { href: "/",           label: t("nav_home") },
    { href: "/services",   label: t("nav_services"), dropdown: true },
    { href: "/portfolio",  label: t("nav_portfolio") },
    { href: "/team",       label: "Team" },
    { href: "/pricing",    label: t("nav_pricing") },
    { href: "/about",      label: t("nav_about") },
    { href: "/blog",       label: t("nav_blog") },
    { href: "/contact",    label: t("nav_contact") },
  ];

  return (
    <>
      <nav className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${scrolled ? "bg-[#020205]/95 backdrop-blur-xl border-b border-white/8 shadow-[0_4px_24px_rgba(0,0,0,0.5)]" : "bg-transparent"}`}>
        <div className="container flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 flex-shrink-0 group">
            <div className="relative w-9 h-9 lg:w-11 lg:h-11">
              <Image src="/logo-small.png" alt="HaadinGlobal" fill className="rounded-full object-cover drop-shadow-lg group-hover:scale-105 transition-transform" />
            </div>
            <div className="leading-tight">
              <p className="text-white font-black text-base lg:text-lg tracking-tight">HaadinGlobal</p>
              <p className="text-red-400 text-[12px] font-mono tracking-[0.15em] uppercase">Digital Agency</p>
            </div>
          </Link>

          {/* Desktop nav */}
          <div className="hidden lg:flex items-center gap-0.5">
            {navLinks.map(item => (
              <div
                key={item.href}
                className="relative"
                onMouseEnter={() => item.dropdown && setServicesOpen(true)}
                onMouseLeave={() => item.dropdown && setServicesOpen(false)}
              >
                <Link
                  href={item.href}
                  className={`flex items-center gap-1 px-3 py-2 rounded-lg text-base font-bold tracking-wide transition-colors ${pathname === item.href ? "text-red-400" : "text-slate-300 hover:text-white"}`}
                >
                  {item.label}
                  {item.dropdown && (
                    <ChevronDown size={12} className={`transition-transform text-slate-500 ${servicesOpen ? "rotate-180" : ""}`} />
                  )}
                </Link>

                {/* Services mega-menu */}
                {item.dropdown && servicesOpen && (
                  <div className="absolute top-full left-1/2 -translate-x-1/2 mt-1 w-[640px] rounded-2xl bg-[#0d0d14] border border-white/10 shadow-2xl p-4 z-50">
                    <div className="grid grid-cols-3 gap-1">
                      {NAV_SERVICES.map(s => (
                        <Link
                          key={s.href}
                          href={s.href}
                          className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 transition-colors group"
                        >
                          <span className="text-xl">{s.icon}</span>
                          <span className="text-slate-300 text-sm font-medium group-hover:text-white transition-colors">{s.label}</span>
                        </Link>
                      ))}
                    </div>
                    <div className="mt-3 pt-3 border-t border-white/8 flex justify-between items-center">
                      <p className="text-slate-500 text-xs">12 premium services</p>
                      <Link href="/services" className="text-red-400 text-xs font-bold hover:text-red-300">View All →</Link>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Right actions */}
          <div className="hidden lg:flex items-center gap-3">
            <ThemeToggle />
            <LangSwitcher />
            <Link href="/consultation" className="btn-primary text-sm py-2.5 px-5">
              {t("nav_cta")}
            </Link>
          </div>

          {/* Mobile toggle */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="lg:hidden w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-white"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 lg:hidden pt-16 bg-[#020205]/98 backdrop-blur-2xl overflow-y-auto">
          <div className="container py-6 space-y-1">
            {navLinks.map(item => (
              <Link
                key={item.href}
                href={item.href}
                className={`block px-4 py-3 rounded-xl font-semibold text-base transition-colors ${pathname === item.href ? "bg-red-500/10 text-red-300 border border-red-500/20" : "text-slate-200 hover:bg-white/5"}`}
              >
                {item.label}
              </Link>
            ))}
            <div className="pt-4 pb-2 flex items-center gap-3">
              <LangSwitcher />
              <ThemeToggle />
            </div>
            <div className="border-t border-white/8 pt-4">
              <p className="text-[10px] text-slate-500 uppercase tracking-widest mb-3 px-4">All Services</p>
              <div className="grid grid-cols-2 gap-1">
                {NAV_SERVICES.map(s => (
                  <Link key={s.href} href={s.href} className="flex items-center gap-2 p-3 rounded-xl hover:bg-white/5">
                    <span className="text-lg">{s.icon}</span>
                    <span className="text-slate-300 text-xs font-medium">{s.label}</span>
                  </Link>
                ))}
              </div>
            </div>
            <div className="pt-4 space-y-3">
              <Link href="/consultation" className="btn-primary w-full justify-center">{t("nav_cta")}</Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
