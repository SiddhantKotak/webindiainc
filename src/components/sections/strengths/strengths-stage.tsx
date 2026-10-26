"use client";

import { motion, useInView, useMotionValue, useMotionValueEvent, useScroll, useTransform } from "motion/react";
import { usePrefersReducedMotion } from "@/lib/use-prefers-reduced-motion";
import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { Counter } from "@/components/ui/counter";
import { Container } from "@/components/ui/container";
import type { Strength } from "@/content/stats";
import { seededRandom, smoothPath, tanglePoints, type Point } from "@/lib/scribble";
import { cn } from "@/lib/cn";
import { useElementSize } from "@/lib/use-element-size";
import { useMediaQuery } from "@/lib/use-media-query";

const DESKTOP = "(min-width: 1024px)";
/** How far ahead of the tip (as a fraction of the line) a marker fades in. */
const APPROACH = 0.12;
const EASE = [0.22, 1, 0.36, 1] as const;
// One decimal, like src/lib/scribble.ts: the path ships twice (HTML + hydration payload).
const fmt = (n: number) => Number(n.toFixed(1));

/** True at ≥1024px. Always false on the server, so the first paint is the stacked layout's state. */
const useIsDesktop = () => useMediaQuery(DESKTOP);

type Geometry = { line: string; arrow: string; markers: Point[] };

/**
 * The chart in the stage's own pixel space (viewBox = measured size), so the knot is never
 * squashed. Markers sit above the centre of each stat column and climb on a compounding curve;
 * the line dips a little between them, the way a real growth line does.
 */
function buildGeometry(width: number, height: number, count: number): Geometry {
  const rand = seededRandom(43);
  const markers: Point[] = Array.from({ length: count }, (_, i) => {
    const t = count > 1 ? i / (count - 1) : 0;
    return [fmt(width * ((i + 0.5) / count)), fmt(height * (0.8 - 0.64 * Math.pow(t, 1.35)))];
  });

  const radius = Math.min(30, Math.max(16, height * 0.075));
  const knotX = Math.max(radius * 1.5, markers[0][0] - radius * 2.8);
  const knot = tanglePoints(5, { loops: 3, radius, cx: knotX, cy: height * 0.84, squash: 0.85 });
  const knotEnd = knot[knot.length - 1];

  const rise: Point[] = [[(knotEnd[0] + markers[0][0]) / 2, height * 0.92]];
  markers.forEach((marker, i) => {
    rise.push(marker);
    const next = markers[i + 1];
    if (next) {
      rise.push([
        (marker[0] + next[0]) / 2 + (rand() - 0.5) * width * 0.02,
        (marker[1] + next[1]) / 2 + height * (0.05 + rand() * 0.04),
      ]);
    }
  });
  const last = markers[markers.length - 1];
  const end: Point = [width * 0.985, height * 0.03];
  rise.push([(last[0] + end[0]) / 2, (last[1] + end[1]) / 2 + height * 0.035], end);

  const before = rise[rise.length - 2];
  const angle = Math.atan2(end[1] - before[1], end[0] - before[0]);
  const wing = (offset: number): Point => [
    end[0] - Math.cos(angle + offset) * 20,
    end[1] - Math.sin(angle + offset) * 20,
  ];
  const [l, r] = [wing(0.5), wing(-0.5)];
  const arrow = `M${fmt(l[0])} ${fmt(l[1])} L${fmt(end[0])} ${fmt(end[1])} L${fmt(r[0])} ${fmt(r[1])}`;

  return { line: smoothPath([...knot, ...rise]), arrow, markers };
}

type StrengthsStageProps = { items: Strength[]; header: ReactNode };

