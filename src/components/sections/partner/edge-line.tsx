"use client";

import { motion, useScroll, useTransform } from "motion/react";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { usePrefersReducedMotion } from "@/lib/use-prefers-reduced-motion";

type Geometry = { left: number; top: number; width: number; height: number; d: string };

/**
 * The hero's scattered line, carried on: a hairline enters from the page's left edge and
 * runs into the BadgeThread knot as the badge scrolls up, so the knot it unspools from
 * reads as the same thread. Scroll-scrubbed, and it arrives about when BadgeThread starts
 * unspooling (60% in view). Drawn in full for reduced motion.
 */
export function EdgeLine({ children }: { children: ReactNode }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const [geo, setGeo] = useState<Geometry | null>(null);
  const reduceMotion = usePrefersReducedMotion();
  const { scrollYProgress } = useScroll({ target: rootRef, offset: ["start 1.1", "start 0.75"] });
  const pathLength = useTransform(scrollYProgress, [0, 1], [0, 1]);
  // Hidden at zero length, so the round cap never leaves a stray dot.
  const opacity = useTransform(scrollYProgress, [0, 0.02], [0, 1]);

  useEffect(() => {
    const root = rootRef.current;
    const section = root?.closest("section");
    if (!root || !section) return;

    const measure = () => {
      // BadgeThread's first svg is its knot.
      const knot = root.querySelector("svg");
      if (!knot) return;
      const r = root.getBoundingClientRect();
      const s = section.getBoundingClientRect();
      const k = knot.getBoundingClientRect();
      // Too little run-in on phones (it reads as a hook), and none when the knot is hidden.
      if (k.width === 0 || k.left - s.left < 140) return setGeo(null);

      const endX = k.left - s.left + k.width / 2;
      const endY = k.top - r.top + k.height / 2;
      const startY = endY - Math.min(140, r.height * 0.6);
      // Box from the section's left edge to the knot centre, in root coordinates.
      const left = s.left - r.left;
      const width = endX;
      const top = startY - 8;
      const height = endY - top + 8;
      const sy = startY - top;
      const ey = endY - top;
      // Leaves the edge almost level, then bends down into the knot.
      const d = `M 0 ${sy} C ${width * 0.55} ${sy - 4}, ${width * 0.82} ${sy + 6}, ${width} ${ey}`;
      setGeo({ left, top, width, height, d });
    };

    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(root);
    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={rootRef} className="relative w-full">
      {geo && (
        <svg
          aria-hidden
          width={geo.width}
          height={geo.height}
          viewBox={`0 0 ${geo.width} ${geo.height}`}
          fill="none"
          className="pointer-events-none absolute overflow-visible"
          style={{ left: geo.left, top: geo.top }}
        >
          <motion.path
            d={geo.d}
            stroke="var(--ink)"
            strokeOpacity={0.55}
            strokeWidth={1}
            strokeLinecap="round"
            style={reduceMotion ? undefined : { pathLength, opacity }}
          />
        </svg>
      )}
      {children}
    </div>
  );
}
