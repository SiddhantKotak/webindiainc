import Image from "next/image";
import { assets } from "@/content/assets";
import { arrowThreadPaths, smoothPath, tanglePoints, type Point } from "@/lib/scribble";

/** The approved illustration behind the closing panel, when one exists; otherwise nothing (the panel is navy). */
export function ClosingBackdrop() {
  const art = assets.illustration.finalCta;
  if (!art) return null;

  return (
    <div aria-hidden className="absolute inset-0 -z-10">
      <Image
        src={art.src}
        alt=""
        fill
        sizes="100vw"
        quality={75}
        className="object-cover"
        {...(art.blurDataURL ? { placeholder: "blur" as const, blurDataURL: art.blurDataURL } : {})}
      />
      {/* Scrim: keeps the white headline legible and lets the footer sit on near-black. */}
      <div className="absolute inset-0 bg-linear-to-b from-black/45 via-black/60 via-45% to-black to-75%" />
    </div>
  );
}

// ArrowThread (seed 9, the closing default) enters its box at x = -2 and this y. Read from the
// generator so the tangle's tail always lands exactly where the thread begins.
const entryY = (height: number) => Number(/^M-?[\d.]+ (-?[\d.]+)/.exec(arrowThreadPaths(9, 100, height).line)?.[1] ?? height * 0.44);

type Variant = {
  /** Visible at these widths. */
  className: string;
  /** SVG box, in px, positioned relative to the ArrowThread box. */
  left: number;
  top: number;
  width: number;
  height: number;
  tangle: { cx: number; cy: number; radius: number; loops: number };
  /** Where the tail meets the thread, in SVG coordinates. */
  end: Point;
};

/**
 * Three placements, all relative to the ArrowThread box and all clear of the copy below it.
 * Below `xl` the tangle sits above the box's left end, in the section's top padding; from `xl`
 * there is room beside the box, so it sits to its left on the thread's own line.
 */
function variants(): Variant[] {
  const phone = entryY(110); // the box is 110px tall on phones, 80px below the panel top
  const wide = entryY(170); // 170px from `sm`, 112px below the top
  return [
    {
      className: "sm:hidden",
      left: -16,
      top: -80,
      width: 200,
      height: 80 + phone,
      tangle: { cx: 74, cy: 46, radius: 44, loops: 5 },
      end: [14, 80 + phone],
    },
    {
      className: "hidden sm:block xl:hidden",
      left: -24,
      top: -112,
      width: 300,
      height: 112 + wide,
      tangle: { cx: 128, cy: 84, radius: 70, loops: 6 },
      end: [22, 112 + wide],
    },
    {
      className: "hidden xl:block",
      left: -320,
      top: wide - 170,
      width: 320,
      height: 260,
      tangle: { cx: 130, cy: 120, radius: 95, loops: 6 },
      end: [318, 170],
    },
  ];
}

/**
 * Narrative: the scattered effort the page opened with, faint, unspooling into the one line
 * (ArrowThread) that leads to "Get Started Today". Static, seeded SVG: no JS, identical on the
 * server and client. Render it inside the ArrowThread's positioned wrapper, before the thread.
 * Only shown while there is no approved illustration behind the panel.
 */
export function ClosingTangle() {
  if (assets.illustration.finalCta) return null;

  return variants().map((v) => {
    const { cx, cy, radius, loops } = v.tangle;
    const [ex, ey] = v.end;
    const d = smoothPath([
      ...tanglePoints(17, { loops, radius, cx, cy, squash: 0.85 }),
      // Drop out of the knot (below it when the thread starts lower down) onto its first point.
      ...(ey - cy > radius * 1.5 ? [[cx - radius * 0.55, cy + radius * 0.95] as Point] : []),
      [ex - 6, ey - 18],
      [ex, ey],
    ]);

    return (
      <svg
        key={v.className}
        aria-hidden
        width={v.width}
        height={v.height}
        viewBox={`0 0 ${v.width} ${v.height}`}
        fill="none"
        className={`pointer-events-none absolute overflow-visible ${v.className}`}
        style={{ left: v.left, top: v.top }}
      >
        <path d={d} stroke="#fff" strokeOpacity={0.16} strokeWidth={1.5} strokeLinecap="round" />
      </svg>
    );
  });
}
