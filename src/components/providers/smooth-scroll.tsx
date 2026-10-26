"use client";

import { ReactLenis } from "lenis/react";
import { MotionConfig } from "motion/react";
import { useEffect, type ReactNode } from "react";
import { usePrefersReducedMotion } from "@/lib/use-prefers-reduced-motion";

/**
 * The single Lenis instance for the app. Lenis drives native scroll, so
 * Motion's `useScroll` stays in sync without extra wiring. With reduced
 * motion, Lenis is skipped and Motion drops transform/layout animations.
 *
 * Lenis is mounted as a childless sibling, never as a wrapper: the reduced-motion
 * preference flips after hydration (and can change mid-session), and wrapping the page
 * conditionally would put a different element type above it and remount the whole tree.
 * A childless root `ReactLenis` still creates the root instance (it runs its hooks before
 * rendering nothing), and `useLenis()` reads it from the root store.
 */
export function SmoothScroll({ children }: { children: ReactNode }) {
  const reduceMotion = usePrefersReducedMotion();

  // Hydrated: switch off the CSS reveal failsafe (globals.css) so it never fights Motion.
  useEffect(() => {
    document.documentElement.classList.add("js-ready");
  }, []);

  return (
    <MotionConfig reducedMotion="user">
      {!reduceMotion && <ReactLenis root options={{ autoRaf: true, lerp: 0.1 }} />}
      {children}
    </MotionConfig>
  );
}
