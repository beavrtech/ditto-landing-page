"use client";
// HeroBeadsCarousel.tsx — Ditto homepage hero (design handoff: "Ditto Homepage Beads").
// Two-column hero band: yellow copy panel (left) + tan panel holding an
// auto-advancing carousel of framework cards (right), each running its own
// shape choreography over a canonical 16-shape set.
//
// Ported from the design prototype's <script> block (CARD_FRAC, SHAPE16,
// paintFly, etc.) — constants and math are kept as-is per the handoff
// ("reuse the values as-is rather than re-tuning"). The prototype's own
// scaffolding (x-dc, {{ }} template holes, renderVals/support.js) is NOT
// used here; this is a plain React port that drives shape transforms via a
// single requestAnimationFrame loop writing `transform` directly to DOM
// nodes (not React state), exactly as the handoff specifies, so a
// re-render never interrupts the motion and per-frame state updates never
// drop the frame rate.

import { useEffect, useLayoutEffect, useMemo, useRef, useState, useSyncExternalStore, type CSSProperties } from "react";
import { Button } from "../../devlink/elements/Button";

// ────────────────────────────────────────────────────────────────────────
// Design tokens — reused from the site's existing CSS custom properties
// (see devlink/css/variables.css) where they already match the handoff's
// values exactly. Two tokens (muted text, tan border) are new per the
// handoff's own design-tokens table and are not yet in the shared palette.
// ────────────────────────────────────────────────────────────────────────
const NAVY = "var(--_colors-•-primitives---neutral--neutral-navy)"; // #130E30
const TAN = "var(--_colors-•-primitives---tan--tan)"; // #EFF2E5
const YELLOW = "var(--_colors-•-primitives---brand--yellow)"; // #FFE228
const MAGENTA = "var(--_colors-•-primitives---brand--magenta)"; // #E261E5
const BLUE = "var(--_colors-•-primitives---brand--blue)"; // #3A93FF
const GREEN = "var(--_colors-•-primitives---brand--green)"; // #59E25D
const MUTED = "#4A4660"; // new token — the handoff's muted text, distinct from the sitewide grey
const SERIF = "var(--font-family--headings)"; // Hedvig Letters Serif (already mapped in globals.css)
const SANS = "var(--font-family--paragraph)"; // Inter (already mapped in globals.css)

export type HeroCarouselCopy = {
  eyebrow: string;
  headline: [string, string, string];
  subhead: string;
  ctaLabel: string;
  ctaNote: string;
  coachName: string;
  coachMessages: [string, string, string, string, string];
  frameworkNames: [string, string, string, string, string];
  demoHref: string;
};

// ────────────────────────────────────────────────────────────────────────
// The canonical 16-shape set every card draws from (SHAPE16 in the
// reference file). Colors cycle magenta → yellow → green → blue.
// ────────────────────────────────────────────────────────────────────────
type ShapeKind = "circle" | "oval" | "diamond" | "tri";
type ShapeSeed = { c: string; k: ShapeKind; w: number; h: number };

const SHAPE16: ShapeSeed[] = [
  { c: MAGENTA, k: "circle", w: 0.1, h: 0.1 },
  { c: YELLOW, k: "oval", w: 0.15, h: 0.092 },
  { c: GREEN, k: "diamond", w: 0.115, h: 0.115 },
  { c: BLUE, k: "circle", w: 0.086, h: 0.086 },
  { c: MAGENTA, k: "oval", w: 0.14, h: 0.088 },
  { c: YELLOW, k: "circle", w: 0.12, h: 0.12 },
  { c: GREEN, k: "oval", w: 0.158, h: 0.095 },
  { c: BLUE, k: "circle", w: 0.096, h: 0.096 },
  { c: MAGENTA, k: "oval", w: 0.205, h: 0.086 },
  { c: YELLOW, k: "circle", w: 0.092, h: 0.092 },
  { c: GREEN, k: "circle", w: 0.11, h: 0.11 },
  { c: MAGENTA, k: "tri", w: 0.125, h: 0.132 },
  { c: BLUE, k: "oval", w: 0.145, h: 0.09 },
  { c: YELLOW, k: "circle", w: 0.104, h: 0.104 },
  { c: GREEN, k: "circle", w: 0.088, h: 0.088 },
  { c: BLUE, k: "diamond", w: 0.108, h: 0.108 },
];
const DIAMOND_PTS = [
  { x: 0.5, y: 0 },
  { x: 1, y: 0.5 },
  { x: 0.5, y: 1 },
  { x: 0, y: 0.5 },
];
const TRI_PTS = [
  { x: 0.06, y: 0.03 },
  { x: 0.98, y: 0.5 },
  { x: 0.06, y: 0.97 },
];

function nrm(x: number, y: number) {
  const l = Math.hypot(x, y) || 1;
  return { x: x / l, y: y / l };
}

// Rounded-corner polygon as a percentage clip-path, so diamonds and the play
// triangle stay axis-aligned and symmetrical at any size — no rotation.
function roundedPoly(pts: { x: number; y: number }[], w: number, h: number, r: number, seg: number) {
  const P = pts.map((p) => ({ x: p.x * w, y: p.y * h }));
  const n = P.length;
  const out: string[] = [];
  for (let i = 0; i < n; i++) {
    const p = P[i],
      a = P[(i - 1 + n) % n],
      b = P[(i + 1) % n];
    const v1 = nrm(a.x - p.x, a.y - p.y),
      v2 = nrm(b.x - p.x, b.y - p.y);
    const ang = Math.acos(Math.max(-1, Math.min(1, v1.x * v2.x + v1.y * v2.y)));
    const half = Math.max(0.05, ang / 2);
    const t = Math.min(r / Math.tan(half), Math.hypot(a.x - p.x, a.y - p.y) / 2, Math.hypot(b.x - p.x, b.y - p.y) / 2);
    const rr = t * Math.tan(half);
    const s1 = { x: p.x + v1.x * t, y: p.y + v1.y * t };
    const s2 = { x: p.x + v2.x * t, y: p.y + v2.y * t };
    const bis = nrm(v1.x + v2.x, v1.y + v2.y);
    const d = rr / Math.sin(half);
    const cx = p.x + bis.x * d,
      cy = p.y + bis.y * d;
    const a1 = Math.atan2(s1.y - cy, s1.x - cx);
    let da = Math.atan2(s2.y - cy, s2.x - cx) - a1;
    while (da > Math.PI) da -= 2 * Math.PI;
    while (da < -Math.PI) da += 2 * Math.PI;
    for (let k = 0; k <= seg; k++) {
      const th = a1 + (da * k) / seg;
      out.push(
        ((cx + Math.cos(th) * rr) / w * 100).toFixed(2) + "% " + ((cy + Math.sin(th) * rr) / h * 100).toFixed(2) + "%"
      );
    }
  }
  return "polygon(" + out.join(", ") + ")";
}

