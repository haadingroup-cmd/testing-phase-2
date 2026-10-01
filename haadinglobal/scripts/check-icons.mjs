// Verifies every Material Symbols name used in the source exists in
// src/lib/icons.ts (and therefore in the self-hosted subset font).
// Usage: npm run icons:check
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";

const root = new URL("../src/", import.meta.url).pathname;
const list = readFileSync(join(root, "lib/icons.ts"), "utf8").match(/ICON_NAMES = \[([\s\S]*?)\] as const/)[1];
const known = new Set([...list.matchAll(/"([a-z0-9_]+)"/g)].map((m) => m[1]));

// Where icon names appear: <Icon name="x">, <Icon name={a ? "x" : "y"}>, `icon: "x"`, `ctaIcon: "x"`, and [/regex/, "x"] maps.
const patterns = [
  /<Icon\b[^>]*?\bname="([a-z0-9_]+)"/g,
  /\b(?:icon|ctaIcon|icon[A-Z]\w*):\s*"([a-z0-9_]+)"/g,
  /\[\/[^\]\n]*\/[a-z]*,\s*"([a-z0-9_]+)"\]/g,
];
const conditional = /<Icon\b[^>]*?\bname=\{([^}]*)\}/g;
const missing = new Map();
function walk(dir) {
  for (const f of readdirSync(dir)) {
    const p = join(dir, f);
    if (statSync(p).isDirectory()) { if (f !== "generated") walk(p); continue; }
    if (!/\.(tsx?|mjs)$/.test(f)) continue;
    const src = readFileSync(p, "utf8");
    const found = [];
    for (const re of patterns) for (const m of src.matchAll(re)) found.push(m[1]);
    for (const m of src.matchAll(conditional)) for (const q of m[1].matchAll(/"([a-z0-9_]+)"/g)) found.push(q[1]);
    for (const name of found) if (!known.has(name) && !missing.has(name)) missing.set(name, p.replace(root, "src/"));
  }
}
walk(root);
if (missing.size) {
  console.error("Icons missing from src/lib/icons.ts:\n" + [...missing].map(([n, f]) => `  ${n}  (${f})`).join("\n"));
  process.exit(1);
}
console.log(`All icons present (${known.size} in subset).`);