export function StrengthsStage({ items, header }: StrengthsStageProps) {
  const reduceMotion = usePrefersReducedMotion();
  const isDesktop = useIsDesktop();
  const scrubbed = isDesktop && !reduceMotion;

  const wrapperRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<HTMLDivElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const size = useElementSize(chartRef);
  const width = Math.round(size?.width || 1200);
  const height = Math.round(size?.height || 380);
  const geometry = useMemo(() => buildGeometry(width, height, items.length), [width, height, items.length]);

  const { scrollYProgress } = useScroll({ target: wrapperRef, offset: ["start start", "end end"] });
  const drawn = useTransform(scrollYProgress, [0.06, 0.8], [0, 1], { clamp: true });
  const arrowDrawn = useTransform(drawn, [0.96, 1], [0, 1], { clamp: true });
  const lineOpacity = useTransform(drawn, (v) => (v > 0.001 ? 1 : 0));
  const arrowOpacity = useTransform(arrowDrawn, (v) => (v > 0.001 ? 1 : 0));
  const tipOpacity = useTransform(drawn, [0, 0.02, 0.97, 1], [0, 1, 1, 0]);
  const tipX = useMotionValue(0);
  const tipY = useMotionValue(0);

  // Path-length fraction at which the tip reaches each marker; measured once the path exists.
  const fractions = useRef<number[]>([]);
  // The path's length only changes with the geometry; measured there, not on every scroll frame.
  const totalLength = useRef(0);
  // `passed` follows the scrub both ways (markers, stems, cells); `started` only grows, so a
  // counter that has played is never reset by scrolling back. `near` counts the markers the tip
  // is closing in on: a marker only appears as the line approaches it, so the stage never
  // opens on five empty circles with no line.
  const [passed, setPassed] = useState(0);
  const [started, setStarted] = useState(0);
  const [near, setNear] = useState(0);

  const sync = useCallback(
    (progress: number) => {
      const path = pathRef.current;
      if (!path) return;
      const point = path.getPointAtLength((totalLength.current || path.getTotalLength()) * progress);
      tipX.set(point.x);
      tipY.set(point.y);
      const count = fractions.current.filter((f) => progress >= f).length;
      setPassed(count);
      setNear(progress > 0.001 ? fractions.current.filter((f) => progress >= f - APPROACH).length : 0);
      setStarted((prev) => Math.max(prev, count));
    },
    [tipX, tipY],
  );

  useEffect(() => {
    const path = pathRef.current;
    if (!scrubbed || !path) return;
    const total = path.getTotalLength();
    totalLength.current = total;
    const samples = 600;
    const best = geometry.markers.map(() => ({ dist: Infinity, at: 0 }));
    for (let s = 0; s <= samples; s++) {
      const at = (total * s) / samples;
      const p = path.getPointAtLength(at);
      geometry.markers.forEach(([mx, my], i) => {
        const dist = (p.x - mx) ** 2 + (p.y - my) ** 2;
        if (dist < best[i].dist) best[i] = { dist, at };
      });
    }
    fractions.current = best.map(({ at }) => at / total);
    sync(drawn.get());
  }, [geometry, scrubbed, sync, drawn]);

  useMotionValueEvent(drawn, "change", (progress) => {
    if (scrubbed) sync(progress);
  });

  return (
    <div ref={wrapperRef} className="relative lg:motion-safe:h-[250vh]">
      <div className="flex flex-col py-24 sm:py-32 lg:motion-safe:sticky lg:motion-safe:top-0 lg:motion-safe:h-svh lg:motion-safe:pb-12 lg:motion-safe:pt-28">
        <Container className="flex min-h-0 flex-1 flex-col">
          {header}

          {/* Desktop chart: the growth line climbing over the five stat columns. */}
          <div
            ref={chartRef}
            aria-hidden
            className="relative mt-6 hidden h-[clamp(260px,42vh,440px)] lg:block lg:motion-safe:h-auto lg:motion-safe:min-h-[220px] lg:motion-safe:flex-1"
          >
            <svg
              viewBox={`0 0 ${width} ${height}`}
              preserveAspectRatio="none"
              className="absolute inset-0 h-full w-full overflow-visible"
              fill="none"
            >
              {geometry.markers.map(([x, y], i) => {
                const on = !scrubbed || passed > i;
                return (
                  <motion.line
                    key={`stem-${i}`}
                    x1={x}
                    y1={y + 9}
                    x2={x}
                    y2={height}
                    stroke="var(--ink)"
                    strokeWidth={1}
                    initial={false}
                    animate={{ pathLength: on ? 1 : 0, opacity: on ? 1 : 0 }}
                    transition={{ duration: scrubbed ? 0.45 : 0, ease: EASE }}
                  />
                );
              })}

              {scrubbed ? (
                <>
                  <motion.path
                    ref={pathRef}
                    d={geometry.line}
                    stroke="var(--ink)"
                    strokeWidth={2}
                    strokeLinecap="round"
                    style={{ pathLength: drawn, opacity: lineOpacity }}
                  />
                  <motion.path
                    d={geometry.arrow}
                    stroke="var(--ink)"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    style={{ pathLength: arrowDrawn, opacity: arrowOpacity }}
                  />
                </>
              ) : (
                <>
                  <path d={geometry.line} stroke="var(--ink)" strokeWidth={2} strokeLinecap="round" />
                  <path
                    d={geometry.arrow}
                    stroke="var(--ink)"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </>
              )}

              {geometry.markers.map(([x, y], i) => {
                const on = !scrubbed || passed > i;
                const visible = !scrubbed || near > i;
                return (
                  <circle
                    key={`marker-${i}`}
                    cx={x}
                    cy={y}
                    r={7}
                    stroke="var(--ink)"
                    strokeWidth={1.5}
                    style={{
                      fill: on ? "var(--accent)" : "var(--paper)",
                      opacity: visible ? 1 : 0,
                      transition: scrubbed ? "fill 0.3s, opacity 0.35s" : undefined,
                    }}
                  />
                );
              })}

              {scrubbed && (
                <motion.circle r={5} fill="var(--ink)" style={{ cx: tipX, cy: tipY, opacity: tipOpacity }} />
              )}
            </svg>
          </div>

          {/* Phones: one column, a line threading card to card. sm–lg: two columns (an odd last
              card spans both), each card carrying its own step of a rising line. lg: one bordered
              row of five cells under the scrubbed chart. */}
          <ol className="mt-10 flex flex-col sm:grid sm:grid-cols-2 sm:gap-4 lg:mt-0 lg:grid-cols-5 lg:gap-0 lg:rounded-card lg:border lg:border-ink lg:bg-paper">
            {items.map((item, i) => {
              const reached = !scrubbed || passed > i;
              const spans = items.length % 2 === 1 && i === items.length - 1;
              return (
                <li
                  key={item.label}
                  className={cn("relative lg:border-l lg:border-ink lg:first:border-l-0", spans && "sm:col-span-2 lg:col-span-1")}
                >
                  <Connector first={i === 0} reduceMotion={reduceMotion} />
                  {/* Unreached cells (pinned chart only) dim the figure, not the words: the label
                      and text stay AA-legible while the line is still on its way. */}
                  <motion.div
                    initial={false}
                    animate={{ opacity: reached ? 1 : 0.75 }}
                    transition={{ duration: 0.4 }}
                    className={cn(
                      "relative h-full rounded-card border border-ink bg-paper p-6 lg:rounded-none lg:border-0 lg:bg-transparent lg:p-5 xl:p-6",
                      spans && "sm:max-lg:flex sm:max-lg:items-center sm:max-lg:gap-10",
                    )}
                  >
                    {/* Where the line meets the card on phones. */}
                    <span
                      aria-hidden
                      className="absolute -top-[6px] left-[34px] size-[11px] rounded-full border border-ink bg-accent sm:hidden"
                    />
                    <StepLine index={i} count={items.length} reduceMotion={reduceMotion} />
                    <motion.div
                      initial={false}
                      animate={{ opacity: reached ? 1 : 2 / 3 }}
                      transition={{ duration: 0.4 }}
                      className={cn(spans && "sm:max-lg:shrink-0")}
                    >
                      <Counter
                        value={item.value}
                        suffix={item.suffix}
                        start={scrubbed ? started > i : undefined}
                        className="block text-[3rem] tracking-tight lg:text-[2.75rem] xl:text-[3.25rem]"
                      />
                    </motion.div>
                    <div className={cn(spans && "sm:max-lg:pr-36")}>
                      <p className={cn("mt-4 text-lg font-semibold leading-tight lg:text-base", spans && "sm:max-lg:mt-0")}>
                        {item.label}
                      </p>
                      <p className="mt-2 max-w-[34ch] text-base leading-snug text-ink/80 lg:text-sm">{item.text}</p>
                    </div>
                  </motion.div>
                </li>
              );
            })}
          </ol>
        </Container>
      </div>
    </div>
  );
}

