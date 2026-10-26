#!/usr/bin/env node
// Downloads the approved live-site images from cdn.webindiainc.com into public/assets/live/.
// Idempotent: re-running overwrites the same files with the same output.
//
//   node scripts/fetch-live-assets.mjs
//
// SVGs are copied as-is after a safety check. Rasters are re-encoded to WebP (q85, max 2000px
// wide); photos also get an AVIF and a 16px blur placeholder. A manifest with intrinsic sizes is
// written to public/assets/live/_manifest.json; src/content/assets.ts is filled from it by hand
// (so illustration entries there are never clobbered).

import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const OUT = path.join(process.cwd(), "public/assets/live");
const CDN = "https://cdn.webindiainc.com/wp-content/uploads";
const UA = "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130 Safari/537.36";
const MAX_W = 2000;

/**
 * key: dotted key in assets.ts. urls: candidates, the reachable one with the largest width wins.
 * photo: AVIF + blur placeholder.
 */
const ITEMS = [
  { key: "logo", file: "logo", alt: "WebIndia Inc", urls: [`${CDN}/2023/11/WebIndia-logo-final.webp`, `${CDN}/2023/11/WebIndia-logo-final-1024x230.webp`] },
  { key: "logoWhite", file: "logo-white", alt: "WebIndia Inc", urls: [`${CDN}/2022/12/Asset-2-8.png`, `${CDN}/2023/11/Asset-2-8-768x172_11zon.png`] },
  { key: "premierPartner", file: "google-premier-partner", alt: "Google Premier Partner badge", urls: [`${CDN}/2026/03/PremierPartner-CMYK-Clickable.svg`] },

  { key: "capability.googleSearch", file: "capability-google-search", alt: "Google Search icon", urls: [`${CDN}/2024/05/Google-Search.svg`] },
  { key: "capability.googleAnalytics", file: "capability-google-analytics", alt: "Google Analytics icon", urls: [`${CDN}/2024/05/Google-Analytics.svg`] },
  { key: "capability.googleShopping", file: "capability-google-shopping", alt: "Google Shopping icon", urls: [`${CDN}/2024/05/Google-Shoping.svg`] },
  { key: "capability.displayAds", file: "capability-display-ads", alt: "Display Ads icon", urls: [`${CDN}/2024/05/Display-Ads.svg`] },
  { key: "capability.mobileCampaign", file: "capability-mobile-campaign", alt: "Mobile Campaign icon", urls: [`${CDN}/2024/05/Mobile-Campaign.svg`] },
  { key: "capability.videoAdvertising", file: "capability-video-advertising", alt: "Video Advertising icon", urls: [`${CDN}/2024/05/Video-Advertising.svg`] },

  { key: "review.upwork", file: "review-upwork", alt: "Upwork logo", urls: [`${CDN}/2024/03/Upwork-Icon.png`] },
  { key: "review.google", file: "review-google", alt: "Google logo", urls: [`${CDN}/2024/03/Google-logo.png`] },
  { key: "review.trustpilot", file: "review-trustpilot", alt: "Trustpilot logo", urls: [`${CDN}/2024/09/Trustpilot-logo.png`] },

  { key: "team", file: "team", alt: "Webindia Anniversary With the Founders and Partners", photo: true, urls: [`${CDN}/2024/03/Mask-group-3-1.png`] },

  { key: "testimonial.keira", file: "testimonial-keira", alt: "Keira Geary Marcinowski", photo: true, urls: [`${CDN}/2024/03/1.png`] },
  { key: "testimonial.tara", file: "testimonial-tara", alt: "Tara", photo: true, urls: [`${CDN}/2024/03/Tara-Horn.png`] },
  { key: "testimonial.tobias", file: "testimonial-tobias", alt: "Tobias", photo: true, urls: [`${CDN}/2024/03/2.png`] },

  { key: "featured.premierBadge", file: "featured-google-premier-badge", alt: "Google Premier Partner badge", urls: [`${CDN}/2024/04/PremierBadge.png`, `${CDN}/2024/04/PremierBadge-150x150.png`] },
  { key: "featured.trustpilot", file: "featured-trustpilot", alt: "Trustpilot logo", urls: [`${CDN}/2022/12/trustpilot-peugi7n1gxuxyag47htlc8ohs2wm0xtt78rfaupeuy-1-1.png`] },
  { key: "featured.designrush", file: "featured-designrush", alt: "DesignRush Verified Agency badge", urls: [`${CDN}/2025/01/Verified-Agency-v2.png`, `${CDN}/2025/01/Verified-Agency-v2-300x78.png`] },
  { key: "featured.apnews", file: "featured-apnews", alt: "AP News logo", urls: [`${CDN}/2025/01/aplogo-1.png`] },
  { key: "featured.influencerMarketingHub", file: "featured-influencer-marketing-hub", alt: "Influencer Marketing Hub logo", urls: [`${CDN}/2025/01/Logo_IMH-1.png`] },
  { key: "featured.bestSeo", file: "featured-best-seo", alt: "Best SEO Companies badge", urls: [`${CDN}/2022/12/bestSEO-peugj98l2baeuoxi3y2o3z6xjhraktz2oeuuhx5ny2-1-1.png`] },
  { key: "featured.bingAds", file: "featured-bing-ads", alt: "Microsoft Bing Ads logo", urls: [`${CDN}/2022/12/bing-peugj0s1csyty79shcf0zjbs70wznk1hn8zh6fi7i2-1-1.png`] },
  { key: "featured.clutch", file: "featured-clutch", alt: "Clutch logo", urls: [`${CDN}/2022/12/clutch-peugit9bu4ojdbkpp960fl83fxy1xz7my7rlc7tcvu-1-1.png`] },
];

