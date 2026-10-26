#!/usr/bin/env node
// Exports the public Airtable portfolio galleries and builds the homepage portfolio selection.
//
//   node scripts/fetch-portfolio.mjs            # export CSVs + attachments, then curate
//   node scripts/fetch-portfolio.mjs --curate   # curate only, from the cached export
//
// Phase 1 (export): opens each shared view in an isolated headless Chrome, clicks "Download CSV",
// saves the raw CSV to docs/live-audit/portfolio/csv/<view>.csv and downloads every attachment
// into a local cache (PORTFOLIO_CACHE, default <os tmp>/webindia-portfolio). Airtable attachment
// URLs are signed and expire within hours, so re-run phase 1 to get fresh ones.
//
// Phase 2 (curate): converts the hand-picked records in CURATED to WebP (q85, max 1400px wide,
// full height kept) with 16px blur placeholders in public/assets/portfolio/, and rewrites the
// `portfolio` array in src/content/portfolio.ts. Text is copied verbatim from the CSV.
//
// Needs: playwright-core (PLAYWRIGHT_CORE=<path> if not resolvable), Chrome (CHROME_PATH),
// pdftoppm (poppler) for attachments that are PDFs.

import { execFileSync } from "node:child_process";
import { existsSync } from "node:fs";
import { mkdir, readFile, readdir, writeFile } from "node:fs/promises";
import { createRequire } from "node:module";
import os from "node:os";
import path from "node:path";
import sharp from "sharp";

const ROOT = process.cwd();
const CSV_DIR = path.join(ROOT, "docs/live-audit/portfolio/csv");
const OUT = path.join(ROOT, "public/assets/portfolio");
const CACHE = process.env.PORTFOLIO_CACHE || path.join(os.tmpdir(), "webindia-portfolio");
const CHROME = process.env.CHROME_PATH || "/opt/google/chrome/chrome";
const MAX_W = 1400;

const VIEWS = {
  googleAds: "https://airtable.com/embed/appufCVoCHUcKEyrx/shr7hV6aoaDJP9ar4",
  facebookAds: "https://airtable.com/embed/appufCVoCHUcKEyrx/shrvt4mrvAO7Uwo8w",
  seo: "https://airtable.com/embed/appufCVoCHUcKEyrx/shrPTkhQzglDAOr66",
  wordpressSites: "https://airtable.com/embed/shr7twZbigImBsWUm",
  wordpressLanding: "https://airtable.com/embed/appufCVoCHUcKEyrx/shrWqsVPk2ESbRM9l",
};

// ---------------------------------------------------------------- CSV parsing

/** RFC 4180 parser (quoted fields, embedded commas/newlines, "" escapes). */
export function parseCsv(text) {
  text = text.replace(/^﻿/, "");
  const rows = [];
  let row = [];
  let field = "";
  let q = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (q) {
      if (c === '"' && text[i + 1] === '"') {
        field += '"';
        i++;
      } else if (c === '"') q = false;
      else field += c;
    } else if (c === '"') q = true;
    else if (c === ",") {
      row.push(field);
      field = "";
    }
    else if (c === "\n" || c === "\r") {
      if (c === "\r" && text[i + 1] === "\n") i++;
      row.push(field);
      rows.push(row);
      row = [];
      field = "";
    } else field += c;
  }
  if (field || row.length) {
    row.push(field);
    rows.push(row);
  }
  const [head, ...body] = rows.filter((r) => r.some((f) => f.trim()));
  return body.map((r) => Object.fromEntries(head.map((h, i) => [h.trim(), r[i] ?? ""])));
}

/** Attachment cells look like `name (https://...),name2 (https://...)`. */
export function parseAttachments(cell) {
  const out = [];
  const re = /\s*(.*?)\s*\((https:\/\/[^)\s]+)\)\s*(?:,|$)/gs;
  let m;
  while ((m = re.exec(cell))) out.push({ name: m[1].trim(), url: m[2] });
  return out;
}

