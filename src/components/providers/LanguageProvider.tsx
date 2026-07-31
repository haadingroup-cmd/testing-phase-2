"use client";
import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { Lang, LANGS, T, detectLangFromCountry } from "@/data/translations";

interface LangCtx {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (key: string) => string;
  dir: "ltr" | "rtl";
}

const LangContext = createContext<LangCtx>({ lang:"en", setLang:()=>{}, t:(k)=>k, dir:"ltr" });

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("en");

  useEffect(() => {
    // 1. Saved preference wins.
    try {
      const saved = localStorage.getItem("hg_lang") as Lang | null;
      if (saved && LANGS[saved]) { applyLang(saved); return; }
    } catch {}
    // 2. Country cookie set by middleware (Vercel edge geo — reliable, instant).
    try {
      const m = document.cookie.match(/(?:^|;\s*)hg-country=([^;]+)/);
      if (m) { applyLang(detectLangFromCountry(decodeURIComponent(m[1]))); return; }
    } catch {}
    // 3. Fallback: browser language.
    try {
      const nav = (navigator.language || "en").toLowerCase();
      if (nav.startsWith("ar")) { applyLang("ar"); return; }
    } catch {}
  }, []);

  function applyLang(l: Lang) {
    setLangState(l);
    if (typeof document !== "undefined") {
      document.documentElement.lang = l;
      document.documentElement.dir = LANGS[l].dir;
    }
  }

  const setLang = (l: Lang) => {
    applyLang(l);
    try { localStorage.setItem("hg_lang", l); } catch {}
  };

  const t = (key: string) => T[lang]?.[key] || T.en[key] || key;

  return (
    <LangContext.Provider value={{ lang, setLang, t, dir: LANGS[lang].dir }}>
      {children}
    </LangContext.Provider>
  );
}

export function useLanguage() { return useContext(LangContext); }
