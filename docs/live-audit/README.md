# Live homepage audit — https://www.webindiainc.com/

Captured 2026-10-26 with Playwright (1440×900 viewport, scrolled through the whole page so lazy-loaded sections rendered). Copy below is **verbatim** from the live page. Raw extracts are in this folder:

- `homepage-desktop-full.jpg`: full-page screenshot
- `homepage-fulltext.json`: full page text, FAQ text and every image URL
- `homepage-sections.json`: section-level text and links, plus the footer

This file corrects `content.md` where the two disagree. Business sign-off is still needed before publishing any figure (see "Discrepancies").

## Current site facts

- **Platform:** WordPress + Bricks builder, jQuery, Swiper, many plugins. Served via `cdn.webindiainc.com`, with ShortPixel used for some images.
- **Trackers:** GA/gtag, GTM, Microsoft Clarity, two Google Ads conversion tags, Burst Statistics, Cloudflare Insights. The redesign needs the same tracking IDs from the business. Don't copy them from the page source.
- **Performance at capture:** TTFB ≈ 2.2 s, load ≈ 4.5 s, 131 requests, ≈ 700 KB transferred.
- **Typography:** Proxima Nova for everything.
- **Colors in use:** navy `#081424` (dark sections, hero), blue `#0048A9`, orange `#FF6600` (accent text, e.g. "Edge"), yellow `#FFD64F` (hero highlight box), `#202B39`, greys `#363636` / `#F5F5F5` / `#E0E0E0`.
- **Page length:** ≈ 7,800 px at desktop.

## Sections and copy (in page order)

### Header
Logo · About Us (About Us, Our Culture, Our Team, Our Values) · Development (Shopify ×5, WordPress ×8 sub-services) · SEM (Google Ads, Remarketing, Display Advertising, Full PPC Management Service, PPC Outsourcing, Paid Search Marketing, Facebook Ads Agency, Bing Ads, Amazon ×5) · SEO (On Page, Off Page, E-Commerce SEO, Local Business SEO, Hire An SEO Expert, Search Engine Optimization) · Premium Services (White Label Services, Google Partner Agency) · Portfolio (Google Ads, Facebook Ads, SEO, WordPress) · Contact · Careers · CTA **"Let's Connect"** → `/contact-us/`. Every URL is in `homepage-sections.json`.

### Hero
- H1: **Performance-First / Digital Marketing Agency** ("Digital Marketing Agency" sits in a yellow-outlined box)
- Sub: "Transform Your Business with Results-Driven Digital Marketing Services from a Google Premier Partner"
- Platform pills: Google · Facebook · Amazon · Bing · WordPress · Shopify
- Review badges: **Upwork 680+ reviews · Google 162+ reviews · Trustpilot 42+ reviews**, each with 5 stars

### Google Premier Partner
"As a Google Premier Partner, We Have an **Edge** in PPC Management."
"We have earned the status of a Google Premier Partner with our performance and experience in Google Ads management. It's rare for a digital marketing agency to have this honor! This proves that we have delivered highly profitable campaigns for our clients over a substantial period."
Badge: Google Partner, Premier 2026 (`PremierPartner-CMYK-Clickable.svg`). Capabilities: Google Search, Google Analytics, Google Shopping, Display Ads, Mobile Campaign, Video Advertising.

### Our Digital Marketing Services
Intro: "As a best digital marketing company, our dedicated team and lightning-fast communication make us a dynamic digital marketing and web development agency. From Google Ads management to WordPress development, there's nothing our experts can't handle!"
- **Google Ads:** Our Certified Google Ads Professionals can crack any Google Ads puzzle to give you the best possible ROI.
- **Bing Ads:** Our strategically created Bing Ads campaigns increase your profits and brand value.
- **Facebook Ads:** Make the most popular social networking site your ally to beat the competition.
- **SEO:** Our SEO Experts follow an adaptable SEO Strategy, a broad approach to SEO & emphasizing on conversions!
- **Wordpress:** A-Z Solutions for WordPress Development, WordPress website maintenance keeping your website speedy, secure, and performing all the time.
- **Amazon Ads:** Make your products reach out to thousands of global customers with an optimized and measurable PPC campaign.

Note: the inline links in these blurbs mostly point to unrelated blog posts, not service pages. Link to the service URLs from the header nav instead.

### Why Choose WebIndia Inc.
"Choose WebIndia Inc. for unmatched digital marketing expertise. Our team, each with over a decade of experience, excels in Google Ads, SEO, and e-commerce solutions, ensuring your business thrives online."
"As a top digital marketing agency in India with a global reach, we prioritize your success by offering transparent, innovative, and evolving strategies tailored to your unique needs. Let's collaborate to turn your digital aspirations into reality, fostering remarkable growth and setting new benchmarks in your industry."
Proof points: Customer Focused Organization (Your Success Drives Everything We Do) · 60+ Google Certified Experts Inhouse (Industry-Leading Talent On Every Project) · 1563+ Projects Managed Since Inception (Proven Track Record Of Delivering Results)

### Dedicated team
"A dedicated team of PPC and web development experts". Two paragraphs are in `homepage-fulltext.json`. Image: "Webindia Anniversary With the Founders and Partners" (`2024/03/Mask-group-3-1.png`).

