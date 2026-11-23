import * as stylex from "@stylexjs/stylex";
import { tokens } from "@lenso/tokens/tokens.stylex.const";
import { GlassButton } from "@lenso/ui";
import { PROFILE } from "../data/profile";
import { PROJECTS } from "../data/projects";
import { I } from "../icons";
import { go } from "../router";
import { ui } from "../ui";

const s = stylex.create({
  hero: { paddingBlock: { default: "104px 80px", "@media (max-width: 560px)": "72px 56px" } },
  h1: { fontSize: "clamp(48px, 9vw, 88px)", fontWeight: 700, lineHeight: 0.98, letterSpacing: "-0.05em", margin: "0 0 22px", color: tokens.labelPrimary },
  line: { fontSize: "clamp(20px, 3vw, 30px)", fontWeight: 500, letterSpacing: "-0.025em", lineHeight: 1.25, color: tokens.labelPrimary, maxWidth: 760, margin: 0 },
  actions: { display: "flex", alignItems: "center", flexWrap: "wrap", gap: 20, marginTop: 32 },
  cta: { minHeight: 48, borderRadius: 14, paddingInline: 20 },
  section: { paddingBlock: "40px 72px" },
  workRow: { display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: 32, marginTop: 28, "@media (max-width: 680px)": { gridTemplateColumns: "1fr", gap: 24 } },
  workItem: { display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 10, paddingBlock: 18, borderTop: `1px solid ${tokens.separator}` },
  workTitle: { fontSize: 20, fontWeight: 650, letterSpacing: "-0.02em", lineHeight: 1.25, margin: 0, color: tokens.labelPrimary },
  skills: { display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: 28, marginTop: 24, "@media (max-width: 680px)": { gridTemplateColumns: "1fr", gap: 20 } },
  skillGroup: { borderTop: `1px solid ${tokens.separator}`, paddingTop: 14 },
  skillName: { fontSize: 15, fontWeight: 600, margin: "0 0 10px", color: tokens.labelPrimary },
  skillList: { display: "flex", flexWrap: "wrap", columnGap: 12, rowGap: 8, color: tokens.labelSecondary, fontSize: 14 },
  workLink: { display: "inline-flex", alignItems: "center", gap: 8, marginTop: 4, minHeight: 44, color: tokens.labelPrimary, textDecoration: "underline", textUnderlineOffset: 4, fontSize: 14, fontWeight: 550 },
});

export default function Home() {
  const project = PROJECTS.find((item) => item.id === "dropfast");

  return (
    <>
      <section {...stylex.props(ui.wrap, s.hero)}>
        <h1 {...stylex.props(s.h1)}>{PROFILE.name}</h1>
        <p {...stylex.props(s.line)}>{PROFILE.intro}</p>
        <div {...stylex.props(s.actions)}>
          <GlassButton size="lg" variant="prominent" elastic xstyle={s.cta} onClick={() => go("projects")}>View projects</GlassButton>
          <button type="button" className="text-link" onClick={() => go("art")}>See artwork</button>
        </div>
      </section>

      <section {...stylex.props(ui.wrap, s.section)} aria-labelledby="featured-heading">
        <span {...stylex.props(ui.eyebrow)}>Selected work</span>
        <h2 id="featured-heading" {...stylex.props(ui.h2)}>A tool I built and a gallery for my art</h2>
        <div {...stylex.props(s.workRow)}>
          <article {...stylex.props(s.workItem)}>
            <h3 {...stylex.props(s.workTitle)}>{project?.title ?? "Project details pending"}</h3>
            <p {...stylex.props(ui.muted)}>{project?.subtitle ?? "Project information has not been added yet."}</p>
            {project?.liveUrl && <a {...stylex.props(s.workLink)} href={project.liveUrl} target="_blank" rel="noreferrer">Open {project.title}<I.ext size={15} /></a>}
          </article>
          <article {...stylex.props(s.workItem)}>
            <h3 {...stylex.props(s.workTitle)}>Artwork placeholder</h3>
            <p {...stylex.props(ui.muted)}>No original artwork has been added to the portfolio gallery yet.</p>
            <button type="button" className="text-link" onClick={() => go("art")}>Open the gallery</button>
          </article>
        </div>
      </section>

      <section {...stylex.props(ui.wrap, s.section)} aria-labelledby="skills-heading">
        <span {...stylex.props(ui.eyebrow)}>Skills</span>
        <h2 id="skills-heading" {...stylex.props(ui.h2)}>What I use and practice</h2>
        <div {...stylex.props(s.skills)}>
          {PROFILE.skills.map((group) => (
            <section key={group.category} {...stylex.props(s.skillGroup)} aria-label={group.category}>
              <h3 {...stylex.props(s.skillName)}>{group.category}</h3>
              <div {...stylex.props(s.skillList)}>{group.items.map((item) => <span key={item}>{item}</span>)}</div>
            </section>
          ))}
        </div>
      </section>
    </>
  );
}
