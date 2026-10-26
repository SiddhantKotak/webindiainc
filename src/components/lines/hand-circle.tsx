"use client";

import { motion, useInView } from "motion/react";
import { useRef, type ReactNode } from "react";
import { handEllipsePath } from "@/lib/scribble";
import { useElementSize } from "@/lib/use-element-size";
import { usePrefersReducedMotion } from "@/lib/use-prefers-reduced-motion";

type HandCircleProps = {
  children: ReactNode;
  seed?: number;
  /** How far the ring extends past the text, as a fraction of its size. */
  pad?: number;
  className?: string;
};

/** Circles its content with a quick pen stroke when it scrolls into view. */
export function HandCircle({ children, seed = 3, pad = 0.18, className }: HandCircleProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const size = useElementSize(ref);
  const inView = useInView(ref, { once: true, amount: 0.8 });
  const reduceMotion = usePrefersReducedMotion();

  let ring: ReactNode = null;
  if (size) {
    const width = size.width * (1 + pad * 2);
    const height = size.height * (1 + pad * 2.4);
    const d = handEllipsePath(seed, width, height);
    ring = (
      <svg
        aria-hidden
        fill="none"
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        className="pointer-events-none absolute overflow-visible"
        style={{ left: -(width - size.width) / 2, top: -(height - size.height) / 2 }}
      >
        <motion.path
          d={d}
          stroke="var(--accent)"
          strokeWidth={2.5}
          strokeLinecap="round"
          initial={reduceMotion ? false : { pathLength: 0, opacity: 0 }}
          animate={inView || reduceMotion ? { pathLength: 1, opacity: 1 } : { pathLength: 0, opacity: 0 }}
          transition={reduceMotion ? { duration: 0 } : {
            pathLength: { duration: 0.9, ease: [0.6, 0, 0.3, 1] },
            opacity: { duration: 0.1 },
          }}
        />
      </svg>
    );
  }

  return (
    <span ref={ref} className={`relative inline-block ${className ?? ""}`}>
      {children}
      {ring}
    </span>
  );
}
