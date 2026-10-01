import {
  categories,
  type AuditInput,
  type Category,
  type CategoryScore,
  type Check,
  type Page,
  type Status,
} from "./types";

export function methodologyWeights(): number[] {
  const raw = (process.env.SCORE_WEIGHTS || "30,25,20,10,10,5")
    .split(",")
    .map(Number);
  return raw.length === 6 &&
    raw.every((x) => Number.isFinite(x) && x >= 0) &&
    raw.some((x) => x > 0)
    ? raw
    : [30, 25, 20, 10, 10, 5];
}
export function calculateScores(checks: Check[]): {
  scores: CategoryScore[];
  overall: number | null;
} {
  const weights = methodologyWeights();
  const scores = categories.map((category, i) => {
    const all = checks.filter((c) => c.category === category);
    const usable = all.filter(
      (c) => c.status !== "unavailable" && c.weight > 0,
    );
    const total = usable.reduce((sum, c) => sum + c.weight, 0);
    // Weighted proportion of passed checks. Warning/critical do not receive invented partial credit.
    return {
      category,
      score: total
        ? Math.round(
            (usable
              .filter((c) => c.status === "passed")
              .reduce((s, c) => s + c.weight, 0) /
              total) *
              100,
          )
        : null,
      weight: weights[i],
      evaluated: usable.length,
      unavailable: all.filter((c) => c.status === "unavailable").length,
    };
  });
  const active = scores.filter((c) => c.score !== null && c.weight > 0);
  const weightSum = active.reduce((s, c) => s + c.weight, 0);
  return {
    scores,
    overall: weightSum
      ? Math.round(
          active.reduce((s, c) => s + (c.score ?? 0) * c.weight, 0) / weightSum,
        )
      : null,
  };
}
export function pageChecks(page: Page, input: AuditInput): Check[] {
  const checks: Check[] = [];
  const add = (
    key: string,
    category: Category,
    status: Status,
    title: string,
    evidence: string,
    explanation: string,
    fix: string,
    weight = 1,
  ) => {
    checks.push({
      id: `${page.url}::${key}`,
      category,
      status,
      title,
      evidence,
      explanation,
      fix,
      pageUrl: page.url,
      weight,
      priority:
        status === "critical"
          ? "First"
          : weight >= 3
            ? "High"
            : weight === 2
              ? "Medium"
              : "Low",
      source: "Website crawl",
      difficulty: [
        "canonical",
        "status",
        "indexable",
        "mixed",
        "compression",
        "cache",
      ].includes(key)
        ? "Developer"
        : "Easy",
    });
  };
  const yes = (v: unknown): Status => (v ? "passed" : "warning");
  add(
    "status",
    "technical",
    page.status >= 200 && page.status < 300 ? "passed" : "critical",
    "Page response",
    `HTTP ${page.status}`,
    "Search engines need to retrieve a usable page.",
    "Restore the intended successful response or update links to the correct destination.",
    4,
  );
  add(
    "https",
    "technical",
    yes(page.url.startsWith("https:")),
    "Secure connection",
    page.url,
    "HTTPS protects visitors and the integrity of page content.",
    "Serve the page over HTTPS with a valid certificate and redirect the HTTP version.",
    3,
  );
  const excluded = /(?:^|[\s,:;])(noindex|none)(?:[\s,;]|$)/i.test(
    `${page.robots} ${page.xRobots}`,
  );
  add(
    "indexable",
    "technical",
    excluded ? "critical" : "passed",
    "Indexing directives",
    `Meta robots: ${page.robots || "(none)"}; X-Robots-Tag: ${page.xRobots || "(none)"}`,
    "A noindex directive asks search engines to exclude a page. Its absence does not prove Google indexing.",
    "If this page should appear in search, remove unintended noindex directives. Keep them on genuinely private or utility pages.",
    4,
  );
  add(
    "canonical",
    "technical",
    yes(page.canonical),
    "Preferred page URL",
    page.canonical || "No canonical link detected.",
    "A canonical helps search engines identify the preferred version of similar URLs.",
    "Review duplicate URL versions and add an accurate absolute canonical where appropriate.",
    2,
  );
  add(
    "redirects",
    "technical",
    page.redirects.length > 1 ? "warning" : "passed",
    "Redirect chain",
    page.redirects.length
      ? page.redirects.join(" → ")
      : "No redirects followed.",
    "Extra redirect hops add work before the page loads.",
    "Update internal links to the final destination and shorten avoidable redirect chains.",
    1,
  );
  add(
    "viewport",
    "technical",
    yes(page.viewport && /width\s*=\s*device-width/i.test(page.viewport)),
    "Mobile viewport",
    page.viewport || "No viewport meta tag found.",
    "A responsive viewport helps pages adapt to mobile screens. This is not a visual mobile usability test.",
    "Use a responsive layout and a viewport tag with width=device-width, initial-scale=1.",
    2,
  );
  add(
    "lang",
    "technical",
    yes(page.lang),
    "Page language",
    page.lang || "No html lang attribute.",
    "A language declaration helps assistive technology choose the correct pronunciation.",
    "Set the html lang attribute to the actual language of the page.",
    1,
  );
  add(
    "charset",
    "technical",
    yes(page.charset),
    "Character encoding",
    page.charset || "No charset declaration found.",
    "Explicit encoding helps browsers interpret text consistently.",
    "Declare UTF-8 in the response header or HTML head.",
    1,
  );
  add(
    "mixed",
    "technical",
    page.mixedContent.length ? "warning" : "passed",
    "Mixed content",
    page.mixedContent.join("; ") ||
      "No HTTP resource URLs found in checked HTML attributes.",
    "Insecure resource references may be blocked on secure pages.",
    "Replace HTTP asset and form URLs with secure HTTPS destinations.",
    2,
  );
  add(
    "schema",
    "technical",
    page.schema.errors.length
      ? "warning"
      : page.schema.types.length
        ? "passed"
        : "warning",
    "Structured data",
    page.schema.errors.join(" ") ||
      page.schema.types.join(", ") ||
      "No JSON-LD types detected.",
    "Structured data can clarify entities. Syntax checks alone do not establish rich-result eligibility.",
    "Add relevant factual structured data, validate it, and confirm current requirements in Google’s Rich Results Test.",
    1,
  );
  add(
    "favicon",
    "technical",
    yes(page.favicon),
    "Site icon declaration",
    page.favicon
      ? "An icon link exists in HTML."
      : "No icon link found in HTML; /favicon.ico was not fetched.",
    "An appropriate site icon helps people recognize your pages.",
    "Declare a crawlable favicon and check its suitability.",
    1,
  );
  add(
    "title",
    "onpage",
    page.title ? "passed" : "critical",
    "Page title",
    page.title || "No non-empty title tag found.",
    "A descriptive title explains the page to readers and search engines.",
    "Write a unique, accurate title reflecting this page’s purpose.",
    4,
  );
  add(
    "title-length",
    "onpage",
    !page.title
      ? "unavailable"
      : page.title.length < 20 || page.title.length > 65
        ? "warning"
        : "passed",
    "Title display length",
    `${page.title.length} characters; review range 20–65 is a heuristic, not a Google rule.`,
    "Very short titles may lack context; long ones may be truncated or rewritten.",
    "Review the title for clarity and distinctiveness. Do not remove useful information only to hit a character count.",
    1,
  );
  add(
    "description",
    "onpage",
    yes(page.description),
    "Search snippet description",
    page.description || "No non-empty meta name='description' tag found.",
    "A useful description can help communicate the page in search snippets; search engines may choose other text.",
    "Write a unique, accurate description that reflects the visible page.",
    3,
  );
  add(
    "description-length",
    "onpage",
    !page.description
      ? "unavailable"
      : page.description.length < 70 || page.description.length > 165
        ? "warning"
        : "passed",
    "Description display length",
    `${page.description.length} characters; review range 70–165 is a heuristic.`,
    "Descriptions should explain the page naturally and may be shortened by search engines.",
    "Prioritize accuracy and useful detail over a strict character target.",
    1,
  );
  add(
    "h1",
    "onpage",
    page.h1.length === 0
      ? "critical"
      : page.h1.length === 1
        ? "passed"
        : "warning",
    "Main heading",
    `${page.h1.length} H1 element(s): ${page.h1.join(" | ").slice(0, 450)}`,
    "A clear main heading helps visitors identify the page purpose. Multiple H1s are a structure review, not an automatic ranking penalty.",
    "Use a clear main heading and organize subordinate sections logically.",
    3,
  );
  const skipped = page.headings.some(
    (h, i) => i > 0 && h.level > page.headings[i - 1].level + 1,
  );
  add(
    "heading-order",
    "onpage",
    yes(!skipped),
    "Heading hierarchy",
    skipped
      ? "At least one heading jumps down more than one level."
      : "No skipped levels detected between extracted headings.",
    "Logical headings improve navigation and accessibility.",
    "Nest subsections logically; choose headings for structure rather than font size.",
    1,
  );
  add(
    "image-alt",
    "onpage",
    page.images.total ? yes(page.images.missingAlt === 0) : "unavailable",
    "Image alternatives",
    `${page.images.missingAlt} missing alt attributes out of ${page.images.total} images; ${page.images.emptyAlt} explicitly empty.`,
    "Meaningful images need useful alternatives. Empty alt text can be correct for decorative images.",
    'Describe the actual purpose of informative images. Keep alt="" for decorative images; do not stuff keywords.',
    2,
  );
  const internal = page.links.filter((l) => l.internal);
  add(
    "internal",
    "onpage",
    yes(internal.length),
    "Internal navigation",
    `${internal.length} distinct internal links extracted (bounded sample).`,
    "Relevant internal links help visitors and crawlers discover related pages.",
    "Add useful links to genuinely related pages with descriptive anchor text.",
    2,
  );
  const generic = internal.filter(
    (l) => !l.text || /^(click here|read more|learn more|here)$/i.test(l.text),
  );
  add(
    "anchor",
    "onpage",
    yes(generic.length === 0),
    "Link descriptions",
    `${generic.length} empty or generic internal link labels in the sample.`,
    "Descriptive links help readers understand the destination out of context.",
    "Use natural labels describing the linked page. Check accessible names before changing icon-only links.",
    1,
  );
  const path = new URL(page.url).pathname;
  add(
    "url",
    "onpage",
    yes(path.length < 120 && !/[A-Z_]/.test(path)),
    "Readable URL",
    path,
    "Clear URLs can help people understand and share a page. Existing URLs should not change without a migration plan.",
    "For new pages use concise, readable paths. Redirect old URLs if a change is justified.",
    1,
  );
  add(
    "sections",
    "content",
    yes(page.headings.some((h) => h.level === 2)),
    "Content sections",
    `${page.headings.filter((h) => h.level === 2).length} H2 sections; ${page.wordCount} extracted word-like tokens.`,
    "Subheadings help people scan longer content. Short utility pages may not need them.",
    "Organize substantial content around the questions visitors need answered.",
    1,
  );
  add(
    "short-content",
    "content",
    page.wordCount < 80 ? "warning" : "passed",
    "Text available for assessment",
    `${page.wordCount} word-like tokens in server HTML; this is not a quality or minimum-word-count rule.`,
    "Very little server-visible text limits this audit. A JavaScript-rendered or intentionally concise page may still be useful.",
    "Review the rendered page and its purpose. Add only information visitors need, and ensure important content is accessible.",
    1,
  );
  add(
    "topic",
    "content",
    "unavailable",
    "Topic and intent assessment",
    input.keyword
      ? `Requested topic: ${input.keyword}. Semantic assessment requires the optional AI provider and human review.`
      : "No target topic supplied; semantic assessment is not included in the numeric score.",
    "Keyword repetition alone does not establish relevance or search intent.",
    "Compare the actual page with the audience’s needs. Use AI recommendations as suggestions to review, not measured keyword data.",
    0,
  );
  add(
    "freshness",
    "content",
    "unavailable",
    "Content freshness",
    page.dateModified.length
      ? `Date markup observed: ${page.dateModified.join(", ")}. Accuracy is unverified.`
      : "No publication or modification date markup found in sampled fields.",
    "Date markup does not establish factual freshness, and not every page needs a publication date.",
    "Review time-sensitive information against primary sources and update dates only when substantive updates occur.",
    0,
  );
  add(
    "size",
    "performance",
    yes(page.bytes <= 500_000),
    "HTML payload",
    `${Math.round(page.bytes / 1024)} KB decompressed HTML; ${Math.round(page.transferBytes / 1024)} KB transferred. Assets are excluded.`,
    "Large HTML documents can add transfer and parsing work. This does not measure total page weight.",
    "Reduce unnecessary markup and embedded data. Measure the rendered page with PageSpeed Insights.",
    2,
  );
  add(
    "compression",
    "performance",
    yes(page.compression || page.bytes < 10000),
    "HTML compression",
    page.compression || "No Content-Encoding header observed.",
    "Compression reduces the transfer size of text responses. Very small pages have limited benefit.",
    "Enable Brotli or gzip for compressible responses at the host or CDN.",
    1,
  );
  add(
    "cache",
    "performance",
    page.cacheControl ? "passed" : "warning",
    "Cache policy declaration",
    page.cacheControl || "No Cache-Control header observed.",
    "A declared policy helps control freshness. no-store can be appropriate for personalized pages.",
    "Set a suitable cache policy for each resource type; never cache private responses publicly.",
    1,
  );
  add(
    "fetch-time",
    "performance",
    "unavailable",
    "Server fetch timing",
    `${page.fetchMs} ms for this server-side request, including DNS and redirects; not visitor load time or Core Web Vitals.`,
    "Network location and timing make a single fetch unsuitable as a user-experience score.",
    "Use field data and repeated lab tests to investigate actual user experience.",
    0,
  );
  if (input.city || input.country || input.businessType || input.businessName) {
    const allText =
      `${page.text} ${page.title} ${page.description} ${JSON.stringify(page.schema.objects)}`.toLowerCase();
    add(
      "contact",
      "local",
      yes(page.phone.length || page.email.length),
      "Contact signals",
      `Telephone links: ${page.phone.join(", ") || "none"}; email links: ${page.email.join(", ") || "none"}.`,
      "Public contact information helps customers reach a business. This detector does not infer phone numbers from images.",
      "Publish accurate contact information for the real business.",
      2,
    );
    add(
      "business-schema",
      "local",
      yes(
        page.schema.types.some((t) =>
          /LocalBusiness|Organization|Store|Agency|Service|Restaurant|Hotel|Dentist|Plumber/i.test(
            t,
          ),
        ),
      ),
      "Business structured data",
      page.schema.types.join(", ") || "No JSON-LD business types detected.",
      "Factual business markup can describe the business and genuine locations.",
      "Use the most relevant schema type and real business details. Do not invent branches, addresses, or ratings.",
      1,
    );
    if (input.city)
      add(
        "city",
        "local",
        yes(allText.includes(input.city.toLowerCase())),
        "Target city reference",
        `Searched extracted content and schema for user-supplied city: ${input.city}.`,
        "Location references help visitors confirm that a service is relevant to their area. A name match does not verify service coverage.",
        "If genuinely served, explain how this location is covered. Create a dedicated location page only when useful and factually justified.",
        1,
      );
    if (input.country)
      add(
        "country",
        "local",
        yes(allText.includes(input.country.toLowerCase())),
        "Target country reference",
        `Searched for the exact country text: ${input.country}. Local-language variants may be missed.`,
        "Country context can clarify who a service is intended for.",
        "State genuine service regions where it helps customers.",
        1,
      );
    if (input.businessName)
      add(
        "name",
        "local",
        yes(allText.includes(input.businessName.toLowerCase())),
        "Business name reference",
        `Searched for user-supplied name: ${input.businessName}.`,
        "Consistent business naming can make identification easier.",
        "Use the actual trading name consistently; review legitimate abbreviations manually.",
        1,
      );
    add(
      "maps",
      "local",
      page.maps.length ? "passed" : "unavailable",
      "Maps reference",
      page.maps.join(", ") ||
        "No recognized Google Maps link found. This may be appropriate for an online-only business.",
      "Maps can help visitors find genuine customer-facing locations.",
      "Link an accurate eligible business location where relevant.",
      0,
    );
  } else
    add(
      "local-context",
      "local",
      "unavailable",
      "Local business context",
      "No optional business or target-location details supplied.",
      "Local checks need context to avoid irrelevant advice.",
      "Add factual business and location details to run applicable local checks.",
      0,
    );
  add(
    "og",
    "social",
    yes(page.og.title && page.og.description && page.og.image),
    "Social sharing tags",
    `Open Graph fields: ${Object.keys(page.og).join(", ") || "none"}. Image availability was not fetched.`,
    "Open Graph metadata helps platforms create useful link previews.",
    "Add accurate og:title, og:description, og:image and og:url, then preview the result.",
    2,
  );
  add(
    "twitter",
    "social",
    yes(page.twitter.card),
    "X/Twitter card",
    page.twitter.card || "No twitter:card declaration found.",
    "A card declaration can influence link previews on compatible platforms.",
    "Add an appropriate card declaration if this sharing channel matters to the business.",
    1,
  );
  add(
    "social-links",
    "social",
    page.social.length ? "passed" : "warning",
    "Website social references",
    page.social.join(", ") ||
      "No recognized social profile links found in extracted links.",
    "Official profile links can help people confirm the business identity.",
    "Link only the official, maintained profiles relevant to the business.",
    1,
  );
  return checks;
}
