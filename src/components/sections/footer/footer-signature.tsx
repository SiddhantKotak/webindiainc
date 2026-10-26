"use client";

import { motion, useInView } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { arrowheadPath } from "@/lib/scribble";
import { usePrefersReducedMotion } from "@/lib/use-prefers-reduced-motion";

/** Height of the rise, in px. It lives in the footer grid's 40px bottom padding, 18px clear of the last row. */
const H = 22;
const EASE = [0.65, 0, 0.35, 1] as const;

type Geometry = { width: number; line: string; arrow: string };

/**
 * The page's last line: the thread that unspooled from the tangle and led to the CTA runs on
 * along the footer's bottom divider and rises at the end, finishing above the copyright year:
 * tangle → one line → growth. Drawn once when it comes into view; static under reduced motion.
 *
 * Renders into the divider's positioned wrapper and sits just above it (`bottom-full`). The end
 * point is measured from the `[data-footer-year]` span, so nothing renders until mounted (it is
 * decoration; without JS the divider is simply plain).
 */
export function FooterSignature() {
  const ref = useRef<SVGSVGElement>(null);
  const [geometry, setGeometry] = useState<Geometry | null>(null);
  const reduceMotion = usePrefersReducedMotion();
  const inView = useInView(ref, { once: true, amount: 1 });

  useEffect(() => {
    const host = ref.current?.parentElement;
    const year = host?.querySelector<HTMLElement>("[data-footer-year]");
    if (!host || !year) return;

    const measure = () => {
      const hostBox = host.getBoundingClientRect();
      const yearBox = year.getBoundingClientRect();
      const width = hostBox.width;
      // Above the year where it sits right of centre (from `sm`); on phones the year is near the
      // left edge, so the line runs on to the middle of the copyright line instead.
      const endX = Math.min(width - 8, Math.max(yearBox.left + yearBox.width / 2 - hostBox.left, width * 0.55));
      const rise = Math.min(200, endX * 0.4);
      const foot = endX - rise;
      const base = H - 0.5;
      const c2: [number, number] = [endX - rise * 0.22, H * 0.5];
      const tip: [number, number] = [endX, 3];
      const line = `M-2 ${base} L${foot.toFixed(1)} ${base} C${(foot + rise * 0.5).toFixed(1)} ${base} ${c2[0].toFixed(1)} ${c2[1]} ${tip[0].toFixed(1)} ${tip[1]}`;
      const angle = Math.atan2(tip[1] - c2[1], tip[0] - c2[0]);
      setGeometry((prev) =>
        prev && prev.line === line ? prev : { width, line, arrow: arrowheadPath(tip, angle, 9, 0.55) },
      );
    };

    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(host);
    if (year.parentElement) observer.observe(year.parentElement);
    return () => observer.disconnect();
  }, []);

  const draw = !reduceMotion && geometry;

  return (
    <svg
      ref={ref}
      aria-hidden
      width={geometry?.width ?? 0}
      height={H}
      viewBox={`0 0 ${geometry?.width ?? 1} ${H}`}
      fill="none"
      className="pointer-events-none absolute bottom-full left-0 overflow-visible"
    >
      {geometry && !draw && (
        <>
          <path d={geometry.line} stroke="var(--accent)" strokeWidth={1.5} strokeLinecap="round" />
          <path d={geometry.arrow} stroke="var(--accent)" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
        </>
      )}
      {draw && (
        <>
          <motion.path
            d={geometry.line}
            stroke="var(--accent)"
            strokeWidth={1.5}
            strokeLinecap="round"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={inView ? { pathLength: 1, opacity: 1 } : undefined}
            transition={{ pathLength: { duration: 1.6, ease: EASE }, opacity: { duration: 0.01 } }}
          />
          <motion.path
            d={geometry.arrow}
            stroke="var(--accent)"
            strokeWidth={1.5}
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={inView ? { pathLength: 1, opacity: 1 } : undefined}
            transition={{ delay: 1.5, pathLength: { duration: 0.3, delay: 1.5 }, opacity: { duration: 0.01, delay: 1.5 } }}
          />
        </>
      )}
    </svg>
  );
}
