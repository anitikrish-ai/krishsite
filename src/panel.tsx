import type { CSSProperties, ReactNode } from "react";
import * as stylex from "@stylexjs/stylex";
import { Card, Chip } from "@lenso/ui";
import { Reveal, Spot } from "./fx";
import { ui } from "./ui";

/** One consistent card: reveal-in, hover lift + spotlight, equal heights in any grid. */
export function Panel({ children, delay = 0, center = false, pad = 24, style }: { children: ReactNode; delay?: number; center?: boolean; pad?: number; style?: CSSProperties }) {
  return (
    <Reveal delay={delay} flex>
      <Spot>
        <Card xstyle={ui.fill}>
          <div {...stylex.props(ui.pad)} style={{ padding: pad, alignItems: center ? "center" : undefined, textAlign: center ? "center" : undefined, ...style }}>{children}</div>
        </Card>
      </Spot>
    </Reveal>
  );
}

export function IconTile({ children, bg = "linear-gradient(135deg,#60a5fa,#a78bfa)", size = 44 }: { children: ReactNode; bg?: string; size?: number }) {
  return <span style={{ width: size, height: size, borderRadius: size * 0.3, display: "grid", placeItems: "center", background: bg, color: "#fff", flexShrink: 0, boxShadow: "0 6px 16px rgba(0,0,0,.14)" }}>{children}</span>;
}

export function Status({ working, children }: { working?: boolean; children: ReactNode }) {
  return <Chip size="sm" variant="soft" color={working ? "success" : "warning"}>{children}</Chip>;
}
