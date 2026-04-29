"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { Lang, NumeralMode } from "@/lib/i18n/numerals";

interface SettingsState {
  version: 4;
  lang: Lang;
  numeralMode: NumeralMode;
  audioEnabled: boolean;
  hasChosenLanguage: boolean;
  /** True after the user has flipped EN ⇄ AR at least once. Used by the polyglot achievement. */
  hasToggledLang: boolean;
  /** True after the user has flipped numeral system at least once. */
  hasToggledNumerals: boolean;
  /** True after the user has finished (or skipped) the first-visit guided tour. */
  hasOnboarded: boolean;
  /** True after the heirloom-complete ceremony has played once. */
  seenHeirloomCeremony: boolean;
  /** Learner's name as it appears on the completion certificate. Empty until they sign. */
  learnerName: string;
  setLang: (lang: Lang) => void;
  setNumeralMode: (mode: NumeralMode) => void;
  toggleAudio: () => void;
  acknowledgeLanguageChoice: () => void;
  acknowledgeOnboarding: () => void;
  /** Re-trigger the first-visit guided tour (called from "How it works" → Replay). */
  resetOnboarding: () => void;
  acknowledgeHeirloomCeremony: () => void;
  setLearnerName: (name: string) => void;
}

export const useSettings = create<SettingsState>()(
  persist(
    (set) => ({
      version: 4,
      lang: "en",
      numeralMode: "auto",
      audioEnabled: true,
      hasChosenLanguage: false,
      hasToggledLang: false,
      hasToggledNumerals: false,
      hasOnboarded: false,
      seenHeirloomCeremony: false,
      learnerName: "",
      setLang: (lang) =>
        set((s) => ({
          lang,
          hasChosenLanguage: true,
          hasToggledLang: s.hasChosenLanguage ? true : s.hasToggledLang,
        })),
      setNumeralMode: (numeralMode) =>
        set({ numeralMode, hasToggledNumerals: true }),
      toggleAudio: () => set((s) => ({ audioEnabled: !s.audioEnabled })),
      acknowledgeLanguageChoice: () => set({ hasChosenLanguage: true }),
      acknowledgeOnboarding: () => set({ hasOnboarded: true }),
      resetOnboarding: () => set({ hasOnboarded: false }),
      acknowledgeHeirloomCeremony: () => set({ seenHeirloomCeremony: true }),
      setLearnerName: (name: string) => set({ learnerName: name.slice(0, 60) }),
    }),
    {
      name: "pearl-and-loom:settings",
      version: 4,
      storage: createJSONStorage(() => localStorage),
      migrate: (persisted, fromVersion) => {
        const p = (persisted ?? {}) as Partial<SettingsState>;
        if (fromVersion < 4) {
          return {
            ...p,
            version: 4,
            hasToggledLang: p.hasToggledLang ?? false,
            hasToggledNumerals: p.hasToggledNumerals ?? false,
            hasOnboarded: p.hasOnboarded ?? false,
            seenHeirloomCeremony: p.seenHeirloomCeremony ?? false,
            learnerName: p.learnerName ?? "",
          } as SettingsState;
        }
        return p as SettingsState;
      },
    },
  ),
);
