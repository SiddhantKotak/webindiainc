import type { Metadata } from "next";
import { ServicesSection } from "@/components/sections/services";
import { WhySection } from "@/components/sections/why";

// Workbench for the Services and Why sections. Not linked from the site.
export const metadata: Metadata = {
  title: "Services lab",
  robots: { index: false, follow: false },
};

const spacer = "flex h-[50vh] items-center justify-center bg-tint text-xs font-medium uppercase tracking-[0.2em] text-ink/60";

export default function ServicesLabPage() {
  return (
    <main className="bg-paper text-ink">
      <div className={spacer}>Spacer above</div>
      <ServicesSection />
      <WhySection />
      <div className={spacer}>Spacer below</div>
    </main>
  );
}
