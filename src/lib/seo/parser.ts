import * as cheerio from "cheerio";
import type { Page } from "./types";
import type { FetchResult } from "./security";

export const clean = (text: string) => text.replace(/\s+/g, " ").trim();
const unique = (values: string[]) => [...new Set(values.filter(Boolean))];
export function parsePage(
  result: FetchResult,
  requestedUrl = result.url,
): Page {
  const $ = cheerio.load(result.body);
  const meta = (name: string) =>
    $(`meta[name="${name}" i]`).first().attr("content")?.trim() || "";
  const property = (prefix: string) =>
    Object.fromEntries(
      $(`meta[property^="${prefix}:"],meta[name^="${prefix}:"]`)
        .slice(0, 20)
        .toArray()
        .map((el) => [
          ($(el).attr("property") || $(el).attr("name") || "")
            .split(":")
            .slice(1)
            .join(":")
            .slice(0, 80),
          ($(el).attr("content") || "").slice(0, 1000),
        ]),
    );
  const absolute = (raw: string) => {
    if (raw.length > 2048) return "";
    try {
      return new URL(raw, result.url).href;
    } catch {
      return "";
    }
  };
  const headings = $("h1,h2,h3,h4,h5,h6")
    .toArray()
    .map((el) => ({
      level: Number(el.tagName.slice(1)),
      text: clean($(el).text()).slice(0, 300),
    }))
    .slice(0, 100);
  const schema: Page["schema"] = { types: [], errors: [], objects: [] };
  let schemaBudget = 16000;
  const walk = (v: unknown, depth = 0) => {
    if (depth > 12 || schema.objects.length >= 20) return;
    if (Array.isArray(v)) {
      v.forEach((x) => walk(x, depth + 1));
      return;
    }
    if (!v || typeof v !== "object") return;
    const obj = v as Record<string, unknown>;
    if (obj["@type"]) {
      const types = Array.isArray(obj["@type"]) ? obj["@type"] : [obj["@type"]];
      schema.types.push(
        ...types
          .filter((x) => typeof x === "string")
          .slice(0, 20)
          .map((x) => String(x).slice(0, 100)),
      );
      // Store only bounded useful factual fields; don't copy arbitrary scripts to a report.
      const compact: Record<string, unknown> = {};
      for (const key of [
        "@type",
        "@id",
        "name",
        "url",
        "telephone",
        "address",
        "openingHours",
        "sameAs",
        "dateModified",
        "datePublished",
        "headline",
      ]) {
        if (obj[key] !== undefined && JSON.stringify(obj[key]).length < 800)
          compact[key] = obj[key];
      }
      const size = JSON.stringify(compact).length;
      if (size <= schemaBudget) {
        schema.objects.push(compact);
        schemaBudget -= size;
      }
    }
    for (const value of Object.values(obj))
      if (typeof value === "object") walk(value, depth + 1);
  };
  $('script[type="application/ld+json"]')
    .slice(0, 40)
    .each((i, el) => {
      try {
        const parsed = JSON.parse($(el).text());
        if (!parsed || typeof parsed !== "object") throw new Error();
        walk(parsed);
      } catch {
        schema.errors.push(
          `JSON-LD block ${i + 1} is not a valid JSON object or array.`,
        );
      }
    });
  schema.types = unique(schema.types);
  const links: Page["links"] = [];
  const seen = new Set<string>();
  let linkBudget = 32000;
  $("a[href]")
    .slice(0, 2000)
    .each((_, el) => {
      if (links.length >= 350 || linkBudget <= 0) return false;
      const raw = $(el).attr("href") || "";
      if (!raw || raw.startsWith("#")) return;
      const url = absolute(raw);
      if (!/^https?:\/\//i.test(url) || seen.has(url)) return;
      seen.add(url);
      if (url.length + 120 > linkBudget) return;
      linkBudget -= url.length + 120;
      links.push({
        url,
        text: clean($(el).text() || $(el).find("img").attr("alt") || "").slice(
          0,
          120,
        ),
        internal: new URL(url).origin === new URL(result.url).origin,
      });
    });
  const imgs = $("img");
  const imageExamples: string[] = [];
  imgs.each((_, el) => {
    if ($(el).attr("alt") === undefined && imageExamples.length < 5)
      imageExamples.push(absolute($(el).attr("src") || "").slice(0, 300));
  });
  const phone = unique(
    $('a[href^="tel:"]')
      .toArray()
      .map((el) =>
        ($(el).attr("href") || "")
          .replace(/^tel:/, "")
          .split("?")[0]
          .slice(0, 80),
      ),
  ).slice(0, 20);
  const email = unique(
    $('a[href^="mailto:"]')
      .toArray()
      .map((el) =>
        ($(el).attr("href") || "")
          .replace(/^mailto:/, "")
          .split("?")[0]
          .slice(0, 200),
      ),
  ).slice(0, 10);
  const maps = links
    .filter((l) =>
      /(?:google\.[^/]+\/maps|maps\.google\.|maps\.app\.goo\.gl|goo\.gl\/maps)/.test(
        l.url,
      ),
    )
    .map((l) => l.url);
  const social = links
    .filter((l) => {
      const host = new URL(l.url).hostname.toLowerCase();
      return /(?:^|\.)(facebook\.com|instagram\.com|youtube\.com|youtu\.be|tiktok\.com|linkedin\.com|x\.com|twitter\.com)$/.test(
        host,
      );
    })
    .map((l) => l.url);
  const mixedContent =
    new URL(result.url).protocol === "https:"
      ? unique(
          $(
            'img[src],script[src],link[rel="stylesheet"][href],iframe[src],video[src],audio[src],source[src],form[action]',
          )
            .toArray()
            .map(
              (el) =>
                $(el).attr("src") ||
                $(el).attr("href") ||
                $(el).attr("action") ||
                "",
            )
            .filter((x) => /^http:\/\//i.test(x))
            .map((x) => x.slice(0, 300)),
        ).slice(0, 20)
      : [];
  const title = clean($("title").first().text());
  const h1 = $("h1")
    .toArray()
    .map((el) => clean($(el).text()).slice(0, 500))
    .slice(0, 30);
  const canonicalRaw = $('link[rel~="canonical" i]').first().attr("href") || "";
  const favicon = $('link[rel~="icon" i]').length > 0;
  const dates = unique([
    ...$("time[datetime]")
      .toArray()
      .map((el) => $(el).attr("datetime") || ""),
    ...schema.objects.map((o) =>
      String(o.dateModified || o.datePublished || ""),
    ),
  ])
    .slice(0, 10)
    .map((x) => x.slice(0, 100));
  $(
    'script,style,noscript,template,svg,nav,footer,header,[hidden],[aria-hidden="true"]',
  ).remove();
  const text = clean($("main").length ? $("main").text() : $("body").text());
  const wordCount = [...text.matchAll(/[\p{L}\p{N}]+(?:['’-][\p{L}\p{N}]+)*/gu)]
    .length;
  return {
    url: result.url,
    requestedUrl,
    status: result.status,
    redirects: result.redirects,
    title: title.slice(0, 500),
    description: meta("description").slice(0, 1000),
    h1,
    headings,
    canonical: canonicalRaw ? absolute(canonicalRaw) : "",
    robots: meta("robots").slice(0, 1000),
    xRobots: (result.headers["x-robots-tag"] || "").slice(0, 1000),
    lang: ($("html").attr("lang") || "").slice(0, 50),
    viewport: meta("viewport").slice(0, 300),
    charset:
      $("meta[charset]").attr("charset") ||
      (result.headers["content-type"]?.match(/charset=([^;]+)/i)?.[1] ?? ""),
    wordCount,
    text: text.slice(0, 12000),
    links: links.slice(0, 350),
    images: {
      total: imgs.length,
      missingAlt: imgs.filter((_, el) => $(el).attr("alt") === undefined)
        .length,
      emptyAlt: imgs.filter((_, el) => $(el).attr("alt") === "").length,
      examples: imageExamples,
    },
    schema,
    social: unique(social).slice(0, 25),
    og: property("og"),
    twitter: property("twitter"),
    contentType: result.headers["content-type"] || "",
    bytes: result.bytes,
    transferBytes: result.transferBytes,
    fetchMs: result.fetchMs,
    compression: result.headers["content-encoding"] || "",
    cacheControl: result.headers["cache-control"] || "",
    favicon,
    mixedContent,
    phone,
    email,
    maps,
    dateModified: dates,
    score: null,
    checks: [],
  };
}
