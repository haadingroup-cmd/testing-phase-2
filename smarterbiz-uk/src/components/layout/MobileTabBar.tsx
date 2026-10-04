"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowLeftRight, BookOpen, LayoutGrid, Newspaper, SearchCheck } from "lucide-react";

const TABS = [
  { href: "/", label: "Home", Icon: Newspaper },
  { href: "/tools", label: "Directory", Icon: LayoutGrid },
  { href: "/compare", label: "Compare", Icon: ArrowLeftRight },
  { href: "/guides", label: "Guides", Icon: BookOpen },
  { href: "/search", label: "Search", Icon: SearchCheck },
] as const;

export function MobileTabBar() {
  const pathname = usePathname();
  return (
    <nav aria-label="Quick navigation" className="glass pb-safe fixed inset-x-0 bottom-0 z-40 border-t border-rule md:hidden">
      <ul className="flex h-16 items-center justify-around px-2">
        {TABS.map(({ href, label, Icon }) => {
          const active = href === "/" ? pathname === "/" : pathname.startsWith(href);
          return (
            <li key={href}>
              <Link
                href={href}
                aria-current={active ? "page" : undefined}
                className={`flex h-12 min-w-[60px] flex-col items-center justify-center rounded ${active ? "font-semibold text-brand" : "text-slate-body"}`}
              >
                <Icon className="h-[22px] w-[22px]" aria-hidden="true" />
                <span className="mt-0.5 text-[10px]">{label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