type ShapeDef = {
  i: number;
  c: string;
  kind: ShapeKind;
  px: number;
  py: number;
  w: string;
  h: string;
  mx: string;
  my: string;
  br: string;
  clip: string;
};

const SHAPE_SCALE = 1.55; // the one size every card draws at — no per-card scaling
function shapeDef(i: number, base: number, mult = 1): ShapeDef {
  const s = SHAPE16[((i % 16) + 16) % 16];
  const m = mult * SHAPE_SCALE;
  const w = s.w * base * m,
    h = s.h * base * m;
  const o: ShapeDef = {
    i,
    c: s.c,
    kind: s.k,
    px: w,
    py: h,
    w: w.toFixed(1) + "px",
    h: h.toFixed(1) + "px",
    mx: (-w / 2).toFixed(1) + "px",
    my: (-h / 2).toFixed(1) + "px",
    br: "999px",
    clip: "none",
  };
  if (s.k === "diamond") {
    o.br = "0";
    o.clip = roundedPoly(DIAMOND_PTS, w, h, Math.min(w, h) * 0.19, 5);
  } else if (s.k === "tri") {
    o.br = "0";
    o.clip = roundedPoly(TRI_PTS, w, h, Math.min(w, h) * 0.22, 5);
  }
  return o;
}

// ────────────────────────────────────────────────────────────────────────
// Carousel geometry
// ────────────────────────────────────────────────────────────────────────
const N = 5; // EcoVadis, CDP, ISO 14001, VSME, Carbon footprint
const COPIES = 3; // 3 identical copies (15 nodes) so the loop is seamless
const CARD_FRAC = 0.7; // card width as a share of the panel, ≥720px
const GAP_FRAC = 0.02;
const GAP_EXTRA_PX = 10;
const GLIDE_MS = 900;
const HOLD_MS = 2700;
const PEAK_GAP_PX = 10;
const TRAVEL_CURVE: [number, number, number, number] = [0.65, 0, 0.35, 1];
const CHAIN_MAX = 5;

function geometry(cw: number) {
  const cardW = cw * (cw < 640 ? 0.82 : CARD_FRAC);
  const gap = cw * GAP_FRAC + GAP_EXTRA_PX;
  return { cw, cardW, gap, step: cardW + gap };
}

function bezY(x1: number, y1: number, x2: number, y2: number, x: number) {
  const cx = (t: number) => 3 * (1 - t) * (1 - t) * t * x1 + 3 * (1 - t) * t * t * x2 + t * t * t;
  const cy = (t: number) => 3 * (1 - t) * (1 - t) * t * y1 + 3 * (1 - t) * t * t * y2 + t * t * t;
  let lo = 0,
    hi = 1,
    t = x;
  for (let k = 0; k < 24; k++) {
    t = (lo + hi) / 2;
    if (cx(t) < x) lo = t;
    else hi = t;
  }
  return cy(t);
}
function curveCss(c: [number, number, number, number]) {
  return `cubic-bezier(${c[0]}, ${c[1]}, ${c[2]}, ${c[3]})`;
}
function timeToCover(dist: number, dur: number, target: number) {
  if (dist <= 0) return 0;
  for (let k = 1; k <= 200; k++) {
    const t = k / 200;
    if (bezY(TRAVEL_CURVE[0], TRAVEL_CURVE[1], TRAVEL_CURVE[2], TRAVEL_CURVE[3], t) * dist >= target) {
      return Math.round(t * dur);
    }
  }
  return dur;
}
function clamp01(v: number) {
  return Math.max(0, Math.min(1, v));
}
function ease(c: [number, number, number, number], p: number) {
  return bezY(c[0], c[1], c[2], c[3], clamp01(p));
}
function easeOutCubic(p: number) {
  return 1 - Math.pow(1 - p, 3);
}
function lcg(seed: number) {
  let s = seed;
  return () => (s = (s * 1664525 + 1013904223) % 4294967296) / 4294967296;
}
function bez3(a: { x: number; y: number }, b: { x: number; y: number }, c: { x: number; y: number }, d: { x: number; y: number }, s: number) {
  const u = 1 - s;
  return {
    x: u * u * u * a.x + 3 * u * u * s * b.x + 3 * u * s * s * c.x + s * s * s * d.x,
    y: u * u * u * a.y + 3 * u * u * s * b.y + 3 * u * s * s * c.y + s * s * s * d.y,
  };
}
function bez3d(a: { x: number; y: number }, b: { x: number; y: number }, c: { x: number; y: number }, d: { x: number; y: number }, s: number) {
  const u = 1 - s;
  return {
    x: 3 * (u * u * (b.x - a.x) + 2 * u * s * (c.x - b.x) + s * s * (d.x - c.x)),
    y: 3 * (u * u * (b.y - a.y) + 2 * u * s * (c.y - b.y) + s * s * (d.y - c.y)),
  };
}

// ---- ring (card 1, EcoVadis) ----
const RING_N = 16;
const ENTRY_ANGLE = [200, 15, 130, 300, 75, 245, 350, 110, 165, 285, 55, 320, 145, 225, 35, 260];
const ENTRY_DUR = [1001, 744, 1115, 801, 930, 715, 1058, 829, 972, 772, 1030, 858, 1087, 887, 960, 790];
const ENTRY_DELAY = [0, 100, 43, 143, 22, 114, 65, 157, 100, 36, 79, 136, 57, 122, 88, 30];
const OMEGA = 100; // deg of the curve per second
const LAG = (360 / OMEGA) * 1000 / RING_N;
const TAU_EXIT = 1900; // path time at which the curve starts spiralling out
const EXIT_DEG = 4;
const A0 = EXIT_DEG - (OMEGA * TAU_EXIT) / 1000;
const SWEEP_DECAY = 430;
const DIP = 0.42;
const LIFT = 0.6;
const OUT_TAU = 1400;
const OUT_GROWTH = 3.6;
const ACC_RAMP = 600;
const ACC_MAX = 1.6;

// ---- pass2 (card 2, CDP) ----
const CHAIN_GAP = 0.72;
const DUR2 = 3530;
const CHAIN_A = [0, 1, 2, 3, 4, 5, 6, 7];
const CHAIN_B = [8, 9, 10, 11, 12, 13, 14, 15];

// ---- fly (card 3, ISO 14001) ----
const FLY_N = 16;
const FLY_STAGGER = 92;
const RISE = 880,
  FALLB = 680,
  SETTLE_HOLD = 850,
  EXIT_DUR = 860,
  EXIT_STAGGER = 25;
