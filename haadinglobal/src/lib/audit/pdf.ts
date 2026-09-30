import "server-only";
import { PDFDocument, StandardFonts, rgb, type PDFFont, type PDFPage } from "pdf-lib";
import type { AuditReport, CheckStatus } from "@/lib/audit/types";

const NAVY = rgb(9 / 255, 27 / 255, 54 / 255);
const BLUE = rgb(8 / 255, 81 / 255, 213 / 255);
const GREY = rgb(68 / 255, 71 / 255, 77 / 255);
const LIGHT = rgb(238 / 255, 244 / 255, 1);
const STATUS_COLOR: Record<CheckStatus, ReturnType<typeof rgb>> = {
  pass: rgb(22 / 255, 128 / 255, 61 / 255),
  warning: rgb(180 / 255, 110 / 255, 0),
  error: rgb(186 / 255, 26 / 255, 26 / 255),
};

/** Standard PDF fonts only cover WinAnsi; map common symbols and drop the rest. */
function safe(text: string): string {
  return text
    .replace(/[→⟶]/g, "->")
    .replace(/[“”]/g, '"')
    .replace(/[‘’]/g, "'")
    .replace(/[×]/g, "x")
    .replace(/[^\x20-\x7E -ÿ–—•…]/g, "");
}

function wrap(text: string, font: PDFFont, size: number, maxWidth: number): string[] {
  const words = safe(text).split(/\s+/);
  const lines: string[] = [];
  let line = "";
  for (const word of words) {
    const candidate = line ? `${line} ${word}` : word;
    if (font.widthOfTextAtSize(candidate, size) <= maxWidth) {
      line = candidate;
    } else {
      if (line) lines.push(line);
      line = word;
      while (font.widthOfTextAtSize(line, size) > maxWidth && line.length > 1) {
        let cut = line.length - 1;
        while (cut > 1 && font.widthOfTextAtSize(line.slice(0, cut), size) > maxWidth) cut--;
        lines.push(line.slice(0, cut));
        line = line.slice(cut);
      }
    }
  }
  if (line) lines.push(line);
  return lines;
}

export async function renderAuditPdf(report: AuditReport, brand: { name: string; email: string; phone: string; siteUrl: string }): Promise<Uint8Array> {
  const pdf = await PDFDocument.create();
  pdf.setTitle(`Website Audit — ${report.finalUrl}`);
  pdf.setAuthor(brand.name);
  pdf.setCreator(brand.name);
  const regular = await pdf.embedFont(StandardFonts.Helvetica);
  const bold = await pdf.embedFont(StandardFonts.HelveticaBold);

  const W = 595.28;
  const H = 841.89;
  const M = 48;
  const contentWidth = W - M * 2;
  let page: PDFPage = pdf.addPage([W, H]);
  let y = H - M;

  const ensure = (needed: number) => {
    if (y - needed < M + 20) {
      page = pdf.addPage([W, H]);
      y = H - M;
    }
  };
  const write = (text: string, opts: { size?: number; font?: PDFFont; color?: ReturnType<typeof rgb>; x?: number; width?: number; gap?: number } = {}) => {
    const size = opts.size ?? 10;
    const font = opts.font ?? regular;
    const lines = wrap(text, font, size, opts.width ?? contentWidth);
    for (const line of lines) {
      ensure(size + 4);
      page.drawText(line, { x: opts.x ?? M, y: y - size, size, font, color: opts.color ?? GREY });
      y -= size + (opts.gap ?? 4);
    }
  };

  // Header band
  page.drawRectangle({ x: 0, y: H - 120, width: W, height: 120, color: NAVY });
  page.drawText(safe(brand.name), { x: M, y: H - 52, size: 20, font: bold, color: rgb(1, 1, 1) });
  page.drawText("Website SEO & Conversion Audit", { x: M, y: H - 74, size: 11, font: regular, color: rgb(0.8, 0.85, 0.95) });
  page.drawText(safe(report.finalUrl).slice(0, 90), { x: M, y: H - 94, size: 9, font: regular, color: rgb(0.7, 0.78, 0.92) });
  const scoreText = `${report.score}`;
  page.drawText(scoreText, { x: W - M - bold.widthOfTextAtSize(scoreText, 36), y: H - 72, size: 36, font: bold, color: rgb(244 / 255, 201 / 255, 107 / 255) });
  page.drawText("Overall score / 100", { x: W - M - regular.widthOfTextAtSize("Overall score / 100", 8), y: H - 88, size: 8, font: regular, color: rgb(0.8, 0.85, 0.95) });
  y = H - 145;

  write(`Generated ${new Date(report.fetchedAt).toUTCString()} · HTTP ${report.httpStatus} · response ${report.responseTimeMs} ms · ${Math.round(report.htmlBytes / 1024)} KB HTML`, { size: 8 });
  y -= 8;

  // Category summary
  write("Category scores", { size: 13, font: bold, color: NAVY, gap: 8 });
  for (const cat of report.categories) {
    ensure(22);
    page.drawRectangle({ x: M, y: y - 16, width: contentWidth, height: 20, color: LIGHT });
    page.drawText(safe(cat.label), { x: M + 8, y: y - 11, size: 10, font: bold, color: NAVY });
    const summary = `${cat.score}/100  ·  ${cat.pass} pass  ${cat.warning} warning  ${cat.error} error`;
    page.drawText(summary, { x: W - M - 8 - regular.widthOfTextAtSize(summary, 9), y: y - 11, size: 9, font: regular, color: GREY });
    y -= 24;
  }
  y -= 8;

  // Checks, grouped by category, issues first.
  const order: Record<CheckStatus, number> = { error: 0, warning: 1, pass: 2 };
  for (const cat of report.categories) {
    ensure(40);
    write(cat.label, { size: 13, font: bold, color: NAVY, gap: 6 });
    const items = report.checks.filter((c) => c.category === cat.id).sort((a, b) => order[a.status] - order[b.status]);
    for (const check of items) {
      ensure(36);
      const label = check.status.toUpperCase();
      page.drawText(label, { x: M, y: y - 10, size: 8, font: bold, color: STATUS_COLOR[check.status] });
      write(`${check.title}${check.value ? ` — ${check.value}` : ""}`, { size: 10, font: bold, color: NAVY, x: M + 58, width: contentWidth - 58, gap: 3 });
      if (check.status !== "pass") {
        write(`Why it matters: ${check.why}`, { size: 9, x: M + 58, width: contentWidth - 58, gap: 3 });
        write(`How to fix: ${check.fix}`, { size: 9, x: M + 58, width: contentWidth - 58, color: BLUE, gap: 3 });
      }
      y -= 6;
    }
    y -= 6;
  }

  ensure(60);
  write("Scope & limitations", { size: 11, font: bold, color: NAVY, gap: 6 });
  for (const note of report.limitations) write(`• ${note}`, { size: 9 });
  y -= 10;
  write(`Want help fixing these issues? ${brand.phone} (WhatsApp) · ${brand.email} · ${brand.siteUrl}`, { size: 9, font: bold, color: BLUE });

  const pages = pdf.getPages();
  pages.forEach((p, i) => {
    p.drawText(`${safe(brand.name)} · Page ${i + 1} of ${pages.length}`, { x: M, y: 24, size: 8, font: regular, color: GREY });
  });

  return pdf.save();
}
