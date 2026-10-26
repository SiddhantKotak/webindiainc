"use client";

import { motion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import { cn } from "@/lib/cn";
import { arrowThreadPaths } from "@/lib/scribble";
import { useElementSize } from "@/lib/use-element-size";
import { usePrefersReducedMotion } from "@/lib/use-prefers-reduced-motion";

type ArrowThreadProps = {
  /**
   * The thread fills this box. Defaults to full width, 120px tall (180px from
   * `sm`); any `h-*` class here replaces the default height.
   */
  className?: string;
  seed?: number;
};

/**
 * The thread leads to the action: a pencil line enters from the left, ties one
 * small loop, then drops onto the centre and points down at the CTA below.
 * Its draw is scrubbed by scroll as the box comes into view.
 */
export function ArrowThread({ className, seed = 9 }: ArrowThreadProps) {
  const ref = useRef<HTMLDivElement>(null);
  const size = useElementSize(ref);
  const reduceMotion = usePrefersReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "center 0.6"] });

  const drawn = useTransform(scrollYProgress, [0, 0.92], [0, 1], { clamp: true });
  const arrowDrawn = useTransform(scrollYProgress, [0.92, 1], [0, 1], { clamp: true });
  // A zero-length path with round caps still paints a dot; hide it until it has length.
  const lineOpacity = useTransform(drawn, (v) => (v > 0.001 ? 1 : 0));
  const arrowOpacity = useTransform(arrowDrawn, (v) => (v > 0.001 ? 1 : 0));

  const customHeight = /(^|\s)([\w-]+:)*h-/.test(className ?? "");
  const paths = size && size.width > 0 && size.height > 0 ? arrowThreadPaths(seed, size.width, size.height) : null;

  return (
    <div ref={ref} aria-hidden className={cn("relative w-full", !customHeight && "h-[120px] sm:h-[180px]", className)}>
      {size && paths && (
        <svg
          width={size.width}
          height={size.height}
          viewBox={`0 0 ${size.width} ${size.height}`}
          fill="none"
          className="absolute inset-0 overflow-visible"
        >
          {reduceMotion ? (
            <>
              <path d={paths.line} stroke="var(--ink)" strokeWidth={1.75} strokeLinecap="round" />
              <path
                d={paths.arrow}
                stroke="var(--accent)"
                strokeWidth={2.5}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </>
          ) : (
            <>
              <motion.path
                d={paths.line}
                stroke="var(--ink)"
                strokeWidth={1.75}
                strokeLinecap="round"
                style={{ pathLength: drawn, opacity: lineOpacity }}
              />
              <motion.path
                d={paths.arrow}
                stroke="var(--accent)"
                strokeWidth={2.5}
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{ pathLength: arrowDrawn, opacity: arrowOpacity }}
              />
            </>
          )}
        </svg>
      )}
    </div>
  );
}
