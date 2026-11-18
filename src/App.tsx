import { useEffect, useState, type ReactNode } from "react";
import * as stylex from "@stylexjs/stylex";
import { tokens } from "@lenso/tokens/tokens.stylex.const";
import { ThemeScope } from "@lenso/ui";
import { Aurora, ScrollBar } from "./fx";
import { Footer, Navbar, ROUTES } from "./layout";
import { useRoute } from "./router";
import Home from "./pages/Home";
import About from "./pages/About";
import Projects from "./pages/Projects";
import Art from "./pages/Art";
import { Collaborate, Contact, Links, Support } from "./pages/Connect";
import Legal, { NotFound } from "./pages/Legal";

const pageIn = stylex.keyframes({
  from: { opacity: 0, transform: "translateY(22px)", filter: "blur(8px)" },
  to: { opacity: 1, transform: "none", filter: "blur(0)" },
});

const s = stylex.create({
  page: { minHeight: "100vh", backgroundColor: tokens.backgroundGroupedPrimary, color: tokens.labelPrimary, position: "relative",
    fontFamily: "system-ui, -apple-system, 'Segoe UI', sans-serif", overflowX: "hidden" },
  view: { position: "relative", zIndex: 1, animationName: { default: pageIn, "@media (prefers-reduced-motion: reduce)": "none" },
    animationDuration: "650ms", animationTimingFunction: "cubic-bezier(.2,.7,.2,1)", animationFillMode: "both" },
});
const KEY = "krish_theme_v2";
const PAGES: Record<string, ReactNode> = {
  home: <Home />, about: <About />, projects: <Projects />, art: <Art />, collaborate: <Collaborate />, support: <Support />,
  links: <Links />, contact: <Contact />, privacy: <Legal kind="privacy" />, terms: <Legal kind="terms" />,
};

export default function App() {
  const route = useRoute();
  const [dark, setDark] = useState(() => {
    try { const v = localStorage.getItem(KEY); if (v) return v === "dark"; } catch { /* storage unavailable */ }
    return !matchMedia("(prefers-color-scheme: light)").matches;
  });
  useEffect(() => { try { localStorage.setItem(KEY, dark ? "dark" : "light"); } catch { /* ignore */ } }, [dark]);
  useEffect(() => {
    const name = ROUTES.find(([id]) => id === route)?.[1] ?? (PAGES[route] ? route[0].toUpperCase() + route.slice(1) : "Not found");
    document.title = route === "home" ? "Krish Makwana — Builder, Artist, Student" : `${name} · Krish Makwana`;
  }, [route]);
  return (
    <ThemeScope theme={dark ? "dark" : "light"}>
      <div {...stylex.props(s.page)}>
        <Aurora /><ScrollBar />
        <Navbar route={route} dark={dark} onToggle={() => setDark((d) => !d)} />
        <main key={route} {...stylex.props(s.view)}>{PAGES[route] ?? <NotFound />}</main>
        <Footer />
      </div>
    </ThemeScope>
  );
}