### Values (4)
- **We Are Defined By Success:** "As a top digital marketing company, WebIndia Inc. runs on results. We've ensured the highest success for all the PPC campaigns worldwide. We deliver meaningful results within the first month and further optimize the ad campaign for even better conversions."
- **We Have A Strong Work Ethic:** "Complete transparency is the foundation of our working relationships. We understand the end goal of our internet marketing services and pay attention to the unique requirements of your business. As a best digital marketing firm, we're dedicated to your success."
- **We Are Certified Experts:** "With over 16 years of experience, we're industry leaders in internet marketing and website development. We employ Google-certified Ads specialists to lead our teams and drive growth. The Google Partner badge is a recognition of our expertise as a digital marketing agency."
- **We Value Your Vision:** "We work with complete sincerity and diligence. As a digital marketing and web development agency, we provide round-the-clock support and quick communication to our clients. Our work is driven by tremendous respect for your time and money."

### Our Strengths (counters)
| Value | Label | Sub-copy |
|---|---|---|
| 16+ | Years Of Experience | Proven track record of delivering exceptional digital marketing results |
| 125+ | Workforce | Talented team of specialists across all digital disciplines |
| 92% | Client Retention | *(live site repeats the Workforce sub-copy, which is a copy bug)* |
| 60+ | Ads Certified Experts | Google-certified professionals managing your campaigns |
| 1431 | Clients Served | Businesses worldwide trust us for their digital growth |

### Testimonials
- **Keira Geary Marcinowski**, CEO, Fungiguruskincare, USA. "Great Team With Quick Response Time". *WebIndia has helped my client and my own brand reach new customers via Google Ads. I have also used them on occasion for SEO and am happy with that experience as well.*
- **Tara**, CEO, Simpleday Solutions, Israel. "WebIndia Is A Great Company, Highly Recommend!" *They were super communicative and proactive in their work. They brought in the desired results and were always working on expanding our campaigns to do even better.*
- **Tobias**, Founder, Freegreen Academy, Germany. "Very Professional Team! Great Communication!" *Guided us through every step. Very responsive & great experience with increasing results. Would not hesitate to recommend them. We will work a very long time with WebIndia.*

Photos: `2024/03/1.png`, `2024/03/Tara-Horn.png`, `2024/03/2.png`.

### Advantages of Working With Us (8)
Google Certified Experts · Reliability · Transparency · Stable Growth · On-Time Delivery · Unique Solutions · Efficiency · 24/7 Assistance. Each has a one-line description, verbatim in `homepage-fulltext.json`. Several overlap with the Values section; content.md marks these for consolidation.

### Portfolio
Four category links only: Google Ads → `/google-ads-portfolio/`, Facebook Ads → `/facebookads-portfolio/`, SEO → `/portfolio-seo/`, WordPress → `/wp-portfolio/`. **The homepage shows no project imagery.** Real case-study content has to come from those pages or from the business.

### Featured On & Certifications (carousel)
Google Premier Partner badge, Trustpilot, DesignRush Verified Agency, AP News, Influencer Marketing Hub, "Best SEO" badge, Bing Ads, Clutch.

### FAQ (8 questions, full answers in `homepage-fulltext.json`)
1. Why is digital marketing important for businesses?
2. Is digital marketing worth it?
3. Who needs digital marketing services?
4. How much does digital marketing cost?
5. How to choose a digital marketing agency?
6. How do you measure and report the success of digital marketing campaigns?
7. Where does WebIndia Inc. provide digital marketing services?
8. What makes WebIndia Inc. different from other digital marketing agencies?

### Final CTA (sits inside the footer on the live site)
"Let's Make Your Digital Dreams a Reality!" / "Let's work together to achieve your goals. We're as committed to your success as you are. Together, we can unlock greater profits through strategic digital marketing." / **Get Started Today** → `/contact-us/`

### Footer
Tagline: "From Web Development To Lead Generation, WebIndia Inc. Is A 360 Degree Digital Solutions Provider. Let's Talk, Join Hands & Create A Better Business Together."
- Important links: White Label Services, Google Ads, Facebook Ads Agency, WordPress Development, Search Engine Optimization, Shopify E-Commerce Development
- Useful links: Home, About Us, Blog, Careers, Contact
- Contact: contact@webindiainc.com · 9th Floor, Lilamani Corporate Heights, Opp Ramapir Tekro BRTS Stop, Nava Vadaj, Ahmedabad, Gujarat 380013 · Make Payment → `/make-payment/`
- Social: Facebook `/webindiainc/`, Instagram `/webindia_inc/`, Twitter `/webindiainc`, LinkedIn `/company/webindia-inc`
- Legal: Copyright 2026 © WebIndia Inc. · Privacy Policy · Terms & Conditions

## Discrepancies to resolve with the business

- **Projects vs clients:** "1563+ Projects Managed" (Why Choose) vs "1431 Clients Served" (Strengths). These are different metrics; confirm both.
- **125+ workforce and 92% retention:** not in content.md. They appear only on the live page.
- **Client Retention sub-copy:** duplicated from Workforce on the live site.
- **Review counts (680+ / 162+ / 42+):** confirm the counts and link each to its source profile.
- **Shopify:** appears in the hero pills, nav and footer but not in the services grid. Decide whether it becomes a homepage service.
