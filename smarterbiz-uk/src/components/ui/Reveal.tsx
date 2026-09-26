"use client";

import { useEffect, useRef, type ElementType, type ReactNode, type CSSProperties } from "react";

/** Fades content in when scrolled into view. Content is visible without JS (see .js rules in globals.css). */
export function Reveal({
  children,
  as: Tag = "div",
  delay = 0,
  className,
  style,
}: {
  children: ReactNode;
  as?: ElementType;
  delay?: number;
  className?: string;
  style?: CSSProperties;
}) {
  const ref = useRef<HTMLElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") {
      el.dataset.visible = "true";
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            (e.target as HTMLElement).dataset.visible = "true";
            io.unobserve(e.target);
          }
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.05 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <Tag ref={ref} data-reveal="" className={className} style={{ ...style, ["--reveal-delay" as string]: `${delay}ms` }}>
      {children}
    </Tag>
  );
}
