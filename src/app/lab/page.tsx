import type { Metadata } from "next";
import Image from "next/image";
import { ArrowThread } from "@/components/lines/arrow-thread";
import { BadgeThread } from "@/components/lines/badge-thread";
import { GrowthThread } from "@/components/lines/growth-thread";
import { HandCheck } from "@/components/lines/hand-check";
import { HandCircle } from "@/components/lines/hand-circle";
import { LineIcon, type LineIconName } from "@/components/lines/line-icon";
import { ScribbleTangle } from "@/components/lines/scribble-tangle";
import { ScribbleUnderline } from "@/components/lines/scribble-underline";
import { Button } from "@/components/ui/button";
import { Chip } from "@/components/ui/chip";
import { assets } from "@/content/assets";
import { ctas } from "@/content/site";

// Workbench for the line-animation system. Not linked from the site.
export const metadata: Metadata = {
  title: "Line animation lab",
  robots: { index: false, follow: false },
};

// Hand-placed so the field frames the headline instead of covering it.
const TANGLES = [
  { seed: 11, size: 150, left: "4%", top: "14%", delay: 0.1 },
  { seed: 23, size: 90, left: "18%", top: "6%", delay: 0.5 },
  { seed: 37, size: 120, left: "12%", top: "58%", delay: 0.3 },
  { seed: 41, size: 70, left: "28%", top: "78%", delay: 0.8 },
  { seed: 53, size: 110, left: "62%", top: "4%", delay: 0.4 },
  { seed: 67, size: 160, left: "82%", top: "18%", delay: 0.2 },
  { seed: 79, size: 80, left: "74%", top: "62%", delay: 0.7 },
  { seed: 83, size: 130, left: "88%", top: "70%", delay: 0.6 },
  { seed: 97, size: 60, left: "46%", top: "82%", delay: 0.9 },
];

const ICONS: { name: LineIconName; label: string }[] = [
  { name: "googleAds", label: "Google Ads" },
  { name: "seo", label: "SEO" },
  { name: "wordpress", label: "WordPress" },
  { name: "facebookAds", label: "Facebook Ads" },
  { name: "bingAds", label: "Bing Ads" },
  { name: "amazonAds", label: "Amazon Ads" },
];

const eyebrow = "text-xs font-medium uppercase tracking-[0.2em] opacity-60";

export default function LabPage() {
  return (
    <main className="bg-paper text-ink">
      <section className="relative flex min-h-screen items-center justify-center overflow-hidden px-4">
        {TANGLES.map(({ seed, size, left, top, delay }) => (
          <div key={seed} className="absolute" style={{ left, top }}>
            <ScribbleTangle seed={seed} size={size} delay={delay} />
          </div>
        ))}
        <div className="pointer-events-none relative max-w-3xl text-center">
          <p className={eyebrow}>01 · Scribble tangles (hover them)</p>
          <h1 className="mt-6 text-5xl leading-[1.05] tracking-tight sm:text-7xl">
            Performance-First <ScribbleUnderline>Digital Marketing</ScribbleUnderline> Agency
          </h1>
        </div>
      </section>

      <GrowthThread>
        <div className="mx-auto max-w-2xl text-center">
          <p className={eyebrow}>02 · Growth thread (scroll)</p>
          <h2 className="mt-4 text-3xl tracking-tight sm:text-5xl">From a tangle to one clear line.</h2>
        </div>
      </GrowthThread>

      <section className="mx-auto flex min-h-[70vh] max-w-3xl flex-col items-center justify-center gap-6 px-4 text-center">
        <p className={eyebrow}>03 · Hand-drawn circle</p>
        <p className="text-3xl leading-snug tracking-tight sm:text-5xl">
          The ring draws around <HandCircle>the result</HandCircle> that matters, once it is on screen.
        </p>
      </section>

      <section className="mx-auto flex min-h-[70vh] max-w-4xl flex-col items-center justify-center gap-12 px-4">
        <p className={eyebrow}>04 · Single-line service icons</p>
        <div className="grid w-full grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-6">
          {ICONS.map(({ name, label }, i) => (
            <div
              key={name}
              className="flex flex-col items-center gap-5 rounded-lg border border-ink px-4 py-8 transition-colors hover:text-accent sm:px-6 sm:py-10"
            >
              <LineIcon name={name} size={96} delay={(i % 3) * 0.2} />
              <span className="text-base font-medium sm:text-lg">{label}</span>
            </div>
          ))}
        </div>
        <p className={eyebrow}>with wobble, at 56px and 96px</p>
        <div className="flex w-full flex-wrap items-end justify-center gap-6 sm:gap-10">
          {ICONS.map(({ name }) => (
            <div key={name} className="flex flex-col items-center gap-3">
              <LineIcon name={name} size={96} wobble />
              <LineIcon name={name} size={56} wobble />
              <LineIcon name={name} size={56} />
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto flex min-h-[70vh] max-w-3xl flex-col items-center justify-center gap-10 px-4">
        <p className={eyebrow}>05 · Hand check on number chips</p>
        <ol className="flex w-full flex-col gap-6">
          {[0, 1, 2].map((i) => (
            <li key={i} className="flex items-center gap-4 border-b border-ink/20 pb-6">
              <span className="relative inline-flex">
                <Chip className="numeral text-base">{`0${i + 1}.`}</Chip>
                <HandCheck size={28} delay={i * 0.25} className="absolute -right-4 -top-4" />
              </span>
              <span className="h-3 w-2/3 rounded-full bg-ink/10" />
            </li>
          ))}
        </ol>
        <div className="flex items-end gap-6">
          <HandCheck size={20} />
          <HandCheck size={28} />
          <HandCheck size={48} />
        </div>
      </section>

      <section className="mx-auto flex min-h-[70vh] max-w-5xl flex-col items-center justify-center px-4 pb-24">
        <p className={`${eyebrow} mb-10`}>06 · Arrow thread (scroll) leads to the CTA</p>
        <ArrowThread />
        <Button href={ctas.primary.href} className="mt-3">
          {ctas.primary.label}
        </Button>
      </section>

      <section className="mx-auto flex min-h-[80vh] max-w-3xl flex-col items-center justify-center gap-10 px-4 pb-24">
        <p className={eyebrow}>07 · Badge thread</p>
        <BadgeThread>
          {assets.premierPartner ? (
            <Image
              src={assets.premierPartner.src}
              width={assets.premierPartner.width}
              height={assets.premierPartner.height}
              alt={assets.premierPartner.alt}
            />
          ) : (
            <div className="flex size-36 items-center justify-center rounded-card border border-ink text-sm">Badge</div>
          )}
        </BadgeThread>
      </section>
    </main>
  );
}
