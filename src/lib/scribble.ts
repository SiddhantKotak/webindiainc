// Procedural hand-drawn paths. Everything is seeded so the server render and
// the client hydrate to the exact same `d` strings.

export type Point = [number, number];

export function seededRandom(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// One decimal: path coordinates ship twice (HTML + hydration payload), and 0.1 user units is far
// below a pixel at the sizes these drawings render.
const fmt = (n: number) => Number(n.toFixed(1));

/** Smooth path through every point (Catmull-Rom converted to cubic Béziers). */
export function smoothPath(points: Point[], tension = 1): string {
  if (points.length < 2) return "";
  let d = `M${fmt(points[0][0])} ${fmt(points[0][1])}`;
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i - 1] ?? points[i];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = points[i + 2] ?? p2;
    const c1x = p1[0] + ((p2[0] - p0[0]) / 6) * tension;
    const c1y = p1[1] + ((p2[1] - p0[1]) / 6) * tension;
    const c2x = p2[0] - ((p3[0] - p1[0]) / 6) * tension;
    const c2y = p2[1] - ((p3[1] - p1[1]) / 6) * tension;
    d += ` C${fmt(c1x)} ${fmt(c1y)} ${fmt(c2x)} ${fmt(c2y)} ${fmt(p2[0])} ${fmt(p2[1])}`;
  }
  return d;
}

const STEPS_PER_LOOP = 16;
const smoothstep = (t: number) => t * t * (3 - 2 * t);
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

/**
 * Points for a pencil "tangle", a scribble made without lifting the pen. Each
 * loop gets its own centre, size, squash and tilt, and the pen eases from one
 * loop's settings to the next so the line never breaks.
 */
export function tanglePoints(
  seed: number,
  { loops = 9, radius = 50, cx = 0, cy = 0, squash = 0.8 } = {},
): Point[] {
  const rand = seededRandom(seed);
  const baseTilt = rand() * Math.PI;
  const loopShape = () => ({
    ox: (rand() - 0.5) * radius * 0.7,
    oy: (rand() - 0.5) * radius * 0.7,
    r: radius * (0.35 + rand() * 0.65),
    squash: squash * (0.7 + rand() * 0.45),
    tilt: baseTilt + (rand() - 0.5) * 1.2,
  });
  const shapes = Array.from({ length: loops + 1 }, loopShape);

  const points: Point[] = [];
  for (let i = 0; i <= loops * STEPS_PER_LOOP; i++) {
    const loop = Math.min(Math.floor(i / STEPS_PER_LOOP), loops - 1);
    const t = smoothstep((i - loop * STEPS_PER_LOOP) / STEPS_PER_LOOP);
    const a = shapes[loop];
    const b = shapes[loop + 1];
    const r = lerp(a.r, b.r, t) * (0.94 + rand() * 0.12);
    const s = lerp(a.squash, b.squash, t);
    const tilt = lerp(a.tilt, b.tilt, t);
    const angle = (i / STEPS_PER_LOOP) * Math.PI * 2;
    const x = Math.cos(angle) * r;
    const y = Math.sin(angle) * r * s;
    points.push([
      cx + lerp(a.ox, b.ox, t) + x * Math.cos(tilt) - y * Math.sin(tilt),
      cy + lerp(a.oy, b.oy, t) + x * Math.sin(tilt) + y * Math.cos(tilt),
    ]);
  }
  return points;
}

export function tanglePath(seed: number, radius = 50, loops = 9) {
  return smoothPath(tanglePoints(seed, { radius, loops }));
}

/** A hand-drawn ring: a little over one turn, slightly tilted, never closing cleanly. */
export function handEllipsePath(seed: number, width: number, height: number) {
  const rand = seededRandom(seed);
  const turns = 1.12 + rand() * 0.1;
  const steps = 40;
  const start = -Math.PI * (0.55 + rand() * 0.2);
  const tilt = (rand() - 0.5) * 0.12;
  const points: Point[] = [];
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const angle = start + t * turns * Math.PI * 2;
    // Second pass drifts outward, the way a quick circle overshoots.
    const grow = 1 + t * 0.06 + (rand() - 0.5) * 0.02;
    const x = Math.cos(angle) * (width / 2) * grow;
    const y = Math.sin(angle) * (height / 2) * grow;
    points.push([
      width / 2 + x * Math.cos(tilt) - y * Math.sin(tilt),
      height / 2 + x * Math.sin(tilt) + y * Math.cos(tilt),
    ]);
  }
  return smoothPath(points);
}

