import { ogImage, OG_SIZE } from "@/lib/og";
import { COMPARISONS, comparisonBySlug } from "@/data/comparisons";

export const size = OG_SIZE;
export const contentType = "image/png";
export const alt = "SmarterBiz.uk";
export const generateStaticParams = () => COMPARISONS.map((c) => ({ slug: c.slug }));

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const c = comparisonBySlug(slug);
  return ogImage({ kicker: "Head-to-head", title: c?.title ?? "SmarterBiz.uk comparison" });
}
