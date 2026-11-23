import { lazy, Suspense, useEffect, useLayoutEffect, useRef, useState, type ReactNode } from "react";
import * as stylex from "@stylexjs/stylex";
import { tokens } from "@lenso/tokens/tokens.stylex.const";
import { ThemeScope } from "@lenso/ui";
import { ScrollBar } from "./fx";
import { CommandPalette } from "./CommandPalette";
import { ALL, Footer, Navbar } from "./layout";
import { useRoute } from "./router";
import Home from "./pages/Home";
const About = lazy(() => import("./pages/About"));
const Projects = lazy(() => import("./pages/Projects"));
const Art = lazy(() => import("./pages/Art"));
const Collaborate = lazy(() => import("./pages/Connect").then((module) => ({ default: module.Collaborate })));
const Contact = lazy(() => import("./pages/Connect").then((module) => ({ default: module.Contact })));
const Links = lazy(() => import("./pages/Connect").then((module) => ({ default: module.Links })));
const Support = lazy(() => import("./pages/Connect").then((module) => ({ default: module.Support })));
const Legal = lazy(() => import("./pages/Legal"));
const NotFound = lazy(() => import("./pages/Legal").then((module) => ({ default: module.NotFound })));

const rise = stylex.keyframes({ from: { opacity: 0, transform: "translateY(10px)" }, to: { opacity: 1, transform: "none" } });
const s = stylex.create({
  page: { minHeight: "100dvh", backgroundColor: tokens.backgroundGroupedPrimary, color: tokens.labelPrimary, position: "relative", overflowX: "hidden", paddingBottom: { default: 0, "@media (max-width: 900px)": "calc(76px + env(safe-area-inset-bottom, 0px))" } },
  view: { position: "relative", zIndex: 1, animationName: { default: rise, "@media (prefers-reduced-motion: reduce)": "none" }, animationDuration: "180ms", animationTimingFunction: "ease-out", animationFillMode: "both" },
});
const THEME_KEY = "krish_theme_v3";
const MOTION_KEY = "krish_reduce_motion_v1";
type ThemeMode = "light" | "dark" | "system";
const getSystemDark = () => typeof window !== "undefined" && window.matchMedia("(prefers-color-scheme: dark)").matches;
const PAGES: Record<string, ReactNode> = {
  home: <Home />, about: <About />, projects: <Projects />, art: <Art />, collaborate: <Collaborate />, support: <Support />,
  links: <Links />, contact: <Contact />, privacy: <Legal kind="privacy" />, terms: <Legal kind="terms" />,
};

export default function App() {
  const route = useRoute();
  const [themeMode, setThemeMode] = useState<ThemeMode>(() => {
    try {
      const saved = localStorage.getItem(THEME_KEY);
      if (saved === "light" || saved === "dark" || saved === "system") return saved;
    } catch { /* storage unavailable */ }
    return "system";
  });
  const [systemDark, setSystemDark] = useState(getSystemDark);
  const [reducedMotion, setReducedMotion] = useState(() => {
    try { return localStorage.getItem(MOTION_KEY) === "true"; } catch { return false; }
  });
  const dark = themeMode === "system" ? systemDark : themeMode === "dark";
  const previousDark = useRef(dark);
  useLayoutEffect(() => {
    if (previousDark.current === dark) return;
    previousDark.current = dark;
    const root = document.documentElement;
    root.dataset.themeTransition = "true";
    const timeout = window.setTimeout(() => { delete root.dataset.themeTransition; }, 220);
    return () => window.clearTimeout(timeout);
  }, [dark]);
  useEffect(() => {
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const update = () => setSystemDark(media.matches);
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);
  useEffect(() => {
    try { localStorage.setItem(THEME_KEY, themeMode); } catch { /* storage unavailable */ }
    document.body.style.backgroundColor = dark ? "#0b0b0d" : "#f5f5f7";
    document.documentElement.style.colorScheme = dark ? "dark" : "light";
    document.querySelector('meta[name="theme-color"]')?.setAttribute("content", dark ? "#0b0b0d" : "#f5f5f7");
  }, [themeMode, dark]);
  useEffect(() => {
    try { localStorage.setItem(MOTION_KEY, String(reducedMotion)); } catch { /* storage unavailable */ }
  }, [reducedMotion]);
  useEffect(() => {
    const name = ALL.find(([id]) => id === route)?.[1];
    const description = route === "home"
      ? "Portfolio of Krish Makwana, featuring browser tools, student projects, and original artwork."
      : `${name ?? "Page not found"} on the portfolio of Krish Makwana, a student who builds browser tools and creates art.`;
    document.title = route === "home" ? "Krish Makwana | Builder, Artist, Student" : `${name ?? "Not found"} | Krish Makwana`;
    document.querySelector('meta[name="description"]')?.setAttribute("content", description);
    document.querySelector('meta[property="og:title"]')?.setAttribute("content", document.title);
    document.querySelector('meta[property="og:description"]')?.setAttribute("content", description);
    document.querySelector('meta[name="twitter:title"]')?.setAttribute("content", document.title);
    document.querySelector('meta[name="twitter:description"]')?.setAttribute("content", description);
  }, [route]);
  return (
    <ThemeScope theme={dark ? "dark" : "light"}>
      <div {...stylex.props(s.page)} data-reduced-motion={reducedMotion ? "true" : undefined} style={{ backgroundColor: dark ? "#0b0b0d" : "#f5f5f7" }}>
        <a className="skip-link" href="#main-content">Skip to content</a>
        <ScrollBar />
        <CommandPalette />
        <Navbar route={route} dark={dark} themeMode={themeMode} reducedMotion={reducedMotion} onToggle={() => setThemeMode((mode) => mode === "system" ? "dark" : mode === "dark" ? "light" : "system")} onMotionToggle={() => setReducedMotion((value) => !value)} />
        <main id="main-content" key={route} tabIndex={-1} {...stylex.props(s.view)}><Suspense fallback={<p role="status" className="route-loading">Loading page…</p>}>{Object.hasOwn(PAGES, route) ? PAGES[route] : <NotFound />}</Suspense></main>
        <Footer />
      </div>
    </ThemeScope>
  );
}
