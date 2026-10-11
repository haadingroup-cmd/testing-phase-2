import type { Metadata } from "next";
import { pageMeta } from "@/lib/pageMeta";

export const metadata: Metadata = pageMeta({
  title: "Free Consultation — Book a Strategy Call",
  description:
    "Book a free digital marketing strategy call with HaadinGlobal. Get a clear plan for Meta Ads, Google Ads, SEO or your website — no obligation.",
  path: "/consultation",
});

export default function ConsultationLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
