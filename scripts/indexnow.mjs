// Submits every sitemap URL to IndexNow (Bing, Yandex, Seznam, Naver…) after a
// production build on Vercel. Bing's index also feeds ChatGPT search and
// Copilot. Google does not use IndexNow — use Search Console for Google.
//
// Runs as npm "postbuild". It never fails the build: any error is logged and
// the script exits 0. The key file lives at public/b9a1cbbf62ff2d55e09303ffb467c911.txt.
import { readFile } from "node:fs/promises";

const KEY = "b9a1cbbf62ff2d55e09303ffb467c911";
const HOST = "www.haadinglobal.com";

if (process.env.VERCEL_ENV !== "production") {
  console.log("[indexnow] skipped (not a Vercel production build)");
  process.exit(0);
}

try {
  const xml = await readFile(".next/server/app/sitemap.xml.body", "utf8");
  const urlList = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
  const res = await fetch("https://api.indexnow.org/indexnow", {
    method: "POST",
    headers: { "Content-Type": "application/json; charset=utf-8" },
    body: JSON.stringify({ host: HOST, key: KEY, keyLocation: `https://${HOST}/${KEY}.txt`, urlList }),
    signal: AbortSignal.timeout(10_000),
  });
  // 200/202 = accepted. 403 = key file not reachable yet (e.g. the very first
  // deploy that adds it) — the next production deploy will succeed.
  console.log(`[indexnow] ${urlList.length} URLs → HTTP ${res.status}${res.ok ? " (accepted)" : " (not accepted)"}`);
} catch (err) {
  console.log("[indexnow] submission failed (build continues):", err?.message ?? err);
}
