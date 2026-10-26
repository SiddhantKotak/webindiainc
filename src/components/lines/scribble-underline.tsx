"use client";

import { motion, useInView } from "motion/react";
import { useRef, type ReactNode } from "react";
import { underlinePath } from "@/lib/scribble";
import { useElementSize } from "@/lib/use-element-size";
import { usePrefersReducedMotion } from "@/lib/use-prefers-reduced-motion";

type ScribbleUnderlineProps = {
  children: ReactNode;
  seed?: number;
  className?: string;
};

const HEIGHT = 14;

/** A loose pen underline that draws left to right when its text enters the viewport. */
export function ScribbleUnderline({ children, seed = 5, className }: ScribbleUnderlineProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const size = useElementSize(ref);
  const inView = useInView(ref, { once: true, amount: 0.8 });
  const reduceMotion = usePrefersReducedMotion();

  return (
    <span ref={ref} className={`relative inline-block whitespace-nowrap ${className ?? ""}`}>
      {children}
      {size && (
        <svg
          aria-hidden
          fill="none"
          width={size.width}
          height={HEIGHT}
          viewBox={`0 0 ${size.width} ${HEIGHT}`}
          className="pointer-events-none absolute left-0 overflow-visible"
          style={{ top: size.height - HEIGHT * 0.35 }}
        >
          <motion.path
            d={underlinePath(seed, size.width, HEIGHT)}
            stroke="var(--accent)"
            strokeWidth={2.5}
            strokeLinecap="round"
            initial={reduceMotion ? false : { pathLength: 0, opacity: 0 }}
            animate={inView || reduceMotion ? { pathLength: 1, opacity: 1 } : { pathLength: 0, opacity: 0 }}
            transition={reduceMotion ? { duration: 0 } : {
              pathLength: { duration: 0.7, delay: 0.15, ease: [0.6, 0, 0.3, 1] },
              opacity: { duration: 0.1, delay: 0.15 },
            }}
          />
        </svg>
      )}
    </span>
  );
}
