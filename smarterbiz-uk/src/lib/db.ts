import "server-only";

/**
 * Minimal Supabase REST (PostgREST) client using fetch — no SDK, server-side only.
 * Tables are created by supabase/schema.sql with Row Level Security enabled and no public policies,
 * so only the service-role key (kept on the server) can read or write.
 */

type Table = "subscribers" | "contact_messages" | "tool_submissions";
type Row = Record<string, unknown>;

export const dbConfigured = () => Boolean(process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY);

export class DbNotConfiguredError extends Error {
  constructor() {
    super("Database is not configured");
  }
}

function conn() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new DbNotConfiguredError();
  return { url, key };
}

async function request(method: "POST" | "PATCH", endpoint: URL, key: string, body: Row, prefer: string, table: Table) {
  const res = await fetch(endpoint, {
    method,
    headers: { apikey: key, Authorization: `Bearer ${key}`, "Content-Type": "application/json", Prefer: prefer },
    body: JSON.stringify(body),
    cache: "no-store",
    signal: AbortSignal.timeout(8000),
  });
  if (!res.ok) {
    // Log status only — never log the key or full payload (may contain personal data).
    console.error(`[db] ${method} ${table} failed with status ${res.status}`);
    throw new Error("Database write failed");
  }
  return res;
}

/**
 * Inserts a row. With `ignoreDuplicatesOn`, a conflicting row is skipped and the function returns false;
 * it returns true when a new row was actually created.
 */
export async function insertRow(table: Table, row: Row, opts: { ignoreDuplicatesOn?: string } = {}): Promise<boolean> {
  const { url, key } = conn();
  const endpoint = new URL(`/rest/v1/${table}`, url);
  if (!opts.ignoreDuplicatesOn) {
    await request("POST", endpoint, key, row, "return=minimal", table);
    return true;
  }
  endpoint.searchParams.set("on_conflict", opts.ignoreDuplicatesOn);
  endpoint.searchParams.set("select", "id");
  const res = await request("POST", endpoint, key, row, "return=representation,resolution=ignore-duplicates", table);
  const inserted = (await res.json().catch(() => [])) as unknown[];
  return Array.isArray(inserted) && inserted.length > 0;
}

/**
 * Updates rows matching simple filters (`column=eq.value` / `is.null` / `not.is.null`).
 * Returns the number of rows changed.
 */
export async function updateRows(table: Table, filters: Record<string, string>, patch: Row): Promise<number> {
  const { url, key } = conn();
  const endpoint = new URL(`/rest/v1/${table}`, url);
  for (const [col, expr] of Object.entries(filters)) endpoint.searchParams.set(col, expr);
  endpoint.searchParams.set("select", "id");
  const res = await request("PATCH", endpoint, key, patch, "return=representation", table);
  const rows = (await res.json().catch(() => [])) as unknown[];
  return Array.isArray(rows) ? rows.length : 0;
}
