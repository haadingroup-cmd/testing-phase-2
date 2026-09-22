import { randomUUID } from "node:crypto";
import * as cheerio from "cheerio";
import robotsParser from "robots-parser";
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
import type { AuditInput, AuditReport, Check, Page } from "./types";

export type CrawlTask = {
  url: string;
  kind: "page" | "sitemap";
  attempts: number;
};
export interface FullCrawl {
  version: 1;
  id: string;
  owner: string;
  input: AuditInput;
  createdAt: string;
  status: "queued" | "running" | "completed" | "cancelled" | "failed";
  origin: string;
  maxPages: number;
  queue: CrawlTask[];
  seen: string[];
  pages: Page[];
  skipped: { url: string; reason: string }[];
  robots: Record<string, { body: string; missing: boolean; fetched: number }>;
  lastAccess: Record<string, number>;
  sitemapCount: number;
  sitemapFound: number;
  coverageLimited: boolean;
  sequence: number;
  error?: string;
  runId?: string;
  aiRequested: boolean;
  aiLimit: number;
  aiReviews?: Record<
    string,
    { result?: NonNullable<AuditReport["ai"]>; error?: string }
  >;
  ai?: AuditReport["ai"];
  aiStatus: string;
}
export function newFullCrawl(
  input: AuditInput,
  owner: string,
  maxPages = 250,
  aiRequested = false,
): FullCrawl {
  const url = normalizeURL(input.url).href;
  if (!Number.isInteger(maxPages) || maxPages < 1 || maxPages > 500)
    throw new PublicError("Choose a crawl limit from 1 to 500 pages.");
  return {
    version: 1,
    id: randomUUID(),
    owner,
    input: { ...input, url },
    createdAt: new Date().toISOString(),
    status: "queued",
    origin: new URL(url).origin,
    maxPages,
    queue: [{ url, kind: "page", attempts: 0 }],
    seen: [url],
    pages: [],
    skipped: [],
    robots: {},
    lastAccess: {},
    sitemapCount: 0,
    sitemapFound: 0,
    coverageLimited: false,
    sequence: 0,
    aiRequested,
    aiLimit: maxPages,
    aiStatus: aiRequested
      ? "AI review pending after the crawl."
      : "AI review was not requested.",
  };
}
export function eligibleURL(raw: string, origin: string): string | null {
  try {
    const u = normalizeURL(new URL(raw, origin).href);
    if (
      u.origin !== origin ||
      u.search ||
      /\/(?:logout|signout|admin|wp-admin|cart|checkout|account|login|search)(?:\/|$)/i.test(
        u.pathname,
      ) ||
      /\.(?:pdf|png|jpe?g|gif|webp|svg|zip|json|mp4|mp3|css|js|woff2?|ttf)$/i.test(
        u.pathname,
      )
    )
      return null;
    return u.href;
  } catch {
    return null;
  }
}
function enqueue(state: FullCrawl, raw: string, kind: CrawlTask["kind"]) {
  const url = eligibleURL(raw, state.origin);
  if (!url || state.seen.includes(url)) return;
  if (state.seen.length >= 3000) {
    state.coverageLimited = true;
    return;
  }
  state.seen.push(url);
  state.queue.push({ url, kind, attempts: 0 });
}
class Deferred extends Error {
  constructor(public delayMs: number) {
    super("Respecting crawl delay");
  }
}

