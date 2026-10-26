"use client";

import { AnimatePresence, motion, useInView } from "motion/react";
import { usePrefersReducedMotion } from "@/lib/use-prefers-reduced-motion";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { OutlineCard } from "@/components/ui/outline-card";
import type { Asset } from "@/content/assets";
import { cn } from "@/lib/cn";

export type ReviewItem = {
  platform: string;
  count: number;
  /** e.g. "680+" */
  figure: string;
  /** The full label, e.g. "680+ reviews". */
  label: string;
  logo: Asset | null;
};

const CYCLE_MS = 4500;
const TICKS = 44;

function Stars({ className }: { className?: string }) {
  return (
    <span aria-hidden className={cn("flex gap-0.5", className)}>
      {Array.from({ length: 5 }, (_, i) => (
        <svg key={i} viewBox="0 0 12 12" className="aspect-square h-full">
          <path d="M6 .8 7.55 4.1l3.6.42-2.66 2.47.7 3.56L6 8.77l-3.19 1.78.7-3.56L.85 4.52l3.6-.42Z" fill="currentColor" />
        </svg>
      ))}
    </span>
  );
}

function Logo({ item, className }: { item: ReviewItem; className?: string }) {
  if (!item.logo) return <span className={cn("font-semibold leading-none", className)}>{item.platform}</span>;
  // The live logos are light-grey artwork for dark backgrounds; brightness-0 sets them in ink.
  return (
    <Image
      src={item.logo.src}
      alt={item.logo.alt}
      width={item.logo.width}
      height={item.logo.height}
      className={cn("w-auto brightness-0", className)}
    />
  );
}

/**
 * The hero's data card (reference pattern A): the three review platforms, auto-cycling a highlight.
 * The tick bar is each platform's review count relative to the largest one.
 */
export function ReviewCard({ items }: { items: ReviewItem[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: 0.3 });
  const reduceMotion = usePrefersReducedMotion();
  const [active, setActive] = useState(0);
  const [auto, setAuto] = useState(true);
  const [paused, setPaused] = useState(false);

  // Auto-advance only while visible, not hovered/focused, not chosen by the user, and motion is allowed.
  const cycling = auto && inView && !paused && !reduceMotion;
  useEffect(() => {
    if (!cycling) return;
    const timer = window.setTimeout(() => setActive((a) => (a + 1) % items.length), CYCLE_MS);
    return () => window.clearTimeout(timer);
  }, [cycling, active, items.length]);

  const current = items[active];
  const max = Math.max(...items.map((item) => item.count));
  const filled = Math.max(1, Math.round((current.count / max) * TICKS));
  const unit = current.label.startsWith(current.figure) ? current.label.slice(current.figure.length).trim() : "";

  return (
    <div
      ref={ref}
      onPointerEnter={() => setPaused(true)}
      onPointerLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      <OutlineCard className="overflow-hidden bg-sky">
        {/* Visual summary of the selected platform; the buttons below carry the same text for AT. */}
        <div aria-hidden className="px-4 pt-4 sm:px-6 sm:pt-5">
          <div className="flex items-start justify-between gap-4">
            <div className="relative h-[46px] overflow-hidden sm:h-[58px]">
              <AnimatePresence mode="popLayout" initial={false}>
                <motion.span
                  key={current.platform}
                  className="numeral block text-[46px] sm:text-[58px]"
                  initial={{ y: "70%", opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: "-70%", opacity: 0 }}
                  transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                >
                  {current.figure}
                </motion.span>
              </AnimatePresence>
            </div>
            <div className="flex flex-col items-end gap-2 pt-1 text-right">
              <span className="text-sm font-semibold leading-none">{current.platform}</span>
              <span className="text-sm leading-none">{unit}</span>
            </div>
          </div>
          <div className="mt-4 flex h-7 items-end justify-between sm:mt-5">
            {Array.from({ length: TICKS }, (_, i) => (
              <span
                key={i}
                className={cn(
                  "w-px bg-ink transition-[height,opacity] duration-500 motion-reduce:transition-none",
                  i < filled ? "h-full opacity-100" : "h-1/2 opacity-30",
                )}
                style={{ transitionDelay: `${i * 8}ms` }}
              />
            ))}
          </div>
        </div>

        <div role="group" aria-label="Reviews" className="grid grid-cols-3 border-t border-ink">
          {items.map((item, i) => {
            const on = i === active;
            return (
              <button
                key={item.platform}
                type="button"
                aria-pressed={on}
                onClick={() => {
                  setActive(i);
                  setAuto(false);
                }}
                className={cn(
                  "relative flex min-w-0 flex-col items-start gap-2 border-l border-ink px-3 pb-3 pt-3.5 text-left transition-colors duration-300 first:border-l-0 sm:px-5",
                  on ? "bg-paper" : "bg-tint hover:bg-paper/60",
                )}
              >
                {on && cycling && (
                  <span
                    aria-hidden
                    key={active}
                    className="absolute inset-x-0 top-0 h-[3px] origin-left bg-accent"
                    style={{ animation: `wi-progress ${CYCLE_MS}ms linear both` }}
                  />
                )}
                <span className="flex h-5 items-center">
                  <Logo item={item} className="h-[18px] max-w-full sm:h-5" />
                </span>
                <Stars className="h-3 text-ink" />
                <span className="text-[13px] font-medium leading-none sm:text-sm">{item.label}</span>
              </button>
            );
          })}
        </div>
      </OutlineCard>
    </div>
  );
}
