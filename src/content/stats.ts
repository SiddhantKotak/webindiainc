// Generated from docs/live-audit/homepage-fulltext.json — copy is verbatim from the live
// homepage (captured 2026-10-26). Edit wording only with business approval.

// Every business figure on the page comes from this file. All are copied from the live site and
// are UNVERIFIED until the business signs them off (docs/live-audit/README.md, "Discrepancies").
// Known issues: the live Client Retention sub-copy duplicates Workforce's; 1431 clients served vs
// 1563+ projects managed (proof.ts) are different metrics that both need confirming.

export type Signoff = "pending" | "approved";

export type Strength = { value: number; suffix: string; label: string; text: string; signoff: Signoff };

export type Review = { platform: string; count: number; suffix: string; signoff: Signoff };

export const strengthsHeading = "Our Strengths";

export const strengths: Strength[] = [
  {
    "value": 16,
    "suffix": "+",
    "label": "Years Of Experience",
    "text": "Proven track record of delivering exceptional digital marketing results",
    "signoff": "pending"
  },
  {
    "value": 125,
    "suffix": "+",
    "label": "Workforce",
    "text": "Talented team of specialists across all digital disciplines",
    "signoff": "pending"
  },
  {
    "value": 92,
    "suffix": "%",
    "label": "Client Retention",
    "text": "Talented team of specialists across all digital disciplines",
    "signoff": "pending"
  },
  {
    "value": 60,
    "suffix": "+",
    "label": "Ads Certified Experts",
    "text": "Google-certified professionals managing your campaigns",
    "signoff": "pending"
  },
  {
    "value": 1431,
    "suffix": "",
    "label": "Clients Served",
    "text": "Businesses worldwide trust us for their digital growth",
    "signoff": "pending"
  }
];

// Hero review badges, in live order (logos: Upwork, Google, Trustpilot).
const reviewData: Review[] = [
  {
    "platform": "Upwork",
    "count": 680,
    "suffix": "+",
    "signoff": "pending"
  },
  {
    "platform": "Google",
    "count": 162,
    "suffix": "+",
    "signoff": "pending"
  },
  {
    "platform": "Trustpilot",
    "count": 42,
    "suffix": "+",
    "signoff": "pending"
  }
];

// The visible label ("680+ reviews") is derived from `count`, so a corrected count updates it.
export const reviews = reviewData.map((review) => ({
  ...review,
  label: `${review.count}${review.suffix} reviews`,
}));

// Figures used outside the counters. The proof-point titles (proof.ts) and the meta description
// (layout.tsx) are templated from these, so every figure is corrected here.
export const projectsManaged: Omit<Strength, "label" | "text"> = { value: 1563, suffix: "+", signoff: "pending" };

const byLabel = (label: string) => {
  const found = strengths.find((s) => s.label === label);
  if (!found) throw new Error(`stats.ts: no strength labelled "${label}"`);
  return found;
};
export const yearsOfExperience = byLabel("Years Of Experience");
export const certifiedExperts = byLabel("Ads Certified Experts");

// Figures that also appear inside running prose and are NOT templated (edit the prose by hand if
// these change): faq.ts answer 4 ("3-5X returns") and answer 8 ("16+ years", "60+ in-house
// Google-certified experts"); proof.ts value "We Are Certified Experts" ("over 16 years").
