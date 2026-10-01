import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Free Consultation — Book a Strategy Call",
  description: "Book a free digital marketing strategy call with HaadinGlobal. Get a clear plan for Meta Ads, Google Ads, SEO or your website — no obligation.",
  alternates: { canonical: "/consultation" },
};

export default function ConsultationLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
