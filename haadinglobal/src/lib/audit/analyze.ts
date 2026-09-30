import "server-only";
import { parse, type HTMLElement } from "node-html-parser";
import { safeFetch, type SafeResponse } from "@/lib/audit/safe-fetch";
import { isPageSpeedEnabled, runPageSpeed } from "@/lib/audit/pagespeed";
import { scoreChecks } from "@/lib/audit/score";
import type { AuditCategoryId, AuditCheck, AuditReport, CheckStatus, PageSpeedResult } from "@/lib/audit/types";

type CheckInput = Omit<AuditCheck, "category">;

class CheckList {
  readonly items: AuditCheck[] = [];
  add(category: AuditCategoryId, check: CheckInput) {
    this.items.push({ category, ...check });
  }
}

const attr = (el: HTMLElement | null | undefined, name: string) => el?.getAttribute(name)?.trim() ?? "";

function meta(root: HTMLElement, key: string): string {
  const lower = key.toLowerCase();
  for (const el of root.querySelectorAll("meta")) {
    const name = (el.getAttribute("name") ?? el.getAttribute("property") ?? "").toLowerCase();
    if (name === lower) return attr(el, "content");
  }
  return "";
}

function range(value: number, [goodMin, goodMax]: [number, number], [okMin, okMax]: [number, number]): CheckStatus {
  if (value >= goodMin && value <= goodMax) return "pass";
  if (value >= okMin && value <= okMax) return "warning";
  return "error";
}

function visibleText(root: HTMLElement): string {
  const clone = parse(root.toString());
  clone.querySelectorAll("script, style, noscript, svg, template, iframe").forEach((el) => el.remove());
  const body = clone.querySelector("body") ?? clone;
  return body.textContent.replace(/\s+/g, " ").trim();
}

async function fetchText(url: string): Promise<SafeResponse | null> {
  try {
    return await safeFetch(url, { timeoutMs: 6000, maxBytes: 512 * 1024, accept: "text/plain,application/xml,text/xml,*/*;q=0.5" });
  } catch {
    return null;
  }
}

function jsonLdTypes(root: HTMLElement): { types: string[]; invalid: number } {
  const types = new Set<string>();
  let invalid = 0;
  const collect = (node: unknown) => {
    if (Array.isArray(node)) return node.forEach(collect);
    if (node && typeof node === "object") {
      const record = node as Record<string, unknown>;
      const t = record["@type"];
      if (typeof t === "string") types.add(t);
      if (Array.isArray(t)) t.forEach((x) => typeof x === "string" && types.add(x));
      if (record["@graph"]) collect(record["@graph"]);
    }
  };
  for (const script of root.querySelectorAll('script[type="application/ld+json"]')) {
    try {
      collect(JSON.parse(script.textContent));
    } catch {
      invalid += 1;
    }
  }
  if (root.querySelector("[itemtype]")) types.add("Microdata");
  return { types: [...types], invalid };
}

