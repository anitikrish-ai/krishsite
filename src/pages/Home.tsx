import * as stylex from "@stylexjs/stylex";
import { tokens } from "@lenso/tokens/tokens.stylex.const";
import { Button, Chip } from "@lenso/ui";
import { PROFILE } from "../data/profile";
import { PROJECTS } from "../data/projects";
import { SOCIAL_PROFILES } from "../data/socials";
import { Counter, Marquee, Reveal, Typewriter } from "../fx";
import { I, SketchArt } from "../icons";
import { IconTile, Panel, Status } from "../panel";
import { go } from "../router";
import { ui } from "../ui";

const s = stylex.create({
  hero: { paddingBlock: { default: "96px 40px", "@media (max-width: 560px)": "64px 24px" }, textAlign: "center" },
  h1: { fontSize: "clamp(44px, 10vw, 112px)", fontWeight: 750, lineHeight: 0.98, letterSpacing: "-0.045em", margin: "22px 0 16px" },
  line: { fontSize: "clamp(19px, 3vw, 30px)", fontWeight: 500, letterSpacing: "-0.02em", color: tokens.labelSecondary, minHeight: 40, margin: 0 },
  center: { justifyContent: "center", marginTop: 30 },
  stats: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(150px, 100%), 1fr))", gap: 16, marginTop: 52 },
  num: { fontSize: 44, fontWeight: 700, letterSpacing: "-0.04em", lineHeight: 1 },
});

const WHAT = [
  { icon: I.code, bg: "linear-gradient(135deg,#60a5fa,#3b82f6)", title: "Build", text: "Web tools and prototypes, built with AI-assisted workflows on solid HTML, CSS, JavaScript, SQL and Python foundations." },
  { icon: I.pen, bg: "linear-gradient(135deg,#fb923c,#f472b6)", title: "Draw", text: "Pencil sketches and anime-inspired digital art, from quick studies to colored illustrations." },
  { icon: I.sparkles, bg: "linear-gradient(135deg,#a78bfa,#6366f1)", title: "Imagine", text: "Product ideas and UI experiments, taken from a rough sketch to something people can use." },
];

export default function Home() {
  const skills = PROFILE.skills.flatMap((g) => g.items);
  const featured = PROJECTS.filter((p) => p.status === "working");
  const stats: [number, string, string][] = [[PROJECTS.length, "", "Projects"], [SOCIAL_PROFILES.length, "", "Places to find me"], [2, "", "Art mediums"], [skills.length, "+", "Skills & tools"]];
  return (
    <>
      <section {...stylex.props(ui.wrap, s.hero)}>
        <Reveal y={10}><Chip color="accent" variant="soft">Computer Engineering Diploma · Final year</Chip></Reveal>
        <Reveal delay={90} y={26}><h1 {...stylex.props(s.h1, ui.grad)}>{PROFILE.name}</h1></Reveal>
        <Reveal delay={180} y={18}><p {...stylex.props(s.line)}>I build <Typewriter words={["web tools", "anime sketches", "UI experiments", "college projects"]} /></p></Reveal>
        <Reveal delay={270} y={18}><p {...stylex.props(ui.lead)} style={{ margin: "18px auto 0" }}>{PROFILE.intro}</p></Reveal>
        <Reveal delay={360} y={18}>
          <div {...stylex.props(ui.row, s.center)}>
            <Button variant="prominent" size="lg" onClick={() => go("art")}>Explore the art</Button>
            <Button variant="bordered" size="lg" onClick={() => go("projects")}>See projects</Button>
            <Button variant="borderless" size="lg" onClick={() => go("contact")}>Say hello <I.arrow size={16} /></Button>
          </div>
        </Reveal>
        <div {...stylex.props(s.stats)}>
          {stats.map(([n, suf, label], i) => (
            <Panel key={label} delay={i * 80} center pad={20}>
              <div {...stylex.props(s.num)}><Counter to={n} suffix={suf} /></div><span {...stylex.props(ui.muted)}>{label}</span>
            </Panel>
          ))}
        </div>
      </section>

      <div style={{ marginBlock: 16 }}><Marquee items={skills} /></div>

      <section {...stylex.props(ui.wrap, ui.section)}>
        <Reveal><span {...stylex.props(ui.eyebrow)}>What I do</span><h2 {...stylex.props(ui.h2)}>Three things I love</h2></Reveal>
        <div {...stylex.props(ui.grid)}>
          {WHAT.map((w, i) => (
            <Panel key={w.title} delay={i * 100}>
              <IconTile bg={w.bg}><w.icon size={22} /></IconTile>
              <h3 {...stylex.props(ui.title)}>{w.title}</h3><p {...stylex.props(ui.muted)}>{w.text}</p>
            </Panel>
          ))}
        </div>
      </section>

      <section {...stylex.props(ui.wrap, ui.section)}>
        <Reveal><span {...stylex.props(ui.eyebrow)}>Featured</span><h2 {...stylex.props(ui.h2)}>Live and working</h2></Reveal>
        <div {...stylex.props(ui.grid)}>
          {featured.map((p, i) => (
            <Panel key={p.id} delay={i * 100}>
              <div><Status working>Working</Status></div>
              <h3 {...stylex.props(ui.title)}>{p.title}</h3><p {...stylex.props(ui.muted)} style={{ fontWeight: 500 }}>{p.subtitle}</p>
              <p {...stylex.props(ui.muted)}>{p.description.length > 140 ? p.description.slice(0, 140) + "…" : p.description}</p>
              <div {...stylex.props(ui.row)}>{p.technologies.slice(0, 3).map((t) => <Chip key={t} size="sm">{t}</Chip>)}</div>
              <div style={{ marginTop: "auto" }}><Button variant="bordered" onClick={() => go("projects")}>All projects <I.arrow size={15} /></Button></div>
            </Panel>
          ))}
          <Panel delay={200}>
            <SketchArt variant="traditional" />
            <h3 {...stylex.props(ui.title)}>Pencil, pen &amp; pixels</h3>
            <p {...stylex.props(ui.muted)}>Traditional sketches and anime-inspired digital art, collected in a photo-library style gallery.</p>
            <div style={{ marginTop: "auto" }}><Button variant="prominent" onClick={() => go("art")}>Open gallery <I.arrow size={15} /></Button></div>
          </Panel>
        </div>
      </section>

      <section {...stylex.props(ui.wrap, ui.section)}>
        <Panel center pad={44}>
          <h2 {...stylex.props(ui.h2, ui.grad)}>Let’s make something together</h2>
          <p {...stylex.props(ui.muted)} style={{ maxWidth: 520 }}>{PROFILE.collaboration.summary}</p>
          <div {...stylex.props(ui.row)} style={{ justifyContent: "center" }}>
            <Button variant="prominent" size="lg" onClick={() => go("collaborate")}>Collaborate</Button>
            <Button variant="bordered" size="lg" onClick={() => go("contact")}>Contact</Button>
          </div>
        </Panel>
      </section>
    </>
  );
}
