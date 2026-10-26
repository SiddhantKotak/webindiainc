"use client";

import { motion, useInView } from "motion/react";
import { useRef } from "react";
import type { FaqItem } from "@/content/faq";
import { underlinePath } from "@/lib/scribble";
import { usePrefersReducedMotion } from "@/lib/use-prefers-reduced-motion";

const EASE = [0.22, 1, 0.36, 1] as const;
const MARK = underlinePath(31, 36, 4);

/**
 * Native <details>/<summary> disclosures, the first open by default. They work with no
 * JavaScript at all, the browser exposes the expanded state and hides closed answers from
 * assistive tech, and find-in-page opens a match. Several can be open at once: closing one
 * item never moves another under the reader's cursor. Each question is an h3 inside its summary.
 *
 * Opening and closing animate in CSS (`::details-content` + `interpolate-size`) where supported
 * and snap elsewhere. The only JS here is the rows' entrance wipe.
 */
export function FaqAccordion({ items }: { items: FaqItem[] }) {
  const reduceMotion = usePrefersReducedMotion();
  // Observed on the list, not the rows: a row clipped to nothing never counts as intersecting.
  const listRef = useRef<HTMLDivElement>(null);
  const inView = useInView(listRef, { once: true, amount: 0.15 });

  return (
    <div ref={listRef} className="overflow-hidden rounded-card border border-ink bg-paper">
      {items.map((item, i) => {
        const number = `${String(i + 1).padStart(2, "0")}.`;

        return (
          <motion.div
            key={item.question}
            className="border-t border-ink first:border-t-0"
            initial={{ clipPath: "inset(0 100% 0 0)" }}
            animate={inView ? { clipPath: "inset(0 0% 0 0)", transitionEnd: { clipPath: "none" } } : undefined}
            transition={reduceMotion ? { duration: 0 } : { duration: 0.7, delay: i * 0.07, ease: EASE }}
          >
            <details
              open={i === 0}
              className="group/item [interpolate-size:allow-keywords] details-content:h-0 details-content:overflow-clip details-content:transition-[height,content-visibility] details-content:transition-discrete details-content:duration-[450ms] details-content:ease-[cubic-bezier(0.22,1,0.36,1)] open:details-content:h-auto motion-reduce:details-content:transition-none"
            >
              <summary className="grid cursor-pointer list-none grid-cols-[64px_minmax(0,1fr)] text-left focus-visible:-outline-offset-4! sm:grid-cols-[88px_minmax(0,1fr)] [&::-webkit-details-marker]:hidden">
                <span className="flex justify-center border-r border-ink bg-tint pt-5 sm:pt-6">
                  <span className="relative h-fit">
                    <span className="numeral grid h-10 w-11 place-items-center rounded-card border border-ink bg-paper text-sm transition-colors duration-300 group-open/item:bg-sky group-hover/item:bg-tint group-open/item:group-hover/item:bg-sky">
                      {number}
                    </span>
                    {/* Marks the answer being read: a short pencil stroke drawn under the open item's number. */}
                    <svg
                      aria-hidden
                      viewBox="-1 -1 38 6"
                      className="absolute left-1/2 top-full mt-1.5 h-2 w-9 -translate-x-1/2 overflow-visible"
                      fill="none"
                    >
                      <path
                        d={MARK}
                        pathLength={1}
                        stroke="var(--accent)"
                        strokeWidth={2}
                        strokeLinecap="round"
                        className="opacity-0 transition-[stroke-dashoffset,opacity] duration-500 ease-out [stroke-dasharray:1] [stroke-dashoffset:1] group-open/item:opacity-100 group-open/item:[stroke-dashoffset:0] motion-reduce:transition-none"
                      />
                    </svg>
                  </span>
                </span>
                {/* <summary> allows phrasing content plus one heading, so the h3 is the row's text cell. */}
                <h3 className="flex items-start gap-4 px-5 py-6 text-lg font-semibold leading-snug sm:px-7 sm:py-7">
                  <span className="flex-1">{item.question}</span>
                  <PlusMinus />
                </h3>
              </summary>
              <div className="grid grid-cols-[64px_minmax(0,1fr)] sm:grid-cols-[88px_minmax(0,1fr)]">
                <span aria-hidden className="border-r border-ink bg-tint" />
                <p className="max-w-[62ch] px-5 pb-7 text-base leading-relaxed text-ink/80 sm:px-7 sm:pb-8">
                  {item.answer}
                </p>
              </div>
            </details>
          </motion.div>
        );
      })}
    </div>
  );
}

function PlusMinus() {
  return (
    <svg aria-hidden viewBox="0 0 20 20" className="mt-1 size-5 shrink-0" fill="none" stroke="currentColor" strokeWidth={1.5}>
      <path d="M3 10h14" strokeLinecap="round" />
      <path
        d="M10 3v14"
        strokeLinecap="round"
        className="origin-center transition-transform duration-300 [transform-box:fill-box] group-open/item:scale-y-0 motion-reduce:transition-none"
      />
    </svg>
  );
}
