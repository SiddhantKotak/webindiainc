// Hero-only CSS: tangle placement per breakpoint, the hover re-scribble turn, and the platform
// marquee loop. React 19 hoists and dedupes this <style> by `href`.
//
// Tangle placement: each `.hero-tangle` carries `--l*`/`--r*` (left or right), `--t*` (top) and
// `--s*` (size) for the three-line headline below lg (0) and the two-line one from lg (1), in `em`
// of the headline, so the field scales with the type and stays in the pockets the lines leave. `--d*: none` hides
// a tangle at that size.
const css = `
.hero-tangle {
  position: absolute;
  left: var(--l0, auto); right: var(--r0, auto); top: var(--t0, 0);
  width: var(--s0, 0); height: var(--s0, 0);
  display: var(--d0, block);
  pointer-events: none;
}
@media (min-width: 1024px) {
  .hero-tangle {
    left: var(--l1, auto); right: var(--r1, auto); top: var(--t1, 0);
    width: var(--s1, 0); height: var(--s1, 0);
    display: var(--d1, block);
  }
}
@media (hover: hover) and (pointer: fine) {
  .hero-tangle { pointer-events: auto; }
}
.hero-tangle-body {
  transform-box: view-box;
  transform-origin: 0 0;
  transition: rotate 0.7s cubic-bezier(0.34, 1.56, 0.64, 1), scale 0.7s cubic-bezier(0.34, 1.56, 0.64, 1);
}
@media (prefers-reduced-motion: no-preference) {
  .hero-tangle:hover .hero-tangle-body { rotate: 24deg; scale: 1.08; }
}

@keyframes hero-marquee { to { translate: -50% 0; } }
@media (prefers-reduced-motion: no-preference) {
  .hero-marquee { animation: hero-marquee 60s linear infinite; }
  .hero-marquee-band:hover .hero-marquee,
  .hero-marquee-band[data-paused] .hero-marquee,
  [data-paused] .hero-marquee,
  [data-paused] .wi-drift { animation-play-state: paused; }
}
`;

export function HeroStyles() {
  return (
    <style href="wi-hero" precedence="default">
      {css}
    </style>
  );
}
