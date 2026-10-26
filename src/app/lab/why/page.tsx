import type { Metadata } from "next";
import { WhySection } from "@/components/sections/why";

// Workbench for the Why section. Not linked from the site.
export const metadata: Metadata = {
  title: "Why lab",
  robots: { index: false, follow: false },
};

const spacer = "flex h-[50vh] items-center justify-center bg-tint text-xs font-medium uppercase tracking-[0.2em] text-ink/60";

export default function WhyLabPage() {
  return (
    <main className="bg-paper text-ink">
      <div className={spacer}>Spacer above</div>
      <WhySection />
      <div className={spacer}>Spacer below</div>
    </main>
  );
}
