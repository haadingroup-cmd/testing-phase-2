import { ogImage, OG_SIZE } from "@/lib/og";
import { TOOLS, toolBySlug } from "@/data/tools";

export const size = OG_SIZE;
export const contentType = "image/png";
export const alt = "SmarterBiz.uk";
export const generateStaticParams = () => TOOLS.map((t) => ({ slug: t.slug }));

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const t = toolBySlug(slug);
  return ogImage({
    kicker: t ? `${t.vendor} • Review • ${t.score.toFixed(1)}/10` : "Review",
    title: t ? `${t.name}: ${t.tagline}` : "SmarterBiz.uk review",
    footer: t ? `Entry price: ${t.pricing.from}` : undefined,
  });
}
