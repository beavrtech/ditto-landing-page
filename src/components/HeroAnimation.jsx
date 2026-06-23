"use client";
// HeroAnimation.jsx — Ditto homepage hero loop.
// Single self-contained module: embedded timeline engine + scenes.
// Adapted from the Claude Design handoff bundle for the marketing site:
// the dev playback/scrubber chrome is replaced by an autoplay, looping,
// scale-to-width Stage (see below).

import React from "react";

// ════════════════════════════════════════════════════════════════════════
//  TIMELINE ENGINE  (embedded subset of the animations starter)
// ════════════════════════════════════════════════════════════════════════
const Easing = {
  linear: (t) => t,
  easeInQuad: (t) => t * t,
  easeOutQuad: (t) => t * (2 - t),
  easeInOutQuad: (t) => (t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t),
  easeInCubic: (t) => t * t * t,
  easeOutCubic: (t) => (--t) * t * t + 1,
  easeInOutCubic: (t) => (t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1),
  easeOutQuart: (t) => 1 - (--t) * t * t * t,
  easeInOutQuart: (t) => (t < 0.5 ? 8 * t * t * t * t : 1 - 8 * (--t) * t * t * t),
  easeInExpo: (t) => (t === 0 ? 0 : Math.pow(2, 10 * (t - 1))),
  easeOutExpo: (t) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t)),
  easeInSine: (t) => 1 - Math.cos((t * Math.PI) / 2),
  easeOutSine: (t) => Math.sin((t * Math.PI) / 2),
  easeInOutSine: (t) => -(Math.cos(Math.PI * t) - 1) / 2,
  easeOutBack: (t) => {
    const c1 = 1.70158, c3 = c1 + 1;
    return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
  },
  easeInBack: (t) => {
    const c1 = 1.70158, c3 = c1 + 1;
    return c3 * t * t * t - c1 * t * t;
  },
  easeOutElastic: (t) => {
    const c4 = (2 * Math.PI) / 3;
    if (t === 0) return 0;
    if (t === 1) return 1;
    return Math.pow(2, -10 * t) * Math.sin((t * 10 - 0.75) * c4) + 1;
  },
};

const clamp = (v, min, max) => Math.max(min, Math.min(max, v));

function interpolate(input, output, ease = Easing.linear) {
  return (t) => {
    if (t <= input[0]) return output[0];
    if (t >= input[input.length - 1]) return output[output.length - 1];
    for (let i = 0; i < input.length - 1; i++) {
      if (t >= input[i] && t <= input[i + 1]) {
        const span = input[i + 1] - input[i];
        const local = span === 0 ? 0 : (t - input[i]) / span;
        const easeFn = Array.isArray(ease) ? (ease[i] || Easing.linear) : ease;
        return output[i] + (output[i + 1] - output[i]) * easeFn(local);
      }
    }
    return output[output.length - 1];
  };
}

const TimelineContext = React.createContext({ time: 0, duration: 10, playing: false });
const useTime = () => React.useContext(TimelineContext).time;
const useTimeline = () => React.useContext(TimelineContext);

