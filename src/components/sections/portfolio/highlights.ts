// Where the hand-drawn ring goes on each "after" screenshot. Each box is the area the original
// screenshot already marks with a red box (or, for Search Console graphs, the "Total clicks"
// tile the SEO result text refers to), in percent of the image's own width and height.
// Hand-measured by viewing each file in public/assets/portfolio/. No numbers are added: the ring
// only circles what the real screenshot shows. Items without an entry get no ring.

export type HighlightBox = { x: number; y: number; w: number; h: number };

export const highlights: Record<string, HighlightBox> = {
  // Google Ads: the "Total: Account" cost / conversions / cost-per-conversion cells.
  "google-ads-sell-your-car": { x: 56.4, y: 71.8, w: 16.6, h: 6.1 },
  "google-ads-shade-solutions": { x: 54.1, y: 90.7, w: 39.5, h: 6.4 },
  "google-ads-tax-wealth": { x: 64.5, y: 77.6, w: 21, h: 5 },
  // Facebook Ads: the cell that answers the stated objective (CPA, cost per purchase, results).
  "facebook-ads-fashion-boutique": { x: 58.6, y: 58.3, w: 8.5, h: 13 },
  "facebook-ads-np-education": { x: 88.8, y: 86.7, w: 6.1, h: 6.2 },
  "facebook-ads-telecom": { x: 50.8, y: 85.4, w: 13.4, h: 12.5 },
  // SEO: the "Total clicks" tile.
  "seo-dental-clinic": { x: 1, y: 21, w: 11, h: 15 },
  "seo-cosmetics-retailer": { x: 1.5, y: 25, w: 12, h: 16 },
  // This capture is cropped tighter (1046×342, no toolbar row), so its tile sits at the top.
  "seo-grocery-retailer": { x: 0.5, y: 2, w: 11.5, h: 21 },
};
