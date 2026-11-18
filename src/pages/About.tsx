import * as stylex from "@stylexjs/stylex";
import { Accordion, Card, Chip } from "@lenso/ui";
import { PROFILE } from "../data/profile";
import { PageHead } from "../layout";
import { Reveal, Tilt } from "../fx";
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
        {PROFILE.aboutStory.map((p, i) => <Reveal key={i} delay={i * 100}><Card><div {...stylex.props(ui.pad)}><p {...stylex.props(ui.muted)}>{p}</p></div></Card></Reveal>)}
      </div>
      <div {...stylex.props(ui.grid)}>
        {([["Traditional art", PROFILE.traditionalArtFocus], ["Digital art", PROFILE.digitalArtFocus]] as const).map(([t, items], i) => (
          <Reveal key={t} delay={i * 120}><Tilt><Card><div {...stylex.props(ui.pad)}>
            <Card.Title>{t}</Card.Title><ul {...stylex.props(ui.list)}>{items.map((x) => <li key={x}>{x}</li>)}</ul>
          </div></Card></Tilt></Reveal>
        ))}
        {PROFILE.skills.map((g, i) => (
          <Reveal key={g.category} delay={i * 120}><Tilt><Card><div {...stylex.props(ui.pad)}>
            <Card.Title>{g.category}</Card.Title><div {...stylex.props(ui.row)}>{g.items.map((x) => <Chip key={x}>{x}</Chip>)}</div>
          </div></Card></Tilt></Reveal>
        ))}
      </div>
      <div {...stylex.props(ui.section)}>
        <Reveal><h2 {...stylex.props(ui.h2)}>Quick answers</h2></Reveal>
        <Reveal delay={100}><Accordion>
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
