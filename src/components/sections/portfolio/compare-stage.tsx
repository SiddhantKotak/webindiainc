"use client";

import { animate, motion, useInView, useMotionValue, useTransform } from "motion/react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import type { Asset } from "@/content/assets";
import type { PortfolioItem } from "@/content/portfolio";
import { cn } from "@/lib/cn";
import { arrowheadPath, handEllipsePath, smoothPath, underlinePath } from "@/lib/scribble";
import { useElementSize } from "@/lib/use-element-size";
import { useMediaQuery } from "@/lib/use-media-query";
import { usePrefersReducedMotion } from "@/lib/use-prefers-reduced-motion";
import { BrowserFrame, COMPARE_SIZES } from "./browser-frame";
import { highlights, type HighlightBox } from "./highlights";

const EASE = [0.65, 0, 0.35, 1] as const;
const WIPE = 0.9;
const WIPE_DELAY = 0.35;
const RING_DRAW = 0.8;
const ZOOM_EASE = "cubic-bezier(0.65, 0, 0.35, 1)";

// The screenshot sits on the viewport like a printout on a desk: a clear margin of this share
// of the width on each side, so a cell flush with the screenshot's edge still has room to be
// circled. The viewport is 2:1 (BrowserFrame).
const INSET = 0.025;
// The ring never comes closer than this to the viewport's edge, in screen px.
const RING_MARGIN = 4;
const RING_STROKE = 3;
// Phones zoom onto the circled figure; never past 3×, nor much past the source's own pixels.
const ZOOM_MAX = 3;
const ZOOM_MIN_USEFUL = 1.3;

type Side = "before" | "after";

/** Where a screenshot sits in the viewport, as fractions of its width (x) and height (y). */
type Placement = { left: number; top: number; width: number; height: number };

/**
 * Both screenshots share one box as tall as the taller of the two, centred in the viewport and
 * bottom-aligned inside it. Before/after captures of one dashboard usually differ only by a
 * toolbar above the tiles, so bottom-aligning keeps the tiles and the chart in place when the
 * view switches (the grocery pair differs by 20%).
 */
function placements(before: Asset | null, after: Asset | null) {
  const width = 1 - 2 * INSET;
  // Heights as a fraction of the viewport height (= width / 2).
  const heightOf = (a: Asset | null) => (a ? (2 * width * a.height) / a.width : 0);
  const box = Math.max(heightOf(before), heightOf(after));
  const boxTop = Math.max(0, (1 - box) / 2);
  const place = (a: Asset | null): Placement | null =>
    a ? { left: INSET, top: boxTop + box - heightOf(a), width, height: heightOf(a) } : null;
  return { before: place(before), after: place(after) };
}

/** Bounding box of a path's points and control points: Béziers never leave that hull. */
function pathBounds(d: string) {
  const n = d.match(/-?\d*\.?\d+/g)?.map(Number) ?? [];
  let [x0, y0, x1, y1] = [Infinity, Infinity, -Infinity, -Infinity];
  for (let i = 0; i + 1 < n.length; i += 2) {
    x0 = Math.min(x0, n[i]);
    x1 = Math.max(x1, n[i]);
    y0 = Math.min(y0, n[i + 1]);
    y1 = Math.max(y1, n[i + 1]);
  }
  return { x0, y0, x1, y1 };
}

type RingGeometry = { d: string; left: number; top: number; width: number; height: number; zoom: number; cx: number; cy: number };

/**
 * The pen ring round a cell, in viewport px. Sized generously round small cells so it reads as
 * a gesture, then trimmed on any side that would cross the viewport's edge (the far side stays
 * put, so the ring never slides onto a neighbouring cell). `slack` scales that generosity: a
 * ring that will be seen zoomed is drawn snugger, so it is not loose once magnified.
 */
