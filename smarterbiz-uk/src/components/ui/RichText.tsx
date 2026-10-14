import Link from "next/link";
import { Fragment, type ReactNode } from "react";

/**
 * Renders the tiny markdown subset used in our content (**bold** and [text](href))
 * as React elements — never as raw HTML — so content can't inject markup.
 */
const TOKEN = /(\*\*(.+?)\*\*|\[([^\]]+)\]\(([^)\s]+)\))/g;

function safeHref(href: string): string | null {
  if (href.startsWith("/") && !href.startsWith("//")) return href;
  try {
    const u = new URL(href);
    return u.protocol === "https:" ? u.toString() : null;
  } catch {
    return null;
  }
}

export function RichText({ text }: { text: string }) {
  const out: ReactNode[] = [];
  let last = 0;
  let i = 0;
  for (const m of text.matchAll(TOKEN)) {
    const idx = m.index ?? 0;
    if (idx > last) out.push(text.slice(last, idx));
    if (m[2]) {
      out.push(<strong key={i++}>{m[2]}</strong>);
    } else if (m[3] && m[4]) {
      const href = safeHref(m[4]);
      if (!href) out.push(m[3]);
      else if (href.startsWith("/")) out.push(<Link key={i++} href={href}>{m[3]}</Link>);
      else
        out.push(
          <a key={i++} href={href} target="_blank" rel="noopener noreferrer">
            {m[3]}
          </a>,
        );
    }
    last = idx + m[0].length;
  }
  if (last < text.length) out.push(text.slice(last));
  return <>{out.map((n, k) => (typeof n === "string" ? <Fragment key={`t${k}`}>{n}</Fragment> : n))}</>;
}
