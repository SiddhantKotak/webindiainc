# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Project

A redesign of the **WebIndia Inc. homepage** (https://www.webindiainc.com/), a digital marketing and web development agency. Scope is the **homepage only**. The goal is an Awwwards-quality, art-directed UI with purposeful motion that still loads fast. It is built and statically prerendered. At first build it measured 33 requests / 529 KB on first load, against the live WordPress site's 110 requests / 1.7 MB on the same test.

**Design reference: https://rothfinder.com/.** `docs/reference/rothfinder/README.md` covers:
- its visual language and section patterns (A–K) and how each maps to a WebIndia section, with screenshots;
- its asset system and its motion flow from start to end.

Borrow the patterns, never its assets or copy.

**The page's narrative device:** a pencil tangle (scattered marketing effort) unspools into one clean line (WebIndia's expertise) and ends as a rising line (growth). Every line animation has a job in that story. The per-section jobs are listed in `docs/build/agent-brief.md`'s linked plan; don't add decorative motion without one.

Source documents:
- `content.md`: the redesign brief.
- `docs/live-audit/README.md`: verbatim live copy, links, assets and brand colours, plus the open discrepancies. Where it disagrees with `content.md`, the audit wins.
- `docs/live-audit/portfolio/README.md`: the portfolio. It lives in Airtable; the raw CSVs are in `csv/`.
- `docs/build/agent-brief.md`: the build rules every section was written against (ownership, tokens, Next 16 gotchas, verification). Follow it when changing sections.

## Commands

```bash
npm run dev       # dev server (Turbopack); dev output is isolated in .next/dev, so a build can run alongside
npm run build     # production build; also runs the TypeScript check
npm run start     # serve the production build
npm run lint      # ESLint (flat config, eslint-config-next)
npx tsc --noEmit  # typecheck only

node scripts/fetch-live-assets.mjs            # re-download live-site images into public/assets/live
node scripts/fetch-portfolio.mjs [--export] [--curate]   # Airtable → CSVs + curated portfolio images
node scripts/redact-portfolio.mjs             # ALWAYS re-run after --curate: masks client names/phone/email
node scripts/make-logo-ink.mjs                # header logo (navy lettering) + W mark from the live logo
node scripts/make-service-photos.mjs          # service card photos: Unsplash → duotone per card tone
```

There is no test runner. Verification is lint, typecheck and build, plus a browser check:
- Drive a headless Chrome via `playwright-core`, launching `/opt/google/chrome/chrome` with a fresh profile.
- Load `/` and the relevant `/lab/<section>` page at 1440 and 390 px, plus `reducedMotion: 'reduce'`.
- Check for console and hydration errors and horizontal overflow, and look at the screenshots.
- Don't use the Playwright MCP browser here; its shared profile is often locked by other sessions.

## Stack

- **Next.js 16** (App Router, `src/` dir, `@/*` → `src/*`).
  - `next.config.ts` enables `cacheComponents` and `partialPrefetching`, and sets `images.formats` (AVIF/WebP) and `images.qualities: [75, 90]`. Any other `quality` is coerced.
  - AGENTS.md applies: check `node_modules/next/dist/docs/` before relying on remembered APIs.
- **Tailwind CSS v4**, configured in `src/app/globals.css`. It holds the palette tokens, font-role tokens and the `numeral` utility. There is no `tailwind.config`.
- **Motion** (`motion/react`) and **Lenis** (`lenis/react`).
- **Line animations are SVG + Motion**. Rive was evaluated and dropped.
  - Components are in `src/components/lines/`; the seeded path generators are in `src/lib/scribble.ts`.
- **Type** (`src/lib/fonts.ts`, the only place fonts are chosen):
  - Mona Sans for display, body and numerals (`numeral` = 125% width, weight 750);
  - Instrument Serif italic as `font-accent` (1–3 emphasis words per heading at most);
  - Caveat as `font-hand` (annotations only).
- **three / @react-three/fiber** are installed but unused. No WebGL scene was built.

## Architecture

- **`src/app/page.tsx` assembles the page** in narrative order:
  skip link → `LoadCover` → `SiteHeader` → `<main id="main">` (Hero → Partner → Services → Why → Team → Strengths → Testimonials → Portfolio → Featured → FAQ → Closing CTA) → `SiteFooter`.
  - The footer must stay a sibling of `<main>`, so it remains the `contentinfo` landmark. `ClosingSection` and `SiteFooter` share the black panel.
  - Section backgrounds alternate deliberately (tint hero → paper … tint portfolio … black close). Keep that rhythm when reordering.
- **Each section is `src/components/sections/<name>.tsx`**, a Server Component with the root `id` used by the header drawer (`sectionNav` in `src/content/site.ts`).
  - Its client leaves live in `src/components/sections/<name>/`.
  - `src/app/lab/<name>/` holds noindex preview pages; `/lab` is the line workbench and `/lab/type` the type specimen.
- **Shared UI** is in `src/components/ui/`: `Container`, `SectionHeader`, `Button` (always an `<a>`), `Chip`, `OutlineCard`, `SplitWords`, `Counter`, `Reveal`, `ClientOnly`.
- **The load sequence is pure CSS.**
  - `src/components/load-cover.tsx` plays on first paint, needs no JavaScript, and sets `--intro-delay`.
  - The hero entrance (`hero/intro-styles.tsx`) reads that variable.

