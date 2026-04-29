"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { Lang, NumeralMode } from "@/lib/i18n/numerals";

export type LearnerGrade = 4 | 5 | 6 | 7 | 8;
export type LearnerAvatar = "falcon" | "dhow" | "pearl" | "palm";

export const LEARNER_AVATARS: LearnerAvatar[] = ["falcon", "dhow", "pearl", "palm"];

interface SettingsState {
  version: 5;
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
  /** Learner's grade band (4–8). Drives recommended path + lesson copy framing. */
  learnerGrade: LearnerGrade | null;
  /** Learner's avatar — small SVG token shown next to their name. */
  learnerAvatar: LearnerAvatar | null;
  /** True once the learner has completed profile setup (name + grade + avatar). */
  hasProfile: boolean;
  setLang: (lang: Lang) => void;
  setNumeralMode: (mode: NumeralMode) => void;
  toggleAudio: () => void;
  acknowledgeLanguageChoice: () => void;
  acknowledgeOnboarding: () => void;
  /** Re-trigger the first-visit guided tour (called from "How it works" → Replay). */
  resetOnboarding: () => void;
  acknowledgeHeirloomCeremony: () => void;
  setLearnerName: (name: string) => void;
  setLearnerGrade: (grade: LearnerGrade) => void;
  setLearnerAvatar: (avatar: LearnerAvatar) => void;
  /** Mark profile setup complete — called from the ProfileSetup screen's Begin button. */
  completeProfileSetup: (input: {
    name: string;
    grade: LearnerGrade;
    avatar: LearnerAvatar;
  }) => void;
  /** Clear profile (used by "Edit profile" → Start over). Keeps lang + audio prefs. */
  resetProfile: () => void;
}

export const useSettings = create<SettingsState>()(
  persist(
    (set) => ({
      version: 5,
      lang: "en",
      numeralMode: "auto",
      audioEnabled: true,
      hasChosenLanguage: false,
      hasToggledLang: false,
      hasToggledNumerals: false,
      hasOnboarded: false,
      seenHeirloomCeremony: false,
      learnerName: "",
      learnerGrade: null,
      learnerAvatar: null,
      hasProfile: false,
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
      setLearnerGrade: (grade) => set({ learnerGrade: grade }),
      setLearnerAvatar: (avatar) => set({ learnerAvatar: avatar }),
      completeProfileSetup: ({ name, grade, avatar }) =>
        set({
          learnerName: name.slice(0, 60),
          learnerGrade: grade,
          learnerAvatar: avatar,
          hasProfile: true,
        }),
      resetProfile: () =>
        set({
          learnerName: "",
          learnerGrade: null,
          learnerAvatar: null,
          hasProfile: false,
        }),
    }),
    {
      name: "pearl-and-loom:settings",
      version: 5,
      storage: createJSONStorage(() => localStorage),
      // `hasOnboarded` is intentionally NOT persisted — the guided tour replays on every refresh.
      partialize: (state) => {
        const { hasOnboarded: _drop, ...rest } = state;
        void _drop;
        return rest as SettingsState;
      },
      migrate: (persisted, fromVersion) => {
        const p = (persisted ?? {}) as Partial<SettingsState>;
        if (fromVersion < 4) {
          // v? → v4
          Object.assign(p, {
            hasToggledLang: p.hasToggledLang ?? false,
            hasToggledNumerals: p.hasToggledNumerals ?? false,
            hasOnboarded: p.hasOnboarded ?? false,
            seenHeirloomCeremony: p.seenHeirloomCeremony ?? false,
            learnerName: p.learnerName ?? "",
          });
        }
        if (fromVersion < 5) {
          // v4 → v5: add profile fields. Existing learners keep their old name
          // (if any) and are treated as not-yet-having-a-profile so they get
          // the profile setup screen on next visit.
          return {
            ...p,
            version: 5,
            learnerGrade: p.learnerGrade ?? null,
            learnerAvatar: p.learnerAvatar ?? null,
            hasProfile: p.hasProfile ?? false,
          } as SettingsState;
        }
        return p as SettingsState;
      },
    },
  ),
);
