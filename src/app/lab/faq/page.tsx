import type { Metadata } from "next";
import { FaqSection } from "@/components/sections/faq";
import { FeaturedSection } from "@/components/sections/featured";

// Preview of the FAQ (with Recognition above, for the seam). Not linked from the site.
export const metadata: Metadata = {
  title: "FAQ section lab",
  robots: { index: false, follow: false },
};

export default function FaqLabPage() {
  return (
    <main className="bg-paper text-ink">
      <FeaturedSection />
      <FaqSection />
    </main>
  );
}
