"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Icon } from "@/components/ui/Icon";
import { BOTTOM_NAV } from "@/content/navigation";
import { cn } from "@/lib/utils";

/** Stitch mobile tab bar — hidden on desktop where the header nav takes over. */
export function BottomNav() {
  const pathname = usePathname() ?? "/";
  return (
    <nav aria-label="Quick navigation" className="pb-safe fixed inset-x-0 bottom-0 z-40 bg-surface-container-lowest/90 shadow-[0_-1px_12px_rgba(0,0,0,0.06)] backdrop-blur-xl lg:hidden">
      <div className="mx-auto flex h-16 max-w-xl items-center justify-around px-gutter-mobile">
        {BOTTOM_NAV.map((item) => {
          const active = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={active ? "page" : undefined}
              className={cn(
                "flex h-14 w-14 flex-col items-center justify-center gap-1 transition-colors",
                active ? "font-bold text-secondary" : "text-on-surface-variant hover:text-secondary",
              )}
            >
              <Icon name={item.icon} size={22} filled={active} />
              <span className="font-label-md text-label-md">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
