"use client";

import { useInView, useScroll, useTransform, type MotionValue } from "motion/react";
import { createContext, useContext, useMemo, useRef, type ReactNode } from "react";

type HeroMotion = {
  /** 0 while the hero sits at the top, 1 once it has scrolled ~60% of its height away. */
  unravel: MotionValue<number>;
};

const HeroMotionContext = createContext<HeroMotion | null>(null);

/** The hero's shared scroll state, for the tangles and the thread placed anywhere inside the stage. */
export function useHeroMotion() {
  const value = useContext(HeroMotionContext);
  if (!value) throw new Error("useHeroMotion must be used inside <HeroStage>");
  return value;
}

/** Seconds the load cover holds the entrance back (`--intro-delay`, 0 on repeat visits). Effects only. */
export function readIntroDelay() {
  return parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--intro-delay")) || 0;
}

const UNRAVEL_SPAN = 0.6;

/**
 * The hero's full-viewport stage. It owns the one scroll measurement the hero needs (the unravel
 * progress) and pauses the hero's CSS loops (tangle drift, platform marquee) while off-screen
 * through `data-paused`. The content inside stays server-rendered.
 */
export function HeroStage({ children, className }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { initial: true });
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const unravel = useTransform(scrollYProgress, [0, UNRAVEL_SPAN], [0, 1], { clamp: true });
  const value = useMemo(() => ({ unravel }), [unravel]);

  return (
    <HeroMotionContext.Provider value={value}>
      <div ref={ref} data-paused={inView ? undefined : ""} className={className}>
        {children}
      </div>
    </HeroMotionContext.Provider>
  );
}
