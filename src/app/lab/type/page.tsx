import type { Metadata } from "next";
import type { CSSProperties } from "react";
import {
  Archivo,
  Bricolage_Grotesque,
  Caveat,
  Fraunces,
  Instrument_Sans,
  Instrument_Serif,
  Kalam,
  Mona_Sans,
} from "next/font/google";
import { hero } from "@/content/site";
import { servicesHeading, servicesIntro } from "@/content/services";
import { strengths } from "@/content/stats";

// Type specimen for choosing the homepage typeface. Fonts load only on this route.
export const metadata: Metadata = {
  title: "Type specimen",
  robots: { index: false, follow: false },
};

const monaSans = Mona_Sans({ subsets: ["latin"], axes: ["wdth"], display: "swap" });
const instrumentSerif = Instrument_Serif({ subsets: ["latin"], weight: "400", style: ["normal", "italic"], display: "swap" });
const instrumentSans = Instrument_Sans({ subsets: ["latin"], axes: ["wdth"], display: "swap" });
const bricolage = Bricolage_Grotesque({ subsets: ["latin"], axes: ["opsz"], display: "swap" });
const archivo = Archivo({ subsets: ["latin"], axes: ["wdth"], display: "swap" });
const fraunces = Fraunces({ subsets: ["latin"], axes: ["SOFT", "WONK", "opsz"], display: "swap" });
const caveat = Caveat({ subsets: ["latin"], weight: "500", display: "swap" });
const kalam = Kalam({ subsets: ["latin"], weight: ["400", "700"], display: "swap" });

type Pairing = {
  id: string;
  name: string;
  why: string;
  display: CSSProperties;
  /** Optional italic accent for "Digital Marketing". */
  accent?: CSSProperties;
  body: CSSProperties;
  numeral: CSSProperties;
  hand: CSSProperties;
};

const PAIRINGS: Pairing[] = [
  {
    id: "A",
    name: "Mona Sans · Instrument Serif italic · Caveat",
    why: "Closest to the reference's Helvetica Roman + Bold Extended (Mona Sans reaches 125% width with tabular figures); a serif italic adds the artistic accent. Used by GitHub and Dribbble.",
    display: { fontFamily: monaSans.style.fontFamily, fontWeight: 400 },
    accent: { fontFamily: instrumentSerif.style.fontFamily, fontStyle: "italic" },
    body: { fontFamily: monaSans.style.fontFamily },
    numeral: { fontFamily: monaSans.style.fontFamily, fontWeight: 750, fontStretch: "125%" },
    hand: { fontFamily: caveat.style.fontFamily },
  },
  {
    id: "B",
    name: "Bricolage Grotesque · Instrument Sans · Caveat",
    why: "The quirkiest grotesk: optical sizes give big headlines real character. Width only narrows (max 100%), so numbers are heavy rather than extended.",
    display: { fontFamily: bricolage.style.fontFamily, fontWeight: 400 },
    body: { fontFamily: instrumentSans.style.fontFamily },
    numeral: { fontFamily: bricolage.style.fontFamily, fontWeight: 800 },
    hand: { fontFamily: caveat.style.fontFamily },
  },
  {
    id: "C",
    name: "Archivo · Caveat",
    why: "One family doing both jobs: Regular for headlines, 125% Expanded for numbers. Structurally the closest match, plainer in character.",
    display: { fontFamily: archivo.style.fontFamily, fontWeight: 400 },
    body: { fontFamily: archivo.style.fontFamily },
    numeral: { fontFamily: archivo.style.fontFamily, fontWeight: 700, fontStretch: "125%" },
    hand: { fontFamily: caveat.style.fontFamily },
  },
  {
    id: "D",
    name: "Instrument Serif · Instrument Sans · Caveat",
    why: "Editorial and elegant; the condensed serif moves away from the reference's grotesk and reads more luxury than performance marketing.",
    display: { fontFamily: instrumentSerif.style.fontFamily, fontWeight: 400 },
    accent: { fontFamily: instrumentSerif.style.fontFamily, fontStyle: "italic" },
    body: { fontFamily: instrumentSans.style.fontFamily },
    numeral: { fontFamily: instrumentSans.style.fontFamily, fontWeight: 700 },
    hand: { fontFamily: caveat.style.fontFamily },
  },
  {
    id: "E",
    name: "Fraunces · Archivo · Kalam",
    why: "Warm, inky soft-serif with 'wonky' letterforms; the most whimsical option — may read craft/food rather than PPC agency.",
    display: { fontFamily: fraunces.style.fontFamily, fontWeight: 400, fontVariationSettings: '"SOFT" 100, "WONK" 1' },
    body: { fontFamily: archivo.style.fontFamily },
    numeral: { fontFamily: archivo.style.fontFamily, fontWeight: 700, fontStretch: "125%" },
    hand: { fontFamily: kalam.style.fontFamily, fontWeight: 400 },
  },
];

const shownStats = [strengths[0], strengths[2], strengths[4]];

export default function TypeSpecimenPage() {
  return (
    <main className="bg-paper px-4 py-16 text-ink sm:px-10">
      <header className="mx-auto mb-16 max-w-5xl">
        <p className="text-xs font-semibold uppercase tracking-[0.08em]">Type specimen</p>
        <h1 className="mt-3 text-3xl">Pick a pairing for the WebIndia homepage</h1>
        <p className="mt-3 max-w-2xl opacity-70">
          Every sample uses real homepage content. The numbers use each pairing&apos;s &ldquo;extended numerals&rdquo; treatment;
          the handwritten line is an annotation style used next to hand-drawn circles.
        </p>
      </header>

      <div className="mx-auto flex max-w-5xl flex-col gap-10">
        {PAIRINGS.map((p) => (
          <section key={p.id} className="overflow-hidden rounded-card border border-ink bg-paper">
            <div className="flex flex-wrap items-baseline justify-between gap-2 border-b border-ink bg-tint px-5 py-3">
              <h2 className="text-sm font-semibold">
                {p.id}. {p.name}
              </h2>
              <p className="max-w-xl text-xs opacity-75">{p.why}</p>
            </div>

            <div className="grid gap-10 p-6 sm:p-10 lg:grid-cols-[1.4fr_1fr]">
              <div>
                <p className="text-[2.6rem] leading-[1.02] tracking-tight sm:text-[3.6rem]" style={p.display}>
                  {hero.headline[0]}
                  <br />
                  {p.accent ? <span style={p.accent}>Digital Marketing</span> : "Digital Marketing"} Agency
                </p>
                <p className="mt-5 max-w-lg text-lg leading-snug" style={p.body}>
                  {hero.subline}
                </p>
                <p className="mt-8 text-[1.75rem] leading-tight tracking-tight" style={p.display}>
                  {servicesHeading}
                </p>
                <p className="mt-3 max-w-xl text-base leading-relaxed" style={p.body}>
                  {servicesIntro}
                </p>
              </div>

              <div className="flex flex-col gap-6">
                {shownStats.map((s) => (
                  <div key={s.label} className="border-b border-ink/20 pb-4">
                    <p className="text-5xl leading-none" style={{ ...p.numeral, fontVariantNumeric: "tabular-nums" }}>
                      {s.value.toLocaleString("en-US")}
                      {s.suffix}
                    </p>
                    <p className="mt-2 text-sm" style={p.body}>
                      {s.label}
                    </p>
                  </div>
                ))}
                <p className="-rotate-2 text-2xl text-accent" style={p.hand}>
                  Aug 2023 - Before → Sept 2023 - After
                </p>
              </div>
            </div>
          </section>
        ))}
      </div>
    </main>
  );
}
