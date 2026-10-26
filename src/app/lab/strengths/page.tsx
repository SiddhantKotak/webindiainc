import type { Metadata } from "next";
import { StrengthsSection } from "@/components/sections/strengths";

// Workbench for the Strengths section. Not linked from the site.
export const metadata: Metadata = {
  title: "Strengths lab",
  robots: { index: false, follow: false },
};

const spacer = "flex h-[50vh] items-center justify-center bg-tint text-xs font-medium uppercase tracking-[0.2em] text-ink/60";

export default function StrengthsLabPage() {
  return (
    <main className="bg-paper text-ink">
      <div className={spacer}>Spacer above</div>
      <StrengthsSection />
      <div className={spacer}>Spacer below</div>
    </main>
  );
}
