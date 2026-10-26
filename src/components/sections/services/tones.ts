// One colour per service card, from WebIndia's brand palette. Text colours are chosen for AA:
// white on blue (≈8.4:1), slate (≈14:1) and ink; ink on orange (≈6.1:1), yellow, sky and tint.
// `line` is the stroke colour of the card's drawing, `num` the number chip's text.
export const TONES = [
  { bg: "bg-blue", text: "text-white", line: "text-yellow", num: "text-blue" },
  { bg: "bg-slate", text: "text-white", line: "text-orange", num: "text-slate" },
  { bg: "bg-yellow", text: "text-ink", line: "text-ink", num: "text-ink" },
  { bg: "bg-ink", text: "text-white", line: "text-sky", num: "text-ink" },
  { bg: "bg-orange", text: "text-ink", line: "text-paper", num: "text-ink" },
  { bg: "bg-sky", text: "text-ink", line: "text-blue", num: "text-ink" },
] as const;

export const toneAt = (i: number) => TONES[i % TONES.length];
