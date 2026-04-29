"use client";

// Inner pages mostly use `position: absolute, inset: 0, overflowY: auto`
// (their TentScene/SeaScene container holds the scroll, not the body).
// Next.js's built-in scroll restoration only touches the window, so when
// you navigate /loom → /sea on mobile your previous scroll offset stays
// inside the inner container. This component watches pathname changes and
// resets *every* element with non-zero `scrollTop` back to 0 on each
// navigation. Cheap walk; runs in a single rAF after mount.

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export function RouteScrollReset() {
  const pathname = usePathname();

  useEffect(() => {
    function reset() {
      // Window first (covers home + body-scrolling routes).
      window.scrollTo({ top: 0, left: 0, behavior: "auto" });
      // Then any inner scroll containers — many inner pages use
      // `position: absolute, inset: 0, overflowY: auto`, so window.scrollTo
      // alone misses them.
      const all = document.querySelectorAll<HTMLElement>("*");
      for (const el of all) {
        if (el.scrollTop !== 0) el.scrollTop = 0;
      }
    }

    // Reset across multiple timing windows so we catch:
    //   - synchronous content (immediate)
    //   - layout after the first paint (rAF)
    //   - late hydration of dynamic Suspense boundaries (50 ms / 200 ms)
    reset();
    const raf = requestAnimationFrame(reset);
    const t1 = window.setTimeout(reset, 50);
    const t2 = window.setTimeout(reset, 200);
    return () => {
      cancelAnimationFrame(raf);
      window.clearTimeout(t1);
      window.clearTimeout(t2);
    };
  }, [pathname]);

  return null;
}
