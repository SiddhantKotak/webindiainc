"use client";

import { motion, useInView } from "motion/react";
import { usePrefersReducedMotion } from "@/lib/use-prefers-reduced-motion";
import { useRef } from "react";
import { HandCheck } from "@/components/lines/hand-check";
import type { TitledText } from "@/content/proof";

const EASE = [0.22, 1, 0.36, 1] as const;

/** Pattern J: bordered, numbered rows. Each wipes in, then its number pops and gets ticked. */
export function ValueRows({ values }: { values: TitledText[] }) {
  return (
    <ol className="overflow-hidden rounded-card border border-ink bg-paper">
      {values.map((value, i) => (
        <ValueRow key={value.title} value={value} index={i} />
      ))}
    </ol>
  );
}

function ValueRow({ value, index }: { value: TitledText; index: number }) {
  // Observe the row's frame, not the sliding content: content parked at −101% is clipped
  // by the frame and would never count as "in view". A small threshold: on phones a row can be
  // taller than half the viewport, and it must not sit blank until half of it has scrolled in.
  const ref = useRef<HTMLLIElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.15 });
  // Reduced motion: rows appear at once with no transition. The initial state stays the same
  // either way, which keeps the server and client render identical.
  const reduceMotion = usePrefersReducedMotion();
  const show = inView || reduceMotion;
  const delay = (index % 2) * 0.08;
  const instant = { duration: 0 };

  return (
    <li ref={ref} className="overflow-hidden border-t border-ink first:border-t-0">
      <motion.div
        className="grid sm:grid-cols-[6.5rem_1fr]"
        initial={{ x: "-101%" }}
        animate={show ? { x: 0 } : { x: "-101%" }}
        transition={reduceMotion ? instant : { duration: 0.85, delay, ease: EASE }}
      >
        {/* Phones: number and tick sit in a row above the title, so the text gets the full width.
            From sm: a tinted side column, the number level with the title's first line (the
            column's top padding centres the 40px chip on the h3's 25px line box). */}
        <div className="flex items-center gap-2 px-5 pt-5 sm:items-start sm:justify-center sm:border-r sm:border-ink sm:bg-tint sm:px-2 sm:pb-6 sm:pt-[1.0625rem]">
          <motion.span
            className="grid size-10 shrink-0 place-items-center rounded-[6px] bg-sky text-sm font-bold"
            initial={{ scale: 0.6, opacity: 0 }}
            animate={show ? { scale: 1, opacity: 1 } : { scale: 0.6, opacity: 0 }}
            transition={reduceMotion ? instant : { type: "spring", stiffness: 420, damping: 18, delay: delay + 0.55 }}
          >
            {`${String(index + 1).padStart(2, "0")}.`}
          </motion.span>
          <HandCheck size={22} delay={delay + 0.75} className="shrink-0 sm:mt-[0.5625rem]" />
        </div>
        <motion.div
          className="px-5 pb-5 pt-3 sm:px-7 sm:py-6"
          initial={{ x: 20, opacity: 0 }}
          animate={show ? { x: 0, opacity: 1 } : { x: 20, opacity: 0 }}
          transition={reduceMotion ? instant : { duration: 0.6, delay: delay + 0.5, ease: EASE }}
        >
          <h3 className="text-lg font-semibold leading-tight sm:text-xl">{value.title}</h3>
          <p className="mt-2 text-[0.9375rem] leading-relaxed text-ink/80">{value.text}</p>
        </motion.div>
      </motion.div>
    </li>
  );
}
