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
const s = stylex.create({
  controls: { display: "flex", flexWrap: "wrap", alignItems: "center", gap: 10, marginTop: 18 },
  search: { minHeight: 44, flex: "1 1 240px", maxWidth: 420, paddingInline: 12, borderRadius: 9, border: "1px solid currentColor", backgroundColor: "transparent", color: "inherit" },
  select: { minHeight: 44, paddingInline: 12, borderRadius: 9, border: "1px solid currentColor", backgroundColor: "transparent", color: "inherit" },
});

export default function Projects() {
  const [tab, setTab] = useState("all");
  const [active, setActive] = useState<ProjectItem | null>(null);
  const [query, setQuery] = useState("");
  const [tag, setTag] = useState("all");
  const [copyStatus, setCopyStatus] = useState("");
  const tags = Array.from(new Set(PROJECTS.flatMap((project) => project.technologies))).sort((a, b) => a.localeCompare(b));
  const terms = query.trim().toLocaleLowerCase().split(/\s+/).filter(Boolean);
  const list = PROJECTS.filter((project) => {
    const searchable = [project.id, project.title, project.subtitle ?? "", project.description, project.note ?? "", project.status, ...project.technologies].join(" ").toLocaleLowerCase();
    return (tab === "all" || project.status === tab) && terms.every((term) => searchable.includes(term)) && (tag === "all" || project.technologies.includes(tag));
  });
  const moveActive = (direction: number) => {
    if (!active || list.length < 2) return;
    const index = list.findIndex((project) => project.id === active.id);
    setActive(list[(index + direction + list.length) % list.length]);
  };
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
      <div {...stylex.props(s.controls)}>
        <label className="sr-only" htmlFor="project-search">Search projects</label>
        <input id="project-search" type="search" placeholder="Search projects" value={query} onChange={(event) => setQuery(event.target.value)} {...stylex.props(s.search)} />
        <label className="sr-only" htmlFor="project-tag">Filter by technology</label>
        <select id="project-tag" value={tag} onChange={(event) => setTag(event.target.value)} {...stylex.props(s.select)}>
          <option value="all">All technologies</option>
          {tags.map((technology) => <option key={technology} value={technology}>{technology}</option>)}
        </select>
      </div>
      <div {...stylex.props(ui.grid)} key={`${tab}-${tag}-${query}`}>
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
      {list.length === 0 && <p role="status" {...stylex.props(ui.muted)} style={{ marginTop: 20 }}>No projects match these filters. Try a different search or technology.</p>}
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
            {list.length > 1 && <Button variant="borderless" onClick={() => moveActive(-1)} aria-label="Previous project">Previous</Button>}
            {active?.liveUrl && <Button variant="prominent" onClick={() => open(active.liveUrl!)}>Open live site</Button>}
            {active?.repoUrl && <Button variant="bordered" onClick={() => open(active.repoUrl!)}>View repository</Button>}
            {list.length > 1 && <Button variant="borderless" onClick={() => moveActive(1)} aria-label="Next project">Next</Button>}
          </Modal.Footer>
        </Modal.Content>
      </Modal>
    </div>
  );
}
