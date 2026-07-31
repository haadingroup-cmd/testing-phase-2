"use client";
import { useLanguage } from "@/components/providers/LanguageProvider";

interface Props {
  title: string;
  titleAr?: string;
  desc: string;
  descAr?: string;
  /** "lg" for /services list (h2), "sm" inline reuse */
  variant?: "lg" | "sm";
}

/**
 * Renders a service card's title + short description in the active language.
 * Falls back to English text when Arabic isn't provided. Kept as a tiny
 * client island so server components can stay statically rendered around it.
 */
export default function ServiceCardText({ title, titleAr, desc, descAr, variant = "lg" }: Props) {
  const { lang } = useLanguage();
  const isAr = lang === "ar";
  const t = isAr && titleAr ? titleAr : title;
  const d = isAr && descAr ? descAr : desc;
  return (
    <>
      <h2 className={`text-white font-bold mb-2 group-hover:text-red-300 transition-colors ${variant === "sm" ? "text-base" : ""}`}>{t}</h2>
      <p className="text-slate-400 text-sm mb-4">{d}</p>
    </>
  );
}
