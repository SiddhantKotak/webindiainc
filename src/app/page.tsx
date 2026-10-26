import { LoadCover } from "@/components/load-cover";
import { ClosingSection, SiteFooter } from "@/components/sections/closing";
import { FaqSection } from "@/components/sections/faq";
import { FeaturedSection } from "@/components/sections/featured";
import { SiteHeader } from "@/components/sections/header";
import { HeroSection } from "@/components/sections/hero";
import { PartnerSection } from "@/components/sections/partner";
import { PortfolioSection } from "@/components/sections/portfolio";
import { ServicesSection } from "@/components/sections/services";
import { StrengthsSection } from "@/components/sections/strengths";
import { TeamSection } from "@/components/sections/team";
import { TestimonialsSection } from "@/components/sections/testimonials";
import { WhySection } from "@/components/sections/why";
import { skipLinkLabel } from "@/content/site";

// Section order follows content.md / docs/reference/rothfinder/README.md ("Mapping to the
// WebIndia homepage"). Backgrounds alternate deliberately: tint hero → paper → … → black close.
export default function Home() {
  return (
    <>
      <a
        href="#main"
        className="sr-only z-[110] rounded-card border border-ink bg-paper px-4 py-2 text-sm focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
      >
        {skipLinkLabel}
      </a>
      <LoadCover />
      <SiteHeader />
      <main id="main" tabIndex={-1}>
        <HeroSection />
        <PartnerSection />
        <ServicesSection />
        <WhySection />
        <TeamSection />
        <StrengthsSection />
        <TestimonialsSection />
        <PortfolioSection />
        <FeaturedSection />
        <FaqSection />
        <ClosingSection />
      </main>
      <SiteFooter />
    </>
  );
}