const RISE_CURVE: [number, number, number, number] = [0.14, 0.8, 0.28, 1];
const FALL_CURVE: [number, number, number, number] = [0.45, 0, 0.75, 0.55];
const LANE_HOLD = 0.46;
const LANE_CURVE: [number, number, number, number] = [0.6, 0, 0.4, 1];
const EXIT_CURVE: [number, number, number, number] = [0.42, 0, 1, 1];
const MOUND_PLAN: [number, number][][] = [
  [[8, 0], [7, 0]],
  [[6, 0], [9, 0]],
  [[12, 0], [2, 0]],
  [[5, 0], [0, 0]],
  [[3, 0], [15, 0]],
  [[4, 0], [14, 0]],
  [[1, 0], [11, 0]],
  [[10, 0], [13, 0]],
];
const MOUND_LAUNCH = [-0.26, 0.3, -0.18, 0.28, -0.32, 0.2, -0.24, 0.32, -0.2, 0.26, -0.3, 0.18, -0.28, 0.31, -0.22, 0.25];
const MOUND_SHIFT: number[] = [];
const MOUND_LAP = 1.12;
const MOUND_STACK = 0.56;

// ---- burst (card 4, VSME) ----
const BURST_N = 8;
const BURST_SPOTS: [number, number][] = [
  [-0.26, -0.34],
  [0.26, -0.34],
  [0.26, -0.113],
  [-0.26, -0.113],
  [-0.26, 0.113],
  [0.26, 0.113],
  [0.26, 0.34],
  [-0.26, 0.34],
];
const SPIN_RATE = 330;
const WHIRL_OUT = 900;
const BURST_STAG = 80;
const BURST_EXIT = 3500,
  BURST_EXIT_DUR = 720,
  BURST_EXIT_STAG = 45;
const GROW_CURVE: [number, number, number, number] = [0.34, 1.45, 0.64, 1];

// ---- fall (card 5, Carbon footprint) ----
const FALL_N = 16;
const FALL_TRAVEL = 3000;
const FALL_LAP = 0.8;

// ────────────────────────────────────────────────────────────────────────
// Per-animation layout builders — pure functions of the card's own box
// (base = min(cardW, cardH·0.92)). Each returns the shape list to render
// plus the params its paint function needs every frame.
// ────────────────────────────────────────────────────────────────────────
type RingPath = { R: number; base: number; seats: { ex: number; ey: number }[]; spin: number[] };
function buildRing(cardW: number, cardH: number): { shapes: ShapeDef[]; path: RingPath | null } {
  const base = Math.min(cardW, cardH);
  if (!base) return { shapes: [], path: null };
  const R = base * 0.33;
  const shapes: ShapeDef[] = [];
  const seats: { ex: number; ey: number }[] = [];
  const spin: number[] = [];
  for (let i = 0; i < RING_N; i++) {
    const sh = shapeDef(i, base);
    spin.push(sh.kind === "oval" ? 1 : 0);
    const p = (ENTRY_ANGLE[i] * Math.PI) / 180;
    const cs = Math.cos(p),
      sn = Math.sin(p);
    const t = Math.min(
      Math.abs(cs) > 1e-3 ? (cardW / 2 + sh.px) / Math.abs(cs) : 1e6,
      Math.abs(sn) > 1e-3 ? (cardH / 2 + sh.py) / Math.abs(sn) : 1e6
    );
    seats.push({ ex: cs * t, ey: sn * t });
    shapes.push(sh);
  }
  return { shapes, path: { R, base, seats, spin } };
}

type Bez4 = { a: { x: number; y: number }; b: { x: number; y: number }; c: { x: number; y: number }; d: { x: number; y: number }; len: number };
function pass2Curve(cardW: number, cardH: number): Bez4 {
  const W = cardW,
    H = cardH;
  const c = {
    a: { x: -W * 0.68, y: H * 0.6 - 170 },
    b: { x: -W * 0.34, y: H * 0.22 },
    c: { x: W * 0.14, y: -H * 0.06 },
    d: { x: 0, y: -H * 0.8 },
  };
  let len = 0,
    prev = bez3(c.a, c.b, c.c, c.d, 0);
  for (let k = 1; k <= 40; k++) {
    const pt = bez3(c.a, c.b, c.c, c.d, k / 40);
    len += Math.hypot(pt.x - prev.x, pt.y - prev.y);
    prev = pt;
  }
  return { ...c, len };
}
type ChainMeta = { delays: number[]; spin: number[]; n: number; total: number };
function buildChain(idxs: number[], cardW: number, cardH: number, curve: Bez4 | null): { shapes: ShapeDef[]; meta: ChainMeta | null } {
  const base = Math.min(cardW, cardH);
  if (!base || !curve) return { shapes: [], meta: null };
  const shapes: ShapeDef[] = [];
  const radii: number[] = [],
    delays: number[] = [],
    spin: number[] = [];
  for (let i = 0; i < idxs.length; i++) {
    const sh = shapeDef(idxs[i], base);
    spin.push(sh.kind === "oval" ? 1 : 0);
    radii.push(0.5 * Math.max(sh.px, sh.py));
    delays.push(i === 0 ? 0 : delays[i - 1] + (CHAIN_GAP * (radii[i - 1] + radii[i])) / curve.len * DUR2);
    shapes.push({ ...sh, i });
  }
  return { shapes, meta: { delays, spin, n: idxs.length, total: delays[idxs.length - 1] + DUR2 } };
}