/** Builds an Airtable-style CSV from readSharedViewData JSON (same cell formats as Download CSV). */
function csvFromViewData(data) {
  const t = data.table;
  const signed = t.signedUserContentUrls || {};
  const viewId = t.viewOrder?.[0];
  const colOrder = t.views?.find((v) => v.id === viewId)?.columnOrder?.filter((c) => c.visibility !== false).map((c) => c.columnId);
  const cols = colOrder?.length ? colOrder.map((id) => t.columns.find((c) => c.id === id)).filter(Boolean) : t.columns;
  const choice = (col, id) => col.typeOptions?.choices?.[id]?.name ?? id;
  const fmt = (col, v) => {
    if (v == null) return "";
    if (col.type === "multipleAttachment") return v.map((a) => `${a.filename} (${signed[a.url] || a.url})`).join(",");
    if (col.type === "multiSelect") return v.map((id) => choice(col, id)).join(",");
    if (col.type === "select") return choice(col, v);
    return typeof v === "object" ? JSON.stringify(v) : String(v);
  };
  const esc = (s) => (/[",\n\r]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s);
  const lines = [cols.map((c) => esc(c.name)).join(",")];
  for (const r of t.rows) lines.push(cols.map((c) => esc(fmt(c, r.cellValuesByColumnId[c.id]))).join(","));
  return "﻿" + lines.join("\n") + "\n";
}

const slug = (s) =>
  s
    .toLowerCase()
    .replace(/\.[a-z0-9]{2,4}$/, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 60);

// ---------------------------------------------------------------- phase 1: export

async function loadChromium() {
  const require = createRequire(import.meta.url);
  const candidates = [process.env.PLAYWRIGHT_CORE, "playwright-core", "/home/siddhant/.npm/_npx/9833c18b2d85bc59/node_modules/playwright-core"];
  for (const c of candidates.filter(Boolean)) {
    try {
      return require(c).chromium;
    } catch {}
  }
  throw new Error("playwright-core not found; set PLAYWRIGHT_CORE=/path/to/playwright-core");
}

async function exportViews() {
  const chromium = await loadChromium();
  await mkdir(CSV_DIR, { recursive: true });
  const browser = await chromium.launch({ executablePath: CHROME, headless: true });
  try {
    for (const [view, url] of Object.entries(VIEWS)) {
      const ctx = await browser.newContext({ acceptDownloads: true, viewport: { width: 1440, height: 1000 } });
      const page = await ctx.newPage();
      // Capture the view's data as JSON (the app asks for msgpack; ask for JSON instead). Used as a
      // fallback when the share has CSV download disabled (the WordPress sites view does).
      let viewData = null;
      await page.route(/readSharedViewData/, async (route) => {
        const u = route.request().url().replace("%22allowMsgpackOfResult%22%3Atrue", "%22allowMsgpackOfResult%22%3Afalse");
        const res = await route.fetch({ url: u });
        const body = await res.text();
        try {
          viewData = JSON.parse(body).data;
        } catch {}
        await route.fulfill({ response: res, body });
      });
      await page.goto(url, { waitUntil: "domcontentloaded" });
      await page.waitForTimeout(7000);
      const file = path.join(CSV_DIR, `${view}.csv`);
      const btn = page.getByText("Download CSV", { exact: true }).first();
      if (await btn.isVisible().catch(() => false)) {
        const [dl] = await Promise.all([page.waitForEvent("download", { timeout: 30000 }), btn.click()]);
        await dl.saveAs(file);
        console.log(`csv  ${view} -> ${path.relative(ROOT, file)} (Download CSV)`);
      } else if (viewData) {
        await writeFile(file, csvFromViewData(viewData));
        console.log(`csv  ${view} -> ${path.relative(ROOT, file)} (built from shared view data; CSV export disabled)`);
      } else {
        throw new Error(`${view}: no Download CSV button and no view data captured`);
      }
      await page.unrouteAll({ behavior: "ignoreErrors" });
      await ctx.close();
    }
  } finally {
    await browser.close();
  }

  // Download every attachment of every record into the cache.
  for (const view of Object.keys(VIEWS)) {
    const rows = parseCsv(await readFile(path.join(CSV_DIR, `${view}.csv`), "utf8"));
    const dir = path.join(CACHE, view);
    await mkdir(dir, { recursive: true });
    const index = [];
    for (const [ri, row] of rows.entries()) {
      for (const [col, cell] of Object.entries(row)) {
        for (const [ai, att] of parseAttachments(cell).entries()) {
          const res = await fetch(att.url);
          if (!res.ok) {
            console.warn(`  ! ${view} r${ri} ${col}: ${res.status} ${att.name}`);
            continue;
          }
          const type = res.headers.get("content-type") || "";
          const ext = type.includes("pdf") ? "pdf" : type.split("/")[1]?.split(";")[0] || "bin";
          const file = `r${String(ri).padStart(2, "0")}-${slug(col)}-${ai}.${ext}`;
          await writeFile(path.join(dir, file), Buffer.from(await res.arrayBuffer()));
          index.push({ row: ri, column: col, i: ai, name: att.name, file, type });
        }
      }
    }
    await writeFile(path.join(dir, "_index.json"), JSON.stringify(index, null, 2));
    console.log(`att  ${view}: ${index.length} files -> ${dir}`);
  }
}

// ---------------------------------------------------------------- phase 2: curate

const BA = "Before/After Results";
const ADS = { titleCol: "Business Description", industryCol: "Industry" };
const SEO = { ...ADS, objectiveCol: "Goals", resultsCol: "Results" };
const WP = { titleCol: "Project", urlCol: "Url" };

/**
 * Hand-picked homepage records (3 per tab). `match` is a substring of the title column.
 * `images` maps a PortfolioItem image slot to { col, i } = attachment column + index, optionally
 * `pdfImage` = index of the raster embedded in a PDF attachment (as listed by `pdfimages -list`).
 * The SEO "Before/After Results" attachments are multi-page PDF reports; their before/after
 * Search Console screenshots are extracted as the embedded images, and `label` is the caption
 * printed above each one in the PDF (verbatim). Other labels come from the attachment filename.
 * `alt` describes what the screenshot shows (it is not business copy).
 */
const CURATED = [
  // Google Ads: few campaign rows, legible totals, before/after/latest all present.
  { id: "google-ads-sell-your-car", category: "googleAds", view: "googleAds", ...ADS, match: "Sell your car online",
    images: { before: { col: BA, i: 0 }, after: { col: BA, i: 1 }, latest: { col: "Latest Results", i: 0 } } },
  { id: "google-ads-shade-solutions", category: "googleAds", view: "googleAds", ...ADS, match: "One-Stop Shop for Shade Solutions",
    images: { before: { col: BA, i: 0 }, after: { col: BA, i: 1 }, latest: { col: "Latest Results", i: 0 } } },
  { id: "google-ads-tax-wealth", category: "googleAds", view: "googleAds", ...ADS, match: "Helps with tax preparation",
    images: { before: { col: BA, i: 0 }, after: { col: BA, i: 1 }, latest: { col: "Latest Results", i: 0 } } },

  // Facebook Ads: records with a concrete objective and blurred / few rows.
  { id: "facebook-ads-fashion-boutique", category: "facebookAds", view: "facebookAds", ...ADS, objectiveCol: "Objective", match: "SuElle Boutique",
    images: { before: { col: BA, i: 0 }, after: { col: BA, i: 1 } } },
  { id: "facebook-ads-np-education", category: "facebookAds", view: "facebookAds", ...ADS, objectiveCol: "Objective", match: "nurse practitioners with continuing education",
    images: { before: { col: BA, i: 0 }, after: { col: BA, i: 1 } } },
  { id: "facebook-ads-telecom", category: "facebookAds", view: "facebookAds", ...ADS, objectiveCol: "Objective", match: "Free Internet Service Provider",
    images: { before: { col: BA, i: 0 }, after: { col: BA, i: 1 } } },

  // SEO: Results text with clear numbers that the extracted screenshots directly show.
  { id: "seo-dental-clinic", category: "seo", view: "seo", ...SEO, match: "A dental clinic with 6 locations",
    images: {
      before: { col: BA, i: 0, pdfImage: 0, label: "Pre-Project Clicks and Impressions Data: Six Months Analysis" },
      after: { col: BA, i: 0, pdfImage: 1, label: "Post-Project Clicks and Impressions Data: Six Months Analysis" },
    } },
  { id: "seo-cosmetics-retailer", category: "seo", view: "seo", ...SEO, match: "An online cosmetics retailer",
    images: {
      before: { col: BA, i: 0, pdfImage: 0, label: "Clicks and Impressions in the initial six months of SEO implementation" },
      after: { col: BA, i: 0, pdfImage: 1, label: "Clicks & Impressions Data: Six Months Later" },
    } },
  { id: "seo-grocery-retailer", category: "seo", view: "seo", ...SEO, match: "An online grocery retailer",
    images: {
      before: { col: BA, i: 0, pdfImage: 1, label: "Clicks and Impressions Data From Jan to June: Six Month Analysis" },
      after: { col: BA, i: 0, pdfImage: 2, label: "Clicks and Impressions Data From July to Dec: Six Month Analysis" },
    } },

  // WordPress: two full-length landing-page captures + one named client site.
  { id: "wordpress-abbotsford-dental", category: "wordpress", view: "wordpressLanding", ...WP, match: "Abbotsford Dental Clinic",
    images: { preview: { col: "Preview", i: 0 } } },
  { id: "wordpress-lilis-early-learning", category: "wordpress", view: "wordpressLanding", ...WP, match: "Early Learning Centre",
    images: { preview: { col: "Preview", i: 0 } } },
  { id: "wordpress-serendipity-albums", category: "wordpress", view: "wordpressSites", ...WP, industryCol: "Industry", match: "Serendipity Albums",
    images: { preview: { col: "Preview", i: 0 } } },
];

const SHOT = {
  googleAds: "Google Ads campaign dashboard",
  facebookAds: "Meta Ads Manager campaign dashboard",
  seo: "Google Search Console performance graph",
  wordpress: "Website screenshot",
};

/** Returns a raster file for an attachment: the file itself, or an image embedded in a PDF. */
async function rasterFor(view, att, spec) {
  const src = path.join(CACHE, view, att.file);
  if (!att.file.endsWith(".pdf")) return src;
  const prefix = src.replace(/\.pdf$/, "") + "-img";
  if (!(await readdir(path.dirname(src))).some((f) => f.startsWith(path.basename(prefix)))) {
    execFileSync("pdfimages", ["-png", src, prefix]);
  }
  const n = String(spec.pdfImage ?? 0).padStart(3, "0");
  const file = `${prefix}-${n}.png`;
  if (!existsSync(file)) throw new Error(`no embedded image ${n} in ${att.file}`);
  return file;
}

async function saveImage(input, outName, alt) {
  const { data, info } = await sharp(input)
    .resize({ width: MAX_W, withoutEnlargement: true })
    .webp({ quality: 85 })
    .toBuffer({ resolveWithObject: true });
  await writeFile(path.join(OUT, `${outName}.webp`), data);
  const blur = await sharp(data).resize(16).webp({ quality: 50 }).toBuffer();
  return {
    src: `/assets/portfolio/${outName}.webp`,
    width: info.width,
    height: info.height,
    alt,
    blurDataURL: `data:image/webp;base64,${blur.toString("base64")}`,
    bytes: data.length,
  };
}

/** Trims whitespace only; multi-select cells ("A,B") are shown as "A, B". */
const clean = (s) => (s ?? "").trim() || null;
const cleanList = (s) => clean((s ?? "").split(",").map((x) => x.trim()).filter(Boolean).join(", "));

async function curate() {
  await mkdir(OUT, { recursive: true });
  const items = [];
  for (const c of CURATED) {
    const rows = parseCsv(await readFile(path.join(CSV_DIR, `${c.view}.csv`), "utf8"));
    const ri = rows.findIndex((r) => (r[c.titleCol] || "").includes(c.match));
    if (ri < 0) throw new Error(`curated record not found: ${c.view} "${c.match}"`);
    const row = rows[ri];
    const index = JSON.parse(await readFile(path.join(CACHE, c.view, "_index.json"), "utf8"));
    const item = {
      id: c.id,
      category: c.category,
      title: clean(row[c.titleCol]),
      industry: c.industryCol ? cleanList(row[c.industryCol]) : null,
      objective: c.objectiveCol ? clean(row[c.objectiveCol]) : null,
      results: c.resultsCol ? clean(row[c.resultsCol]) : null,
      url: c.urlCol ? clean(row[c.urlCol]) : null,
      before: null,
      after: null,
      latest: null,
      preview: null,
      beforeLabel: null,
      afterLabel: null,
    };
    for (const [slot, spec] of Object.entries(c.images)) {
      const att = index.find((a) => a.row === ri && a.column === spec.col && a.i === spec.i);
      if (!att) throw new Error(`attachment not found: ${c.id} ${spec.col}[${spec.i}] (re-run without --curate?)`);
      const fileLabel = att.name.replace(/\.(png|jpe?g|webp|pdf|gif)$/i, "").trim();
      const label = spec.label ?? (/^(image|latest( data)?)$/i.test(fileLabel) ? null : fileLabel);
      const what = c.category === "wordpress" ? `${SHOT.wordpress} of ${item.title}` : SHOT[c.category];
      const alt = slot === "latest" ? `${what}, latest results` : label ? `${what}: ${label}` : what;
      const asset = await saveImage(await rasterFor(c.view, att, spec), `${c.id}-${slot}`, alt);
      console.log(`img  ${asset.src.padEnd(58)} ${String(asset.width + "x" + asset.height).padEnd(10)} ${(asset.bytes / 1024).toFixed(0).padStart(4)} KB  <- ${att.name}${spec.pdfImage != null ? ` [pdf image ${spec.pdfImage}]` : ""}`);
      delete asset.bytes;
      item[slot] = asset;
      if (slot === "before") item.beforeLabel = label;
      if (slot === "after") item.afterLabel = label;
    }
    items.push(item);
  }

  const file = path.join(ROOT, "src/content/portfolio.ts");
  const src = await readFile(file, "utf8");
  const start = src.indexOf("export const portfolio: PortfolioItem[] =");
  if (start < 0) throw new Error("portfolio export not found in portfolio.ts");
  const body = `export const portfolio: PortfolioItem[] = ${JSON.stringify(items, null, 2)};\n`;
  await writeFile(file, src.slice(0, start) + body);
  console.log(`\nwrote ${items.length} items to src/content/portfolio.ts`);
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const curateOnly = process.argv.includes("--curate");
  const exportOnly = process.argv.includes("--export");
  if (!curateOnly) await exportViews();
  if (!exportOnly) await curate();
}
