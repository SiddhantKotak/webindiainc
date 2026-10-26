import { Container } from "@/components/ui/container";
import { SectionHeader } from "@/components/ui/section-header";
import { faq, faqHeading } from "@/content/faq";
import { FaqAccordion } from "./faq/faq-accordion";
import { SeamLine } from "./faq/seam-line";

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faq.map(({ question, answer }) => ({
    "@type": "Question",
    name: question,
    acceptedAnswer: { "@type": "Answer", text: answer },
  })),
};

/**
 * FAQ: pattern J rows (numbered chip column + content) as native disclosures. It shares one paper
 * run with Recognition above (same 5:7 columns); a drawn hairline replaces a second band of
 * padding between them, so the two read as one deliberate pair rather than an empty gap.
 */
export function FaqSection() {
  return (
    <section id="faq" className="bg-paper pb-24 text-ink sm:pb-32">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />
      <Container>
        <SeamLine />
      </Container>
      <Container className="grid gap-12 pt-12 sm:pt-16 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-16">
        <div>
          <SectionHeader align="left" eyebrow="FAQ" title={faqHeading} className="lg:sticky lg:top-28" />
        </div>
        <FaqAccordion items={faq} />
      </Container>
    </section>
  );
}
