"use client";

import { motion } from "motion/react";
import { usePrefersReducedMotion } from "@/lib/use-prefers-reduced-motion";

/**
 * The seam between Recognition and the FAQ: one clean line drawn left to right as it enters,
 * the page's thread passing from the credentials into the answers. Transform-only (scaleX), so
 * it runs on the compositor. It starts at `opacity: 0` as well, which puts it under the global
 * no-JS / failed-hydration reveal (that selector keys on inline `opacity:0`).
 */
export function SeamLine() {
  const reduceMotion = usePrefersReducedMotion();

  return (
    <motion.div
      aria-hidden
      className="h-px origin-left bg-ink"
      initial={{ opacity: 0, scaleX: 0 }}
      whileInView={{ opacity: 1, scaleX: 1 }}
      viewport={{ once: true, amount: 1 }}
      transition={
        reduceMotion
          ? { duration: 0 }
          : { scaleX: { duration: 1.1, ease: [0.65, 0, 0.35, 1] }, opacity: { duration: 0.15 } }
      }
    />
  );
}
