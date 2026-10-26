"use client";

import {
  motion,
  useMotionValue,
  useMotionValueEvent,
  useScroll,
  useTransform,
} from "motion/react";
import { useRef, type ReactNode } from "react";
import { growthThreadPaths } from "@/lib/scribble";
import { usePrefersReducedMotion } from "@/lib/use-prefers-reduced-motion";

const { line, arrow } = growthThreadPaths();

type GrowthThreadProps = {
  /** Overlay content, e.g. the section's heading. */
  children?: ReactNode;
  className?: string;
};

/**
 * A knot that unspools into a rising line as the section scrolls past.
 * The section is three screens tall; the drawing stays pinned while it plays.
 */
export function GrowthThread({ children, className }: GrowthThreadProps) {
  const reduceMotion = usePrefersReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start start", "end end"] });

  const drawn = useTransform(scrollYProgress, [0.05, 0.92], [0, 1], { clamp: true });
  const arrowDrawn = useTransform(scrollYProgress, [0.9, 0.98], [0, 1], { clamp: true });
  const tipX = useMotionValue(0);
  const tipY = useMotionValue(0);
  const tipOpacity = useTransform(drawn, [0, 0.02, 0.98, 1], [0, 1, 1, 0]);
  // A zero-length path with round caps still paints a dot; hide it until it has length.
  const lineOpacity = useTransform(drawn, (v) => (v > 0.001 ? 1 : 0));
  const arrowOpacity = useTransform(arrowDrawn, (v) => (v > 0.001 ? 1 : 0));

  useMotionValueEvent(drawn, "change", (progress) => {
    const path = pathRef.current;
    if (!path) return;
    const point = path.getPointAtLength(path.getTotalLength() * progress);
    tipX.set(point.x);
    tipY.set(point.y);
  });

  const svg = (
    <svg viewBox="0 0 1000 600" className="h-auto w-full" fill="none" aria-hidden>
      {reduceMotion ? (
        <>
          <path d={line} stroke="var(--ink)" strokeWidth={2} strokeLinecap="round" />
          <path d={arrow} stroke="var(--ink)" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
        </>
      ) : (
        <>
          <motion.path
            ref={pathRef}
            d={line}
            stroke="var(--ink)"
            strokeWidth={2}
            strokeLinecap="round"
            style={{ pathLength: drawn, opacity: lineOpacity }}
          />
          <motion.path
            d={arrow}
            stroke="var(--ink)"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ pathLength: arrowDrawn, opacity: arrowOpacity }}
          />
          <motion.circle r={7} fill="var(--accent)" style={{ cx: tipX, cy: tipY, opacity: tipOpacity }} />
        </>
      )}
    </svg>
  );

  if (reduceMotion) {
    return (
      // Keep the ref attached so useScroll always has a hydrated target.
      <section ref={sectionRef} className={className}>
        {children}
        {svg}
      </section>
    );
  }

  return (
    <section ref={sectionRef} className={`relative h-[300vh] ${className ?? ""}`}>
      <div className="sticky top-0 flex h-screen flex-col justify-center gap-8 overflow-hidden px-4 sm:px-10">
        {children}
        <div className="mx-auto w-full max-w-5xl">{svg}</div>
      </div>
    </section>
  );
}
