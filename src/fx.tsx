import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import * as stylex from "@stylexjs/stylex";
import { tokens } from "@lenso/tokens/tokens.stylex.const";

const drift = stylex.keyframes({
  "0%": { transform: "translate3d(0,0,0) rotate(0deg)" },
  "50%": { transform: "translate3d(5vw,-4vh,0) rotate(18deg)" },
  "100%": { transform: "translate3d(0,0,0) rotate(0deg)" },
});
const morph = stylex.keyframes({
  "0%": { borderRadius: "42% 58% 70% 30% / 45% 45% 55% 55%" },
  "33%": { borderRadius: "73% 27% 36% 64% / 56% 62% 38% 44%" },
  "66%": { borderRadius: "34% 66% 55% 45% / 68% 37% 63% 32%" },
  "100%": { borderRadius: "42% 58% 70% 30% / 45% 45% 55% 55%" },
});
const scroll = stylex.keyframes({ from: { transform: "translateX(0)" }, to: { transform: "translateX(-50%)" } });
const blink = stylex.keyframes({ "0%, 49%": { opacity: 1 }, "50%, 100%": { opacity: 0 } });
const NO_MOTION = "@media (prefers-reduced-motion: reduce)";

const s = stylex.create({
  aurora: { position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none", overflow: "hidden" },
  par: { position: "absolute", transition: "transform 1200ms cubic-bezier(.32,.72,0,1)", willChange: "transform" },
  drift: { animationName: { default: drift, [NO_MOTION]: "none" }, animationIterationCount: "infinite", animationTimingFunction: "ease-in-out" },
  blob: { animationName: { default: morph, [NO_MOTION]: "none" }, animationIterationCount: "infinite", animationTimingFunction: "ease-in-out", filter: "blur(28px)" },
  bar: { position: "fixed", top: 0, left: 0, right: 0, height: 3, zIndex: 50, transformOrigin: "0 50%", backgroundImage: "linear-gradient(90deg,#60a5fa,#a78bfa,#fb923c)" },
  track: { overflow: "hidden", maskImage: "linear-gradient(90deg,transparent,#000 10%,#000 90%,transparent)", WebkitMaskImage: "linear-gradient(90deg,transparent,#000 10%,#000 90%,transparent)" },
  belt: { display: "flex", gap: 12, width: "max-content", animationName: { default: scroll, [NO_MOTION]: "none" }, animationDuration: "42s", animationIterationCount: "infinite", animationTimingFunction: "linear" },
  pill: { padding: "10px 18px", borderRadius: 999, whiteSpace: "nowrap", fontSize: 15, fontWeight: 500, backgroundColor: tokens.fillTertiary, color: tokens.labelSecondary },
  caret: { animationName: blink, animationDuration: "1s", animationIterationCount: "infinite", marginLeft: 2, fontWeight: 300 },
  spot: { position: "relative", display: "flex", flex: 1, width: "100%", borderRadius: 26, transition: "transform 600ms cubic-bezier(.32,.72,0,1)",
    transform: { default: "none", "@media (hover: hover)": { default: "none", ":hover": "translateY(-5px)" } } },
  glow: { position: "absolute", inset: 0, borderRadius: 26, pointerEvents: "none", opacity: 0, transition: "opacity 500ms cubic-bezier(.32,.72,0,1)",
    background: "radial-gradient(380px circle at var(--x,50%) var(--y,50%), rgba(10,132,255,.13), transparent 62%)" },
});

export const useReduced = () => {
  const [r, setR] = useState(() => matchMedia("(prefers-reduced-motion: reduce)").matches);
  useEffect(() => { const m = matchMedia("(prefers-reduced-motion: reduce)"); const f = () => setR(m.matches); m.addEventListener("change", f); return () => m.removeEventListener("change", f); }, []);
  return r;
};

function useSeen<T extends HTMLElement>(threshold = 0.12) {
  const ref = useRef<T>(null); const reduced = useReduced(); const [seen, setSeen] = useState(false);
  useEffect(() => {
    if (reduced) { setSeen(true); return; }
    const el = ref.current; if (!el) return;
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setSeen(true); io.disconnect(); } }, { threshold });
    io.observe(el); return () => io.disconnect();
  }, [reduced, threshold]);
  return [ref, seen] as const;
}

export function Reveal({ children, delay = 0, y = 22, flex = false, style }: { children: ReactNode; delay?: number; y?: number; flex?: boolean; style?: CSSProperties }) {
  const [ref, seen] = useSeen<HTMLDivElement>();
  const e = "cubic-bezier(.32,.72,0,1)";
  return (
    <div ref={ref} style={{ display: flex ? "flex" : undefined, flexDirection: flex ? "column" : undefined, height: flex ? "100%" : undefined,
      opacity: seen ? 1 : 0, transform: seen ? "none" : `translateY(${y}px) scale(.985)`, filter: seen ? "none" : "blur(8px)",
      transition: `opacity .9s ${e} ${delay}ms, transform .9s ${e} ${delay}ms, filter .9s ${e} ${delay}ms`, ...style }}>
      {children}
    </div>
  );
}