/**
 * Phones: a short stretch of line drawn from one stat down to the next. The markup is
 * the same with reduced motion (so hydration matches); only the draw becomes instant.
 */
// The first stretch starts as a small knot: the same tangle that unspools on desktop.
const firstConnector = smoothPath([
  ...tanglePoints(5, { loops: 3, radius: 9, cx: 12, cy: 12, squash: 0.85 }),
  [14, 30],
  [9, 44],
  [12, 58],
]);
const nextConnector = "M12 0 C 3 12, 21 22, 12 34 S 8 50, 12 58";

function Connector({ first, reduceMotion }: { first: boolean; reduceMotion: boolean }) {
  return (
    <div aria-hidden className="flex h-[58px] pl-[28px] sm:hidden">
      <svg viewBox="0 0 24 58" className="h-[58px] w-6 overflow-visible" fill="none">
        <motion.path
          d={first ? firstConnector : nextConnector}
          stroke="var(--ink)"
          strokeWidth={1.5}
          strokeLinecap="round"
          initial={{ pathLength: 0, opacity: 0 }}
          whileInView={{ pathLength: 1, opacity: 1 }}
          viewport={{ once: true, amount: 1 }}
          transition={{ duration: reduceMotion ? 0 : 0.8, ease: EASE }}
        />
      </svg>
    </div>
  );
}

