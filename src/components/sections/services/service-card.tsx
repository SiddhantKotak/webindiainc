"use client";

import Image from "next/image";
import { memo } from "react";
import { LineIcon } from "@/components/lines/line-icon";
import { servicePhotos, type Asset } from "@/content/assets";
import type { Service } from "@/content/services";
import { cn } from "@/lib/cn";
import { toneAt } from "./tones";

// The art panel's rendered width at each layout (see the card widths below): the snap row on
// phones and tablets, the pinned track on desktop, and the two-column grid that replaces the
// track on desktop with reduced motion (half of what's left beside the 26rem heading column).
export const CARD_PHOTO_SIZES = [
  "(min-width: 1024px) and (prefers-reduced-motion: reduce) min(32rem, calc(50vw - 19rem))",
  "(min-width: 1024px) clamp(18rem, 25vw, 22rem)",
  "(min-width: 640px) min(22rem, 42vw)",
  "min(22rem, 80vw)",
].join(", ");

const photos: Partial<Record<string, Asset>> = servicePhotos;

type ServiceCardProps = {
  service: Service;
  index: number;
  /** The active card (or every card when not pinned): blurb shown, photo settled at 1×. */
  expanded: boolean;
  /** Mounts the line icon, which then draws itself once. */
  drawIcon: boolean;
  onFocusCard: (index: number) => void;
};

/**
 * One service: a duotone photo in the card's tone as its art, with the card's one-line icon
 * drawn in a small tone badge, over the title, link and blurb. Every card is the same height
 * whether it's active or not, so the pinned track never re-runs layout while it scrubs.
 */
export const ServiceCard = memo(function ServiceCard({ service, index, expanded, drawIcon, onFocusCard }: ServiceCardProps) {
  const tone = toneAt(index);
  const number = `${String(index + 1).padStart(2, "0")}.`;
  const photo = photos[service.key];

  return (
    <article
      data-card
      onFocus={() => onFocusCard(index)}
      className="relative z-10 flex w-[80vw] max-w-[22rem] shrink-0 snap-start flex-col sm:w-[min(22rem,42vw)] lg:w-[clamp(18rem,25vw,22rem)] lg:max-w-none motion-reduce:lg:w-auto"
    >
      <div
        data-card-art
        className={cn("relative h-64 overflow-hidden rounded-card border border-ink sm:h-72 lg:h-[min(21rem,40vh)]", tone.bg)}
      >
        {photo && (
          // Transform only: the photo settles from a slight zoom as its card becomes active.
          <div
            className={cn(
              "absolute inset-0 transition-transform duration-[1400ms] ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none",
              expanded ? "scale-100" : "scale-[1.08]",
            )}
          >
            <Image src={photo.src} alt={photo.alt} fill sizes={CARD_PHOTO_SIZES} className="object-cover" />
          </div>
        )}
        <span
          className={cn(
            "absolute left-3 top-3 grid h-10 min-w-10 place-items-center rounded-[6px] border border-ink bg-paper px-1.5 text-base font-bold",
            tone.num,
          )}
        >
          {number}
        </span>
        {/* The card's drawing: the original flat tone panel, now a badge the thread runs level with. */}
        <div
          data-card-icon
          className={cn(
            "absolute bottom-3 right-3 grid size-20 place-items-center rounded-[6px] border border-ink sm:size-24",
            tone.bg,
            tone.line,
          )}
        >
          {drawIcon && <LineIcon name={service.key} size={64} delay={0.15} className="size-14 sm:size-16" />}
        </div>
      </div>
      <div className={cn("-mt-px flex flex-1 flex-col rounded-card border border-ink px-5 pb-5 pt-3.5", tone.bg, tone.text)}>
        <div className="flex min-h-11 items-center justify-between gap-3">
          <h3 className="text-lg font-semibold leading-tight">{service.title}</h3>
          {service.href && (
            <a
              href={service.href}
              aria-label={`${service.title} service page`}
              className="-mr-1.5 grid size-11 shrink-0 place-items-center rounded-[6px] border border-current text-lg transition-colors hover:bg-paper hover:text-ink focus-visible:outline-current"
            >
              <span aria-hidden>→</span>
            </a>
          )}
        </div>
        {/* Always laid out (the height is reserved); only opacity and transform change. */}
        <p
          className={cn(
            "pt-2 text-[0.9375rem] leading-snug transition-[opacity,translate] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none",
            expanded ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0",
          )}
        >
          {service.blurb}
        </p>
      </div>
    </article>
  );
});
