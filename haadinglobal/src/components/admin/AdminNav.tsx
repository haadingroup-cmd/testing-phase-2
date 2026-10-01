"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Icon } from "@/components/ui/Icon";
import { cn } from "@/lib/utils";

const LINKS = [
  { href: "/admin", label: "Dashboard", icon: "dashboard" },
  { href: "/admin/leads", label: "Leads", icon: "inbox" },
  { href: "/admin/audits", label: "Audit requests", icon: "speed" },
  { href: "/admin/services", label: "Services", icon: "category" },
  { href: "/admin/pricing", label: "Pricing", icon: "payments" },
  { href: "/admin/blog", label: "Blog", icon: "article" },
  { href: "/admin/case-studies", label: "Case studies", icon: "monitoring" },
  { href: "/admin/faqs", label: "FAQs", icon: "quiz" },
  { href: "/admin/settings", label: "Settings", icon: "settings" },
];

export function AdminNav() {
  const pathname = usePathname() ?? "/admin";
  const [open, setOpen] = useState(false);
  const active = (href: string) => (href === "/admin" ? pathname === "/admin" : pathname.startsWith(href));
  return (
    <>
      <button type="button" onClick={() => setOpen((v) => !v)} aria-expanded={open} className="flex items-center gap-2 rounded-lg px-3 py-2 font-label-lg text-label-lg text-on-primary lg:hidden">
        <Icon name={open ? "close" : "menu"} size={22} /> Menu
      </button>
      <nav aria-label="Admin" className={cn("flex-col gap-1 lg:flex", open ? "flex" : "hidden")}>
        {LINKS.map((l) => (
          <Link
            key={l.href}
            href={l.href}
            onClick={() => setOpen(false)}
            aria-current={active(l.href) ? "page" : undefined}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2 font-label-lg text-label-lg transition-colors",
              active(l.href) ? "bg-secondary text-on-secondary" : "text-on-primary-container hover:bg-on-primary/5 hover:text-on-primary",
            )}
          >
            <Icon name={l.icon} size={20} /> {l.label}
          </Link>
        ))}
      </nav>
    </>
  );
}
