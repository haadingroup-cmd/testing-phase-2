import type { NextRequest } from "next/server";
import { searchSchema } from "@/lib/validation";
import { clientIp, json, rateLimit } from "@/lib/security";
import { search } from "@/lib/search";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const rl = rateLimit(`search:${clientIp(req)}`, 60, 60_000);
  if (!rl.ok) return json({ ok: false, error: "Too many requests." }, 429, { "Retry-After": String(rl.retryAfter) });

  const parsed = searchSchema.safeParse({ q: req.nextUrl.searchParams.get("q") ?? "" });
  if (!parsed.success) return json({ ok: true, results: [] });

  return json({ ok: true, results: search(parsed.data.q) });
}
