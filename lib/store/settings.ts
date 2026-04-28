"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { Lang, NumeralMode } from "@/lib/i18n/numerals";

interface SettingsState {
  version: 1;
  lang: Lang;
  numeralMode: NumeralMode;
  audioEnabled: boolean;
  hasChosenLanguage: boolean;
  setLang: (lang: Lang) => void;
  setNumeralMode: (mode: NumeralMode) => void;
  toggleAudio: () => void;
  acknowledgeLanguageChoice: () => void;
}

export const useSettings = create<SettingsState>()(
  persist(
    (set) => ({
      version: 1,
      lang: "en",
      numeralMode: "auto",
      audioEnabled: true,
      hasChosenLanguage: false,
      setLang: (lang) => set({ lang, hasChosenLanguage: true }),
      setNumeralMode: (numeralMode) => set({ numeralMode }),
      toggleAudio: () => set((s) => ({ audioEnabled: !s.audioEnabled })),
      acknowledgeLanguageChoice: () => set({ hasChosenLanguage: true }),
    }),
    {
      name: "pearl-and-loom:settings",
      version: 1,
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
