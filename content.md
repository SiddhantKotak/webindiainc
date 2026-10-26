# WebIndia Inc. Homepage Redesign — Content Inventory

**Website:** https://www.webindiainc.com/  
**Scope:** Homepage only  
**Design direction:** Awwwards-inspired UI/UX with purposeful motion and interaction  
**Purpose of this document:** Preserve the current homepage's key business content and identify what to reuse, rewrite, redesign, and verify.

> **Audit note:** This started as a planning inventory based on publicly indexed content. On 2026-10-26 it was updated from a Playwright audit of the live page. **Verbatim copy, links, asset URLs and screenshots are in `docs/live-audit/README.md`.** Use that file as the copy source. Verify statistics, testimonials and certification claims with the business before launch.

---

## 1. Homepage structure — estimated 16 major sections

1. Header / Navigation
2. Hero section
3. Trust and platform logos
4. Google Premier Partner / PPC credibility
5. Digital marketing services
6. Why Choose WebIndia Inc.
7. Dedicated expert team
8. Company values
9. Our Strengths — statistics
10. Client testimonials
11. Advantages of working with us
12. Portfolio
13. Featured on / certifications
14. FAQ
15. Final CTA
16. Footer

The live audit confirmed this order. Live-page details:
- **Hero:** H1 "Performance-First / Digital Marketing Agency", sub-line "Transform Your Business with Results-Driven Digital Marketing Services from a Google Premier Partner", platform pills (Google, Facebook, Amazon, Bing, WordPress, Shopify) and review badges (Upwork 680+, Google 162+, Trustpilot 42+). Sections 2 and 3 are combined into the hero on the live site.
- **Partner section:** six Google capability icons (Search, Analytics, Shopping, Display Ads, Mobile Campaign, Video Advertising) and the Premier 2026 badge.
- **Dedicated team:** uses the photo "Webindia Anniversary With the Founders and Partners".
- **Final CTA:** sits inside the footer on the live site.
- **Header navigation:** a mega-menu with About Us, Development (Shopify + WordPress), SEM (Google/Bing/Facebook/Amazon), SEO, Premium Services (White Label, Google Partner Agency), Portfolio, Contact and Careers, plus the CTA "Let's Connect".

---

## 2. Content to retain

### Brand positioning
- Digital marketing and web development agency.
- Performance-focused marketing and business growth positioning.
- Client-focused strategies and digital solutions.

### Services
Retain the services currently promoted on the website, and verify their current names and destinations:
- Google Ads
- Bing Ads
- Facebook Ads
- Search Engine Optimization (SEO)
- WordPress development
- Amazon Ads

Shopify (e-commerce development, theme customization, marketing, SEO) appears in the hero pills, header nav and footer, but **not** in the homepage services list. Decide whether it becomes a homepage service.

### Trust and credibility
- Review badges in the hero: **Upwork 680+**, **Google 162+**, **Trustpilot 42+** (5 stars each). Confirm the counts and link each to its source profile.
- Featured On & Certifications carousel: Google Premier Partner, Trustpilot, DesignRush Verified Agency, AP News, Influencer Marketing Hub, "Best SEO" badge, Bing Ads, Clutch.
- Google Premier Partner positioning/status (verify current status and approved badge assets).
- Platform associations and logos shown on the website.
- Review and rating indicators (verify the current source, score, and review count).
- Certifications and third-party credibility assets (verify validity and usage rights).

### Company values and benefits
The current content communicates themes including:
- Results and success
- Strong work ethic
- Certified experts
- Client vision and tailored strategies
- Reliability
- Transparency
- Growth
- On-time delivery
- Efficiency
- Communication and support

### Company statistics
The homepage promotes statistics related to:
- Years of experience
- Workforce / expert team
- Client retention
- Certified experts
- Projects managed / clients served

Figures on the live page (audited 2026-10-26):

