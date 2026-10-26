"use client";

import { animate, useInView } from "motion/react";
import { usePrefersReducedMotion } from "@/lib/use-prefers-reduced-motion";
import { useEffect, useRef } from "react";
import { cn } from "@/lib/cn";

type CounterProps = {
  value: number;
  prefix?: string;
  suffix?: string;
  /** Seconds. */
  duration?: number;
  /** Start counting only when this is true (e.g. when a line reaches it). Defaults to entering view. */
  start?: boolean;
  className?: string;
};

const format = (n: number) => Math.round(n).toLocaleString("en-US");

/**
 * Counts up from zero once. The server renders the final value, so it is correct without
 * JavaScript; screen readers always get the final value, never the intermediate ones.
 */
export function Counter({ value, prefix = "", suffix = "", duration = 1.6, start, className }: CounterProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const reduceMotion = usePrefersReducedMotion();
  const played = useRef(false);
  const go = start ?? inView;
  const final = `${prefix}${format(value)}${suffix}`;

  // Once hydrated (and normally still off-screen), park the visible digits at zero so the
  // count-up starts from 0 instead of jumping down from the server-rendered final value.
  // The reduced-motion hook reads false for the hydration render, so when it flips to true
  // this restores the final value instead of leaving the digits parked at zero.
  useEffect(() => {
    const node = ref.current;
    if (!node || played.current) return;
    node.textContent = reduceMotion ? final : `${prefix}${format(0)}${suffix}`;
  }, [reduceMotion, prefix, suffix, final]);

  useEffect(() => {
    const node = ref.current;
    if (!node || !go || reduceMotion || played.current) return;
    played.current = true;
    const controls = animate(0, value, {
      duration,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (v) => {
        node.textContent = `${prefix}${format(v)}${suffix}`;
      },
    });
    return () => {
      controls.stop();
      node.textContent = final;
      // Lets React's dev double-run of effects replay the count instead of skipping it.
      played.current = false;
    };
  }, [go, reduceMotion, value, prefix, suffix, duration, final]);

  return (
    <span className={cn("numeral", className)}>
      {/* The count-up writes this span's text directly, so React must not own its children:
          innerHTML gives the server render the final value without a React-managed text node. */}
      <span ref={ref} aria-hidden dangerouslySetInnerHTML={{ __html: escapeHtml(final) }} />
      <span className="sr-only">{final}</span>
    </span>
  );
}

function escapeHtml(text: string) {
  return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