/** A loose wavy underline that settles as it travels right. */
export function underlinePath(seed: number, width: number, height = 16) {
  const rand = seededRandom(seed);
  const points: Point[] = [];
  const segments = 7;
  for (let i = 0; i <= segments; i++) {
    const t = i / segments;
    const amp = (height / 2) * (1 - t * 0.6);
    points.push([t * width, height / 2 + (i % 2 ? amp : -amp) * (0.5 + rand() * 0.5)]);
  }
  return smoothPath(points, 0.8);
}

/**
 * The growth thread: a knot that unspools into a rising line.
 * Returns the line and an arrowhead aimed along its final direction.
 */
export function growthThreadPaths(seed = 7) {
  // Few loops, so the knot uses a short stretch of the scroll and the rise gets the rest.
  const knot = tanglePoints(seed, { loops: 4, radius: 70, cx: 150, cy: 460, squash: 0.85 });
  const rise: Point[] = [
    [250, 470],
    [340, 420],
    [420, 450],
    [500, 360],
    [580, 380],
    [660, 270],
    [740, 290],
    [830, 160],
    [930, 80],
  ];
  const points = [...knot, ...rise];
  const [ax, ay] = rise[rise.length - 1];
  const [bx, by] = rise[rise.length - 2];
  const angle = Math.atan2(ay - by, ax - bx);
  const head = 26;
  const wing = (offset: number): Point => [
    ax - Math.cos(angle + offset) * head,
    ay - Math.sin(angle + offset) * head,
  ];
  const [l, r] = [wing(0.5), wing(-0.5)];
  const arrow = `M${fmt(l[0])} ${fmt(l[1])} L${ax} ${ay} L${fmt(r[0])} ${fmt(r[1])}`;
  return { line: smoothPath(points), arrow };
}

/**
 * A quick hand check mark on a 28×28 grid: a short dip, a long flick up and a
 * small overshoot at the end, the way a pen leaves the paper.
 */
export function checkPath(seed = 1) {
  const rand = seededRandom(seed);
  const j = (n: number) => (rand() - 0.5) * n;
  const s: Point = [5 + j(1), 14 + j(1.4)];
  const elbow: Point = [11.2 + j(1), 20.6 + j(1)];
  const end: Point = [23.4 + j(1.2), 5.6 + j(1.4)];
  const flick: Point = [end[0] + 1.6 + j(0.6), end[1] - 1.9 + j(0.6)];
  // The dip bows slightly outward; the long stroke bulges down and right, the
  // way a fast flick of the wrist curves.
  const c1: Point = [s[0] + 2.4 + j(0.8), elbow[1] - 3.6 + j(0.8)];
  const c2: Point = [elbow[0] + 7.6 + j(1.2), elbow[1] - 4.6 + j(1.2)];
  const p = (pt: Point) => `${fmt(pt[0])} ${fmt(pt[1])}`;
  return `M${p(s)} Q${p(c1)} ${p(elbow)} Q${p(c2)} ${p(end)} L${p(flick)}`;
}

/** An open arrowhead whose tip sits at `tip`, pointing along `angle` (radians, y down). */
export function arrowheadPath(tip: Point, angle: number, length = 14, spread = 0.5) {
  const wing = (offset: number): Point => [
    tip[0] - Math.cos(angle + offset) * length,
    tip[1] - Math.sin(angle + offset) * length,
  ];
  const [l, r] = [wing(spread), wing(-spread)];
  return `M${fmt(l[0])} ${fmt(l[1])} L${fmt(tip[0])} ${fmt(tip[1])} L${fmt(r[0])} ${fmt(r[1])}`;
}

/**
 * The thread that leads to the action: it enters from the left edge of a
 * `width` × `height` box, ties one small cursive loop (an echo of the tangle),
 * swings past the horizontal centre and drops straight down to the bottom,
 * where an arrowhead points at whatever sits below.
 */