type FlyLayout = { beads: { x: number; rot: number; drift: number; launch: number; rest: number; delay: number; peak: number }[]; start: number; settled: number; total: number };
function buildFly(cardW: number, cardH: number): { shapes: ShapeDef[]; fly: FlyLayout | null } {
  const base = Math.min(cardW, cardH);
  if (!cardW || !cardH) return { shapes: [], fly: null };
  const rnd = lcg(20260820);
  const shapes: ShapeDef[] = [];
  const defs: ShapeDef[] = [];
  for (let i = 0; i < FLY_N; i++) {
    const sh = shapeDef(i, base);
    defs.push(sh);
    shapes.push(sh);
  }
  const rows = MOUND_PLAN.map((row) =>
    row.map((e) => {
      const d = defs[e[0]],
        rad = (e[1] * Math.PI) / 180;
      const cs = Math.abs(Math.cos(rad)),
        sn = Math.abs(Math.sin(rad));
      return { si: e[0], rot: e[1], w: cs * d.px + sn * d.py, h: cs * d.py + sn * d.px };
    })
  );
  const rowH = rows.map((row) => Math.max(...row.map((s) => s.h)));
  const rowY = [cardH / 2 - rowH[0] / 2 - cardH * 0.02];
  for (let r = 1; r < rows.length; r++) rowY.push(rowY[r - 1] - (MOUND_STACK * (rowH[r - 1] + rowH[r])) / 2);
  const last = rows.length - 1;
  const mid = (rowY[0] + rowH[0] / 2 + (rowY[last] - rowH[last] / 2)) / 2;
  for (let r = 0; r <= last; r++) rowY[r] -= mid - cardH * 0.12;
  const stackSpan = rowY[0] + rowH[0] / 2 - (rowY[last] - rowH[last] / 2);
  const cols = Math.max(...rows.map((row) => row.length));
  const colW: number[] = [];
  for (let c = 0; c < cols; c++) colW.push(Math.max(...rows.map((row) => (row[c] ? row[c].w : 0))));
  const colStep: number[] = [];
  for (let c = 1; c < cols; c++) colStep.push((MOUND_LAP * (colW[c - 1] + colW[c])) / 2);
  const colSpan = colStep.reduce((a, b) => a + b, 0);
  const colX = [-(colSpan + colW[0] / 2 + colW[cols - 1] / 2) / 2 + colW[0] / 2];
  for (let c = 1; c < cols; c++) colX.push(colX[c - 1] + colStep[c - 1]);
  let delay = 0;
  const beads: FlyLayout["beads"] = new Array(FLY_N);
  rows.forEach((row, r) => {
    row.forEach((s, i) => {
      const x = colX[i] + (MOUND_SHIFT[r] || 0) * cardW;
      beads[s.si] = {
        x,
        rot: s.rot,
        drift: ((s.si % 2 ? 1 : -1) * (0.13 + rnd() * 0.19) + (rnd() * 0.12 - 0.06)) * cardW,
        launch: (MOUND_LAUNCH[s.si] || 0) * cardW,
        rest: rowY[r],
        delay,
        peak: cardH * (0.11 + rnd() * 0.05),
      };
      delay += FLY_STAGGER;
    });
  });
  const clear = cardH / 2 + stackSpan / 2 + 30;
  return {
    shapes,
    fly: {
      beads,
      start: clear,
      settled: (FLY_N - 1) * FLY_STAGGER + RISE + FALLB,
      total: (FLY_N - 1) * FLY_STAGGER + RISE + FALLB + SETTLE_HOLD + EXIT_DUR + (FLY_N - 1) * EXIT_STAGGER,
    },
  };
}

type BurstParam = { x: number; y: number; dist: number; pair: number; phase: number; orbit: number };
function buildBurst(cardW: number, cardH: number): { shapes: ShapeDef[]; burst: BurstParam[]; total: number } {
  const base = Math.min(cardW, cardH);
  if (!base) return { shapes: [], burst: [], total: 0 };
  const dist = Math.hypot(cardW, cardH) / 2 + base * 0.6;
  const params: BurstParam[] = [];
  const shapes: ShapeDef[] = [];
  for (let p = 0; p < BURST_N; p++) {
    const x = BURST_SPOTS[p][0] * cardW,
      y = BURST_SPOTS[p][1] * cardH;
    const anchor = shapeDef(2 * p, base),
      partner = shapeDef(2 * p + 1, base);
    const orbit = (0.28 * (Math.max(anchor.px, anchor.py) + Math.max(partner.px, partner.py))) / 2;
    const common = { x, y, dist, pair: p, orbit };
    params.push({ ...common, phase: p * 47 });
    shapes.push({ ...anchor, i: shapes.length });
    params.push({ ...common, phase: p * 47 + 180 });
    shapes.push({ ...partner, i: shapes.length });
  }
  return { shapes, burst: params, total: BURST_EXIT + (BURST_N - 1) * BURST_EXIT_STAG + BURST_EXIT_DUR };
}

type FallParam = { ux: number; uy: number; s0: number; travel: number; speed: number; delay: number; spin: number };
function buildFall(cardW: number, cardH: number): { shapes: ShapeDef[]; fall: FallParam[]; total: number } {
  const base = Math.min(cardW, cardH);
  if (!base) return { shapes: [], fall: [], total: 0 };
  const shapes: ShapeDef[] = [];
  const defs: ShapeDef[] = [];
  const params: FallParam[] = new Array(FALL_N);
  for (let i = 0; i < FALL_N; i++) {
    const d = shapeDef(i, base, 1);
    defs.push(d);
    shapes.push(d);
  }
  const half = Math.hypot(cardW, cardH) / 2;
  let span = 0;
  ([
    { idx: [0, 1, 2, 3, 4, 5, 6, 7], dx: cardW, dy: cardH },
    { idx: [8, 9, 10, 11, 12, 13, 14, 15], dx: cardW, dy: -cardH },
  ] as const).forEach((ch) => {
    const l = Math.hypot(ch.dx, ch.dy),
      ux = ch.dx / l,
      uy = ch.dy / l;
    const rad = ch.idx.map((i) =>
      defs[i].kind === "oval" ? 0.5 * Math.min(defs[i].px, defs[i].py) : 0.5 * (Math.abs(ux) * defs[i].px + Math.abs(uy) * defs[i].py)
    );
    const margin = Math.max(...ch.idx.map((i) => Math.max(defs[i].px, defs[i].py)));
    const travel = 2 * (half + margin);
    const speed = travel / FALL_TRAVEL;
    let off = 0;
    ch.idx.forEach((i, k) => {
      if (k > 0) off += FALL_LAP * (rad[k - 1] + rad[k]);
      params[i] = { ux, uy, s0: -(half + margin), travel, speed, delay: off / speed, spin: defs[i].kind === "oval" ? 1 : 0 };
      span = Math.max(span, params[i].delay);
    });
  });
  return { shapes, fall: params, total: span + FALL_TRAVEL };
}

