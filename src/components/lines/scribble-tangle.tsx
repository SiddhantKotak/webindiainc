"use client";

import { motion, type Variants } from "motion/react";
import { useState } from "react";
import { tanglePath } from "@/lib/scribble";
import { usePrefersReducedMotion } from "@/lib/use-prefers-reduced-motion";

type ScribbleTangleProps = {
  seed: number;
  /** Rendered size in px. */
  size?: number;
  loops?: number;
  /** Seconds before the draw-in starts. */
  delay?: number;
  className?: string;
};

const RADIUS = 50;
const VIEW = RADIUS * 1.6;

const strokeVariants: Variants = {
  hidden: { pathLength: 0, opacity: 0 },
  shown: (delay: number) => ({
    pathLength: 1,
    opacity: 1,
    transition: {
      pathLength: { duration: 1.8, delay, ease: [0.65, 0, 0.35, 1] },
      opacity: { duration: 0.2, delay },
    },
  }),
  // On hover the pen scribbles the tangle again, fast.
  hover: {
    pathLength: [0.05, 1],
    opacity: 1,
    transition: { duration: 0.9, ease: [0.45, 0, 0.2, 1] },
  },
};

const bodyVariants: Variants = {
  hover: { rotate: 24, scale: 1.08, transition: { type: "spring", stiffness: 140, damping: 14 } },
};

export function ScribbleTangle({ seed, size = 120, loops = 9, delay = 0, className }: ScribbleTangleProps) {
  const reduceMotion = usePrefersReducedMotion();
  // The entrance delay applies once; returning from hover should be immediate.
  const [drawn, setDrawn] = useState(false);
  const d = tanglePath(seed, RADIUS, loops);
  const ghost = tanglePath(seed + 101, RADIUS * 0.96, Math.max(3, loops - 3));
  const viewBox = `${-VIEW} ${-VIEW} ${VIEW * 2} ${VIEW * 2}`;

  if (reduceMotion) {
    return (
      <svg className={className} width={size} height={size} viewBox={viewBox} aria-hidden fill="none" overflow="visible">
        <path d={ghost} stroke="var(--ink)" strokeOpacity={0.25} strokeWidth={0.8} />
        <path d={d} stroke="var(--ink)" strokeWidth={1.1} strokeLinecap="round" />
      </svg>
    );
  }

  return (
    // overflow visible: the hover scale-up and the hand-drawn overshoot must never be clipped.
    <motion.svg
      overflow="visible"
      className={className}
      width={size}
      height={size}
      viewBox={viewBox}
      aria-hidden
      fill="none"
      initial="hidden"
      animate="shown"
      whileHover="hover"
    >
      {/* Idle drift: one slow turn a minute keeps the field from feeling frozen. A CSS animation
          (globals.css `.wi-drift`), not Motion: a JS loop here ran every frame forever, even for
          tangles hidden at small breakpoints. */}
      <g className="wi-drift" style={{ animationDuration: `${60 + (seed % 7) * 8}s` }}>
        <motion.g variants={bodyVariants}>
          <motion.path
            d={ghost}
            stroke="var(--ink)"
            strokeOpacity={0.25}
            strokeWidth={0.8}
            custom={drawn ? 0 : delay + 0.3}
            variants={strokeVariants}
          />
          <motion.path
            d={d}
            stroke="var(--ink)"
            strokeWidth={1.1}
            strokeLinecap="round"
            custom={drawn ? 0 : delay}
            variants={strokeVariants}
            onAnimationComplete={() => setDrawn(true)}
          />
        </motion.g>
      </g>
    </motion.svg>
  );
}