### Rules that bite
- **One Lenis instance**: `src/components/providers/smooth-scroll.tsx`. Use `useLenis()` for programmatic scrolling (guard `null`, since it's off under reduced motion).
  - Pinned sections (services, strengths) are `position: sticky` inside tall wrappers driven by `useScroll({ target })`. An `overflow: hidden` ancestor breaks them.
- **Never conditionally wrap the page tree.** Lenis is mounted as a *childless sibling* (`{!reduceMotion && <ReactLenis root />}{children}`). Conditional wrapping remounted the whole page when the reduced-motion preference flipped after hydration.
- **In-page navigation goes through `useScrollTo()`** (`sections/header/use-scroll-to.ts`). It scrolls via Lenis, pushes the hash, and moves focus to the target section after the drawer's `inert` is lifted. Without that, the next Tab jumps back up the page.
- **Hidden first frames need the failsafe.** Motion server-renders entrance states as inline `opacity:0` / `clip-path:inset(…)`.
  - `globals.css` reveals them after 3.5 s if hydration never happens. `SmoothScroll` adds `html.js-ready` on hydration, which turns this off.
  - `layout.tsx`'s `<noscript>` style reveals them immediately without JavaScript.
  - Keep new reveals in that inline form, or add them to the selector.
- **Continuous idle loops are CSS, not Motion** (e.g. `.wi-drift` on the hero tangles). An infinite Motion loop runs JavaScript every frame, even off-screen.
- **Media queries:** use `useMediaQuery()` (`src/lib/use-media-query.ts`), which is hydration-safe and shares one `MediaQueryList` per query.
- **Reduced motion:** use `usePrefersReducedMotion()` from `src/lib/use-prefers-reduced-motion.ts`, **never Motion's `useReducedMotion()`**.
  - Motion's hook returns `null` on the server and `true` on the first client render, so markup branching on it causes hydration mismatches.
  - Ours reads `false` while hydrating, so reduced-motion users must still end in the final state once it flips. That means instant transitions, not "skip and stay hidden".
- **No `Math.random()`/`Date.now()`/`new Date()` in render or at module level.** Under `cacheComponents` they're a prerender build error, and they would break hydration anyway.
  - Scribbles are seeded, and the footer year is hardcoded text.
- **SVG strokes animate `pathLength` and must also start at `opacity: 0`.** A zero-length round-capped stroke still paints a dot.
- **`next/dynamic({ ssr: false })` is not allowed in Server Components.** Use `ClientOnly` inside a client file.
- **Sections are Server Components.** Keep `"use client"` on the smallest leaf.

## Content rules (hard constraints)

- **All copy comes from `src/content/*`, verbatim from the live site.**
  - The original modules were generated mechanically from `docs/live-audit/homepage-fulltext.json`.
  - The modules are `site.ts`, `services.ts`, `proof.ts`, `testimonials.ts`, `faq.ts`, `stats.ts`, `featured.ts`, `portfolio.ts` and `assets.ts`.
  - Never invent copy, numbers, claims or alt text.
- **Every business figure lives in `src/content/stats.ts`** with `signoff: "pending"` until the business approves it.
  - The review labels, the proof-point titles in `proof.ts` and the meta description are templated from it.
  - Figures inside running prose are listed at the bottom of `stats.ts` and must be edited by hand.
  - Open issues: 1563+ projects vs 1431 clients served; the duplicated Client Retention sub-copy; review counts; FAQ "3–5X returns".
  - The Partner badge reads "PREMIER 2026" but the featured badge reads "PREMIER 2024".
- **Portfolio images come from Airtable** via the scripts above.
  - Signed URLs expire, so assets live in `public/assets/portfolio/`.
  - Screenshots can show client account names, phone numbers or emails; `scripts/redact-portfolio.mjs` lists every masked region. Check new images before shipping.
  - SEO result figures need sign-off like the other stats.
- **No AI illustrations** (decided). The `assets.illustration.*` slots are `null`, and sections render photo, colour-panel or line-art fallbacks.
- **Both live WebIndia logos have white lettering** for dark backgrounds. The header uses `logoInk` (navy lettering) and collapses to `logoMark` (the coloured W); both are generated by `scripts/make-logo-ink.mjs`. The footer uses `logoWhite`.
- **Service card photos** are Unsplash stock (free licence), duotoned per card tone by `scripts/make-service-photos.mjs`, which also lists the credits.
- **Tracking IDs** (GA, GTM, Clarity, Ads conversions) must come from the business, not from the live page source. None are wired yet.

## Design system

- **Palette:** the reference's.
  - paper `#FBF7EF`, tint `#E8EBFF`, ink black;
  - periwinkle, forest, wine, burnt, sand, lime;
  - CTA green `#3AB91A` with **ink text** (white on that green fails AA);
  - **WebIndia orange `#FF6600`** for line accents and highlights only.
- **Look:** flat outlined UI. 1px ink borders, 8px radius (`rounded-card`), no gradients except functional scrims over photos.
- **One primary CTA:** "Get Started Today" / "Let's Connect" → `https://www.webindiainc.com/contact-us/`.
