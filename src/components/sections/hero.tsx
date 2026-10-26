import type { CSSProperties } from "react";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { assets } from "@/content/assets";
import { servicesHeading } from "@/content/services";
import { ctas, hero } from "@/content/site";
import { reviews } from "@/content/stats";
import { HeroStage } from "./hero/hero-stage";
import { HeroStyles } from "./hero/hero-styles";
import { HeroTangle } from "./hero/hero-tangle";
import { HeroUnderline } from "./hero/hero-underline";
import { IntroStyles } from "./hero/intro-styles";
import { Magnetic } from "./hero/magnetic";
import { PlatformMarquee } from "./hero/platform-marquee";
import { ReviewCard, type ReviewItem } from "./hero/review-card";
import { ScrollLink } from "./hero/scroll-link";
import { UnravelThread } from "./hero/unravel-thread";

/**
 * A tangle's box per breakpoint, in `em` of the headline: [side, x, top, size]. `side` says
 * which edge `x` is measured from; null hides the tangle at that size.
 */
type Spot = readonly ["l" | "r", number, number, number] | null;
type Tangle = {
  seed: number;
  loops?: number;
  delay: number;
  order: number;
  drift: readonly [number, number];
  /** Below lg: the three-line headline. */
  stacked: Spot;
  /** From lg: the two-line headline. */
  wide: Spot;
};

// The tangle field sits only in the empty pockets the staggered headline leaves, measured in em
// against the type's full ascender-to-descender boxes (the verification script checks every size):
// from lg, right of "Performance-First" above the second line, and left of the flush-right second
// line; below lg, left of "Digital Marketing" and "Agency". Never over the type or the underline.
const TANGLES: Tangle[] = [
  { seed: 97, loops: 15, delay: 0, order: 0.1, drift: [60, -40], stacked: null, wide: ["r", 0.1, -0.985, 1.6] },
  { seed: 23, loops: 10, delay: 0.35, order: 0.4, drift: [20, -60], stacked: null, wide: ["r", 1.95, -0.675, 0.95] },
  { seed: 83, loops: 8, delay: 0.55, order: 0.7, drift: [0, -50], stacked: null, wide: ["r", 3.0, -1.0, 0.55] },
  { seed: 41, loops: 11, delay: 0.2, order: 0.2, drift: [-60, 30], stacked: ["l", 0.05, 2.68, 1.58], wide: ["l", 0.02, 1.3, 1.3] },
  { seed: 127, loops: 12, delay: 0.45, order: 0.55, drift: [-30, 50], stacked: ["l", 2.2, 2.65, 1.25], wide: null },
  { seed: 67, loops: 8, delay: 0.6, order: 0.75, drift: [-20, 40], stacked: ["l", 0.25, 1.35, 0.75], wide: null },
];

function spotVars(spot: Spot, n: number, vars: Record<string, string>) {
  if (!spot) {
    vars[`--d${n}`] = "none";
    return;
  }
  const [side, x, top, size] = spot;
  vars[`--${side}${n}`] = `${x}em`;
  vars[`--t${n}`] = `${top}em`;
  vars[`--s${n}`] = `${size}em`;
}

function tangleStyle({ stacked, wide }: Tangle) {
  const vars: Record<string, string> = {};
  spotVars(stacked, 0, vars);
  spotVars(wide, 1, vars);
  return vars as CSSProperties;
}

const ACCENT = "Digital Marketing";

const reviewItems: ReviewItem[] = reviews.map((review) => {
  const key = review.platform.toLowerCase() as keyof typeof assets.review;
  return {
    platform: review.platform,
    count: review.count,
    figure: `${review.count}${review.suffix}`,
    label: review.label,
    logo: assets.review[key] ?? null,
  };
});

const intro = (x: number, y: number, stagger: number) =>
  ({ "--intro-x": `${x}px`, "--intro-y": `${y}px`, "--intro-stagger": `${stagger}s` }) as CSSProperties;

/**
 * Pattern A, art-directed: a full-viewport stage on the page gutter. A staggered two-line H1 at
 * display size with the tangle field in the pockets it leaves; sub-line and CTAs offset left, the
 * review card anchored right, the platforms as a slow band along the foot. Between them sits the
 * last knot: scrolling away unravels the field and pulls that knot out into one clean line that
 * runs on into the next section.
 */
