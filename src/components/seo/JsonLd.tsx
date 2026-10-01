/** Renders JSON-LD structured data. `<` is escaped so content can't break out of the script tag. */
export function JsonLd({ data }: { data: Record<string, unknown> | Array<Record<string, unknown> | null> | null }) {
  if (!data) return null;
  const items = Array.isArray(data) ? data.filter(Boolean) : [data];
  if (!items.length) return null;
  const json = JSON.stringify(items.length === 1 ? items[0] : items).replace(/</g, "\\u003c");
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: json }} />;
}
