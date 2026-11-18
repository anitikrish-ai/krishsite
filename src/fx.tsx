import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import * as stylex from "@stylexjs/stylex";
import { tokens } from "@lenso/tokens/tokens.stylex.const";

const drift = stylex.keyframes({
  "0%": { transform: "translate3d(0,0,0) scale(1)" },
  "50%": { transform: "translate3d(60px,-40px,0) scale(1.18)" },
  "100%": { transform: "translate3d(0,0,0) scale(1)" },
});
const scroll = stylex.keyframes({ from: { transform: "translateX(0)" }, to: { transform: "translateX(-50%)" } });
const blink = stylex.keyframes({ "0%, 49%": { opacity: 1 }, "50%, 100%": { opacity: 0 } });

const s = stylex.create({
  aurora: { position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none", overflow: "hidden" },
  orbPos: { position: "absolute", transition: "transform 900ms cubic-bezier(.2,.7,.2,1)" },
  orb: { borderRadius: "50%", filter: "blur(90px)", opacity: 0.35,
    animationName: { default: drift, "@media (prefers-reduced-motion: reduce)": "none" },
    animationIterationCount: "infinite", animationTimingFunction: "ease-in-out" },
  bar: { position: "fixed", top: 0, left: 0, right: 0, height: 3, zIndex: 50, transformOrigin: "0 50%",
    backgroundImage: "linear-gradient(90deg,#3b82f6,#a855f7,#f97316)" },
  track: { overflow: "hidden", maskImage: "linear-gradient(90deg,transparent,#000 12%,#000 88%,transparent)" },
  belt: { display: "flex", gap: 12, width: "max-content",
    animationName: { default: scroll, "@media (prefers-reduced-motion: reduce)": "none" },
    animationDuration: "38s", animationIterationCount: "infinite", animationTimingFunction: "linear" },
  pill: { padding: "10px 18px", borderRadius: 999, whiteSpace: "nowrap", fontSize: 15, backgroundColor: tokens.fillTertiary, color: tokens.labelSecondary },
  caret: { animationName: blink, animationDuration: "1s", animationIterationCount: "infinite", marginLeft: 2 },
});

export const useReduced = () => {
  const [r, setR] = useState(() => matchMedia("(prefers-reduced-motion: reduce)").matches);
  useEffect(() => { const m = matchMedia("(prefers-reduced-motion: reduce)"); const f = () => setR(m.matches); m.addEventListener("change", f); return () => m.removeEventListener("change", f); }, []);
  return r;
};

function useSeen<T extends HTMLElement>(threshold = 0.15) {
  const ref = useRef<T>(null);
  const reduced = useReduced();
  const [seen, setSeen] = useState(false);
  useEffect(() => {
    if (reduced) { setSeen(true); return; }
    const el = ref.current; if (!el) return;
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setSeen(true); io.disconnect(); } }, { threshold });
    io.observe(el); return () => io.disconnect();
  }, [reduced, threshold]);
  return [ref, seen] as const;
}

export function Reveal({ children, delay = 0, y = 28, style }: { children: ReactNode; delay?: number; y?: number; style?: CSSProperties }) {
  const [ref, seen] = useSeen<HTMLDivElement>();
  const ease = "cubic-bezier(.2,.7,.2,1)";
  return (
    <div ref={ref} style={{ opacity: seen ? 1 : 0, transform: seen ? "none" : `translateY(${y}px) scale(.97)`, filter: seen ? "none" : "blur(6px)",
      transition: `opacity .8s ${ease} ${delay}ms, transform .8s ${ease} ${delay}ms, filter .8s ${ease} ${delay}ms`, height: "100%", ...style }}>
      {children}
    </div>
  );
}

export function Tilt({ children, max = 7 }: { children: ReactNode; max?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReduced();
  const move = (e: React.PointerEvent) => {
    const el = ref.current; if (!el || reduced || e.pointerType === "touch") return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5, y = (e.clientY - r.top) / r.height - 0.5;
    el.style.transform = `perspective(900px) rotateX(${-y * max}deg) rotateY(${x * max}deg) translateY(-4px)`;
  };
  const reset = () => { if (ref.current) ref.current.style.transform = ""; };
  return <div ref={ref} onPointerMove={move} onPointerLeave={reset} style={{ height: "100%", transition: "transform 350ms cubic-bezier(.2,.7,.2,1)", willChange: "transform" }}>{children}</div>;
}

export function Typewriter({ words }: { words: string[] }) {
  const reduced = useReduced();
  const [i, setI] = useState(0); const [n, setN] = useState(0); const [del, setDel] = useState(false);
  useEffect(() => {
    if (reduced) return;
    const w = words[i]; const t = setTimeout(() => {
      if (!del && n < w.length) setN(n + 1);
      else if (!del) setDel(true);
      else if (n > 0) setN(n - 1);
      else { setDel(false); setI((i + 1) % words.length); }
    }, !del && n === w.length ? 1400 : del ? 35 : 70);
    return () => clearTimeout(t);
  }, [n, del, i, words, reduced]);
  return <span>{reduced ? words[0] : words[i].slice(0, n)}<span {...stylex.props(s.caret)}>|</span></span>;
}

export function Counter({ to, suffix = "" }: { to: number; suffix?: string }) {
  const [ref, seen] = useSeen<HTMLSpanElement>(0.5);
  const [v, setV] = useState(0);
  useEffect(() => {
    if (!seen) return; let raf = 0; const t0 = performance.now();
    const tick = (t: number) => { const p = Math.min(1, (t - t0) / 1200); setV(Math.round(to * (1 - Math.pow(1 - p, 3)))); if (p < 1) raf = requestAnimationFrame(tick); };
    raf = requestAnimationFrame(tick); return () => cancelAnimationFrame(raf);
  }, [seen, to]);
  return <span ref={ref}>{v}{suffix}</span>;
}

export function Aurora() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    let raf = 0;
    const f = (e: PointerEvent) => { cancelAnimationFrame(raf); raf = requestAnimationFrame(() => {
      ref.current?.style.setProperty("--mx", String(e.clientX / innerWidth - 0.5));
      ref.current?.style.setProperty("--my", String(e.clientY / innerHeight - 0.5)); }); };
    addEventListener("pointermove", f); return () => removeEventListener("pointermove", f);
  }, []);
  const orb = (x: string, y: string, size: number, color: string, k: number, dur: number) => (
    <div {...stylex.props(s.orbPos)} style={{ left: x, top: y, transform: `translate(calc(var(--mx,0) * ${k}px), calc(var(--my,0) * ${k}px))` }}>
      <div {...stylex.props(s.orb)} style={{ width: size, height: size, background: color, animationDuration: `${dur}s` }} />
    </div>
  );
  return (
    <div ref={ref} {...stylex.props(s.aurora)} aria-hidden="true">
      {orb("-8%", "-6%", 520, "#3b82f6", 70, 22)}{orb("62%", "2%", 460, "#a855f7", -50, 28)}
      {orb("20%", "55%", 480, "#f97316", 40, 26)}{orb("72%", "62%", 380, "#22d3ee", -80, 20)}
    </div>
  );
}

export function ScrollBar() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const f = () => { const h = document.documentElement; const p = h.scrollTop / Math.max(1, h.scrollHeight - h.clientHeight);
      if (ref.current) ref.current.style.transform = `scaleX(${p})`; };
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
