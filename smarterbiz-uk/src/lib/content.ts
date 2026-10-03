import type { Block, Section } from "./types";

/** Strip the mini-markdown used in content ( **bold** and [text](href) ) to plain text. */
export const plain = (s: string) => s.replace(/\*\*(.+?)\*\*/g, "$1").replace(/\[([^\]]+)\]\(([^)]+)\)/g, "$1");

export function blockText(b: Block): string {
  switch (b.type) {
    case "p":
    case "h3":
    case "quote":
      return plain(b.text);
    case "ul":
    case "ol":
      return b.items.map(plain).join("\n");
    case "table":
      return [b.head.join(" | "), ...b.rows.map((r) => r.map(plain).join(" | "))].join("\n");
    case "callout":
      return `${b.title}: ${plain(b.text)}`;
    case "tools":
      return "";
  }
}

export const sectionsText = (sections: Section[]) =>
  sections.map((s) => `${s.heading}\n${s.blocks.map(blockText).filter(Boolean).join("\n")}`).join("\n\n");

export const readingMinutes = (...texts: string[]) => {
  const words = texts.join(" ").split(/\s+/).filter(Boolean).length;
  return Math.max(3, Math.round(words / 220));
};

export const formatDate = (iso: string) =>
  new Date(`${iso}T12:00:00Z`).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });
