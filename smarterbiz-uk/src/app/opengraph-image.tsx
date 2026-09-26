import { ogImage, OG_SIZE } from "@/lib/og";
import { SITE } from "@/lib/site";

export const size = OG_SIZE;
export const contentType = "image/png";
export const alt = `${SITE.name} — ${SITE.tagline}`;

export default function Image() {
  return ogImage({ kicker: `UK SME Software Index ${SITE.year}`, title: "Practical AI Tools for Smarter Small Businesses" });
}
