// IndexNow key file (referenced via keyLocation by scripts/indexnow.mjs).
export const dynamic = "force-static";

export function GET() {
  const key = process.env.INDEXNOW_KEY ?? "";
  if (!/^[a-zA-Z0-9-]{8,128}$/.test(key)) return new Response("Not found", { status: 404 });
  return new Response(key, { headers: { "Content-Type": "text/plain; charset=utf-8" } });
}
