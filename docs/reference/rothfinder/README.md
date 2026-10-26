# Design reference: https://rothfinder.com/

Studied 2026-10-26 with Playwright at 1440×900 and 390×844. Screenshots `01`–`13` in this folder are named after the section they show. This is the **UI/UX direction** for the WebIndia homepage. We borrow its design language, interaction patterns and pacing. **Do not copy its illustrations, copy, logo or other assets**; WebIndia needs its own artwork.

Credited "Design Griflan" in the footer. Built with Nuxt (Vue).

## How it's built (what's actually there)

Raw data: `assets-inventory.json` (every image, canvas and media file with sizes) and `motion-trace.json` (every inline style GSAP wrote, sampled every 120px of scroll).

- **Animation engines (three of them, each for a different job):**
  - **Rive** (`.riv` files) for all the hand-drawn line animation. The 11 `<canvas>` elements are Rive renderers on 2D canvases. There is **no WebGL** on the page.
  - **Lottie** (4 JSON files, 0.7–1.3 MB each) for the product-demo "screen recordings", one per tab.
  - **GSAP + ScrollTrigger** for everything driven by scroll or load: word reveals, pins, the horizontal track and entrance animations. Hover states are plain CSS transitions.
- **No smooth-scroll library.** The page uses native scroll.
- **Stack:** Nuxt (Vue), Tailwind, and DatoCMS for images (served as AVIF/WebP via `?fm=webp&dpr=`).
- **Performance:** TTFB ≈ 0.5 s, load ≈ 0.9 s, 73 requests, ≈ 8 MB transferred, 694 KB main JS. The Rive file `inner-scrolls.riv` alone is 1.1 MB, and the Lottie files add another ≈ 4 MB. Match the feel, ship far less.

## Asset system

| Asset type | Files | Where it's used | How it's treated |
|---|---|---|---|
| **Rive scenes** | `rothfinder-home.riv` (285 KB) | Hero: the field of ~15 pencil-scribble "tangles" that keep redrawing and react to the pointer | Full-viewport canvas behind the headline, `pointer-events` on for hover devices only |
| | `hero-graph.riv` (7 KB) | Hero data widget: the tick-mark bar inside the periwinkle card | Animates when the 500K/1M/2M toggle changes (the numbers recompute: 1M → $2,082,000, 2M → $4,164,000). Auto-cycles on load. |
| | `icons.riv` (53 KB, 4 instances) | Process cards 01–04: magnifier, block pyramid, jars of coins, bridge | One continuous line per drawing, which draws itself when the card enters |
| | `inner-scrolls.riv` (1.1 MB, 5 instances) | The **connecting thread**: the long hairline that runs from a scribble tangle → the "R" app bubble → UI chips, across the intro, Meet Angie, "Know what your clients…" and Features | Section-wide canvases (e.g. 1440×2117 behind Features) |
| **Lottie** | 4 × `RothFinder - Lottie - 0N.json` | Product demo (pattern C): an animated UI walkthrough with a moving cursor, one per tab | SVG renderer inside a bordered frame |
| **Illustrations** | `bg-product` (795 KB), `transform-slide1-3` (130–180 KB each), `cta-bg` (234 KB), `footer-bg` (302 KB) | Inset panels, transformation cards, statement banner, final CTA + footer | Pen-and-ink + watercolor style, people seen from behind, landscapes/gardens/streets. AVIF at 2x. Each has an **inline tiny LQIP** (≈24×22 base64 JPEG) plus an SVG size placeholder, so they blur up without layout shift. |
| **Photos** | 3 testimonial portraits (≈100×90 shown), `angie-photo@2x.png` | Testimonials, Meet Angie | Small, in rounded frames. Photos are the only "real" imagery. |
| **Icons** | `icon-clock/coins/money/briefcase/graph/target.svg` (1–2 KB) | Calculator results | Single-stroke line icons that match the Rive drawing style |
| **Texture SVGs** | `line-scribble.svg`, `calc-scribble.svg` | Underline under "client advisor"; texture on the calculator slider track | Used as CSS `background-image` |
| **Logo** | `logo-paths.svg`, `logo-white.svg` | Header (animates from wordmark to "R" monogram), inline wordmark chip, footer | SVG paths, so they can be animated |

**What makes the art direction hang together:** one hand-drawn line language across Rive, icons and textures, plus one illustration style across every photo-sized image. Everything else is flat UI (bone, periwinkle, black 1px borders). The illustrations are the only rich texture, always in rounded inset panels or full-bleed at the end.

## Motion flow (start to end)

