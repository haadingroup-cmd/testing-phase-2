import { SignJWT, jwtVerify } from "jose";

/** Edge/Node-safe session token helpers (no database access here). */
export const SESSION_COOKIE = "hg_admin_session";
export const SESSION_MAX_AGE = 60 * 60 * 24 * 7; // 7 days

export type SessionPayload = { sub: string; ver: number; role: "ADMIN" | "EDITOR" };

function secretKey(): Uint8Array | null {
  const secret = process.env.AUTH_SECRET;
  if (!secret || secret.length < 32) return null;
  return new TextEncoder().encode(secret);
}

export function isAuthConfigured(): boolean {
  return secretKey() !== null;
}

export async function signSession(payload: SessionPayload): Promise<string> {
  const key = secretKey();
  if (!key) throw new Error("AUTH_SECRET must be set (at least 32 characters).");
  return new SignJWT({ ver: payload.ver, role: payload.role })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(payload.sub)
    .setIssuedAt()
    .setIssuer("haadinglobal")
    .setAudience("haadinglobal-admin")
    .setExpirationTime(`${SESSION_MAX_AGE}s`)
    .sign(key);
}

export async function verifySessionToken(token: string | undefined): Promise<SessionPayload | null> {
  const key = secretKey();
  if (!token || !key) return null;
  try {
    const { payload } = await jwtVerify(token, key, {
      issuer: "haadinglobal",
      audience: "haadinglobal-admin",
      algorithms: ["HS256"],
    });
    if (typeof payload.sub !== "string" || typeof payload.ver !== "number") return null;
    const role = payload.role === "EDITOR" ? "EDITOR" : "ADMIN";
    return { sub: payload.sub, ver: payload.ver, role };
  } catch {
    return null;
  }
}
