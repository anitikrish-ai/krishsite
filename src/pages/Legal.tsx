import * as stylex from "@stylexjs/stylex";
import { Button, Card } from "@lenso/ui";
import { PageHead } from "../layout";
import { Reveal } from "../fx";
import { go } from "../router";
import { ui } from "../ui";

const DOCS = {
  privacy: { title: "Privacy", sub: "Plain-language summary of how this site treats your data.", items: [
    ["What stays on your device", "Your theme choice and favorited artwork are saved in your browser’s local storage. They never leave your device."],
    ["Accounts & forms", "There are no accounts. The contact form opens your own email app, so nothing is sent to a server by this site."],
    ["Third-party links", "Links to GitHub, YouTube, Instagram, Pinterest and project sites lead to services with their own privacy policies."],
    ["Questions", "Use the contact page if you want to ask anything about this policy."]] },
  terms: { title: "Terms", sub: "Simple terms for using this portfolio.", items: [
    ["Ownership", "Artwork, designs and written content are created by Krish Makwana. Please ask before reusing or republishing them."],
    ["Projects", "Linked projects are experiments and student work. They are provided as-is, without warranties."],
    ["External sites", "Third-party sites linked here are outside my control."],
    ["Changes", "These terms may be updated as the site grows."]] },
} as const;

export default function Legal({ kind }: { kind: keyof typeof DOCS }) {
  const d = DOCS[kind];
  return (
    <div {...stylex.props(ui.wrap)}>
      <PageHead eyebrow="Legal" title={d.title} sub={d.sub} />
      <div style={{ display: "grid", gap: 16, marginTop: 28, maxWidth: 760 }}>
        {d.items.map(([h, t], i) => <Reveal key={h} delay={i * 80}><Card><div {...stylex.props(ui.pad)}><Card.Title>{h}</Card.Title><p {...stylex.props(ui.muted)}>{t}</p></div></Card></Reveal>)}
      </div>
      <div style={{ marginTop: 24 }}><Button variant="borderless" onClick={() => go("home")}>← Back home</Button></div>
    </div>
  );
}

export function NotFound() {
  return (
    <div {...stylex.props(ui.wrap)}>
      <PageHead eyebrow="404" title={<>Lost in the <span {...stylex.props(ui.grad)}>canvas</span></>} sub="That page doesn’t exist." />
      <Button variant="prominent" size="lg" onClick={() => go("home")}>Take me home</Button>
    </div>
  );
}
