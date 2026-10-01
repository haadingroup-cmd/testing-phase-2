"use server";

import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import type { z } from "zod";
import { createSession, destroySession, requireAdmin } from "@/lib/auth/session";
import { hashPassword, passwordProblem, verifyPassword } from "@/lib/auth/password";
import { isAuthConfigured } from "@/lib/auth/token";
import { getDb, hasDatabase } from "@/lib/db";
import { sanitizeRichText } from "@/lib/sanitize";
import { rateLimit } from "@/lib/security/rate-limit";
import { settingsSchema } from "@/lib/validations/settings";
import {
  caseStudyInputSchema,
  faqInputSchema,
  loginSchema,
  planInputSchema,
  postInputSchema,
  serviceInputSchema,
} from "@/lib/validations/admin";
import { Prisma } from "@/generated/prisma/client";
import type { LeadStatus } from "@/types";

export type ActionState = { ok: boolean; message?: string; fieldErrors?: Record<string, string> };

const LEAD_STATUSES: LeadStatus[] = ["NEW", "CONTACTED", "QUALIFIED", "CONVERTED", "LOST"];

function formObject(formData: FormData): Record<string, string> {
  const out: Record<string, string> = {};
  for (const [key, value] of formData.entries()) {
    if (typeof value === "string" && !key.startsWith("$")) out[key] = value;
  }
  return out;
}

function zodErrors(error: z.ZodError): ActionState {
  const fieldErrors: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = String(issue.path[0] ?? "form");
    fieldErrors[key] ??= issue.message;
  }
  return { ok: false, message: "Please fix the highlighted fields.", fieldErrors };
}

function dbError(error: unknown): ActionState {
  if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
    return { ok: false, message: "That slug is already in use.", fieldErrors: { slug: "Already in use — choose another slug." } };
  }
  console.error("[admin]", error instanceof Error ? error.message : error);
  return { ok: false, message: "Something went wrong while saving. Please try again." };
}

/** Public pages are cached (ISR); refresh everything that might show the change. */
function refreshSite() {
  revalidatePath("/", "layout");
}

// ─── Auth ─────────────────────────────────────────────────────────────────

// A real bcrypt hash of a random string, used so login timing doesn't reveal which emails exist.
const DUMMY_HASH = "$2b$12$l0X3a0u6kvjQJXQtizZY2./vHkAmDA/klmECZbLwbfroK7OLTjVqm";

export async function login(_prev: ActionState, formData: FormData): Promise<ActionState> {
  if (!hasDatabase || !isAuthConfigured()) {
    return { ok: false, message: "Admin is not configured. Set DATABASE_URL and AUTH_SECRET (see README)." };
  }
  const h = await headers();
  const ip = h.get("x-forwarded-for")?.split(",")[0].trim() ?? "unknown";
  const limit = await rateLimit("login", ip, 8, 900);
  if (!limit.allowed) return { ok: false, message: `Too many attempts. Try again in ${Math.ceil(limit.retryAfterSeconds / 60)} minutes.` };

  const parsed = loginSchema.safeParse(formObject(formData));
  if (!parsed.success) return zodErrors(parsed.error);

  const user = await getDb().user.findUnique({ where: { email: parsed.data.email } });
  const valid = await verifyPassword(parsed.data.password, user?.passwordHash ?? DUMMY_HASH);
  if (!user || !valid) return { ok: false, message: "Incorrect email or password." };

  await getDb().user.update({ where: { id: user.id }, data: { lastLoginAt: new Date() } });
  await createSession(user);

  const next = String(formData.get("next") ?? "");
  redirect(next.startsWith("/admin") && !next.startsWith("//") ? next : "/admin");
}

export async function logout() {
  await destroySession();
  redirect("/admin/login");
}

