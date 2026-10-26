// Curated portfolio for the homepage tabs. Filled by scripts/fetch-portfolio.mjs from the
// public Airtable galleries (docs/live-audit/portfolio/README.md). Text fields are verbatim
// from Airtable; result figures are business claims pending sign-off, like stats.ts.

import type { Asset } from "./assets";

export type PortfolioCategory = "googleAds" | "facebookAds" | "seo" | "wordpress";

export type PortfolioItem = {
  id: string;
  category: PortfolioCategory;
  /** Airtable "Business Description" (Ads/SEO) or site name (WordPress). */
  title: string;
  industry: string | null;
  /** Facebook "Objective" / SEO "Goals". */
  objective: string | null;
  /** SEO "Results". */
  results: string | null;
  /** WordPress live URL. */
  url: string | null;
  before: Asset | null;
  after: Asset | null;
  latest: Asset | null;
  /** WordPress full-page screenshot for the auto-scrolling browser frame. */
  preview: Asset | null;
  /** Airtable attachment captions, e.g. "Aug 2023 - Before". */
  beforeLabel: string | null;
  afterLabel: string | null;
};

export const portfolioHeading = "Portfolio";

// Labels and links are the live homepage's portfolio buttons.
export const portfolioTabs: { key: PortfolioCategory; label: string; href: string }[] = [
  { key: "googleAds", label: "Google Ads", href: "https://www.webindiainc.com/google-ads-portfolio/" },
  { key: "facebookAds", label: "Facebook Ads", href: "https://www.webindiainc.com/facebookads-portfolio/" },
  { key: "seo", label: "SEO", href: "https://www.webindiainc.com/portfolio-seo/" },
  { key: "wordpress", label: "WordPress", href: "https://www.webindiainc.com/wp-portfolio/" },
];

