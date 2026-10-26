import type { Metadata } from "next";
import { FeaturedSection } from "@/components/sections/featured";
import { PartnerSection } from "@/components/sections/partner";

// Preview of the Partner and Featured sections. Not linked from the site.
export const metadata: Metadata = {
  title: "Partner lab",
  robots: { index: false, follow: false },
};

const label = "text-xs font-semibold uppercase tracking-[0.08em] opacity-50";

export default function PartnerLabPage() {
  return (
    <main className="bg-paper text-ink">
      {/* Neutral stand-in for the tint hero, so the scroll-scrubbed reveal starts below the fold. */}
      <section className="flex min-h-svh items-start bg-tint px-4 py-10 sm:px-12">
        <p className={label}>#top · Hero stand-in</p>
      </section>
      <PartnerSection />
      <section className="flex min-h-[60vh] items-start bg-tint px-4 py-10 sm:px-12">
        <p className={label}>#portfolio · stand-in</p>
      </section>
      <FeaturedSection />
      <section className="flex min-h-[60vh] items-start border-t border-ink/15 bg-paper px-4 py-10 sm:px-12">
        <p className={label}>#faq · stand-in</p>
      </section>
    </main>
  );
}
