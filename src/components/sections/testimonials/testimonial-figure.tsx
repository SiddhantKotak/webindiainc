"use client";

import Image from "next/image";
import { motion, useInView, type Transition } from "motion/react";
import { useRef } from "react";
import type { Testimonial } from "@/content/testimonials";
import { seededRandom, smoothPath, type Point } from "@/lib/scribble";
import { usePrefersReducedMotion } from "@/lib/use-prefers-reduced-motion";

const EASE = [0.22, 1, 0.36, 1] as const;
const PEN = [0.6, 0, 0.3, 1] as const;
const INSTANT: Transition = { duration: 0 };

type Portrait = { src: string; width: number; height: number; alt: string; blurDataURL?: string } | null;

type TestimonialFigureProps = {
  testimonial: Testimonial;
  portrait: Portrait;
  /** Column position: sets the stagger delay and the pen's seed. */
  index: number;
  /** Length of the pen line from the headline pill down to the portrait, in px. */
  connectorHeight: number;
};

const CONNECTOR_WIDTH = 132;

/**
 * The pen leaves the pill a little in from its left edge, swings out to the right, hooks back
 * and drops onto the centre of the portrait below. Seeded, so every column gets its own hand
 * and the server and client draw the same `d`.
 */
function connectorPath(seed: number, h: number) {
  const rand = seededRandom(seed);
  const j = (n: number) => (rand() - 0.5) * n;
  const swing = 84 + j(24);
  const points: Point[] = [
    [26, 0],
    [24 + j(4), h * 0.2],
    [46 + j(6), h * 0.4],
    [swing, h * (0.44 + j(0.06))],
    [swing + 14 + j(6), h * 0.56],
    [swing - 14 + j(8), h * 0.66],
    [48 + j(6), h * 0.72],
    [32 + j(3), h * 0.86],
    [32, h - 1],
  ];
  return smoothPath(points, 0.9);
}

/**
 * Hand-drawn opening quote marks: each starts at the tip of its tail, sweeps down into a small
 * bowl and curls round it, the way a pen writes one. The bowl is about as wide as the stroke is
 * thick, so it reads as a filled comma rather than a "6". Two glyphs on a 32×22 grid.
 */
function quoteGlyphPaths(seed: number) {
  const rand = seededRandom(seed);
  const j = (n: number) => (rand() - 0.5) * n;
  return [2, 18].map((ox) => {
    const points: Point[] = [
      [ox + 11.5 + j(1), 1.5 + j(0.8)],
      [ox + 6 + j(0.6), 5.5 + j(0.6)],
      [ox + 2.6 + j(0.5), 11.5 + j(0.6)],
      [ox + 2.8 + j(0.4), 16.5 + j(0.4)],
      [ox + 6 + j(0.4), 19.2 + j(0.3)],
      [ox + 9.4 + j(0.4), 17.6 + j(0.4)],
      [ox + 9.6 + j(0.4), 14 + j(0.4)],
      [ox + 6.4 + j(0.4), 12.4 + j(0.3)],
      [ox + 3.6 + j(0.4), 14 + j(0.4)],
    ];
    // The pen presses the bowl solid once the curl closes; this is that ink.
    const bowl: Point = [ox + 6.3, 15.8];
    return { d: smoothPath(points, 0.85), bowl };
  });
}

/**
 * Long review headlines are split onto two lines at the word nearest the middle, so the pill
 * shrink-wraps both lines instead of stretching to the column width when the browser wraps it.
 */
function pillLines(text: string): string[] {
  if (text.length <= 30) return [text];
  const words = text.split(" ");
  let best = 1;
  let bestDiff = Infinity;
  for (let i = 1; i < words.length; i++) {
    const diff = Math.abs(words.slice(0, i).join(" ").length - words.slice(i).join(" ").length);
    if (diff < bestDiff) [best, bestDiff] = [i, diff];
  }
  return [words.slice(0, best).join(" "), words.slice(best).join(" ")];
}

function initials(name: string) {
  const words = name.split(" ").filter(Boolean);
  return words.length > 1 ? `${words[0][0]}${words[words.length - 1][0]}` : name.slice(0, 2);
}

/**
 * One client voice. On entering view the column rises in, its headline pill pops, the pen
 * line draws down to the portrait, the portrait lands and the quote marks write themselves.
 * Reduced motion: everything in its final state at once.
 */