export const portfolio: PortfolioItem[] = [
  {
    "id": "google-ads-sell-your-car",
    "category": "googleAds",
    "title": "Sell your car online",
    "industry": "Automobile",
    "objective": null,
    "results": null,
    "url": null,
    "before": {
      "src": "/assets/portfolio/google-ads-sell-your-car-before.webp",
      "width": 1400,
      "height": 670,
      "alt": "Google Ads campaign dashboard: July 2023 - Before",
      "blurDataURL": "data:image/webp;base64,UklGRjYAAABXRUJQVlA4ICoAAACwAQCdASoQAAgAAsBMJaQAAueFB8+gAP7z8WyZvLzn+6imo9wuB5AAAAA="
    },
    "after": {
      "src": "/assets/portfolio/google-ads-sell-your-car-after.webp",
      "width": 1365,
      "height": 638,
      "alt": "Google Ads campaign dashboard: Aug 2023 - After",
      "blurDataURL": "data:image/webp;base64,UklGRjYAAABXRUJQVlA4ICoAAACQAQCdASoQAAcAAsBMJaQAAudP5GAA/vVB26RIpUXxYf50pcjYTvAAAAA="
    },
    "latest": {
      "src": "/assets/portfolio/google-ads-sell-your-car-latest.webp",
      "width": 1400,
      "height": 821,
      "alt": "Google Ads campaign dashboard, latest results",
      "blurDataURL": "data:image/webp;base64,UklGRjQAAABXRUJQVlA4ICgAAACwAQCdASoQAAkAAsBMJZwAAueFCMiAAP71QdslLaH9u0zDc50xwcAA"
    },
    "preview": null,
    "beforeLabel": "July 2023 - Before",
    "afterLabel": "Aug 2023 - After"
  },
  {
    "id": "google-ads-shade-solutions",
    "category": "googleAds",
    "title": "One-Stop Shop for Shade Solutions",
    "industry": "Home Improvement",
    "objective": null,
    "results": null,
    "url": null,
    "before": {
      "src": "/assets/portfolio/google-ads-shade-solutions-before.webp",
      "width": 1400,
      "height": 644,
      "alt": "Google Ads campaign dashboard: Aug 2023 - Before",
      "blurDataURL": "data:image/webp;base64,UklGRjIAAABXRUJQVlA4ICYAAACwAQCdASoQAAcAAsBMJZwAAud8PkqAAP71QdukSKVESk6/TQ4AAA=="
    },
    "after": {
      "src": "/assets/portfolio/google-ads-shade-solutions-after.webp",
      "width": 1400,
      "height": 655,
      "alt": "Google Ads campaign dashboard: Sept 2023 - After",
      "blurDataURL": "data:image/webp;base64,UklGRjIAAABXRUJQVlA4ICYAAACwAQCdASoQAAcAAsBMJZwAAueFvEVoAP72Y99P35+dcB0JEuKgAA=="
    },
    "latest": {
      "src": "/assets/portfolio/google-ads-shade-solutions-latest.webp",
      "width": 1400,
      "height": 640,
      "alt": "Google Ads campaign dashboard, latest results",
      "blurDataURL": "data:image/webp;base64,UklGRjQAAABXRUJQVlA4ICgAAACwAQCdASoQAAcAAsBMJaQAAud/6X2AAP71B876BFLWvAfdz+LSAAAA"
    },
    "preview": null,
    "beforeLabel": "Aug 2023 - Before",
    "afterLabel": "Sept 2023 - After"
  },
  {
    "id": "google-ads-tax-wealth",
    "category": "googleAds",
    "title": "Helps with tax preparation and filing and wealth management",
    "industry": "Finance",
    "objective": null,
    "results": null,
    "url": null,
    "before": {
      "src": "/assets/portfolio/google-ads-tax-wealth-before.webp",
      "width": 1400,
      "height": 702,
      "alt": "Google Ads campaign dashboard: June 2023 - Before",
      "blurDataURL": "data:image/webp;base64,UklGRjQAAABXRUJQVlA4ICgAAACQAQCdASoQAAgAAsBMJaQAAudLLQAA/vZj30+a8MTYwSaUBK50AAAA"
    },
    "after": {
      "src": "/assets/portfolio/google-ads-tax-wealth-after.webp",
      "width": 1400,
      "height": 702,
      "alt": "Google Ads campaign dashboard: July 2023 - After",
      "blurDataURL": "data:image/webp;base64,UklGRjQAAABXRUJQVlA4ICgAAACwAQCdASoQAAgAAsBMJaQAAudMS/QAAP72Y99PmvDE7ADKAf78/wAA"
    },
    "latest": {
      "src": "/assets/portfolio/google-ads-tax-wealth-latest.webp",
      "width": 1400,
      "height": 702,
      "alt": "Google Ads campaign dashboard, latest results",
      "blurDataURL": "data:image/webp;base64,UklGRjIAAABXRUJQVlA4ICYAAACQAQCdASoQAAgAAsBMJaQAAudYugAA/vZj30+ZwVx0NM+G2bhgAA=="
    },
    "preview": null,
    "beforeLabel": "June 2023 - Before",
    "afterLabel": "July 2023 - After"
  },
  {
    "id": "facebook-ads-fashion-boutique",
    "category": "facebookAds",
    "title": "SuElle Boutique is an Australian based online brand, providing  high end modern fashion in exclusive fabrics and designs.",
    "industry": "Clothing & Apparel",
    "objective": "Increase Sale by 70% while keeping the CPA under $11",
    "results": null,
    "url": null,
    "before": {
      "src": "/assets/portfolio/facebook-ads-fashion-boutique-before.webp",
      "width": 1056,
      "height": 466,
      "alt": "Meta Ads Manager campaign dashboard: Nov 2023-Before",
      "blurDataURL": "data:image/webp;base64,UklGRjQAAABXRUJQVlA4ICgAAACwAQCdASoQAAcAAsBMJaQAAudJz+gAAP71B8oA42m8w1HtIgaTdgAA"
    },
    "after": {
      "src": "/assets/portfolio/facebook-ads-fashion-boutique-after.webp",
      "width": 1053,
      "height": 460,
      "alt": "Meta Ads Manager campaign dashboard: Dec 2023 - After",
      "blurDataURL": "data:image/webp;base64,UklGRjgAAABXRUJQVlA4ICwAAADQAQCdASoQAAcAAsBMJaQAAup5zABoAAD+9QfKAzVj/Awiky9sAq46doAAAA=="
    },
    "latest": null,
    "preview": null,
    "beforeLabel": "Nov 2023-Before",
    "afterLabel": "Dec 2023 - After"
  },
  {
    "id": "facebook-ads-np-education",
    "category": "facebookAds",
    "title": "Provides nurse practitioners with continuing education courses",
    "industry": "Medical & Healthcare Education",
    "objective": "Bring CPA under $20 and Increase conversion value",
    "results": null,
    "url": null,
    "before": {
      "src": "/assets/portfolio/facebook-ads-np-education-before.webp",
      "width": 1366,
      "height": 641,
      "alt": "Meta Ads Manager campaign dashboard: December 2023 - Before",
      "blurDataURL": "data:image/webp;base64,UklGRjQAAABXRUJQVlA4ICgAAADQAQCdASoQAAgAAsBMJaQAAxe596XWiAD++XUMMGoyT8ETRuKWIAAA"
    },
    "after": {
      "src": "/assets/portfolio/facebook-ads-np-education-after.webp",
      "width": 1366,
      "height": 641,
      "alt": "Meta Ads Manager campaign dashboard: Jan 2024 - After",
      "blurDataURL": "data:image/webp;base64,UklGRjQAAABXRUJQVlA4ICgAAACwAQCdASoQAAgAAsBMJaQAAxe5vum0AP75dQwwaSE3kADW0urEAAAA"
    },
    "latest": null,
    "preview": null,
    "beforeLabel": "December 2023 - Before",
    "afterLabel": "Jan 2024 - After"
  },
  {
    "id": "facebook-ads-telecom",
    "category": "facebookAds",
    "title": "Free Internet Service Provider in the United States.",
    "industry": "Telecom",
    "objective": "To receive as many form submissions as possible without an increased CPL was the goal.",
    "results": null,
    "url": null,
    "before": {
      "src": "/assets/portfolio/facebook-ads-telecom-before.webp",
      "width": 1400,
      "height": 470,
      "alt": "Meta Ads Manager campaign dashboard: 1st July - 31st July (Before)",
      "blurDataURL": "data:image/webp;base64,UklGRjQAAABXRUJQVlA4ICgAAADQAQCdASoQAAUAAsBMJaQAAxe592BtAAD++OyQBXUs0NUOAt40m8AA"
    },
    "after": {
      "src": "/assets/portfolio/facebook-ads-telecom-after.webp",
      "width": 1400,
      "height": 472,
      "alt": "Meta Ads Manager campaign dashboard: 1st Aug - 31st Aug (After)",
      "blurDataURL": "data:image/webp;base64,UklGRjQAAABXRUJQVlA4ICgAAACwAQCdASoQAAUAAsBMJZwAAxe53x/IAP747JQgsiSKxSv8Ntj/egAA"
    },
    "latest": null,
    "preview": null,
    "beforeLabel": "1st July - 31st July (Before)",
    "afterLabel": "1st Aug - 31st Aug (After)"
  },
  {
    "id": "seo-dental-clinic",
    "category": "seo",
    "title": "A dental clinic with 6 locations",
    "industry": "Dental Clinic",
    "objective": "The objective of the website was to boost organic traffic, increase click-through rates, organic traffic as well as number of conversions.",
    "results": "Clicks surged from 11.3K to 75.2K, organic traffic experienced a remarkable growth from 2,251 to 22,579,, and the conversions increased by 37.85%",
    "url": null,
    "before": {
      "src": "/assets/portfolio/seo-dental-clinic-before.webp",
      "width": 1051,
      "height": 430,
      "alt": "Google Search Console performance graph: Pre-Project Clicks and Impressions Data: Six Months Analysis",
      "blurDataURL": "data:image/webp;base64,UklGRjgAAABXRUJQVlA4ICwAAADQAQCdASoQAAcAAsBMJZQAAsaWU238AAD+7enfwUaeB5pyyfB8Nbd+JsAAAA=="
    },
    "after": {
      "src": "/assets/portfolio/seo-dental-clinic-after.webp",
      "width": 1051,
      "height": 432,
      "alt": "Google Search Console performance graph: Post-Project Clicks and Impressions Data: Six Months Analysis",
      "blurDataURL": "data:image/webp;base64,UklGRjYAAABXRUJQVlA4ICoAAACQAQCdASoQAAcAAsBMJZQAAsaUdtAA/u3p38FGngdqpgLgZ2fwMAAAAAA="
    },
    "latest": null,
    "preview": null,
    "beforeLabel": "Pre-Project Clicks and Impressions Data: Six Months Analysis",
    "afterLabel": "Post-Project Clicks and Impressions Data: Six Months Analysis"
  },
  {
    "id": "seo-cosmetics-retailer",
    "category": "seo",
    "title": "An online cosmetics retailer specializing in high-quality nail salon supplies, offering a vast array of gel nail products and other beauty essentials.",
    "industry": "Fashion & Lifestyle",
    "objective": "The website aims to drive E-commerce sales, increase clicks, boost organic traffic, secure a top 10 position for targeted keywords, and enhance overall online visibility and engagement.",
    "results": "WebIndia Inc.'s SEO strategy delivered impressive results: Clicks increased by 7.6% (26.2K to 28.2K), E-commerce purchases grew by 310%, and revenue soared by 360% in two months. The website now holds a top 10 position for 1725 organic keywords, showcasing the effectiveness of our SEO efforts in enhancing online visibility.",
    "url": null,
    "before": {
      "src": "/assets/portfolio/seo-cosmetics-retailer-before.webp",
      "width": 1002,
      "height": 466,
      "alt": "Google Search Console performance graph: Clicks and Impressions in the initial six months of SEO implementation",
      "blurDataURL": "data:image/webp;base64,UklGRkAAAABXRUJQVlA4IDQAAADQAQCdASoQAAcAAsBMJYwC7AEf3ZOVAAD+6yefw46UtjHRlL6flVgAFTt/HRxbAqv8AAAA"
    },
    "after": {
      "src": "/assets/portfolio/seo-cosmetics-retailer-after.webp",
      "width": 1006,
      "height": 471,
      "alt": "Google Search Console performance graph: Clicks & Impressions Data: Six Months Later",
      "blurDataURL": "data:image/webp;base64,UklGRkAAAABXRUJQVlA4IDQAAACwAQCdASoQAAcAAsBMJYwAAvadNPWgAP7rJ5/DjpS3WZnZDcmBit41m9TwsPQHqUHafAAA"
    },
    "latest": null,
    "preview": null,
    "beforeLabel": "Clicks and Impressions in the initial six months of SEO implementation",
    "afterLabel": "Clicks & Impressions Data: Six Months Later"
  },
  {
    "id": "seo-grocery-retailer",
    "category": "seo",
    "title": "An online grocery retailer based in Illinois.",
    "industry": "Online Grocery Retailer",
    "objective": "The website aimed to boost conversions, revenue, clicks, and website visiblity in SERPs",
    "results": "The number of conversions increased from 117 to 1762, their revenue increased by 884% and the clicks increased by 72.64% in just six months.",
    "url": null,
    "before": {
      "src": "/assets/portfolio/seo-grocery-retailer-before.webp",
      "width": 1054,
      "height": 433,
      "alt": "Google Search Console performance graph: Clicks and Impressions Data From Jan to June: Six Month Analysis",
      "blurDataURL": "data:image/webp;base64,UklGRjgAAABXRUJQVlA4ICwAAACQAQCdASoQAAcAAsBMJZQAAsfyZoAA/u3p38FGngdqpg3CVXL9nnfibAAAAA=="
    },
    "after": {
      "src": "/assets/portfolio/seo-grocery-retailer-after.webp",
      "width": 1046,
      "height": 342,
      "alt": "Google Search Console performance graph: Clicks and Impressions Data From July to Dec: Six Month Analysis",
      "blurDataURL": "data:image/webp;base64,UklGRjYAAABXRUJQVlA4ICoAAACwAQCdASoQAAUAAsBMJZQAAxeeBdMAAP7yPnxtIElRb50BP/ghSBoAAAA="
    },
    "latest": null,
    "preview": null,
    "beforeLabel": "Clicks and Impressions Data From Jan to June: Six Month Analysis",
    "afterLabel": "Clicks and Impressions Data From July to Dec: Six Month Analysis"
  },
  {
    "id": "wordpress-abbotsford-dental",
    "category": "wordpress",
    "title": "Abbotsford Dental Clinic",
    "industry": null,
    "objective": null,
    "results": null,
    "url": "https://www.dentistabbotsford.com.au/abbotsford-dental-clinic/",
    "before": null,
    "after": null,
    "latest": null,
    "preview": {
      "src": "/assets/portfolio/wordpress-abbotsford-dental-preview.webp",
      "width": 1400,
      "height": 3260,
      "alt": "Website screenshot of Abbotsford Dental Clinic: screencapture-dentistabbotsford-au-abbotsford-dental-clinic-2019-07-11-12_57_53",
      "blurDataURL": "data:image/webp;base64,UklGRuIAAABXRUJQVlA4INYAAAAQBQCdASoQACUAPr1Mn0unJCKhtUgA4BeJbACdEfwN0Ce7R/eI8+mw6yKkWSA3B5loAP7UiIn+h2sg7/DqvN+KTCrADmJm4d8yPiyOPYCQBIH16s6+ZPevimmUenVa5+TdqNvZ5bc7Uqs0r5Tvug4IlDTcR8MJmDqwItHmEda5gkEWCr2eVJtDu7nfAHmuJEzQDvp09MxW7ARHNeAZN7pawb1f5eec43/wbkYmMbJOW/bYeDVoCq1hPef7deZ9x5Ve8Z1hkAT4A0kdQRM5N/mnrNPNAAAA"
    },
    "beforeLabel": null,
    "afterLabel": null
  },
  {
    "id": "wordpress-lilis-early-learning",
    "category": "wordpress",
    "title": "LILI’S Early Learning Centre",
    "industry": null,
    "objective": null,
    "results": null,
    "url": "https://www.hopperscrossingchildcare.com.au/lilis-early-learning-centre/",
    "before": null,
    "after": null,
    "latest": null,
    "preview": {
      "src": "/assets/portfolio/wordpress-lilis-early-learning-preview.webp",
      "width": 1400,
      "height": 4495,
      "alt": "Website screenshot of LILI’S Early Learning Centre: screencapture-hopperscrossingchildcare-au-lilis-early-learning-centre-2019-07-05-16_21_54-1",
      "blurDataURL": "data:image/webp;base64,UklGRiwBAABXRUJQVlA4ICABAADQBgCdASoQADMAPtFYpUyoJSOiKA1RABoJZACdM1jsrSrtGNv/QO4ALMToA0ziLF0J2J705APwVbRanLiWGAAA/t4Yq8YF7FIyYbR6qZNH29ED6vD26yNXcc9zmri5XFImhr42OYC8W0h5nshzA8jmCG4mC29C02o3WmshY62pNd+FpTfV53eLIgdF6UQUTje3yD8GD9y1jW19IYVMvQj8zaMqi2UNqXFdo31inxt13P2iNxsGSSRuSzK9+TD1pZxNNcMQjJKjsTWzKftRDSj8EUiKLramRVy9suq8Fzfa7ozA3Rhr8ShDbnBvtyplPRwb/7htIZI2W+Bvr6W85Yr8oHLpvyb1KfKgFk+M/tTtS07Uv/ow//40j/8aR8poAAA="
    },
    "beforeLabel": null,
    "afterLabel": null
  },
  {
    "id": "wordpress-serendipity-albums",
    "category": "wordpress",
    "title": "Serendipity Albums",
    "industry": "Photography, Online Shop",
    "objective": null,
    "results": null,
    "url": "https://www.salbums.com/",
    "before": null,
    "after": null,
    "latest": null,
    "preview": {
      "src": "/assets/portfolio/wordpress-serendipity-albums-preview.webp",
      "width": 1400,
      "height": 730,
      "alt": "Website screenshot of Serendipity Albums: salbums_com_reqx90jkcwn6",
      "blurDataURL": "data:image/webp;base64,UklGRk4AAABXRUJQVlA4IEIAAADQAQCdASoQAAgAAsBMJZQAAueJJJP5wAD+8zgERiZcbvZ9raaqre+Ny4P5h0/XS2PzQqeVzwD3bHHCUetjiOHSzAA="
    },
    "beforeLabel": null,
    "afterLabel": null
  }
];
