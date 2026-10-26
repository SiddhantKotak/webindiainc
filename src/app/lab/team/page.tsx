import type { Metadata } from "next";
import { TeamSection } from "@/components/sections/team";
import { StrengthsSection } from "@/components/sections/strengths";

// Workbench for the Team section. Not linked from the site.
export const metadata: Metadata = {
  title: "Team lab",
  robots: { index: false, follow: false },
};

const spacer = "flex h-[50vh] items-center justify-center bg-tint text-xs font-medium uppercase tracking-[0.2em] text-ink/60";

export default function TeamLabPage() {
  return (
    <main className="bg-paper text-ink">
      <div className={spacer}>Spacer above</div>
      <TeamSection />
      <StrengthsSection />
      <div className={spacer}>Spacer below</div>
    </main>
  );
}
