import { useLayoutEffect, useRef, useState, type ReactNode } from "react";
import * as stylex from "@stylexjs/stylex";
import { tokens } from "@lenso/tokens/tokens.stylex.const";
import { GlassButton, Menu } from "@lenso/ui";
import { PROFILE } from "./data/profile";
import { SOCIAL_PROFILES } from "./data/socials";
import { BRAND, I, Logo } from "./icons";
import { go } from "./router";
import { Reveal } from "./fx";
import { ui } from "./ui";

type R = [string, string, (p: { size?: number }) => ReactNode];
export const PRIMARY: R[] = [["home", "Home", I.home], ["about", "About", I.user], ["projects", "Projects", I.grid], ["art", "Art", I.image], ["collaborate", "Collaborate", I.sparkles], ["contact", "Contact", I.mail]];
const MORE: R[] = [["support", "Support", I.heart], ["links", "Links", I.link], ["privacy", "Privacy", I.shield], ["terms", "Terms", I.file]];
export const ALL = [...PRIMARY, ...MORE];
const sx = (extra: string, ...a: unknown[]) => { const p = stylex.props(...(a as never[])); return { className: `${p.className ?? ""} ${extra}`.trim(), style: p.style }; };
const open = (u: string) => window.open(u, "_blank", "noopener,noreferrer");

const s = stylex.create({
  nav: { position: "sticky", top: 0, zIndex: 30, paddingTop: "calc(10px + env(safe-area-inset-top, 0px))" },
  bar: { display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10, padding: "7px 8px 7px 14px", borderRadius: 999,
    backdropFilter: "blur(26px) saturate(1.8)", WebkitBackdropFilter: "blur(26px) saturate(1.8)", backgroundColor: tokens.fillTertiary,
    boxShadow: "inset 0 1px 0 rgba(255,255,255,.4), 0 10px 32px rgba(0,0,0,.08)" },
  brand: { display: "flex", alignItems: "center", gap: 9, fontWeight: 700, letterSpacing: "-0.02em", fontSize: 16, cursor: "pointer", background: "none", border: "none", color: tokens.labelPrimary, padding: 0 },
  links: { position: "relative", display: { default: "flex", "@media (max-width: 900px)": "none" }, gap: 2 },
  link: { position: "relative", zIndex: 1, border: "none", background: "none", cursor: "pointer", padding: "8px 14px", borderRadius: 999, fontSize: 14, fontWeight: 500, letterSpacing: "-0.01em",
    color: { default: tokens.labelSecondary, ":hover": tokens.labelPrimary }, transition: "color 250ms" },
  linkOn: { color: tokens.labelPrimary },
  pillMark: { position: "absolute", top: 0, bottom: 0, left: 0, borderRadius: 999, backgroundColor: tokens.fillSecondary, transition: "transform 600ms cubic-bezier(.32,.72,0,1), width 600ms cubic-bezier(.32,.72,0,1), opacity 300ms", pointerEvents: "none" },
  right: { display: "flex", gap: 8, alignItems: "center" },
  menu: { maxHeight: "min(72dvh, 560px)", overflowY: "auto", minWidth: 230 },
  ic: { display: "inline-flex", marginRight: 10, verticalAlign: "middle", opacity: 0.85 },
  foot: { paddingBlock: "56px calc(40px + env(safe-area-inset-bottom, 0px))", color: tokens.labelTertiary, fontSize: 14 },
  cols: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: 28, marginBottom: 32 },
  colTitle: { color: tokens.labelPrimary, fontWeight: 650, marginBottom: 10, fontSize: 14, letterSpacing: "-0.01em" },
  tlink: { display: "inline-flex", alignItems: "center", gap: 8, background: "none", border: "none", padding: "5px 0", cursor: "pointer", fontSize: 14,
    color: { default: tokens.labelSecondary, ":hover": tokens.labelPrimary }, transition: "color 200ms" },
  bottom: { display: "flex", flexWrap: "wrap", gap: 12, justifyContent: "space-between", alignItems: "center", paddingTop: 20, borderTop: `1px solid ${tokens.separator}` },
});

