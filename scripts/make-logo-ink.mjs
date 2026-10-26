// Derives a light-background version of the live WebIndia logo. The live artwork has white
// lettering (made for dark backgrounds); this recolours only the white, unsaturated pixels — the
// "WEBINDIA INC / SIMPLIFYING DIGITAL SUCCESS" type — to brand navy, keeping the coloured "W" mark
// and every pixel's alpha (so anti-aliased edges stay crisp).
//
// Usage: node scripts/make-logo-ink.mjs   (reads public/assets/live/logo.webp)

import sharp from "sharp";

const SRC = "public/assets/live/logo.webp";
const OUT = "public/assets/live/logo-ink.webp";
const NAVY = [0x08, 0x14, 0x24];

const { data, info } = await sharp(SRC).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
let recoloured = 0;
for (let i = 0; i < data.length; i += 4) {
  const [r, g, b, a] = [data[i], data[i + 1], data[i + 2], data[i + 3]];
  if (a === 0) continue;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  // White/light-grey lettering: bright and unsaturated. The W mark is strongly saturated.
  if (max > 150 && max - min < 45) {
    data[i] = NAVY[0];
    data[i + 1] = NAVY[1];
    data[i + 2] = NAVY[2];
    recoloured++;
  }
}

await sharp(data, { raw: { width: info.width, height: info.height, channels: 4 } })
  .webp({ quality: 92, alphaQuality: 100 })
  .toFile(OUT);
console.log(`wrote ${OUT} (${info.width}x${info.height}), recoloured ${recoloured} pixels`);

// The "W" mark alone (for the collapsed header). The tagline tucks under the mark's right edge, so
// there's no clean column to crop at; instead keep only the saturated pixels (the coloured W —
// the lettering is white/unsaturated), then trim.
const MARK = "public/assets/live/logo-mark.webp";
const { data: src } = await sharp(SRC).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
for (let i = 0; i < src.length; i += 4) {
  const max = Math.max(src[i], src[i + 1], src[i + 2]);
  const min = Math.min(src[i], src[i + 1], src[i + 2]);
  if (max - min < 45) src[i + 3] = 0;
}
const mark = await sharp(src, { raw: { width: info.width, height: info.height, channels: 4 } })
  .trim()
  .webp({ quality: 92, alphaQuality: 100 })
  .toBuffer({ resolveWithObject: true });
await sharp(mark.data).toFile(MARK);
console.log(`wrote ${MARK} (${mark.info.width}x${mark.info.height})`);
