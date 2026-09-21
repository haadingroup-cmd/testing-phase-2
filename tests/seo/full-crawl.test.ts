import test, { type TestContext } from "node:test";
import assert from "node:assert/strict";
import {
  newFullCrawl,
  advanceFullCrawl,
  fullCrawlReport,
  eligibleURL,
} from "../../src/lib/seo/full-crawl";
import { input, fixtureHTML, result } from "./fixtures";
import type { Fetcher } from "../../src/lib/seo/security";
function site(
  options: { limit?: number; denied?: boolean; retry?: boolean } = {},
) {
  const calls: string[] = [];
  let failures = 0;
  const fetcher: Fetcher = async (url, opts) => {
    await opts?.beforeHop?.(new URL(url));
    calls.push(url);
    if (url.endsWith("/robots.txt"))
      return result(
        url,
        `User-agent: *\n${options.denied ? "Disallow: /hidden" : "Allow: /"}\nSitemap: https://audit-example.com/index.xml`,
        200,
        "text/plain",
      );
    if (url.endsWith("/index.xml"))
      return result(
        url,
        "<sitemapindex><sitemap><loc>https://audit-example.com/child.xml</loc></sitemap></sitemapindex>",
        200,
        "application/xml",
      );
    if (url.endsWith("/child.xml"))
      return result(
        url,
        `<urlset>${Array.from({ length: 20 }, (_, i) => `<url><loc>https://audit-example.com/hidden-${i}</loc></url>`).join("")}<url><loc>https://foreign-example.com/</loc></url></urlset>`,
        200,
        "application/xml",
      );
    if (url.endsWith("/sitemap.xml"))
      return result(url, "missing", 404, "text/plain");
    if (options.retry && url.endsWith("/hidden-0") && failures++ === 0)
      return result(url, "busy", 503);
    return result(
      url,
      fixtureHTML({ links: 0, title: `Unique page ${new URL(url).pathname}` }),
    );
  };
  return { fetcher, calls };
}
async function finish(t: TestContext, fetcher: Fetcher, max = 50) {
  let clock = Date.now();
  t.mock.method(Date, "now", () => clock);
  let state = newFullCrawl(input, "owner", max);
  for (
    let n = 0;
    n < 150 && ["running", "queued"].includes(state.status);
    n++
  ) {
    const wait = await advanceFullCrawl(state, fetcher, clock);
    state = JSON.parse(JSON.stringify(state));
    clock += Math.max(wait, 1000);
  }
  return state;
}
test("background crawl crosses eleven pages, follows child sitemaps and survives serialized checkpoints", async (t) => {
  const { fetcher, calls } = site();
  const state = await finish(t, fetcher);
  assert.equal(state.status, "completed");
  assert.equal(state.pages.length, 21);
  assert.equal(state.sitemapFound, 2);
  assert.ok(!calls.some((x) => x.includes("foreign-example")));
  assert.ok(
    fullCrawlReport(state).coverage.some((x) => x.includes("not proof")),
  );
});
test("robots-disallowed sitemap entries are recorded without fetching them", async (t) => {
  const { fetcher, calls } = site({ denied: true });
  const state = await finish(t, fetcher);
  assert.equal(state.pages.length, 1);
  assert.ok(!calls.some((x) => x.includes("/hidden-")));
  assert.ok(state.skipped.some((x) => x.reason.includes("robots")));
});
test("page budget produces explicit incomplete coverage and resumable state is bounded", async (t) => {
  const { fetcher } = site();
  const state = await finish(t, fetcher, 5);
  assert.equal(state.pages.length, 5);
  assert.equal(state.coverageLimited, true);
  assert.ok(fullCrawlReport(state).partial);
  assert.ok(state.skipped.some((x) => x.reason.includes("limit")));
});
test("transient server failures retry instead of silently losing a page", async (t) => {
  const { fetcher, calls } = site({ retry: true });
  const state = await finish(t, fetcher);
  assert.equal(state.pages.length, 21);
  assert.equal(calls.filter((x) => x.endsWith("/hidden-0")).length, 2);
});
test("full crawl excludes offsite, query, action and private addresses", () => {
  const origin = "https://audit-example.com";
  for (const path of [
    "https://127.0.0.1/",
    "https://other-example.com/",
    "/checkout",
    "/?sort=x",
    "/a.pdf",
  ])
    assert.equal(eligibleURL(path, origin), null);
  assert.equal(
    eligibleURL("/deep/path#section", origin),
    `${origin}/deep/path`,
  );
});
test("cancelled crawls never issue new network requests", async () => {
  const state = newFullCrawl(input, "owner");
  state.status = "cancelled";
  let calls = 0;
  await advanceFullCrawl(state, async () => {
    calls++;
    throw new Error("must not fetch");
  });
  assert.equal(calls, 0);
});
