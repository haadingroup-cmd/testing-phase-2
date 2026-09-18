import type { AuditReport } from "./types";
export function csvCell(value: unknown) {
  const text = String(value ?? "");
  const safe = /^[\s]*[=+@\-\t\r]/.test(text) ? `'${text}` : text;
  return `"${safe.replaceAll('"', '""')}"`;
}
export function reportCSV(report: AuditReport) {
  return (
    "\ufeff" +
    [
      [
        "Status",
        "Category",
        "Priority",
        "URL",
        "Check",
        "Evidence",
        "Why it matters",
        "How to fix",
        "Source",
      ],
      ...report.checks.map((c) => [
        c.status,
        c.category,
        c.priority,
        c.pageUrl,
        c.title,
        c.evidence,
        c.explanation,
        c.fix,
        c.source,
      ]),
    ]
      .map((row) => row.map(csvCell).join(","))
      .join("\r\n")
  );
}