export function HeroSection() {
  const [lineOne, lineTwo] = hero.headline;
  const rest = lineTwo.startsWith(ACCENT) ? lineTwo.slice(ACCENT.length) : null;

  return (
    // z-[1]: the thread's tail runs past the hero's foot over the next section's top padding.
    <section id="top" className="relative z-[1] overflow-x-clip bg-tint text-ink">
      <IntroStyles />
      <HeroStyles />

      <HeroStage className="relative flex min-h-svh flex-col">
        <Container className="flex flex-1 flex-col pt-28 sm:pt-32 lg:pt-28">
          {/* Headline zone: takes the free height and centres the H1 in it. Its em paddings are
              the tangles' headroom: every tangle stays inside them, so none can reach the header
              above or the sub-line and card below. */}
          <div className="flex flex-1 flex-col justify-center">
            <div className="text-(length:--h1) pb-[1.45em] [--h1:calc((100vw-2*var(--gutter))/8.6)] md:[--h1:min(calc((100vw-2*var(--gutter))/8.6),calc((100svh-22rem)/4.5))] lg:pb-[0.75em] lg:pt-[1.15em] lg:[--h1:min(calc((min(100vw,var(--content))-2*var(--gutter))/12),calc((100svh-24rem)/3.97))]">
              <div className="relative">
                <h1 className="relative z-[1] font-display font-normal leading-[0.95] tracking-[-0.035em]">
                  <span className="block w-fit">{lineOne}</span>
                  <span className="ml-auto block w-fit text-right">
                    {rest === null ? (
                      lineTwo
                    ) : (
                      <>
                        <HeroUnderline>
                          <span className="font-accent text-[1.12em] italic leading-none tracking-[-0.01em]">
                            {ACCENT}
                          </span>
                        </HeroUnderline>
                        {rest}
                      </>
                    )}
                  </span>
                </h1>
                {TANGLES.map((tangle) => (
                  <HeroTangle
                    key={tangle.seed}
                    seed={tangle.seed}
                    loops={tangle.loops}
                    delay={tangle.delay}
                    order={tangle.order}
                    drift={tangle.drift}
                    style={tangleStyle(tangle)}
                  />
                ))}
              </div>
            </div>
          </div>
        </Container>

        {/* Foot of the stage: info row and platform band. The thread runs from its knot down
            through here and out of the hero. */}
        <div className="relative">
          <Container>
            <div className="grid gap-10 pb-10 md:grid-cols-12 md:items-end md:gap-8 lg:pb-12">
              <div className="wi-intro md:col-span-6 lg:col-span-5" style={intro(-50, 40, 0.1)}>
                <p className="max-w-[34ch] text-lg leading-snug sm:text-xl lg:text-[1.375rem] lg:leading-[1.35]">
                  {hero.subline}
                </p>
                <div className="mt-7 flex flex-wrap items-center gap-x-8 gap-y-4 lg:mt-9">
                  <Magnetic>
                    <Button href={ctas.primary.href} className="px-6 pb-3 pt-3.5 text-base">
                      {ctas.primary.label}
                    </Button>
                  </Magnetic>
                  <ScrollLink to="services" variant="link" className="text-base">
                    {servicesHeading}
                  </ScrollLink>
                </div>
              </div>
              <div className="wi-intro relative z-[1] md:col-span-6 lg:col-span-5 lg:col-start-8" style={intro(50, 40, 0.2)}>
                <ReviewCard items={reviewItems} />
              </div>
            </div>
          </Container>

          {/* Opaque and above the thread: the line passes under the band, never across its words. */}
          <div className="wi-intro relative z-[2] bg-tint" style={intro(0, 30, 0.3)}>
            <PlatformMarquee items={hero.platforms} />
          </div>

          {/* Desktop: the knot sits in the gap between sub-line and card. */}
          <UnravelThread className="hero-thread pointer-events-none absolute left-1/2 top-2 -bottom-28 hidden w-28 -translate-x-1/2 lg:block xl:w-36" />
          {/* Smaller screens: it sits below the band. */}
          <div className="relative h-28 lg:hidden">
            <UnravelThread className="hero-thread pointer-events-none absolute left-1/2 top-2 -bottom-24 w-28 -translate-x-1/2" />
          </div>
        </div>
      </HeroStage>
    </section>
  );
}
