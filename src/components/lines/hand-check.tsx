"use client";

import { motion, useInView } from "motion/react";
import { useId, useRef } from "react";
import { checkPath } from "@/lib/scribble";
import { usePrefersReducedMotion } from "@/lib/use-prefers-reduced-motion";

type HandCheckProps = {
  size?: number;
  /** Seconds after entering view before the pen moves. */
  delay?: number;
  className?: string;
};

/** A quick pen tick: proof, point by point. Draws once when it scrolls into view. */
export function HandCheck({ size = 28, delay = 0, className }: HandCheckProps) {
  const ref = useRef<SVGSVGElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.8 });
  const reduceMotion = usePrefersReducedMotion();
  // useId is stable across server and client, so each check gets its own
  // slightly different hand without a hydration mismatch.
  const id = useId();
  const d = checkPath([...id].reduce((h, c) => (h * 31 + c.charCodeAt(0)) >>> 0, 17));

  return (
    <svg
      ref={ref}
      className={className}
      width={size}
      height={size}
      viewBox="0 0 28 28"
      fill="none"
      overflow="visible"
      aria-hidden
    >
      <motion.path
        d={d}
        stroke="var(--accent)"
        // Keep the line ~2.5px whatever the rendered size.
        strokeWidth={2.5 * (28 / size)}
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={reduceMotion ? false : { pathLength: 0, opacity: 0 }}
        animate={inView || reduceMotion ? { pathLength: 1, opacity: 1 } : { pathLength: 0, opacity: 0 }}
        transition={reduceMotion ? { duration: 0 } : {
          // Fast in, a touch of drag at the end: a flick, not a plot.
          pathLength: { duration: 0.5, delay, ease: [0.5, 0, 0.2, 1] },
          opacity: { duration: 0.05, delay },
        }}
      />
    </svg>
  );
}
