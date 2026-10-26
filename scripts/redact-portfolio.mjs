// Paints over client account names that are visible (unblurred) in curated portfolio
// screenshots. Re-run after `scripts/fetch-portfolio.mjs --curate`; it is idempotent.
// Each region is filled with the colour sampled from a nearby pixel of the same bar,
// so the redaction reads as an empty UI field rather than a black box.
//
// Usage: node scripts/redact-portfolio.mjs

import sharp from "sharp";

const DIR = "public/assets/portfolio";

/** [x, y, width, height] in image pixels; `sample` is the pixel whose colour fills the box. */
const REDACTIONS = [
  // Meta Ads Manager account selector: "Maxsip Telecom (5416…)".
  { file: "facebook-ads-telecom-before.webp", rect: [146, 6, 352, 44], sample: [520, 8] },
  { file: "facebook-ads-telecom-after.webp", rect: [146, 12, 354, 44], sample: [520, 14] },
  // Google Ads breadcrumb: "GoogleAds Mas… > Action Hero Enterpr… > Ca…".
  { file: "google-ads-sell-your-car-before.webp", rect: [222, 8, 340, 52], sample: [580, 30] },
  { file: "google-ads-sell-your-car-latest.webp", rect: [202, 4, 300, 48], sample: [520, 28] },
  // Cut-off signed-in account (phone / email fragment) at the right edge of the top bar.
  { file: "google-ads-sell-your-car-before.webp", rect: [1366, 0, 34, 66], sample: [700, 4] },
  { file: "google-ads-shade-solutions-before.webp", rect: [1330, 0, 70, 66], sample: [700, 4] },
  // Google Ads breadcrumb: "Cydir Inc > ca…".
  { file: "google-ads-shade-solutions-before.webp", rect: [180, 4, 230, 48], sample: [700, 4] },
  { file: "google-ads-shade-solutions-after.webp", rect: [192, 4, 236, 52], sample: [700, 4] },
  // Google Ads breadcrumb ("GoogleAds Masters > C…") and the signed-in account's phone + email.
  { file: "google-ads-tax-wealth-before.webp", rect: [200, 4, 230, 44], sample: [700, 4] },
  { file: "google-ads-tax-wealth-before.webp", rect: [1180, 4, 172, 42], sample: [700, 4] },
  { file: "google-ads-tax-wealth-after.webp", rect: [200, 4, 230, 44], sample: [700, 4] },
  { file: "google-ads-tax-wealth-after.webp", rect: [1180, 4, 172, 42], sample: [700, 4] },
  { file: "google-ads-tax-wealth-latest.webp", rect: [200, 4, 230, 44], sample: [700, 4] },
  { file: "google-ads-tax-wealth-latest.webp", rect: [1180, 4, 172, 42], sample: [700, 4] },
];

// sharp caches decoded input files by path; with it on, a second pass over a file it has just
// rewritten would start from the stale original and undo the first redaction.
sharp.cache(false);

const byFile = Map.groupBy(REDACTIONS, (r) => r.file);

for (const [file, regions] of byFile) {
  const path = `${DIR}/${file}`;
  const source = await sharp(path).toBuffer();
  const { width, height } = await sharp(source).metadata();

  const overlays = [];
  for (const { rect, sample } of regions) {
    const [x, y, w, h] = rect;
    if (x + w > width || y + h > height) throw new Error(`${file}: region ${rect} outside ${width}x${height}`);
    const { data } = await sharp(source)
      .extract({ left: sample[0], top: sample[1], width: 1, height: 1 })
      .raw()
      .toBuffer({ resolveWithObject: true });
    const fill = `rgb(${data[0]},${data[1]},${data[2]})`;
    const svg = `<svg width="${w}" height="${h}"><rect width="${w}" height="${h}" rx="4" fill="${fill}"/></svg>`;
    overlays.push({ input: Buffer.from(svg), left: x, top: y });
    console.log(`redact ${file} [${rect}] with ${fill}`);
  }

  // Every region for a file is composited in one pass, from one decoded copy.
  const out = await sharp(source).composite(overlays).webp({ quality: 85 }).toBuffer();
  await sharp(out).toFile(path);
}
