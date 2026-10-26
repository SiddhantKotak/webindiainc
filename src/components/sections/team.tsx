import { Container } from "@/components/ui/container";
import { Eyebrow } from "@/components/ui/eyebrow";
import { Reveal } from "@/components/ui/reveal";
import { teamBody, teamHeading } from "@/content/proof";
import { TeamPhoto } from "./team/team-photo";

// "A dedicated team of PPC and web development experts": only the last word takes the accent
// face. The words stay verbatim.
const headingWords = teamHeading.split(" ");
const headingLead = headingWords.slice(0, -1).join(" ");
const headingLast = headingWords[headingWords.length - 1];

/**
 * The dedicated team, pattern H: an inset photo banner. The founders' faces sit along the
 * bottom half of the frame, so the copy goes beside the photo instead of over it. On desktop
 * the panel straddles the paper → tint boundary, leading into Strengths.
 */
export function TeamSection() {
  return (
    <section
      id="team"
      aria-labelledby="team-heading"
      className="relative isolate overflow-x-clip bg-paper pt-24 text-ink sm:pt-32"
    >
      <div className="flex flex-col">
        {/* Phones: photo first, copy below. Desktop: copy row above the panel. */}
        <Container className="order-2 grid gap-8 pb-24 pt-10 sm:pb-32 lg:order-1 lg:grid-cols-12 lg:items-end lg:gap-12 lg:pb-16 lg:pt-0">
          <Reveal x={50} y={0} className="lg:col-span-7">
            <Eyebrow>Our team</Eyebrow>
            <h2
              id="team-heading"
              className="mt-5 max-w-[18ch] font-display text-[2.125rem] leading-[1.04] tracking-tight sm:text-[2.75rem] lg:text-[3.25rem]"
            >
              {headingLead} <span className="font-accent italic">{headingLast}</span>
            </h2>
          </Reveal>
          <Reveal x={50} y={0} delay={0.12} className="flex flex-col gap-4 lg:col-span-5 lg:pb-1.5">
            <p className="text-lg leading-snug">{teamBody[0]}</p>
            <p className="text-base leading-relaxed text-ink/80">{teamBody[1]}</p>
          </Reveal>
        </Container>

        <div className="relative order-1 lg:order-2">
          {/* The section-colour boundary the panel overlaps: Strengths below is tint. */}
          <div aria-hidden className="absolute inset-x-0 bottom-0 -z-10 hidden h-[42%] bg-tint lg:block" />
          <div className="mx-auto w-full max-w-(--content) px-(--gutter)">
            <TeamPhoto />
          </div>
        </div>
      </div>
    </section>
  );
}
