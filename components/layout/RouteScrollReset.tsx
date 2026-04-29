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
    const id = requestAnimationFrame(() => {
      // Window first (covers the home page + body-scrolling routes).
      window.scrollTo({ top: 0, left: 0, behavior: "auto" });
      // Then any inner scroll containers — checking scrollTop > 0 keeps
      // the assignment cost trivial for elements that aren't scrolled.
      const all = document.querySelectorAll<HTMLElement>("*");
      for (const el of all) {
        if (el.scrollTop !== 0) el.scrollTop = 0;
      }
    });
    return () => cancelAnimationFrame(id);
  }, [pathname]);

  return null;
}