// ────────────────────────────────────────────────────────────────────────
// Paint functions — write `transform` straight to the DOM every frame.
// ────────────────────────────────────────────────────────────────────────
function paintRing(host: HTMLElement, path: RingPath, tau: number, t: number) {
  const pose: string[] = [];
  for (let i = 0; i < RING_N; i++) {
    const ti = tau - i * LAG;
    const over = Math.max(0, ti - TAU_EXIT);
    const spun = Math.min(ti, TAU_EXIT) + SWEEP_DECAY * (1 - Math.exp(-over / SWEEP_DECAY));
    const ang = A0 + (OMEGA * spun) / 1000;
    const rad = (ang * Math.PI) / 180;
    const u = Math.max(0, (ti - TAU_EXIT) / OUT_TAU);
    const r = path.R * (1 + OUT_GROWTH * u * u);
    let x = Math.cos(rad) * r,
      y = Math.sin(rad) * r + path.base * (DIP * u * u - LIFT * u * u * u);
    const p = clamp01((t - ENTRY_DELAY[i]) / ENTRY_DUR[i]);
    if (p < 1) {
      const e = easeOutCubic(p);
      x = path.seats[i].ex + (x - path.seats[i].ex) * e;
      y = path.seats[i].ey + (y - path.seats[i].ey) * e;
    }
    pose[i] = `translate(${x.toFixed(1)}px, ${y.toFixed(1)}px)` + (path.spin[i] ? ` rotate(${ang.toFixed(1)}deg)` : "");
  }
  host.querySelectorAll("[data-ring-i]").forEach((n) => {
    const el = n as HTMLElement;
    el.style.transform = pose[+el.getAttribute("data-ring-i")!];
    el.style.visibility = "visible";
  });
}

function paintPass2(host: HTMLElement, curve: Bez4, chainA: ChainMeta, chainB: ChainMeta, t2p: number) {
  const { a, b, c, d } = curve;
  const build = (meta: ChainMeta, flip: boolean) => {
    const list: string[] = [];
    for (let i = 0; i < meta.n; i++) {
      const s = clamp01((t2p - meta.delays[i]) / DUR2);
      const pt = bez3(a, b, c, d, s);
      const k = flip ? -1 : 1;
      let rot = "";
      if (meta.spin[i]) {
        const dv = bez3d(a, b, c, d, s);
        rot = ` rotate(${(Math.atan2(dv.y, dv.x) * 180 / Math.PI + (flip ? 180 : 0)).toFixed(1)}deg)`;
      }
      list[i] = `translate(${(k * pt.x).toFixed(1)}px, ${(k * pt.y).toFixed(1)}px)${rot}`;
    }
    return list;
  };
  const pose = build(chainA, false);
  const mirror = build(chainB, true);
  host.querySelectorAll("[data-pass2-i]").forEach((n) => {
    const el = n as HTMLElement;
    el.style.transform = pose[+el.getAttribute("data-pass2-i")!];
    el.style.visibility = "visible";
  });
  host.querySelectorAll("[data-pass2b-i]").forEach((n) => {
    const el = n as HTMLElement;
    el.style.transform = mirror[+el.getAttribute("data-pass2b-i")!];
    el.style.visibility = "visible";
  });
}

function paintFly(host: HTMLElement, fly: FlyLayout, t5p: number) {
  const pose = fly.beads.map((bd) => {
    const t = t5p - bd.delay;
    let off: number;
    if (t <= 0) off = fly.start;
    else if (t < RISE) off = fly.start + (-bd.peak - fly.start) * ease(RISE_CURVE, t / RISE);
    else if (t < RISE + FALLB) off = -bd.peak * (1 - ease(FALL_CURVE, (t - RISE) / FALLB));
    else off = 0;
    let dx = 0;
    if (t <= 0) dx = bd.launch;
    else if (t < RISE) {
      const h = Math.max(0, (t / RISE - LANE_HOLD) / (1 - LANE_HOLD));
      dx = bd.launch * (1 - ease(LANE_CURVE, Math.min(1, h)));
    }
    const te = t5p - fly.settled - SETTLE_HOLD;
    if (te > 0) {
      const p = clamp01(te / EXIT_DUR);
      off = fly.start * p * p;
      dx = bd.drift * p;
    }
    return `translate(${(bd.x + dx).toFixed(1)}px, ${(bd.rest + off).toFixed(1)}px)` + (bd.rot ? ` rotate(${bd.rot}deg)` : "");
  });
  host.querySelectorAll("[data-fly-i]").forEach((n) => {
    const el = n as HTMLElement;
    el.style.transform = pose[+el.getAttribute("data-fly-i")!];
    el.style.visibility = "visible";
  });
}

function paintBurst(host: HTMLElement, burst: BurstParam[], t6p: number, blastDir: ({ x: number; y: number; dx: number; dy: number } | undefined)[]) {
  const pose = burst.map((bp, idx) => {
    const t = t6p - bp.pair * BURST_STAG;
    const sc = t <= 0 ? 0 : ease(GROW_CURVE, t / 320);
    const te = t6p - BURST_EXIT;
    const p = te > 0 ? ease(EXIT_CURVE, te / BURST_EXIT_DUR) : 0;
    const spin = (SPIN_RATE * Math.max(0, t)) / 1000 + WHIRL_OUT * p;
    const a = ((bp.phase + spin) * Math.PI) / 180;
    let x = bp.x + Math.cos(a) * bp.orbit,
      y = bp.y + Math.sin(a) * bp.orbit;
    if (p > 0) {
      if (!blastDir[idx]) {
        const len = Math.hypot(x, y) || 1;
        blastDir[idx] = { x, y, dx: x / len, dy: y / len };
      }
      const f = blastDir[idx]!;
      x = f.x + f.dx * bp.dist * p;
      y = f.y + f.dy * bp.dist * p;
    }
    return `translate(${x.toFixed(1)}px, ${y.toFixed(1)}px) scale(${Math.max(0, sc).toFixed(3)})`;
  });
  host.querySelectorAll("[data-burst-i]").forEach((n) => {
    const el = n as HTMLElement;
    el.style.transform = pose[+el.getAttribute("data-burst-i")!];
    el.style.visibility = "visible";
  });
}

function paintFall(host: HTMLElement, fall: FallParam[], t3p: number) {
  const pose: string[] = [];
  for (let i = 0; i < FALL_N; i++) {
    const p = fall[i];
    const run = Math.max(0, Math.min(p.travel / p.speed, t3p - p.delay));
    const s = p.s0 + p.speed * run;
    const rot = p.spin ? (200 * run) / (p.travel / p.speed) : 0;
    pose[i] = `translate(${(p.ux * s).toFixed(1)}px, ${(p.uy * s).toFixed(1)}px)` + (p.spin ? ` rotate(${rot.toFixed(1)}deg)` : "");
  }
  host.querySelectorAll("[data-fall-i]").forEach((n) => {
    const el = n as HTMLElement;
    const i = +el.getAttribute("data-fall-i")!;
    el.style.transform = pose[i];
    el.style.opacity = "1";
    el.style.visibility = "visible";
  });
}

// ────────────────────────────────────────────────────────────────────────
// Component
// ────────────────────────────────────────────────────────────────────────
const CARD_KIND = ["ring", "pass2", "fly", "burst", "fall"] as const;

