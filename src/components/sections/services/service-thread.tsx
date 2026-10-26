"use client";

import { motion, useMotionValue, useMotionValueEvent, useTransform, type MotionValue } from "motion/react";
import { memo, useEffect, useRef, useState, type RefObject } from "react";
import { seededRandom, smoothPath, type Point } from "@/lib/scribble";

type Geometry = { width: number; height: number; d: string; stops: number[] };

/**
 * The hand-drawn x of each card and the y of its icon badge's centre, read from the DOM.
 * Returns the thread's path plus the x where the pen should rest beside each card.
 */
function threadGeometry(
  cards: { left: number; width: number }[],
  baseline: number,
  height: number,
  tail: number,
): Geometry {
  const rand = seededRandom(29);
  const wobble = (amp: number) => (rand() - 0.5) * 2 * amp;
  const points: Point[] = [[-80, baseline + wobble(3)]];
  const stops: number[] = [];

  cards.forEach((card, i) => {
    const right = card.left + card.width;
    // Hidden behind the card, but it keeps the line's rhythm hand-made.
    points.push([card.left + card.width * 0.3, baseline + wobble(7)], [card.left + card.width * 0.7, baseline + wobble(7)]);
    const next = cards[i + 1];
    if (!next) {
      stops.push(right + 28);
      return;
    }
    const gap = next.left - right;
    const gx = right + gap / 2;
    const y = baseline + wobble(2);
    if (gap >= 32) {
      // A small pen curl in the gap: the stitch that ties one card to the next.
      const r = Math.min(10, gap * 0.22);
      points.push(
        [gx - r * 1.9, y],
        [gx - r * 0.3, y + r * 0.15],
        [gx + r * 0.9, y - r * 0.7],
        [gx + r * 0.6, y - r * 1.9],
        [gx - r * 0.6, y - r * 1.9],
        [gx - r * 0.9, y - r * 0.7],
        [gx + r * 0.3, y + r * 0.15],
        [gx + r * 1.9, y],
      );
      stops.push(gx + r * 1.9 - 1);
    } else {
      points.push([gx, y]);
      stops.push(gx);
    }
  });

  const last = cards[cards.length - 1];
  const end = last.left + last.width;
  if (tail > 0) {
    // After the last channel the line keeps going, and starts to rise.
    for (let k = 1; k <= 4; k++) points.push([end + 40 + (tail * k) / 4, baseline - k * k * 6 + wobble(3)]);
  } else {
    points.push([end + 16, baseline + wobble(2)]);
  }
  return { width: Math.max(...points.map((p) => p[0])) + 20, height, d: smoothPath(points), stops };
}

/** The share of the path's length where it first reaches `x` (x only grows outside the curls). */
function fractionAtX(path: SVGPathElement, x: number) {
  const total = path.getTotalLength();
  let lo = 0;
  let hi = total;
  for (let i = 0; i < 24; i++) {
    const mid = (lo + hi) / 2;
    if (path.getPointAtLength(mid).x < x) lo = mid;
    else hi = mid;
  }
  return total ? hi / total : 0;
}

function interpolate(v: number, inputs: number[], outputs: number[]) {
  if (v <= inputs[0]) return outputs[0];
  for (let i = 1; i < inputs.length; i++) {
    if (v <= inputs[i]) {
      const t = (v - inputs[i - 1]) / (inputs[i] - inputs[i - 1] || 1);
      return outputs[i - 1] + (outputs[i] - outputs[i - 1]) * t;
    }
  }
  return outputs[outputs.length - 1];
}

type ServiceThreadProps = {
  trackRef: RefObject<HTMLElement | null>;
  /** Pinned scroll progress, or null to show the thread fully drawn (snap row). */
  progress: MotionValue<number> | null;
  /** Scroll progress at which each card is the active one. */
  timeline: number[];
  className?: string;
};

/**
 * An ink hairline behind the card track, stitched through the gaps between cards.
 * While pinned it draws with the scroll, so the pen always rests just past the active card.
 */
export const ServiceThread = memo(function ServiceThread({ trackRef, progress, timeline, className }: ServiceThreadProps) {
  const pinned = progress !== null;
  const [geo, setGeo] = useState<Geometry | null>(null);
  const [fractions, setFractions] = useState<number[] | null>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const lengthRef = useRef(0);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const measure = () => {
      const cards = [...track.querySelectorAll<HTMLElement>("[data-card]")];
      const icon = track.querySelector<HTMLElement>("[data-card-icon]");
      if (cards.length < 2 || !icon) return;
      // Level with the icon badges, so the line reads as one thread from drawing to drawing.
      const trackTop = track.getBoundingClientRect().top;
      const iconRect = icon.getBoundingClientRect();
      const baseline = iconRect.top - trackTop + iconRect.height / 2;
      const tail = pinned ? (track.parentElement?.clientWidth ?? 600) : 0;
      const next = threadGeometry(
        cards.map((c) => ({ left: c.offsetLeft, width: c.offsetWidth })),
        baseline,
        track.offsetHeight,
        tail,
      );
      setGeo((prev) => (prev && prev.d === next.d && prev.height === next.height ? prev : next));
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(track);
    return () => observer.disconnect();
  }, [trackRef, pinned]);

  useEffect(() => {
    const path = pathRef.current;
    if (!geo || !path) return;
    lengthRef.current = path.getTotalLength();
    setFractions(geo.stops.map((x) => fractionAtX(path, x)));
  }, [geo]);

  const fallback = useMotionValue(0);
  const source = progress ?? fallback;
  const drawn = useTransform([source], ([p]: number[]) => {
    if (!pinned) return 1;
    if (!fractions) return 0;
    return interpolate(p, [timeline[0] * 0.25, ...timeline, 1], [0, ...fractions, 1]);
  });
  const lineOpacity = useTransform(drawn, (v) => (v > 0.002 ? 1 : 0));
  const tipOpacity = useTransform(drawn, (v) => (v > 0.002 && v < 0.995 ? 1 : 0));
  const tipX = useMotionValue(-100);
  const tipY = useMotionValue(-100);

  useMotionValueEvent(drawn, "change", (v) => {
    const path = pathRef.current;
    if (!path || !pinned) return;
    // The length is cached per geometry; only the point lookup runs per frame, and it writes
    // motion values, never React state.
    const point = path.getPointAtLength(lengthRef.current * v);
    tipX.set(point.x);
    tipY.set(point.y);
  });

  if (!geo) return null;

  return (
    <svg
      aria-hidden
      fill="none"
      width={geo.width}
      height={geo.height}
      viewBox={`0 0 ${geo.width} ${geo.height}`}
      className={`pointer-events-none absolute left-0 top-0 overflow-visible ${className ?? ""}`}
    >
      <motion.path
        ref={pathRef}
        d={geo.d}
        stroke="var(--ink)"
        strokeWidth={1.25}
        strokeLinecap="round"
        strokeLinejoin="round"
        style={pinned ? { pathLength: drawn, opacity: lineOpacity } : undefined}
      />
      {pinned && <motion.circle r={5} fill="var(--accent)" style={{ cx: tipX, cy: tipY, opacity: tipOpacity }} />}
    </svg>
  );
});
