"use client";

import { useLenis } from "lenis/react";
import { motion, useMotionValue, useMotionValueEvent, useScroll, useTransform } from "motion/react";
import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import type { Service } from "@/content/services";
import { cn } from "@/lib/cn";
import { useMediaQuery } from "@/lib/use-media-query";
import { ServiceCard } from "./service-card";
import { ServiceThread } from "./service-thread";
import { toneAt } from "./tones";

// Pinning only happens on desktop with motion allowed; everything else is the snap row
// (or, on desktop with reduced motion, a plain grid). Layout itself is CSS, so the server
// render is already right; this only switches the scroll-driven behaviour on.
const PIN_QUERY = "(min-width: 1024px) and (prefers-reduced-motion: no-preference)";
const usePinned = () => useMediaQuery(PIN_QUERY);

// Share of the pinned scroll held before the first card moves and after the last arrives.
const START = 0.1;
const END = 0.9;
const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
// The shared page margin (globals.css), so the column lines up with the header and `Container` sections.
const PAGE_MARGIN = "lg:ml-(--page-margin)";

type ServicesTrackProps = { header: ReactNode; services: Service[] };

/**
 * Pattern D: the heading column stays put while the six service cards scrub sideways,
 * tied together by one hand-drawn thread.
 */
export function ServicesTrack({ header, services }: ServicesTrackProps) {
  const pinned = usePinned();
  const lenis = useLenis();
  const wrapperRef = useRef<HTMLDivElement>(null);
  const scrollerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const last = services.length - 1;
  const timeline = useMemo(() => services.map((_, i) => START + ((END - START) * i) / last), [services, last]);

  const { scrollYProgress } = useScroll({ target: wrapperRef, offset: ["start start", "end end"] });
  const shift = useTransform(scrollYProgress, (p) => clamp01((p - START) / (END - START)));
  const distance = useMotionValue(0);
  // Function transformers (not ranges) so the measured distance is always the live one.
  const x = useTransform([shift, distance], ([s, d]: number[]) => -s * d);

  // React only hears about the scrub when the active card changes, not on every frame.
  const [active, setActive] = useState(0);
  const [reached, setReached] = useState(0);
  const activeRef = useRef(0);
  useMotionValueEvent(shift, "change", (s) => {
    const index = Math.round(s * last);
    if (index === activeRef.current) return;
    activeRef.current = index;
    setActive(index);
    setReached((r) => (index > r ? index : r));
  });

  // The snap row's position, for the pager under it.
  const [snapped, setSnapped] = useState(0);
  useEffect(() => {
    const scroller = scrollerRef.current;
    const track = trackRef.current;
    if (pinned || !scroller || !track) return;
    let frame = 0;
    const read = () => {
      frame = 0;
      const cards = track.querySelectorAll<HTMLElement>("[data-card]");
      if (!cards.length) return;
      const pad = cards[0].offsetLeft;
      const atEnd = scroller.scrollLeft >= scroller.scrollWidth - scroller.clientWidth - 2;
      let index = cards.length - 1;
      if (!atEnd) {
        let best = Infinity;
        cards.forEach((card, i) => {
          const d = Math.abs(card.offsetLeft - pad - scroller.scrollLeft);
          if (d < best) {
            best = d;
            index = i;
          }
        });
      }
      setSnapped(index);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(read);
    };
    read();
    scroller.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      scroller.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(frame);
    };
  }, [pinned]);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const measure = () => {
      const cards = track.querySelectorAll<HTMLElement>("[data-card]");
      distance.set(pinned && cards.length > 1 ? cards[cards.length - 1].offsetLeft - cards[0].offsetLeft : 0);
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(track);
    return () => observer.disconnect();
  }, [pinned, distance]);

  /** Scrolls the page to the point where card `i` is active. */
  const scrollToCard = useCallback(
    (i: number, immediate: boolean) => {
      const wrapper = wrapperRef.current;
      if (!wrapper || !pinned) return;
      const top = wrapper.getBoundingClientRect().top + window.scrollY;
      const y = top + timeline[i] * (wrapper.offsetHeight - window.innerHeight);
      if (lenis) lenis.scrollTo(y, { immediate, duration: 1.2 });
      else window.scrollTo({ top: y, behavior: immediate ? "instant" : "smooth" });
    },
    [lenis, pinned, timeline],
  );

  // Stable, so the memoised cards don't re-render when the active card changes elsewhere.
  const onFocusCard = useCallback(
    (i: number) => {
      if (pinned && i !== activeRef.current) scrollToCard(i, true);
    },
    [pinned, scrollToCard],
  );
  const onPick = useCallback((i: number) => scrollToCard(i, false), [scrollToCard]);

  return (
    <div ref={wrapperRef} className="relative lg:h-[500vh] motion-reduce:lg:h-auto">
      {/* lg:pt-20 keeps the centred content clear of the fixed header (≈60px) on short laptops. */}
      <div className="py-24 sm:py-32 lg:sticky lg:top-0 lg:flex lg:h-screen lg:items-center lg:overflow-hidden lg:pb-6 lg:pt-20 motion-reduce:lg:static motion-reduce:lg:h-auto motion-reduce:lg:items-start motion-reduce:lg:overflow-visible motion-reduce:lg:py-32">
        {/* Heading column. Below 720px of height the step list tightens so it clears the header. */}
        <div
          className={cn(
            "mx-auto w-full max-w-(--content) px-(--gutter) lg:mx-0 lg:flex lg:w-[26rem] lg:shrink-0 lg:flex-col lg:px-0 motion-reduce:lg:sticky motion-reduce:lg:top-28",
            PAGE_MARGIN,
          )}
        >
          {header}
          <StepList
            services={services}
            active={active}
            onPick={onPick}
            className="mt-14 hidden lg:flex motion-reduce:lg:hidden lg:[@media(max-height:720px)]:mt-6 lg:[@media(max-height:720px)]:gap-0"
          />
        </div>

        {/* Card track: snap row below lg, scrubbed track when pinned, grid with reduced motion.
            While pinned, the clip box starts 2rem early and fades over those 2rem, so cards
            leaving to the left dissolve instead of being cut mid-card. The vertical padding keeps
            focus rings inside the mask. */}
        <div className="mt-12 lg:ml-8 lg:mt-0 lg:min-w-0 lg:flex-1 lg:overflow-x-clip lg:py-4 lg:pl-8 lg:[mask-image:linear-gradient(to_right,transparent,#000_0.75rem)] motion-reduce:lg:mr-(--page-margin) motion-reduce:lg:ml-16 motion-reduce:lg:overflow-visible motion-reduce:lg:py-0 motion-reduce:lg:pl-0 motion-reduce:lg:[mask-image:none]">
          <div
            ref={scrollerRef}
            className="snap-x snap-mandatory scroll-px-(--gutter) overflow-x-auto overscroll-x-contain pb-2 [scrollbar-width:none] lg:snap-none lg:overflow-visible lg:pb-0 [&::-webkit-scrollbar]:hidden"
          >
            <motion.div
              ref={trackRef}
              style={{ x }}
              className="relative flex w-max gap-6 px-(--gutter) lg:gap-12 lg:px-0 motion-reduce:lg:grid motion-reduce:lg:w-auto motion-reduce:lg:grid-cols-2 motion-reduce:lg:gap-6"
            >
              <ServiceThread
                trackRef={trackRef}
                progress={pinned ? scrollYProgress : null}
                timeline={timeline}
                className="motion-reduce:lg:hidden"
              />
              {services.map((service, i) => (
                <ServiceCard
                  key={service.key}
                  service={service}
                  index={i}
                  expanded={!pinned || i === active}
                  drawIcon={!pinned || i <= reached}
                  onFocusCard={onFocusCard}
                />
              ))}
            </motion.div>
          </div>
          <SnapPager services={services} active={snapped} className="mt-5 px-(--gutter) lg:hidden" />
        </div>
      </div>
    </div>
  );
}