**The narrative device is a tangled scribble that becomes a clean line.** The hero is full of pencil tangles (complexity). From the intro onward, a single hairline unspools out of a tangle and threads through the "R" app icon into neat UI chips (clarity). The same thread reappears in later sections, and the before → after cards say it in words ("Complex → Clear", "Manual → Instant", "Hope → Certainty"). The motion *is* the value proposition.

### 1. Load sequence (`flow-00`, `flow-01`)
1. Full-screen periwinkle cover (`.cover`) holds for ~2 s while assets load, then fades out (≈2.0–2.5 s).
2. The hero content flies in diagonally toward the centre: the logo from (+50, +50), the CTA group from (−50, +50) and the data widget from (+50, −50), each fading in.
3. The H1 is split into words, which fade in one after another. The scribbles start drawing in, and the widget starts auto-cycling.

### 2. Scroll choreography (from `motion-trace.json`, at 1440×900)
| Scroll range | Section | What happens | Type |
|---|---|---|---|
| 0–1320 | Intro statement | Inline wordmark chip slides in from −72px. **Each word fades 0→1 in reading order** as it enters (≈24 words over ~350px). The CTA scales 0.8→1. The Rive thread draws from the right edge into the tangle under the app bubble. | Triggered, staggered |
| 1784–3800 | Product demo + testimonials | Large inset illustration panel. A tab bar with a scribble underline that moves to the active tab. Lottie walkthrough plays (cursor clicks "Roth Finder"). Lower down, the panel fades to black: outlined pill tags ("$3M+ PIPELINE GENERATED") with a scribble connector, portrait, quote, attribution. | Click / auto |
| 3760–7300 | Process (4 steps) | **Pinned for ~3,460px.** The card track scrubs horizontally (0 → −1213px). The active card's caption panel grows (63 → 128px) and its description fades in while the others collapse. The left step list shifts ±1.5rem and highlights the active step as a filled pill in that card's color. Each card's Rive drawing plays. | **Scrub (pinned)** |
| 7300–8400 | Meet Angie | Display words "Meet" / "Angie" are pushed apart (±300px) to open a gap. The H2 drifts down 112px. The photo frame scales in from 0.2 → 0.5 and drops into the gap. "client advisor" underline scribble fades in. | **Scrub** |
| 8824–9900 | Transformation cards | Each card has a top label and a bottom panel split by a green arrow button. Hover/click moves the split and reveals the illustration + copy in the bottom half (`flow-08`, `07`). | Hover / click |
| 9918–11000 | "Know what your clients are thinking" | Periwinkle background. Left: copy + green callout card. Right: the Rive thread runs from the top into the R bubble, which spawns typed UI chips ("Full record of client questions…"). | Rive, triggered |
| 11015–12480 | ROI calculator | **Pinned (short).** The slider thumb travels 8 → 1032px on scroll as a demo, then becomes interactive. Results count. A dark overlay (`scroll-darken`, 0 → 0.5) dims the cell as the next card stacks over it. | Scrub, then interactive |
| 12485–13100 | Statement banner | The inset illustration panel slides in from +460px at scale 0.8. The image counter-moves from −39.5% (parallax). The H2, body and CTA each come in from +50px. | Triggered |
| 13125–15480 | Features | Five feature groups appear one by one, each scale 0.8→1 + fade, stacked along the Rive thread that winds through the section. | Triggered, sequential |
| 15486–16200 | Value list | Header rises 50px. Each row **wipes in from −101%**, then its number chip pops in (scale 0.6→1) and its text slides 20px. Rows are staggered. | Triggered, staggered |
| 16286–end | Final CTA + footer | Full-bleed illustration fades in (opacity 0→1). The content fades up. The footer sits on the darkened lower part of the same image. | Triggered |

### 3. Persistent UI and interactions
- **Header** (`flow-04`): fixed. At the top it shows the full wordmark + tagline. On scroll it collapses to the "R" monogram, adds the green hamburger and keeps the two green pills.
- **Menu** (`flow-05`): drawer from the right (≈370px wide, full height) on black, with an illustration at the bottom. The page behind dims to 40% black. Anchor links go to each section, right-aligned with hairline separators, and the active item is periwinkle. The hamburger becomes a periwinkle ×.
- **Buttons:** green `#3AB91A` with a 1px black border, 8px radius and a soft 23px shadow. **On hover they turn periwinkle `#899BFF`** (colour swap, no movement). Text links are underlined.
- **Pointer:** the hero scribbles respond to the cursor (hover devices only).
- **Mobile:** same flow. The horizontal track becomes swipeable (`touch-action: pan-y`), and the drawer covers 75% width.

## What this means for our build

