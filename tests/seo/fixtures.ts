import type { FetchResult, Fetcher } from "../../src/lib/seo/security";
import type { AuditInput } from "../../src/lib/seo/types";
export const input: AuditInput = {
  url: "https://audit-example.com/",
  competitors: [],
  social: {},
};
export function fixtureHTML(
  options: {
    title?: string;
    description?: string;
    links?: number;
    missing?: boolean;
    noindex?: boolean;
    schema?: string;
    arabic?: boolean;
  } = {},
) {
  const {
    title = "Airport transfers with a clear booking process",
    description = "Plan your airport transfer with practical information about pickup points, booking steps and the journey. Read the service details before contacting our team.",
    links = 2,
    missing = false,
    noindex = false,
    schema,
  } = options;
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">${missing ? "" : `<title>${title}</title><meta name="description" content="${description}">`}<meta name="robots" content="${noindex ? "noindex" : "index,follow"}"><link rel="canonical" href="https://audit-example.com/"><link rel="icon" href="/favicon.ico"><meta property="og:title" content="Airport transfers"><meta property="og:description" content="Booking information"><meta property="og:image" content="https://audit-example.com/image.png"><meta name="twitter:card" content="summary"><script type="application/ld+json">${schema || '{"@context":"https://schema.org","@type":"Organization","name":"Fixture Business","url":"https://audit-example.com/"}'}</script></head><body><nav>This navigation should not count as main content</nav><main>${missing ? "" : "<h1>Airport transfers</h1>"}<h2>How booking works</h2><p>${"Travelers can review the pickup information, check the service details, and contact the team to request a journey that meets their actual needs. ".repeat(8)}${options.arabic ? "خدمة النقل إلى المطار ومعلومات الحجز." : ""}</p><h2>What should you confirm?</h2><p>Confirm the destination and booking details directly with the provider.</p><img src="/service.jpg" ${missing ? "" : 'alt=""'}>${Array.from({ length: links }, (_, i) => `<a href="/page-${i + 1}">Transfer details ${i + 1}</a>`).join("")}<a href="https://www.facebook.com/fixture">Official Facebook</a><a href="tel:+923001234567">Call the office</a><a href="mailto:hello@audit-example.com">Email</a></main></body></html>`;
}
export function result(
  url: string,
  body: string,
  status = 200,
  contentType = "text/html; charset=utf-8",
): FetchResult {
  return {
    url,
    status,
    body,
    headers: {
      "content-type": contentType,
      "content-encoding": "gzip",
      "cache-control": "public,max-age=60",
    },
    bytes: Buffer.byteLength(body),
    transferBytes: Math.round(Buffer.byteLength(body) / 2),
    fetchMs: 42,
    redirects: [],
  };
}
export function fixtureFetcher(
  options: {
    links?: number;
    robots?: string;
    missing?: boolean;
    broken?: boolean;
    duplicate?: boolean;
    homeStatus?: number;
    slow?: boolean;
  } = {},
) {
  const calls: string[] = [];
  const fetcher: Fetcher = async (url, opts) => {
    calls.push(url);
    await opts?.beforeHop?.(new URL(url));
    if (url.endsWith("/robots.txt"))
      return result(
        url,
        options.robots ??
          "User-agent: *\nAllow: /\nSitemap: https://audit-example.com/sitemap.xml",
        200,
        "text/plain",
      );
    if (url.endsWith("/sitemap.xml"))
      return result(
        url,
        '<?xml version="1.0"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><url><loc>https://audit-example.com/</loc></url></urlset>',
        200,
        "application/xml",
      );
    if (options.slow && url.includes("/page-"))
      throw new Error("simulated timeout");
    if (options.broken && url.endsWith("page-1"))
      return result(url, "not found", 404);
    return result(
      url,
      fixtureHTML({
        missing: options.missing,
        links: options.links ?? 2,
        title: options.duplicate
          ? "Repeated transfer page title"
          : `Airport transfer ${new URL(url).pathname} booking information`,
      }),
      options.homeStatus ?? 200,
    );
  };
  return { fetcher, calls };
}