// prefers-reduced-motion, subscribed via useSyncExternalStore (the React-
// recommended way to read a browser API without a hydration mismatch or a
// setState-in-effect): the server/pre-hydration snapshot is `false`, then
// the real preference takes over on the client.
function subscribeReducedMotion(callback: () => void) {
  const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
  mq.addEventListener("change", callback);
  return () => mq.removeEventListener("change", callback);
}
function getReducedMotionSnapshot() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}
function getReducedMotionServerSnapshot() {
  return false;
}

export function HeroBeadsCarousel({ copy }: { copy: HeroCarouselCopy }) {
  const hostRef = useRef<HTMLDivElement | null>(null);
  const [cw, setCw] = useState(0);
  const [ch, setCh] = useState(0);
  const [vw, setVw] = useState(1440);
  const reducedMotion = useSyncExternalStore(subscribeReducedMotion, getReducedMotionSnapshot, getReducedMotionServerSnapshot);

  // Carousel position: `carouselRef` is the synchronous source of truth the
  // scheduling timers (tick/start, below) read and mutate outside of render;
  // `carousel` (plain state) is what render actually reads from, kept in
  // sync every time the ref changes so JSX never touches a ref during render.
  const carouselRef = useRef({ i: 0, animate: false });
  const [carousel, setCarouselState] = useState({ i: 0, animate: false });
  const setCarousel = (patch: Partial<{ i: number; animate: boolean }>) => {
    Object.assign(carouselRef.current, patch);
    setCarouselState({ ...carouselRef.current });
  };

  // ---- measure the animation panel + viewport (breakpoints) ----
  useEffect(() => {
    const measure = () => {
      const el = hostRef.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      setCw(r.width);
      setCh(r.height);
      setVw(window.innerWidth);
    };
    measure();
    window.addEventListener("resize", measure);
    const ro = new ResizeObserver(measure);
    if (hostRef.current) ro.observe(hostRef.current);
    return () => {
      window.removeEventListener("resize", measure);
      ro.disconnect();
    };
  }, []);

  // ---- per-animation layout (recomputed only when the panel is resized) ----
  const layout = useMemo(() => {
    const g = geometry(cw);
    const cardH = ch * 0.92;
    const ring = buildRing(g.cardW, cardH);
    const curve = pass2Curve(g.cardW, cardH);
    const chainA = buildChain(CHAIN_A, g.cardW, cardH, curve);
    const chainB = buildChain(CHAIN_B, g.cardW, cardH, curve);
    const fly = buildFly(g.cardW, cardH);
    const burst = buildBurst(g.cardW, cardH);
    const fall = buildFall(g.cardW, cardH);
    return { g, cardH, ring, curve, chainA, chainB, fly, burst, fall };
  }, [cw, ch]);

  // refs the rAF loop reads every frame — never trigger re-renders. Synced
  // via useLayoutEffect (not written during render) so the loop always sees
  // the latest layout without waiting an extra paint cycle.
  const layoutRef = useRef(layout);
  useLayoutEffect(() => {
    layoutRef.current = layout;
  }, [layout]);
  const blastDirRef = useRef<({ x: number; y: number; dx: number; dy: number } | undefined)[]>([]);

  // ---- reduced motion: hold every card at rest, repainted whenever the
  // panel is (re)measured, so a late layout doesn't leave stale positions ----
  useEffect(() => {
    if (!reducedMotion) return;
    const host = hostRef.current;
    if (!host) return;
    if (layout.ring.path) paintRing(host, layout.ring.path, 0, 0);
    if (layout.chainA.meta && layout.chainB.meta) paintPass2(host, layout.curve, layout.chainA.meta, layout.chainB.meta, 0);
    if (layout.fly.fly) paintFly(host, layout.fly.fly, 0);
    paintBurst(host, layout.burst.burst, 0, blastDirRef.current);
    if (layout.fall.fall.length) paintFall(host, layout.fall.fall, 0);
  }, [reducedMotion, layout]);

  // ---- carousel advance + shape animation loop ----
  useEffect(() => {
    if (reducedMotion) return; // reduced-motion holds cards static — see the effect above
    const host = hostRef.current;
    if (!host) return;

    const clocks = {
      t: 0, tau: 0, running: true, last: null as number | null,
      t2p: 0, run2: false,
      t3p: 0, run3: false,
      t5p: 0, run5: false,
      t6p: 0, run6: false,
    };

    const replayRing = () => { clocks.t = 0; clocks.tau = 0; clocks.running = true; clocks.last = null; };
    const replayPass2 = () => { clocks.t2p = 0; clocks.run2 = true; };
    const replayFall = () => { clocks.t3p = 0; clocks.run3 = true; };
    const replayBurst = () => { clocks.t6p = 0; clocks.run6 = true; blastDirRef.current = []; };
    const replayFly = () => { clocks.t5p = 0; clocks.run5 = true; };

    // Two independent self-rescheduling rAF chains run here — the continuous
    // paint loop (`frame`) and the "wait until measured" retry in `start`.
    // Each gets its own id so cleanup can cancel both; sharing one variable
    // between them would let whichever chain writes it last orphan the
    // other as an uncancellable loop that outlives this effect.
    let frameRaf = 0;
    let startRaf = 0;
    const frame = (now: number) => {
      frameRaf = requestAnimationFrame(frame);
      const dt = clocks.last == null ? 0 : Math.min(60, now - clocks.last);
      clocks.last = now;
      const l = layoutRef.current;
      if (!l.ring.path) return;
      if (clocks.running) {
        clocks.t += dt;
        const k = 1 + (ACC_MAX - 1) * clamp01((clocks.tau - TAU_EXIT) / ACC_RAMP);
        clocks.tau += dt * k;
        paintRing(host, l.ring.path, clocks.tau, clocks.t);
        if (clocks.tau - (RING_N - 1) * LAG > TAU_EXIT + OUT_TAU * 1.3) clocks.running = false;
      }
      if (clocks.run2) {
        clocks.t2p += dt;
        if (l.chainA.meta && clocks.t2p > l.chainA.meta.total + 200) clocks.run2 = false;
      }
      if (l.chainA.meta && l.chainB.meta) paintPass2(host, l.curve, l.chainA.meta, l.chainB.meta, clocks.t2p);
      if (clocks.run3) {
        clocks.t3p += dt;
        if (clocks.t3p > (l.fall.total || 4000) + 400) clocks.run3 = false;
      }
      if (l.fall.fall.length) paintFall(host, l.fall.fall, clocks.t3p);
      if (clocks.run5) {
        clocks.t5p += dt;
        if (l.fly.fly && clocks.t5p > l.fly.fly.total + 100) clocks.run5 = false;
      }
      if (l.fly.fly) paintFly(host, l.fly.fly, clocks.t5p);
      if (clocks.run6) {
        clocks.t6p += dt;
        if (clocks.t6p > l.burst.total + 100) clocks.run6 = false;
      }
      paintBurst(host, l.burst.burst, clocks.t6p, blastDirRef.current);
    };
    frameRaf = requestAnimationFrame(frame);

    const stagger = () => timeToCover(geometry(layoutRef.current.g.cw).step, GLIDE_MS, PEAK_GAP_PX);

    let t1: ReturnType<typeof setTimeout>, t2: ReturnType<typeof setTimeout>, t3: ReturnType<typeof setTimeout>,
      t4: ReturnType<typeof setTimeout>, t5: ReturnType<typeof setTimeout>, t6: ReturnType<typeof setTimeout>;

    const tick = () => {
      const next = (carouselRef.current.i + 1) % N;
      setCarousel({ i: carouselRef.current.i + 1, animate: true });
      const cycle = GLIDE_MS + CHAIN_MAX * stagger() + HOLD_MS;
      // CDP's chain starts as CDP is about to be centred again
      if (next === 0) {
        clearTimeout(t3);
        t3 = setTimeout(replayPass2, Math.max(0, Math.round(cycle + GLIDE_MS * 0.25 - 500)));
      }
      // ISO's ribbon starts just before that card settles in the middle
      if (next === 1) {
        const settle = GLIDE_MS + CHAIN_MAX * stagger();
        clearTimeout(t5);
        clearTimeout(t6);
        t5 = setTimeout(replayFly, Math.max(0, Math.round(cycle + settle - 1100)));
      }
      // VSME's burst starts just before that card settles in the middle
      if (next === 2) {
        const settle = GLIDE_MS + CHAIN_MAX * stagger();
        clearTimeout(t6);
        t6 = setTimeout(replayBurst, Math.max(0, Math.round(cycle + settle - 750)));
      }
      // Carbon's drop starts just before that card settles in the middle
      if (next === 3) {
        const settle = GLIDE_MS + CHAIN_MAX * stagger();
        clearTimeout(t4);
        t4 = setTimeout(replayFall, Math.max(0, Math.round(cycle + settle - 1250)));
      }
      t1 = setTimeout(() => {
        if (carouselRef.current.i >= N) {
          setCarousel({ i: carouselRef.current.i - N, animate: false });
          replayRing();
        }
        t2 = setTimeout(tick, HOLD_MS);
      }, GLIDE_MS + CHAIN_MAX * stagger());
    };
    const start = () => {
      clearTimeout(t2);
      if (!layoutRef.current.g.cw) {
        startRaf = requestAnimationFrame(start);
        return;
      }
      t2 = setTimeout(tick, HOLD_MS);
      clearTimeout(t3);
      t3 = setTimeout(replayPass2, Math.max(0, HOLD_MS + Math.round(GLIDE_MS * 0.25) - 500));
    };
    start();

    return () => {
      cancelAnimationFrame(frameRaf);
      cancelAnimationFrame(startRaf);
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
      clearTimeout(t5);
      clearTimeout(t6);
    };
    // Only re-mount the loop when motion preference changes; geometry is read
    // live via layoutRef so a resize never restarts (and never stutters) it.
  }, [reducedMotion]);

  // ---- static layout values (breakpoints) ----
  const isPhone = vw < 720;
  const isNarrow = vw < 1024;
  const g = layout.g;
  const glide = GLIDE_MS;
  const stagger = timeToCover(g.step, glide, PEAK_GAP_PX);
  const curveCssStr = curveCss(TRAVEL_CURVE);
  const centered = N + carousel.i;
  const x = (g.cw - g.cardW) / 2 - centered * g.step;

  const heroPad = isPhone
    ? "36px 20px 40px"
    : "clamp(16px, 3.5vh, 32px) 32px clamp(16px, 3.5vh, 32px) clamp(32px, 4vw, 64px)";
  const beadsH = isPhone ? "500px" : isNarrow ? "380px" : "100%";

  const slides = [];
  for (let c = 0; c < COPIES; c++) {
    for (let j = 0; j < N; j++) {
      const idx = c * N + j;
      const rank = Math.min(CHAIN_MAX, Math.max(0, idx - centered + 2));
      slides.push({
        idx,
        j,
        hasCoach: idx === centered,
        transform: `translateX(${x.toFixed(1)}px)`,
        transition:
          carousel.animate && g.cw > 0 ? `transform ${glide}ms ${curveCssStr} ${rank * stagger}ms` : "none",
      });
    }
  }

  return (
    <div
      style={{
        display: isNarrow ? "block" : "grid",
        gridTemplateColumns: isNarrow ? undefined : "46fr 54fr",
        height: isNarrow ? "auto" : "84vh",
        minHeight: isNarrow ? undefined : "680px",
        overflow: isNarrow ? "visible" : "hidden",
        fontFamily: SANS,
        color: NAVY,
      }}
    >
      <style>{`
        @keyframes ditto-hero-coach-in {
          from { opacity: 0; transform: translateY(14px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      {/* Left copy panel */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          gap: "clamp(14px, 2.4vh, 24px)",
          background: YELLOW,
          padding: heroPad,
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: "clamp(14px, 2.6vh, 28px)", maxWidth: 640 }}>
          <div
            style={{
              fontSize: 14,
              fontWeight: 600,
              textTransform: "uppercase",
              letterSpacing: "0.1em",
              color: NAVY,
            }}
          >
            {copy.eyebrow}
          </div>
          <h1
            style={{
              margin: 0,
              fontFamily: SERIF,
              fontWeight: 400,
              fontSize: "clamp(27px, max(7vw, min(3vw, 5.2vh)), 48px)",
              lineHeight: 1.14,
              letterSpacing: "-0.01em",
              display: "flex",
              flexDirection: "column",
            }}
          >
            {copy.headline.map((line, i) => (
              <span key={i}>{line}</span>
            ))}
          </h1>
          <p
            style={{
              margin: 0,
              maxWidth: 520,
              fontSize: 16,
              lineHeight: 1.6,
              letterSpacing: "-0.02em",
              color: MUTED,
            }}
          >
            {copy.subhead}
          </p>
          <div style={{ display: "flex", alignItems: "center", gap: 14, flexWrap: "wrap" }}>
            <div data-cta-placement="homepage_hero">
              <Button arrow={false} text={copy.ctaLabel} link={{ href: copy.demoHref }} />
            </div>
            <span style={{ fontSize: "clamp(13px, min(1.05vw, 1.9vh), 15px)", letterSpacing: "-0.01em", color: MUTED }}>
              {copy.ctaNote}
            </span>
          </div>
        </div>
      </div>

      {/* Right animation panel */}
      <div
        ref={hostRef}
        style={{
          position: "relative",
          height: beadsH,
          background: TAN,
          display: "flex",
          alignItems: "center",
          overflow: "hidden",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", width: "max-content", height: "100%", gap: `${g.gap.toFixed(1)}px` }}>
          {slides.map((slide) => (
            <Card
              key={slide.idx}
              kind={CARD_KIND[slide.j]}
              cardW={g.cardW}
              transform={slide.transform}
              transition={slide.transition}
              hasCoach={slide.hasCoach}
              coachName={copy.coachName}
              coachMessage={copy.coachMessages[slide.j]}
              frameworkName={copy.frameworkNames[slide.j]}
              layout={layout}
              reducedMotion={!!reducedMotion}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

type HeroLayout = {
  g: ReturnType<typeof geometry>;
  cardH: number;
  ring: ReturnType<typeof buildRing>;
  curve: Bez4;
  chainA: ReturnType<typeof buildChain>;
  chainB: ReturnType<typeof buildChain>;
  fly: ReturnType<typeof buildFly>;
  burst: ReturnType<typeof buildBurst>;
  fall: ReturnType<typeof buildFall>;
};

function Card({
  kind,
  cardW,
  transform,
  transition,
  hasCoach,
  coachName,
  coachMessage,
  frameworkName,
  layout,
  reducedMotion,
}: {
  kind: (typeof CARD_KIND)[number];
  cardW: number;
  transform: string;
  transition: string;
  hasCoach: boolean;
  coachName: string;
  coachMessage: string;
  frameworkName: string;
  layout: HeroLayout;
  reducedMotion: boolean;
}) {
  return (
    <div
      aria-label={frameworkName}
      style={{
        position: "relative",
        overflow: "hidden",
        flex: "none",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#FFFFFF",
        border: `1.5px solid ${NAVY}`,
        borderRadius: 28,
        boxSizing: "border-box",
        width: cardW,
        height: "92%",
        transform,
        transition,
      }}
    >
      <CardMark kind={kind} frameworkName={frameworkName} />

      {kind === "ring" && <ShapeLayer shapes={layout.ring.shapes} attr="data-ring-i" />}
      {kind === "pass2" && (
        <>
          <ShapeLayer shapes={layout.chainA.shapes} attr="data-pass2-i" />
          <ShapeLayer shapes={layout.chainB.shapes} attr="data-pass2b-i" />
        </>
      )}
      {kind === "fly" && <ShapeLayer shapes={layout.fly.shapes} attr="data-fly-i" />}
      {kind === "burst" && <ShapeLayer shapes={layout.burst.shapes} attr="data-burst-i" />}
      {kind === "fall" && <ShapeLayer shapes={layout.fall.shapes} attr="data-fall-i" />}

      {hasCoach && (
        <div
          style={{
            position: "absolute",
            left: 16,
            right: 16,
            bottom: 16,
            zIndex: 4,
            display: "flex",
            alignItems: "center",
            gap: 12,
            padding: "12px 14px",
            borderRadius: 22,
            background: "rgba(255, 255, 255, 0.62)",
            backdropFilter: "blur(16px) saturate(1.4)",
            WebkitBackdropFilter: "blur(16px) saturate(1.4)",
            boxShadow: "0 10px 30px rgba(64, 58, 45, 0.10), inset 0 0 0 1px rgba(255, 255, 255, 0.5)",
            opacity: reducedMotion ? 1 : undefined,
            animation: reducedMotion ? undefined : "ditto-hero-coach-in 620ms cubic-bezier(0.22, 0.8, 0.28, 1) both 420ms",
          }}
        >
          <div
            aria-hidden="true"
            style={{
              flex: "none",
              width: 46,
              height: 46,
              borderRadius: 999,
              background: NAVY,
              color: TAN,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontFamily: SANS,
              fontWeight: 700,
              fontSize: 16,
            }}
          >
            {coachName.charAt(0)}
          </div>
          <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: 3 }}>
            <div style={{ fontSize: 14, fontWeight: 700, letterSpacing: "-0.02em", color: MUTED }}>{coachName}</div>
            <div style={{ fontSize: 14, lineHeight: 1.45, letterSpacing: "-0.02em", color: NAVY }}>{coachMessage}</div>
          </div>
        </div>
      )}
    </div>
  );
}

// Framework mark for each card. The handoff references logo PNGs
// (ecovadis.png, cdp.png, iso.png, vsme.png) that were not included in the
// asset bundle handed off for this build — text wordmarks stand in for now
// (card 5's "Carbon" label in the handoff is already text-only, so this
// keeps a consistent look across all five until the real marks land).
function CardMark({ kind, frameworkName }: { kind: (typeof CARD_KIND)[number]; frameworkName: string }) {
  const wordmarkStyle: CSSProperties = {
    position: "absolute",
    top: 26,
    left: "50%",
    transform: "translateX(-50%)",
    zIndex: 2,
    fontFamily: SANS,
    fontWeight: 700,
    fontSize: 22,
    letterSpacing: "-0.01em",
    color: NAVY,
    whiteSpace: "nowrap",
  };
  if (kind === "fly") {
    return (
      <div style={{ ...wordmarkStyle, display: "flex", flexDirection: "column", alignItems: "center", gap: 9 }}>
        <span style={{ fontSize: 26 }}>ISO</span>
        <span style={{ fontWeight: 800, fontSize: 22 }}>14001</span>
      </div>
    );
  }
  if (kind === "fall") {
    return (
      <div style={{ ...wordmarkStyle, fontFamily: SERIF, fontWeight: 400, fontSize: 48, letterSpacing: "-0.01em" }}>
        {frameworkName}
      </div>
    );
  }
  return <div style={wordmarkStyle}>{frameworkName}</div>;
}

function ShapeLayer({ shapes, attr }: { shapes: ShapeDef[]; attr: string }) {
  return (
    <div aria-hidden="true" style={{ position: "absolute", inset: 0, overflow: "hidden" }}>
      {shapes.map((s) => (
        <div
          key={s.i}
          ref={(el) => {
            el?.setAttribute(attr, String(s.i));
          }}
          style={{
            visibility: "hidden",
            position: "absolute",
            left: "50%",
            top: "50%",
            mixBlendMode: "multiply",
            width: s.w,
            height: s.h,
            marginLeft: s.mx,
            marginTop: s.my,
          }}
        >
          <div style={{ width: "100%", height: "100%", background: s.c, borderRadius: s.br, clipPath: s.clip }} />
        </div>
      ))}
    </div>
  );
}
