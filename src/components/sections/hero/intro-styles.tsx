// Load-sequence entrance (reference "Load sequence", step 2): pieces fly in diagonally toward the
// centre while fading in. Pure CSS, so it starts with the first paint (before hydration) and is
// skipped entirely for reduced motion. React 19 hoists and dedupes this <style> by `href`.
//
// Per element: `--intro-x` / `--intro-y` (start offset) and `--intro-stagger` (seconds).
// Global: `--intro-delay` on any ancestor (e.g. <html>) holds the whole sequence back, so a
// loading cover can lift first.
const css = `
@keyframes wi-intro { from { opacity: 0; translate: var(--intro-x, 0) var(--intro-y, 0); } }
@keyframes wi-progress { from { scale: 0 1; } }
@media (prefers-reduced-motion: no-preference) {
  .wi-intro {
    animation: wi-intro 0.8s cubic-bezier(0.22, 1, 0.36, 1) both;
    animation-delay: calc(var(--intro-delay, 0s) + var(--intro-stagger, 0s));
  }
}
`;

export function IntroStyles() {
  return (
    <style href="wi-intro" precedence="default">
      {css}
    </style>
  );
}
