import { ogImage, OG_SIZE } from "@/lib/og";
import { GUIDES, guideBySlug } from "@/data/guides";

export const size = OG_SIZE;
export const contentType = "image/png";
export const alt = "SmarterBiz.uk";
export const generateStaticParams = () => GUIDES.map((g) => ({ slug: g.slug }));

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const g = guideBySlug(slug);
  return ogImage({ kicker: g?.kicker ?? "Guide", title: g?.title ?? "SmarterBiz.uk guide" });
}
