import test from "node:test";
import assert from "node:assert/strict";
import { crawlWebsite } from "../../src/lib/seo/crawler";
import { parsePage } from "../../src/lib/seo/parser";
import { calculateScores, pageChecks } from "../../src/lib/seo/scoring";
import { csvCell, reportCSV } from "../../src/lib/seo/export";
import { signReport, verifyReport } from "../../src/lib/seo/seal";
import { generateAI } from "../../src/lib/seo/ai";
import { PageSpeedProvider } from "../../src/lib/seo/providers";
import { fixtureHTML, fixtureFetcher, input, result } from "./fixtures";

test("parses actual metadata, JSON-LD and empty decorative ALT without inventing problems", () => {
  const p = parsePage(result(input.url, fixtureHTML()));
  assert.equal(p.h1[0], "Airport transfers");
  assert.equal(p.images.missingAlt, 0);
  assert.equal(p.images.emptyAlt, 1);
  assert.ok(p.schema.types.includes("Organization"));
  assert.equal(p.og.title, "Airport transfers");
  assert.ok(!p.text.includes("This navigation"));
  const checks = pageChecks(p, input);
  assert.equal(
    checks.find((c) => c.id.endsWith("::image-alt"))?.status,
    "passed",
  );
  assert.equal(
    checks.find((c) => c.id.endsWith("::indexable"))?.status,
    "passed",
  );
});
test("missing metadata, H1 and image alternatives produce evidence-backed findings", () => {
  const p = parsePage(result(input.url, fixtureHTML({ missing: true })));
  const checks = pageChecks(p, input);
  assert.equal(p.title, "");
  assert.equal(
    checks.find((c) => c.id.endsWith("::title"))?.status,
    "critical",
  );
  assert.equal(checks.find((c) => c.id.endsWith("::h1"))?.status, "critical");
  assert.equal(
    checks.find((c) => c.id.endsWith("::image-alt"))?.status,
    "warning",
  );
});
test("noindex and malformed schema are detected without claiming Google indexing", () => {
  const p = parsePage(
    result(input.url, fixtureHTML({ noindex: true, schema: "{not valid}" })),
  );
  const checks = pageChecks(p, input);
  assert.equal(
    checks.find((c) => c.id.endsWith("::indexable"))?.status,
    "critical",
  );
  assert.equal(p.schema.errors.length, 1);
  assert.equal(
    checks.find((c) => c.id.endsWith("::schema"))?.status,
    "warning",
  );
});
test("unavailable checks do not become zero scores or proprietary metrics", () => {
  const p = parsePage(result(input.url, fixtureHTML()));
  const scores = calculateScores(pageChecks(p, input));
  assert.equal(scores.scores.find((c) => c.category === "local")?.score, null);
  assert.ok(scores.overall !== null);
  assert.equal(calculateScores([]).overall, null);
});
test("small website crawl respects robots, counts pages and reports real sources", async () => {
  const fixture = fixtureFetcher();
  const events: string[] = [];
  const report = await crawlWebsite(input, {
    fetcher: fixture.fetcher,
    delayMs: 0,
    progress: (m) => events.push(m),
  });
  assert.equal(report.pages.length, 3);
  assert.equal(report.sitemap.state, "found");
  assert.ok(events.length >= 3);
  assert.ok(report.metrics.every((m) => m.value === null));
  assert.ok(report.pages.every((p) => p.status === 200));
});
test("large website stops at eleven pages and records crawl-limit skips", async () => {
  const fixture = fixtureFetcher({ links: 80 });
  const report = await crawlWebsite(input, {
    fetcher: fixture.fetcher,
    delayMs: 0,
  });
  assert.equal(report.pages.length, 11);
  assert.ok(report.skipped.length > 0);
  assert.equal(report.discovered, 81);
  assert.ok(
    fixture.calls.filter((u) => !u.endsWith(".txt") && !u.endsWith(".xml"))
      .length <= 11,
  );
});
test("robots restrictions stop prohibited page fetches and never assign them bad SEO scores", async () => {
  const fixture = fixtureFetcher({
    robots: "User-agent: *\nDisallow: /page-1",
  });
  const report = await crawlWebsite(input, {
    fetcher: fixture.fetcher,
    delayMs: 0,
  });
  assert.equal(report.pages.length, 2);
  assert.ok(
    report.skipped.some(
      (s) => s.url.endsWith("page-1") && s.reason.includes("restricted"),
    ),
  );
  const denied = fixtureFetcher({ robots: "User-agent: *\nDisallow: /" });
  await assert.rejects(
    crawlWebsite(input, { fetcher: denied.fetcher, delayMs: 0 }),
    /restricted/,
  );
});
test("HTTP errors and slow internal pages are represented as inaccessible, not invented page audits", async () => {
  const broken = fixtureFetcher({ broken: true });
  const report = await crawlWebsite(input, {
    fetcher: broken.fetcher,
    delayMs: 0,
  });
  assert.equal(report.pages.length, 2);
  assert.ok(
    report.checks.some(
      (c) => c.title === "Linked page response" && c.status === "critical",
    ),
  );
  const slow = fixtureFetcher({ slow: true });
  const partial = await crawlWebsite(input, {
    fetcher: slow.fetcher,
    delayMs: 0,
  });
  assert.equal(partial.pages.length, 1);
  assert.equal(partial.partial, true);
  const failed = fixtureFetcher({ homeStatus: 503 });
  await assert.rejects(
    crawlWebsite(input, { fetcher: failed.fetcher, delayMs: 0 }),
    /no SEO score/,
  );
});
test("duplicate titles refer only to the crawled sample", async () => {
  const fixture = fixtureFetcher({ duplicate: true });
  const report = await crawlWebsite(input, {
    fetcher: fixture.fetcher,
    delayMs: 0,
  });
  const duplicate = report.checks.find((c) => c.id === "duplicate-title");
  assert.equal(duplicate?.status, "warning");
  assert.ok(duplicate?.evidence.includes("page-1"));
});
test("competitor analysis uses a fetched page and labels its scope", async () => {
  const fixture = fixtureFetcher();
  const report = await crawlWebsite(
    { ...input, competitors: ["https://competitor-example.com/"] },
    { fetcher: fixture.fetcher, delayMs: 0, maxPages: 1 },
  );
  assert.equal(report.competitors.length, 1);
  assert.equal(report.competitors[0].page?.status, 200);
  assert.equal(
    report.competitors[0].page?.url,
    "https://competitor-example.com/",
  );
});
test("local checks require business context and social references never infer followers", async () => {
  const fixture = fixtureFetcher();
  const report = await crawlWebsite(
    {
      ...input,
      city: "Makkah",
      social: { facebook: "https://www.facebook.com/fixture" },
    },
    { fetcher: fixture.fetcher, delayMs: 0, maxPages: 1 },
  );
  assert.equal(
    report.checks.find((c) => c.id === "profile:facebook")?.status,
    "passed",
  );
  assert.equal(
    report.checks.find((c) => c.id === "profile-access")?.status,
    "unavailable",
  );
  assert.ok(report.scores.find((c) => c.category === "local")?.score !== null);
});
test("report seals reject modifications and expiry", async () => {
  const fixture = fixtureFetcher();
  const report = await crawlWebsite(input, {
    fetcher: fixture.fetcher,
    delayMs: 0,
    maxPages: 1,
  });
  const signed = signReport(report);
  assert.equal(verifyReport(signed).id, report.id);
  assert.throws(
    () => verifyReport({ ...signed, report: { ...report, overall: 99 } }),
    /changed/,
  );
  assert.throws(
    () =>
      verifyReport(
        signReport({ ...report, expiresAt: "2000-01-01T00:00:00Z" }),
      ),
    /expired/,
  );
});
test("CSV neutralizes spreadsheet formulas and preserves quoting", async () => {
  assert.equal(csvCell('=HYPERLINK("x")'), '"\'=HYPERLINK(""x"")"');
  assert.ok(csvCell(" +SUM(1)").startsWith("\"'"));
  const fixture = fixtureFetcher();
  const report = await crawlWebsite(input, {
    fetcher: fixture.fetcher,
    delayMs: 0,
    maxPages: 1,
  });
  assert.ok(reportCSV(report).startsWith('\ufeff"Status"'));
});
test("unconfigured AI and PageSpeed return clear unavailable errors", async () => {
  const fixture = fixtureFetcher();
  const report = await crawlWebsite(input, {
    fetcher: fixture.fetcher,
    delayMs: 0,
    maxPages: 1,
  });
  if (!process.env.OPENAI_API_KEY)
    await assert.rejects(generateAI(report, "summary"), /not configured/);
  if (!process.env.PAGESPEED_API_KEY)
    await assert.rejects(
      new PageSpeedProvider().getMetrics(input.url),
      /not configured/,
    );
});
