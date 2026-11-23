import { useLayoutEffect, useRef, useState, type ReactNode } from "react";
import * as stylex from "@stylexjs/stylex";
import { tokens } from "@lenso/tokens/tokens.stylex.const";
import { GlassButton, Menu, Toolbar } from "@lenso/ui";
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
  nav: { position: "sticky", top: 0, zIndex: 30, paddingTop: "calc(8px + env(safe-area-inset-top, 0px))" },
  bar: { display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, paddingBlock: 4, minHeight: 56 },
  brand: { display: "flex", alignItems: "center", gap: 9, minHeight: 44, fontWeight: 650, letterSpacing: "-0.02em", fontSize: 15, cursor: "pointer", background: "none", border: "none", color: tokens.labelPrimary, padding: "0 8px 0 0", whiteSpace: "nowrap" },
  links: { position: "relative", display: { default: "flex", "@media (max-width: 900px)": "none" }, gap: 2, padding: 3, borderRadius: 12 },
  link: { position: "relative", zIndex: 1, border: "none", background: "none", cursor: "pointer", padding: "8px 12px", minHeight: 44, borderRadius: 9, fontSize: 14, fontWeight: 500, letterSpacing: "-0.01em",
    color: { default: tokens.labelSecondary, ":hover": tokens.labelPrimary }, transition: "color 180ms ease-out" },
  linkOn: { color: tokens.labelPrimary },
  pillMark: { position: "absolute", top: 3, bottom: 3, left: 3, borderRadius: 8, backgroundColor: tokens.fillSecondary, transition: "transform 320ms cubic-bezier(.2,.7,.2,1), width 320ms cubic-bezier(.2,.7,.2,1), opacity 180ms", pointerEvents: "none" },
  right: { display: "flex", gap: 6, alignItems: "center" },
  iconButton: { width: 44, height: 44, minWidth: 44, borderRadius: 12 },
  mobileTabs: { display: { default: "none", "@media (max-width: 900px)": "flex" }, position: "fixed", zIndex: 35, inset: "auto 8px calc(8px + env(safe-area-inset-bottom, 0px))", justifyContent: "space-around", alignItems: "stretch", gap: 2, padding: 4, borderRadius: 14, border: `1px solid ${tokens.separator}`, backgroundColor: tokens.backgroundGroupedPrimary, boxShadow: "0 8px 28px rgba(0,0,0,.16)" },
  mobileTab: { display: "flex", flex: 1, flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 2, minWidth: 44, minHeight: 48, padding: "4px 2px", border: "none", borderRadius: 10, background: "none", color: tokens.labelSecondary, fontSize: 10, lineHeight: 1.15, cursor: "pointer" },
  mobileTabOn: { backgroundColor: tokens.fillSecondary, color: tokens.labelPrimary },
  menu: { maxHeight: "min(72dvh, 560px)", overflowY: "auto", minWidth: 230 },
  ic: { display: "inline-flex", marginRight: 10, verticalAlign: "middle", opacity: 0.85 },
  foot: { paddingBlock: "56px calc(40px + env(safe-area-inset-bottom, 0px))", color: tokens.labelTertiary, fontSize: 14 },
  cols: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: 28, marginBottom: 32 },
  colTitle: { color: tokens.labelPrimary, fontWeight: 650, marginBottom: 10, fontSize: 14, letterSpacing: "-0.01em" },
  tlink: { display: "inline-flex", alignItems: "center", gap: 8, background: "none", border: "none", padding: "5px 0", cursor: "pointer", fontSize: 14,
    color: { default: tokens.labelSecondary, ":hover": tokens.labelPrimary }, transition: "color 200ms" },
  bottom: { display: "flex", flexWrap: "wrap", gap: 12, justifyContent: "space-between", alignItems: "center", paddingTop: 20, borderTop: `1px solid ${tokens.separator}` },
});

export function Navbar({ route, dark, themeMode, reducedMotion, onToggle, onMotionToggle }: { route: string; dark: boolean; themeMode: "light" | "dark" | "system"; reducedMotion: boolean; onToggle: () => void; onMotionToggle: () => void }) {
  const ref = useRef<HTMLDivElement>(null);
  const [pill, setPill] = useState<{ x: number; w: number } | null>(null);
  useLayoutEffect(() => {
    const measure = () => {
      const active = ref.current?.querySelector<HTMLElement>(`[data-route="${route}"]`);
      setPill(active ? { x: active.offsetLeft, w: active.offsetWidth } : null);
    };
    measure();
    addEventListener("resize", measure);
    document.fonts?.ready.then(measure);
    return () => removeEventListener("resize", measure);
  }, [route]);

  return (
    <header {...stylex.props(s.nav)} style={{ viewTransitionName: "nav" } as React.CSSProperties}>
      <div {...stylex.props(ui.wrap)}>
        <Toolbar aria-label="Primary navigation" xstyle={s.bar}>
          <button type="button" {...sx("press", s.brand)} onClick={() => go("home")} aria-label="Go to home"><Logo size={28} />{PROFILE.name}</button>
          <Toolbar.Group ref={ref} glass xstyle={s.links}>
            <span {...stylex.props(s.pillMark)} style={{ width: pill?.w ?? 0, transform: `translateX(${pill?.x ?? 0}px)`, opacity: pill ? 1 : 0 }} aria-hidden="true" />
            {PRIMARY.map(([id, label]) => (
              <Toolbar.Button key={id} data-route={id} {...sx("press", s.link, route === id && s.linkOn)} aria-current={route === id ? "page" : undefined} onClick={() => go(id)}>{label}</Toolbar.Button>
            ))}
          </Toolbar.Group>
          <div {...stylex.props(s.right)}>
            <GlassButton size="md" isIconOnly elastic xstyle={s.iconButton} aria-label={`Theme: ${themeMode}. Activate to change theme.`} title={`Theme: ${themeMode}`} onClick={onToggle}>{dark ? <I.sun size={18} /> : <I.moon size={18} />}</GlassButton>
            <Menu.Root morphTrigger>
              <Menu.Trigger morphSource="toolbar" render={<GlassButton size="md" isIconOnly elastic xstyle={s.iconButton} aria-label="Open menu" />}><I.menu size={18} /></Menu.Trigger>
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
                <Menu.Separator />
                <Menu.Group>
                  <Menu.Group.Label>Preferences</Menu.Group.Label>
                  <Menu.Item onClick={onToggle}>Theme: {themeMode}</Menu.Item>
                  <Menu.Item onClick={onMotionToggle}>Reduced motion: {reducedMotion ? "On" : "Off"}</Menu.Item>
                </Menu.Group>
              </Menu.Content>
            </Menu.Root>
          </div>
        </Toolbar>
        <nav aria-label="Mobile navigation" {...stylex.props(s.mobileTabs)}>
          {PRIMARY.filter(([id]) => ["home", "projects", "art", "collaborate", "contact"].includes(id)).map(([id, label, Ic]) => (
            <button key={id} type="button" {...sx("press", s.mobileTab, route === id && s.mobileTabOn)} aria-current={route === id ? "page" : undefined} onClick={() => go(id)}>
              <Ic size={18} /><span>{label}</span>
            </button>
          ))}
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
