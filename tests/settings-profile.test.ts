import { describe, it, expect, beforeEach } from "vitest";
import { useSettings } from "@/lib/store/settings";

// Reset the persisted store between tests so each one starts from defaults.
function reset() {
  useSettings.setState({
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
  });
}

describe("settings · profile fields", () => {
  beforeEach(reset);

  it("starts with no profile and null grade/avatar", () => {
    const s = useSettings.getState();
    expect(s.hasProfile).toBe(false);
    expect(s.learnerName).toBe("");
    expect(s.learnerGrade).toBeNull();
    expect(s.learnerAvatar).toBeNull();
  });

  it("setLearnerName truncates names beyond 60 characters", () => {
    const long = "a".repeat(120);
    useSettings.getState().setLearnerName(long);
    expect(useSettings.getState().learnerName).toHaveLength(60);
  });

  it("setLearnerGrade accepts valid grades 4-8", () => {
    for (const g of [4, 5, 6, 7, 8] as const) {
      useSettings.getState().setLearnerGrade(g);
      expect(useSettings.getState().learnerGrade).toBe(g);
    }
  });

  it("setLearnerAvatar accepts the four named tokens", () => {
    for (const a of ["falcon", "dhow", "pearl", "palm"] as const) {
      useSettings.getState().setLearnerAvatar(a);
      expect(useSettings.getState().learnerAvatar).toBe(a);
    }
  });

  it("completeProfileSetup writes name + grade + avatar and flips hasProfile", () => {
    useSettings
      .getState()
      .completeProfileSetup({ name: "Layla", grade: 4, avatar: "falcon" });
    const s = useSettings.getState();
    expect(s.learnerName).toBe("Layla");
    expect(s.learnerGrade).toBe(4);
    expect(s.learnerAvatar).toBe("falcon");
    expect(s.hasProfile).toBe(true);
  });

  it("completeProfileSetup truncates the name", () => {
    useSettings.getState().completeProfileSetup({
      name: "X".repeat(120),
      grade: 6,
      avatar: "dhow",
    });
    expect(useSettings.getState().learnerName).toHaveLength(60);
  });

  it("resetProfile clears identity but keeps everything else (lang, audio, etc)", () => {
    useSettings
      .getState()
      .completeProfileSetup({ name: "Bilal", grade: 8, avatar: "pearl" });
    useSettings.setState({ lang: "ar", audioEnabled: false });
    useSettings.getState().resetProfile();
    const s = useSettings.getState();
    expect(s.hasProfile).toBe(false);
    expect(s.learnerName).toBe("");
    expect(s.learnerGrade).toBeNull();
    expect(s.learnerAvatar).toBeNull();
    // Untouched:
    expect(s.lang).toBe("ar");
    expect(s.audioEnabled).toBe(false);
  });
});
