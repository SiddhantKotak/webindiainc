import type { Metadata } from "next";
import { ClosingSection, SiteFooter } from "@/components/sections/closing";

// Preview of the closing CTA and the footer as one navy panel. Not linked from the site.
export const metadata: Metadata = {
  title: "Footer lab",
  robots: { index: false, follow: false },
};

export default function FooterLabPage() {
  return (
    <>
      <main className="bg-paper text-ink">
        <ClosingSection />
      </main>
      <SiteFooter />
    </>
  );
}