export async function changePassword(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const admin = await requireAdmin();
  const current = String(formData.get("current") ?? "");
  const next = String(formData.get("password") ?? "");
  const confirm = String(formData.get("confirm") ?? "");
  const user = await getDb().user.findUniqueOrThrow({ where: { id: admin.id } });
  if (!(await verifyPassword(current, user.passwordHash))) return { ok: false, fieldErrors: { current: "Current password is incorrect." } };
  const problem = passwordProblem(next);
  if (problem) return { ok: false, fieldErrors: { password: problem } };
  if (next !== confirm) return { ok: false, fieldErrors: { confirm: "Passwords don't match." } };
  const updated = await getDb().user.update({
    where: { id: admin.id },
    data: { passwordHash: await hashPassword(next), sessionVersion: { increment: 1 } },
  });
  // Other sessions are now invalid; re-issue this one.
  await createSession(updated);
  return { ok: true, message: "Password updated. Other sessions have been signed out." };
}

// ─── Leads ────────────────────────────────────────────────────────────────

export async function updateLead(id: string, _prev: ActionState, formData: FormData): Promise<ActionState> {
  await requireAdmin();
  const status = String(formData.get("status") ?? "") as LeadStatus;
  if (!LEAD_STATUSES.includes(status)) return { ok: false, message: "Invalid status." };
  const notes = String(formData.get("notes") ?? "").slice(0, 5000);
  await getDb().lead.update({ where: { id }, data: { status, notes: notes || null } });
  revalidatePath("/admin", "layout");
  return { ok: true, message: "Lead updated." };
}

export async function deleteLead(id: string) {
  await requireAdmin();
  await getDb().lead.delete({ where: { id } });
  revalidatePath("/admin", "layout");
  redirect("/admin/leads");
}

// ─── Services ─────────────────────────────────────────────────────────────

export async function saveService(id: string | null, _prev: ActionState, formData: FormData): Promise<ActionState> {
  await requireAdmin();
  const parsed = serviceInputSchema.safeParse(formObject(formData));
  if (!parsed.success) return zodErrors(parsed.error);
  const data = parsed.data;
  try {
    const saved = id ? await getDb().service.update({ where: { id }, data }) : await getDb().service.create({ data });
    refreshSite();
    if (!id) redirect(`/admin/services/${saved.id}?created=1`);
    return { ok: true, message: "Service saved." };
  } catch (error) {
    if (isRedirect(error)) throw error;
    return dbError(error);
  }
}

export async function deleteService(id: string) {
  await requireAdmin();
  await getDb().service.delete({ where: { id } });
  refreshSite();
  redirect("/admin/services");
}

// ─── Pricing ──────────────────────────────────────────────────────────────

export async function savePlan(id: string | null, _prev: ActionState, formData: FormData): Promise<ActionState> {
  await requireAdmin();
  const parsed = planInputSchema.safeParse(formObject(formData));
  if (!parsed.success) return zodErrors(parsed.error);
  try {
    const saved = id ? await getDb().pricingPlan.update({ where: { id }, data: parsed.data }) : await getDb().pricingPlan.create({ data: parsed.data });
    refreshSite();
    if (!id) redirect(`/admin/pricing/${saved.id}?created=1`);
    return { ok: true, message: "Plan saved." };
  } catch (error) {
    if (isRedirect(error)) throw error;
    return dbError(error);
  }
}

export async function deletePlan(id: string) {
  await requireAdmin();
  await getDb().pricingPlan.delete({ where: { id } });
  refreshSite();
  redirect("/admin/pricing");
}

// ─── Blog ─────────────────────────────────────────────────────────────────

export async function savePost(id: string | null, _prev: ActionState, formData: FormData): Promise<ActionState> {
  await requireAdmin();
  const parsed = postInputSchema.safeParse(formObject(formData));
  if (!parsed.success) return zodErrors(parsed.error);
  const { publishedAt, ...rest } = parsed.data;
  const data = {
    ...rest,
    content: sanitizeRichText(rest.content),
    publishedAt: rest.status === "PUBLISHED" ? (publishedAt ?? new Date()) : publishedAt,
  };
  try {
    const saved = id ? await getDb().blogPost.update({ where: { id }, data }) : await getDb().blogPost.create({ data });
    refreshSite();
    if (!id) redirect(`/admin/blog/${saved.id}?created=1`);
    return { ok: true, message: rest.status === "PUBLISHED" ? "Post saved and published." : "Draft saved." };
  } catch (error) {
    if (isRedirect(error)) throw error;
    return dbError(error);
  }
}

export async function deletePost(id: string) {
  await requireAdmin();
  await getDb().blogPost.delete({ where: { id } });
  refreshSite();
  redirect("/admin/blog");
}

