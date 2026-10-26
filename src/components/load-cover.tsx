import { smoothPath, tanglePoints, type Point } from "@/lib/scribble";

// Load sequence (docs/reference/rothfinder/README.md "Load sequence"): the page's story told in
// one stroke. A pencil tangle draws itself, one long line unspools from it and sweeps across the
// screen to an orange point, then the cover wipes up into the hero.
//
// Pure CSS: it plays from the first paint and needs no JavaScript. It shows once per browser
// session (the inline script in layout.tsx sets `html.wi-seen` on later loads) and never for
// reduced motion. It also sets `--intro-delay`, which holds the hero's own entrance
// (hero/intro-styles.tsx) until the cover has lifted.

const W = 1200;
const H = 360;
const knot = tanglePoints(5, { loops: 6, radius: 100, cx: 240, cy: 186, squash: 0.85 });
const line: Point[] = [
  [360, 222],
  [440, 176],
  [560, 206],
  [680, 168],
  [800, 196],
  [920, 158],
  [1040, 178],
  [1130, 150],
];
// Two strokes with their own timing: the knot alone is far longer than the line, so one shared
// draw would spend almost all of its time on the knot and flash the line in at the very end.
const knotPath = smoothPath(knot);
const linePath = smoothPath([knot[knot.length - 1], ...line]);
const [tipX, tipY] = line[line.length - 1];

// Timings (s): knot 0.05→0.43, line unspools 0.38→0.9, the dot lands at 0.85, the cover lifts 0.95→1.35.
// The lift is a transform (compositor-only), so hydration work on the main thread can't stall it.
const css = `
@keyframes wi-cover-draw { from { stroke-dashoffset: 1; } to { stroke-dashoffset: 0; } }
@keyframes wi-cover-dot { from { opacity: 0; scale: 0.2; } to { opacity: 1; scale: 1; } }
@keyframes wi-cover-lift {
  from { translate: 0 0; }
  to { translate: 0 -100%; visibility: hidden; }
}
.wi-cover { display: none; }
@media (prefers-reduced-motion: no-preference) {
  :root:not(.wi-seen) { --intro-delay: 1.05s; }
  :root:not(.wi-seen) .wi-cover {
    display: grid;
    animation: wi-cover-lift 0.4s cubic-bezier(0.76, 0, 0.24, 1) 0.95s forwards;
  }
  .wi-cover .knot { animation: wi-cover-draw 0.38s cubic-bezier(0.45, 0, 0.55, 1) 0.05s both; }
  .wi-cover .line { animation: wi-cover-draw 0.52s cubic-bezier(0.3, 0, 0.2, 1) 0.38s both; }
  .wi-cover circle {
    transform-box: fill-box;
    transform-origin: center;
    animation: wi-cover-dot 0.22s cubic-bezier(0.34, 1.56, 0.64, 1) 0.85s both;
  }
}
`;

export function LoadCover() {
  return (
    <>
      <style href="wi-load-cover" precedence="default">
        {css}
      </style>
      <div aria-hidden className="wi-cover pointer-events-none fixed inset-0 z-[100] place-items-center bg-tint will-change-transform">
        <svg viewBox={`0 0 ${W} ${H}`} className="w-[min(92vw,1100px)]" fill="none">
          {[
            { key: "knot", d: knotPath },
            { key: "line", d: linePath },
          ].map(({ key, d }) => (
            <path
              key={key}
              d={d}
              pathLength={1}
              stroke="var(--ink)"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeDasharray="1 1"
              // The drawing scales with the viewport (≈0.3× on phones), so the stroke thickens to
              // stay ~2px on screen. (non-scaling-stroke would break the normalised dash.)
              className={`${key} [stroke-width:6] sm:[stroke-width:3.5] lg:[stroke-width:2.6]`}
            />
          ))}
          <circle cx={tipX} cy={tipY} r={9} fill="var(--accent)" />
        </svg>
      </div>
    </>
  );
}
