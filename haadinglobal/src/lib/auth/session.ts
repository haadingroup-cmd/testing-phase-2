import "server-only";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { cache } from "react";
import { getDb, hasDatabase } from "@/lib/db";
import { SESSION_COOKIE, SESSION_MAX_AGE, signSession, verifySessionToken } from "@/lib/auth/token";

export type AdminUser = { id: string; email: string; name: string; role: "ADMIN" | "EDITOR" };

export async function createSession(user: { id: string; sessionVersion: number; role: "ADMIN" | "EDITOR" }) {
  const token = await signSession({ sub: user.id, ver: user.sessionVersion, role: user.role });
  const store = await cookies();
  store.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_MAX_AGE,
  });
}

export async function destroySession() {
  const store = await cookies();
  store.delete(SESSION_COOKIE);
}

/** Verifies the cookie AND the user record (so revoked sessions stop working immediately). */
export const getCurrentAdmin = cache(async (): Promise<AdminUser | null> => {
  if (!hasDatabase) return null;
  const store = await cookies();
  const session = await verifySessionToken(store.get(SESSION_COOKIE)?.value);
  if (!session) return null;
  const user = await getDb().user.findUnique({ where: { id: session.sub } });
  if (!user || user.sessionVersion !== session.ver) return null;
  return { id: user.id, email: user.email, name: user.name, role: user.role };
});

/** Use at the top of every admin page and server action. */
export async function requireAdmin(): Promise<AdminUser> {
  const admin = await getCurrentAdmin();
  if (!admin) redirect("/admin/login");
  return admin;
}
