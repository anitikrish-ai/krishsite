import { useState } from "react";
import * as stylex from "@stylexjs/stylex";
import { Button, TextArea, TextField } from "@lenso/ui";
import { PROFILE } from "../data/profile";
import { SOCIAL_PROFILES } from "../data/socials";
import { PageHead } from "../layout";
import { BRAND, I } from "../icons";
import { IconTile, Panel } from "../panel";
import { go } from "../router";
import { ui } from "../ui";

const open = (u: string) => window.open(u, "_blank", "noopener,noreferrer");
const steps = ["Tell me what you have in mind", "We shape the idea and scope together", "I build or draw a first version", "We refine it until it feels right"];
const num = stylex.create({ n: { width: 34, height: 34, borderRadius: 999, display: "grid", placeItems: "center", fontWeight: 700, fontSize: 15, color: "#fff", backgroundImage: "linear-gradient(135deg,#60a5fa,#a78bfa)" } });

export function Collaborate() {
  return (
    <div {...stylex.props(ui.wrap)}>
      <PageHead eyebrow="Collaborate" title={<>Hire me &amp; <span {...stylex.props(ui.grad)}>collaborate</span></>} sub={PROFILE.collaboration.summary} />
      <div {...stylex.props(ui.grid)}>
        {PROFILE.collaboration.options.map((o, i) => (
          <Panel key={o.title} delay={i * 100}>
            <IconTile bg={["linear-gradient(135deg,#60a5fa,#3b82f6)", "linear-gradient(135deg,#fb923c,#f472b6)", "linear-gradient(135deg,#a78bfa,#6366f1)"][i % 3]}>{[<I.code size={22} />, <I.pen size={22} />, <I.sparkles size={22} />][i % 3]}</IconTile>
            <h3 {...stylex.props(ui.title)}>{o.title}</h3><p {...stylex.props(ui.muted)}>{o.description}</p>
          </Panel>
        ))}
      </div>
      <div {...stylex.props(ui.section)} style={{ paddingTop: 48 }}>
        <h2 {...stylex.props(ui.h2)}>How it works</h2>
        <div {...stylex.props(ui.grid)}>
          {steps.map((t, i) => <Panel key={t} delay={i * 90} pad={20}><span {...stylex.props(num.n)}>{i + 1}</span><p {...stylex.props(ui.muted)} style={{ fontSize: 16 }}>{t}</p></Panel>)}
        </div>
        <div style={{ marginTop: 28 }}><Button variant="prominent" size="lg" onClick={() => go("contact")}>Start a conversation <I.arrow size={16} /></Button></div>
      </div>
    </div>
  );
}

