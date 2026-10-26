# Build brief for section agents

Shared rules for every agent building part of the homepage. Read this, `CLAUDE.md` and `AGENTS.md` before writing code.

## What we're building
WebIndia Inc.'s homepage, rebuilt in the visual language of https://rothfinder.com/.
- **Design breakdown:** `docs/reference/rothfinder/README.md`. Read the "Visual language", "Section patterns", "Motion flow" and "What this means for our build" sections.
- **Screenshots:** in the same folder. View them with the Read tool.
- **Rule:** borrow patterns, never rothfinder's copy or assets.

**Narrative:** scattered marketing effort (pencil tangle) → WebIndia's expertise (one clean line) → measurable growth (rising line). Every line animation has a job in that story. Never add decorative motion that has no job. The per-section line jobs are in `/home/siddhant/.claude/plans/run-rive-uninstall-and-jazzy-aurora.md` ("Line animations with a purpose").

## Hard rules
1. **Copy comes only from `src/content/*`.** That's `site.ts`, `stats.ts`, `services.ts`, `proof.ts`, `testimonials.ts`, `faq.ts`, `portfolio.ts` and `assets.ts`, all verbatim from the live site.
   - Never write marketing copy, numbers, claims or alt text of your own.
   - Small structural labels are fine if they are factual, e.g. an eyebrow like "Services" or "FAQ", or "01." numbering.
   - Every business figure comes from `stats.ts`.
2. **File ownership.** Edit only the files your task names.
   - Never edit `src/app/globals.css`, `src/app/layout.tsx`, `next.config.ts`, `src/app/page.tsx`, `src/content/*`, `src/components/ui/*`, `src/lib/*`, or another agent's files.
   - If you need a shared change, say so in your report rather than making it.
3. **Section contract.**
   - Each section is `src/components/sections/<name>.tsx`: a **Server Component** exporting `<NameSection />`.
   - Its client leaves (`"use client"`, as small as possible) go in `src/components/sections/<name>/`.
   - Preview it at `src/app/lab/<name>/page.tsx`. Copy the noindex metadata pattern from `src/app/lab/page.tsx`.
   - The section's root element carries the given `id`.
4. **Next 16 + `cacheComponents` rules.**
   - No `Math.random()`, `Date.now()` or `new Date()` in render or at module level. That's a prerender build error. Scribble paths are seeded (`src/lib/scribble.ts`).
   - `window`/`document` only inside effects or handlers, and effects must clean up.
   - `next/dynamic({ ssr: false })` is not allowed in Server Components. Use `ClientOnly` (`@/components/ui/client-only`) inside a client file.
   - `next/image`: `quality` must be 75 or 90; use `preload` (not `priority`) only for the hero LCP image; `placeholder="blur"` needs the manifest's `blurDataURL`.
5. **Motion and scroll.**
   - Import from `motion/react`.
   - Lenis is the single scroll provider (already mounted). Never create another, and never scroll-jack.
   - Pinned/scrubbed sections use `position: sticky` inside a tall wrapper plus `useScroll({ target })`. See `src/components/lines/growth-thread.tsx`.
   - Reduced motion is respected globally (`MotionConfig reducedMotion="user"`). Anything you scrub or draw must also render its **final** state statically (see the existing line components).
   - **Use `usePrefersReducedMotion()` from `@/lib/use-prefers-reduced-motion`, never Motion's `useReducedMotion()`.** Motion's hook returns `null` on the server and `true` on the client's first render, so any markup that branches on it causes a hydration mismatch.
     - Ours reads `false` while hydrating and the real value on the next render.
     - So a component's *initial* state must look right either way, and reduced-motion users must end up in the final state once the hook flips (use instant transitions, not "skip the animation and stay hidden").
6. **Accessibility.**
   - One `h2` per section (only the hero has the `h1`).
   - Decorative SVGs get `aria-hidden`.
   - Visible focus is already global.
   - Interactive things are real `<button>`/`<a>` elements and keyboard-operable.
   - Colour contrast is AA. Ink on paper, ink on CTA green, and white on forest/wine/black all pass. White on periwinkle, cta or sand does not.
7. **No new dependencies.** Don't run `npm install` or `npm run build`, and don't start or stop servers. The shared dev server is already running at **http://localhost:3200**. Don't commit.

## Design tokens (Tailwind v4 classes)
- **Colours: WebIndia's live brand palette** (changed in round 2; the rothfinder colours are gone):
  - `bg-paper` `#FBF9F5` (page), `bg-tint` `#EAF1FB` (light-blue alternate sections);
  - `text-ink`/`border-ink`/`bg-ink` navy `#081424` (text, outlines, dark panels);
  - `bg-blue` `#0048A9` (primary; `bg-cta` = blue, **white text**), `bg-sky` `#B9CFF2` (light blue fills, ink text), `bg-slate` `#202B39`, `bg-yellow` `#FFD64F` (highlights, ink text);
  - `text-orange` / `text-accent` / `var(--accent)` orange `#FF6600`, for line accents and highlights only. Orange text on paper fails AA, so never use it for body text.
