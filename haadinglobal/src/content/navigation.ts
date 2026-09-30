export type NavLink = { label: string; href: string; icon: string; iconClass?: string };

export const PRIMARY_NAV: NavLink[] = [
  { label: "Home", href: "/", icon: "home" },
  { label: "Services", href: "/services", icon: "category" },
  { label: "Pricing", href: "/pricing", icon: "payments" },
  { label: "Results", href: "/results", icon: "monitoring" },
  { label: "Blog", href: "/blog", icon: "article" },
  { label: "About", href: "/about", icon: "badge" },
];

/** Stitch drawer: "Core Architecture". */
export const DRAWER_CORE: NavLink[] = [
  { label: "Agency Home", href: "/", icon: "grid_view", iconClass: "text-secondary" },
  { label: "Free Website Audit", href: "/audit", icon: "verified", iconClass: "text-accent-gold-light" },
  { label: "ROAS & Budget Calculator", href: "/pricing#package-builder", icon: "calculate", iconClass: "text-electric-blue" },
  { label: "Verified Results", href: "/results", icon: "trending_up", iconClass: "text-secondary" },
  { label: "Pricing & Packages", href: "/pricing", icon: "payments", iconClass: "text-secondary" },
];

/** Stitch drawer: "Leadership & Contact". */
export const DRAWER_LEADERSHIP: NavLink[] = [
  { label: "Founder Letter", href: "/about", icon: "badge" },
  { label: "Insights & Blog", href: "/blog", icon: "article" },
  { label: "Agency FAQ", href: "/faq", icon: "help_outline" },
  { label: "Contact the Team", href: "/contact", icon: "mail" },
];

/** Stitch mobile bottom tab bar. */
export const BOTTOM_NAV: NavLink[] = [
  { label: "Home", href: "/", icon: "home" },
  { label: "Services", href: "/services", icon: "category" },
  { label: "ROAS", href: "/pricing", icon: "calculate" },
  { label: "Results", href: "/results", icon: "monitoring" },
  { label: "Contact", href: "/contact", icon: "support_agent" },
];

export const LEGAL_NAV = [
  { label: "Privacy", href: "/privacy-policy" },
  { label: "Terms", href: "/terms" },
  { label: "Refunds", href: "/refund-policy" },
  { label: "Security", href: "/security" },
];

export const COMPANY_NAV = [
  { label: "About & Founder", href: "/about" },
  { label: "Results & Case Studies", href: "/results" },
  { label: "Pricing", href: "/pricing" },
  { label: "Free Website Audit", href: "/audit" },
  { label: "Blog", href: "/blog" },
  { label: "FAQ", href: "/faq" },
  { label: "Contact", href: "/contact" },
];

/** Page names shown under the logo in the mobile app-style header. */
export function sectionTitle(pathname: string): string {
  if (pathname === "/") return "Home";
  const map: Array<[string, string]> = [
    ["/services", "Services Hub"],
    ["/pricing", "Custom Calculator"],
    ["/results", "Results & Case Studies"],
    ["/audit", "Free Website Audit"],
    ["/blog", "Insights"],
    ["/about", "Founder & Agency"],
    ["/contact", "Contact"],
    ["/faq", "Agency FAQ"],
    ["/privacy-policy", "Privacy Policy"],
    ["/terms", "Terms"],
    ["/refund-policy", "Refund Policy"],
    ["/security", "Security"],
  ];
  return map.find(([prefix]) => pathname.startsWith(prefix))?.[1] ?? "HaadinGlobal";
}
