"use client";

import { motion, useInView } from "motion/react";
import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { cn } from "@/lib/cn";
import { badgeThreadPaths, knotPoints, smoothPath, tanglePoints, type Point } from "@/lib/scribble";
import { usePrefersReducedMotion } from "@/lib/use-prefers-reduced-motion";

type BadgeThreadProps = {
  children: ReactNode;
  seed?: number;
  className?: string;
};

// The knot is drawn in its own box (centred on 0,0) so it renders on the server.
const KNOT_RADIUS = 50;
const KNOT_VIEW = KNOT_RADIUS * 1.2;

type Layout = {
  width: number;
  height: number;
  /** The knot's last point and centre, in the overlay's coordinates. */
  start: Point;
  knotCentre: Point;
  ring: { cx: number; cy: number; rx: number; ry: number };
};

/**
 * Expertise untangles it: a small knot sits beside the children, and when they
 * scroll into view a thread unspools from it and loops once around them.
 * Side by side from a 320px-wide container; below that the knot sits on top.
 */
export function BadgeThread({ children, seed = 21, className }: BadgeThreadProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const knotRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const [layout, setLayout] = useState<Layout | null>(null);
  const inView = useInView(rootRef, { once: true, amount: 0.6 });
  const reduceMotion = usePrefersReducedMotion();

  const { knotD, ghostD, last } = useMemo(() => {
    const knot = knotPoints(seed, KNOT_RADIUS);
    return {
      knotD: smoothPath(knot),
      ghostD: smoothPath(tanglePoints(seed + 101, { loops: 3, radius: KNOT_RADIUS * 0.95, squash: 0.85 })),
      last: knot[knot.length - 1],
    };
  }, [seed]);

  useEffect(() => {
    const root = rootRef.current;
    const knotBox = knotRef.current;
    const frame = frameRef.current;
    if (!root || !knotBox || !frame) return;

    const measure = () => {
      const r = root.getBoundingClientRect();
      const k = knotBox.getBoundingClientRect();
      const f = frame.getBoundingClientRect();
      const scale = k.width / (KNOT_VIEW * 2);
      const kx = k.left - r.left + k.width / 2;
      const ky = k.top - r.top + k.height / 2;
      // The frame's padding leaves room for the ring and its overshoot.
      setLayout({
        width: r.width,
        height: r.height,
        start: [kx + last[0] * scale, ky + last[1] * scale],
        knotCentre: [kx, ky],
        ring: {
          cx: f.left - r.left + f.width / 2,
          cy: f.top - r.top + f.height / 2,
          rx: f.width / 2 - 6,
          ry: f.height / 2 - 6,
        },
      });
    };

    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(root);
    observer.observe(frame);
    return () => observer.disconnect();
  }, [last]);

  const paths = layout ? badgeThreadPaths(seed, layout.start, layout.knotCentre, layout.ring) : null;
  const play = inView || reduceMotion;

  return (
    <div className={cn("@container w-full", className)}>
      <div ref={rootRef} className="relative flex flex-col items-center @xs:flex-row @xs:justify-center @xs:gap-2 @md:gap-6">
        <div
          ref={knotRef}
          aria-hidden
          className="size-16 shrink-0 @xs:-translate-y-6 @md:size-20 @md:-translate-y-8"
        >
          <svg
            viewBox={`${-KNOT_VIEW} ${-KNOT_VIEW} ${KNOT_VIEW * 2} ${KNOT_VIEW * 2}`}
            className="size-full overflow-visible"
            fill="none"
          >
            <path d={ghostD} stroke="var(--ink)" strokeOpacity={0.25} strokeWidth={0.8} vectorEffect="non-scaling-stroke" />
            <path d={knotD} stroke="var(--ink)" strokeWidth={1.1} strokeLinecap="round" vectorEffect="non-scaling-stroke" />
          </svg>
        </div>

        <div ref={frameRef} className="relative z-10 flex items-center justify-center p-10">
          {children}
        </div>

        {layout && paths && (
          <svg
            aria-hidden
            width={layout.width}
            height={layout.height}
            viewBox={`0 0 ${layout.width} ${layout.height}`}
            fill="none"
            className="pointer-events-none absolute inset-0 overflow-visible"
          >
            <motion.path
              d={paths.thread}
              stroke="var(--ink)"
              strokeWidth={1.25}
              strokeLinecap="round"
              initial={reduceMotion ? false : { pathLength: 0, opacity: 0 }}
              animate={play ? { pathLength: 1, opacity: 1 } : { pathLength: 0, opacity: 0 }}
              transition={reduceMotion ? { duration: 0 } : {
                pathLength: { duration: 0.6, ease: [0.5, 0, 0.6, 1] },
                opacity: { duration: 0.05 },
              }}
            />
            <motion.path
              d={paths.ring}
              stroke="var(--accent)"
              strokeWidth={2.5}
              strokeLinecap="round"
              initial={reduceMotion ? false : { pathLength: 0, opacity: 0 }}
              animate={play ? { pathLength: 1, opacity: 1 } : { pathLength: 0, opacity: 0 }}
              transition={reduceMotion ? { duration: 0 } : {
                // Picks up where the thread arrives, at the thread's speed, then eases out.
                pathLength: { duration: 1, delay: 0.6, ease: [0.3, 0, 0.3, 1] },
                opacity: { duration: 0.05, delay: 0.6 },
              }}
            />
          </svg>
        )}
      </div>
    </div>
  );
}