| Reference uses | We use | Notes |
|---|---|---|
| GSAP ScrollTrigger pins + scrub | Motion `useScroll({ target })` + `useTransform` on a `position: sticky` section inside a tall wrapper | Lenis stays the single scroll source. No pin-spacers needed. |
| Split-word reveals | A small `SplitWords` component + Motion `stagger` | Keep the text in the DOM for SEO and screen readers. |
| Rive line animations | **Option A:** Rive (`@rive-app/react-canvas`), authored by a motion designer in the Rive editor. **Option B:** SVG paths animated with Motion `pathLength`, which we can build in code now. | B is lighter and fully in our control. A gives the true hand-drawn wobble. |
| Lottie product demos | Short muted `<video>` (AV1/H.264) or Lottie via `@lottiefiles/dotlottie-react` | WebIndia has no product UI. The equivalent is campaign dashboards and results, which need real material. |
| Illustrations + LQIP | `next/image` with `placeholder="blur"`, AVIF | Need WebIndia's own artwork in one consistent style. |
| ~8 MB page | Budget: < 1.5 MB initial, lazy-load everything below the fold, load Rive/Lottie only when in view | |

## WebIndia's "thread" (proposal)

The equivalent of "tangle → clean line" for a performance-marketing agency is **messy data/traffic → one clear growth line**:
- **Hero:** scattered scribbles (ad spend, keywords, channels) float behind the headline.
- **Partner section:** a line unspools from the tangle into the Google Premier Partner badge.
- **Later sections:** the same line becomes the rising trend line behind the stats, threads through the service cards, and ends in the final CTA.

This can be built with SVG `pathLength` in code first, then upgraded to Rive if a motion designer is available.

## Visual language

- **Type:** Helvetica Neue LT Pro throughout, in Roman, Medium, Bold and **Bold Extended**.
  - Headlines are Roman (regular weight), large and tightly leaded: H1 57.6/57.6, H2 40/43.2, display H2 120px ("Meet Angie").
  - Card titles are Bold 18.4.
  - Big numbers and the wordmark use Bold Extended.
  - Eyebrow labels are small caps (e.g. "BENEFITS", "ROI CALCULATOR").
  - Mostly centred section headers. A few are left-aligned in two-column layouts.
- **Color:**
  - Warm bone background `#FBF7EF` with a periwinkle tint `#E8EBFF` for alternating sections.
  - Black text, with 1px black outlines on cards and buttons.
  - Saturated accents, one per card: periwinkle `#899BFF`, forest `#2A5B40`, wine `#63252F`, burnt orange `#CF530B`, sand `#C3B591`.
  - Primary CTA is bright green `#3AB91A`.
- **Shapes:** 8px radius everywhere, with a 1px black border. Buttons get a soft drop shadow. Numbered chips ("01.") sit in white rounded squares. The look is flat, "UI-sketch" styled cards rather than glossy gradients.
- **Illustration:**
  - **Hand-drawn scribbles** (pencil scrawl balls) float over the hero and react to the pointer (`has-hover:pointer-events-auto`).
  - **Continuous single-line drawings** (magnifier, blocks, jars, bridge) sit inside the process cards.
  - **Long hairline curves** sweep across sections, connecting them.
  - **Pen-and-ink + watercolor illustrations** are used for full-bleed panels (landscapes, people seen from behind).
- **Header:**
  - At the top of the page: full wordmark + tagline on the left, two green pill buttons on the right.
  - After scrolling: collapses to an "R" monogram, the same pills and a green hamburger.
  - The menu holds the anchor-nav for the sections.

## Section patterns