/** Flat hover treatment: gentle lift + a soft spotlight that follows the cursor (no 3D tilt). */
export function Spot({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null); const glow = useRef<HTMLDivElement>(null);
  const move = (e: React.PointerEvent) => {
    if (e.pointerType === "touch" || !ref.current || !glow.current) return;
    const r = ref.current.getBoundingClientRect();
    glow.current.style.setProperty("--x", `${e.clientX - r.left}px`); glow.current.style.setProperty("--y", `${e.clientY - r.top}px`); glow.current.style.opacity = "1";
  };
  return (
    <div ref={ref} {...stylex.props(s.spot)} onPointerMove={move} onPointerLeave={() => { if (glow.current) glow.current.style.opacity = "0"; }}>
      {children}<div ref={glow} {...stylex.props(s.glow)} aria-hidden="true" />
    </div>
  );
}

export function Typewriter({ words }: { words: string[] }) {
  const reduced = useReduced();
  const [i, setI] = useState(0); const [n, setN] = useState(0); const [del, setDel] = useState(false);
  useEffect(() => {
    if (reduced) return;
    const w = words[i];
    const t = setTimeout(() => { if (!del && n < w.length) setN(n + 1); else if (!del) setDel(true); else if (n > 0) setN(n - 1); else { setDel(false); setI((i + 1) % words.length); } },
      !del && n === w.length ? 1500 : del ? 32 : 70);
    return () => clearTimeout(t);
  }, [n, del, i, words, reduced]);
  return <span>{reduced ? words[0] : words[i].slice(0, n)}<span {...stylex.props(s.caret)}>|</span></span>;
}

export function Counter({ to, suffix = "" }: { to: number; suffix?: string }) {
  const [ref, seen] = useSeen<HTMLSpanElement>(0.5); const [v, setV] = useState(0);
  useEffect(() => {
    if (!seen) return; let raf = 0; const t0 = performance.now();
    const tick = (t: number) => { const p = Math.min(1, (t - t0) / 1300); setV(Math.round(to * (1 - Math.pow(1 - p, 4)))); if (p < 1) raf = requestAnimationFrame(tick); };
    raf = requestAnimationFrame(tick); return () => cancelAnimationFrame(raf);
  }, [seen, to]);
  return <span ref={ref}>{v}{suffix}</span>;
}

type Blob = { x: string; y: string; w: number; h: number; k: number; dur: number; light: [string, string]; dark: [string, string] };
const BLOBS: Blob[] = [
  { x: "-12%", y: "-14%", w: 62, h: 52, k: 60, dur: 26, light: ["#9ec5ff", "#c3b4ff"], dark: ["#1d4ed8", "#4c1d95"] },
  { x: "52%", y: "-10%", w: 56, h: 60, k: -45, dur: 32, light: ["#e0b8ff", "#ffb3d1"], dark: ["#7e22ce", "#be185d"] },
  { x: "-8%", y: "48%", w: 54, h: 50, k: 35, dur: 29, light: ["#ffcfa8", "#ffb8a0"], dark: ["#c2410c", "#9a3412"] },
  { x: "56%", y: "52%", w: 58, h: 52, k: -70, dur: 24, light: ["#a5eaf5", "#a8d4ff"], dark: ["#0e7490", "#1e40af"] },
];

/** Apple-style mesh wallpaper: large morphing gradient shapes, parallax on pointer, film grain to avoid banding. */
export function Aurora({ dark }: { dark: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    let raf = 0;
    const f = (e: PointerEvent) => { cancelAnimationFrame(raf); raf = requestAnimationFrame(() => {
      ref.current?.style.setProperty("--mx", String(e.clientX / innerWidth - 0.5)); ref.current?.style.setProperty("--my", String(e.clientY / innerHeight - 0.5)); }); };
    addEventListener("pointermove", f, { passive: true }); return () => removeEventListener("pointermove", f);
  }, []);
  return (
    <div ref={ref} {...stylex.props(s.aurora)} aria-hidden="true">
      {BLOBS.map((b, i) => {
        const [c1, c2] = dark ? b.dark : b.light;
        return (
          <div key={i} {...stylex.props(s.par)} style={{ left: b.x, top: b.y, transform: `translate(calc(var(--mx,0) * ${b.k}px), calc(var(--my,0) * ${b.k}px))` }}>
            <div {...stylex.props(s.drift)} style={{ animationDuration: `${b.dur}s`, animationDelay: `${-i * 7}s` }}>
              <div {...stylex.props(s.blob)} style={{ width: `${b.w}vmax`, height: `${b.h}vmax`, opacity: dark ? 0.55 : 0.62,
                background: `radial-gradient(circle at 30% 30%, ${c1}, ${c2} 75%)`, animationDuration: `${b.dur * 0.8}s`, animationDelay: `${-i * 5}s` }} />
            </div>
          </div>
        );
      })}
      <div className="grain" />
    </div>
  );
}

export function ScrollBar() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const f = () => { const h = document.documentElement; const p = h.scrollTop / Math.max(1, h.scrollHeight - h.clientHeight); if (ref.current) ref.current.style.transform = `scaleX(${p})`; };
    f(); addEventListener("scroll", f, { passive: true }); addEventListener("resize", f);
    return () => { removeEventListener("scroll", f); removeEventListener("resize", f); };
  }, []);
  return <div ref={ref} {...stylex.props(s.bar)} style={{ transform: "scaleX(0)" }} />;
}

export function Marquee({ items }: { items: string[] }) {
  return (
    <div {...stylex.props(s.track)} aria-hidden="true">
      <div {...stylex.props(s.belt)}>{[...items, ...items].map((t, i) => <span key={i} {...stylex.props(s.pill)}>{t}</span>)}</div>
    </div>
  );
}
