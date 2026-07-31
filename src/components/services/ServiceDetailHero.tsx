"use client";
import { useLanguage } from "@/components/providers/LanguageProvider";

interface Props {
  title: string;
  titleAr?: string;
  fullDesc: string;
}

/**
 * Language-aware H1 + lead paragraph for service detail pages.
 * (Only the title has an Arabic variant in the data file today; the
 * long fullDesc stays English for now since translating all 12 long
 * descriptions thoroughly would be a separate copywriting task.)
 */
export default function ServiceDetailHero({ title, titleAr, fullDesc }: Props) {
  const { lang } = useLanguage();
  const isAr = lang === "ar";
  const t = isAr && titleAr ? titleAr : title;
  return (
    <>
      <h1 className="font-display font-black text-white mb-4">{t}</h1>
      <p className="text-slate-300 text-lg leading-relaxed mb-5">{fullDesc}</p>
    </>
  );
}
