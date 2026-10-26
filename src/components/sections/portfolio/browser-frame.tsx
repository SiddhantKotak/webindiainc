import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

// Rendered width of the stage, for next/image `sizes`. The layout (portfolio-tabs.tsx):
// Container gutter 16/24/32/52 → 1px card border → panel padding 16 (stage bleeds to the card
// edge on phones)/24/32/40 → from 1280px a 23rem text column and a 3rem gap beside the stage.
//   ≥1600: 1600 − 104 − 2 − 80 − 416 ≈ 1000 · 1280–1599: 100vw − 602 · 1024–1279: 100vw − 130
//   640–1023: 100vw − 98 · phones: 100vw − 34
const STAGE_WIDTHS = "(min-width: 1600px) 1000px, (min-width: 1280px) calc(100vw - 600px), (min-width: 1024px) calc(100vw - 130px), (min-width: 640px) calc(100vw - 98px)";

/** The WordPress builds: shown at the stage's width. */
export const PREVIEW_SIZES = `${STAGE_WIDTHS}, calc(100vw - 34px)`;

/**
 * The before/after dashboards. Phones zoom up to 3× onto the circled figure, so they ask for
 * the full source (every dashboard is ≤1400px wide; the optimizer never upscales).
 */
export const COMPARE_SIZES = `${STAGE_WIDTHS}, 700px`;

type BrowserFrameProps = {
  /** Centred in the bar, like an address field. */
  address?: ReactNode;
  /** Right-aligned controls in the bar. */
  tools?: ReactNode;
  children: ReactNode;
  className?: string;
};

/**
 * A flat, outlined browser window: three dots, an optional address and tools, over a fixed 2:1
 * viewport, so switching items never changes the panel's height. On phones it runs edge to
 * edge inside the card (no side borders or radius) to give the screenshot every pixel.
 */
export function BrowserFrame({ address, tools, children, className }: BrowserFrameProps) {
  return (
    // `-mx-4` cancels the panel's 16px phone padding (portfolio-tabs.tsx).
    <div className={cn("-mx-4 overflow-hidden border-y border-ink bg-white sm:mx-0 sm:rounded-card sm:border-x", className)}>
      <div className="flex h-11 items-center gap-3 border-b border-ink bg-paper pl-4 pr-1.5 sm:h-10 sm:pr-2">
        <span aria-hidden className="flex shrink-0 gap-1.5">
          <span className="size-2.5 rounded-full border border-ink bg-accent" />
          <span className="size-2.5 rounded-full border border-ink bg-yellow" />
          <span className="size-2.5 rounded-full border border-ink bg-yellow" />
        </span>
        <div className="flex min-w-0 flex-1 justify-center">{address}</div>
        {/* Balances the dots so the address stays centred; holds the tools when there are any. */}
        <div className="flex min-w-[2.625rem] shrink-0 justify-end">{tools}</div>
      </div>
      <div data-viewport className="relative aspect-[2/1] overflow-hidden">
        {children}
      </div>
    </div>
  );
}
