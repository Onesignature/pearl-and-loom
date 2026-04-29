import "@testing-library/jest-dom/vitest";
import { MotionGlobalConfig } from "framer-motion";

// React 19 + @testing-library/react 16 — required for proper act
// integration. Without this flag, render() throws "renderRoot ...
// pure.js:189" in stricter Node environments (Vercel build runner is
// one of them).
(globalThis as unknown as { IS_REACT_ACT_ENVIRONMENT: boolean })
  .IS_REACT_ACT_ENVIRONMENT = true;

// Skip every framer-motion animation in tests so AnimatePresence and
// motion.* components resolve synchronously instead of waiting for
// transition timers. Without this, render() can hang on framer-driven
// trees in CI environments where rAF timing differs from local jsdom.
MotionGlobalConfig.skipAnimations = true;

// jsdom doesn't ship matchMedia. Several of our components (and framer-
// motion's useReducedMotion) call it on mount; without a stub they
// throw. Default response: prefers-reduced-motion = true so the test
// environment doesn't kick off framer animations.
if (typeof window !== "undefined" && !window.matchMedia) {
  Object.defineProperty(window, "matchMedia", {
    writable: true,
    value: (query: string) => ({
      matches: query.includes("prefers-reduced-motion"),
      media: query,
      onchange: null,
      addListener: () => {},
      removeListener: () => {},
      addEventListener: () => {},
      removeEventListener: () => {},
      dispatchEvent: () => false,
    }),
  });
}
