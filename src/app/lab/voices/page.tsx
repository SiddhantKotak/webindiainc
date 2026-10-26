import type { Metadata } from "next";
import { TeamSection } from "@/components/sections/team";
import { TestimonialsSection } from "@/components/sections/testimonials";

// Preview of the team and testimonials sections. Not linked from the site.
export const metadata: Metadata = {
  title: "Voices lab",
  robots: { index: false, follow: false },
};

export default function VoicesLabPage() {
  return (
    <main className="bg-paper text-ink">
      {/* Stands in for the Why section above, so the team entrance starts below the fold. */}
      <div className="flex h-[110vh] items-center justify-center text-xs uppercase tracking-[0.2em] text-ink/50">
        Why WebIndia
      </div>
      <TeamSection />
      {/* Stands in for Strengths (tint), to show the panel straddling the boundary. */}
      <div className="flex h-[60vh] items-center justify-center bg-tint text-xs uppercase tracking-[0.2em] text-ink/50">
        Strengths
      </div>
      <TestimonialsSection />
      <div className="h-[40vh]" />
    </main>
  );
}
