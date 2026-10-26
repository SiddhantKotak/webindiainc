import type { Metadata } from "next";
import { PortfolioSection } from "@/components/sections/portfolio";

// Workbench for the Portfolio section. Not linked from the site.
export const metadata: Metadata = {
  title: "Portfolio lab",
  robots: { index: false, follow: false },
};

const spacer = "flex h-[60vh] items-center justify-center bg-paper text-xs font-medium uppercase tracking-[0.2em] text-ink/60";

export default function PortfolioLabPage() {
  return (
    <main className="bg-paper text-ink">
      <div className={spacer}>Spacer above</div>
      <PortfolioSection />
      <div className={spacer}>Spacer below</div>
    </main>
  );
}
