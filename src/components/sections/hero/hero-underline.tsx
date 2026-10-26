"use client";

import { animate, motion, useMotionValue, useTransform } from "motion/react";
import { useEffect, useRef, type ReactNode } from "react";
import { underlinePath } from "@/lib/scribble";
import { useElementSize } from "@/lib/use-element-size";
import { usePrefersReducedMotion } from "@/lib/use-prefers-reduced-motion";
import { readIntroDelay } from "./hero-stage";

const HEIGHT = 16;

/**
 * The orange pen underline under the H1's accent words. Hero-local variant of
 * `lines/scribble-underline.tsx` that waits for the load cover (`--intro-delay`) before drawing,
 * so it is seen being drawn instead of finishing behind the cover.
 */
export function HeroUnderline({ children, seed = 7 }: { children: ReactNode; seed?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const size = useElementSize(ref);
  const reduceMotion = usePrefersReducedMotion();
  const draw = useMotionValue(0);
  const opacity = useTransform(draw, (v) => (v > 0.002 ? 1 : 0));

  useEffect(() => {
    if (reduceMotion) {
      draw.set(1);
      return;
    }
    const controls = animate(draw, 1, { duration: 0.8, delay: readIntroDelay() + 0.35, ease: [0.6, 0, 0.3, 1] });
    return () => controls.stop();
  }, [reduceMotion, draw]);

  return (
    <span ref={ref} className="relative inline-block whitespace-nowrap">
      {children}
      {size && (
        <svg
          aria-hidden
          fill="none"
          width={size.width}
          height={HEIGHT}
          viewBox={`0 0 ${size.width} ${HEIGHT}`}
          overflow="visible"
          className="pointer-events-none absolute left-0"
          style={{ top: size.height - HEIGHT * 0.3 }}
        >
          <motion.path
            d={underlinePath(seed, size.width, HEIGHT)}
            stroke="var(--accent)"
            strokeWidth={size.width > 500 ? 3.5 : 2.5}
            strokeLinecap="round"
            style={{ pathLength: draw, opacity }}
          />
        </svg>
      )}
    </span>
  );
}
