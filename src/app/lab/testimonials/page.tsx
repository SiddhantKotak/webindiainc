import type { Metadata } from "next";
import { TestimonialsSection } from "@/components/sections/testimonials";

// Workbench for the Testimonials section. Not linked from the site.
export const metadata: Metadata = {
  title: "Testimonials lab",
  robots: { index: false, follow: false },
};

const spacer = "flex h-[60vh] items-center justify-center bg-tint text-xs font-medium uppercase tracking-[0.2em] text-ink/60";

export default function TestimonialsLabPage() {
  return (
    <main className="bg-paper text-ink">
      <div className={spacer}>Spacer above</div>
      <TestimonialsSection />
      <div className={spacer}>Portfolio below</div>
    </main>
  );
}
