import test from "node:test";
import assert from "node:assert/strict";
import { crawlWebsite } from "../../src/lib/seo/crawler";
import { signReport, verifyReport } from "../../src/lib/seo/seal";
import { recoveryCandidate } from "../../src/lib/seo/report-recovery";
import { nextScheduledAt } from "../../src/lib/seo/schedules";
import { aiConfigured, generateAI } from "../../src/lib/seo/ai";
import { aiEvidence } from "../../src/lib/seo/ai-evidence";
import { fixtureFetcher, input } from "./fixtures";
const report = () => crawlWebsite(input, { fetcher: fixtureFetcher().fetcher, delayMs: 0, maxPages: 1 });
test("saved reports retain signatures and reject tampering or expiry", async () => {
  const original = await report(); const signed = signReport(original);
  const restored = recoveryCandidate(JSON.stringify(signed));
  assert.deepEqual(verifyReport(restored), original);
  const changed = structuredClone(signed); changed.report.pages[0].title = "Tampered";
  assert.throws(() => verifyReport(changed), /changed/);
  assert.equal(recoveryCandidate(JSON.stringify(signReport({...original, expiresAt:"2000-01-01T00:00:00Z"}))), null);
  assert.equal(recoveryCandidate("{}"), null);
});
test("daily schedule retains its anchor despite cron hour jitter", () => {
  const start = Date.parse("2026-10-01T03:00:00Z");
  assert.equal(nextScheduledAt(start, "daily", start + 59 * 60000), start + 86400000);
  assert.equal(nextScheduledAt(start, "weekly", start + 8 * 86400000), start + 14 * 86400000);
});
test("fix effort distinguishes technical changes from simple edits", async () => {
  const r = await report();
  assert.equal(r.checks.find(c=>c.id.endsWith("::size"))?.difficulty, "Developer");
  assert.equal(r.checks.find(c=>c.id.endsWith("::schema"))?.difficulty, "Developer");
  assert.equal(r.checks.find(c=>c.id.endsWith("::h1"))?.difficulty, "Moderate");
  assert.equal(r.checks.find(c=>c.id.endsWith("::title"))?.difficulty, "Easy");
});
test("manual AI prompts use actual evidence without changing measured scores", async () => {
  const r = await report(), before = JSON.stringify(r); const e = aiEvidence(r,"content");
  assert.ok(e.input.includes(r.pages[0].title));
  assert.ok(e.instructions.includes("untrusted quoted data"));
  assert.ok(e.instructions.includes("Do not calculate a new SEO score"));
  assert.equal(JSON.stringify(r), before);
});
async function geminiTest(run: () => Promise<void>) {
  const keys = ["SEO_AI_PROVIDER","SEO_GEMINI_FREE_TIER_CONFIRMED","GEMINI_API_KEY","GEMINI_MODEL","SEO_ALLOW_PAID_AI","OPENAI_API_KEY","OPENAI_MODEL"];
  const values = keys.map(k=>process.env[k]), originalFetch = globalThis.fetch;
  Object.assign(process.env, {SEO_AI_PROVIDER:"gemini", SEO_GEMINI_FREE_TIER_CONFIRMED:"true", GEMINI_API_KEY:"test-only", GEMINI_MODEL:"gemini-2.5-flash-lite", SEO_ALLOW_PAID_AI:"false"});
  try { await run(); } finally { keys.forEach((k,i)=>{if(values[i]===undefined) delete process.env[k]; else process.env[k]=values[i];}); globalThis.fetch=originalFetch; }
}
test("Gemini requires free-tier confirmation and quota failures do not fall back", async () => geminiTest(async () => {
  delete process.env.SEO_GEMINI_FREE_TIER_CONFIRMED; process.env.OPENAI_API_KEY="test-only"; process.env.OPENAI_MODEL="test-model";
  assert.equal(aiConfigured(),false);
  process.env.SEO_GEMINI_FREE_TIER_CONFIRMED="true"; assert.equal(aiConfigured(),true);
  let calls=0;
  globalThis.fetch = async url => { calls++; assert.ok(String(url).startsWith("https://generativelanguage.googleapis.com/")); return new Response("{}",{status:429}); };
  await assert.rejects(generateAI(await report(),"summary"), /No paid fallback/); assert.equal(calls,1);
}));
test("Gemini validates completed structured responses and rejects malformed output", async () => geminiTest(async () => {
  const r = await report();
  const data = {headline:"Observed findings",explanation:"Review the sampled page.",items:[{label:"Title",value:r.pages[0].title}]};
  globalThis.fetch = async () => Response.json({candidates:[{finishReason:"STOP",content:{parts:[{text:JSON.stringify(data)}]}}]});
  assert.match((await generateAI(r,"summary")).source, /Google Gemini/);
  globalThis.fetch = async () => Response.json({candidates:[{finishReason:"STOP",content:{parts:[{text:"not JSON"}]}}]});
  await assert.rejects(generateAI(r,"summary"), /valid recommendation/);
  globalThis.fetch = async () => Response.json({candidates:[{finishReason:"MAX_TOKENS"}]});
  await assert.rejects(generateAI(r,"summary"), /incomplete/);
}));
