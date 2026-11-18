import * as stylex from "@stylexjs/stylex";
import { tokens } from "@lenso/tokens/tokens.stylex.const";

export const ui = stylex.create({
  wrap: { maxWidth: 1120, marginInline: "auto", paddingInline: { default: 24, "@media (max-width: 560px)": 16 }, position: "relative", zIndex: 1, boxSizing: "border-box", width: "100%" },
  section: { paddingBlock: "32px 56px" },
  eyebrow: { fontSize: 13, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: tokens.labelSecondary },
  h1: { fontSize: "clamp(38px, 6.4vw, 68px)", fontWeight: 700, letterSpacing: "-0.035em", lineHeight: 1.04, margin: "10px 0 14px" },
  h2: { fontSize: "clamp(26px, 3.6vw, 40px)", fontWeight: 700, letterSpacing: "-0.028em", lineHeight: 1.1, margin: "8px 0 8px" },
  lead: { fontSize: "clamp(17px, 2vw, 20px)", lineHeight: 1.5, letterSpacing: "-0.01em", color: tokens.labelSecondary, margin: 0, maxWidth: 640 },
  muted: { color: tokens.labelSecondary, lineHeight: 1.6, margin: 0, fontSize: 15.5, letterSpacing: "-0.005em" },
  title: { fontSize: 19, fontWeight: 650, letterSpacing: "-0.02em", lineHeight: 1.25, margin: 0 },
  grid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(290px, 100%), 1fr))", gap: 20, marginTop: 28, alignItems: "stretch" },
  pad: { display: "flex", flexDirection: "column", gap: 12, height: "100%", boxSizing: "border-box", width: "100%" },
  row: { display: "flex", flexWrap: "wrap", gap: 8, alignItems: "center" },
  list: { margin: 0, paddingLeft: 18, color: tokens.labelSecondary, lineHeight: 1.9, fontSize: 15.5 },
  fill: { flex: 1, width: "100%", minHeight: 0 },
  grad: { backgroundImage: "linear-gradient(110deg,#60a5fa,#a78bfa 45%,#fb923c)", backgroundClip: "text", WebkitBackgroundClip: "text", color: "transparent" },
  scrollX: { overflowX: "auto", maxWidth: "100%", scrollbarWidth: "none" },
});
