"use client";

import { useState } from "react";
import { tanglePath } from "@/lib/scribble";

// A tiny knot between names: each platform is one more thread in the tangle a client arrives with.
const knots = [3, 8, 14, 21, 26, 33].map((seed) => tanglePath(seed, 10, 3));

function Run({ items, hidden }: { items: readonly string[]; hidden?: boolean }) {
  return (
    <ul
      aria-label={hidden ? undefined : "Platforms"}
      aria-hidden={hidden || undefined}
      className={`flex shrink-0 items-center ${hidden ? "motion-reduce:hidden" : ""}`}
    >
      {items.map((platform, i) => (
        <li key={platform} className="flex items-center">
          <span className="whitespace-nowrap px-5 font-display text-[1.375rem] leading-none tracking-[-0.02em] sm:px-7 sm:text-[1.75rem] lg:px-9 lg:text-[2.125rem]">
            {platform}
          </span>
          <svg aria-hidden viewBox="-16 -16 32 32" overflow="visible" fill="none" className="size-4 shrink-0 sm:size-5">
            <path d={knots[i % knots.length]} stroke="var(--ink)" strokeWidth={1.1} strokeLinecap="round" />
          </svg>
        </li>
      ))}
    </ul>
  );
}

/**
 * The six platforms as a slow, endless band along the foot of the hero. CSS only (hero-styles.tsx
 * `.hero-marquee`); it pauses off-screen (stage `data-paused`), on hover and from its own button,
 * and under reduced motion it is a still, single list.
 */
export function PlatformMarquee({ items }: { items: readonly string[] }) {
  const [paused, setPaused] = useState(false);

  return (
    <div className="hero-marquee-band relative flex items-stretch border-y border-ink" data-paused={paused ? "" : undefined}>
      <div className="flex min-w-0 flex-1 overflow-hidden py-3.5 sm:py-4 lg:py-5">
        <div className="hero-marquee flex w-max motion-reduce:w-auto motion-reduce:flex-wrap motion-reduce:pl-(--page-margin)">
          {/* Four runs: the track slides by half (two runs), enough to outrun a very wide screen. */}
          {[0, 1, 2, 3].map((copy) => (
            <Run key={copy} items={items} hidden={copy > 0} />
          ))}
        </div>
      </div>
      <button
        type="button"
        onClick={() => setPaused((p) => !p)}
        aria-pressed={paused}
        aria-label="Pause platforms"
        className="flex w-12 shrink-0 items-center justify-center border-l border-ink bg-tint transition-colors hover:bg-paper motion-reduce:hidden sm:w-14"
      >
        {paused ? (
          <svg aria-hidden viewBox="0 0 12 12" className="size-3">
            <path d="M3 1.5v9l7-4.5z" fill="currentColor" />
          </svg>
        ) : (
          <svg aria-hidden viewBox="0 0 12 12" className="size-3">
            <path d="M3 1.5h2v9H3zM7 1.5h2v9H7z" fill="currentColor" />
          </svg>
        )}
      </button>
    </div>
  );
}
