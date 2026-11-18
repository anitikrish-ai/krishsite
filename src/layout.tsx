import type { ReactNode } from "react";
import * as stylex from "@stylexjs/stylex";
import { tokens } from "@lenso/tokens/tokens.stylex.const";
import { Button, GlassButton, Menu } from "@lenso/ui";
import { PROFILE } from "./data/profile";
import { SOCIAL_PROFILES } from "./data/socials";
import { go } from "./router";
import { Reveal } from "./fx";
import { ui } from "./ui";

export const ROUTES: [string, string][] = [["home", "Home"], ["about", "About"], ["projects", "Projects"], ["art", "Art"], ["collaborate", "Collaborate"], ["contact", "Contact"]];
const MORE: [string, string][] = [["support", "Support"], ["links", "Links"], ["privacy", "Privacy"], ["terms", "Terms"]];
const open = (u: string) => window.open(u, "_blank", "noopener,noreferrer");

const s = stylex.create({
  nav: { position: "sticky", top: 0, zIndex: 20, paddingTop: 12 },
  bar: { display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8, padding: "8px 12px 8px 20px", borderRadius: 999,
    backdropFilter: "blur(24px) saturate(1.7)", WebkitBackdropFilter: "blur(24px) saturate(1.7)", backgroundColor: tokens.fillTertiary },
  brand: { fontWeight: 700, letterSpacing: -0.4, fontSize: 17, cursor: "pointer", background: "none", border: "none", color: "inherit", padding: 0 },
  links: { display: { default: "flex", "@media (max-width: 860px)": "none" }, gap: 2 },
  mobile: { display: { default: "none", "@media (max-width: 860px)": "block" } },
  right: { display: "flex", gap: 8, alignItems: "center" },
  foot: { paddingBlock: "48px 40px", color: tokens.labelTertiary, fontSize: 14 },
  cols: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 24, marginBottom: 28 },
  colTitle: { color: tokens.labelPrimary, fontWeight: 600, marginBottom: 8, fontSize: 14 },
});

export function Navbar({ route, dark, onToggle }: { route: string; dark: boolean; onToggle: () => void }) {
  return (
    <header {...stylex.props(s.nav)}>
      <div {...stylex.props(ui.wrap)}>
        <nav {...stylex.props(s.bar)} aria-label="Primary">
          <button type="button" {...stylex.props(s.brand)} onClick={() => go("home")}>◐ {PROFILE.name}</button>
          <div {...stylex.props(s.links)}>
            {ROUTES.map(([id, label]) => (
              <Button key={id} size="sm" variant={route === id ? "bordered" : "borderless"} aria-current={route === id ? "page" : undefined} onClick={() => go(id)}>{label}</Button>
            ))}
          </div>
          <div {...stylex.props(s.right)}>
            <Menu.Root morphTrigger={false}>
              <Menu.Trigger render={<GlassButton aria-label="Menu" />}>☰</Menu.Trigger>
              <Menu.Content>
                {[...ROUTES, ...MORE].map(([id, label]) => <Menu.Item key={id} onClick={() => go(id)}>{label}</Menu.Item>)}
              </Menu.Content>
            </Menu.Root>
            <GlassButton aria-label={`Switch to ${dark ? "light" : "dark"} theme`} onClick={onToggle}>{dark ? "☀︎" : "☾"}</GlassButton>
          </div>
        </nav>
      </div>
    </header>
  );
}

export function PageHead({ eyebrow, title, sub }: { eyebrow: string; title: ReactNode; sub?: string }) {
  return (
    <div {...stylex.props(ui.section)} style={{ paddingTop: 72, paddingBottom: 8 }}>
      <Reveal y={16}><span {...stylex.props(ui.eyebrow)}>{eyebrow}</span></Reveal>
      <Reveal delay={80} y={20}><h1 {...stylex.props(ui.h1)}>{title}</h1></Reveal>
      {sub && <Reveal delay={160} y={20}><p {...stylex.props(ui.muted)} style={{ maxWidth: 640, fontSize: 18 }}>{sub}</p></Reveal>}
    </div>
  );
}

export function Footer() {
  return (
    <footer {...stylex.props(ui.wrap, s.foot)}>
      <div {...stylex.props(s.cols)}>
        <div><div {...stylex.props(s.colTitle)}>Explore</div>{ROUTES.slice(1).map(([id, l]) => <div key={id}><Button variant="borderless" size="sm" onClick={() => go(id)}>{l}</Button></div>)}</div>
        <div><div {...stylex.props(s.colTitle)}>More</div>{MORE.map(([id, l]) => <div key={id}><Button variant="borderless" size="sm" onClick={() => go(id)}>{l}</Button></div>)}</div>
        <div><div {...stylex.props(s.colTitle)}>Elsewhere</div>{SOCIAL_PROFILES.slice(2, 5).map((x) => <div key={x.id}><Button variant="borderless" size="sm" onClick={() => open(x.url)}>{x.platform}</Button></div>)}</div>
      </div>
      © {new Date().getFullYear()} {PROFILE.name} · Built with React &amp; Lenso UI ·{" "}
      <Button variant="borderless" size="sm" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>Back to top ↑</Button>
    </footer>
  );
}
