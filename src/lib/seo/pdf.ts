import { PDFDocument, rgb, type PDFFont, type PDFPage } from "pdf-lib";
import fontkit from "@pdf-lib/fontkit";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { brand, categoryLabels, pdfDisclaimer, scoreLabel } from "./config";
import { categories, type AuditReport, type Check } from "./types";

export interface ReportBranding {
  clientName?: string;
  agencyName?: string;
}
const navy = rgb(0.055, 0.105, 0.2),
  gold = rgb(0.69, 0.51, 0.2),
  ink = rgb(0.16, 0.21, 0.29),
  muted = rgb(0.38, 0.43, 0.51),
  pale = rgb(0.96, 0.97, 0.98),
  line = rgb(0.87, 0.9, 0.93),
  red = rgb(0.69, 0.17, 0.18),
  green = rgb(0.1, 0.42, 0.33);
export function groupFindings(checks: Check[]) {
  const groups = new Map<string, { check: Check; urls: string[] }>();
  for (const check of checks) {
    const key = `${check.title}|${check.status}`;
    const existing = groups.get(key);
    if (existing) {
      if (!existing.urls.includes(check.pageUrl))
        existing.urls.push(check.pageUrl);
    } else groups.set(key, { check, urls: [check.pageUrl] });
  }
  return [...groups.values()].sort(
    (a, b) =>
      ({ critical: 0, warning: 1, unavailable: 2, passed: 3 })[a.check.status] -
      { critical: 0, warning: 1, unavailable: 2, passed: 3 }[b.check.status],
  );
}
export async function generatePDF(
  report: AuditReport,
  branding: ReportBranding = {},
) {
  const doc = await PDFDocument.create();
  doc.registerFontkit(fontkit);
  const regular = await doc.embedFont(
    await readFile(path.join(process.cwd(), "public/seo-fonts/DejaVuSans.ttf")),
    { subset: true },
  );
  const bold = await doc.embedFont(
    await readFile(
      path.join(process.cwd(), "public/seo-fonts/DejaVuSans-Bold.ttf"),
    ),
    { subset: true },
  );
  doc.setTitle(`SEO Audit - ${new URL(report.pages[0].url).hostname}`);
  doc.setAuthor(brand.agency);
  doc.setCreationDate(new Date());
  const supported = new Set(regular.getCharacterSet());
  let escaped = false;
  const safe = (s: string) =>
    Array.from(
      s.replace(/[\u0000-\u0008\u000b-\u001f]/g, "").replace(/[–—]/g, "-"),
    )
      .map((c) =>
        supported.has(c.codePointAt(0)!) || c === "\n"
          ? c
          : ((escaped = true), `[U+${c.codePointAt(0)!.toString(16)}]`),
      )
      .join("");
  let page: PDFPage;
  let y = 0;
  const width = 499;
  const agency = (branding.agencyName?.trim() || brand.agency).slice(0, 100);
  function newPage(section: string) {
    page = doc.addPage([595.28, 841.89]);
    page.drawRectangle({ x: 0, y: 829, width: 596, height: 13, color: navy });
    page.drawText(brand.name, {
      x: 48,
      y: 791,
      size: 14,
      font: bold,
      color: navy,
    });
    page.drawText(section, {
      x: 48,
      y: 770,
      size: 8,
      font: regular,
      color: muted,
    });
    page.drawLine({
      start: { x: 48, y: 753 },
      end: { x: 547, y: 753 },
      thickness: 1,
      color: line,
    });
    y = 728;
  }
  function ensure(height: number) {
    if (y - height < 70) newPage("SEO Audit / continued");
  }
  function lines(text: string, font: PDFFont, size: number, maxWidth = width) {
    const output: string[] = [];
    for (const paragraph of safe(text).split("\n")) {
      let current = "";
      for (const word of paragraph.split(/\s+/)) {
        let chunks = [word];
        if (font.widthOfTextAtSize(word, size) > maxWidth) {
          chunks = [];
          let chunk = "";
          for (const c of word) {
            if (font.widthOfTextAtSize(chunk + c, size) > maxWidth) {
              chunks.push(chunk);
              chunk = "";
            }
            chunk += c;
          }
          if (chunk) chunks.push(chunk);
        }
        for (const chunk of chunks) {
          const test = current ? `${current} ${chunk}` : chunk;
          if (font.widthOfTextAtSize(test, size) > maxWidth && current) {
            output.push(current);
            current = chunk;
          } else current = test;
        }
      }
      output.push(current);
    }
    return output;
  }
  function paragraph(
    text: string,
    size = 9.2,
    color = ink,
    font = regular,
    maxWidth = width,
    x = 48,
  ) {
    for (const row of lines(text, font, size, maxWidth)) {
      ensure(size * 1.5);
      page.drawText(row, { x, y: y - size, size, font, color });
      y -= size * 1.52;
    }
    y -= 6;
  }
  function heading(text: string) {
    ensure(55);
    paragraph(text, 18, navy, bold);
    y -= 5;
  }
  function label(text: string) {
    ensure(35);
    paragraph(text.toUpperCase(), 8, gold, bold);
  }
  function finding(check: Check, urls: string[]) {
    ensure(125);
    label(`${check.status} / ${check.priority} priority / ${check.difficulty}`);
    paragraph(check.title, 12, navy, bold);
    paragraph(`Evidence: ${check.evidence}`);
    paragraph(`Why it matters: ${check.explanation}`);
    paragraph(`How to fix: ${check.fix}`);
    paragraph(`Affected sample: ${urls.join(" | ")}`, 8, muted);
    y -= 7;
  }
  newPage("Website intelligence / evidence-based audit");
  y = 692;
  label("Analyze. Understand. Improve.");
  paragraph("AI SEO Analyzer", 34, navy, bold);
  paragraph("Your website. A clearer next step.", 16, muted);
  y -= 26;
  paragraph(
    branding.clientName || new URL(report.pages[0].url).hostname,
    23,
    navy,
    bold,
  );
  paragraph(report.pages[0].url, 10, muted);
  paragraph(`Prepared by ${agency}`, 10, muted);
  paragraph(
    `Audited ${new Date(report.createdAt).toLocaleString("en-GB", { timeZone: "UTC" })} UTC`,
    10,
    muted,
  );
  y -= 25;
  page.drawRectangle({ x: 48, y: y - 125, width, height: 125, color: pale });
  page.drawText(report.overall === null ? "N/A" : String(report.overall), {
    x: 68,
    y: y - 65,
    size: 50,
    font: bold,
    color: navy,
  });
  page.drawText("SEO HEALTH / 100", {
    x: 222,
    y: y - 34,
    size: 10,
    font: bold,
    color: gold,
  });
  page.drawText(scoreLabel(report.overall), {
    x: 222,
    y: y - 62,
    size: 19,
    font: bold,
    color: navy,
  });
  page.drawText(
    `${report.pages.length} pages analyzed | ${report.skipped.length} skips recorded`,
    { x: 222, y: y - 90, size: 9, font: regular, color: muted },
  );
  y -= 153;
  paragraph(
    "A diagnostic score for the available checks - not a prediction of Google rankings.",
    10,
    ink,
  );
  paragraph(pdfDisclaimer, 8.5, muted);
  paragraph(`Report ID: ${report.id}`, 8, muted);
  newPage("01 / Executive overview");
  heading("The audit at a glance");
  paragraph(
    `${report.pages.length} pages were analyzed from a crawl capped at ${report.maxPages} pages. ${report.checks.filter((c) => c.status === "critical").length} critical findings, ${report.checks.filter((c) => c.status === "warning").length} warnings and ${report.checks.filter((c) => c.status === "passed").length} passed checks were recorded. Counts are page-level checks, so an issue may appear on several pages.`,
  );
  for (let i = 0; i < report.scores.length; i += 2) {
    ensure(100);
    for (let col = 0; col < 2; col++) {
      const score = report.scores[i + col];
      if (!score) continue;
      const x = 48 + col * 257;
      page.drawRectangle({ x, y: y - 84, width: 242, height: 84, color: pale });
      page.drawText(categoryLabels[score.category], {
        x: x + 14,
        y: y - 22,
        size: 10,
        font: bold,
        color: navy,
      });
      page.drawText(
        score.score === null ? "Unavailable" : `${score.score}/100`,
        {
          x: x + 14,
          y: y - 49,
          size: 20,
          font: bold,
          color: score.score !== null && score.score >= 75 ? green : navy,
        },
      );
      page.drawText(`${score.evaluated} evaluated / weight ${score.weight}`, {
        x: x + 14,
        y: y - 69,
        size: 8,
        font: regular,
        color: muted,
      });
    }
    y -= 100;
  }
  paragraph(
    "Method: each category uses weighted passed checks divided by weighted evaluated checks. Warnings and critical findings receive no pass credit. Unavailable checks are excluded. Available categories are reweighted for the overall score. These are HaadiGlobal diagnostic rules, not Google’s ranking formula.",
    9,
    muted,
  );
  heading("What needs attention first?");
  const actions = groupFindings(
    report.checks.filter(
      (c) => c.status === "critical" || c.status === "warning",
    ),
  );
  for (const [i, g] of actions.slice(0, 5).entries())
    paragraph(`${i + 1}. ${g.check.title} - ${g.check.fix}`);
  newPage("02 / Coverage and evidence");
  heading("What this report can verify");
  for (const coverage of report.coverage) paragraph(`• ${coverage}`);
  paragraph(`Robots: ${report.robots.detail}`);
  paragraph(`Sitemap: ${report.sitemap.url} - ${report.sitemap.detail}`);
  for (const warning of report.warnings) paragraph(warning, 10, red);
  heading("Advanced data sources");
  paragraph(
    "Traffic, ranking positions, backlinks, authority, search volume, keyword difficulty and CPC: Data unavailable from the current source. No proprietary SEO provider is connected for this report.",
  );
  paragraph("AI: " + report.aiStatus);
  for (const metric of report.metrics.filter((m) => m.value !== null))
    paragraph(
      `${metric.label}: ${metric.value}${metric.unit || ""}. Source: ${metric.source}. ${metric.status}`,
    );
  newPage("03 / Detailed findings");
  for (const category of categories) {
    ensure(210);
    heading(categoryLabels[category]);
    const groups = groupFindings(
      report.checks.filter((c) => c.category === category),
    );
    const issues = groups.filter(
      (g) => g.check.status === "critical" || g.check.status === "warning",
    );
    if (!issues.length)
      paragraph(
        "No failing checks were found in this category’s available sample. This does not prove that every issue has been ruled out.",
      );
    for (const g of issues) finding(g.check, g.urls);
    const passed = groups.filter((g) => g.check.status === "passed");
    if (passed.length) {
      heading("Passed checks");
      paragraph(
        passed
          .map(
            (g) =>
              `${g.check.title} (${g.urls.length} page${g.urls.length === 1 ? "" : "s"})`,
          )
          .join(" • "),
      );
    }
    const unavailable = groups.filter((g) => g.check.status === "unavailable");
    if (unavailable.length) {
      heading("Unavailable or outside the score");
      for (const g of unavailable)
        paragraph(`${g.check.title}: ${g.check.evidence}`, 8.5, muted);
    }
    y -= 18;
  }
  newPage("Pages / Crawl sample");
  heading("Pages overview");
  for (const p of report.pages) {
    ensure(90);
    paragraph(p.url, 10, navy, bold);
    paragraph(
      `HTTP ${p.status} | Diagnostic score ${p.score ?? "N/A"} | ${p.wordCount} word-like tokens | H1 count ${p.h1.length}`,
      8.5,
      muted,
    );
    paragraph(
      `Title: ${p.title || "(not detected)"}\nDescription: ${p.description || "(not detected)"}`,
      8.5,
    );
  }
  if (report.skipped.length) {
    heading("Skipped pages");
    for (const s of report.skipped)
      paragraph(`${s.url}: ${s.reason}`, 8, muted);
  }
  if (report.competitors.length) {
    newPage("Comparison / Public homepage evidence");
    heading("Competitor comparison");
    paragraph(
      "Only each supplied competitor’s accessible starting page was analyzed. Counts are homepage observations, not site-wide metrics or ranking predictions.",
    );
    for (const c of report.competitors) {
      heading(new URL(c.url).hostname);
      if (!c.page) {
        paragraph(c.error || "Data unavailable from the current source.");
        continue;
      }
      paragraph(
        `Title: ${c.page.title || "(not detected)"}\nDescription: ${c.page.description || "(not detected)"}\nH1: ${c.page.h1.join(" | ") || "(not detected)"}\nSchema: ${c.page.schema.types.join(", ") || "(not detected)"}\nInternal links: ${c.page.links.filter((l) => l.internal).length}; extracted words: ${c.page.wordCount}.`,
      );
    }
  }
  newPage("Recommendations / Your action plan");
  heading("Your SEO action plan");
  paragraph(
    "Impact labels describe diagnostic importance, not predicted traffic or ranking changes.",
  );
  for (const [i, g] of actions.entries()) {
    ensure(75);
    paragraph(`${i + 1}. ${g.check.title}`, 11, navy, bold);
    paragraph(
      `Priority: ${g.check.priority} | Difficulty: ${g.check.difficulty} | Affected sampled pages: ${g.urls.length}`,
      8.5,
      gold,
    );
    paragraph(g.check.fix);
  }
  if (report.internalLinks.length) {
    heading("Internal link opportunities");
    for (const l of report.internalLinks)
      paragraph(
        `${l.from} → ${l.to}\nAnchor to review: ${l.anchor}\n${l.reason}`,
      );
  }
  newPage("Guidance / AI and next steps");
  heading("AI-assisted recommendations");
  if (report.ai) {
    paragraph(report.ai.headline, 14, navy, bold);
    paragraph(report.ai.explanation);
    for (const item of report.ai.items) {
      label(item.label);
      paragraph(item.value);
    }
    paragraph(report.ai.source, 8, muted);
  } else
    paragraph(
      "AI recommendations were not generated for this report. The action plan is based on observed checks and transparent rules. No AI assessment or proprietary metrics have been invented.",
    );
  heading("Want us to fix these issues?");
  paragraph("Get Professional SEO Services from HaadiGlobal", 15, navy, bold);
  paragraph(brand.website, 12, gold);
  paragraph(`Contact: ${brand.email}\nWhatsApp: ${brand.whatsapp}`, 10, muted);
  paragraph(pdfDisclaimer, 8.5, muted);
  if (escaped)
    paragraph(
      "Some unsupported font characters are written as Unicode code points. Use the JSON export for original text.",
      8,
      muted,
    );
  const all = doc.getPages();
  for (let i = 0; i < all.length; i++) {
    all[i].drawLine({
      start: { x: 48, y: 50 },
      end: { x: 547, y: 50 },
      color: line,
      thickness: 1,
    });
    all[i].drawText("Powered by HaadiGlobal AI SEO Analyzer", {
      x: 48,
      y: 32,
      size: 7,
      font: regular,
      color: muted,
    });
    all[i].drawText(`${i + 1} / ${all.length}`, {
      x: 505,
      y: 32,
      size: 8,
      font: regular,
      color: muted,
    });
  }
  return doc.save();
}
