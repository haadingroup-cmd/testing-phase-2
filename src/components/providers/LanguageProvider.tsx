"use client";
import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { Lang, LANGS, T } from "@/data/translations";

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
    // A language the visitor picked themselves (via the switcher) wins.
    try {
      const saved = localStorage.getItem("hg_lang") as Lang | null;
      if (saved && LANGS[saved]) { applyLang(saved); return; }
    } catch {}
    // Otherwise English for everyone. Arabic is opt-in via the language
    // switcher only — no switching by country or browser language, so every
    // visitor (and crawler) gets the same complete English page by default.
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
