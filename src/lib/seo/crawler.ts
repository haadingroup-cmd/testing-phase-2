import robotsParser from "robots-parser";
import * as cheerio from "cheerio";
import { randomUUID } from "node:crypto";
import { setTimeout as delay } from "node:timers/promises";
import {
  safeFetch,
  normalizeURL,
  friendlyError,
  PublicError,
  type Fetcher,
} from "./security";
import { parsePage } from "./parser";
import { calculateScores, pageChecks } from "./scoring";
import { unavailableMetrics } from "./providers";
import type { AuditInput, AuditReport, Check, Resource, Page } from "./types";

const int = (name: string, fallback: number, min: number, max: number) => {
  const raw = process.env[name];
  const n = raw === undefined || raw === "" ? fallback : Number(raw);
  return Math.max(min, Math.min(max, Number.isFinite(n) ? n : fallback));
};
export interface CrawlOptions {
  fetcher?: Fetcher;
  maxPages?: number;
  delayMs?: number;
  signal?: AbortSignal;
  progress?: (message: string, completed?: number) => void;
}
const templateCheck = (
  id: string,
  pageUrl: string,
  props: Partial<Check>,
): Check => ({
  id,
  pageUrl,
  category: "technical",
  status: "warning",
  title: "",
  explanation: "",
  fix: "",
  evidence: "",
  priority: "Medium",
  weight: 1,
  source: "Website crawl",
  difficulty: "Easy",
  ...props,
});

