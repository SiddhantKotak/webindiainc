// Generated from docs/live-audit/homepage-fulltext.json — copy is verbatim from the live
// homepage (captured 2026-10-26). Edit wording only with business approval.

import type { LineIconName } from "@/components/lines/line-icon";

// `key` doubles as the service's line-icon name, so a new service needs a matching icon.
export type Service = { key: LineIconName; title: string; blurb: string; href: string | null };

export const servicesHeading = "Our Digital Marketing Services";

export const servicesIntro = "As a best digital marketing company, our dedicated team and lightning-fast communication make us a dynamic digital marketing and web development agency. From Google Ads management to WordPress development, there’s nothing our experts can’t handle!";

// Live title for WordPress is spelled "Wordpress"; shown with the brand's casing.
// Amazon Ads has no single service page on the live site, so it has no link.
export const services: Service[] = [
  {
    "key": "googleAds",
    "title": "Google Ads",
    "blurb": "Our Certified Google Ads Professionals can crack any Google Ads puzzle to give you the best possible ROI.",
    "href": "https://www.webindiainc.com/google-ads/"
  },
  {
    "key": "bingAds",
    "title": "Bing Ads",
    "blurb": "Our strategically created Bing Ads campaigns increase your profits and brand value.",
    "href": "https://www.webindiainc.com/bing-ads/"
  },
  {
    "key": "facebookAds",
    "title": "Facebook Ads",
    "blurb": "Make the most popular social networking site your ally to beat the competition.",
    "href": "https://www.webindiainc.com/facebook-ads-agency/"
  },
  {
    "key": "seo",
    "title": "SEO",
    "blurb": "Our SEO Experts follow an adaptable SEO Strategy, a broad approach to SEO & emphasizing on conversions!",
    "href": "https://www.webindiainc.com/seo-agency/"
  },
  {
    "key": "wordpress",
    "title": "WordPress",
    "blurb": "A-Z Solutions for WordPress Development, WordPress website maintenance keeping your website speedy, secure, and performing all the time.",
    "href": "https://www.webindiainc.com/wordpress-development/"
  },
  {
    "key": "amazonAds",
    "title": "Amazon Ads",
    "blurb": "Make your products reach out to thousands of global customers with an optimized and measurable PPC campaign.",
    "href": null
  }
];
