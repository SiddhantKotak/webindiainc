"use client";

import Image from "next/image";
import { motion, useInView, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import { assets } from "@/content/assets";
import { usePrefersReducedMotion } from "@/lib/use-prefers-reduced-motion";

const EASE = [0.22, 1, 0.36, 1] as const;

/**
 * The founders photo in a rounded inset panel. It slides in from the right while scaling
 * 0.9 → 1 (the reference's statement banner), and the photo counter-moves a few percent as the
 * page scrolls past. Reduced motion: in place and static.
 *
 * Crops: 3:2 on phones (taller, so the four founders read at 320px), the photo's own 2:1 on
 * tablets, and 21:9 from lg, weighted to the bottom of the frame so the faces sit in view
 * together with the heading. The source is 1284px wide, so from lg the panel stops at 1336px
 * (the content width at 1440): at most a 1.04× upscale on a 1× screen.
 */
export function TeamPhoto() {
  // Observe the static frame, not the moving panel: the panel starts off to the right.
  const frameRef = useRef<HTMLDivElement>(null);
  const inView = useInView(frameRef, { once: true, amount: 0.25 });
  const reduceMotion = usePrefersReducedMotion();
  const show = inView || reduceMotion;

  const { scrollYProgress } = useScroll({ target: frameRef, offset: ["start end", "end start"] });
  // The image layer is 8% taller than the panel (4% each side); ±3.5% of its height stays inside that.
  const y = useTransform(scrollYProgress, [0, 1], ["-3.5%", "3.5%"]);

  const photo = assets.team;

  return (
    <div ref={frameRef} className="lg:ml-auto lg:max-w-[1336px]">
      <motion.div
        className="relative aspect-[3/2] overflow-hidden rounded-card bg-ink/10 sm:aspect-[1284/648] lg:aspect-[21/9]"
        initial={{ x: 160, scale: 0.9, opacity: 0 }}
        animate={show ? { x: 0, scale: 1, opacity: 1 } : { x: 160, scale: 0.9, opacity: 0 }}
        transition={reduceMotion ? { duration: 0 } : { duration: 1.1, ease: EASE }}
      >
        {photo ? (
          // Oversized vertically only, so the parallax never shows an edge without also
          // widening (and upscaling) the photo.
          <motion.div className="absolute inset-x-0 -inset-y-[4%]" style={{ y: reduceMotion ? 0 : y }}>
            <Image
              src={photo.src}
              alt={photo.alt}
              fill
              quality={90}
              placeholder={photo.blurDataURL ? "blur" : "empty"}
              blurDataURL={photo.blurDataURL}
              // The photo's rendered width, per crop (gutter: 16/24/32/52px):
              // phones: 3:2 panel over a 2:1 photo, height-bound → 1.43 × (100vw − 32px);
              // sm: 2:1 panel, height-bound by the 8% overscan → 1.08 × (100vw − 48px);
              // lg: 21:9 panel, width-bound → the panel itself, capped at 1336px.
              sizes="(min-width: 1440px) 1336px, (min-width: 1280px) calc(100vw - 104px), (min-width: 1024px) calc(100vw - 64px), (min-width: 640px) calc(108vw - 52px), calc(143vw - 46px)"
              // Phones crop the sides; this keeps all four founders in frame. From lg the 21:9
              // crop trims the top (balloon letters) and keeps the faces.
              className="object-cover object-[36%_50%] sm:object-center lg:object-[50%_82%]"
            />
          </motion.div>
        ) : (
          <div className="absolute inset-0 bg-tint" />
        )}
      </motion.div>
    </div>
  );
}
