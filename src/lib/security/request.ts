import "server-only";
import { NextResponse } from "next/server";
import type { z } from "zod";
import { SITE_URL } from "@/lib/site";
import type { ApiError, ApiSuccess } from "@/types";

export function clientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return request.headers.get("x-real-ip") ?? "unknown";
}

/**
 * CSRF defence for JSON endpoints: browsers always send Origin on
 * cross-site POSTs, so we reject any Origin that isn't this site.
 */
export function isSameOrigin(request: Request): boolean {
  const origin = request.headers.get("origin");
  if (!origin) return true; // same-origin navigations / server-to-server; payload is still validated
  try {
    const originHost = new URL(origin).host;
    const allowed = new Set([new URL(SITE_URL).host]);
    const host = request.headers.get("x-forwarded-host") ?? request.headers.get("host");
    if (host) allowed.add(host);
    if (process.env.VERCEL_URL) allowed.add(process.env.VERCEL_URL);
    return allowed.has(originHost);
  } catch {
    return false;
  }
}

export function ok<T>(data: T, status = 200) {
  return NextResponse.json<ApiSuccess<T>>({ ok: true, data }, { status });
}

export function fail(error: string, status: number, fieldErrors?: ApiError["fieldErrors"], headers?: HeadersInit) {
  return NextResponse.json<ApiError>({ ok: false, error, ...(fieldErrors ? { fieldErrors } : {}) }, { status, headers });
}

export function validationFailure(error: z.ZodError) {
  const fieldErrors: Record<string, string[]> = {};
  for (const issue of error.issues) {
    const key = issue.path.join(".") || "form";
    (fieldErrors[key] ??= []).push(issue.message);
  }
  return fail("Please check the highlighted fields.", 422, fieldErrors);
}

export async function readJson(request: Request, maxBytes = 32_000): Promise<unknown> {
  const length = Number(request.headers.get("content-length") ?? 0);
  if (length > maxBytes) throw new PayloadError("Request body too large", 413);
  const raw = await request.text();
  if (raw.length > maxBytes) throw new PayloadError("Request body too large", 413);
  try {
    return JSON.parse(raw);
  } catch {
    throw new PayloadError("Invalid JSON body", 400);
  }
}

export class PayloadError extends Error {
  constructor(
    message: string,
    public status: number,
  ) {
    super(message);
  }
}
