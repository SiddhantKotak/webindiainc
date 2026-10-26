"use client";

import { motion, useMotionValue, useSpring } from "motion/react";
import { useRef, type ReactNode } from "react";
import { useMediaQuery } from "@/lib/use-media-query";
import { usePrefersReducedMotion } from "@/lib/use-prefers-reduced-motion";

const PULL = 0.3;
const MAX = 12;
const SPRING = { stiffness: 220, damping: 18, mass: 0.4 };

/**
 * A slight pull toward the pointer for the primary CTA. Transform only; the hit area reaches a
 * little past the button so the pull starts just before the pointer arrives. Off for touch,
 * coarse pointers and reduced motion. The element's rect is read once per entry, not per move.
 */
export function Magnetic({ children, className }: { children: ReactNode; className?: string }) {
  const finePointer = useMediaQuery("(hover: hover) and (pointer: fine)");
  const reduceMotion = usePrefersReducedMotion();
  const enabled = finePointer && !reduceMotion;
  const rect = useRef<DOMRect | null>(null);
  const x = useSpring(useMotionValue(0), SPRING);
  const y = useSpring(useMotionValue(0), SPRING);

  const clamp = (n: number) => Math.max(-MAX, Math.min(MAX, n));
  const reset = () => {
    rect.current = null;
    x.set(0);
    y.set(0);
  };

  return (
    <span
      className={`-m-4 inline-flex p-4 ${className ?? ""}`}
      onPointerEnter={(event) => {
        if (enabled) rect.current = event.currentTarget.getBoundingClientRect();
      }}
      onPointerMove={(event) => {
        const box = rect.current;
        if (!enabled || !box) return;
        x.set(clamp((event.clientX - (box.left + box.width / 2)) * PULL));
        y.set(clamp((event.clientY - (box.top + box.height / 2)) * PULL));
      }}
      onPointerLeave={reset}
    >
      <motion.span className="inline-flex" style={{ x, y }}>
        {children}
      </motion.span>
    </span>
  );
}
