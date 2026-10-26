"use client";

import { animate, useInView, type AnimationPlaybackControls } from "motion/react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import type { PortfolioItem } from "@/content/portfolio";
import { usePrefersReducedMotion } from "@/lib/use-prefers-reduced-motion";
import { BrowserFrame, PREVIEW_SIZES } from "./browser-frame";

// The frame's viewport is 2:1, so the visible share of a w×h screenshot is w / 2h.
const VIEWPORT_ASPECT = 2;
// Seconds per screenshot-height-to-width ratio scrolled: a slow, readable glide.
const SECONDS_PER_RATIO = 10;
// A page that only just overflows the window (Serendipity: 4%, ~24px) has nothing to show by
// scrolling; it stays still instead of twitching.
const MIN_TRAVEL = 0.15;

/**
 * A WordPress build in a browser window. The full-length page screenshot glides top to bottom
 * while the frame is on screen, holds, and returns to the top. It pauses on hover and while the
 * address link has focus; with reduced motion, or a page barely taller than the window, it
 * stays at the top.
 */
export function SitePreview({ item }: { item: PortfolioItem }) {
  const image = item.preview ?? item.after ?? item.before ?? item.latest;
  const frameRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const controls = useRef<AnimationPlaybackControls | null>(null);
  const onScreen = useInView(frameRef, { amount: 0.35 });
  const reduceMotion = usePrefersReducedMotion();
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);

  const travel = image ? Math.max(0, 1 - image.width / (VIEWPORT_ASPECT * image.height)) : 0;

  // Build the loop once (paused); the effect below decides when it runs.
  useEffect(() => {
    const el = imageRef.current;
    if (!el || !image || reduceMotion || travel < MIN_TRAVEL) return;
    const glide = Math.max(3, travel * (image.height / image.width) * SECONDS_PER_RATIO);
    const total = glide / 0.74;
    const end = `${-travel * 100}%`;
    const loop = animate(
      el,
      { y: ["0%", "0%", end, end, "0%"] },
      {
        duration: total,
        times: [0, 0.08, 0.82, 0.9, 1],
        ease: ["linear", "easeInOut", "linear", "easeInOut"],
        repeat: Infinity,
      },
    );
    loop.pause();
    controls.current = loop;
    return () => {
      loop.stop();
      controls.current = null;
      el.style.transform = "";
    };
  }, [image, reduceMotion, travel]);

  const playing = onScreen && !hovered && !focused;
  useEffect(() => {
    const loop = controls.current;
    if (!loop) return;
    if (playing) loop.play();
    else loop.pause();
  }, [playing, reduceMotion]);

  if (!image) return null;

  const address = item.url ? (
    <a
      href={item.url}
      target="_blank"
      rel="noopener"
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      className="flex min-w-0 max-w-full items-center gap-1.5 rounded-full border border-ink bg-white px-3 py-0.5 text-xs transition-colors hover:bg-tint sm:text-sm"
    >
      <span className="truncate">{new URL(item.url).hostname}</span>
      <svg aria-hidden viewBox="0 0 12 12" className="size-3 shrink-0" fill="none" stroke="currentColor" strokeWidth={1.4} strokeLinecap="round">
        <path d="M4 2.5h5.5V8M9.5 2.5 2.5 9.5" />
      </svg>
      <span className="sr-only">(opens in a new tab)</span>
    </a>
  ) : null;

  return (
    <div onPointerEnter={() => setHovered(true)} onPointerLeave={() => setHovered(false)}>
      <BrowserFrame address={address}>
        <div ref={frameRef} className="absolute inset-0">
          <div ref={imageRef} className="will-change-transform">
            <Image
              src={image.src}
              alt={image.alt}
              width={image.width}
              height={image.height}
              sizes={PREVIEW_SIZES}
              placeholder={image.blurDataURL ? "blur" : "empty"}
              blurDataURL={image.blurDataURL}
              className="block h-auto w-full"
            />
          </div>
        </div>
      </BrowserFrame>
    </div>
  );
}
