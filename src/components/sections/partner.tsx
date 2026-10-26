import Image from "next/image";
import { BadgeThread } from "@/components/lines/badge-thread";
import { Chip } from "@/components/ui/chip";
import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";
import { SplitWords } from "@/components/ui/split-words";
import { assets, type Asset } from "@/content/assets";
import { partnerBody, partnerCapabilities, partnerHeading } from "@/content/proof";
import { EdgeLine } from "./partner/edge-line";

// partnerCapabilities, in order, mapped to the live site's icons (checked visually).
const CAPABILITY_ICONS: (Asset | null)[] = [
  assets.capability.googleSearch,
  assets.capability.googleAnalytics,
  assets.capability.googleShopping,
  assets.capability.displayAds,
  assets.capability.mobileCampaign,
  assets.capability.videoAdvertising,
];

// The live site highlights "Edge"; it takes the accent face. The words stay verbatim.
const ACCENT = "Edge";

function AccentLine({ text }: { text: string }) {
  const parts = text.split(new RegExp(`\\b(${ACCENT})\\b`));
  return parts.map((part, i) =>
    part === ACCENT ? (
      <span key={i} className="font-accent text-[1.1em] italic leading-none tracking-[-0.01em]">
        {part}
      </span>
    ) : (
      part
    ),
  );
}

/** Pattern B: expertise is what untangles it. Badge thread, heading, scroll-read statement, capabilities. */
export function PartnerSection() {
  const [lineOne, lineTwo] = partnerHeading;
  const badge = assets.premierPartner;

  return (
    <section id="partner" className="relative isolate overflow-hidden bg-paper py-24 text-ink sm:py-32">
      {/* Two columns from lg: the badge (where the thread from the hero lands) and its capabilities on
          the left, the statement on the right — the hairline enters from the left page edge into the
          knot, so it never crosses text. Stacked below lg. */}
      <Container className="grid items-center gap-y-12 lg:grid-cols-12 lg:gap-x-16 xl:gap-x-24">
        <div className="flex flex-col items-center lg:col-span-5">
          <EdgeLine>
            <BadgeThread seed={21} className="mx-auto max-w-[460px]">
              {badge ? (
                <Image
                  src={badge.src}
                  width={badge.width}
                  height={badge.height}
                  alt={badge.alt}
                  className="h-auto w-[124px] sm:w-[152px] lg:w-[172px]"
                />
              ) : (
                <div className="flex size-36 items-center justify-center rounded-card border border-ink text-sm">
                  {lineOne}
                </div>
              )}
            </BadgeThread>
          </EdgeLine>

          <ul
            aria-label="Capabilities"
            className="mt-10 grid w-full max-w-[560px] grid-cols-2 gap-2.5 max-lg:hidden sm:gap-3"
          >
            <Capabilities />
          </ul>
        </div>

        <div className="text-center lg:col-span-7 lg:text-left">
          <Reveal y={40}>
            <h2 className="font-display tracking-tight">
              <span className="block text-lg leading-snug sm:text-xl">{lineOne}</span>{" "}
              <span className="mt-2 block text-[2rem] leading-[1.06] text-balance sm:text-[2.75rem] lg:text-[3.25rem] xl:text-[3.75rem]">
                <AccentLine text={lineTwo} />
              </span>
            </h2>
          </Reveal>

          <SplitWords
            text={partnerBody}
            mode="scroll"
            className="mx-auto mt-10 max-w-[34ch] text-xl leading-[1.35] tracking-[-0.01em] sm:mt-12 sm:max-w-[40ch] sm:text-[1.625rem] lg:mx-0 lg:max-w-none lg:text-[1.75rem] lg:leading-[1.32] xl:text-[2rem]"
          />

          {/* Below lg the capabilities follow the statement. */}
          <ul
            aria-label="Capabilities"
            className="mx-auto mt-12 grid max-w-[620px] grid-cols-2 gap-2.5 sm:grid-cols-3 sm:gap-3 lg:hidden"
          >
            <Capabilities />
          </ul>
        </div>
      </Container>
    </section>
  );
}

function Capabilities() {
  return partnerCapabilities.map((label, i) => {
    const icon = CAPABILITY_ICONS[i];
    return (
      <li key={label}>
        <Reveal y={16} delay={i * 0.07} className="h-full">
          <Chip className="h-full w-full justify-start gap-2 bg-paper text-left sm:gap-2.5 sm:px-3.5! sm:pb-2! sm:pt-2.5! sm:text-base!">
            {icon && <Image src={icon.src} width={20} height={20} alt="" aria-hidden className="-mt-0.5 size-5 shrink-0" />}
            {label}
          </Chip>
        </Reveal>
      </li>
    );
  });
}