- **Layout tokens:** use `Container` (`max-w-(--content) px-(--gutter)`).
  - `--gutter` is 16/24/52 px and is shared with the header, so section content edges line up with it.
  - Full-bleed layouts that must align with contained sections use `--page-margin`.
  - Don't add your own max-width or side padding on top of these.
- **Dev server:** if a `globals.css` change doesn't show, Turbopack's dev cache is stale. The lead clears `.next/dev/cache`; don't work around it in components.
- **Type:**
  - `font-display` for headlines: regular weight, tight leading.
  - `font-sans` for body (the default).
  - `font-hand` only for short annotations next to drawn lines.
  - The `numeral` utility for big numbers.
  - **Chosen typeface (final):** Mona Sans for display, body and numerals (numerals at 125% width, weight 750), Instrument Serif *italic* as `font-accent italic`, and Caveat as `font-hand`.
  - Use `font-accent italic` for 1–3 emphasis words in a heading at most, e.g. "Digital Marketing" in the hero H1. Never use it for whole paragraphs.
  - Never hardcode a family; use the tokens.
- **Shape:** `rounded-card` (8px), 1px `border-ink`, `shadow-btn` on primary buttons only. The look is flat: no gradients, no glassmorphism.
- **Rhythm** (from the reference):
  - section vertical padding around `py-24 sm:py-32`;
  - headline sizes 32–40px for h2 and up to 58px for the hero (display sizes above that only as deliberate moments);
  - body 16–18px;
  - eyebrow 12px uppercase.

## Shared building blocks (import, don't copy)
- **`@/components/ui/*`:**
  - `Container` (1200px max, 16px phone gutter);
  - `Eyebrow`;
  - `SectionHeader({ eyebrow, title, intro, align, as })`;
  - `Button({ variant: primary|outline|link })` (always an `<a>`);
  - `Chip`, `OutlineCard`;
  - `SplitWords({ text, as, mode: stagger|scroll })`;
  - `Counter({ value, prefix, suffix, start })` (SSR-safe, accessible);
  - `Reveal({ delay, x, y })`;
  - `ClientOnly`.
- **`@/components/lines/*`:**
  - `ScribbleTangle`, `GrowthThread`, `HandCircle`, `ScribbleUnderline`;
  - `LineIcon` (names: `googleAds`, `seo`, `wordpress`; the line agent is adding `facebookAds`, `bingAds`, `amazonAds`);
  - coming from the line agent: `HandCheck`, `ArrowThread`, `BadgeThread`. Their contracts are in its task, and you may code against them.
- `@/lib/scribble` (seeded path generators), `@/lib/use-element-size`, `@/lib/cn`.
- **Images:** `assets` from `@/content/assets`. Any slot may be `null`, so always render a graceful fallback.
  - **There will be no AI illustrations** (decided). The `assets.illustration.*` slots stay `null`, so designs must stand on real photos, real portfolio screenshots, flat colour panels and line art.
  - The live review logos and both WebIndia logos are light artwork made for dark backgrounds. On paper, flip them with a CSS filter or use text.
- **Content added for wave 2:** `@/content/portfolio` (`portfolio` with 12 curated items, `portfolioTabs` with live `href`s, `portfolioHeading`) and `@/content/featured` (`featuredHeading`, `featuredLogos`).
  - Portfolio screenshots with visible client names were redacted by `scripts/redact-portfolio.mjs`.

## Verify before reporting
1. `npx tsc --noEmit` and `npx eslint <your files>` are clean. Type errors in another agent's in-progress files aren't yours, but list them.
2. **Visual check in an isolated browser.** Never use the Playwright MCP tools: their shared profile is locked. Copy the pattern in `/tmp/claude-1000/-home-siddhant-Desktop-webindiainc/16738089-dcec-4592-aaad-31afc29ec435/scratchpad/verify-lab.cjs`: `require` playwright-core from `/home/siddhant/.npm/_npx/9833c18b2d85bc59/node_modules/playwright-core` and launch `/opt/google/chrome/chrome` headless with a fresh profile.
   - Write your script and screenshots in your own folder `…/scratchpad/<your-agent-name>/`.
   - Load `http://localhost:3200/lab/<name>` at **1440×900 and 390×844**, plus `reducedMotion: 'reduce'`.
   - Check:
     - console errors (there should be none);
     - horizontal overflow (`scrollWidth - innerWidth` should be 0);
     - mid-animation and settled states;
     - for pinned sections, that they pin and then release.
   - **Look at your screenshots** with the Read tool and iterate until it looks art-directed, not templated.
3. **Report** (concise):
   - the files created;
   - which content and asset keys you used;
   - screenshot paths;
   - known gaps;
   - any shared-file change you need.