function Stage({ width = 1280, height = 720, duration = 10, background = '#f6f4ef', cropTop = 0, cropBottom = 0, children }) {
  const [time, setTime] = React.useState(0);
  const [scale, setScale] = React.useState(0);
  const [active, setActive] = React.useState(true);
  const wrapRef = React.useRef(null);
  const rafRef = React.useRef(null);
  const lastTsRef = React.useRef(null);
  const reducedRef = React.useRef(false);

  // Respect reduced-motion: hold a single representative frame instead of looping.
  React.useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    reducedRef.current = mq.matches;
    if (mq.matches) setTime(duration * 0.58);
  }, [duration]);

  // Scale the fixed design (e.g. 1920x1080) to the container's width.
  React.useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const measure = () => setScale(el.clientWidth / width);
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [width]);

  // Pause the rAF loop while the hero is scrolled off-screen.
  React.useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setActive(e.isIntersecting), { threshold: 0 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Autoplay + seamless loop.
  React.useEffect(() => {
    if (!active || reducedRef.current) return;
    const step = (ts) => {
      if (lastTsRef.current == null) lastTsRef.current = ts;
      const dt = (ts - lastTsRef.current) / 1000;
      lastTsRef.current = ts;
      setTime((t) => {
        let next = t + dt;
        if (next >= duration) next %= duration;
        return next;
      });
      rafRef.current = requestAnimationFrame(step);
    };
    rafRef.current = requestAnimationFrame(step);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      lastTsRef.current = null;
    };
  }, [active, duration]);

  const ctxValue = React.useMemo(
    () => ({ time, duration, playing: true, setTime, setPlaying: () => {} }),
    [time, duration]
  );

  // Crop empty top/bottom margins of the fixed design (stage px) so the visible
  // "screen" sits tighter to neighbouring sections.
  const visibleHeight = height - cropTop - cropBottom;
  return (
    <div ref={wrapRef} style={{ position: 'relative', width: '100%', aspectRatio: `${width} / ${visibleHeight}`, overflow: 'hidden' }}>
      <div style={{
        position: 'absolute', top: -cropTop * scale, left: 0, width, height, background,
        transform: `scale(${scale})`, transformOrigin: 'top left',
        fontFamily: 'Inter, system-ui, sans-serif',
      }}>
        <TimelineContext.Provider value={ctxValue}>{children}</TimelineContext.Provider>
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════
//  BRAND TOKENS
// ════════════════════════════════════════════════════════════════════════
const C = {
  navy: '#130E30',
  tan: '#EFF2E5',
  tan600: '#E9EBD9',
  tan700: '#D9DDBC',
  white: '#FFFFFF',
  ink: '#130E30',
  muted: '#5F5C6E',
  faint: '#8B8896',
  green: '#59E25D',
  greenDeep: '#1B981E',
  greenMid: '#33D636',
  blue: '#3A93FF',
  magenta: '#E261E5',
  purple: '#605CE7',
  yellow: '#FFE228',
  track: '#E3E7D2',
  border: '#ECECEC',
  borderTan: '#E1E5CF',
  barGray: '#C8CBB3',
};
const SERIF = '"Hedvig Letters Serif", Georgia, serif';
const SANS = 'Inter, system-ui, sans-serif';
const SHADOW_CARD = '0 2px 8px rgba(27,36,44,0.08)';
const SHADOW_FLOAT = '0 24px 60px rgba(64,58,45,0.18)';

// timing helpers
const seg = (t, s, e) => clamp((t - s) / (e - s), 0, 1);
const lerp = (a, b, t) => a + (b - a) * t;
// fade in over [a,b], out over [c,d]
const fade = (t, a, b, c, d) => {
  if (t < a) return 0;
  if (t < b) return Easing.easeOutCubic(seg(t, a, b));
  if (t < c) return 1;
  if (t < d) return 1 - Easing.easeInCubic(seg(t, c, d));
  return 0;
};

// ════════════════════════════════════════════════════════════════════════
//  BRAND GLYPHS
// ════════════════════════════════════════════════════════════════════════
function DittoWordmark({ height = 32, color = C.navy }) {
  const w = (119.973 / 32) * height;
  return (
    <svg width={w} height={height} viewBox="0 0 119.973 32" fill="none" style={{ display: 'block', color }}>
      <path d="M 109.239 30.009 C 103.074 30.009 98.504 26.019 98.504 20.072 C 98.504 14.088 103.074 10.099 109.239 10.099 C 115.404 10.099 119.973 14.088 119.973 20.072 C 119.973 26.019 115.404 30.009 109.239 30.009 Z M 109.239 22.864 C 110.907 22.864 111.85 21.668 111.85 20.072 C 111.85 18.476 110.907 17.243 109.239 17.243 C 107.571 17.243 106.591 18.476 106.591 20.072 C 106.591 21.668 107.571 22.864 109.239 22.864 Z" fill="currentColor" fillRule="evenodd"/>
      <path d="M 81.299 21.776 L 81.299 17.497 L 79.45 17.497 L 79.45 10.679 L 81.299 10.679 L 81.299 5.058 L 89.822 5.058 L 89.822 10.679 L 97.075 10.679 L 97.075 17.497 L 89.822 17.497 L 89.822 21.559 C 89.822 22.139 90.221 22.538 90.801 22.538 C 91.381 22.538 91.816 22.139 91.816 21.377 L 91.816 19.782 L 97.147 19.782 L 97.147 22.864 C 97.147 27.216 93.593 30.009 89.242 30.009 C 84.455 30.009 81.299 26.563 81.299 21.776 Z" fill="currentColor" fillRule="evenodd"/>
      <path d="M 62.281 21.776 L 62.281 17.497 L 60.432 17.497 L 60.432 10.679 L 62.281 10.679 L 62.281 5.058 L 70.804 5.058 L 70.804 10.679 L 78.057 10.679 L 78.057 17.497 L 70.804 17.497 L 70.804 21.559 C 70.804 22.139 71.203 22.538 71.783 22.538 C 72.363 22.538 72.798 22.139 72.798 21.377 L 72.798 19.782 L 78.129 19.782 L 78.129 22.864 C 78.129 27.216 74.575 30.009 70.224 30.009 C 65.437 30.009 62.281 26.563 62.281 21.776 Z" fill="currentColor" fillRule="evenodd"/>
      <path d="M 54.599 9.301 C 51.88 9.301 49.921 7.379 49.921 4.659 C 49.921 1.939 51.88 0.017 54.599 0.017 C 57.319 0.017 59.314 1.939 59.314 4.659 C 59.314 7.379 57.319 9.301 54.599 9.301 Z M 50.356 10.679 L 58.842 10.679 L 58.842 29.428 L 50.356 29.428 L 50.356 10.679 Z" fill="currentColor" fillRule="evenodd"/>
      <path d="M 39.462 2.991 L 47.984 2.991 L 47.984 29.428 L 40.042 29.428 L 39.788 27.325 C 38.591 29.029 36.814 30.009 34.53 30.009 C 29.924 30.009 26.152 26.019 26.152 20.072 C 26.152 14.088 29.997 10.099 34.784 10.099 C 36.851 10.099 38.41 10.788 39.462 11.949 L 39.462 2.991 Z M 36.959 22.937 C 38.664 22.937 39.643 21.704 39.643 20.072 C 39.643 18.44 38.664 17.171 36.959 17.171 C 35.255 17.171 34.24 18.44 34.24 20.072 C 34.24 21.704 35.255 22.937 36.959 22.937 Z" fill="currentColor" fillRule="evenodd"/>
      <path d="M 4.965 0 C 13.548 0 20.517 6.941 20.517 15.488 L 20.517 16.512 C 20.517 25.059 13.548 32 4.965 32 L 0 32 L 0 27.17 C 1.976 26.992 9.246 25.797 10.259 17.826 C 7.385 19.649 2.986 20.248 0 20.168 L 0 0 L 4.965 0 Z" fill="currentColor" fillRule="evenodd"/>
    </svg>
  );
}
// just the "D"
function DGlyph({ size = 22, color = C.navy }) {
  const h = size, w = (20.517 / 32) * size;
  return (
    <svg width={w} height={h} viewBox="0 0 20.517 32" fill="none" style={{ display: 'block', color }}>
      <path d="M 4.965 0 C 13.548 0 20.517 6.941 20.517 15.488 L 20.517 16.512 C 20.517 25.059 13.548 32 4.965 32 L 0 32 L 0 27.17 C 1.976 26.992 9.246 25.797 10.259 17.826 C 7.385 19.649 2.986 20.248 0 20.168 L 0 0 L 4.965 0 Z" fill="currentColor" fillRule="evenodd"/>
    </svg>
  );
}
function Sparkle({ size = 16, color = C.magenta }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'block' }}>
      <path d="M9.94 14.06 8 20l-1.94-5.94L0 12l6.06-2.06L8 4l1.94 5.94L16 12z"/>
      <path d="M18 5 17.2 7.2 15 8l2.2.8L18 11l.8-2.2L21 8l-2.2-.8z"/>
      <path d="M19 14.5l-.5 1.5-1.5.5 1.5.5.5 1.5.5-1.5 1.5-.5-1.5-.5z"/>
    </svg>
  );
}

