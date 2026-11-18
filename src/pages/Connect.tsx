import { useState } from "react";
import * as stylex from "@stylexjs/stylex";
import { Avatar, Badge, Button, Card, TextArea, TextField } from "@lenso/ui";
import { PROFILE } from "../data/profile";
import { SOCIAL_PROFILES } from "../data/socials";
import { PageHead } from "../layout";
import { Reveal, Tilt } from "../fx";
import { go } from "../router";
import { ui } from "../ui";

const open = (u: string) => window.open(u, "_blank", "noopener,noreferrer");
const steps = ["Tell me what you have in mind", "We shape the idea and scope together", "I build or draw a first version", "We refine it until it feels right"];

export function Collaborate() {
  return (
    <div {...stylex.props(ui.wrap)}>
      <PageHead eyebrow="Collaborate" title={<>Hire me &amp; <span {...stylex.props(ui.grad)}>collaborate</span></>} sub={PROFILE.collaboration.summary} />
      <div {...stylex.props(ui.grid)}>
        {PROFILE.collaboration.options.map((o, i) => (
          <Reveal key={o.title} delay={i * 110}><Tilt><Card><div {...stylex.props(ui.pad)}><Card.Title>{o.title}</Card.Title><p {...stylex.props(ui.muted)}>{o.description}</p></div></Card></Tilt></Reveal>
        ))}
      </div>
      <div {...stylex.props(ui.section)}>
        <Reveal><h2 {...stylex.props(ui.h2)}>How it works</h2></Reveal>
        <div {...stylex.props(ui.grid)}>
          {steps.map((t, i) => <Reveal key={t} delay={i * 100}><Card><div {...stylex.props(ui.pad)}><Badge color="accent" size="sm">Step {i + 1}</Badge><p {...stylex.props(ui.muted)}>{t}</p></div></Card></Reveal>)}
        </div>
        <div style={{ marginTop: 28 }}><Button variant="prominent" size="lg" onClick={() => go("contact")}>Start a conversation</Button></div>
      </div>
    </div>
  );
}

export function Support() {
  return (
    <div {...stylex.props(ui.wrap)}>
      <PageHead eyebrow="Support" title={<>Support my <span {...stylex.props(ui.grad)}>work</span></>} sub={PROFILE.support.summary} />
      <div {...stylex.props(ui.grid)}>
        {PROFILE.support.links.map((l, i) => (
          <Reveal key={l.label} delay={i * 110}><Tilt><Card><div {...stylex.props(ui.pad)}>
            <Card.Title>{l.label}</Card.Title><p {...stylex.props(ui.muted)}>{l.description}</p>
            <div style={{ marginTop: "auto" }}><Button variant="prominent" onClick={() => open(l.url)}>Open ↗</Button></div>
          </div></Card></Tilt></Reveal>
        ))}
      </div>
    </div>
  );
}

export function Links() {
  return (
    <div {...stylex.props(ui.wrap)}>
      <PageHead eyebrow="Links" title={<>Find me <span {...stylex.props(ui.grad)}>everywhere</span></>} sub="Every profile in one place." />
      <div {...stylex.props(ui.grid)}>
        {SOCIAL_PROFILES.map((x, i) => (
          <Reveal key={x.id} delay={i * 80}><Tilt><Card><div {...stylex.props(ui.pad)}>
            <Avatar><Avatar.Fallback>{x.platform.slice(0, 2).toUpperCase()}</Avatar.Fallback></Avatar>
            <Card.Title>{x.label}</Card.Title><Card.Description>{x.username}</Card.Description>
            <p {...stylex.props(ui.muted)}>{x.description}</p>
            <div style={{ marginTop: "auto" }}><Button variant="bordered" onClick={() => open(x.url)}>Visit ↗</Button></div>
          </div></Card></Tilt></Reveal>
        ))}
      </div>
    </div>
  );
}

export function Contact() {
  const [name, setName] = useState(""); const [email, setEmail] = useState(""); const [msg, setMsg] = useState(""); const [copied, setCopied] = useState(false);
  const send = () => {
    const body = `${msg}\n\n— ${name || "Anonymous"}${email ? ` (${email})` : ""}`;
    window.location.href = `mailto:${PROFILE.contact.email}?subject=${encodeURIComponent("Hello from your portfolio")}&body=${encodeURIComponent(body)}`;
  };
  const copy = async () => { try { await navigator.clipboard.writeText(PROFILE.contact.email); setCopied(true); setTimeout(() => setCopied(false), 2000); } catch { send(); } };
  return (
    <div {...stylex.props(ui.wrap)}>
      <PageHead eyebrow="Contact" title={<>Say <span {...stylex.props(ui.grad)}>hello</span></>} sub="Write a message and it opens in your email app, ready to send." />
      <div {...stylex.props(ui.grid)}>
        <Reveal><Card><div {...stylex.props(ui.pad)}>
          <TextField name="name"><TextField.Label>Your name</TextField.Label><TextField.Input value={name} onChange={(e) => setName(e.target.value)} /></TextField>
          <TextField name="email"><TextField.Label>Your email</TextField.Label><TextField.Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} /></TextField>
          <TextArea aria-label="Message" placeholder="What would you like to build or draw?" rows={5} fullWidth value={msg} onChange={(e) => setMsg(e.target.value)} />
          <Button variant="prominent" disabled={!msg.trim()} onClick={send}>Send message</Button>
        </div></Card></Reveal>
        <Reveal delay={120}><Card><div {...stylex.props(ui.pad)}>
          <Card.Title>Direct</Card.Title><p {...stylex.props(ui.muted)}>{PROFILE.contact.email}</p>
          <Button variant="bordered" onClick={copy}>{copied ? "Copied ✓" : "Copy email"}</Button>
          <p {...stylex.props(ui.muted)}>Prefer DMs? Reach out on Instagram or GitHub.</p>
          <Button variant="borderless" onClick={() => go("links")}>All profiles →</Button>
        </div></Card></Reveal>
      </div>
    </div>
  );
}