// ─── Case studies ─────────────────────────────────────────────────────────

export async function saveCaseStudy(id: string | null, _prev: ActionState, formData: FormData): Promise<ActionState> {
  await requireAdmin();
  const parsed = caseStudyInputSchema.safeParse(formObject(formData));
  if (!parsed.success) return zodErrors(parsed.error);
  const { before, after, ...rest } = parsed.data;
  const data = { ...rest, beforeAfter: before || after ? { before: before ?? "", after: after ?? "" } : Prisma.JsonNull };
  try {
    const saved = id ? await getDb().caseStudy.update({ where: { id }, data }) : await getDb().caseStudy.create({ data });
    refreshSite();
    if (!id) redirect(`/admin/case-studies/${saved.id}?created=1`);
    return { ok: true, message: "Case study saved." };
  } catch (error) {
    if (isRedirect(error)) throw error;
    return dbError(error);
  }
}

export async function deleteCaseStudy(id: string) {
  await requireAdmin();
  await getDb().caseStudy.delete({ where: { id } });
  refreshSite();
  redirect("/admin/case-studies");
}

// ─── FAQ ──────────────────────────────────────────────────────────────────

export async function saveFaq(id: string | null, _prev: ActionState, formData: FormData): Promise<ActionState> {
  await requireAdmin();
  const parsed = faqInputSchema.safeParse(formObject(formData));
  if (!parsed.success) return zodErrors(parsed.error);
  try {
    if (id) await getDb().fAQ.update({ where: { id }, data: parsed.data });
    else await getDb().fAQ.create({ data: parsed.data });
    refreshSite();
    return { ok: true, message: id ? "FAQ updated." : "FAQ added." };
  } catch (error) {
    return dbError(error);
  }
}

export async function deleteFaq(id: string) {
  await requireAdmin();
  await getDb().fAQ.delete({ where: { id } });
  refreshSite();
}

// ─── Audits ───────────────────────────────────────────────────────────────

export async function deleteAudit(id: string) {
  await requireAdmin();
  await getDb().auditRequest.delete({ where: { id } });
  revalidatePath("/admin/audits");
}

// ─── Settings ─────────────────────────────────────────────────────────────

export async function saveSettings(_prev: ActionState, formData: FormData): Promise<ActionState> {
  await requireAdmin();
  const raw = formObject(formData);
  const statLines = (raw.stats ?? "")
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean)
    .map((l) => {
      const [icon = "", value = "", label = ""] = l.split("|").map((p) => p.trim());
      return { icon, value, label };
    });
  const candidate = {
    companyName: raw.companyName,
    tagline: raw.tagline,
    description: raw.description,
    email: raw.email,
    phone: raw.phone,
    whatsapp: (raw.whatsapp ?? "").replace(/\D/g, ""),
    whatsappMessage: raw.whatsappMessage,
    address: raw.address,
    city: raw.city,
    region: raw.region,
    country: raw.country,
    founderName: raw.founderName,
    founderTitle: raw.founderTitle,
    founderImage: raw.founderImage,
    founderQuote: raw.founderQuote,
    responseTime: raw.responseTime,
    markets: (raw.markets ?? "")
      .split(",")
      .map((m) => m.trim())
      .filter(Boolean),
    stats: statLines,
    social: {
      facebook: raw.facebook ?? "",
      instagram: raw.instagram ?? "",
      linkedin: raw.linkedin ?? "",
      tiktok: raw.tiktok ?? "",
      youtube: raw.youtube ?? "",
      clutch: raw.clutch ?? "",
    },
  };
  const parsed = settingsSchema.safeParse(candidate);
  if (!parsed.success) return zodErrors(parsed.error);
  await getDb().siteSetting.upsert({
    where: { key: "general" },
    create: { key: "general", value: parsed.data },
    update: { value: parsed.data },
  });
  refreshSite();
  return { ok: true, message: "Settings saved. The public site will update within a few seconds." };
}

function isRedirect(error: unknown): boolean {
  return typeof error === "object" && error !== null && "digest" in error && String((error as { digest: unknown }).digest).startsWith("NEXT_REDIRECT");
}