export async function crawlWebsite(
  input: AuditInput,
  options: CrawlOptions = {},
): Promise<AuditReport> {
  const fetcher = options.fetcher ?? safeFetch;
  const maxPages = options.maxPages ?? int("MAX_CRAWL_PAGES", 11, 1, 11);
  const maxDepth = int("MAX_CRAWL_DEPTH", 2, 0, 3);
  const started = Date.now();
  const budget = int("CRAWL_TOTAL_BUDGET_MS", 75000, 5000, 90000);
  const signal = AbortSignal.any([
    ...(options.signal ? [options.signal] : []),
    AbortSignal.timeout(budget),
  ]);
  const timeoutMs = int("CRAWL_TIMEOUT_MS", 8000, 1000, 12000);
  const progress = options.progress ?? (() => {});
  const rules = new Map<
    string,
    {
      parser: ReturnType<typeof robotsParser> | null;
      resource: Resource;
      deny: boolean;
      delay: number;
    }
  >();
  const lastAccess = new Map<string, number>();
  const pages: Page[] = [],
    skipped: AuditReport["skipped"] = [],
    siteChecks: Check[] = [];
  const baseDelay = options.delayMs ?? int("CRAWL_DELAY_MS", 300, 200, 5000);
  async function robots(origin: string) {
    const existing = rules.get(origin);
    if (existing) return existing;
    const url = `${origin}/robots.txt`;
    let rule: {
      parser: ReturnType<typeof robotsParser> | null;
      resource: Resource;
      deny: boolean;
      delay: number;
    };
    try {
      const r = await fetcher(url, {
        signal,
        timeoutMs,
        maxBytes: 500_000,
        accept: "text/plain",
        beforeHop: async (hop) => {
          if (hop.origin !== origin)
            throw new PublicError(
              "Robots rules redirect to a different origin; access could not be confirmed.",
            );
        },
      });
      const found =
        r.status >= 200 && r.status < 300 && !/<html[\s>]/i.test(r.body);
      const missing = r.status === 404 || r.status === 410;
      const parser = found ? robotsParser(url, r.body) : null;
      rule = {
        parser,
        deny: !found && !missing,
        delay: Math.max(
          baseDelay,
          (parser?.getCrawlDelay("HaadiGlobalAudit") ??
            parser?.getCrawlDelay("*") ??
            0) * 1000,
        ),
        resource: {
          url,
          status: r.status,
          state: found ? "found" : missing ? "missing" : "unavailable",
          detail: found
            ? "Robots rules retrieved and applied to this crawler. Googlebot may have different rules."
            : missing
              ? "No robots file at this location. This does not itself prevent indexing."
              : "Robots access could not be established; crawling this origin was stopped.",
        },
      };
    } catch {
      rule = {
        parser: null,
        deny: true,
        delay: baseDelay,
        resource: {
          url,
          status: null,
          state: "unavailable",
          detail:
            "Robots rules could not be fetched. Crawling this origin was stopped conservatively.",
        },
      };
    }
    rules.set(origin, rule);
    return rule;
  }
  async function fetchPage(url: string) {
    return fetcher(url, {
      signal,
      timeoutMs,
      beforeHop: async (hop) => {
        const rule = await robots(hop.origin);
        if (
          rule.deny ||
          rule.parser?.isAllowed(hop.href, "HaadiGlobalAudit") === false
        )
          throw new PublicError(
            "Access is restricted by robots.txt or robots access could not be confirmed.",
          );
        const wait = Math.max(
          0,
          rule.delay - (Date.now() - (lastAccess.get(hop.origin) ?? 0)),
        );
        if (Date.now() - started + wait > budget)
          throw new PublicError(
            "The crawl time limit was reached before the required crawl delay.",
          );
        if (wait) await delay(wait, undefined, { signal });
        lastAccess.set(hop.origin, Date.now());
      },
    });
  }
  progress("Checking public access and robots.txt…", 0);
  const entry = normalizeURL(input.url).href;
  await robots(new URL(entry).origin);
  progress("Fetching and analyzing the starting page…", 0);
  let first;
  try {
    first = await fetchPage(entry);
  } catch (error) {
    throw new PublicError(friendlyError(error));
  }
  if (first.status < 200 || first.status >= 300)
    throw new PublicError(
      `The website returned HTTP ${first.status}. We could not analyze a successful page; no SEO score was created.`,
    );
  if (
    !/text\/html|application\/xhtml\+xml/i.test(
      first.headers["content-type"] || "",
    )
  )
    throw new PublicError(
      "The URL did not return an HTML webpage. Enter a page URL rather than a file or API endpoint.",
    );
  const home = parsePage(first, entry);
  home.checks = pageChecks(home, input);
  home.score = calculateScores(home.checks).overall;
  pages.push(home);
  const origin = new URL(home.url).origin;
  const rootRule = await robots(origin);
  const queue: { url: string; depth: number }[] = [];
  const discovered = new Set<string>([home.url]);
  const visited = new Set([entry, home.url]);
  function enqueue(page: Page, depth: number) {
    if (depth >= maxDepth) return;
    for (const link of page.links) {
      if (discovered.size >= 500) break;
      const url = new URL(link.url);
      url.hash = "";
      if (
        url.origin !== origin ||
        url.search ||
        /\.(?:pdf|png|jpg|jpeg|gif|webp|svg|zip|xml|json|mp4|mp3|css|js|woff2?|ttf)$/i.test(
          url.pathname,
        )
      )
        continue;
      if (
        /\/(?:logout|signout|admin|wp-admin|cart|checkout|account|login|search)(?:\/|$)/i.test(
          url.pathname,
        )
      )
        continue;
      if (!discovered.has(url.href)) {
        discovered.add(url.href);
        queue.push({ url: url.href, depth: depth + 1 });
      }
    }
  }
  enqueue(home, 0);
  let attempts = 1;
  while (
    queue.length &&
    pages.length < maxPages &&
    attempts < maxPages + 5 &&
    !signal.aborted
  ) {
    const item = queue.shift()!;
    if (visited.has(item.url)) continue;
    visited.add(item.url);
    attempts++;
    progress(
      `Analyzing page ${pages.length + 1} of up to ${maxPages}: ${new URL(item.url).pathname}`,
      pages.length,
    );
    try {
      const r = await fetchPage(item.url);
      if (new URL(r.url).origin !== origin) {
        skipped.push({
          url: item.url,
          reason: "Redirect leaves the site crawl boundary.",
        });
        continue;
      }
      if (r.status < 200 || r.status >= 300) {
        skipped.push({ url: item.url, reason: `HTTP ${r.status}` });
        siteChecks.push(
          templateCheck(`http:${item.url}`, item.url, {
            status: r.status >= 400 ? "critical" : "warning",
            title: "Linked page response",
            evidence: `HTTP ${r.status} returned for a sampled internal link.`,
            explanation:
              "Visitors and crawlers may not reach the intended content.",
            fix: "Check the destination and update or repair the link.",
            weight: 3,
            priority: "First",
            difficulty: "Developer",
          }),
        );
        continue;
      }
      if (
        !/text\/html|application\/xhtml\+xml/i.test(
          r.headers["content-type"] || "",
        )
      ) {
        skipped.push({ url: item.url, reason: "Not an HTML document." });
        continue;
      }
      if (pages.some((p) => p.url === r.url)) {
        skipped.push({
          url: item.url,
          reason: "Redirects to an already analyzed page.",
        });
        continue;
      }
      const page = parsePage(r, item.url);
      page.checks = pageChecks(page, input);
      page.score = calculateScores(page.checks).overall;
      pages.push(page);
      enqueue(page, item.depth);
    } catch (error) {
      skipped.push({ url: item.url, reason: friendlyError(error) });
    }
  }
  const pending = queue.filter((q) => !visited.has(q.url));
  for (const item of pending.slice(0, 50))
    skipped.push({
      url: item.url,
      reason: signal.aborted
        ? "Crawl time budget reached."
        : "Free crawl or request limit reached.",
    });
  progress("Checking sitemap and cross-page signals…", pages.length);
  let sitemap: Resource = {
    url: `${origin}/sitemap.xml`,
    status: null,
    state: "unavailable",
    detail: "Not fetched within this audit’s time budget.",
  };
  if (!signal.aborted) {
    const declared = rootRule.parser?.getSitemaps().find((url) => {
      try {
        return new URL(url).origin === origin;
      } catch {
        return false;
      }
    });
    const url = declared || `${origin}/sitemap.xml`;
    try {
      const r = await fetchPage(url);
      const $ = cheerio.load(r.body, { xml: true });
      const validRoot = $("urlset,sitemapindex").length > 0;
      sitemap = {
        url,
        status: r.status,
        state:
          r.status === 200 && validRoot
            ? "found"
            : r.status === 404
              ? "missing"
              : "unavailable",
        detail:
          r.status === 200 && validRoot
            ? `An XML sitemap or index was detected. Entries and child sitemaps were not exhaustively fetched.`
            : "No readable XML sitemap was confirmed at the checked URL.",
      };
    } catch (error) {
      sitemap = {
        url,
        status: null,
        state: "unavailable",
        detail: friendlyError(error),
      };
    }
  }
  siteChecks.push(
    templateCheck("sitemap", home.url, {
      title: "XML sitemap discovery",
      status:
        sitemap.state === "found"
          ? "passed"
          : sitemap.state === "missing"
            ? "warning"
            : "unavailable",
      evidence: `${sitemap.url}: ${sitemap.detail}`,
      explanation:
        "Sitemaps can help search engines discover intended canonical URLs.",
      fix: "Publish a valid sitemap and submit it to the appropriate search engine tools.",
      weight: 1,
    }),
  );
  siteChecks.push(
    templateCheck("robots", home.url, {
      title: "Robots access for sampled pages",
      status: rootRule.deny ? "unavailable" : "passed",
      evidence: rootRule.resource.detail,
      explanation:
        "Robots rules control crawler access; they do not prove indexing.",
      fix: "Review crawler-specific rules and keep intentionally restricted paths blocked.",
      weight: 1,
    }),
  );
  for (const field of ["title", "description"] as const) {
    const groups = new Map<string, Page[]>();
    for (const p of pages) {
      const value = p[field].toLowerCase().trim();
      if (value) groups.set(value, [...(groups.get(value) || []), p]);
    }
    const duplicates = [...groups.values()].filter((g) => g.length > 1);
    siteChecks.push(
      templateCheck(`duplicate-${field}`, home.url, {
        category: "onpage",
        title: `Repeated ${field === "title" ? "titles" : "descriptions"} in sample`,
        status:
          pages.length < 2
            ? "unavailable"
            : duplicates.length
              ? "warning"
              : "passed",
        evidence: duplicates.length
          ? duplicates.map((g) => g.map((p) => p.url).join(", ")).join(" | ")
          : `No exact repeats among ${pages.length} sampled pages.`,
        explanation:
          "Distinct pages benefit from accurate, distinctive metadata. Repeats can be legitimate on alternate versions.",
        fix: "Review repeated metadata and differentiate genuinely distinct pages.",
        weight: 2,
      }),
    );
  }
  const phones = [
    ...new Set(
      pages.flatMap((p) => p.phone.map((x) => x.replace(/[^\d+]/g, ""))),
    ),
  ];
  siteChecks.push(
    templateCheck("nap-consistency", home.url, {
      category: "local",
      title: "On-site contact consistency",
      status: "unavailable",
      evidence: `${phones.length} distinct telephone link values in ${pages.length} pages. Multiple numbers may be legitimate; external listings were not checked.`,
      explanation:
        "Name, address and phone consistency requires matching the correct business entities.",
      fix: "Compare the genuine contact details across pages, schema and authorized business listings.",
      weight: 0,
    }),
  );
  const platformHosts: Record<string, string[]> = {
    facebook: ["facebook.com"],
    instagram: ["instagram.com"],
    youtube: ["youtube.com", "youtu.be"],
    tiktok: ["tiktok.com"],
    linkedin: ["linkedin.com"],
  };
  for (const [platform, value] of Object.entries(input.social))
    if (value) {
      let valid = false,
        linked = false;
      try {
        const url = normalizeURL(value);
        valid = platformHosts[platform].some(
          (h) => url.hostname === h || url.hostname.endsWith(`.${h}`),
        );
        linked = pages.some((p) =>
          p.social.some(
            (s) => s.replace(/\/$/, "") === url.href.replace(/\/$/, ""),
          ),
        );
      } catch {}
      siteChecks.push(
        templateCheck(`profile:${platform}`, home.url, {
          category: "social",
          title: `${platform} profile reference`,
          status: valid && linked ? "passed" : "warning",
          evidence: !valid
            ? "The supplied URL does not match the selected platform."
            : linked
              ? "The supplied profile URL is referenced by sampled website HTML."
              : "A valid platform URL was supplied but no exact reference was found in sampled website links.",
          explanation:
            "This checks URL structure and on-site references, not profile ownership or public profile completeness.",
          fix: "Verify the official profile and link it accurately where relevant.",
          weight: 1,
        }),
      );
    }
  siteChecks.push(
    templateCheck("profile-access", home.url, {
      category: "social",
      status: "unavailable",
      title: "Social profile contents and audience metrics",
      evidence:
        "Not publicly available from this crawl. Profile bios, follower counts, reach, engagement and platform rankings were not fetched.",
      explanation:
        "Social platforms may restrict automated access. No profile completeness score is inferred.",
      fix: "Review the official profiles manually or connect an authorized provider when available.",
      weight: 0,
    }),
  );
  const competitors: AuditReport["competitors"] = [];
  for (const url of input.competitors) {
    if (signal.aborted) {
      competitors.push({
        url,
        error: "Audit time budget reached before competitor analysis.",
      });
      continue;
    }
    progress(
      `Checking competitor homepage: ${new URL(url).hostname}`,
      pages.length,
    );
    try {
      const r = await fetchPage(url);
      if (
        r.status < 200 ||
        r.status >= 300 ||
        !/text\/html|application\/xhtml\+xml/i.test(
          r.headers["content-type"] || "",
        )
      )
        throw new PublicError(
          `No successful HTML page was available (HTTP ${r.status}).`,
        );
      const p = parsePage(r, url);
      p.checks = pageChecks(p, { url, competitors: [], social: {} });
      p.score = calculateScores(p.checks).overall;
      competitors.push({ url, page: p });
    } catch (error) {
      competitors.push({ url, error: friendlyError(error) });
    }
  }
  const internalLinks: AuditReport["internalLinks"] = [];
  for (const from of pages)
    for (const to of pages) {
      if (
        from === to ||
        internalLinks.length >= 8 ||
        from.links.some((l) => l.url === to.url)
      )
        continue;
      const phrase = (to.h1[0] || to.title).split(/[|–—]/)[0].trim();
      if (
        phrase.length >= 8 &&
        phrase.length <= 100 &&
        from.text.toLowerCase().includes(phrase.toLowerCase())
      )
        internalLinks.push({
          from: from.url,
          to: to.url,
          anchor: phrase,
          reason:
            "The destination heading or title phrase occurs in the source page text, and no exact link to this destination was found. Review context before linking.",
        });
    }
  const checks = [...pages.flatMap((p) => p.checks), ...siteChecks];
  const scoring = calculateScores(checks);
  return {
    version: "1.0",
    id: randomUUID(),
    createdAt: new Date().toISOString(),
    expiresAt: new Date(Date.now() + 86400000).toISOString(),
    input,
    pages,
    skipped,
    discovered: discovered.size,
    maxPages,
    partial: skipped.length > 0 || signal.aborted,
    robots: rootRule.resource,
    sitemap,
    checks,
    ...scoring,
    competitors,
    internalLinks,
    metrics: unavailableMetrics(),
    ai: null,
    aiStatus: "AI explanations require a configured provider.",
    coverage: [
      "Server-returned HTML only; JavaScript was not executed.",
      `Up to ${maxPages} pages, maximum depth ${maxDepth}; same-origin links without query strings. Discovered count is a bounded crawl sample, not total site size.`,
      "Broken-link findings cover only requested internal URLs. External links, assets, rendered layout, all sitemap URLs and Google index status were not checked.",
      "Structured data checks cover JSON-LD syntax and extracted types, not full schema or rich-result validation.",
      "Performance score covers HTML payload, compression and cache declarations. It is not a Lighthouse or Core Web Vitals score.",
      "Content scores cover observable structure and text availability. Semantic AI assessments are separate and do not alter the score.",
      "Social score covers website sharing metadata and profile references. It does not measure social account SEO or engagement.",
    ],
    warnings: [
      ...(signal.aborted
        ? [
            "The crawl reached its time budget; the report covers completed requests only.",
          ]
        : []),
      ...(home.wordCount < 80
        ? [
            "Little text was returned in the initial HTML. Review the rendered page before making content decisions.",
          ]
        : []),
    ],
  };
}
