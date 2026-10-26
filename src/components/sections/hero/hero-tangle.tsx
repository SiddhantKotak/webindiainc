"use client";

import { animate, motion, useMotionValue, useTransform } from "motion/react";
import { useEffect, type CSSProperties } from "react";
import { tanglePath } from "@/lib/scribble";
import { usePrefersReducedMotion } from "@/lib/use-prefers-reduced-motion";
import { readIntroDelay, useHeroMotion } from "./hero-stage";

type HeroTangleProps = {
  seed: number;
  loops?: number;
  /** Seconds after the load cover lifts before the pen starts. */
  delay?: number;
  /** 0–1: where in the scroll-out this tangle starts to unravel (0 = first). */
  order?: number;
  /** How far (px) the tangle drifts away from the headline as it unravels. */
  drift?: readonly [number, number];
  /** Placement vars for `.hero-tangle` (hero-styles.tsx). */
  style?: CSSProperties;
};

const RADIUS = 50;
const VIEW = RADIUS * 1.6;
const VIEWBOX = `${-VIEW} ${-VIEW} ${VIEW * 2} ${VIEW * 2}`;
const EASE_DRAW = [0.65, 0, 0.35, 1] as const;

/**
 * One tangle of the hero field: the channels, keywords and spend a client arrives with. It draws
 * itself in after the load cover, re-scribbles on hover, and as the hero scrolls away it unravels:
 * the pen rewinds the stroke while the loops loosen, drift apart and fade, leaving only the one
 * clean thread (unravel-thread.tsx). Hero-local variant of `lines/scribble-tangle.tsx`, driven by
 * the stage's shared scroll progress instead of its own.
 */
export function HeroTangle({ seed, loops = 9, delay = 0, order = 0, drift = [0, 0], style }: HeroTangleProps) {
  const reduceMotion = usePrefersReducedMotion();
  const { unravel } = useHeroMotion();
  const draw = useMotionValue(0);
  // Each tangle unravels over 60% of the scroll-out, staggered by `order`.
  const start = order * 0.4;
  const loosen = useTransform(unravel, [start, start + 0.6], [0, 1], { clamp: true });
  const length = useTransform(() => draw.get() * (1 - loosen.get()));
  // A zero-length round-capped stroke still paints a dot, so stay invisible until the pen moves.
  const opacity = useTransform(() => (draw.get() > 0.002 ? 1 : 0) * (1 - loosen.get()));
  const x = useTransform(loosen, [0, 1], [0, drift[0]]);
  const y = useTransform(loosen, [0, 1], [0, drift[1]]);
  const scale = useTransform(loosen, [0, 1], [1, 1.25]);
  const rotate = useTransform(loosen, [0, 1], [0, seed % 2 ? 40 : -40]);

  useEffect(() => {
    if (reduceMotion) {
      draw.set(1);
      return;
    }
    const controls = animate(draw, 1, { duration: 1.8, delay: readIntroDelay() + delay, ease: EASE_DRAW });
    return () => controls.stop();
  }, [reduceMotion, draw, delay]);

  const d = tanglePath(seed, RADIUS, loops);
  const ghost = tanglePath(seed + 101, RADIUS * 0.96, Math.max(3, loops - 3));

  if (reduceMotion) {
    return (
      <div aria-hidden className="hero-tangle" style={style}>
        <svg className="block size-full" viewBox={VIEWBOX} overflow="visible" fill="none">
          <path d={ghost} stroke="var(--ink)" strokeOpacity={0.25} strokeWidth={0.8} vectorEffect="non-scaling-stroke" />
          <path d={d} stroke="var(--ink)" strokeWidth={1.2} strokeLinecap="round" vectorEffect="non-scaling-stroke" />
        </svg>
      </div>
    );
  }

  return (
    <div
      aria-hidden
      className="hero-tangle"
      style={style}
      onPointerEnter={(event) => {
        // Re-scribble on hover, once drawn and only while the hero is still settled.
        if (event.pointerType !== "mouse" || draw.isAnimating() || loosen.get() > 0) return;
        animate(draw, [0.05, 1], { duration: 0.9, ease: [0.45, 0, 0.2, 1] });
      }}
    >
      <motion.svg
        className="block size-full"
        viewBox={VIEWBOX}
        overflow="visible"
        fill="none"
        style={{ x, y, scale, rotate, opacity }}
      >
        {/* Idle drift (globals.css `.wi-drift`), paused with the stage when off-screen. */}
        <g className="wi-drift" style={{ animationDuration: `${60 + (seed % 7) * 8}s` }}>
          <g className="hero-tangle-body">
            <motion.path
              d={ghost}
              stroke="var(--ink)"
              strokeOpacity={0.25}
              strokeWidth={0.8}
              vectorEffect="non-scaling-stroke"
              style={{ pathLength: length }}
            />
            <motion.path
              d={d}
              stroke="var(--ink)"
              strokeWidth={1.2}
              strokeLinecap="round"
              vectorEffect="non-scaling-stroke"
              style={{ pathLength: length }}
            />
          </g>
        </g>
      </motion.svg>
    </div>
  );
}
