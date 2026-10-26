"use client";

import { animate, motion, useMotionValue, useTransform } from "motion/react";
import { useEffect, useId, useMemo, useRef } from "react";
import { smoothPath, tanglePoints, type Point } from "@/lib/scribble";
import { useElementSize } from "@/lib/use-element-size";
import { usePrefersReducedMotion } from "@/lib/use-prefers-reduced-motion";
import { readIntroDelay, useHeroMotion } from "./hero-stage";

const SEED = 19;
/** Length (px) over which the thread's tail fades out at the bottom. */
const FADE = 96;

const polyLength = (points: Point[]) =>
  points.reduce((sum, p, i) => (i ? sum + Math.hypot(p[0] - points[i - 1][0], p[1] - points[i - 1][1]) : 0), 0);

/** The last knot's points and the clean line it becomes, in the box's own pixels. */
function threadGeometry(width: number, height: number) {
  const cx = width / 2;
  const r = width * 0.3;
  const cy = r * 1.15;
  const knot = tanglePoints(SEED, { loops: 7, radius: r, cx, cy, squash: 0.85 });
  const [ex, ey] = knot[knot.length - 1];
  // Out of the knot with one easy swing, then straight down: the clean line.
  const line: Point[] = [
    [cx + (ex - cx) * 0.4 + r * 0.5, Math.max(ey, cy) + r * 1.1],
    [cx + r * 0.08, cy + r * 2.6],
    [cx, cy + r * 3.8],
    [cx, height - 1],
  ];
  const all = [...knot, ...line];
  const knotShare = polyLength(knot) / polyLength(all);
  return { d: smoothPath(all, 0.9), knotShare };
}

/**
 * The hero's last knot and the one clean line it becomes: the page's story in a single stroke.
 * It draws in as a knot after the tangle field; as the hero scrolls away (the stage's `unravel`
 * progress) the pen pulls the knot out into one straight line that runs down out of the hero,
 * toward the next section. Only `pathLength`/`pathOffset` change on scroll.
 */
export function UnravelThread({ className }: { className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const size = useElementSize(ref);
  const reduceMotion = usePrefersReducedMotion();
  const { unravel } = useHeroMotion();
  const gradientId = useId();
  const draw = useMotionValue(0);

  const geometry = useMemo(
    () => (size && size.height > size.width ? threadGeometry(size.width, size.height) : null),
    [size],
  );
  const knotShare = geometry?.knotShare ?? 0.5;

  // The visible window [from, to] along the path: the knot erases from its start while the line
  // draws to the end, so the knot appears to be pulled out into the line.
  const from = useTransform(unravel, (u) => knotShare * Math.min(1, u / 0.8));
  const to = useTransform(() => knotShare * draw.get() + (1 - knotShare) * unravel.get());
  const length = useTransform(() => Math.max(0, to.get() - from.get()));
  const opacity = useTransform(() => (to.get() > 0.002 ? 1 : 0));

  useEffect(() => {
    if (reduceMotion) {
      draw.set(1);
      return;
    }
    const controls = animate(draw, 1, { duration: 1.4, delay: readIntroDelay() + 1.1, ease: [0.65, 0, 0.35, 1] });
    return () => controls.stop();
  }, [reduceMotion, draw]);

  return (
    <div ref={ref} aria-hidden className={className}>
      {size && geometry && (
        <svg
          width={size.width}
          height={size.height}
          viewBox={`0 0 ${size.width} ${size.height}`}
          overflow="visible"
          fill="none"
          className="block"
        >
          <defs>
            <linearGradient id={gradientId} gradientUnits="userSpaceOnUse" x1="0" x2="0" y1={size.height - FADE} y2={size.height}>
              <stop offset="0" stopColor="var(--ink)" />
              <stop offset="1" stopColor="var(--ink)" stopOpacity="0" />
            </linearGradient>
          </defs>
          {reduceMotion ? (
            // Reduced motion: the whole story at once, knot and line.
            <path d={geometry.d} stroke={`url(#${gradientId})`} strokeWidth={1.4} strokeLinecap="round" />
          ) : (
            <motion.path
              d={geometry.d}
              stroke={`url(#${gradientId})`}
              strokeWidth={1.4}
              strokeLinecap="round"
              style={{ pathLength: length, pathOffset: from, opacity }}
            />
          )}
        </svg>
      )}
    </div>
  );
}
