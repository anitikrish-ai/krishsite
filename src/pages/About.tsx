import * as stylex from "@stylexjs/stylex";
import { Accordion, Chip } from "@lenso/ui";
import { PROFILE } from "../data/profile";
import { PageHead } from "../layout";
import { Reveal } from "../fx";
import { I } from "../icons";
import { IconTile, Panel } from "../panel";
import { ui } from "../ui";

const faq: [string, string][] = [
  ["Do you use AI to build things?", PROFILE.honestNote],
  ["What are you studying?", PROFILE.education],
  ["What kind of work are you open to?", PROFILE.collaboration.summary],
  ["Where are you based?", PROFILE.location],
];

export default function About() {
  return (
    <div {...stylex.props(ui.wrap)}>
      <PageHead eyebrow="About" title={<>Builder of ideas, <span {...stylex.props(ui.grad)}>artist at heart</span></>} sub={PROFILE.tagline} />
      <div {...stylex.props(ui.grid)}>
        {PROFILE.aboutStory.map((p, i) => <Panel key={i} delay={i * 90}><p {...stylex.props(ui.muted)} style={{ fontSize: 16.5 }}>{p}</p></Panel>)}
      </div>
      <div {...stylex.props(ui.grid)}>
        {([["Traditional art", PROFILE.traditionalArtFocus, I.pen, "linear-gradient(135deg,#fb923c,#f472b6)"], ["Digital art", PROFILE.digitalArtFocus, I.image, "linear-gradient(135deg,#60a5fa,#a78bfa)"]] as const).map(([t, items, Ic, bg], i) => (
          <Panel key={t} delay={i * 100}>
            <IconTile bg={bg}><Ic size={22} /></IconTile>
            <h3 {...stylex.props(ui.title)}>{t}</h3><ul {...stylex.props(ui.list)}>{items.map((x) => <li key={x}>{x}</li>)}</ul>
          </Panel>
        ))}
        {PROFILE.skills.map((g, i) => (
          <Panel key={g.category} delay={i * 100}>
            <h3 {...stylex.props(ui.title)}>{g.category}</h3>
            <div {...stylex.props(ui.row)}>{g.items.map((x) => <Chip key={x}>{x}</Chip>)}</div>
          </Panel>
        ))}
      </div>
      <div {...stylex.props(ui.section)}>
        <Reveal><h2 {...stylex.props(ui.h2)}>Quick answers</h2></Reveal>
        <Reveal delay={90}><Accordion>
          {faq.map(([q, a]) => (
            <Accordion.Item key={q} value={q}>
              <Accordion.Heading><Accordion.Trigger>{q}<Accordion.Indicator /></Accordion.Trigger></Accordion.Heading>
              <Accordion.Panel><Accordion.Body>{a}</Accordion.Body></Accordion.Panel>
            </Accordion.Item>
          ))}
        </Accordion></Reveal>
      </div>
    </div>
  );
}