function ringGeometry(
  box: HighlightBox,
  shot: Placement,
  size: { width: number; height: number },
  seed: number,
  maxZoom: number,
  slack = 1,
): RingGeometry {
  const { width: W, height: H } = size;
  const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));
  const cell = {
    x: (shot.left + (box.x / 100) * shot.width) * W,
    y: (shot.top + (box.y / 100) * shot.height) * H,
    w: (box.w / 100) * shot.width * W,
    h: (box.h / 100) * shot.height * H,
  };
  const cx = cell.x + cell.w / 2;
  const cy = cell.y + cell.h / 2;
  let w = cell.w + clamp(cell.w * 0.3, 28, 56) * slack;
  let h = cell.h + clamp(cell.h * 0.7, 22, 40) * slack;
  const edge = RING_MARGIN + RING_STROKE / 2;

  let d = handEllipsePath(seed, w, h);
  let b = pathBounds(d);
  // Desired outer bounds, centred on the cell, then clipped to the safe area.
  const L = Math.max(edge, cx - (b.x1 - b.x0) / 2);
  const T = Math.max(edge, cy - (b.y1 - b.y0) / 2);
  let R = Math.min(W - edge, cx + (b.x1 - b.x0) / 2);
  let B = Math.min(H - edge, cy + (b.y1 - b.y0) / 2);
  // The overshoot and tilt couple the axes a little, so refit twice.
  for (let i = 0; i < 2; i++) {
    w *= (R - L) / (b.x1 - b.x0);
    h *= (B - T) / (b.y1 - b.y0);
    d = handEllipsePath(seed, w, h);
    b = pathBounds(d);
    R = Math.min(R, L + (b.x1 - b.x0));
    B = Math.min(B, T + (b.y1 - b.y0));
  }
  const left = clamp(L - b.x0, edge - b.x0, W - edge - b.x1);
  const top = clamp(T - b.y0, edge - b.y0, H - edge - b.y1);
  const outerW = b.x1 - b.x0 + RING_STROKE;
  const outerH = b.y1 - b.y0 + RING_STROKE;
  const zoom = Math.min(maxZoom, (0.9 * W) / outerW, (0.9 * H) / outerH);
  return { d, left, top, width: w, height: h, zoom, cx: left + (b.x0 + b.x1) / 2, cy: top + (b.y0 + b.y1) / 2 };
}

/**
 * Before → after evidence. The two real screenshots share one frame; the hand-written captions
 * above it are the switch. When the frame scrolls into view the "after" wipes in over the
 * "before", then the key cell is circled in orange, the way a reviewer marks a printout. On
 * phones the camera then moves in on the circled figure (it would be a few pixels tall at full
 * width); "Zoom" in the window's bar toggles between that and the whole screenshot.
 */
