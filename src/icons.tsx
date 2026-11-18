import type { ReactNode } from "react";

type P = { size?: number };
const S = (d: ReactNode) => ({ size = 20 }: P) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{d}</svg>
);
const F = (d: string) => ({ size = 20 }: P) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d={d} /></svg>
);

export const I = {
  home: S(<path d="M3 11l9-8 9 8v9a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z" />),
  user: S(<><circle cx="12" cy="8" r="4" /><path d="M4 21c0-4 4-6 8-6s8 2 8 6" /></>),
  grid: S(<><rect x="3" y="3" width="7.5" height="7.5" rx="2" /><rect x="13.5" y="3" width="7.5" height="7.5" rx="2" /><rect x="3" y="13.5" width="7.5" height="7.5" rx="2" /><rect x="13.5" y="13.5" width="7.5" height="7.5" rx="2" /></>),
  image: S(<><rect x="3" y="4" width="18" height="16" rx="3" /><circle cx="9" cy="10" r="1.8" /><path d="M21 16l-5-5-8 9" /></>),
  sparkles: S(<><path d="M12 3l1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9z" /><path d="M19 17v4M17 19h4" /></>),
  heart: S(<path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1-1.1a5.5 5.5 0 0 0-7.8 7.8l1 1.1L12 21l7.8-7.5 1-1.1a5.5 5.5 0 0 0 0-7.8z" />),
  link: S(<><path d="M10 13a5 5 0 0 0 7.5.5l3-3a5 5 0 0 0-7-7l-1.7 1.7" /><path d="M14 11a5 5 0 0 0-7.5-.5l-3 3a5 5 0 0 0 7 7l1.7-1.7" /></>),
  mail: S(<><rect x="3" y="5" width="18" height="14" rx="3" /><path d="M3 8l9 6 9-6" /></>),
  shield: S(<path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z" />),
  file: S(<><path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z" /><path d="M14 3v5h5" /></>),
  sun: S(<><circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" /></>),
  moon: S(<path d="M21 12.8A9 9 0 1 1 11.2 3 7 7 0 0 0 21 12.8z" />),
  menu: S(<path d="M4 7h16M4 12h16M4 17h16" />),
  arrow: S(<path d="M5 12h14M13 6l6 6-6 6" />),
  up: S(<path d="M12 19V5M6 11l6-6 6 6" />),
  ext: S(<path d="M7 17L17 7M8 7h9v9" />),
  copy: S(<><rect x="9" y="9" width="11" height="11" rx="2.5" /><path d="M5 15V6a2 2 0 0 1 2-2h9" /></>),
  check: S(<path d="M5 12l5 5 10-10" />),
  code: S(<path d="M16 18l6-6-6-6M8 6l-6 6 6 6" />),
  pen: S(<><path d="M4 20l1-4L17 4a2.1 2.1 0 0 1 3 3L8 19z" /><path d="M14.5 6.5l3 3" /></>),
  left: S(<path d="M15 6l-6 6 6 6" />),
  right: S(<path d="M9 6l6 6-6 6" />),
  plus: S(<path d="M12 5v14M5 12h14" />),
  globe: S(<><circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3c3 3 3 15 0 18M12 3c-3 3-3 15 0 18" /></>),
  send: S(<path d="M21 3L10 14M21 3l-7 18-4-7-7-4z" />),
  github: F("M12 .3a12 12 0 0 0-3.8 23.4c.6.1.8-.3.8-.6v-2c-3.3.7-4-1.6-4-1.6-.6-1.4-1.4-1.8-1.4-1.8-1-.7.1-.7.1-.7 1.2.1 1.8 1.2 1.8 1.2 1 1.8 2.8 1.3 3.5 1 .1-.8.4-1.3.7-1.6-2.7-.3-5.5-1.3-5.5-5.9 0-1.3.5-2.4 1.2-3.2-.1-.3-.5-1.5.1-3.2 0 0 1-.3 3.3 1.2a11.5 11.5 0 0 1 6 0c2.3-1.5 3.3-1.2 3.3-1.2.7 1.7.2 2.9.1 3.2.8.8 1.2 1.9 1.2 3.2 0 4.6-2.8 5.6-5.5 5.9.4.4.8 1.1.8 2.2v3.3c0 .3.2.7.8.6A12 12 0 0 0 12 .3"),
  youtube: F("M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.4.6A3 3 0 0 0 .5 6.2C0 8.1 0 12 0 12s0 3.9.5 5.8a3 3 0 0 0 2.1 2.1c1.9.6 9.4.6 9.4.6s7.5 0 9.4-.6a3 3 0 0 0 2.1-2.1c.5-1.9.5-5.8.5-5.8s0-3.9-.5-5.8zM9.6 15.6V8.4l6.2 3.6z"),
  instagram: S(<><rect x="3" y="3" width="18" height="18" rx="5.5" /><circle cx="12" cy="12" r="4.2" /><circle cx="17.2" cy="6.8" r="1" fill="currentColor" stroke="none" /></>),
  pinterest: F("M12 0a12 12 0 0 0-4.4 23.2c-.1-1-.2-2.4 0-3.4l1.4-6s-.4-.7-.4-1.8c0-1.7 1-2.9 2.2-2.9 1 0 1.5.8 1.5 1.7 0 1-.7 2.6-1 4-.3 1.2.6 2.2 1.8 2.2 2.1 0 3.8-2.2 3.8-5.5 0-2.9-2.1-4.9-5-4.9-3.4 0-5.4 2.6-5.4 5.2 0 1 .4 2.1.9 2.7.1.1.1.2.1.3l-.3 1.4c0 .2-.2.3-.4.2-1.5-.7-2.4-2.9-2.4-4.6 0-3.8 2.7-7.3 7.9-7.3 4.2 0 7.4 3 7.4 6.9 0 4.1-2.6 7.5-6.2 7.5-1.2 0-2.4-.6-2.8-1.4l-.7 2.8c-.3 1-1 2.3-1.5 3.1A12 12 0 1 0 12 0z"),
};

export const BRAND: Record<string, { icon: (p: P) => ReactNode; bg: string }> = {
  "github-primary": { icon: I.github, bg: "#24292f" },
  "github-personal": { icon: I.github, bg: "#3b4252" },
  youtube: { icon: I.youtube, bg: "#ff0033" },
  instagram: { icon: I.instagram, bg: "linear-gradient(45deg,#f9a03f,#e1306c 50%,#833ab4)" },
  pinterest: { icon: I.pinterest, bg: "#e60023" },
  website: { icon: I.globe, bg: "linear-gradient(135deg,#60a5fa,#a855f7)" },
};

export function Logo({ size = 28 }: P) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" aria-hidden="true">
      <defs><linearGradient id="lg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#60a5fa" /><stop offset=".55" stopColor="#a855f7" /><stop offset="1" stopColor="#fb923c" /></linearGradient></defs>
      <rect width="32" height="32" rx="9" fill="url(#lg)" />
      <path d="M11 8.5v15M11 16l9-7.5M13.5 14l7.5 9.5" fill="none" stroke="#fff" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function SketchArt({ variant = "traditional" }: { variant?: "traditional" | "digital" | "empty" }) {
  const c = variant === "digital" ? ["#60a5fa", "#a855f7"] : variant === "traditional" ? ["#fb923c", "#f472b6"] : ["#7dd3fc", "#c4b5fd"];
  return (
    <svg viewBox="0 0 320 200" width="100%" role="img" aria-label="Artwork illustration" style={{ display: "block", borderRadius: 20 }}>
      <defs>
        <linearGradient id={`sk-${variant}`} x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor={c[0]} /><stop offset="1" stopColor={c[1]} /></linearGradient>
      </defs>
      <rect width="320" height="200" rx="20" fill={`url(#sk-${variant})`} opacity=".9" />
      <circle cx="238" cy="58" r="22" fill="#fff" opacity=".85" />
      <path d="M0 150c40-34 70-34 110-8s70 8 100-14 70-6 110 10v62H0z" fill="#fff" opacity=".28" />
      <path d="M0 172c50-24 90-16 130 0s90 10 190-12v40H0z" fill="#fff" opacity=".4" />
      {variant === "digital" ? (
        <g fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" opacity=".95">
          <rect x="84" y="52" width="84" height="58" rx="8" /><path d="M96 98l18-22 14 14 12-10 16 18" /><circle cx="148" cy="68" r="4" fill="#fff" stroke="none" />
        </g>
      ) : (
        <g transform="translate(86 40) rotate(28 40 40)" fill="#fff" opacity=".96">
          <rect x="30" y="0" width="22" height="86" rx="4" /><path d="M30 86h22l-11 22z" /><rect x="30" y="0" width="22" height="14" rx="4" fill="#111" opacity=".25" />
        </g>
      )}
    </svg>
  );
}