/**
 * sm–lg (two-column grid, no pinned chart): each card carries a small copy of the desktop chart,
 * drawn only as far as its own figure. Card 1's line barely leaves the knot; each later card's
 * climbs one marker higher, so read in order the cards step up the same compounding line.
 * Faint dots mark the stops still ahead. The line draws when the card enters view; reduced
 * motion shows it drawn.
 */
const STEP_W = 128;
const STEP_H = 56;

function stepGeometry(index: number, count: number) {
  const markers: Point[] = Array.from({ length: count }, (_, k) => [
    fmt(30 + (k * (STEP_W - 36)) / Math.max(1, count - 1)),
    fmt(STEP_H - 8 - (STEP_H - 16) * Math.pow((k + 1) / count, 1.35)),
  ]);
  // Only card 1 draws the knot; later cards pick the line up where it leaves it (keeps HTML light).
  const knot: Point[] =
    index === 0 ? tanglePoints(5, { loops: 2, radius: 7, cx: 9, cy: STEP_H - 12, squash: 0.85 }) : [[6, STEP_H - 8]];
  const rise: Point[] = [[fmt((knot[knot.length - 1][0] + markers[0][0]) / 2), STEP_H - 4]];
  for (let k = 0; k <= index; k++) {
    rise.push(markers[k]);
    if (k < index) rise.push([fmt((markers[k][0] + markers[k + 1][0]) / 2), fmt((markers[k][1] + markers[k + 1][1]) / 2 + 4)]);
  }
  return { d: smoothPath([...knot, ...rise]), markers };
}

function StepLine({ index, count, reduceMotion }: { index: number; count: number; reduceMotion: boolean }) {
  const ref = useRef<SVGSVGElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.8 });
  const { d, markers } = useMemo(() => stepGeometry(index, count), [index, count]);
  const show = inView || reduceMotion;
  const end = markers[index];
  const duration = 0.7 + index * 0.12;

  return (
    <svg
      ref={ref}
      aria-hidden
      viewBox={`0 0 ${STEP_W} ${STEP_H}`}
      className="absolute right-5 top-5 hidden h-14 w-32 overflow-visible sm:block lg:hidden"
      fill="none"
    >
      {markers.slice(index + 1).map(([x, y]) => (
        <circle key={x} cx={x} cy={y} r={2} fill="var(--ink)" fillOpacity={0.22} />
      ))}
      <motion.path
        d={d}
        stroke="var(--ink)"
        strokeWidth={1.5}
        strokeLinecap="round"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={show ? { pathLength: 1, opacity: 1 } : { pathLength: 0, opacity: 0 }}
        transition={
          reduceMotion
            ? { duration: 0 }
            : { pathLength: { duration, delay: 0.15, ease: EASE }, opacity: { duration: 0.05, delay: 0.15 } }
        }
      />
      <motion.circle
        cx={end[0]}
        cy={end[1]}
        r={4.5}
        stroke="var(--ink)"
        strokeWidth={1.25}
        fill="var(--accent)"
        initial={{ scale: 0, opacity: 0 }}
        animate={show ? { scale: 1, opacity: 1 } : { scale: 0, opacity: 0 }}
        transition={reduceMotion ? { duration: 0 } : { type: "spring", stiffness: 420, damping: 18, delay: 0.15 + duration }}
        style={{ transformBox: "fill-box", transformOrigin: "center" }}
      />
    </svg>
  );
}
