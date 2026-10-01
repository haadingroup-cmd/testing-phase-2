// Regenerates public/fonts/material-symbols-subset.woff2 from the icon list
// in src/lib/icons.ts (Google Fonts "icon_names" subsetting).
// Usage: npm run icons:update
import { readFileSync, writeFileSync } from "node:fs";

const source = readFileSync(new URL("../src/lib/icons.ts", import.meta.url), "utf8");
const list = source.match(/ICON_NAMES = \[([\s\S]*?)\] as const/)?.[1] ?? "";
const names = [...list.matchAll(/"([a-z0-9_]+)"/g)].map((m) => m[1]).sort();
if (!names.length) throw new Error("No icon names found in src/lib/icons.ts");

const cssUrl =
  "https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0..1,0" +
  `&icon_names=${names.join(",")}&display=block`;
const css = await (await fetch(cssUrl, { headers: { "User-Agent": "Mozilla/5.0 Chrome/130 Safari/537.36" } })).text();
const fontUrl = css.match(/url\((https:\/\/fonts\.gstatic\.com[^)]+)\)/)?.[1];
if (!fontUrl) throw new Error(`Unexpected response from Google Fonts:\n${css.slice(0, 300)}`);
const font = Buffer.from(await (await fetch(fontUrl)).arrayBuffer());
writeFileSync(new URL("../public/fonts/material-symbols-subset.woff2", import.meta.url), font);
console.log(`Wrote ${names.length} icons (${Math.round(font.length / 1024)} KB).`);
