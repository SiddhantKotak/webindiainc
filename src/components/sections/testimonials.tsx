import { Eyebrow } from "@/components/ui/eyebrow";
import { Reveal } from "@/components/ui/reveal";
import { assets } from "@/content/assets";
import { testimonials, testimonialsHeading } from "@/content/testimonials";
import { TestimonialFigure } from "./testimonials/testimonial-figure";

// "What Our Clients Have to Say": "Clients" takes the accent face. The words stay verbatim.
const accentWord = "Clients";
const [headingLead, headingRest] = testimonialsHeading.split(` ${accentWord} `);

// Connector lengths differ per column so the portraits land on a staggered line, not a grid.
const CONNECTOR_HEIGHTS = [64, 104, 80];

// Portrait slots are keyed by the client's first name ("Keira Geary Marcinowski" → keira).
const portraitFor = (name: string) =>
  assets.testimonial[name.split(" ")[0].toLowerCase() as keyof typeof assets.testimonial] ?? null;

/**
 * Testimonials: the client's voice, emphasised. A dark inset panel on the paper page; each
 * column hangs its review headline in an outlined pill, a pen line leads down to the client,
 * and hand-drawn quote marks open the verbatim quote.
 */
export function TestimonialsSection() {
  return (
    <section id="testimonials" aria-labelledby="testimonials-heading" className="bg-paper py-16 sm:py-20">
      <div className="mx-auto w-full max-w-(--content) px-(--gutter)">
        <div className="rounded-card bg-ink px-5 pb-14 pt-12 text-white sm:px-12 sm:pb-20 sm:pt-16 lg:px-16 xl:px-20">
          <Reveal y={50} className="flex flex-col items-center text-center">
            <Eyebrow className="text-white/70">Testimonials</Eyebrow>
            <h2
              id="testimonials-heading"
              className="mt-5 max-w-[18ch] font-display text-[2rem] leading-[1.08] tracking-tight text-balance sm:text-[2.5rem]"
            >
              {headingRest !== undefined ? (
                <>
                  {headingLead} <span className="font-accent italic">{accentWord}</span> {headingRest}
                </>
              ) : (
                testimonialsHeading
              )}
            </h2>
          </Reveal>

          <ul className="mx-auto mt-10 grid max-w-xl gap-12 sm:mt-14 sm:gap-14 lg:max-w-none lg:grid-cols-3 lg:gap-12 xl:gap-16">
            {testimonials.map((testimonial, i) => (
              <li key={testimonial.name}>
                <TestimonialFigure
                  testimonial={testimonial}
                  portrait={portraitFor(testimonial.name)}
                  index={i}
                  connectorHeight={CONNECTOR_HEIGHTS[i % CONNECTOR_HEIGHTS.length]}
                />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
