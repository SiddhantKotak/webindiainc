"use client";

import { motion } from "motion/react";
import type { ReactNode } from "react";
import { usePrefersReducedMotion } from "@/lib/use-prefers-reduced-motion";

type RevealProps = {
  children: ReactNode;
  /** Seconds. */
  delay?: number;
  /** Starting offset in px; the reference uses 50 for side-ins and 20–50 for rises. */
  y?: number;
  x?: number;
  className?: string;
};

/** Fades and slides its content in once when it enters the viewport. Reduced motion: shown at once. */
export function Reveal({ children, delay = 0, y = 32, x = 0, className }: RevealProps) {
  const reduceMotion = usePrefersReducedMotion();
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, x, y }}
      {...(reduceMotion
        ? { animate: { opacity: 1, x: 0, y: 0, transition: { duration: 0 } } }
        : { whileInView: { opacity: 1, x: 0, y: 0 } })}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}
