"use client";

import { createContext, useContext, useEffect, useMemo } from "react";
import { en, type Dict } from "./dict/en";
import { ar } from "./dict/ar";
import { fmtNumber, type Lang, type NumeralMode } from "./numerals";
import { useSettings } from "@/lib/store/settings";

const DICTS: Record<Lang, Dict> = { en, ar };

type Path<T, P extends string = ""> = T extends object
  ? {
      [K in keyof T & string]: T[K] extends object
        ? Path<T[K], `${P}${P extends "" ? "" : "."}${K}`>
        : `${P}${P extends "" ? "" : "."}${K}`;
    }[keyof T & string]
  : never;

export type DictPath = Path<Dict>;

interface I18nContextValue {
  lang: Lang;
  dir: "ltr" | "rtl";
  numeralMode: NumeralMode;
  t: (key: DictPath, vars?: Record<string, string | number>) => string;
  fmt: (n: string | number) => string;
  setLang: (lang: Lang) => void;
  setNumeralMode: (mode: NumeralMode) => void;
}

const I18nContext = createContext<I18nContextValue | null>(null);

function getByPath(dict: Dict, path: string): string {
  const parts = path.split(".");
  let cur: unknown = dict;
  for (const part of parts) {
    if (cur && typeof cur === "object" && part in cur) {
      cur = (cur as Record<string, unknown>)[part];
    } else {
      return path;
    }
  }
  return typeof cur === "string" ? cur : path;
}

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const lang = useSettings((s) => s.lang);
  const numeralMode = useSettings((s) => s.numeralMode);
  const setLang = useSettings((s) => s.setLang);
  const setNumeralMode = useSettings((s) => s.setNumeralMode);

  const dir: "ltr" | "rtl" = lang === "ar" ? "rtl" : "ltr";

  // Sync <html lang dir> when lang changes (post-hydration)
  useEffect(() => {
    if (typeof document === "undefined") return;
    document.documentElement.lang = lang;
    document.documentElement.dir = dir;
  }, [lang, dir]);

  const value = useMemo<I18nContextValue>(() => {
    const dict = DICTS[lang];
    return {
      lang,
      dir,
      numeralMode,
      t: (key, vars) => {
        let text = getByPath(dict, key);
        if (vars) {
          for (const [k, v] of Object.entries(vars)) {
            text = text.replace(`{${k}}`, fmtNumber(v, numeralMode, lang));
          }
        }
        return text;
      },
      fmt: (n) => fmtNumber(n, numeralMode, lang),
      setLang,
      setNumeralMode,
    };
  }, [lang, dir, numeralMode, setLang, setNumeralMode]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n(): I18nContextValue {
  const ctx = useContext(I18nContext);
  if (!ctx) {
    throw new Error("useI18n must be used within <I18nProvider>");
  }
  return ctx;
}

export function useT() {
  return useI18n().t;
}