/** One bounded network task. JSON state can be checkpointed between calls. */
export async function advanceFullCrawl(
  state: FullCrawl,
  fetcher: Fetcher = safeFetch,
  now = Date.now(),
): Promise<number> {
  if (["completed", "cancelled", "failed"].includes(state.status)) return 0;
  if (Date.now() - Date.parse(state.createdAt) > 24 * 3600_000) {
    state.coverageLimited = true;
    state.skipped.push(
      ...state.queue.map((t) => ({
        url: t.url,
        reason: "24-hour crawl budget reached.",
      })),
    );
    state.queue = [];
    state.status = "completed";
    return 0;
  }
  state.status = "running";
  if (!state.queue.length || state.pages.length >= state.maxPages) {
    if (state.queue.length) {
      state.coverageLimited = true;
      state.skipped.push(
        ...state.queue.map((t) => ({
          url: t.url,
          reason: "Configured page limit reached; not analyzed.",
        })),
      );
    }
    state.queue = [];
    state.status = "completed";
    return 0;
  }
  const task = state.queue[0];
  const signal = AbortSignal.timeout(25000);
  let hops = 0;
  async function ruleFor(origin: string) {
    let rule = state.robots[origin];
    if (!rule || now - rule.fetched > 3600_000) {
      const r = await fetcher(`${origin}/robots.txt`, {
        signal,
        timeoutMs: 8000,
        maxBytes: 500_000,
        accept: "text/plain",
        beforeHop: async (hop) => {
          if (hop.origin !== origin)
            throw new PublicError("Robots redirect leaves its origin.");
        },
      });
      const missing = r.status === 404 || r.status === 410;
      if (
        !missing &&
        (r.status < 200 || r.status >= 300 || /<html[\s>]/i.test(r.body))
      )
        throw new PublicError(
          "Robots access could not be established; this URL was not crawled.",
        );
      rule = { body: missing ? "" : r.body, missing, fetched: now };
      state.robots[origin] = rule;
    }
    return robotsParser(`${origin}/robots.txt`, rule.body);
  }
  try {
    const response = await fetcher(task.url, {
      signal,
      timeoutMs: 10000,
      maxBytes: 2_000_000,
      beforeHop: async (hop) => {
        // The entry page may establish its canonical www/HTTPS origin. Later redirects stay inside it.
        if (state.pages.length && hop.origin !== state.origin)
          throw new PublicError("Redirect leaves this site crawl boundary.");
        const rules = await ruleFor(hop.origin);
        if (rules.isAllowed(hop.href, "HaadinGlobalAudit") === false)
          throw new PublicError(
            "URL is disallowed for this crawler by robots.txt.",
          );
        const delay = Math.max(
          500,
          (rules.getCrawlDelay("HaadinGlobalAudit") ??
            rules.getCrawlDelay("*") ??
            0) * 1000,
        );
        const wait = (state.lastAccess[hop.origin] || 0) + delay - Date.now();
        if (wait > 0) {
          if (hops === 0) throw new Deferred(wait);
          if (wait > 5000)
            throw new PublicError(
              "Redirect requires a crawl delay longer than this request budget; not fetched.",
            );
          await new Promise((resolve) => setTimeout(resolve, wait));
        }
        hops++;
        state.lastAccess[hop.origin] = Date.now();
      },
    });
    if (
      (response.status === 429 || response.status >= 500) &&
      task.attempts < 2
    ) {
      task.attempts++;
      return 30000 * task.attempts;
    }
    if (response.status < 200 || response.status >= 300)
      throw new PublicError(
        `HTTP ${response.status}; no successful document analyzed.`,
      );
    if (task.kind === "sitemap") {
      state.sitemapCount++;
      const $ = cheerio.load(response.body, { xml: true });
      if (!$("urlset,sitemapindex").length)
        throw new PublicError("Not a readable XML sitemap.");
      state.sitemapFound++;
      $("sitemapindex > sitemap > loc").each((_, el) => {
        if (
          state.sitemapCount +
            state.queue.filter((t) => t.kind === "sitemap").length <
          100
        )
          enqueue(state, $(el).text().trim(), "sitemap");
        else state.coverageLimited = true;
      });
      $("urlset > url > loc").each((_, el) =>
        enqueue(state, $(el).text().trim(), "page"),
      );
    } else {
      if (
        !/text\/html|application\/xhtml\+xml/i.test(
          response.headers["content-type"] || "",
        )
      )
        throw new PublicError("Not an HTML page.");
      if (state.pages.some((p) => p.url === response.url))
        throw new PublicError("Redirect resolves to an already analyzed page.");
      const page = parsePage(response, task.url);
      page.checks = pageChecks(page, state.input);
      page.score = calculateScores(page.checks).overall;
      if (!state.pages.length) {
        state.origin = new URL(page.url).origin;
        const rules = await ruleFor(state.origin);
        for (const sitemap of [
          ...rules.getSitemaps(),
          `${state.origin}/sitemap.xml`,
        ])
          enqueue(state, sitemap, "sitemap");
      }
      state.pages.push(page);
      for (const link of page.links) enqueue(state, link.url, "page");
    }
    state.queue.shift();
    state.sequence++;
  } catch (error) {
    if (error instanceof Deferred) return Math.min(error.delayMs, 3600_000);
    if (!(error instanceof PublicError) && task.attempts < 2) {
      task.attempts++;
      return 15000 * task.attempts;
    }
    state.skipped.push({ url: task.url, reason: friendlyError(error) });
    state.queue.shift();
    state.sequence++;
    if (!state.pages.length && task.kind === "page") {
      state.status = "failed";
      state.error =
        "The starting page could not be analyzed. See the recorded reason.";
    }
  }
  if (!state.queue.length && state.status !== "failed")
    state.status = "completed";
  return 500;
}
export function fullCrawlReport(state: FullCrawl): AuditReport {
  const checks = state.pages.flatMap((p) => p.checks);
  for (const field of ["title", "description"] as const) {
    const groups = new Map<string, string[]>();
    for (const p of state.pages) {
      const value = p[field].trim().toLowerCase();
      if (value) groups.set(value, [...(groups.get(value) || []), p.url]);
    }
    for (const urls of groups.values())
      if (urls.length > 1)
        checks.push({
          id: `duplicate:${field}:${urls[0]}`,
          pageUrl: urls[0],
          category: "onpage",
          status: "warning",
          title: `Repeated ${field}`,
          evidence: urls.join(" | "),
          explanation:
            "Exact repeats were found among crawled pages. Alternate versions may legitimately repeat metadata.",
          fix: "Review these URLs and give distinct pages accurate, distinct metadata.",
          priority: "Medium",
          difficulty: "Easy",
          weight: 2,
          source: "Website crawl",
        } satisfies Check);
  }
  const partial =
    state.status !== "completed" ||
    state.coverageLimited ||
    state.skipped.some((s) => !s.url.endsWith("/sitemap.xml"));
  return {
    version: "1.0",
    id: state.id,
    createdAt: state.createdAt,
    expiresAt: new Date(Date.now() + 86400_000).toISOString(),
    input: state.input,
    pages: state.pages,
    checks,
    skipped: state.skipped,
    discovered: state.seen.length,
    maxPages: state.maxPages,
    partial,
    robots: {
      url: `${state.origin}/robots.txt`,
      status: null,
      state: Object.keys(state.robots).length ? "found" : "unavailable",
      detail:
        "Per-origin robots rules checked before page access. Googlebot access and indexing are not inferred.",
    },
    sitemap: {
      url: `${state.origin}/sitemap.xml`,
      status: null,
      state: state.sitemapFound ? "found" : "unavailable",
      detail: `${state.sitemapFound} readable sitemap documents processed. Discovery includes same-origin sitemap entries and links.`,
    },
    ...calculateScores(checks),
    competitors: [],
    internalLinks: [],
    metrics: unavailableMetrics(),
    ai: state.ai || null,
    aiStatus: state.aiStatus,
    coverage: [
      `Site-wide discovery from sitemaps and links; ${state.pages.length} pages analyzed; configured safety limit ${state.maxPages}.`,
      "Queue exhaustion means all discovered eligible URLs were attempted, not proof that every URL on the site exists in this inventory.",
      "Only public same-origin HTML without query strings; login, checkout, admin, external subdomains, files and JavaScript-only links are excluded.",
      "Server HTML only; rendered JavaScript, Google indexing, backlinks, traffic, AI search visibility and Core Web Vitals are not measured by the check score.",
      "Robots restrictions, request failures, URL inventory limits and skipped pages remain visible. Scores exclude unavailable checks.",
      "No depth limit. Up to 100 sitemap documents, 3000 discovered tasks, 500 pages and a 24-hour job budget. Sitemap XML is size-limited to 2 MB per document.",
      "Background full-site runs do not include competitor crawls; use the separate public competitor comparison for supplied URLs.",
    ],
    warnings: [
      ...(partial
        ? [
            "Coverage is incomplete; review the skipped URLs and configured limits before drawing site-wide conclusions.",
          ]
        : []),
      ...(state.aiRequested
        ? [
            "Individual AI page reviews are available in the dashboard and JSON export. The PDF contains rule-based findings.",
          ]
        : []),
    ],
  };
}
