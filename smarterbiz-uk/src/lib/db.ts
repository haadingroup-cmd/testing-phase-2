import "server-only";

/**
 * Minimal Supabase REST (PostgREST) client using fetch — no SDK, server-side only.
 * Tables are created by supabase/schema.sql with Row Level Security enabled and no public policies,
 * so only the service-role key (kept on the server) can write.
 */

type Table = "subscribers" | "contact_messages" | "tool_submissions";

export const dbConfigured = () => Boolean(process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY);

export class DbNotConfiguredError extends Error {
  constructor() {
    super("Database is not configured");
  }
}

export async function insertRow(
  table: Table,
  row: Record<string, unknown>,
  opts: { ignoreDuplicatesOn?: string } = {},
): Promise<void> {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new DbNotConfiguredError();

  const endpoint = new URL(`/rest/v1/${table}`, url);
  if (opts.ignoreDuplicatesOn) endpoint.searchParams.set("on_conflict", opts.ignoreDuplicatesOn);

  const res = await fetch(endpoint, {
    method: "POST",
    headers: {
      apikey: key,
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
      Prefer: opts.ignoreDuplicatesOn ? "return=minimal,resolution=ignore-duplicates" : "return=minimal",
    },
    body: JSON.stringify(row),
    cache: "no-store",
    signal: AbortSignal.timeout(8000),
  });

  if (!res.ok) {
    // Log status only — never log the key or full payload (may contain personal data).
    console.error(`[db] insert into ${table} failed with status ${res.status}`);
    throw new Error("Database write failed");
  }
}
