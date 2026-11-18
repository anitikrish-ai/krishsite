import { useEffect, useMemo, useRef, useState } from "react";
import * as stylex from "@stylexjs/stylex";
import { tokens } from "@lenso/tokens/tokens.stylex.const";
import { Button, Card, GlassButton, Modal, Tabs } from "@lenso/ui";
import { INITIAL_ARTWORK, PRIMARY_COLLECTIONS, type ArtworkItem } from "../data/artwork";
import { PageHead } from "../layout";
import { Reveal } from "../fx";
import { ui } from "../ui";

const s = stylex.create({
  tiles: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(210px, 1fr))", gap: 12, marginTop: 24 },
  tile: { padding: 0, border: "none", cursor: "pointer", aspectRatio: "1 / 1", borderRadius: 22, overflow: "hidden", position: "relative",
    backgroundColor: tokens.fillTertiary, transition: "transform 300ms cubic-bezier(.2,.7,.2,1)", ":hover": { transform: "scale(1.03)" } },
  img: { width: "100%", height: "100%", objectFit: "cover", display: "block" },
  full: { maxWidth: "100%", maxHeight: "62vh", borderRadius: 14, display: "block", marginInline: "auto" },
  nav: { display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 14 },
});
const FAV = "krish_art_favs_v2";

export default function Art() {
  const [items, setItems] = useState<ArtworkItem[]>(INITIAL_ARTWORK);
  const [tab, setTab] = useState("all");
  const [idx, setIdx] = useState<number | null>(null);
  const [favs, setFavs] = useState<string[]>(() => { try { return JSON.parse(localStorage.getItem(FAV) || "[]"); } catch { return []; } });
  const file = useRef<HTMLInputElement>(null);

  const shown = useMemo(() => items.filter((i) => tab === "all" || (tab === "fav" ? favs.includes(i.id) : i.medium === tab))
    .sort((a, b) => b.date.localeCompare(a.date)), [items, tab, favs]);
  const cur = idx === null ? null : shown[idx];
  const step = (d: number) => setIdx((i) => (i === null || !shown.length ? i : (i + d + shown.length) % shown.length));
  const toggleFav = (id: string) => setFavs((f) => { const n = f.includes(id) ? f.filter((x) => x !== id) : [...f, id]; try { localStorage.setItem(FAV, JSON.stringify(n)); } catch { /* ignore */ } return n; });

  useEffect(() => {
    if (idx === null) return;
    const k = (e: KeyboardEvent) => { if (e.key === "ArrowRight") step(1); if (e.key === "ArrowLeft") step(-1); };
    addEventListener("keydown", k); return () => removeEventListener("keydown", k);
  });

  const onFiles = (l: FileList | null) => {
    if (!l) return; const medium = tab === "digital" ? "digital" : "traditional";
    setItems((c) => [...Array.from(l).map((f, n): ArtworkItem => ({ id: `local-${Date.now()}-${n}`, title: f.name.replace(/\.[^.]+$/, ""),
      src: URL.createObjectURL(f), medium, date: new Date().toISOString().slice(0, 10), collections: [`${medium}-art`] })), ...c]);
  };

  return (
    <div {...stylex.props(ui.wrap)}>
      <PageHead eyebrow="Art" title={<>Pencil, pen &amp; <span {...stylex.props(ui.grad)}>pixels</span></>} sub={PRIMARY_COLLECTIONS.map((c) => c.description).join(" ")} />
      <Reveal style={{ height: "auto", marginTop: 20 }}>
        <div {...stylex.props(ui.row)} style={{ justifyContent: "space-between" }}>
          <Tabs value={tab} onValueChange={(v) => setTab(String(v))}>
            <Tabs.ListContainer><Tabs.List aria-label="Library">
              <Tabs.Tab value="all">All</Tabs.Tab><Tabs.Tab value="traditional">Traditional</Tabs.Tab><Tabs.Tab value="digital">Digital</Tabs.Tab><Tabs.Tab value="fav">Favorites</Tabs.Tab><Tabs.Indicator />
            </Tabs.List></Tabs.ListContainer>
          </Tabs>
          <Button variant="prominent" onClick={() => file.current?.click()}>+ Add artwork</Button>
          <input ref={file} type="file" accept="image/*" multiple hidden onChange={(e) => { onFiles(e.target.files); e.target.value = ""; }} />
        </div>
      </Reveal>
      {shown.length === 0 ? (
        <div style={{ marginTop: 24 }}><Reveal><Card><div {...stylex.props(ui.pad)}>
          <Card.Title>{tab === "fav" ? "No favorites yet" : "No artwork yet"}</Card.Title>
          <p {...stylex.props(ui.muted)}>Put images in <code>public/artwork/</code> and register them in <code>src/data/artwork.ts</code>, or use “Add artwork” to preview an image in this session.</p>
        </div></Card></Reveal></div>
      ) : (
        <div {...stylex.props(s.tiles)} key={tab}>
          {shown.map((a, i) => (
            <Reveal key={a.id} delay={(i % 8) * 60}><button type="button" {...stylex.props(s.tile)} style={{ width: "100%" }} onClick={() => setIdx(i)} aria-label={`Open ${a.title}`}>
              <img src={a.src} alt={a.title} loading="lazy" {...stylex.props(s.img)} />
            </button></Reveal>
          ))}
        </div>
      )}
      <Modal open={cur !== null} onOpenChange={(o) => !o && setIdx(null)}>
        <Modal.Backdrop />
        <Modal.Content>
          <Modal.Close aria-label="Close" />
          <Modal.Header><Modal.Title>{cur?.title}</Modal.Title><Modal.Description>{cur ? `${cur.medium} · ${cur.date}` : ""}</Modal.Description></Modal.Header>
          <Modal.Body>
            {cur && <img src={cur.src} alt={cur.title} {...stylex.props(s.full)} />}
            {cur?.description && <p {...stylex.props(ui.muted)} style={{ marginTop: 10 }}>{cur.description}</p>}
            <div {...stylex.props(s.nav)}>
              <GlassButton aria-label="Previous" onClick={() => step(-1)}>←</GlassButton>
              <Button variant="bordered" onClick={() => cur && toggleFav(cur.id)}>{cur && favs.includes(cur.id) ? "♥ Favorited" : "♡ Favorite"}</Button>
              <GlassButton aria-label="Next" onClick={() => step(1)}>→</GlassButton>
            </div>
          </Modal.Body>
        </Modal.Content>
      </Modal>
    </div>
  );
}