// ════════════════════════════════════════════════════════════════════════
//  SHARED ATOMS
// ════════════════════════════════════════════════════════════════════════
function MiniBar({ pct, width = '100%', height = 8, fill = C.navy, track = C.track }) {
  return (
    <div style={{ width, height, borderRadius: 99, background: track, overflow: 'hidden' }}>
      <div style={{ width: `${clamp(pct, 0, 100)}%`, height: '100%', borderRadius: 99, background: fill }}/>
    </div>
  );
}
function GreenBar({ pct, width = '100%', height = 12, tick = false }) {
  return (
    <div style={{ position: 'relative', width, height, borderRadius: 99, background: C.track, overflow: 'visible' }}>
      <div style={{ position: 'absolute', inset: 0, borderRadius: 99, overflow: 'hidden' }}>
        <div style={{ width: `${clamp(pct, 0, 100)}%`, height: '100%', borderRadius: 99,
          background: C.barGray }}/>
      </div>
      {tick && <div style={{ position: 'absolute', left: 3, top: '50%', width: 3, height: height + 6, marginTop: -(height + 6) / 2, borderRadius: 2, background: C.navy, opacity: 0.18 }}/>}
    </div>
  );
}
function StatusPill({ state }) { // 'review' | 'valid'
  const valid = state === 'valid';
  return (
    <div style={{
      display: 'inline-flex', alignItems: 'center', gap: 6, padding: '6px 12px', borderRadius: 99,
      fontFamily: SANS, fontSize: 14, fontWeight: 600, letterSpacing: '-0.01em',
      background: valid ? C.green : '#EFEFEF', color: valid ? '#053f0a' : '#6b6b72',
      transition: 'none', whiteSpace: 'nowrap',
    }}>
      {valid && <svg width="13" height="13" viewBox="0 0 24 24" fill="none"><path d="M20 6L9 17l-5-5" stroke="#053f0a" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round"/></svg>}
      {valid ? 'Validated' : 'In review'}
    </div>
  );
}
function ThemeTag({ label, color }) {
  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 7, padding: '5px 12px 5px 10px', borderRadius: 99, background: '#F4F5F0', fontFamily: SANS, fontSize: 14, fontWeight: 500, color: C.navy, letterSpacing: '-0.01em' }}>
      <span style={{ width: 9, height: 9, borderRadius: 99, background: color }}/>{label}
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════
//  TIMING WINDOWS
// ════════════════════════════════════════════════════════════════════════
const SCREEN = { x: 220, y: 120, w: 1480, h: 840 };
const HEADER_H = 92, FOOTER_H = 96, BODY_PAD = 52;

// step entrance/exit
function useStep(enterS, enterE, exitS, exitE) {
  const t = useTime();
  const inP = Easing.easeOutCubic(seg(t, enterS, enterE));
  const outP = exitS != null ? Easing.easeInCubic(seg(t, exitS, exitE)) : 0;
  const op = inP * (1 - outP);
  const y = lerp(26, 0, inP) + outP * -22;
  const sc = lerp(0.985, 1, inP) - outP * 0.02;
  return {
    op,
    style: {
      position: 'absolute', inset: 0, padding: BODY_PAD, boxSizing: 'border-box',
      opacity: op, transform: `translateY(${y}px) scale(${sc})`,
      transformOrigin: '50% 50%', display: op <= 0.001 ? 'none' : 'block',
    },
  };
}

// persistent progress value (climbs across the whole flow)
const progVal = interpolate(
  [0, 8.7, 10.5, 13.87, 14.39, 17.82, 18.35, 20.6, 21.5, 26],
  [0, 0,   20,   20,    55,    55,    85,    85,  100,  100],
  [Easing.linear, Easing.easeOutCubic, Easing.linear, Easing.easeOutBack, Easing.linear, Easing.easeOutBack, Easing.linear, Easing.easeOutCubic, Easing.linear]
);

