// Service card photos: generic stock photography (Unsplash License — free for commercial use, no
// attribution required; credits kept below anyway), each baked into a duotone in its card's brand
// tone so the six read as one designed set rather than stock. The card's line icon draws on top.
//
// Usage: node scripts/make-service-photos.mjs   → public/assets/services/<key>.webp
// The tones mirror src/components/sections/services/tones.ts (card order = services.ts order).

import sharp from "sharp";
import { mkdir } from "node:fs/promises";

const OUT = "public/assets/services";
const SIZE = { width: 880, height: 840 }; // ≈ the card art panel's aspect, 2× its largest size

// [shadow, highlight] per card tone.
const PHOTOS = [
  {
    key: "googleAds",
    unsplash: "Ux6_jnk2cO8", // hands typing on a laptop
    credit: "unsplash.com/photos/Ux6_jnk2cO8",
    duotone: ["#00214f", "#6d9fe8"], // blue card
    position: "centre",
  },
  {
    key: "bingAds",
    unsplash: "slLo94wES2M", // working at a laptop on a desk
    credit: "unsplash.com/photos/slLo94wES2M",
    duotone: ["#0b1119", "#6f8299"], // slate card
    position: "centre",
  },
  {
    key: "facebookAds",
    unsplash: "-UtJxTRAndY", // hands holding a phone showing a social feed (Swello)
    credit: "unsplash.com/photos/-UtJxTRAndY",
    duotone: ["#b07d00", "#fff3c4"], // yellow card
    position: "centre",
  },
  {
    key: "seo",
    unsplash: "JKUTrJ4vK00", // analytics graphs on a laptop (Luke Chesser)
    credit: "unsplash.com/photos/JKUTrJ4vK00",
    duotone: ["#02060c", "#3a5680"], // ink card
    position: "centre",
  },
  {
    key: "wordpress",
    unsplash: "5sLNGV2EFRM", // code on a monitor (Harshit Katiyar)
    credit: "unsplash.com/photos/5sLNGV2EFRM",
    duotone: ["#8a3000", "#ffb27a"], // orange card
    position: "centre",
  },
  {
    key: "amazonAds",
    unsplash: "5u5IQyQdfkM", // a cardboard shipping box
    credit: "unsplash.com/photos/5u5IQyQdfkM",
    duotone: ["#5d7fb8", "#eef4fd"], // sky card
    position: "centre",
  },
];

const hex = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));

await mkdir(OUT, { recursive: true });
for (const p of PHOTOS) {
  const res = await fetch(`https://unsplash.com/photos/${p.unsplash}/download?w=1600`);
  if (!res.ok) throw new Error(`${p.key}: HTTP ${res.status}`);
  const input = Buffer.from(await res.arrayBuffer());

  // Greyscale, normalised, then each luminance value mapped between the two tone colours.
  const { data, info } = await sharp(input)
    .resize({ ...SIZE, fit: "cover", position: p.position })
    .greyscale()
    .normalise()
    .raw()
    .toBuffer({ resolveWithObject: true });
  const [lo, hi] = p.duotone.map(hex);
  const rgb = Buffer.alloc(info.width * info.height * 3);
  for (let i = 0; i < data.length; i++) {
    const t = data[i] / 255;
    for (let c = 0; c < 3; c++) rgb[i * 3 + c] = Math.round(lo[c] + (hi[c] - lo[c]) * t);
  }
  await sharp(rgb, { raw: { width: info.width, height: info.height, channels: 3 } })
    .webp({ quality: 72 })
    .toFile(`${OUT}/${p.key}.webp`);
  console.log(`wrote ${OUT}/${p.key}.webp  (${p.credit})`);
}
