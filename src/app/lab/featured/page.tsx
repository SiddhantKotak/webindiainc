import type { Metadata } from "next";
import { FaqSection } from "@/components/sections/faq";
import { FeaturedSection } from "@/components/sections/featured";
import { PortfolioSection } from "@/components/sections/portfolio";

// Preview of Recognition with its neighbours (portfolio above, the FAQ seam below). Not linked from the site.
export const metadata: Metadata = {
  title: "Featured section lab",
  robots: { index: false, follow: false },
};

export default function FeaturedLabPage() {
  return (
    <main className="bg-paper text-ink">
      <PortfolioSection />
      <FeaturedSection />
      <FaqSection />
    </main>
  );
}
