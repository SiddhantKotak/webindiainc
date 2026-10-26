import type { Metadata } from "next";
import { ClosingSection, SiteFooter } from "@/components/sections/closing";
import { FaqSection } from "@/components/sections/faq";
import { StrengthsSection } from "@/components/sections/strengths";

// Preview of the closing run of the homepage. Not linked from the site.
export const metadata: Metadata = {
  title: "Closing sections lab",
  robots: { index: false, follow: false },
};

export default function ClosingLabPage() {
  return (
    <main className="bg-paper text-ink">
      <StrengthsSection />
      <FaqSection />
      <ClosingSection />
      <SiteFooter />
    </main>
  );
}
