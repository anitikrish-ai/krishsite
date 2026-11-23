import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import * as stylex from "@stylexjs/stylex";
import { tokens } from "@lenso/tokens/tokens.stylex.const";

const scroll = stylex.keyframes({ from: { transform: "translateX(0)" }, to: { transform: "translateX(-50%)" } });
const blink = stylex.keyframes({ "0%, 49%": { opacity: 1 }, "50%, 100%": { opacity: 0 } });
const NO_MOTION = "@media (prefers-reduced-motion: reduce)";

const s = stylex.create({
  bar: { position: "fixed", top: 0, left: 0, right: 0, height: 2, zIndex: 50, transformOrigin: "0 50%", backgroundColor: tokens.labelSecondary },
  track: { overflow: "hidden" },
  belt: { display: "flex", gap: 12, width: "max-content", animationName: { default: scroll, [NO_MOTION]: "none" }, animationDuration: "42s", animationIterationCount: "infinite", animationTimingFunction: "linear" },
  pill: { padding: "10px 18px", borderRadius: 999, whiteSpace: "nowrap", fontSize: 15, fontWeight: 500, backgroundColor: tokens.fillTertiary, color: tokens.labelSecondary },
  caret: { animationName: blink, animationDuration: "1s", animationIterationCount: "infinite", marginLeft: 2, fontWeight: 300 },
  spot: { position: "relative", display: "flex", flex: 1, width: "100%", borderRadius: 16 },
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

export function Reveal({ children, flex = false, style }: { children: ReactNode; delay?: number; y?: number; flex?: boolean; style?: CSSProperties }) {
  return (
    <div style={{ display: flex ? "flex" : undefined, flexDirection: flex ? "column" : undefined, height: flex ? "100%" : undefined, ...style }}>
      {children}
    </div>
  );
}

/** Flat hover treatment: gentle lift + a soft spotlight that follows the cursor (no 3D tilt). */
export function Spot({ children }: { children: ReactNode }) {
  return <div {...stylex.props(s.spot)}>{children}</div>;
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