export function Navbar({ route, dark, onToggle }: { route: string; dark: boolean; onToggle: () => void }) {
  const ref = useRef<HTMLDivElement>(null);
  const [pill, setPill] = useState<{ x: number; w: number } | null>(null);
  useLayoutEffect(() => {
    const m = () => { const el = ref.current?.querySelector<HTMLElement>(`[data-route="${route}"]`); setPill(el ? { x: el.offsetLeft, w: el.offsetWidth } : null); };
    m(); addEventListener("resize", m); document.fonts?.ready.then(m);
    return () => removeEventListener("resize", m);
  }, [route]);
  return (
    <header {...stylex.props(s.nav)} style={{ viewTransitionName: "nav" } as React.CSSProperties}>
      <div {...stylex.props(ui.wrap)}>
        <nav {...sx("glass", s.bar)} aria-label="Primary">
          <button type="button" {...sx("press", s.brand)} onClick={() => go("home")} aria-label="Go to home"><Logo size={28} />{PROFILE.name}</button>
          <div ref={ref} {...stylex.props(s.links)}>
            <span {...stylex.props(s.pillMark)} style={{ width: pill?.w ?? 0, transform: `translateX(${pill?.x ?? 0}px)`, opacity: pill ? 1 : 0 }} aria-hidden="true" />
            {PRIMARY.map(([id, label]) => (
              <button key={id} type="button" data-route={id} {...sx("press", s.link, route === id && s.linkOn)} aria-current={route === id ? "page" : undefined} onClick={() => go(id)}>{label}</button>
            ))}
          </div>
          <div {...stylex.props(s.right)}>
            <GlassButton aria-label={`Switch to ${dark ? "light" : "dark"} theme`} onClick={onToggle}>{dark ? <I.sun size={18} /> : <I.moon size={18} />}</GlassButton>
            <Menu.Root morphTrigger={false}>
              <Menu.Trigger render={<GlassButton aria-label="Open menu" />}><I.menu size={18} /></Menu.Trigger>
              <Menu.Content xstyle={s.menu}>
                <Menu.Group>
                  <Menu.Group.Label>Pages</Menu.Group.Label>
                  {PRIMARY.map(([id, label, Ic]) => <Menu.Item key={id} onClick={() => go(id)}><span {...stylex.props(s.ic)}><Ic size={18} /></span>{label}</Menu.Item>)}
                </Menu.Group>
                <Menu.Separator />
                <Menu.Group>
                  <Menu.Group.Label>More</Menu.Group.Label>
                  {MORE.map(([id, label, Ic]) => <Menu.Item key={id} onClick={() => go(id)}><span {...stylex.props(s.ic)}><Ic size={18} /></span>{label}</Menu.Item>)}
                </Menu.Group>
              </Menu.Content>
            </Menu.Root>
          </div>
        </nav>
      </div>
    </header>
  );
}

export function PageHead({ eyebrow, title, sub }: { eyebrow: string; title: ReactNode; sub?: string }) {
  return (
    <div {...stylex.props(ui.section)} style={{ paddingTop: 64, paddingBottom: 8 }}>
      <Reveal y={14}><span {...stylex.props(ui.eyebrow)}>{eyebrow}</span></Reveal>
      <Reveal delay={70} y={18}><h1 {...stylex.props(ui.h1)}>{title}</h1></Reveal>
      {sub && <Reveal delay={140} y={18}><p {...stylex.props(ui.lead)}>{sub}</p></Reveal>}
    </div>
  );
}

export function TextLink({ onClick, children }: { onClick: () => void; children: ReactNode }) {
  return <button type="button" {...sx("press", s.tlink)} onClick={onClick}>{children}</button>;
}

export function Footer() {
  return (
    <footer {...stylex.props(ui.wrap, s.foot)}>
      <div {...stylex.props(s.cols)}>
        <div><div {...stylex.props(s.colTitle)}>Explore</div>{PRIMARY.slice(1).map(([id, l]) => <div key={id}><TextLink onClick={() => go(id)}>{l}</TextLink></div>)}</div>
        <div><div {...stylex.props(s.colTitle)}>More</div>{MORE.map(([id, l]) => <div key={id}><TextLink onClick={() => go(id)}>{l}</TextLink></div>)}</div>
        <div><div {...stylex.props(s.colTitle)}>Elsewhere</div>
          {SOCIAL_PROFILES.filter((x) => ["github-primary", "youtube", "instagram", "pinterest"].includes(x.id)).map((x) => {
            const B = BRAND[x.id]; return <div key={x.id}><TextLink onClick={() => open(x.url)}><B.icon size={16} />{x.platform}</TextLink></div>;
          })}
        </div>
      </div>
      <div {...stylex.props(s.bottom)}>
        <span>© {new Date().getFullYear()} {PROFILE.name} · Built with React &amp; Lenso UI</span>
        <TextLink onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>Back to top <I.up size={14} /></TextLink>
      </div>
    </footer>
  );
}