| # | Pattern | Reference screenshot | Notes |
|---|---|---|---|
| A | **Hero with floating scribbles + live product widget** | `01-hero.jpg` | Centred 4-line headline, primary + text-link CTA. Bottom-left: intro paragraph + "See it in action" segmented toggle (500K/1M/2M). Bottom-right: a data card that updates when you click the toggle. |
| B | **Statement paragraph with word-by-word reveal** | `02-intro.jpg` | Wordmark chip inline in the sentence. Words fade from grey to black as you scroll. A hairline curve draws in from the edge toward a scribble and an app-icon bubble. |
| C | **Framed product demo over a full-bleed illustration** | `03-results.jpg` | Tab bar (4 tabs) + a large UI frame in front of an inset illustrated panel with rounded corners. |
| D | **Pinned horizontal process track** | `04-process.jpg`, `05-process-pinned.jpg` | Left column stays pinned (eyebrow, H2, body, step list). The step list highlights the active step as a filled chip. On the right, colored cards (01–04) scroll sideways. Each has a line drawing and a title/description footer. |
| E | **Display-size statement with inline media** | `06-meet-angie.jpg` | 120px words with a framed image between them. Underlined key phrase. Single CTA. |
| F | **Before → after flip cards** | `07-testimonial-cards.jpg` | Three columns: "Complex ↓ Clear", "Manual ↓ Instant", "Hope ↓ Certainty". The arrow button turns the bottom half into an illustrated reveal with copy. |
| G | **Interactive calculator** | `08-impact.jpg` | Periwinkle section. Slider styled as a green track with line texture and a pill thumb. Three result cells with line icons and big Bold Extended numbers. |
| H | **Inset image banner with headline** | `11-statement.jpg` | Rounded inset illustration that overlaps the section-color boundary. Left-aligned headline, sub-line and CTA over a dark gradient. |
| I | **Feature stack connected by a hairline** | `09-features.jpg` | One feature group at a time (title bar + icon tab + list rows), with a curve threading into it. Cycles through 5 groups. |
| J | **Numbered value list** | `12-value-grid.jpg` | Two columns: pitch + CTA on the left, bordered numbered rows on the right. |
| K | **Final CTA over illustration that flows into the footer** | `10-footer-cta.jpg` | Full-bleed illustration fading to black. Big white headline + CTA. The footer sits on the same image: wordmark, blurb, legal links, email, LinkedIn. |

**Mobile** (`13-mobile-hero.jpg`): same order, single column. Headline stays large (~40px). The data card stacks full-width under a segmented toggle. Header is wordmark + hamburger.

## Mapping to the WebIndia homepage

Uses the section list in `/content.md` and the copy in `/docs/live-audit/README.md`.

| WebIndia section | Reference pattern | How it adapts |
|---|---|---|
| Header | Header behaviour | Wordmark → monogram on scroll. Pill CTA "Let's Connect". Menu holds the section anchors and the main service links. |
| Hero | A | "Performance-First / Digital Marketing Agency". Floating scribbles. The live widget becomes the review badges (Upwork 680+, Google 162+, Trustpilot 42+) and/or a platform toggle (Google · Facebook · Amazon · Bing · WordPress · Shopify). |
| Premier Partner | B | Word-reveal statement with the Google Partner badge inline (in place of the wordmark chip). A hairline leads into the six Google capability icons. |
| Services (6) | D | Pinned horizontal track, one colored card per service, each with a single-line drawing. The pinned list on the left highlights the active service. |
| Why Choose + Advantages (consolidated) | J | Pitch on the left, numbered rows on the right (merge the 8 advantages + 3 proof points, dedupe them against Values). |
| Dedicated team | E or H | Display headline with the team/founders photo inline, or an inset photo banner. |
| Values (4) | F | Flip-reveal cards, e.g. pairs of statement → proof. Use real copy only. |
| Strengths / stats | G (visual only) | Big Bold Extended numbers in bordered cells with line icons, counting up on entry. **Not** an interactive calculator, since we'd have to invent outputs. |
| Testimonials (3) | F/J card styling | Bordered cards, quote headline in bold, attribution with role · company · country. |
| Portfolio | C | Tab bar (Google Ads / Facebook Ads / SEO / WordPress) over a framed panel. The panel holds real results from the Airtable portfolio (see `/docs/live-audit/portfolio/README.md`): before → after dashboard screenshots with a hand-drawn circle on the key metric for Ads/SEO, and auto-scrolling full-page screenshots in a browser frame for WordPress. This replaces the reference's Lottie product demo. |
| Featured on / certifications | I | Logos in a bordered strip, or a hairline threading through the badge row. |
| FAQ (8) | I/J row styling | Bordered accordion rows with numbered chips. |
| Final CTA + Footer | K | "Let's Make Your Digital Dreams a Reality!" + "Get Started Today" over a full-bleed image fading into a dark footer with the real contact details. |

## Open design decisions

- **Palette:** WebIndia's own colors (navy `#081424`, blue `#0048A9`, orange `#FF6600`, yellow `#FFD64F`) vs. the reference's bone/periwinkle system. Likely answer: bone/off-white base, navy as "black", and blue/orange/yellow as the per-card accents.
- **Typeface:** Helvetica Neue LT Pro and Proxima Nova both need licences. A free grotesk with an extended cut is an alternative.
- **Illustration source:** the reference relies on custom artwork. WebIndia needs commissioned or approved illustrations/photography. The scribbles and line drawings can be code-drawn (canvas/SVG).
- **WebGL:** the reference doesn't need it. Decide whether one hero effect justifies it, given the performance goal.
