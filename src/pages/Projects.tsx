import { useState } from "react";
import * as stylex from "@stylexjs/stylex";
import { Badge, Button, Card, Chip, Modal, Tabs } from "@lenso/ui";
import { PROJECTS, type ProjectItem } from "../data/projects";
import { PageHead } from "../layout";
import { Reveal, Tilt } from "../fx";
import { ui } from "../ui";

const open = (u: string) => window.open(u, "_blank", "noopener,noreferrer");

export default function Projects() {
  const [tab, setTab] = useState("all");
  const [active, setActive] = useState<ProjectItem | null>(null);
  const list = PROJECTS.filter((p) => tab === "all" || p.status === tab);
  return (
    <div {...stylex.props(ui.wrap)}>
      <PageHead eyebrow="Projects" title={<>Things I <span {...stylex.props(ui.grad)}>ship</span></>} sub="Working tools and experiments still in development." />
      <Reveal style={{ height: "auto", marginTop: 16 }}>
        <Tabs value={tab} onValueChange={(v) => setTab(String(v))}>
          <Tabs.ListContainer><Tabs.List aria-label="Status">
            <Tabs.Tab value="all">All</Tabs.Tab><Tabs.Tab value="working">Working</Tabs.Tab><Tabs.Tab value="in-development">In development</Tabs.Tab><Tabs.Indicator />
          </Tabs.List></Tabs.ListContainer>
        </Tabs>
      </Reveal>
      <div {...stylex.props(ui.grid)} key={tab}>
        {list.map((p, i) => (
          <Reveal key={p.id} delay={i * 100}><Tilt><Card><div {...stylex.props(ui.pad)}>
            <div {...stylex.props(ui.row)}>
              <Badge color={p.status === "working" ? "success" : "warning"} size="sm">{p.status === "working" ? "Working" : "In development"}</Badge>
              {p.collaborative && <Badge size="sm">Team project</Badge>}
            </div>
            <Card.Title>{p.title}</Card.Title><Card.Description>{p.subtitle}</Card.Description>
            <p {...stylex.props(ui.muted)}>{p.description.length > 150 ? p.description.slice(0, 150) + "…" : p.description}</p>
            <div {...stylex.props(ui.row)}>{p.technologies.map((t) => <Chip key={t}>{t}</Chip>)}</div>
            <div {...stylex.props(ui.row)} style={{ marginTop: "auto" }}>
              <Button variant="prominent" onClick={() => setActive(p)}>Details</Button>
              {p.liveUrl && <Button variant="bordered" onClick={() => open(p.liveUrl!)}>Live ↗</Button>}
              {p.repoUrl && <Button variant="bordered" onClick={() => open(p.repoUrl!)}>Repo ↗</Button>}
            </div>
          </div></Card></Tilt></Reveal>
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
            <div {...stylex.props(ui.row)} style={{ marginTop: 12 }}>{active?.technologies.map((t) => <Chip key={t}>{t}</Chip>)}</div>
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