| Figure | Where it appears |
|---|---|
| 16+ Years Of Experience | Strengths, Values, meta description |
| 125+ Workforce | Strengths |
| 92% Client Retention | Strengths (its sub-copy duplicates Workforce's, a live-site bug) |
| 60+ (Google) Ads Certified Experts | Strengths, Why Choose |
| 1431 Clients Served | Strengths |
| 1563+ Projects Managed Since Inception | Why Choose |

Treat these as **unverified until the business approves them**. In particular, confirm 1563+ projects vs 1431 clients, which are different metrics.

### Testimonials
Live testimonials (each has a headline and a quote; the quotes are verbatim in `docs/live-audit/README.md`):
- **Keira Geary Marcinowski**, CEO, Fungiguruskincare, USA. "Great Team With Quick Response Time"
- **Tara**, CEO, Simpleday Solutions, Israel. "WebIndia Is A Great Company, Highly Recommend!"
- **Tobias**, Founder, Freegreen Academy, Germany. "Very Professional Team! Great Communication!"

Each has a portrait photo on the live site. Confirm permission before reuse. Do not paraphrase the quotes.

### Portfolio
Retain real project examples currently shown, potentially organized by:
- Google Ads
- Facebook Ads
- SEO
- WordPress

Use genuine project visuals and factual outcomes only. Do not fabricate metrics or client results.

The live **homepage** shows only four category links: `/google-ads-portfolio/`, `/facebookads-portfolio/`, `/portfolio-seo/` and `/wp-portfolio/`. Those pages embed public **Airtable galleries** that hold the real case studies (details in `docs/live-audit/portfolio/README.md`):
- **Google Ads:** 16 records, each with a before/after dashboard screenshot.
- **Facebook Ads:** 10 records, with before/after screenshots and the stated objective.
- **SEO:** 11+ records, with Search Console before/after screenshots and quantified results.
- **WordPress sites:** 11+ named client sites with live URLs and preview screenshots.
- **WordPress landing pages:** 5, with full-length screenshots.

Ads clients are anonymised. Assets have to be exported from Airtable or supplied by the business, because the signed URLs expire.

### FAQ
The live FAQ has 8 questions. Full verbatim answers are in `docs/live-audit/homepage-fulltext.json`.
1. Why is digital marketing important for businesses?
2. Is digital marketing worth it?
3. Who needs digital marketing services?
4. How much does digital marketing cost?
5. How to choose a digital marketing agency?
6. How do you measure and report the success of digital marketing campaigns?
7. Where does WebIndia Inc. provide digital marketing services?
8. What makes WebIndia Inc. different from other digital marketing agencies?

Note: answer 4 claims "3-5X returns", and answer 8 repeats the 16+ / 60+ figures. Verify them together with the stats.

### Conversion messaging
The current homepage includes the CTA:
- **“Let's Make Your Digital Dreams a Reality!”**
- **“Get Started Today”**

These can be retained as source copy, but should be evaluated against the new brand voice and conversion strategy.

### Footer
Audit and retain the current, accurate:
- Company identity and logo
- Contact information
- Address
- Navigation and service links
- Social links
- Privacy / legal links
- Relevant CTA

Do not recreate contact details from memory; copy them from the live website.

Captured from the live footer:
- **Tagline:** "From Web Development To Lead Generation, WebIndia Inc. Is A 360 Degree Digital Solutions Provider. Let's Talk, Join Hands & Create A Better Business Together."
- **Email:** contact@webindiainc.com
- **Address:** 9th Floor, Lilamani Corporate Heights, Opp Ramapir Tekro BRTS Stop, Nava Vadaj, Ahmedabad, Gujarat 380013
- **Social:** Facebook, Instagram, Twitter, LinkedIn
- **Links:** "Make Payment" (`/make-payment/`), Privacy Policy, Terms & Conditions
- **Important links:** White Label Services, Google Ads, Facebook Ads Agency, WordPress Development, Search Engine Optimization, Shopify E-Commerce Development
- **Useful links:** Home, About Us, Blog, Careers, Contact

### Current brand and technical baseline
- **Font:** Proxima Nova (needs a licence).
- **Colors:** navy `#081424`, blue `#0048A9`, orange accent `#FF6600`, yellow highlight `#FFD64F`, `#202B39`.
- **Platform:** WordPress + Bricks, jQuery and Swiper.
- **Performance at audit:** TTFB ≈ 2.2 s, load ≈ 4.5 s, 131 requests, ≈ 700 KB transferred.
- **Trackers to carry over (get the IDs from the business):** GA/gtag, GTM, Microsoft Clarity, two Google Ads conversion tags.

---

## 3. Section-by-section redesign plan

| # | Section | Content to reuse | Redesign direction |
|---|---|---|---|
| 1 | Header / Navigation | Logo, primary navigation, service links, contact CTA | Minimal navigation, clear hierarchy, refined hover states, responsive menu |
| 2 | Hero | Core positioning, supporting copy, primary CTA | Strong editorial headline, distinctive art direction, purposeful motion |
| 3 | Trust / platform logos | Approved logos, reviews, platform associations | Cohesive logo strip or carefully paced trust sequence |
| 4 | Partner / PPC credibility | Verified Google Premier Partner messaging and proof | Make credibility prominent without overwhelming the hero |
| 5 | Services | Existing service names, descriptions, links | Editorial service list, large typography, interactive previews or restrained hover effects |
| 6 | Why choose us | Existing differentiators | Sharper hierarchy, concise proof-led copy |
| 7 | Expert team | Team capabilities and approved company imagery | Use genuine photography and a more human, editorial layout |
| 8 | Company values | Four existing value themes | Fewer, stronger statements; avoid generic icon-card grids |
| 9 | Statistics | Verified company metrics | Count-up animation on entry; accessible static values as fallback |
| 10 | Testimonials | Original approved quotes and attribution | Spacious editorial quote layout or restrained carousel |
| 11 | Advantages | Existing benefits and supporting copy | Consolidate repeated claims; emphasize evidence and clarity |
| 12 | Portfolio | Real projects, categories, images, approved outcomes | Large case-study imagery, varied composition, clear project context |
| 13 | Certifications | Current badges, awards, platform proof | Clean credibility strip with accurate labels and links |
| 14 | FAQ | Existing questions and answers | Accessible accordion with clear focus and open/close states |
| 15 | Final CTA | Existing conversion intent and CTA copy | High-contrast closing section with one primary action |
| 16 | Footer | Accurate contact, navigation, social and legal details | Compact, legible footer with consistent brand styling |

---

## 4. Suggested design and motion principles

The redesign should feel art-directed, premium, and deliberate—not like a generic agency template.

- **Typography:** Use a confident display face for headlines and a highly legible body face. Establish a clear type scale.
- **Layout:** Use generous spacing, strong alignment, occasional asymmetry, and varied section compositions.
- **Color:** Choose a restrained brand-led palette after reviewing existing brand assets. Avoid adding decorative gradients or neon colors without a clear rationale.
- **Services:** Prefer an editorial list or carefully designed interactive layout over a wall of identical cards.
- **Portfolio:** Make genuine work the visual focus; provide context rather than showing thumbnails alone.
- **Motion:** Use subtle text reveals, staggered entrances, image masks, hover feedback, and metric count-ups where they improve comprehension.
- **Performance:** Keep animations lightweight, avoid unnecessary scroll-jacking, and respect `prefers-reduced-motion`.
- **Accessibility:** Ensure keyboard navigation, visible focus, sufficient contrast, semantic headings, and accessible accordion/carousel controls.
- **Responsive behavior:** Design for mobile and tablet deliberately rather than shrinking the desktop layout.
- **Conversion:** Keep the primary action clear and avoid competing CTAs in every section.

---

## 5. Suggested React component architecture

The final component count depends on the existing codebase and the complexity of the motion system. A reasonable starting point is around 10–14 reusable building blocks, composed into the 16 major sections.

```text
HomePage
├── SiteHeader
├── HeroSection
├── TrustLogoStrip
├── PartnerCredibilitySection
├── ServicesSection
│   └── ServiceItem (reusable)
├── WhyChooseUsSection
├── TeamSection
├── ValuesSection
├── StatsSection
│   └── StatItem (reusable)
├── TestimonialsSection
│   └── TestimonialItem (reusable)
├── AdvantagesSection
├── PortfolioSection
│   └── ProjectCard (reusable)
├── CertificationsSection
├── FAQSection
│   └── FAQItem (reusable)
├── FinalCTASection
└── SiteFooter
```

Possible shared utilities:
- `RevealOnScroll`
- `AnimatedCounter`
- `SectionHeading`
- `PrimaryButton`
- `Container`
- Motion preferences / reduced-motion handling

These are suggested building blocks, not a requirement to create one component for every listed item. Reuse should follow the actual design and behavior.

---

## 6. Content audit checklist

### Keep
- [ ] Accurate service names and descriptions
- [ ] Approved brand positioning
- [ ] Genuine testimonials and attribution
- [ ] Real portfolio work
- [ ] Verified company facts and credentials
- [ ] Current contact details and legal links

### Rewrite or consolidate
- [ ] Hero headline and supporting copy
- [ ] Repeated claims across “Why Choose Us” and “Advantages”
- [ ] Generic value statements
- [ ] Section headings and CTA hierarchy
- [ ] FAQ answers where wording is outdated or unclear

### Verify before launch
- [ ] Years of experience and all counters
- [ ] Google Premier Partner status and badge usage
- [ ] Ratings, review counts, and review-source links
- [ ] Certification and award validity
- [ ] Testimonial wording, names, roles, and permissions
- [ ] Portfolio ownership, client permissions, and outcome metrics
- [ ] Every CTA destination and contact method
- [ ] 1563+ projects vs 1431 clients; 125+ workforce; 92% retention (and fix its duplicated sub-copy)
- [ ] Upwork / Google / Trustpilot review counts and profile links
- [ ] FAQ claims ("3-5X returns", 16+ / 60+ repeated in answers)
- [ ] Whether Shopify becomes a homepage service
- [ ] Service-blurb links (live ones point to unrelated blog posts)
- [ ] Mobile layout, keyboard behavior, reduced-motion behavior, and page performance

---

## 7. Audit limitations

This document is a **content and design planning brief**. The live copy for every section was captured on 2026-10-26 in `docs/live-audit/`. Business facts still need sign-off (see "Verify before launch"). No missing content should be filled with invented claims or assumed contact details.

**Source website:** https://www.webindiainc.com/
