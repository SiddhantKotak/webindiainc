import { ArrowThread } from "@/components/lines/arrow-thread";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";
import { ctas, finalCta } from "@/content/site";
import { ClosingBackdrop, ClosingTangle } from "./closing/closing-backdrop";

// page.tsx imports the footer from here; it lives in its own file.
export { SiteFooter } from "./site-footer";

// The heading is verbatim; only its last word is set in the accent italic.
const headingWords = finalCta.heading.split(" ");
const headingLead = headingWords.slice(0, -1).join(" ");
const headingLast = headingWords[headingWords.length - 1];

/**
 * Final CTA (pattern K): a faint tangle unspools into the thread, which ends as an arrow pointing
 * at "Get Started Today". It is the last section inside <main>; `SiteFooter` follows on the same
 * navy so the two read as one panel, while the footer stays a real `contentinfo` landmark.
 */
export function ClosingSection() {
  return (
    <section id="contact" className="relative isolate overflow-hidden bg-ink text-white">
      <ClosingBackdrop />

      <Container className="flex flex-col items-center pb-24 pt-20 text-center sm:pb-32 sm:pt-28">
        {/* The line components stroke in --ink; on this panel the ink is white. */}
        <div className="relative w-full max-w-[760px] [--ink:#fff]">
          <ClosingTangle />
          <ArrowThread className="h-[110px] sm:h-[170px]" />
        </div>
        <Reveal y={40} className="mt-6 flex flex-col items-center gap-6 sm:mt-8">
          <h2 className="max-w-[16ch] font-display text-[2.5rem] leading-[1.04] tracking-tight text-balance sm:text-[3.5rem] lg:text-[4rem]">
            {headingLead} <span className="font-accent italic">{headingLast}</span>
          </h2>
          <p className="max-w-[52ch] text-base leading-relaxed text-white/80 sm:text-lg">{finalCta.body}</p>
          {/* On navy the button's dark glow reads as a smudge, and its navy hover would vanish
              into the panel: no shadow here, and it lifts to white instead. */}
          <Button
            href={ctas.primary.href}
            className="mt-2 min-h-11 px-6 text-base shadow-none! hover:bg-white! hover:text-ink!"
          >
            {ctas.primary.label}
          </Button>
        </Reveal>
      </Container>
    </section>
  );
}
