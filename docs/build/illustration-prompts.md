# Illustration prompts

The illustrations are generated outside this repo (by the WebIndia team) and wired into `src/content/assets.ts` (`assets.illustration.*`). Every section already renders a fallback while a slot is `null`.

## The idea, so the images mean something

The page's story is a **tangle** (scattered marketing effort) becoming **one clean line** (WebIndia's expertise) that rises into **growth**.

The illustrations tell the same story in WebIndia's own place, **Ahmedabad during Uttarayan**, the kite festival.
- Kite string (*manja*) is literally the page's thread.
- Thousands of crossing kite lines are the tangle.
- One kite on a single taut orange string is the clean line.

**Every image carries exactly one orange thread.** It is the same orange (`#FF6600`) as the page's hand-drawn lines, so the illustrations and the animations read as one system.

Don't recreate rothfinder.com's scenes. That means no suited people walking away from camera, no hedge mazes and no generic gardens.

## Style lock — paste this at the start of EVERY prompt

> A contemporary editorial illustration, clearly hand-drawn and stylised, not a painting and not realistic. Confident navy ink contour lines (#081424) with lively pen hatching for shadow and texture. Flat, slightly uneven watercolour-style colour fills that sit inside the linework, like a printed storybook or a magazine illustration. Shapes are simplified and graphic: buildings drawn as clean blocks with patterned details, people drawn as small stylised characters with simple features and expressive poses, skies as calm flat fields of colour. Strictly limited palette: navy ink; soft sky blue (#B9CFF2); cobalt blue (#0048A9); small touches of marigold yellow (#FFD64F); and exactly ONE vivid orange (#FF6600) element that reads as a single thread or string. Warm off-white paper background with subtle paper grain. Generous negative space, a clear focal point, a decorative rhythm of repeated shapes (rooftops, kites, steps, lanterns). Setting: contemporary Ahmedabad, Gujarat, India. No text, no letters, no numbers, no logos, no signage lettering, no UI, no watermark, no signature, no frame or border.

**Negative prompt / avoid:** photorealistic, photograph, realistic lighting, painterly oil or acrylic look, soft airbrushed gradients, depth-of-field blur, 3D render, CGI, glossy, neon, anime, chibi, clip-art, vector flat-design icons, thick cartoon outlines, stock-photo look, detailed realistic faces, lettering, more than one orange element.

**Getting a strong illustration feel:**
- Add "editorial illustration", "ink line art with flat watercolour fills", "storybook illustration" or "risograph-like print texture" if the first results look too painterly or photographic.
- Ask for "simplified", "stylised" and "graphic shapes"; avoid "realistic", "cinematic" or "detailed lighting".
- Keep linework visible everywhere. If the colour starts to dominate, add "line art is the main element, colour is secondary".

**Consistency tips:**
- Generate all five in one session.
- Use image 1 as the style or reference image for the rest, with the same seed or style reference if your tool supports it.
- Export at the size listed, or larger, as PNG or JPG at quality 90 or higher.
- Send me the files; I'll convert them to AVIF/WebP with blur placeholders.

---

## 1. Final CTA backdrop — `final-cta.png`
**Slot:** `illustration.finalCta`. **Size:** 3200 × 1800 (16:9). **Meaning:** "the thread leads to the action". It's the last image before "Let's Make Your Digital Dreams a Reality!".

> [STYLE LOCK] A wide illustrated panorama of old Ahmedabad's rooftops at dawn during Uttarayan, drawn as a decorative band of stylised flat-roofed houses, water tanks, carved balconies and pole wires, patterned with ink hatching. On one rooftop in the lower foreground, a small stylised figure holds a kite spool. A single taut ORANGE kite string rises from their hands in one long, clean diagonal across the picture to a small diamond-shaped kite high in the upper right. A few other kites and loose, lightly drawn tangled strings drift low over the houses. The sky is flat bands of soft sky blue fading to a marigold strip at the horizon. The lower third is dense navy linework and hatching (dark). The upper-middle area stays a calm, open field of sky for headline text.

**Composition notes:**
- The lower 35% must be dark (the footer sits on it).
- The upper-centre 50% must stay quiet, because the white headline and the button overlay it.

## 2. Testimonials panel backdrop — `testimonials.png`
**Slot:** `illustration.testimonials`. **Size:** 3000 × 1500 (2:1). **Meaning:** "the client's voice". A community gathered together, many conversations, one connection.

> [STYLE LOCK] An evening storybook illustration of neighbouring Ahmedabad rooftop terraces during the kite festival. Small stylised groups of people chat, laugh and wave across the terraces, with simple expressive poses. Strings of marigold paper lanterns zig-zag between houses as a repeating decorative pattern. Many kite strings cross the sky as a fine web of navy ink lines. Through it all, exactly ONE ORANGE string runs cleanly from one terrace up to a kite high above, tying the scene together. Night palette of flat cobalt and navy fills with small marigold lantern glows, overall dark and low-contrast. The most detail is at the left and right edges; the centre band is quiet and dark for white text.

**Composition notes:**
- It sits under a navy panel with white quotes, so overall luminance must stay low.
- Detail should live at the left and right edges.

## 3. Portfolio backdrop — `portfolio.png`
**Slot:** `illustration.portfolio`. **Size:** 3200 × 1800 (16:9). **Meaning:** "evidence, built step by step". Results aren't luck; they're constructed, level by level.

> [STYLE LOCK] A graphic, symmetrical illustration of the Adalaj stepwell near Ahmedabad, seen from above: tiers of steps, carved pillars and galleries drawn as a rhythmic, almost pattern-like stack of ink lines descending toward a small pool of flat blue water. A single ORANGE thread runs neatly down the central steps like a guideline, from the top edge of the image to the water. Flat sky-blue and cobalt fills in the shadowed tiers, marigold fills where sunlight falls on the upper steps, hatching for stone texture. Calm, orderly and decorative, with no people or one tiny stylised figure for scale. The centre is the simplest, least detailed area.

**Composition notes:**
- A large framed panel (the portfolio tabs and screenshots) covers the centre, about 70% wide.
- The architecture should frame it on the left, right and top edges.

## 4. Menu drawer — `menu.png`
**Slot:** `illustration.menu`. **Size:** 1200 × 1600 (3:4, tall). **Meaning:** "the tangle, wound into order". It shows when the visitor opens the menu.

> [STYLE LOCK] A simple, charming still-life illustration drawn from slightly above. Two stylised hands, drawn with clean contour lines, rest on a wooden ledge holding a traditional Indian kite spool (firki). The spool is neatly wound with ORANGE string, and one clean length of it runs straight up and out of the frame. Beside it lies a loose, scribbly tangle of navy string, and a folded diamond paper kite with a marigold-yellow tail. Flat cobalt shadow shapes, sky-blue background wash, paper grain. Hands shown only to the wrists, no faces. Bold, readable shapes that still work very small.

**Composition notes:**
- It is cropped to the lower third of a 370 px-wide black drawer, so the key subject (spool plus hands) belongs in the bottom-centre.
- It needs to read well very small.

## 5. (Optional) Social preview — `og.png`
**Slot:** replaces the generated `src/app/opengraph-image.tsx`. **Size:** 2400 × 1260 (1.91:1). **Meaning:** the brand moment in one picture when the site is shared.

> [STYLE LOCK] A minimal, graphic illustration on mostly empty warm paper: in the lower left, a small hand-drawn scribble-tangle of navy kite string; from it a single ORANGE string pulls free and rises in one elegant line to a small diamond kite in the upper right corner, with a flat soft-sky-blue cloud shape behind the kite and a marigold tail. Very restrained, like a book-cover illustration, with lots of empty paper on the left half for a headline.

**Composition notes:**
- Leave the left 55% nearly empty; I'll set the headline over it.

---

## After you send them

The lead converts each file, adds it to `assets.illustration.*` with a blur placeholder, and checks it in place:
- text contrast over it;
- crops at 390, 768, 1440 and 1920 px;
- dark overlays where white text sits.

Images that aren't sent keep their current fallback, so nothing blocks on them.
