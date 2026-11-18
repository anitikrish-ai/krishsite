import { useState } from "react";
import * as stylex from "@stylexjs/stylex";
import { Button, Chip, Modal, Tabs } from "@lenso/ui";
import { PROJECTS, type ProjectItem } from "../data/projects";
import { PageHead } from "../layout";
import { Reveal } from "../fx";
import { I } from "../icons";
import { Panel, Status } from "../panel";
import { ui } from "../ui";

const open = (u: string) => window.open(u, "_blank", "noopener,noreferrer");

export default function Projects() {
  const [tab, setTab] = useState("all");
  const [active, setActive] = useState<ProjectItem | null>(null);
  const list = PROJECTS.filter((p) => tab === "all" || p.status === tab);
  return (
    <div {...stylex.props(ui.wrap)}>
      <PageHead eyebrow="Projects" title={<>Things I <span {...stylex.props(ui.grad)}>ship</span></>} sub="Working tools and experiments still being built." />
      <Reveal style={{ marginTop: 18 }}>
        <div {...stylex.props(ui.scrollX)}>
          <Tabs value={tab} onValueChange={(v) => setTab(String(v))}>
            <Tabs.ListContainer><Tabs.List aria-label="Status">
              <Tabs.Tab value="all">All</Tabs.Tab><Tabs.Tab value="working">Live</Tabs.Tab><Tabs.Tab value="in-development">Building</Tabs.Tab><Tabs.Indicator />
            </Tabs.List></Tabs.ListContainer>
          </Tabs>
        </div>
      </Reveal>
      <div {...stylex.props(ui.grid)} key={tab}>
        {list.map((p, i) => (
          <Panel key={p.id} delay={i * 90}>
            <div {...stylex.props(ui.row)}><Status working={p.status === "working"}>{p.status === "working" ? "Working" : "In development"}</Status>{p.collaborative && <Chip size="sm" variant="soft">Team project</Chip>}</div>
            <h3 {...stylex.props(ui.title)}>{p.title}</h3><p {...stylex.props(ui.muted)} style={{ fontWeight: 500 }}>{p.subtitle}</p>
            <p {...stylex.props(ui.muted)}>{p.description.length > 150 ? p.description.slice(0, 150) + "…" : p.description}</p>
            <div {...stylex.props(ui.row)}>{p.technologies.map((t) => <Chip key={t} size="sm">{t}</Chip>)}</div>
            <div {...stylex.props(ui.row)} style={{ marginTop: "auto", paddingTop: 4 }}>
              <Button variant="prominent" onClick={() => setActive(p)}>Details</Button>
              {p.liveUrl && <Button variant="bordered" onClick={() => open(p.liveUrl!)}>Live <I.ext size={14} /></Button>}
              {p.repoUrl && <Button variant="bordered" onClick={() => open(p.repoUrl!)}>Repo <I.ext size={14} /></Button>}
            </div>
          </Panel>
        ))}
      </div>
      <Modal open={!!active} onOpenChange={(o) => !o && setActive(null)}>
        <Modal.Backdrop />
        <Modal.Content>
          <Modal.Close aria-label="Close" />
          <Modal.Header><Modal.Title>{active?.title}</Modal.Title><Modal.Description>{active?.subtitle}</Modal.Description></Modal.Header>
          <Modal.Body>
            <p {...stylex.props(ui.muted)}>{active?.description}</p>
            {active?.note && <p {...stylex.props(ui.muted)} style={{ marginTop: 12 }}><strong>Note:</strong> {active.note}</p>}
            <div {...stylex.props(ui.row)} style={{ marginTop: 14 }}>{active?.technologies.map((t) => <Chip key={t} size="sm">{t}</Chip>)}</div>
          </Modal.Body>
          <Modal.Footer>
            {active?.liveUrl && <Button variant="prominent" onClick={() => open(active.liveUrl!)}>Open live site</Button>}
            {active?.repoUrl && <Button variant="bordered" onClick={() => open(active.repoUrl!)}>View repository</Button>}
          </Modal.Footer>
        </Modal.Content>
      </Modal>
    </div>
  );
}
