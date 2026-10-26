# WebIndia portfolio audit

Captured 2026-10-26. The four portfolio pages linked from the homepage (`/google-ads-portfolio/`, `/facebookads-portfolio/`, `/portfolio-seo/`, `/wp-portfolio/`) are WordPress shells. **The actual case studies live in embedded, publicly shared Airtable gallery views**, one per page and two on WordPress. Screenshots of each view are in this folder (`airtable-*.jpg`). The `*-full.jpg` screenshots show how the pages render without the embeds.

| Page | Airtable share | Records | What each record holds |
|---|---|---|---|
| Google Ads | `appufCVoCHUcKEyrx/shr7hV6aoaDJP9ar4` | 16 | One-line business description · Industry · **Before/After Results** (2 Google Ads dashboard screenshots, labelled e.g. "Aug 2023 - Before" / "Sept 2023 - After") · **Latest Results** (screenshot) |
| Facebook Ads | `appufCVoCHUcKEyrx/shrvt4mrvAO7Uwo8w` | 10 | Description · Industry · Before/After screenshots · **Objective** (e.g. "Increase Sale by 70% while keeping the CPA under $11") |
| SEO | `appufCVoCHUcKEyrx/shrPTkhQzglDAOr66` | 11+ | Description · Country/State · Platform · Industry · B2B/B2C · Before/After (Search Console graph screenshots) · **Goals** · **Results with numbers** (e.g. "organic traffic … from 321 to 1951", "E-commerce purchases grew by 310%, revenue soared by 360% in two months") |
| WordPress sites | `shr7twZbigImBsWUm` | 11+ | **Named client sites with live URLs** (Earth Ocean Food, Julie Blue, DD Drums, Serendipity Albums, Healthy Principles, Dent.Global, …) · multiple preview screenshots · theme · plugins · industry · payment gateway |
| WordPress landing pages | `appufCVoCHUcKEyrx/shrWqsVPk2ESbRM9l` | 5 | Abbotsford Dental Clinic, LILI'S Early Learning Centre, Patrice Lynn, Winston Churchill Heritage Fund, TG Marketing USA. Each has a URL and a **full-length page screenshot** (512 × 1,200–2,400px) |

## Notes

- **Ads clients are anonymous.** The records describe the business ("Luxury & Exotic Car Rental") and the screenshots have account names blurred. Only the WordPress records name clients.
- **Ad screenshots are real dashboards**, with red boxes highlighting the cost and conversion columns. They're good proof material, but low resolution (~1,000×512) and visually busy. Use them cropped and masked, not full-size.
- **The SEO "Results" text contains concrete figures.** They are the business's own claims. Treat them like the homepage stats and get sign-off before featuring them.
- **Airtable attachment URLs are signed and expire.** We can't hotlink them. Get originals from the business, or export the base (each view has "Download CSV") and download the attachments once into `public/`.
- **The live homepage portfolio section shows none of this**, only four category buttons.
- On these pages, the `h3` cards ("Southwest Minnesota Dental Group", "Northern Mini Storage", "Urban Solution Water Purifier", "Purelt Water Purifier", "Ikar", "Sunflow Media") are hidden flipbox widgets that didn't render. Ask whether they're current.

## How this maps to the reference's product-demo section (pattern C)

The reference shows its product in a framed panel with tabs. WebIndia's "product" is client results, so the panel works like this:

- **Tabs:** Google Ads · Facebook Ads · SEO · WordPress
- **Ads / SEO tabs:** a before → after result card. The two real screenshots sit in a bordered frame with a scrubbed or slider reveal. One highlighted metric is drawn on with the scribble-circle line (the red boxes become hand-drawn circles). Industry chip + objective/result line.
- **WordPress tab:** the full-length landing-page screenshots **auto-scroll inside a browser frame** (the classic "scrolling site preview"), with the site name and live URL.
- A few named WordPress sites become larger case-study cards with their real URLs.
