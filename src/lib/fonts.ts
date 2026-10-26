import { Caveat, Instrument_Serif, Mona_Sans } from "next/font/google";

// The one place the typeface is chosen (pairing "A" from /lab/type). globals.css maps
// these variables onto the font-role tokens (font-display, font-sans, font-accent,
// font-hand, and the `numeral` utility).

// Variable width axis gives the reference's "Bold Extended" numerals (font-stretch 125%).
const monaSans = Mona_Sans({ subsets: ["latin"], axes: ["wdth"], display: "swap", variable: "--font-mona" });

// Italic accent words only.
const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: ["italic"],
  display: "swap",
  variable: "--font-instrument-serif",
});

// Handwritten annotations only; kept off the preload path so it never competes with the LCP text.
const caveat = Caveat({ subsets: ["latin"], weight: "500", display: "swap", variable: "--font-caveat", preload: false });

export const fontVariables = [monaSans, instrumentSerif, caveat].map((font) => font.variable).join(" ");