export function CompareStage({ item, siblings = [] }: { item: PortfolioItem; siblings?: PortfolioItem[] }) {
  const { before, after } = item;
  const viewportRef = useRef<HTMLDivElement>(null);
  const size = useElementSize(viewportRef);
  const inView = useInView(viewportRef, { once: true, amount: 0.5 });
  const reduceMotion = usePrefersReducedMotion();
  const phone = useMediaQuery("(max-width: 639px)");
  const [choice, setChoice] = useState<Side | null>(null);
  const [zoomChoice, setZoomChoice] = useState<boolean | null>(null);
  const [settled, setSettled] = useState(false);

  // Derived, so reduced-motion visitors land on the result as soon as the hook settles.
  const shown: Side = choice ?? (after && (inView || reduceMotion) ? "after" : "before");
  const place = placements(before, after);
  const box = highlights[item.id];
  const seed = item.id.length * 7;
  let ring: RingGeometry | null = null;
  if (box && after && place.after && size && size.width > 0) {
    const maxZoom = Math.min(ZOOM_MAX, (1.4 * after.width) / (place.after.width * size.width));
    ring = ringGeometry(box, place.after, size, seed, maxZoom);
    // Phones see the ring zoomed: redraw it snug for that zoom (the zoom then fits it again).
    if (phone && ring.zoom >= ZOOM_MIN_USEFUL) ring = ringGeometry(box, place.after, size, seed, maxZoom, 1 / ring.zoom);
  }

  // The opening wipe and ring have played: the moment the camera may move in.
  useEffect(() => {
    if (!inView || settled || reduceMotion) return;
    const timer = window.setTimeout(() => setSettled(true), (WIPE_DELAY + WIPE * 0.75 + RING_DRAW + 0.2) * 1000);
    return () => window.clearTimeout(timer);
  }, [inView, settled, reduceMotion]);

  const canZoom = !!ring && ring.zoom >= ZOOM_MIN_USEFUL;
  const zoomed = canZoom && (zoomChoice ?? (phone && (settled || reduceMotion)));
  const zoom = zoomed && ring ? ring.zoom : 1;

  // The visible window, as fractions of the viewport, centred on the ring and kept on the image.
  let camera = "none";
  if (zoomed && ring && size) {
    const span = 1 / zoom;
    const x = Math.min(Math.max(ring.cx / size.width - span / 2, 0), 1 - span);
    const y = Math.min(Math.max(ring.cy / size.height - span / 2, 0), 1 - span);
    camera = `translate(${-x * zoom * 100}%, ${-y * zoom * 100}%) scale(${zoom})`;
  }

  // One value drives the wipe: the after layer's clip and the pen edge that leads it.
  const reveal = useMotionValue(0);
  const clipPath = useTransform(reveal, (v) => `inset(0 ${100 - v}% 0 0)`);
  const edgeX = useTransform(reveal, (v) => `${v}%`);
  const edgeOpacity = useTransform(reveal, (v) => (v > 0.5 && v < 99.5 ? 1 : 0));

  useEffect(() => {
    const target = shown === "after" ? 100 : 0;
    if (reduceMotion) {
      reveal.set(target);
      return;
    }
    const controls = animate(reveal, target, { duration: WIPE, ease: EASE, delay: choice ? 0 : WIPE_DELAY });
    return () => controls.stop();
  }, [shown, reduceMotion, choice, reveal]);

  if (!before && !after) return null;

  const layer = "absolute inset-0 origin-top-left transition-transform duration-[900ms] motion-reduce:transition-none";
  const layerStyle = { transform: camera, transitionTimingFunction: ZOOM_EASE };

  const zoomButton = canZoom ? (
    <button
      type="button"
      data-zoom
      aria-pressed={zoomed}
      onClick={() => setZoomChoice(!zoomed)}
      className="group grid h-11 cursor-pointer place-items-center px-1 sm:h-9"
    >
      <span
        className={cn(
          "flex items-center gap-1.5 rounded-full border border-ink py-1 pl-2 pr-2.5 text-xs font-semibold uppercase leading-none tracking-[0.08em] transition-colors",
          zoomed ? "bg-sky" : "bg-white group-hover:bg-tint",
        )}
      >
        <svg aria-hidden viewBox="0 0 14 14" className="size-3.5" fill="none" stroke="currentColor" strokeWidth={1.4} strokeLinecap="round">
          <circle cx="6" cy="6" r="4.25" />
          <path d="M9.2 9.2 12.5 12.5M4 6h4" />
          {!zoomed && <path d="M6 4v4" />}
        </svg>
        Zoom
      </span>
    </button>
  ) : null;

  return (
    <div className="flex flex-col gap-1 sm:gap-2">
      {before && after && (
        <div className="grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-start gap-2 sm:gap-4">
          <CaptionButton side="before" active={shown === "before"} onSelect={setChoice} ghosts={siblings.map((it) => captionFor(it, "before"))}>
            {captionFor(item, "before")}
          </CaptionButton>
          <CaptionArrow />
          <CaptionButton side="after" active={shown === "after"} onSelect={setChoice} ghosts={siblings.map((it) => captionFor(it, "after"))}>
            {captionFor(item, "after")}
          </CaptionButton>
        </div>
      )}

      <BrowserFrame tools={zoomButton}>
        <div
          ref={viewportRef}
          // Pointer convenience only: the caption buttons above are the keyboard control.
          onClick={() => before && after && setChoice(shown === "after" ? "before" : "after")}
          className={cn("absolute inset-0 bg-paper", before && after && "cursor-pointer")}
        >
          {before && place.before && (
            <div className={layer} style={layerStyle}>
              <Shot asset={before} place={place.before} hidden={shown !== "before"} zoom={zoom} />
            </div>
          )}
          {after && place.after && (
            <motion.div className="absolute inset-0 bg-paper" style={{ clipPath }}>
              <div className={layer} style={layerStyle}>
                <Shot asset={after} place={place.after} hidden={shown !== "after"} zoom={zoom} />
                {ring && (
                  <Ring
                    ring={ring}
                    on={shown === "after"}
                    strokeWidth={RING_STROKE / zoom}
                    reduceMotion={reduceMotion}
                    delay={WIPE * 0.75 + (choice ? 0 : WIPE_DELAY)}
                  />
                )}
              </div>
            </motion.div>
          )}
          {/* The pen edge leading the wipe; moved by transform so it never triggers layout. */}
          <motion.div aria-hidden className="pointer-events-none absolute inset-0" style={{ x: edgeX, opacity: edgeOpacity }}>
            <span className="absolute inset-y-0 left-0 w-0.5 -translate-x-1/2 bg-ink" />
          </motion.div>
        </div>
      </BrowserFrame>
    </div>
  );
}

/** One screenshot at its placement; positioned in percent, so it is right before hydration. */
function Shot({ asset, place, hidden, zoom }: { asset: Asset; place: Placement; hidden: boolean; zoom: number }) {
  return (
    <div
      aria-hidden={hidden || undefined}
      className="absolute outline-ink/15 outline-solid"
      style={{
        left: `${place.left * 100}%`,
        top: `${place.top * 100}%`,
        width: `${place.width * 100}%`,
        height: `${place.height * 100}%`,
        // A hairline edge for the printout, kept at one screen pixel when zoomed.
        outlineWidth: 1 / zoom,
      }}
    >
      <Image
        src={asset.src}
        alt={asset.alt}
        fill
        sizes={COMPARE_SIZES}
        placeholder={asset.blurDataURL ? "blur" : "empty"}
        blurDataURL={asset.blurDataURL}
        className="object-cover object-top"
      />
    </div>
  );
}

