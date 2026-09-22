import test from "node:test";
import assert from "node:assert/strict";
import { PDFDocument } from "pdf-lib";
import { crawlWebsite } from "../../src/lib/seo/crawler";
import { generatePDF } from "../../src/lib/seo/pdf";
import { fixtureFetcher, input } from "./fixtures";
test("server PDF is a valid multipage document with the measured report metadata", async () => {
  const fixture = fixtureFetcher({ missing: true });
  const report = await crawlWebsite(input, {
    fetcher: fixture.fetcher,
    delayMs: 0,
    maxPages: 1,
  });
  const bytes = await generatePDF(report, {
    clientName: "Controlled test fixture",
    agencyName: "Test agency",
  });
  assert.ok(bytes.length > 10000);
  const pdf = await PDFDocument.load(bytes);
  assert.ok(pdf.getPageCount() >= 8);
  assert.ok(pdf.getTitle()?.includes("audit-example.com"));
});