export async function analyzeWebsite(requestedUrl: string): Promise<AuditReport> {
  const page = await safeFetch(requestedUrl);
  const contentType = page.headers["content-type"] ?? "";
  if (page.status >= 400) {
    throw new Error(`The website responded with HTTP ${page.status}.`);
  }
  if (contentType && !/html|xml/i.test(contentType)) {
    throw new Error("That URL doesn't return an HTML page.");
  }

  const finalUrl = new URL(page.url);
  const origin = finalUrl.origin;
  const root = parse(page.body, { comment: false, blockTextElements: { script: true, style: true, noscript: true } });
  const head = root.querySelector("head") ?? root;
  const checks = new CheckList();

  // Parallel lookups: robots.txt, sitemap, PageSpeed (optional).
  const [robots, pagespeed] = await Promise.all([
    fetchText(`${origin}/robots.txt`),
    isPageSpeedEnabled() ? runPageSpeed(finalUrl.toString()) : Promise.resolve<PageSpeedResult | null>(null),
  ]);
  const robotsBody = robots && robots.status === 200 && !/<html/i.test(robots.body.slice(0, 500)) ? robots.body : null;
  const sitemapFromRobots = robotsBody?.match(/^\s*sitemap:\s*(\S+)/im)?.[1];
  let sitemapUrl = sitemapFromRobots ?? `${origin}/sitemap.xml`;
  let sitemap = await fetchText(sitemapUrl);
  if ((!sitemap || sitemap.status !== 200) && !sitemapFromRobots) {
    sitemapUrl = `${origin}/sitemap_index.xml`;
    sitemap = await fetchText(sitemapUrl);
  }
  const sitemapOk = Boolean(sitemap && sitemap.status === 200 && /<(urlset|sitemapindex)/i.test(sitemap.body));

  // ── Technical SEO ──────────────────────────────────────────────────────
  const https = finalUrl.protocol === "https:";
  checks.add("technical", {
    id: "https",
    title: "HTTPS",
    status: https ? "pass" : "error",
    value: https ? "Served over HTTPS" : "Served over plain HTTP",
    why: "Browsers mark HTTP pages as 'Not secure' and Google uses HTTPS as a ranking signal.",
    fix: "Install an SSL certificate and redirect all HTTP traffic to HTTPS.",
  });

  checks.add("technical", {
    id: "status",
    title: "HTTP status",
    status: page.status === 200 ? "pass" : "warning",
    value: `HTTP ${page.status}${page.redirects.length ? ` after ${page.redirects.length} redirect(s)` : ""}`,
    why: "Search engines index pages that return 200 OK. Redirect chains waste crawl budget and slow visitors down.",
    fix: "Make the canonical URL return 200 directly and keep redirects to a single hop.",
  });
  if (page.redirects.length > 1) {
    checks.add("technical", {
      id: "redirect-chain",
      title: "Redirect chain",
      status: "warning",
      value: `${page.redirects.length} redirects`,
      why: "Each redirect adds latency and can dilute link signals.",
      fix: "Point links and redirects straight at the final URL.",
    });
  }

  const canonical = attr(head.querySelector('link[rel="canonical"]'), "href");
  let canonicalStatus: CheckStatus = "error";
  let canonicalValue = "Missing";
  if (canonical) {
    try {
      const canonicalUrl = new URL(canonical, finalUrl);
      canonicalStatus = canonicalUrl.host === finalUrl.host ? "pass" : "warning";
      canonicalValue = canonicalUrl.toString();
    } catch {
      canonicalStatus = "warning";
      canonicalValue = "Invalid URL";
    }
  }
  checks.add("technical", {
    id: "canonical",
    title: "Canonical tag",
    status: canonicalStatus,
    value: canonicalValue,
    why: "A canonical tag tells search engines which URL is the main version and prevents duplicate-content issues.",
    fix: 'Add <link rel="canonical" href="https://your-domain/page"> pointing to the preferred URL.',
  });

  const robotsMeta = `${meta(root, "robots")} ${page.headers["x-robots-tag"] ?? ""}`.toLowerCase();
  const noindex = /noindex/.test(robotsMeta);
  checks.add("technical", {
    id: "indexable",
    title: "Indexable by search engines",
    status: noindex ? "error" : "pass",
    value: noindex ? "noindex found" : "No noindex directive",
    why: "Pages marked noindex will not appear in Google search results.",
    fix: "Remove the noindex robots meta tag or X-Robots-Tag header from pages you want to rank.",
  });

  const blocksAll = robotsBody ? /user-agent:\s*\*[^]*?disallow:\s*\/\s*$/im.test(robotsBody) : false;
  checks.add("technical", {
    id: "robots-txt",
    title: "robots.txt",
    status: !robotsBody ? "warning" : blocksAll ? "error" : "pass",
    value: !robotsBody ? "Not found" : blocksAll ? "Blocks all crawlers" : "Found",
    why: "robots.txt guides crawlers and is where search engines look for your sitemap.",
    fix: blocksAll
      ? "Remove 'Disallow: /' for User-agent: * so search engines can crawl the site."
      : "Create /robots.txt allowing crawlers and listing your sitemap URL.",
  });

  checks.add("technical", {
    id: "sitemap",
    title: "XML sitemap",
    status: sitemapOk ? "pass" : "warning",
    value: sitemapOk ? sitemapUrl : "Not found",
    why: "A sitemap helps search engines discover and re-crawl your important pages.",
    fix: "Publish /sitemap.xml, reference it in robots.txt and submit it in Google Search Console.",
  });

  const viewport = meta(root, "viewport");
  checks.add("technical", {
    id: "viewport",
    title: "Mobile viewport",
    status: viewport.includes("width=device-width") ? "pass" : "error",
    value: viewport || "Missing",
    why: "Without a responsive viewport, mobile visitors see a zoomed-out desktop page — Google indexes mobile-first.",
    fix: 'Add <meta name="viewport" content="width=device-width, initial-scale=1">.',
  });

  const charset = head.querySelector("meta[charset]") || /charset=/i.test(meta(root, "content-type")) || /charset=/i.test(contentType);
  checks.add("technical", {
    id: "charset",
    title: "Character encoding",
    status: charset ? "pass" : "warning",
    value: charset ? "Declared" : "Not declared",
    why: "Declaring UTF-8 prevents garbled characters, especially for Arabic and Urdu text.",
    fix: 'Add <meta charset="utf-8"> as the first element in <head>.',
  });

  // ── On-page SEO ────────────────────────────────────────────────────────
  const title = head.querySelector("title")?.textContent.trim() ?? "";
  checks.add("onpage", {
    id: "title",
    title: "Title tag",
    status: title ? range(title.length, [30, 60], [15, 70]) : "error",
    value: title ? `${title.length} characters — "${title.slice(0, 80)}"` : "Missing",
    why: "The title is the headline shown in Google results and strongly influences clicks and rankings.",
    fix: "Write a unique 30–60 character title with your main keyword and brand.",
  });

  const description = meta(root, "description");
  checks.add("onpage", {
    id: "meta-description",
    title: "Meta description",
    status: description ? range(description.length, [70, 160], [40, 200]) : "error",
    value: description ? `${description.length} characters` : "Missing",
    why: "The description is often used as the snippet under your title in search results.",
    fix: "Write a compelling 70–160 character description summarising the page with a call to action.",
  });

  const h1s = root.querySelectorAll("h1");
  checks.add("onpage", {
    id: "h1",
    title: "H1 heading",
    status: h1s.length === 1 ? "pass" : h1s.length === 0 ? "error" : "warning",
    value: h1s.length === 0 ? "Missing" : `${h1s.length} found${h1s[0] ? ` — "${h1s[0].textContent.trim().slice(0, 70)}"` : ""}`,
    why: "One clear H1 tells visitors and search engines what the page is about.",
    fix: "Use exactly one H1 containing the page's main topic; use H2/H3 for sub-sections.",
  });

  const headingLevels = root.querySelectorAll("h1, h2, h3, h4, h5, h6").map((h) => Number(h.tagName.slice(1)));
  let skipped = 0;
  for (let i = 1; i < headingLevels.length; i++) {
    if (headingLevels[i] - headingLevels[i - 1] > 1) skipped++;
  }
  checks.add("onpage", {
    id: "heading-structure",
    title: "Heading hierarchy",
    status: headingLevels.length === 0 ? "error" : skipped === 0 ? "pass" : "warning",
    value: headingLevels.length === 0 ? "No headings" : `${headingLevels.length} headings, ${skipped} skipped level(s)`,
    why: "A logical heading outline helps search engines and screen readers understand your content.",
    fix: "Nest headings in order (H1 → H2 → H3) without skipping levels.",
  });

  const schema = jsonLdTypes(root);
  checks.add("onpage", {
    id: "schema",
    title: "Structured data (schema)",
    status: schema.invalid ? "warning" : schema.types.length ? "pass" : "warning",
    value: schema.types.length ? schema.types.slice(0, 8).join(", ") : schema.invalid ? "Invalid JSON-LD" : "None found",
    why: "Schema markup can earn rich results and helps search and AI engines understand your business.",
    fix: "Add JSON-LD for Organization/LocalBusiness plus relevant types (Product, FAQPage, Article, BreadcrumbList).",
  });

  const lang = attr(root.querySelector("html"), "lang");

  // ── Content ────────────────────────────────────────────────────────────
  const text = visibleText(root);
  const words = text ? text.split(" ").filter((w) => /\w/.test(w)).length : 0;
  checks.add("content", {
    id: "word-count",
    title: "Amount of content",
    status: words >= 300 ? "pass" : words >= 150 ? "warning" : "error",
    value: `${words.toLocaleString("en-US")} words`,
    why: "Thin pages rarely rank. Enough helpful text lets search engines match the page to real queries.",
    fix: "Expand the page with useful copy: what you offer, who it's for, pricing cues, FAQs and proof.",
  });

  const h2Count = root.querySelectorAll("h2").length;
  checks.add("content", {
    id: "subheadings",
    title: "Sub-headings",
    status: h2Count >= 2 ? "pass" : h2Count === 1 ? "warning" : "error",
    value: `${h2Count} H2 heading(s)`,
    why: "Sub-headings make content scannable and give search engines extra topical signals.",
    fix: "Break content into sections with descriptive H2 headings.",
  });

  const links = root.querySelectorAll("a[href]").map((a) => attr(a, "href"));
  let internal = 0;
  let external = 0;
  for (const href of links) {
    if (!href || href.startsWith("#") || /^(mailto|tel|javascript):/i.test(href)) continue;
    try {
      const u = new URL(href, finalUrl);
      if (u.host === finalUrl.host) internal++;
      else external++;
    } catch {
      /* ignore malformed links */
    }
  }
  checks.add("content", {
    id: "internal-links",
    title: "Internal links",
    status: internal >= 5 ? "pass" : internal >= 2 ? "warning" : "error",
    value: `${internal} internal, ${external} external`,
    why: "Internal links spread authority and help visitors and crawlers find your key pages.",
    fix: "Link to your main service, pricing and contact pages from the content and navigation.",
  });

  // ── Performance (server-side indicators) ───────────────────────────────
  checks.add("performance", {
    id: "ttfb",
    title: "Server response time",
    status: page.timeToFirstByteMs < 800 ? "pass" : page.timeToFirstByteMs < 1800 ? "warning" : "error",
    value: `${page.timeToFirstByteMs} ms (measured from our server)`,
    why: "Slow server responses delay everything else and hurt Core Web Vitals.",
    fix: "Use caching, a CDN and faster hosting; avoid heavy server-side work on each request.",
  });

  const kb = Math.round(page.bytes / 1024);
  checks.add("performance", {
    id: "html-size",
    title: "HTML size",
    status: kb <= 150 ? "pass" : kb <= 400 ? "warning" : "error",
    value: `${kb} KB (uncompressed)`,
    why: "Very large HTML documents take longer to download and parse on mobile connections.",
    fix: "Remove inline bloat (large inline styles/scripts, embedded data) and paginate long lists.",
  });

  const encoding = page.headers["content-encoding"] ?? "";
  checks.add("performance", {
    id: "compression",
    title: "Text compression",
    status: /gzip|br|deflate|zstd/i.test(encoding) ? "pass" : "warning",
    value: encoding || "None",
    why: "Gzip or Brotli compression typically cuts HTML transfer size by 70% or more.",
    fix: "Enable Brotli or gzip compression on your server or CDN.",
  });

  const headScripts = head.querySelectorAll("script[src]");
  const blocking = headScripts.filter((s) => !s.hasAttribute("async") && !s.hasAttribute("defer") && attr(s, "type") !== "module").length;
  checks.add("performance", {
    id: "render-blocking",
    title: "Render-blocking scripts",
    status: blocking === 0 ? "pass" : blocking <= 3 ? "warning" : "error",
    value: `${blocking} blocking script(s) in <head>`,
    why: "Synchronous scripts in the head stop the browser from rendering until they download and run.",
    fix: "Add defer or async to scripts, or move them to the end of the body.",
  });

  const scripts = root.querySelectorAll("script[src]").length;
  checks.add("performance", {
    id: "script-count",
    title: "External scripts",
    status: scripts <= 15 ? "pass" : scripts <= 30 ? "warning" : "error",
    value: `${scripts} script files`,
    why: "Each third-party script adds network requests and main-thread work.",
    fix: "Remove unused plugins and tags; load non-essential scripts after interaction.",
  });

  const images = root.querySelectorAll("img");
  if (images.length > 0) {
    const sized = images.filter((img) => img.hasAttribute("width") && img.hasAttribute("height")).length;
    checks.add("performance", {
      id: "image-dimensions",
      title: "Image dimensions set",
      status: sized / images.length >= 0.8 ? "pass" : sized / images.length >= 0.4 ? "warning" : "error",
      value: `${sized} of ${images.length} images`,
      why: "Images without width/height cause layout shifts (CLS) as the page loads.",
      fix: "Add width and height attributes (or CSS aspect-ratio) to every image.",
    });
  }
  if (images.length > 3) {
    const lazy = images.filter((img) => attr(img, "loading") === "lazy").length;
    checks.add("performance", {
      id: "lazy-images",
      title: "Lazy-loaded images",
      status: lazy > 0 ? "pass" : "warning",
      value: `${lazy} of ${images.length} images lazy-loaded`,
      why: "Lazy-loading off-screen images speeds up the initial page load.",
      fix: 'Add loading="lazy" to images below the fold.',
    });
  }

  if (pagespeed) {
    if (pagespeed.performanceScore !== null) {
      checks.add("performance", {
        id: "lighthouse",
        title: "Lighthouse performance (mobile)",
        status: range(pagespeed.performanceScore, [90, 100], [50, 89]),
        value: `${pagespeed.performanceScore}/100`,
        why: "Google's Lighthouse lab score summarises real loading performance on a mid-range phone.",
        fix: "Address the largest issues first: image weight, render-blocking resources and unused JavaScript.",
      });
    }
    if (pagespeed.lcpMs !== null) {
      checks.add("performance", {
        id: "lcp",
        title: "Largest Contentful Paint (lab)",
        status: pagespeed.lcpMs <= 2500 ? "pass" : pagespeed.lcpMs <= 4000 ? "warning" : "error",
        value: `${(pagespeed.lcpMs / 1000).toFixed(1)} s`,
        why: "LCP measures how quickly the main content appears — a Core Web Vital.",
        fix: "Optimise and preload the hero image, reduce server time and remove render-blocking resources.",
      });
    }
    if (pagespeed.cls !== null) {
      checks.add("performance", {
        id: "cls",
        title: "Cumulative Layout Shift (lab)",
        status: pagespeed.cls <= 0.1 ? "pass" : pagespeed.cls <= 0.25 ? "warning" : "error",
        value: pagespeed.cls.toFixed(3),
        why: "CLS measures unexpected layout movement — a Core Web Vital.",
        fix: "Reserve space for images, ads and embeds; avoid inserting content above existing content.",
      });
    }
  }

  // ── Social ─────────────────────────────────────────────────────────────
  const ogTitle = meta(root, "og:title");
  const ogDescription = meta(root, "og:description");
  const ogImage = meta(root, "og:image");
  checks.add("social", {
    id: "og-title",
    title: "Open Graph title",
    status: ogTitle ? "pass" : "warning",
    value: ogTitle || "Missing",
    why: "Controls the headline when your page is shared on Facebook, LinkedIn and WhatsApp.",
    fix: 'Add <meta property="og:title" content="…">.',
  });
  checks.add("social", {
    id: "og-description",
    title: "Open Graph description",
    status: ogDescription ? "pass" : "warning",
    value: ogDescription ? `${ogDescription.length} characters` : "Missing",
    why: "Controls the summary text shown in social and messaging previews.",
    fix: 'Add <meta property="og:description" content="…">.',
  });
  checks.add("social", {
    id: "og-image",
    title: "Open Graph image",
    status: ogImage ? "pass" : "error",
    value: ogImage || "Missing",
    why: "Shares without an image get far less attention in feeds and chats.",
    fix: 'Add a 1200×630 image via <meta property="og:image" content="https://…">.',
  });
  const twitterCard = meta(root, "twitter:card");
  checks.add("social", {
    id: "twitter-card",
    title: "Twitter / X card",
    status: twitterCard ? "pass" : "warning",
    value: twitterCard || "Missing",
    why: "Enables rich previews when your link is posted on X.",
    fix: 'Add <meta name="twitter:card" content="summary_large_image">.',
  });

  // ── Accessibility ──────────────────────────────────────────────────────
  if (images.length > 0) {
    const withAlt = images.filter((img) => img.hasAttribute("alt")).length;
    const ratio = withAlt / images.length;
    checks.add("accessibility", {
      id: "img-alt",
      title: "Image alt text",
      status: ratio === 1 ? "pass" : ratio >= 0.8 ? "warning" : "error",
      value: `${withAlt} of ${images.length} images have alt attributes`,
      why: "Alt text describes images to screen-reader users and to search engines.",
      fix: 'Add descriptive alt text to meaningful images and alt="" to decorative ones.',
    });
  }
  checks.add("accessibility", {
    id: "lang",
    title: "Page language",
    status: lang ? "pass" : "warning",
    value: lang || "Not set",
    why: "The lang attribute lets screen readers pronounce content correctly and helps search engines.",
    fix: 'Add a lang attribute, e.g. <html lang="en">.',
  });

  const inputs = root.querySelectorAll("input, select, textarea").filter((el) => !["hidden", "submit", "button"].includes(attr(el, "type").toLowerCase()));
  if (inputs.length > 0) {
    const labelledIds = new Set(root.querySelectorAll("label[for]").map((l) => attr(l, "for")));
    const labelled = inputs.filter(
      (el) =>
        (attr(el, "id") && labelledIds.has(attr(el, "id"))) ||
        attr(el, "aria-label") ||
        attr(el, "aria-labelledby") ||
        el.closest("label") !== null,
    ).length;
    checks.add("accessibility", {
      id: "form-labels",
      title: "Form field labels",
      status: labelled === inputs.length ? "pass" : labelled / inputs.length >= 0.5 ? "warning" : "error",
      value: `${labelled} of ${inputs.length} fields labelled`,
      why: "Unlabelled fields are hard to use with screen readers and voice control.",
      fix: "Associate every field with a <label for> or an aria-label.",
    });
  }

  const zoomLocked = /user-scalable\s*=\s*(no|0)|maximum-scale\s*=\s*1(\.0)?(\D|$)/i.test(viewport);
  checks.add("accessibility", {
    id: "zoom",
    title: "Pinch-to-zoom allowed",
    status: zoomLocked ? "warning" : "pass",
    value: zoomLocked ? "Zoom disabled in viewport" : "Zoom allowed",
    why: "Disabling zoom makes the page hard to read for visitors with low vision.",
    fix: "Remove user-scalable=no and maximum-scale=1 from the viewport tag.",
  });

  const emptyLinks = root
    .querySelectorAll("a[href], button")
    .filter((el) => !el.textContent.trim() && !attr(el, "aria-label") && !attr(el, "title") && !el.querySelector("img[alt]:not([alt=''])")).length;
  checks.add("accessibility", {
    id: "link-names",
    title: "Links & buttons have names",
    status: emptyLinks === 0 ? "pass" : emptyLinks <= 3 ? "warning" : "error",
    value: `${emptyLinks} without an accessible name`,
    why: "Icon-only links and buttons without labels are announced as just 'link' or 'button'.",
    fix: "Add visible text or an aria-label to icon-only links and buttons.",
  });

  // ── Conversion ─────────────────────────────────────────────────────────
  const hasTel = links.some((h) => /^tel:/i.test(h));
  const hasMail = links.some((h) => /^mailto:/i.test(h));
  const hasWhatsApp = links.some((h) => /wa\.me|whatsapp\.com|api\.whatsapp/i.test(h));
  const channels = [hasTel && "phone", hasMail && "email", hasWhatsApp && "WhatsApp"].filter(Boolean) as string[];
  checks.add("conversion", {
    id: "contact-options",
    title: "Direct contact options",
    status: channels.length >= 2 ? "pass" : channels.length === 1 ? "warning" : "error",
    value: channels.length ? channels.join(", ") : "No click-to-call, email or WhatsApp links",
    why: "One-tap contact links (especially WhatsApp in Pakistan and the Gulf) remove friction for ready buyers.",
    fix: "Add tap-to-call, WhatsApp and email links in the header, footer and near key CTAs.",
  });

  const forms = root.querySelectorAll("form").length;
  checks.add("conversion", {
    id: "lead-form",
    title: "Lead capture form",
    status: forms > 0 ? "pass" : "warning",
    value: forms > 0 ? `${forms} form(s)` : "No form on this page",
    why: "Visitors who aren't ready to call still need an easy way to leave their details.",
    fix: "Add a short enquiry or quote form (name, phone/WhatsApp, need).",
  });

  const ctaPattern = /\b(contact|get started|book|buy|order|quote|call|whatsapp|shop now|sign up|get in touch|enquire|inquire|free)\b/i;
  const ctas = root.querySelectorAll("a, button").filter((el) => ctaPattern.test(el.textContent)).length;
  checks.add("conversion", {
    id: "cta",
    title: "Calls to action",
    status: ctas >= 3 ? "pass" : ctas >= 1 ? "warning" : "error",
    value: `${ctas} CTA link(s)/button(s) detected`,
    why: "Clear, repeated calls to action guide visitors toward enquiring or buying.",
    fix: "Add a primary CTA above the fold and repeat it after key sections.",
  });

  const html = page.body;
  const tracking = [
    /googletagmanager\.com\/gtm\.js|GTM-[A-Z0-9]+/i.test(html) && "Google Tag Manager",
    /gtag\(|googletagmanager\.com\/gtag\/js/i.test(html) && "Google Analytics / Ads",
    /connect\.facebook\.net|fbq\(/i.test(html) && "Meta Pixel",
    /analytics\.tiktok\.com|ttq\./i.test(html) && "TikTok Pixel",
  ].filter(Boolean) as string[];
  checks.add("conversion", {
    id: "tracking",
    title: "Analytics & ad tracking",
    status: tracking.length ? "pass" : "warning",
    value: tracking.length ? tracking.join(", ") : "No common tracking tags detected in the HTML",
    why: "Without analytics and pixels you can't measure which channels produce leads or optimise ad spend.",
    fix: "Install GA4 (ideally via Google Tag Manager) and the Meta Pixel with conversion events.",
  });

  const { score, categories } = scoreChecks(checks.items);
  const limitations = [
    "Analyses the single URL submitted (not a full-site crawl).",
    "Backlink, keyword ranking and traffic data require third-party APIs (e.g. Ahrefs/Semrush) and are not included.",
  ];
  if (!pagespeed) {
    limitations.push("Core Web Vitals lab data (Lighthouse) was not included; performance is based on server-side indicators.");
  }
  if (page.truncated) limitations.push("The page was larger than 3 MB; only the first 3 MB was analysed.");

  return {
    version: 1,
    requestedUrl,
    finalUrl: finalUrl.toString(),
    fetchedAt: new Date().toISOString(),
    httpStatus: page.status,
    responseTimeMs: page.timeToFirstByteMs,
    htmlBytes: page.bytes,
    redirects: page.redirects,
    title: title || null,
    score,
    categories,
    checks: checks.items,
    pagespeed,
    limitations,
  };
}