type RingProps = {
  ring: RingGeometry;
  on: boolean;
  strokeWidth: number;
  reduceMotion: boolean;
  delay: number;
};

/** A quick orange pen ring round the key cell, sized in pixels so the stroke stays even. */
function Ring({ ring, on, strokeWidth, reduceMotion, delay }: RingProps) {
  return (
    <svg
      aria-hidden
      data-ring
      fill="none"
      width={ring.width}
      height={ring.height}
      viewBox={`0 0 ${ring.width} ${ring.height}`}
      className="pointer-events-none absolute overflow-visible"
      style={{ left: ring.left, top: ring.top }}
    >
      <motion.path
        d={ring.d}
        stroke="var(--accent)"
        strokeLinecap="round"
        // Thinned as the camera zooms, so the pen line keeps its weight on screen.
        style={{ strokeWidth, transition: reduceMotion ? undefined : `stroke-width 900ms ${ZOOM_EASE}` }}
        initial={reduceMotion ? false : { pathLength: 0, opacity: 0 }}
        animate={on ? { pathLength: 1, opacity: 1 } : { pathLength: 0, opacity: 0 }}
        transition={
          reduceMotion || !on
            ? { duration: 0 }
            : {
                pathLength: { duration: RING_DRAW, ease: [0.6, 0, 0.3, 1], delay },
                opacity: { duration: 0.1, delay },
              }
        }
      />
    </svg>
  );
}

const captionFor = (item: PortfolioItem, side: Side) =>
  (side === "before" ? (item.beforeLabel ?? item.before?.alt) : (item.afterLabel ?? item.after?.alt)) ?? "";

type CaptionButtonProps = {
  side: Side;
  active: boolean;
  onSelect: (side: Side) => void;
  children: string;
  /** The other items' captions, laid out invisibly so the row is as tall as the longest. */
  ghosts: string[];
};

// The pen underline as a background, so it follows every line of a wrapped caption
// (`box-decoration-break: clone`) and draws by growing its width. Colour is the accent token.
const underline = (seed: number) =>
  `url("data:image/svg+xml,${encodeURIComponent(
    `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 10' preserveAspectRatio='none'><path d='${underlinePath(seed, 200, 10)}' fill='none' stroke='#ff6600' stroke-width='2.5' stroke-linecap='round' vector-effect='non-scaling-stroke'/></svg>`,
  )}")`;
const UNDERLINE = { before: underline(4), after: underline(9) };

/** The screenshot's own caption, in the hand face, doubling as its switch. */
function CaptionButton({ side, active, onSelect, children, ghosts }: CaptionButtonProps) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={() => onSelect(side)}
      className={cn(
        "grid cursor-pointer rounded-card px-1 py-2 font-hand text-lg leading-[1.3] transition-colors sm:text-[1.375rem]",
        side === "before" ? "justify-items-end justify-self-end text-right" : "justify-items-start justify-self-start text-left",
        active ? "text-ink" : "text-ink/60 hover:text-ink",
      )}
    >
      {ghosts.map((ghost, i) => (
        <span key={i} aria-hidden className="invisible col-start-1 row-start-1">
          {ghost}
        </span>
      ))}
      <span className="col-start-1 row-start-1 self-start">
      <span
        className="bg-no-repeat pb-1.5 transition-[background-size] duration-500 ease-out [box-decoration-break:clone] motion-reduce:transition-none"
        style={{
          backgroundImage: UNDERLINE[side],
          backgroundPosition: "left bottom",
          backgroundSize: active ? "100% 9px" : "0% 9px",
        }}
      >
        {children}
      </span>
      </span>
    </button>
  );
}

const ARROW_LINE = smoothPath([
  [4, 22],
  [22, 12],
  [40, 16],
  [58, 10],
]);
const ARROW_HEAD = arrowheadPath([58, 10], -0.3, 10, 0.55);

/** A small pen arrow from the "before" caption to the "after" one. */
function CaptionArrow() {
  return (
    <svg aria-hidden viewBox="0 0 64 28" fill="none" className="mt-2.5 h-6 w-11 text-ink sm:h-7 sm:w-16" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
      <path d={ARROW_LINE} />
      <path d={ARROW_HEAD} />
    </svg>
  );
}