async function fetchBuf(url) {
  const res = await fetch(url, { headers: { "user-agent": UA } });
  if (!res.ok) throw new Error(`${res.status} ${url}`);
  return Buffer.from(await res.arrayBuffer());
}

function checkSvg(buf, url) {
  const s = buf.toString("utf8");
  if (!/<svg[\s>]/i.test(s)) throw new Error(`not an SVG: ${url}`);
  if (/<script|\son\w+\s*=|javascript:|<foreignObject/i.test(s)) throw new Error(`unsafe SVG content: ${url}`);
  return s;
}

export async function blurDataURL(input) {
  const b = await sharp(input).resize(16).webp({ quality: 50 }).toBuffer();
  return `data:image/webp;base64,${b.toString("base64")}`;
}

async function main() {
  await mkdir(OUT, { recursive: true });
  const manifest = {};
  const missing = [];

  for (const item of ITEMS) {
    const isSvg = item.urls[0].endsWith(".svg");
    try {
      if (isSvg) {
        const buf = await fetchBuf(item.urls[0]);
        checkSvg(buf, item.urls[0]);
        const meta = await sharp(buf).metadata();
        const file = `${item.file}.svg`;
        await writeFile(path.join(OUT, file), buf);
        manifest[item.key] = { src: `/assets/live/${file}`, width: meta.width, height: meta.height, alt: item.alt, sourceUrl: item.urls[0], bytes: buf.length };
        continue;
      }

      // Pick the reachable candidate with the largest intrinsic width.
      let best = null;
      for (const url of item.urls) {
        try {
          const buf = await fetchBuf(url);
          const meta = await sharp(buf).metadata();
          if (!best || meta.width > best.meta.width) best = { url, buf, meta };
        } catch (e) {
          console.warn(`  skip candidate ${url}: ${e.message}`);
        }
      }
      if (!best) throw new Error("no candidate reachable");

      const base = sharp(best.buf).resize({ width: MAX_W, withoutEnlargement: true });
      const webp = await base.clone().webp({ quality: 85 }).toBuffer({ resolveWithObject: true });
      const file = `${item.file}.webp`;
      await writeFile(path.join(OUT, file), webp.data);
      const entry = { src: `/assets/live/${file}`, width: webp.info.width, height: webp.info.height, alt: item.alt, sourceUrl: best.url, bytes: webp.data.length };

      if (item.photo) {
        const avif = await base.clone().avif({ quality: 60 }).toBuffer();
        await writeFile(path.join(OUT, `${item.file}.avif`), avif);
        entry.avif = `/assets/live/${item.file}.avif`;
        entry.avifBytes = avif.length;
        entry.blurDataURL = await blurDataURL(webp.data);
      }
      manifest[item.key] = entry;
    } catch (e) {
      console.error(`MISSING ${item.key}: ${e.message}`);
      missing.push(item.key);
      manifest[item.key] = null;
    }
  }

  // Verify every written file decodes.
  for (const [key, a] of Object.entries(manifest)) {
    if (!a) continue;
    const m = await sharp(path.join("public", a.src)).metadata();
    console.log(`${key.padEnd(34)} ${a.src.padEnd(52)} ${m.width}x${m.height}  ${(a.bytes / 1024).toFixed(1)} KB`);
  }

  await writeFile(path.join(OUT, "_manifest.json"), JSON.stringify(manifest, null, 2) + "\n");
  if (missing.length) console.log(`\nMissing: ${missing.join(", ")}`);
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch((e) => {
    console.error(e);
    process.exit(1);
  });
}
