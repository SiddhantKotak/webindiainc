import { Reveal } from "@/components/ui/reveal";
import { SectionHeader } from "@/components/ui/section-header";
import { strengths, strengthsHeading } from "@/content/stats";
import { StrengthsStage } from "./strengths/strengths-stage";

/**
 * Our Strengths: results compound. On desktop the section pins while a growth line unspools
 * from a knot and climbs; each figure counts up as the line's tip passes its marker. On tablets
 * each card carries one step of that rising line; on phones a line threads card to card.
 *
 * No eyebrow: the live page has no label for this block other than the heading itself
 * ("Our Strengths", also its nav label), and repeating it above the heading adds nothing.
 */
export function StrengthsSection() {
  return (
    <section id="strengths" aria-labelledby="strengths-heading" className="relative bg-tint text-ink">
      <StrengthsStage
        items={strengths}
        header={
          <Reveal y={50}>
            <SectionHeader align="left" title={<span id="strengths-heading">{strengthsHeading}</span>} />
          </Reveal>
        }
      />
    </section>
  );
}
