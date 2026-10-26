import type { Metadata } from "next";
import { SiteHeader } from "@/components/sections/header";
import { HeroSection } from "@/components/sections/hero";
import { sectionNav } from "@/content/site";

// Preview of the header + hero. Not linked from the site.
export const metadata: Metadata = {
  title: "Hero lab",
  robots: { index: false, follow: false },
};

export default function HeroLabPage() {
  return (
    <>
      <SiteHeader />
      <main className="bg-paper text-ink">
        <HeroSection />
        {/* Neutral stand-ins carrying the real section ids, to test the drawer's anchors and active state. */}
        {sectionNav.map(({ id, label }, i) => (
          <section
            key={id}
            id={id}
            className={`flex min-h-[60vh] items-start border-t border-ink/15 px-4 py-10 sm:px-12 ${i % 2 ? "bg-tint" : "bg-paper"}`}
          >
            <p className="text-xs font-semibold uppercase tracking-[0.08em] opacity-50">
              #{id} · {label}
            </p>
          </section>
        ))}
      </main>
    </>
  );
}
