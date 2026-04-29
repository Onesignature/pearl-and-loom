import {
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from "vitest";
import { act, cleanup, fireEvent, render, screen } from "@testing-library/react";
import { I18nProvider } from "@/lib/i18n/provider";
import { useSettings } from "@/lib/store/settings";
import { useProgress } from "@/lib/store/progress";
import { HikmaCounter } from "@/components/home/HikmaCounter";
import { UnlockToast } from "@/components/achievements/UnlockToast";
import { ProfileChip } from "@/components/home/ProfileChip";
import { LessonSaduPreview } from "@/components/loom/lessons/LessonSaduPreview";
import { TitleReveal } from "@/components/ui/TitleReveal";
import { ACHIEVEMENT_BY_ID } from "@/lib/achievements/registry";

// Wrap UI in the i18n provider so `useI18n()` resolves; the provider
// itself reads from useSettings, which we reset between tests.
function withI18n(ui: React.ReactElement) {
  return render(<I18nProvider>{ui}</I18nProvider>);
}

beforeEach(() => {
  // Reset Zustand stores so each test starts from initial state.
  useProgress.getState().reset();
  useSettings.getState().resetProfile();
  useSettings.setState({ lang: "en", numeralMode: "western" });
});

afterEach(() => {
  cleanup();
});

// ─── HikmaCounter ────────────────────────────────────────────────────

describe("<HikmaCounter />", () => {
  it("renders the live ✦ score and tier band derived from progress", () => {
    // Seed progress so computeHikma returns a known total.
    // 5 loom lessons (5 × 50 = 250) + 1 royal pearl (100) + 1 achievement
    // (30) = 380 → tier "weaver" (≥150).
    useProgress.setState({
      loomLessonsCompleted: ["a", "b", "c", "d", "e"],
      pearls: [
        {
          id: "p1",
          grade: "royal",
          size: 5,
          luster: 5,
          diveId: "deepReef",
          collectedAt: 0,
          wovenIntoTapestry: false,
        },
      ],
      achievements: ["first_row"],
      streak: 0,
    });
    withI18n(<HikmaCounter />);
    // The chip's title attribute embeds the raw points + tier label.
    const chip = document.querySelector(".hikma-chip");
    expect(chip).toBeInTheDocument();
    expect(chip?.getAttribute("title")).toMatch(/380/);
    expect(chip?.getAttribute("title")).toMatch(/weaver/i);
    // The ✦ spark glyph is always rendered.
    expect(chip?.textContent ?? "").toContain("✦");
  });
});

// ─── UnlockToast ─────────────────────────────────────────────────────

describe("<UnlockToast />", () => {
  it("renders the achievement title + tagline + motif and dismisses on click", () => {
    const onDismiss = vi.fn();
    const ach = ACHIEVEMENT_BY_ID.first_row;
    if (!ach) throw new Error("first_row achievement should exist");
    withI18n(<UnlockToast achievement={ach} onDismiss={onDismiss} />);

    const status = screen.getByRole("status");
    expect(status).toHaveAttribute("aria-live", "polite");
    expect(status.textContent).toContain(ach.titleEn);
    expect(status.textContent).toContain(ach.taglineEn);
    expect(status.textContent).toContain("Wasm earned");

    fireEvent.click(status);
    expect(onDismiss).toHaveBeenCalledTimes(1);
  });

  it("auto-dismisses via setTimeout after 3500ms", () => {
    vi.useFakeTimers();
    try {
      const onDismiss = vi.fn();
      const ach = ACHIEVEMENT_BY_ID.first_row;
      if (!ach) throw new Error("first_row achievement should exist");
      withI18n(<UnlockToast achievement={ach} onDismiss={onDismiss} />);
      expect(onDismiss).not.toHaveBeenCalled();
      act(() => {
        vi.advanceTimersByTime(3500);
      });
      expect(onDismiss).toHaveBeenCalledTimes(1);
    } finally {
      vi.useRealTimers();
    }
  });
});

// ─── ProfileChip ─────────────────────────────────────────────────────

describe("<ProfileChip />", () => {
  it("returns null when the learner has no profile", () => {
    const { container } = withI18n(<ProfileChip />);
    expect(container.firstChild).toBeNull();
  });

  it("renders the first name + grade pill when a profile is set", () => {
    useSettings.setState({
      learnerName: "Layla bint Ahmad",
      learnerGrade: 4,
      learnerAvatar: "falcon",
      hasProfile: true,
    });
    withI18n(<ProfileChip />);
    // Only the first name is shown — the chip strips trailing tokens.
    expect(screen.getByText("Layla")).toBeInTheDocument();
    expect(screen.queryByText(/bint Ahmad/)).toBeNull();
    // The grade pill renders the dictionary's "Grade" word + the number.
    const chip = screen.getByRole("button");
    expect(chip.textContent).toMatch(/4/);
    expect(chip).toHaveAttribute("aria-haspopup", "menu");
  });
});

// ─── LessonSaduPreview ───────────────────────────────────────────────

describe("<LessonSaduPreview />", () => {
  it("renders the live tapestry SVG and reveals the locked caption", () => {
    const { container, rerender } = render(
      <I18nProvider>
        <LessonSaduPreview
          plannedOp={{
            kind: "symmetry",
            axis: "vertical",
            lessonId: "symmetry",
          }}
          locked={false}
        />
      </I18nProvider>,
    );
    // SVG strip is mounted regardless of lock state.
    expect(container.querySelector("svg")).toBeInTheDocument();
    // Eyebrow always reads "Your tapestry grows" in EN.
    expect(screen.getByText(/Your tapestry grows/i)).toBeInTheDocument();
    // Locked caption is suppressed before the answer lands.
    expect(screen.queryByText(/Just woven/i)).toBeNull();

    rerender(
      <I18nProvider>
        <LessonSaduPreview
          plannedOp={{
            kind: "symmetry",
            axis: "vertical",
            lessonId: "symmetry",
          }}
          locked={true}
        />
      </I18nProvider>,
    );
    // Locked caption appears with the motif name.
    expect(screen.getByText(/Just woven/i)).toBeInTheDocument();
  });
});

// ─── TitleReveal ─────────────────────────────────────────────────────

describe("<TitleReveal />", () => {
  it("renders the full text and exposes it as a single aria-label", () => {
    render(<TitleReveal text="The Pearl and the Loom" />);
    // The wrapper always carries the full string as aria-label so
    // screen readers don't read letter-by-letter.
    const wrapper = screen.getByLabelText("The Pearl and the Loom");
    expect(wrapper).toBeInTheDocument();
    // Per-character spans render the text content.
    expect(wrapper.textContent).toBe("The Pearl and the Loom");
  });

  it("supports semantic tag override via the `as` prop", () => {
    const { container } = render(
      <TitleReveal as="h1" text="Heading One" />,
    );
    expect(container.querySelector("h1")).toBeInTheDocument();
  });

  it("honours an explicit ariaLabel override", () => {
    render(<TitleReveal text="abc" ariaLabel="custom label" />);
    expect(screen.getByLabelText("custom label")).toBeInTheDocument();
  });
});
