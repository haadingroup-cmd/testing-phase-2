"use client";

import { useState } from "react";
import { Icon } from "@/components/ui/Icon";
import { SocialIcon } from "@/components/ui/SocialIcon";

export function ShareButtons({ url, title }: { url: string; title: string }) {
  const [copied, setCopied] = useState(false);
  const u = encodeURIComponent(url);
  const t = encodeURIComponent(title);
  const links = [
    { label: "WhatsApp", href: `https://wa.me/?text=${encodeURIComponent(`${title} ${url}`)}`, icon: <Icon name="chat" size={18} /> },
    { label: "Facebook", href: `https://www.facebook.com/sharer/sharer.php?u=${u}`, icon: <SocialIcon name="facebook" className="h-4 w-4" /> },
    { label: "LinkedIn", href: `https://www.linkedin.com/sharing/share-offsite/?url=${u}`, icon: <SocialIcon name="linkedin" className="h-4 w-4" /> },
    { label: "X", href: `https://twitter.com/intent/tweet?url=${u}&text=${t}`, icon: <span className="text-sm font-bold">X</span> },
  ];

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="font-label-md text-label-md text-on-surface-variant">Share:</span>
      {links.map((l) => (
        <a
          key={l.label}
          href={l.href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Share on ${l.label}`}
          className="flex h-9 w-9 items-center justify-center rounded-lg bg-surface-container text-secondary transition-colors hover:bg-secondary hover:text-on-secondary"
        >
          {l.icon}
        </a>
      ))}
      <button
        type="button"
        onClick={async () => {
          try {
            await navigator.clipboard.writeText(url);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
          } catch {
            setCopied(false);
          }
        }}
        className="flex h-9 items-center gap-1 rounded-lg bg-surface-container px-3 font-label-md text-label-md text-secondary hover:bg-secondary hover:text-on-secondary"
      >
        <Icon name={copied ? "done" : "content_copy"} size={16} /> {copied ? "Copied" : "Copy link"}
      </button>
    </div>
  );
}