export function arrowThreadPaths(seed: number, width: number, height: number) {
  const rand = seededRandom(seed);
  const j = (n: number) => (rand() - 0.5) * n;
  const cx = width / 2;
  const head = Math.min(18, height * 0.12);
  const tipY = height - 2;
  const y0 = height * (0.44 + j(0.04));
  // Loop size: height-led, but never wider than the run allows.
  const b = Math.min(height * 0.17, width * 0.07, 28) * (0.9 + rand() * 0.2);
  const a = b * 0.32;
  const loopSpan = Math.PI * 2 * a;
  // The loop ends a little before the centre, leaving room for the swing.
  const loopEnd = cx - Math.max(b * 1.6, width * 0.08);
  const loopStart = loopEnd - loopSpan;

  const points: Point[] = [[-2, y0 + j(6)]];
  // A lazy approach with one soft wave, scaled to the run.
  for (const t of [0.3, 0.62, 0.88]) {
    const wave = Math.sin(t * Math.PI * 1.6 + rand()) * height * 0.04;
    points.push([loopStart * t, y0 + wave + j(3)]);
  }
  // A prolate cycloid: in fast along the bottom, up and back over the top,
  // down and out again, crossing itself once like a cursive "l".
  const steps = 18;
  for (let i = 0; i <= steps; i++) {
    const t = (i / steps) * Math.PI * 2;
    const wobble = 1 + j(0.06);
    points.push([loopStart + a * t + b * Math.sin(t) * wobble, y0 - b * (1 - Math.cos(t)) * 1.05 * wobble]);
  }
  // Swing just past the centre, then fall onto it heading straight down.
  const swing = Math.min(b * 1.5, width * 0.06);
  const drop = tipY - y0;
  points.push([lerp(loopEnd, cx, 0.55), y0 + drop * 0.02 + j(2)]);
  points.push([cx + swing, y0 + drop * 0.28]);
  points.push([cx + swing * 0.3 + j(1.5), y0 + drop * 0.62]);
  points.push([cx, tipY - head * 1.1]);
  points.push([cx, tipY]);

  return {
    line: smoothPath(points, 0.9),
    arrow: arrowheadPath([cx, tipY], Math.PI / 2, head, 0.55),
  };
}

/** The small knot a badge thread unspools from, centred on 0,0 with the given radius. */
export function knotPoints(seed: number, radius = 50) {
  return tanglePoints(seed, { loops: 7, radius, squash: 0.9 });
}

/**
 * Thread → ring. The thread leaves `start` (the knot's last point), sags a
 * little like loose string, and joins a hand ellipse around `ring`, which
 * then loops a little over one turn. `knotCentre` sets which side of the
 * ring the thread arrives on. All coordinates share the caller's space.
 */
export function badgeThreadPaths(
  seed: number,
  start: Point,
  knotCentre: Point,
  ring: { cx: number; cy: number; rx: number; ry: number },
) {
  const rand = seededRandom(seed);
  // Enter the ring a little round from the side facing the knot, travelling
  // anticlockwise, so the thread arrives roughly along the ring's tangent.
  const facing = Math.atan2(knotCentre[1] - ring.cy, knotCentre[0] - ring.cx);
  const entryAngle = facing - 0.75;
  const tilt = (rand() - 0.5) * 0.1;
  const onRing = (angle: number, grow = 1): Point => {
    const x = Math.cos(angle) * ring.rx * grow;
    const y = Math.sin(angle) * ring.ry * grow;
    return [
      ring.cx + x * Math.cos(tilt) - y * Math.sin(tilt),
      ring.cy + x * Math.sin(tilt) + y * Math.cos(tilt),
    ];
  };
  const entry = onRing(entryAngle);
  // Approach along the ring's tangent, from just outside it.
  const lead = onRing(entryAngle + 0.3, 1.05);
  const mid: Point = [
    lerp(start[0], lead[0], 0.5) + (rand() - 0.5) * 8,
    lerp(start[1], lead[1], 0.5) + Math.max(8, Math.hypot(lead[0] - start[0], lead[1] - start[1]) * 0.14),
  ];
  const thread = smoothPath([start, mid, lead, entry], 0.9);

  const turns = 1.1 + rand() * 0.08;
  const steps = 44;
  const ringPoints: Point[] = [];
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    // The second pass drifts outward, the way a quick circle overshoots.
    ringPoints.push(onRing(entryAngle - t * turns * Math.PI * 2, 1 + t * 0.07 + (rand() - 0.5) * 0.015));
  }

  return { thread, ring: smoothPath(ringPoints) };
}
