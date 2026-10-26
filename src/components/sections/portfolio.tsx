import { Container } from "@/components/ui/container";
import { SectionHeader } from "@/components/ui/section-header";
import { portfolio, portfolioHeading, portfolioTabs } from "@/content/portfolio";
import { PortfolioTabs } from "./portfolio/portfolio-tabs";

/**
 * Portfolio, pattern C adapted: the reference frames a product demo; WebIndia's "product" is
 * client results, so the framed panel shows real dashboards and live builds, circled like a
 * reviewer would. One outlined card on the tint section, full container width: the tabs, then
 * the case, with the screenshot taking every pixel the layout can give it.
 */
export function PortfolioSection() {
  return (
    <section id="portfolio" className="bg-tint py-24 text-ink sm:py-32">
      <Container className="flex flex-col gap-12 sm:gap-16">
        <SectionHeader title={<span className="font-accent italic">{portfolioHeading}</span>} />
        <PortfolioTabs tabs={portfolioTabs} items={portfolio} />
      </Container>
    </section>
  );
}
