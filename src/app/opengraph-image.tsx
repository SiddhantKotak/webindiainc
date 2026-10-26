import { ImageResponse } from "next/og";
import { hero } from "@/content/site";
import { smoothPath, tanglePoints, type Point } from "@/lib/scribble";

// Social preview: the hero's headline beside the page's motif (a tangle that unspools into a
// rising line), on the hero's tint. Generated once at build time.

export const alt = "WebIndia Inc. — Performance-First Digital Marketing Agency";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const knot = tanglePoints(7, { loops: 5, radius: 70, cx: 120, cy: 470, squash: 0.85 });
const rise: Point[] = [
  [210, 480],
  [300, 430],
  [370, 455],
  [450, 360],
  [520, 380],
  [600, 260],
  [670, 280],
  [760, 150],
  [840, 90],
];
const line = smoothPath([...knot, ...rise]);
const arrow = "M812 92 L840 90 L828 115";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#eaf1fb",
          padding: "64px 72px",
          color: "#081424",
          position: "relative",
        }}
      >
        <svg
          width="640"
          height="398"
          viewBox="0 0 900 560"
          style={{ position: "absolute", right: 40, bottom: 8 }}
        >
          <path d={line} fill="none" stroke="#081424" strokeWidth={3} strokeLinecap="round" />
          <path d={arrow} fill="none" stroke="#ff6600" strokeWidth={4} strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <div
          style={{
            display: "flex",
            alignSelf: "flex-start",
            border: "3px solid #081424",
            borderRadius: 12,
            padding: "10px 20px",
            fontSize: 30,
            fontWeight: 700,
            letterSpacing: 1,
          }}
        >
          WEBINDIA INC
        </div>
        <div style={{ display: "flex", flexDirection: "column", fontSize: 76, lineHeight: 1.05, maxWidth: 760 }}>
          <span>{hero.headline[0]}</span>
          <span>{hero.headline[1]}</span>
        </div>
      </div>
    ),
    size,
  );
}
