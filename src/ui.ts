import * as stylex from "@stylexjs/stylex";
import { tokens } from "@lenso/tokens/tokens.stylex.const";

export const ui = stylex.create({
  wrap: { maxWidth: 1100, marginInline: "auto", paddingInline: 24, position: "relative", zIndex: 1, boxSizing: "border-box" },
  section: { paddingBlock: "40px 56px" },
  eyebrow: { fontSize: 13, fontWeight: 600, letterSpacing: 1.2, textTransform: "uppercase", color: tokens.labelSecondary },
  h1: { fontSize: "clamp(36px, 6vw, 64px)", letterSpacing: -2, margin: "8px 0 12px", lineHeight: 1.04 },
  h2: { fontSize: "clamp(26px, 3.6vw, 40px)", letterSpacing: -1, margin: "8px 0 12px", lineHeight: 1.1 },
  muted: { color: tokens.labelSecondary, lineHeight: 1.65, margin: 0 },
  grid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 20, marginTop: 28 },
  pad: { padding: 22, display: "flex", flexDirection: "column", gap: 12, height: "100%", boxSizing: "border-box" },
  row: { display: "flex", flexWrap: "wrap", gap: 8, alignItems: "center" },
  list: { margin: 0, paddingLeft: 18, color: tokens.labelSecondary, lineHeight: 1.9 },
  grad: { backgroundImage: "linear-gradient(110deg,#60a5fa,#c084fc 45%,#fb923c)", backgroundClip: "text", WebkitBackgroundClip: "text", color: "transparent" },
});