// ════════════════════════════════════════════════════════════════════════
//  STEP 1 — PROJECTS OVERVIEW
// ════════════════════════════════════════════════════════════════════════
const PROJECTS = [
  { label: 'EcoVadis', sub: 'Sustainability rating', pct: 70, docs: 48, img: '/hero-animation/card-ecovadis.png' },
  { label: 'CDP', sub: 'Climate disclosure', pct: 52, img: '/hero-animation/card-cdp.png' },
  { label: 'CSRD', sub: 'EU reporting directive', pct: 18, img: '/hero-animation/card-csrd.png' },
  { label: 'ISO 14001', sub: 'Environmental management', pct: 40, img: '/hero-animation/card-iso.png' },
];
function BarRow({ label, pct }) {
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 9 }}>
        <span style={{ fontFamily: SANS, fontSize: 17, fontWeight: 500, color: C.navy, letterSpacing: '-0.02em' }}>{label}</span>
        <span style={{ fontFamily: SANS, fontSize: 17, fontWeight: 700, color: C.navy }}>{pct}%</span>
      </div>
      <MiniBar pct={pct} height={9} fill={C.navy} />
    </div>
  );
}
function ProjectCard({ p, appear, focus }) {
  const y = lerp(24, 0, Easing.easeOutCubic(appear));
  const sc = lerp(0.97, 1, Easing.easeOutCubic(appear)) + focus * 0.04;
  return (
    <div style={{
      width: 380, minHeight: 462, flex: 'none', display: 'flex', flexDirection: 'column',
      background: C.white, borderRadius: 18, padding: 14, boxSizing: 'border-box',
      border: `1px solid ${focus > 0.04 ? C.navy : C.border}`,
      boxShadow: focus > 0.04 ? `0 ${18 + focus * 22}px ${40 + focus * 24}px rgba(64,58,45,0.16)` : SHADOW_CARD,
      opacity: appear, transform: `translateY(${y}px) scale(${sc})`, transformOrigin: 'center bottom',
    }}>
      <div style={{ height: 206, borderRadius: 12, overflow: 'hidden', backgroundImage: `url("${p.img}")`, backgroundSize: 'cover', backgroundPosition: 'center', flexShrink: 0 }}/>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '18px 6px 6px' }}>
        <div style={{ fontFamily: SANS, fontSize: 16, color: C.faint, letterSpacing: '-0.01em', marginBottom: 18 }}>{p.sub}</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          <BarRow label={p.docs != null ? 'Reporting' : 'Questionnaire'} pct={p.pct} />
          {p.docs != null && <BarRow label="Documents" pct={p.docs} />}
        </div>
      </div>
    </div>
  );
}
function StepProjects() {
  const t = useTime();
  const { op, style } = useStep(0.6, 1.5, 5.8, 6.6);
  if (op <= 0.001) return null;
  const headIn = fade(t, 0.7, 1.5, 99, 100);
  return (
    <div style={style}>
      <div style={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 40 }}>
        <div style={{ opacity: headIn, transform: `translateY(${lerp(16, 0, Easing.easeOutCubic(seg(t, 0.7, 1.5)))}px)` }}>
          <div style={{ fontFamily: SERIF, fontSize: 48, color: C.navy, letterSpacing: '-0.01em' }}>Welcome back</div>
          <div style={{ marginTop: 10, fontFamily: SANS, fontSize: 21, color: C.muted, letterSpacing: '-0.02em' }}>All your compliance projects in one place.</div>
        </div>
        <div style={{ display: 'flex', gap: 30 }}>
          {PROJECTS.map((p, i) => {
            const appear = Easing.easeOutCubic(seg(t, 1.6 + i * 0.15, 2.4 + i * 0.15));
            const focus = i === 0 ? Easing.easeInOutCubic(seg(t, 4.6, 5.7)) : 0;
            return <ProjectCard key={p.label} p={p} appear={appear} focus={focus} />;
          })}
        </div>
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════
//  STEP 2 — WORK PLAN
// ════════════════════════════════════════════════════════════════════════
function MeasureRow({ name, theme, themeColor, state }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '15px 4px', borderBottom: `1px solid ${C.border}` }}>
      <span style={{ flex: 1, fontFamily: SANS, fontSize: 17, color: C.navy, letterSpacing: '-0.02em' }}>{name}</span>
      <ThemeTag label={theme} color={themeColor} />
      <div style={{ width: 130, display: 'flex', justifyContent: 'flex-end' }}><StatusPill state={state} /></div>
    </div>
  );
}
function StepWorkPlan() {
  const t = useTime();
  const { op, style } = useStep(6.3, 7.1, 20.2, 21.0);
  if (op <= 0.001) return null;
  const intro = Easing.easeOutCubic(seg(t, 6.6, 7.6));
  const files = [
    { name: 'Code of conduct.pdf', t: 8.5, kind: 'good', note: 'all good' },
    { name: 'Human rights policy 2024.pdf', t: 8.8, kind: 'improve', note: '3 improvements needed' },
    { name: 'Environmental policy.pdf', t: 9.1, kind: 'good', note: 'all good' },
    { name: 'Supplier code 2026.pdf', t: 9.4, kind: 'comments', note: '2 comments' },
    { name: 'Anti-bribery policy.pdf', t: 9.7, kind: 'good', note: 'all good' },
  ];
  return (
    <div style={style}>
      <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        {/* title row */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexShrink: 0 }}>
          <div>
            <div style={{ fontFamily: SERIF, fontSize: 38, color: C.navy, letterSpacing: '-0.01em' }}>Work plan</div>
            <div style={{ marginTop: 6, fontFamily: SANS, fontSize: 18, color: C.muted, letterSpacing: '-0.02em' }}>Drop your policies and we'll review them for you.</div>
          </div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 9, padding: '11px 20px', borderRadius: 99, border: `1.5px solid ${C.magenta}`, background: '#FCEEFC' }}>
            <Sparkle size={21} color={C.magenta} />
            <span style={{ fontFamily: SANS, fontSize: 17, fontWeight: 600, color: C.magenta, letterSpacing: '-0.02em' }}>Ask AI</span>
          </div>
        </div>
        {/* body — drop zone (left) + policies streaming in (right) */}
        <div style={{ flex: 1, minHeight: 0, marginTop: 24, display: 'flex', gap: 32 }}>
          {/* drop zone */}
          <div style={{
            flex: 1, boxSizing: 'border-box', borderRadius: 22, position: 'relative', overflow: 'hidden',
            border: `2.5px dashed ${C.borderTan}`, background: '#F4F5EF',
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 18,
            padding: '0 40px', opacity: intro, transform: `translateY(${lerp(14, 0, intro)}px)`,
          }}>
            {/* files dropping into the zone */}
            <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
              {files.map((f, i) => {
                const fall = Easing.easeInQuad(seg(t, f.t - 0.62, f.t - 0.12));
                const vis = fade(t, f.t - 0.62, f.t - 0.5, f.t - 0.16, f.t + 0.04);
                if (vis <= 0.001) return null;
                const sink = Easing.easeInCubic(seg(t, f.t - 0.2, f.t + 0.02));
                const y = lerp(-150, 0, fall);
                const offX = (i % 2 === 0 ? -1 : 1) * (8 + (i * 9) % 30);
                return (
                  <div key={f.name} style={{
                    position: 'absolute', top: '42%', left: '50%',
                    transform: `translate(calc(-50% + ${offX}px), calc(-50% + ${y}px)) scale(${lerp(1, 0.5, sink)}) rotate(${lerp(-7, 0, fall)}deg)`,
                    opacity: vis * (1 - sink),
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '9px 13px', background: C.white, borderRadius: 11, border: `1px solid ${C.border}`, boxShadow: '0 14px 30px rgba(64,58,45,0.18)' }}>
                      <FileIcon size={16} color={C.navy} />
                      <span style={{ fontFamily: SANS, fontSize: 13, fontWeight: 500, color: C.navy, letterSpacing: '-0.01em', whiteSpace: 'nowrap' }}>{f.name}</span>
                    </div>
                  </div>
                );
              })}
            </div>
            <div style={{ width: 72, height: 72, borderRadius: 99, background: C.tan,
              display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke={C.navy} strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 15V3"/>
                <path d="M7 8l5-5 5 5"/>
                <path d="M4 14v5a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-5"/>
              </svg>
            </div>
            <div style={{ fontFamily: SERIF, fontSize: 30, color: C.navy, letterSpacing: '-0.01em', textAlign: 'center', lineHeight: 1.12 }}>Drag and drop your policies for review</div>
          </div>
          {/* policies list */}
          <div style={{ flex: 1.2, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 14 }}>
            {files.map((f) => {
              const app = Easing.easeOutCubic(seg(t, f.t, f.t + 0.55));
              if (app <= 0.001) return null;
              const reviewed = t > f.t + 1.4;
              const tone = f.kind === 'improve' ? '#FFBC63' : f.kind === 'comments' ? C.blue : C.green;
              const toneInk = f.kind === 'improve' ? '#6b4a00' : f.kind === 'comments' ? '#FFFFFF' : '#053f0a';
              const toneText = f.kind === 'improve' ? '#9a6a00' : f.kind === 'comments' ? '#2a6bbf' : C.greenDeep;
              return (
                <div key={f.name} style={{
                  display: 'flex', alignItems: 'center', gap: 15, padding: '18px 22px',
                  background: C.white, borderRadius: 14, border: `1px solid ${C.border}`, boxShadow: SHADOW_CARD,
                  opacity: app, transform: `translateX(${lerp(26, 0, app)}px)`,
                }}>
                  <FileIcon size={25} color={C.navy} />
                  <span style={{ flex: 1, minWidth: 0, fontFamily: SANS, fontSize: 20, fontWeight: 500, color: C.navy, letterSpacing: '-0.01em', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{f.name}</span>
                  {reviewed ? (
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontFamily: SANS, fontSize: 16, fontWeight: 500, color: toneText, flexShrink: 0 }}>
                      <span style={{ width: 22, height: 22, borderRadius: 99, background: tone, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        {f.kind === 'good' && <svg width="13" height="13" viewBox="0 0 24 24" fill="none"><path d="M20 6L9 17l-5-5" stroke={toneInk} strokeWidth="3.4" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                        {f.kind === 'improve' && <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={toneInk} strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round"><path d="M12 19V6"/><path d="M6 12l6-6 6 6"/></svg>}
                        {f.kind === 'comments' && <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={toneInk} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 4h14a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1H9l-4 4V5a1 1 0 0 1 1-1z"/></svg>}
                      </span>Reviewed · {f.note}
                    </span>
                  ) : (
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 7, fontFamily: SANS, fontSize: 16, fontWeight: 500, color: C.faint, flexShrink: 0 }}>
                      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" style={{ transform: `rotate(${(t * 320) % 360}deg)` }}><circle cx="12" cy="12" r="9" stroke={C.track} strokeWidth="3"/><path d="M12 3a9 9 0 0 1 9 9" stroke={C.navy} strokeWidth="3" strokeLinecap="round"/></svg>
                      Reviewing
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════
//  STEP 3 — READY TO SUBMIT
// ════════════════════════════════════════════════════════════════════════
function Confetti({ t, start }) {
  const dt = t - start;
  if (dt < 0 || dt > 3.6) return null;
  const colors = [C.yellow, C.blue, C.green, C.magenta];
  const rnd = (i, k) => { const v = Math.sin(i * 12.9898 + k * 78.233) * 43758.5453; return v - Math.floor(v); };
  const N = 96, ox = 700, oy = 300, g = 1300;
  const pieces = [];
  for (let i = 0; i < N; i++) {
    const ang = -Math.PI / 2 + (rnd(i, 1) - 0.5) * Math.PI * 1.5;
    const spd = 620 + rnd(i, 2) * 760;
    const vx = Math.cos(ang) * spd;
    const vy = Math.sin(ang) * spd;
    const x = ox + vx * dt;
    const y = oy + vy * dt + 0.5 * g * dt * dt;
    const spin = (rnd(i, 5) > 0.5 ? 1 : -1) * (220 + rnd(i, 6) * 540);
    const rot = rnd(i, 3) * 360 + spin * dt;
    const w = 9 + rnd(i, 7) * 10, h = 5 + rnd(i, 8) * 8;
    const round = rnd(i, 9) > 0.7;
    const opacity = clamp(1 - (dt - 2.2) / 1.4, 0, 1) * clamp(dt / 0.08, 0, 1);
    pieces.push(
      <div key={i} style={{ position: 'absolute', left: x, top: y, width: w, height: h,
        background: colors[i % 4], borderRadius: round ? 99 : 2,
        transform: `rotate(${rot}deg)`, opacity }} />
    );
  }
  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>{pieces}</div>
  );
}
function StepReady() {
  const t = useTime();
  const { op, style } = useStep(20.8, 21.6, null, null);
  if (op <= 0.001) return null;
  const pillIn = Easing.easeOutBack(seg(t, 21.2, 21.9));
  const headIn = fade(t, 21.5, 22.2, 99, 100);
  return (
    <div style={style}>
      <Confetti t={t} start={21.2} />
      <div style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 34 }}>
        <div style={{ textAlign: 'center', opacity: headIn, transform: `translateY(${lerp(16, 0, Easing.easeOutCubic(seg(t, 21.5, 22.2)))}px)` }}>
          <div style={{ fontFamily: SERIF, fontSize: 66, color: C.navy, letterSpacing: '-0.01em' }}>Your project is ready.</div>
          <div style={{ marginTop: 14, fontFamily: SANS, fontSize: 22, color: C.muted, letterSpacing: '-0.02em' }}>Every measure validated. One click to file.</div>
        </div>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 12, padding: '14px 28px', borderRadius: 99, background: C.navy, transform: `scale(${pillIn})`, boxShadow: '0 12px 30px rgba(19,14,48,0.22)' }}>
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none"><path d="M20 6L9 17l-5-5" stroke="#FFFFFF" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round"/></svg>
          <span style={{ fontFamily: SANS, fontSize: 22, fontWeight: 700, color: '#FFFFFF', letterSpacing: '-0.02em' }}>Ready to submit</span>
        </div>
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════
// ════════════════════════════════════════════════════════════════════════
//  CENTRAL SCREEN  (persistent shell — every step animates inside it)
// ════════════════════════════════════════════════════════════════════════
function CentralScreen() {
  const t = useTime();
  const screenIn = Easing.easeOutCubic(seg(t, 0.2, 1.0));
  const sc = lerp(0.96, 1, screenIn);
  const footerOp = fade(t, 6.6, 7.3, 99, 100);
  const popupActive = Math.max(fade(t, 12.15, 12.68, 15.12, 15.65), fade(t, 16.04, 16.57, 19.35, 19.85));
  const screenDim = 1 - 0.12 * popupActive;
  const dimScale = 1 - 0.012 * popupActive;
  const pct = clamp(progVal(t), 0, 100);
  const done = pct >= 99.5;
  return (
    <div style={{
      position: 'absolute', left: SCREEN.x, top: SCREEN.y, width: SCREEN.w, height: SCREEN.h,
      background: C.white, borderRadius: 30, boxShadow: '0 40px 90px rgba(64,58,45,0.16)',
      overflow: 'hidden', opacity: screenIn, transform: `scale(${sc * dimScale})`, transformOrigin: '50% 50%',
      filter: `brightness(${screenDim})`,
    }}>
      {/* header chrome (constant) */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: HEADER_H, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 40px', borderBottom: `1px solid ${C.border}`, boxSizing: 'border-box', background: '#FCFCFA' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{ width: 44, height: 44, borderRadius: 12, background: C.navy, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <DGlyph size={21} color={C.tan} />
          </div>
          <span style={{ fontFamily: SANS, fontSize: 18, fontWeight: 600, color: C.navy, letterSpacing: '-0.02em' }}>Ditto</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 11 }}>
          <span style={{ fontFamily: SANS, fontSize: 16, color: C.muted, letterSpacing: '-0.01em' }}>Compliant Company</span>
          <div style={{ width: 38, height: 38, borderRadius: 99, background: C.navy, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: SANS, fontSize: 15, fontWeight: 700, color: C.tan }}>C</div>
        </div>
      </div>
      {/* body — steps animate in/out here */}
      <div style={{ position: 'absolute', top: HEADER_H, bottom: FOOTER_H, left: 0, right: 0 }}>
        <StepProjects />
        <StepWorkPlan />
        <StepReady />
      </div>
      {/* footer — persistent progress spine */}
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: FOOTER_H, padding: '0 40px', boxSizing: 'border-box', borderTop: `1px solid ${C.border}`, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 11, opacity: footerOp, background: '#FCFCFA' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontFamily: SANS, fontSize: 20, fontWeight: 600, color: C.muted, letterSpacing: '-0.01em' }}>Generating workplan</span>
          <span style={{ fontFamily: SERIF, fontSize: 30, color: C.navy, letterSpacing: '-0.01em', lineHeight: 1 }}>{Math.round(pct)}%</span>
        </div>
        <div style={{ position: 'relative', height: 14, borderRadius: 99, background: C.track, overflow: 'hidden' }}>
          <div style={{ height: '100%', width: `${pct}%`, borderRadius: 99, background: C.yellow, boxShadow: done ? `0 0 20px ${C.yellow}` : 'none' }}/>
        </div>
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════
//  AI SUGGESTION POPUP  (floats over the screen, to the LEFT)
// ════════════════════════════════════════════════════════════════════════
// shared popup atoms — navy CTA, file + bell icons
function CtaButton({ done, doneLabel, label, checkDraw }) {
  return done ? (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 9, padding: '11px 22px', borderRadius: 99, background: C.navy }}>
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M20 6L9 17l-5-5" stroke={C.tan} strokeWidth="3.4" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="30" strokeDashoffset={30 - 30 * checkDraw}/></svg>
      <span style={{ fontFamily: SANS, fontSize: 18, fontWeight: 700, color: C.tan, letterSpacing: '-0.02em' }}>{doneLabel}</span>
    </div>
  ) : (
    <div style={{ display: 'inline-flex', alignItems: 'center', padding: '12px 30px', borderRadius: 99, background: C.navy, fontFamily: SANS, fontSize: 18, fontWeight: 700, color: C.tan, letterSpacing: '-0.02em' }}>{label}</div>
  );
}
function FileIcon({ size = 20, color = C.navy }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={{ display: 'block', flexShrink: 0 }}>
      <path d="M6 2.6h7.5L19 8v13.4a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V3.6a1 1 0 0 1 1-1z" stroke={color} strokeWidth="1.6" strokeLinejoin="round"/>
      <path d="M13.5 2.6V8H19" stroke={color} strokeWidth="1.6" strokeLinejoin="round"/>
    </svg>
  );
}
function BellIcon({ size = 18, color = C.navy }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={{ display: 'block', flexShrink: 0 }}>
      <path d="M6 9.5a6 6 0 1 1 12 0c0 4.6 2 5.8 2 5.8H4s2-1.2 2-5.8z" stroke={color} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M10 19.5a2 2 0 0 0 4 0" stroke={color} strokeWidth="1.7" strokeLinecap="round"/>
    </svg>
  );
}
function AICard() {
  const t = useTime();
  if (t < 11.89 || t > 15.71) return null;
  const rise = Easing.easeOutCubic(seg(t, 12.08, 12.61));
  const press = t > 13.73 && t < 13.90 ? 0.97 : 1;
  const accepted = t > 14.0;
  const op = fade(t, 12.08, 12.61, 15.12, 15.65);
  const y = lerp(64, 0, rise);
  const s = lerp(0.96, 1, rise) * press;
  const checkDraw = seg(t, 14.03, 14.33);
  return (
    <div style={{ position: 'absolute', left: 96, top: 410, width: 728, opacity: op, transform: `translateY(${y}px) scale(${s})`, transformOrigin: '30% 90%' }}>
      <div style={{ background: C.white, borderRadius: 26, boxShadow: '0 34px 84px rgba(27,20,10,0.30)', padding: '30px 34px', border: `1px solid ${C.border}` }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
          <Sparkle size={22} color={C.magenta} />
          <span style={{ fontFamily: SANS, fontSize: 18, fontWeight: 700, color: C.magenta, letterSpacing: '-0.01em' }}>Auto-filled by Ditto</span>
          <span style={{ fontFamily: SANS, fontSize: 18, color: C.faint }}>·</span>
          <span style={{ fontFamily: SANS, fontSize: 18, color: C.faint, letterSpacing: '-0.01em' }}>14 of 21 filled for you</span>
        </div>
        <div style={{ fontFamily: SANS, fontSize: 27, fontWeight: 700, color: C.navy, letterSpacing: '-0.02em', lineHeight: 1.25 }}>Do you have a formal human rights policy?</div>
        <div style={{ marginTop: 18, background: C.white, border: `1px solid ${C.border}`, borderRadius: 16, padding: '18px 22px', fontFamily: SANS, fontSize: 23, color: C.navy, letterSpacing: '-0.02em', lineHeight: 1.4 }}>
          “Yes. Human rights policy published 2024, board-approved, covers all suppliers.”
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 16 }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={C.faint} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'block', flexShrink: 0 }}>
            <path d="M21.4 11.05 12.25 20.2a5 5 0 0 1-7.07-7.07l9.19-9.19a3 3 0 0 1 4.24 4.24l-9.2 9.19a1 1 0 0 1-1.41-1.41l8.49-8.49"/>
          </svg>
          <span style={{ fontFamily: SANS, fontSize: 18, color: C.muted, letterSpacing: '-0.01em' }}>From your Human rights policy 2024</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 12, marginTop: 22 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', padding: '13px 30px', borderRadius: 99, border: `1.5px solid ${C.borderTan}`, background: 'transparent', fontFamily: SANS, fontSize: 19, fontWeight: 600, color: C.navy, letterSpacing: '-0.02em' }}>Edit</div>
          <CtaButton done={accepted} doneLabel="Accepted" label="Accept" checkDraw={checkDraw} />
        </div>
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════
//  COACH POPUP  (floats over the screen, to the RIGHT)
// ════════════════════════════════════════════════════════════════════════
function CoachCard() {
  const t = useTime();
  if (t < 15.85 || t > 19.95) return null;
  const slide = Easing.easeOutCubic(seg(t, 16.04, 16.57));
  const op = fade(t, 16.04, 16.57, 19.35, 19.85);
  const x = lerp(90, 0, slide);
  const s = lerp(0.97, 1, slide);
  const custIn = Easing.easeOutCubic(seg(t, 16.35, 16.95));
  const vicIn = Easing.easeOutCubic(seg(t, 17.35, 17.95));
  const ctaIn = clamp(Easing.easeOutBack(seg(t, 18.15, 18.65)), 0, 1);
  const press = t > 18.55 && t < 18.7 ? 0.96 : 1;
  const accepted = t > 18.78;
  const checkDraw = seg(t, 18.81, 19.11);
  return (
    <div style={{ position: 'absolute', right: 88, top: 322, width: 660, opacity: op, transform: `translateX(${x}px) scale(${s})`, transformOrigin: '80% 50%' }}>
      <div style={{ background: C.white, borderRadius: 26, boxShadow: '0 34px 84px rgba(27,20,10,0.30)', border: `1px solid ${C.border}`, overflow: 'hidden' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 11, padding: '15px 26px', background: C.yellow }}>
          <BellIcon size={21} color={C.navy} />
          <span style={{ fontFamily: SANS, fontSize: 18, fontWeight: 700, color: C.navy, letterSpacing: '-0.01em' }}>Message from Victoire</span>
          <span style={{ marginLeft: 'auto', fontFamily: SANS, fontSize: 15, fontWeight: 600, color: C.navy, opacity: 0.6 }}>just now</span>
        </div>
        <div style={{ padding: '26px 30px 28px' }}>
          {/* customer message */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'flex-end', gap: 12, opacity: custIn, transform: `translateY(${lerp(14, 0, custIn)}px)` }}>
            <div style={{ maxWidth: '78%', background: C.tan, borderRadius: '20px 20px 6px 20px', padding: '15px 20px', fontFamily: SANS, fontSize: 22, color: C.navy, letterSpacing: '-0.02em', lineHeight: 1.4 }}>I'm ready to submit but I'm scared. I need help!</div>
            <div style={{ width: 46, height: 46, borderRadius: 99, background: C.navy, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: SANS, fontSize: 18, fontWeight: 700, color: C.tan, flexShrink: 0 }}>C</div>
          </div>
          {/* victoire reply */}
          <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'flex-end', gap: 12, marginTop: 16, opacity: vicIn, transform: `translateY(${lerp(14, 0, vicIn)}px)` }}>
            <div style={{ width: 46, height: 46, borderRadius: 99, backgroundImage: 'url("/hero-animation/victoire.jpg")', backgroundSize: 'cover', backgroundPosition: 'center', backgroundColor: C.navy, flexShrink: 0 }}/>
            <div style={{ maxWidth: '78%', background: C.white, border: `1px solid ${C.border}`, borderRadius: '20px 20px 20px 6px', padding: '15px 20px', fontFamily: SANS, fontSize: 22, color: C.navy, letterSpacing: '-0.02em', lineHeight: 1.4 }}>Stay with me — you're doing great. :) Let's get on a call?</div>
          </div>
          {/* CTA */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 22, opacity: ctaIn }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10, padding: '13px 26px', borderRadius: 99, background: C.navy, transform: `scale(${lerp(0.92, 1, ctaIn) * press})`, boxShadow: '0 12px 26px rgba(19,14,48,0.20)' }}>
              {accepted ? (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M20 6L9 17l-5-5" stroke={C.tan} strokeWidth="3.4" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="30" strokeDashoffset={30 - 30 * checkDraw}/></svg>
              ) : (
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={C.tan} strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="6" width="12" height="12" rx="2.5"/><path d="M15 10.5l5.5-3v9l-5.5-3"/></svg>
              )}
              <span style={{ fontFamily: SANS, fontSize: 19, fontWeight: 700, color: C.tan, letterSpacing: '-0.02em' }}>{accepted ? 'Joining call' : 'Join call'}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════
//  COMPOSITION
// ════════════════════════════════════════════════════════════════════════
function HeroAnimation() {
  return (
    <Stage width={1920} height={1080} cropTop={100} cropBottom={100} duration={25} background={C.tan} persistKey="ditto-hero">
      <CentralScreen />
      <AICard />
      <CoachCard />
    </Stage>
  );
}

export { HeroAnimation };