export function Support() {
  const tint = ["linear-gradient(135deg,#24292f,#57606a)", "linear-gradient(135deg,#ff0033,#ff6b81)", "linear-gradient(135deg,#f9a03f,#e1306c 50%,#833ab4)"];
  const icons = [<I.github size={22} />, <I.youtube size={22} />, <I.instagram size={22} />];
  return (
    <div {...stylex.props(ui.wrap)}>
      <PageHead eyebrow="Support" title={<>Support my <span {...stylex.props(ui.grad)}>work</span></>} sub={PROFILE.support.summary} />
      <div {...stylex.props(ui.grid)}>
        {PROFILE.support.links.map((l, i) => (
          <Panel key={l.label} delay={i * 100}>
            <IconTile bg={tint[i % 3]}>{icons[i % 3]}</IconTile>
            <h3 {...stylex.props(ui.title)}>{l.label}</h3><p {...stylex.props(ui.muted)}>{l.description}</p>
            <div style={{ marginTop: "auto" }}><Button variant="prominent" onClick={() => open(l.url)}>Open <I.ext size={14} /></Button></div>
          </Panel>
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
        {SOCIAL_PROFILES.map((x, i) => {
          const b = BRAND[x.id];
          return (
            <Panel key={x.id} delay={i * 70}>
              <IconTile bg={b.bg} size={48}><b.icon size={24} /></IconTile>
              <h3 {...stylex.props(ui.title)}>{x.label}</h3><p {...stylex.props(ui.muted)} style={{ fontWeight: 500 }}>{x.username}</p>
              <p {...stylex.props(ui.muted)}>{x.description}</p>
              <div style={{ marginTop: "auto" }}><Button variant="bordered" onClick={() => open(x.url)}>Visit <I.ext size={14} /></Button></div>
            </Panel>
          );
        })}
      </div>
    </div>
  );
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const clean = (v: string, max: number) => v.replace(/[\u0000-\u001f\u007f]+/g, " ").trim().slice(0, max);

export function Contact() {
  const [name, setName] = useState(""); const [email, setEmail] = useState(""); const [msg, setMsg] = useState("");
  const [copied, setCopied] = useState(false); const [err, setErr] = useState("");
  const send = () => {
    const n = clean(name, 80), e = clean(email, 120), m = msg.replace(/\u0000/g, "").trim().slice(0, 2000);
    if (e && !EMAIL_RE.test(e)) { setErr("Please enter a valid email address, or leave it empty."); return; }
    setErr("");
    const body = `${m}\n\n— ${n || "Anonymous"}${e ? ` (${e})` : ""}`;
    window.location.href = `mailto:${PROFILE.contact.email}?subject=${encodeURIComponent("Hello from your portfolio")}&body=${encodeURIComponent(body)}`;
  };
  const copy = async () => { try { await navigator.clipboard.writeText(PROFILE.contact.email); setCopied(true); setTimeout(() => setCopied(false), 2000); } catch { setErr("Couldn’t copy. Select the address and copy it manually."); } };
  return (
    <div {...stylex.props(ui.wrap)}>
      <PageHead eyebrow="Contact" title={<>Say <span {...stylex.props(ui.grad)}>hello</span></>} sub="Write a message and it opens in your email app, ready to send." />
      <div {...stylex.props(ui.grid)}>
        <Panel>
          <TextField name="name"><TextField.Label>Your name</TextField.Label><TextField.Input value={name} maxLength={80} autoComplete="name" onChange={(e) => setName(e.target.value)} /></TextField>
          <TextField name="email"><TextField.Label>Your email (optional)</TextField.Label><TextField.Input type="email" value={email} maxLength={120} autoComplete="email" onChange={(e) => setEmail(e.target.value)} /></TextField>
          <TextArea aria-label="Message" placeholder="What would you like to build or draw?" rows={5} maxLength={2000} fullWidth value={msg} onChange={(e) => setMsg(e.target.value)} />
          {err && <p role="alert" {...stylex.props(ui.muted)} style={{ color: "#ff453a" }}>{err}</p>}
          <Button variant="prominent" disabled={!msg.trim()} onClick={send}><I.send size={16} /> Send message</Button>
        </Panel>
        <Panel delay={110}>
          <IconTile><I.mail size={22} /></IconTile>
          <h3 {...stylex.props(ui.title)}>Direct</h3>
          <p {...stylex.props(ui.muted)} style={{ wordBreak: "break-all", fontWeight: 500 }}>{PROFILE.contact.email}</p>
          <div {...stylex.props(ui.row)}>
            <Button variant="bordered" onClick={copy}>{copied ? <><I.check size={15} /> Copied</> : <><I.copy size={15} /> Copy email</>}</Button>
            <Button variant="borderless" onClick={() => { window.location.href = `mailto:${PROFILE.contact.email}`; }}>Open mail app</Button>
          </div>
          <p {...stylex.props(ui.muted)}>{PROFILE.contact.note}</p>
          <div style={{ marginTop: "auto" }}><Button variant="borderless" onClick={() => go("links")}>All profiles <I.arrow size={15} /></Button></div>
        </Panel>
      </div>
    </div>
  );
}