export function TestimonialFigure({ testimonial, portrait, index, connectorHeight }: TestimonialFigureProps) {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.35 });
  // The initial (hidden) state is the same on server and client; reduced-motion users jump to
  // the final state as soon as the hook reports their preference.
  const reduceMotion = usePrefersReducedMotion();
  const show = inView || reduceMotion;
  const base = index * 0.15;
  const at = (delay: number, transition: Transition): Transition =>
    reduceMotion ? INSTANT : { ...transition, delay: base + delay };

  const seed = 101 + index * 37;
  const connector = connectorPath(seed, connectorHeight);
  const glyphs = quoteGlyphPaths(seed + 5);
  const { name, role, company, country, headline, quote } = testimonial;

  return (
    <motion.figure
      ref={ref}
      className="flex flex-col items-start"
      initial={{ opacity: 0, y: 40 }}
      animate={show ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
      transition={at(0, { duration: 0.8, ease: EASE })}
    >
      <motion.p
        className="inline-block max-w-full origin-bottom-left rounded-[1.375rem] border border-white/85 px-3 py-1.5 text-[0.6875rem] font-semibold uppercase leading-snug tracking-[0.04em] sm:px-3.5 sm:text-[0.75rem] sm:tracking-[0.06em]"
        initial={{ opacity: 0, scale: 0.85 }}
        animate={show ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.85 }}
        transition={at(0.2, { type: "spring", stiffness: 380, damping: 22 })}
      >
        {pillLines(headline).map((line, i) => (
          <span key={i} className="block">
            {line}
          </span>
        ))}
      </motion.p>

      <svg
        aria-hidden
        width={CONNECTOR_WIDTH}
        height={connectorHeight}
        viewBox={`0 0 ${CONNECTOR_WIDTH} ${connectorHeight}`}
        fill="none"
        overflow="visible"
        className="mt-1"
      >
        <motion.path
          d={connector}
          stroke="currentColor"
          strokeWidth={1.4}
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={show ? { pathLength: 1, opacity: 1 } : { pathLength: 0, opacity: 0 }}
          transition={
            reduceMotion
              ? INSTANT
              : {
                  pathLength: { duration: 0.75, delay: base + 0.55, ease: PEN },
                  opacity: { duration: 0.05, delay: base + 0.55 },
                }
          }
        />
      </svg>

      <div className="mt-1 flex items-end gap-3">
        <motion.div
          // The source portraits are circular, with a thin blue ring baked into the edge: a
          // slight overscale inside a round frame trims the ring and the transparent corners.
          className="relative size-14 shrink-0 overflow-hidden rounded-full ring-1 ring-white/25 sm:size-16"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={show ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
          transition={at(1.15, { type: "spring", stiffness: 340, damping: 20 })}
        >
          {portrait ? (
            // 73px source shown at 56–70 CSS px (circular artwork, so a round frame); served as-is,
            // since any optimizer width would be an upscale. The name is right below in the
            // caption, so the portrait is decorative here.
            <Image
              src={portrait.src}
              alt=""
              width={portrait.width}
              height={portrait.height}
              placeholder={portrait.blurDataURL ? "blur" : "empty"}
              blurDataURL={portrait.blurDataURL}
              // Never ask for more than the 73px source.
              unoptimized
              className="size-full scale-[1.1] object-cover"
            />
          ) : (
            <span aria-hidden className="grid size-full place-items-center bg-white/10 text-base font-semibold">
              {initials(name)}
            </span>
          )}
        </motion.div>

        <svg aria-hidden width={46} height={32} viewBox="0 0 32 22" fill="none" overflow="visible" className="mb-1">
          {glyphs.map(({ d, bowl }, i) => {
            const delay = base + 1.3 + i * 0.18;
            return (
              <g key={i}>
                <motion.path
                  d={d}
                  stroke="var(--accent)"
                  strokeWidth={2.8}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={show ? { pathLength: 1, opacity: 1 } : { pathLength: 0, opacity: 0 }}
                  transition={
                    reduceMotion
                      ? INSTANT
                      : {
                          pathLength: { duration: 0.45, delay, ease: PEN },
                          opacity: { duration: 0.05, delay },
                        }
                  }
                />
                <motion.circle
                  cx={bowl[0]}
                  cy={bowl[1]}
                  r={3.3}
                  fill="var(--accent)"
                  style={{ transformBox: "fill-box", transformOrigin: "center" }}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={show ? { scale: 1, opacity: 1 } : { scale: 0, opacity: 0 }}
                  transition={reduceMotion ? INSTANT : { duration: 0.2, delay: delay + 0.38, ease: EASE }}
                />
              </g>
            );
          })}
        </svg>
      </div>

      <blockquote className="mt-5">
        <p className="text-[1.0625rem] leading-relaxed text-white/90 sm:text-lg sm:leading-relaxed">{quote}</p>
      </blockquote>

      <figcaption className="mt-6 text-[0.75rem] uppercase leading-relaxed tracking-[0.1em] text-white/70">
        <span className="font-semibold text-white">{name}</span> · {role}, {company}, {country}
      </figcaption>
    </motion.figure>
  );
}
