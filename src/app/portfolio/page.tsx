import type { Metadata } from "next";
import PortfolioPreview from "@/components/home/PortfolioPreview";
import TestimonialsSection from "@/components/home/TestimonialsSection";
import { CTASection } from "@/components/home/SiteSections";

export const metadata: Metadata = {
  title: "Portfolio & Case Studies | HaadinGlobal",
  description: "Real results for real businesses. 150+ case studies from Meta Ads, SEO, Shopify, YouTube Automation, and more.",
};

export default function PortfolioPage() {
  return (
    <>
      <div className="pt-24">
        <PortfolioPreview />
      </div>
      <TestimonialsSection />
      <CTASection />
    </>
  );
}
