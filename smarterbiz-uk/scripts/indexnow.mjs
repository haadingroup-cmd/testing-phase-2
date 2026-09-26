// Submits every sitemap URL to IndexNow (Bing, Yandex, Seznam, Naver…) after a production build on Vercel.
// Bing's index also feeds ChatGPT search and Copilot. Google doesn't use IndexNow — use Search Console.
// Runs as npm "postbuild" and never fails the build.
import { readFile } from "node:fs/promises";

const KEY = process.env.INDEXNOW_KEY ?? "";
const SITE = (process.env.NEXT_PUBLIC_SITE_URL || "https://www.smarterbiz.uk").replace(/\/+$/, "");

if (process.env.VERCEL_ENV !== "production") {
  console.log("[indexnow] skipped (not a Vercel production build)");
  process.exit(0);
}
if (!/^[a-zA-Z0-9-]{8,128}$/.test(KEY)) {
  console.log("[indexnow] skipped (INDEXNOW_KEY not set)");
  process.exit(0);
}

try {
  const xml = await readFile(".next/server/app/sitemap.xml.body", "utf8");
  const urlList = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
  const host = new URL(SITE).host;
  const res = await fetch("https://api.indexnow.org/indexnow", {
    method: "POST",
    headers: { "Content-Type": "application/json; charset=utf-8" },
    body: JSON.stringify({ host, key: KEY, keyLocation: `${SITE}/indexnow-key.txt`, urlList }),
    signal: AbortSignal.timeout(10_000),
  });
  // 200/202 = accepted. 403 = key file not reachable yet (e.g. first deploy) — the next deploy will succeed.
  console.log(`[indexnow] ${urlList.length} URLs → HTTP ${res.status}${res.ok ? " (accepted)" : " (not accepted)"}`);
} catch (err) {
  console.log("[indexnow] submission failed (build continues):", err?.message ?? err);
}
