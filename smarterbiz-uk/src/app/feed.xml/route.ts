import { GUIDES } from "@/data/guides";
import { COMPARISONS } from "@/data/comparisons";
import { SITE, absoluteUrl } from "@/lib/site";
import { escapeXml } from "@/lib/xml";

export const dynamic = "force-static";

export function GET() {
  const items = [
    ...GUIDES.map((g) => ({ title: g.title, url: absoluteUrl(`/guides/${g.slug}`), desc: g.description, date: g.updated })),
    ...COMPARISONS.map((c) => ({ title: c.title, url: absoluteUrl(`/compare/${c.slug}`), desc: c.description, date: c.updated })),
  ].sort((a, b) => b.date.localeCompare(a.date));

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
<channel>
<title>${escapeXml(SITE.name)}</title>
<link>${SITE.url}</link>
<description>${escapeXml(SITE.description)}</description>
<language>en-gb</language>
<atom:link href="${SITE.url}/feed.xml" rel="self" type="application/rss+xml"/>
${items
  .map(
    (i) => `<item><title>${escapeXml(i.title)}</title><link>${i.url}</link><guid isPermaLink="true">${i.url}</guid><description>${escapeXml(i.desc)}</description><pubDate>${new Date(`${i.date}T09:00:00Z`).toUTCString()}</pubDate></item>`,
  )
  .join("\n")}
</channel>
</rss>`;
  return new Response(xml, { headers: { "Content-Type": "application/rss+xml; charset=utf-8", "Cache-Control": "public, max-age=3600" } });
}
