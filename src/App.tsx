import { useEffect, useState, type ReactNode } from "react";
import * as stylex from "@stylexjs/stylex";
import { tokens } from "@lenso/tokens/tokens.stylex.const";
import { ThemeScope } from "@lenso/ui";
import { ScrollBar } from "./fx";
import { ALL, Footer, Navbar } from "./layout";
import { useRoute } from "./router";
import Home from "./pages/Home";
import About from "./pages/About";
import Projects from "./pages/Projects";
import Art from "./pages/Art";
import { Collaborate, Contact, Links, Support } from "./pages/Connect";
import Legal, { NotFound } from "./pages/Legal";

const rise = stylex.keyframes({ from: { opacity: 0, transform: "translateY(14px)" }, to: { opacity: 1, transform: "none" } });
const s = stylex.create({
  page: { minHeight: "100dvh", backgroundColor: tokens.backgroundGroupedPrimary, color: tokens.labelPrimary, position: "relative", overflowX: "hidden" },
  view: { position: "relative", zIndex: 1, animationName: { default: rise, "@media (prefers-reduced-motion: reduce)": "none" }, animationDuration: "700ms", animationTimingFunction: "cubic-bezier(.32,.72,0,1)", animationFillMode: "both" },
});
const KEY = "krish_theme_v2";
const PAGES: Record<string, ReactNode> = {
  home: <Home />, about: <About />, projects: <Projects />, art: <Art />, collaborate: <Collaborate />, support: <Support />,
  links: <Links />, contact: <Contact />, privacy: <Legal kind="privacy" />, terms: <Legal kind="terms" />,
};

export default function App() {
  const route = useRoute();
  const [dark, setDark] = useState(() => {
    try { const v = localStorage.getItem(KEY); if (v === "dark" || v === "light") return v === "dark"; } catch { /* storage unavailable */ }
    return !matchMedia("(prefers-color-scheme: light)").matches;
  });
  useEffect(() => { try { localStorage.setItem(KEY, dark ? "dark" : "light"); } catch { /* ignore */ } document.body.style.backgroundColor = dark ? "#0b0b0d" : "#f5f5f7"; }, [dark]);
  useEffect(() => {
    const name = ALL.find(([id]) => id === route)?.[1];
    document.title = route === "home" ? "Krish Makwana — Builder, Artist, Student" : `${name ?? "Not found"} · Krish Makwana`;
  }, [route]);
  return (
    <ThemeScope theme={dark ? "dark" : "light"}>
      <div {...stylex.props(s.page)} style={{ backgroundColor: dark ? "#0b0b0d" : "#f5f5f7" }}>
        <ScrollBar />
        <Navbar route={route} dark={dark} onToggle={() => setDark((d) => !d)} />
        <main key={route} {...stylex.props(s.view)}>{Object.hasOwn(PAGES, route) ? PAGES[route] : <NotFound />}</main>
        <Footer />
      </div>
    </ThemeScope>
  );
}
