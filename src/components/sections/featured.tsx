import Image from "next/image";
import { Container } from "@/components/ui/container";
import { OutlineCard } from "@/components/ui/outline-card";
import { Reveal } from "@/components/ui/reveal";
import { SectionHeader } from "@/components/ui/section-header";
import { assets, type Asset } from "@/content/assets";
import { featuredHeading, featuredLogos } from "@/content/featured";
import { cn } from "@/lib/cn";

/** Tallest a supporting logo may sit, in px. */
const MAX_HEIGHT = 64;
/** Area constant: a square logo would be this wide; wide marks get wider and shorter. */
const K = 82;
/**
 * Never draw a logo wider than 2/3 of its source pixels. Several live marks are tiny files
 * (Best SEO is 129×91 and already soft); past this they only get blurrier.
 */
const MAX_UPSCALE = 2 / 3;

/**
 * Equal optical area rather than equal height: width ∝ √aspect, height ∝ 1/√aspect, so a
 * square badge and a long wordmark carry about the same weight. Capped by the source size.
 */
function logoSize({ width, height }: Asset) {
  const aspect = width / height;
  const h = Math.min(MAX_HEIGHT, K / Math.sqrt(aspect), (width * MAX_UPSCALE) / aspect);
  return Math.round(h * aspect);
}

const lead = assets.featured.premierBadge;
const supporting = featuredLogos.filter((logo): logo is Asset => logo !== null && logo !== lead);
// From `sm` the strip is 3 columns and the lead badge fills a 1×2 cell, so pad the rest to whole
// rows; on phones the lead spans the top row and an odd last logo spans the bottom one.
const leadCells = lead ? 2 : 0;
const fillers = (3 - ((leadCells + supporting.length) % 3)) % 3;
const oddOnPhone = supporting.length % 2 === 1;

/**
 * Logo in a box sized by CSS. `fill` + aspect-ratio lets the box shrink in narrow cells without
 * next/image's "width or height modified" warning. Files too small to give a sharper 2x are
 * served as-is: re-encoding them only adds artefacts.
 */
function Logo({ logo, width, sizes }: { logo: Asset; width: number; sizes: string }) {
  return (
    <span className="relative block max-w-full" style={{ width, aspectRatio: `${logo.width} / ${logo.height}` }}>
      <Image
        src={logo.src}
        alt={logo.alt}
        fill
        sizes={sizes}
        unoptimized={logo.width < width * 2}
        // Multiply drops the white plates some badges ship on into the paper.
        className="object-contain mix-blend-multiply"
      />
    </span>
  );
}

/**
 * Pattern I: recognition in one calm bordered strip. The Google Premier Partner badge is the
 * credential, so it leads with a double-height cell; the press and review marks share the rest.
 * Paired with the FAQ below on one paper run: the two are split by a drawn hairline (faq.tsx),
 * not by a second band of padding.
 */
export function FeaturedSection() {
  return (
    <section id="featured" className="bg-paper pb-12 pt-24 text-ink sm:pb-16 sm:pt-32">
      <Container className="grid gap-10 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:items-start lg:gap-16">
        <Reveal y={30}>
          <SectionHeader align="left" eyebrow="Recognition" title={featuredHeading} />
        </Reveal>

        <Reveal y={24} delay={0.1}>
          <OutlineCard className="overflow-hidden">
            <ul className="grid grid-cols-2 gap-px bg-ink sm:auto-rows-[8rem] sm:grid-cols-3">
              {lead && (
                <li className="col-span-2 flex h-44 items-center justify-center bg-paper p-5 sm:col-span-1 sm:row-span-2 sm:h-auto sm:p-6">
                  <span
                    className="relative block h-full max-h-[200px] max-w-full"
                    style={{ aspectRatio: `${lead.width} / ${lead.height}` }}
                  >
                    <Image
                      src={lead.src}
                      alt={lead.alt}
                      fill
                      sizes="200px"
                      className="object-contain mix-blend-multiply"
                    />
                  </span>
                </li>
              )}
              {supporting.map((logo, i) => {
                const width = logoSize(logo);
                return (
                  <li
                    key={logo.src}
                    className={cn(
                      "flex h-28 items-center justify-center bg-paper px-4 sm:h-auto",
                      oddOnPhone && i === supporting.length - 1 && "max-sm:col-span-2",
                    )}
                  >
                    <Logo logo={logo} width={width} sizes={`${width}px`} />
                  </li>
                );
              })}
              {Array.from({ length: fillers }, (_, i) => (
                <li key={`filler-${i}`} aria-hidden className="hidden bg-paper sm:block" />
              ))}
            </ul>
          </OutlineCard>
        </Reveal>
      </Container>
    </section>
  );
}
