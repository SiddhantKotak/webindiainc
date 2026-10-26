"use client";

import { motion, useInView } from "motion/react";
import { useId, useRef } from "react";
import { usePrefersReducedMotion } from "@/lib/use-prefers-reduced-motion";

// Single-stroke drawings on a 64×64 grid. Subpaths draw in order, so each icon
// reads as one pen movement.
const ICONS = {
  // Magnifier with a rising trend inside the lens.
  googleAds:
    "M27 11a16 16 0 1 1 0 32a16 16 0 1 1 0-32 M39 39 L54 54 M18 33 L24 27 L29 31 L36 22 M31 22 H36 V27",
  // Bars climbing to an arrow.
  seo: "M8 55 H56 M14 55 V42 H22 V55 M28 55 V33 H36 V55 M42 55 V22 H50 V55 M10 30 L24 20 L32 24 L50 9 M43 9 H50 V16",
  // A browser window with a layout sketched inside.
  wordpress:
    "M11 12 H53 Q58 12 58 17 V47 Q58 52 53 52 H11 Q6 52 6 47 V17 Q6 12 11 12 Z M6 22 H58 M11 17 H14 M17 17 H20 M14 30 H36 M14 37 H31 M14 44 H26 M42 30 H51 V44 H42 Z",
  // A speech bubble holding a heart, with a small audience gathered under it.
  facebookAds:
    "M13 7 H43 Q49 7 49 13 V29 Q49 35 43 35 H25 L15 43 V35 H13 Q7 35 7 29 V13 Q7 7 13 7 Z M28 30 C21 25 18.5 21.5 20.5 17.5 C22.5 14 26.5 14.5 28 18 C29.5 14.5 33.5 14 35.5 17.5 C37.5 21.5 35 25 28 30 Z M43 44.5 a3 3 0 1 1 0 0.1 M36 57 Q37 49.5 43 49.5 Q49 49.5 50 57 M54 47 a2.5 2.5 0 1 1 0 0.1 M50.5 51.5 Q52 51 54 51 Q58.5 51 59 57",
  // A search bar, the results under it, and a pointer clicking the top result.
  bingAds:
    "M12 7 H52 Q58 7 58 13 Q58 19 52 19 H12 Q6 19 6 13 Q6 7 12 7 Z M13 13 H32 M48 12.5 a3 3 0 1 1 0 0.1 M50.5 15.5 L53 18 M8 28 H28 M8 35 H30 M8 44 H26 M8 51 H20 M38 33 L38 54 L43 49.5 L47 58 L50.5 56.5 L46.5 48 L53 47.5 Z M33 28 L30.5 25.5 M38.5 26 V22.5 M43.5 28 L46 25.5",
  // A parcel with a growth arrow climbing out of it.
  amazonAds:
    "M8 34 L32 26 L56 34 L32 42 Z M8 34 V50 L32 58 L56 50 V34 M32 42 V58 M20 30 L44 38 V44 M24 36 C26 26 30 18 40 10 M33 10 H40 V17",
} as const;

export type LineIconName = keyof typeof ICONS;

type LineIconProps = {
  name: LineIconName;
  size?: number;
  delay?: number;
  /** A faint hand-drawn jitter so clean icons sit beside the pencil tangles. */
  wobble?: boolean;
  className?: string;
};

export function LineIcon({ name, size = 64, delay = 0, wobble = false, className }: LineIconProps) {
  const ref = useRef<SVGSVGElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const reduceMotion = usePrefersReducedMotion();
  const filterId = `line-icon-wobble-${useId().replace(/:/g, "")}`;

  return (
    <motion.svg
      ref={ref}
      className={className}
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      aria-hidden
      whileHover={reduceMotion ? undefined : { y: -3, rotate: -3 }}
      transition={{ type: "spring", stiffness: 300, damping: 15 }}
    >
      {wobble && (
        <defs>
          {/* Static seed: the jitter is a fixed "hand", not a boil. sRGB keeps the displacement centred. */}
          <filter
            id={filterId}
            x="-4"
            y="-4"
            width="72"
            height="72"
            filterUnits="userSpaceOnUse"
            colorInterpolationFilters="sRGB"
          >
            <feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves={1} seed={4} result="noise" />
            <feDisplacementMap in="SourceGraphic" in2="noise" scale={1.5} xChannelSelector="R" yChannelSelector="G" />
          </filter>
        </defs>
      )}
      <motion.path
        d={ICONS[name]}
        stroke="currentColor"
        strokeWidth={1.75}
        strokeLinecap="round"
        strokeLinejoin="round"
        filter={wobble ? `url(#${filterId})` : undefined}
        initial={reduceMotion ? false : { pathLength: 0, opacity: 0 }}
        animate={inView || reduceMotion ? { pathLength: 1, opacity: 1 } : { pathLength: 0, opacity: 0 }}
        transition={reduceMotion ? { duration: 0 } : {
          pathLength: { duration: 1.6, delay, ease: [0.65, 0, 0.35, 1] },
          opacity: { duration: 0.1, delay },
        }}
      />
    </motion.svg>
  );
}