type StepListProps = {
  services: Service[];
  active: number;
  onPick: (i: number) => void;
  className?: string;
};

/**
 * The pinned step list. It mirrors the card titles, so it is hidden from assistive tech and
 * kept out of the tab order; the cards themselves carry the headings and links.
 * Its nudges are CSS transitions on transform, so a card change costs one style update.
 */
function StepList({ services, active, onPick, className }: StepListProps) {
  return (
    <ol aria-hidden className={cn("flex-col items-start gap-1", className)}>
      {services.map((service, i) => {
        const tone = toneAt(i);
        const isActive = i === active;
        return (
          <li
            key={service.key}
            className={cn(
              "transition-transform duration-[450ms] ease-[cubic-bezier(0.22,1,0.36,1)]",
              isActive ? "translate-x-0" : "translate-x-3",
              i < active ? "-translate-y-1.5" : i > active ? "translate-y-1.5" : "translate-y-0",
            )}
          >
            <button
              type="button"
              tabIndex={-1}
              onClick={() => onPick(i)}
              className={cn(
                "rounded-card border px-2.5 pb-1 pt-1.5 text-xs font-semibold uppercase tracking-[0.06em] transition-colors duration-300",
                "[@media(max-height:720px)]:pb-0.5 [@media(max-height:720px)]:pt-1",
                isActive ? cn("border-ink", tone.bg, tone.text) : "border-transparent text-ink/70 hover:text-ink",
              )}
            >
              {service.title}
            </button>
          </li>
        );
      })}
    </ol>
  );
}

/**
 * Six ticks under the snap row: the one for the snapped card fills with its tone, so touch
 * devices get the same "where am I" cue as the desktop step list. Fixed sizes, colour only.
 */
function SnapPager({ services, active, className }: { services: Service[]; active: number; className?: string }) {
  return (
    <div aria-hidden className={cn("flex gap-1.5", className)}>
      {services.map((service, i) => (
        <span
          key={service.key}
          className={cn(
            "h-2 w-7 rounded-full border border-ink transition-colors duration-300",
            i === active ? toneAt(i).bg : i < active ? "bg-ink/15" : "bg-transparent",
          )}
        />
      ))}
    </div>
  );
}
