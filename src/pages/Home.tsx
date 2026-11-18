import * as stylex from "@stylexjs/stylex";
import { tokens } from "@lenso/tokens/tokens.stylex.const";
import { Badge, Button, Card, Chip } from "@lenso/ui";
import { PROFILE } from "../data/profile";
import { PROJECTS } from "../data/projects";
import { SOCIAL_PROFILES } from "../data/socials";
import { Counter, Marquee, Reveal, Tilt, Typewriter } from "../fx";
import { go } from "../router";
import { ui } from "../ui";

const s = stylex.create({
  hero: { paddingBlock: "104px 48px", textAlign: "center" },
  h1: { fontSize: "clamp(48px, 10vw, 112px)", lineHeight: 0.98, letterSpacing: -4, margin: "22px 0 18px" },
  line: { fontSize: "clamp(20px, 3vw, 30px)", color: tokens.labelSecondary, minHeight: 44, margin: 0 },
  center: { justifyContent: "center", marginTop: 32 },
  stats: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 16, marginTop: 56 },
  num: { fontSize: 44, fontWeight: 700, letterSpacing: -1.5 },
});

export default function Home() {
  const skills = PROFILE.skills.flatMap((g) => g.items);
  const featured = PROJECTS.filter((p) => p.status === "working");
  return (
    <>
      <section {...stylex.props(ui.wrap, s.hero)}>
        <Reveal y={12}><Badge color="accent" size="sm">Computer Engineering Diploma · Final year</Badge></Reveal>
        <Reveal delay={100} y={30}><h1 {...stylex.props(s.h1, ui.grad)}>{PROFILE.name}</h1></Reveal>
        <Reveal delay={200} y={20}><p {...stylex.props(s.line)}>I build <Typewriter words={["web tools", "anime sketches", "UI experiments", "college projects"]} /></p></Reveal>
        <Reveal delay={300} y={20}><p {...stylex.props(ui.muted)} style={{ maxWidth: 620, margin: "18px auto 0", fontSize: 17 }}>{PROFILE.intro}</p></Reveal>
        <Reveal delay={400} y={20}>
          <div {...stylex.props(ui.row, s.center)}>
            <Button variant="prominent" size="lg" onClick={() => go("art")}>Explore the art</Button>
            <Button variant="bordered" size="lg" onClick={() => go("projects")}>See projects</Button>
            <Button variant="borderless" size="lg" onClick={() => go("contact")}>Say hello →</Button>
          </div>
        </Reveal>
        <div {...stylex.props(s.stats)}>
          {[[PROJECTS.length, "", "Projects"], [SOCIAL_PROFILES.length, "", "Places to find me"], [2, "", "Art mediums"], [skills.length, "+", "Skills & tools"]].map(([n, suf, label], i) => (
            <Reveal key={label as string} delay={i * 90}><Card><div {...stylex.props(ui.pad)} style={{ alignItems: "center" }}>
              <div {...stylex.props(s.num)}><Counter to={n as number} suffix={suf as string} /></div>
              <span {...stylex.props(ui.muted)}>{label}</span>
            </div></Card></Reveal>
          ))}
        </div>
      </section>

      <div style={{ marginBlock: 24 }}><Marquee items={skills} /></div>

      <section {...stylex.props(ui.wrap, ui.section)}>
        <Reveal><span {...stylex.props(ui.eyebrow)}>Featured</span><h2 {...stylex.props(ui.h2)}>Live and working</h2></Reveal>
        <div {...stylex.props(ui.grid)}>
          {featured.map((p, i) => (
            <Reveal key={p.id} delay={i * 120}><Tilt><Card><div {...stylex.props(ui.pad)}>
              <Badge color="success" size="sm">Working</Badge>
              <Card.Title>{p.title}</Card.Title><Card.Description>{p.subtitle}</Card.Description>
              <p {...stylex.props(ui.muted)}>{p.description}</p>
              <div {...stylex.props(ui.row)}>{p.technologies.slice(0, 3).map((t) => <Chip key={t}>{t}</Chip>)}</div>
              <div style={{ marginTop: "auto" }}><Button variant="bordered" onClick={() => go("projects")}>All projects →</Button></div>
            </div></Card></Tilt></Reveal>
          ))}
          <Reveal delay={240}><Tilt><Card><div {...stylex.props(ui.pad)} style={{ justifyContent: "center" }}>
            <Badge color="accent" size="sm">Art</Badge>
            <Card.Title>Pencil, pen &amp; pixels</Card.Title>
            <p {...stylex.props(ui.muted)}>Traditional sketches and anime-inspired digital art, collected in a photo-library style gallery.</p>
            <div><Button variant="prominent" onClick={() => go("art")}>Open gallery →</Button></div>
          </div></Card></Tilt></Reveal>
        </div>
      </section>

      <section {...stylex.props(ui.wrap, ui.section)}>
        <Reveal><Card><div {...stylex.props(ui.pad)} style={{ alignItems: "center", textAlign: "center", padding: 48 }}>
          <h2 {...stylex.props(ui.h2, ui.grad)}>Let’s make something together</h2>
          <p {...stylex.props(ui.muted)} style={{ maxWidth: 520 }}>{PROFILE.collaboration.summary}</p>
          <div {...stylex.props(ui.row)} style={{ justifyContent: "center" }}>
            <Button variant="prominent" size="lg" onClick={() => go("collaborate")}>Collaborate</Button>
            <Button variant="bordered" size="lg" onClick={() => go("contact")}>Contact</Button>
          </div>
        </div></Card></Reveal>
      </section>
    </>
  );
}
