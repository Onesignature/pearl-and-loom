"use client";

// Route-level page transitions.
//
// Wraps every navigation in a brief fade + 8px-rise mount animation so
// pages enter with a beat instead of snapping. The pathname is the key,
// so each route change remounts the wrapper and the animation fires
// fresh. No AnimatePresence "exit" — Next's App Router unmounts the
// outgoing tree synchronously, and trying to delay that with mode="wait"
// causes the next route's layout to thrash before paint.
//
// Reduced-motion: framer's MotionConfig at the top of the tree (or the
// user's OS preference via `useReducedMotion()`) collapses the duration
// to ~0; the layout still mounts, just without the rise.

import { usePathname } from "next/navigation";
import { motion, useReducedMotion } from "framer-motion";

export function RouteTransition({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const reduce = useReducedMotion();
  return (
    <motion.div
      key={pathname}
      initial={reduce ? false : { opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: reduce ? 0 : 0.42,
        ease: [0.22, 1, 0.36, 1],
      }}
      style={{ flex: 1, display: "flex", flexDirection: "column", minHeight: 0 }}
    >
      {children}
    </motion.div>
  );
}
