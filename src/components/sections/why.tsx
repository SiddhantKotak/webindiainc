import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";
import { SectionHeader } from "@/components/ui/section-header";
import { advantages, advantagesHeading, proofPoints, values, whyHeading, whyIntro } from "@/content/proof";
import { ctas } from "@/content/site";
import { ValueRows } from "./why/value-rows";

// "Why Choose WebIndia Inc.": "Choose" takes the accent face. The words stay verbatim.
const [whyLead, whyAccent, ...whyRest] = whyHeading.split(" ");

/** Why WebIndia, pattern J (Why Choose + Values + Advantages consolidated): proof, point by point. */
export function WhySection() {
  return (
    <section id="why" className="bg-paper py-24 text-ink sm:py-32">
      <Container className="grid gap-14 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-20">
        {/* Sticks by its bottom edge, so the CTA stays reachable even when the column is taller
            than the viewport; while it fits, it behaves like a top-pinned column. */}
        <div className="lg:sticky lg:bottom-12 lg:self-end">
          <Reveal y={50}>
            <SectionHeader
              align="left"
              eyebrow="Why WebIndia"
              title={
                <>
                  {whyLead} <span className="font-accent italic">{whyAccent}</span> {whyRest.join(" ")}
                </>
              }
              intro={
                <div className="flex flex-col gap-4">
                  <p>{whyIntro[0]}</p>
                  <p className="text-base leading-relaxed text-ink/80">{whyIntro[1]}</p>
                </div>
              }
            />
          </Reveal>

          <ul className="mt-10 border-b border-ink">
            {proofPoints.map((point, i) => (
              <li key={point.title} className="border-t border-ink">
                <Reveal y={16} delay={0.1 + i * 0.08} className="py-4">
                  <p className="font-semibold leading-tight">{point.title}</p>
                  <p className="mt-1 text-sm text-ink/75">{point.text}</p>
                </Reveal>
              </li>
            ))}
          </ul>

          <Button href={ctas.primary.href} className="mt-10">
            {ctas.primary.label}
          </Button>
        </div>

        <div>
          <ValueRows values={values} />

          <div className="mt-16 sm:mt-20">
            <Reveal y={30}>
              <h3 className="font-display text-[1.75rem] leading-[1.1] tracking-tight sm:text-[2rem]">
                {advantagesHeading}
              </h3>
            </Reveal>
            <ul className="mt-8 grid gap-x-10 sm:grid-cols-2">
              {advantages.map((advantage, i) => (
                <li key={advantage.title} className="border-t border-ink">
                  <Reveal y={20} delay={(i % 2) * 0.08} className="py-5">
                    <h4 className="font-semibold leading-tight">{advantage.title}</h4>
                    <p className="mt-1.5 text-[0.9375rem] leading-relaxed text-ink/75">{advantage.text}</p>
                  </Reveal>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Container>
    </section>
  );
}
