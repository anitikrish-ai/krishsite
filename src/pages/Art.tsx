import { useEffect, useMemo, useRef, useState } from "react";
import * as stylex from "@stylexjs/stylex";
import { tokens } from "@lenso/tokens/tokens.stylex.const";
import { Button, GlassButton, Modal, Tabs } from "@lenso/ui";
import { INITIAL_ARTWORK, PRIMARY_COLLECTIONS, type ArtworkItem } from "../data/artwork";
import { PageHead } from "../layout";
import { Reveal } from "../fx";
import { I } from "../icons";
import { Panel } from "../panel";
import { ui } from "../ui";

const s = stylex.create({
  masonry: { columnWidth: 220, columnGap: 14, marginTop: 24 },
  tile: { display: "block", width: "100%", position: "relative", marginBottom: 14, padding: 0, border: "none", cursor: "pointer",
    breakInside: "avoid", backgroundColor: "transparent", textAlign: "left" },
  img: { width: "100%", display: "block", height: "auto" },
  cap: { position: "absolute", left: 8, right: 8, bottom: 8, padding: "10px 12px", textAlign: "left", color: "#fff", fontSize: 14, fontWeight: 600, letterSpacing: "-0.01em",
    borderRadius: 9, backgroundColor: "rgba(18, 20, 24, .86)", opacity: 0, transition: "opacity 180ms ease-out" },
  heart: { position: "absolute", top: 10, right: 10, width: 44, height: 44, borderRadius: 10, border: "none", display: "grid", placeItems: "center", cursor: "pointer", color: "#fff",
    backgroundColor: "rgba(18, 20, 24, .86)", opacity: 0, transition: "opacity 180ms ease-out" },
  full: { maxWidth: "100%", maxHeight: "62dvh", borderRadius: 0, display: "block", marginInline: "auto" },
  nav: { display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 14, gap: 8 },
  bar: { display: "flex", flexWrap: "wrap", gap: 12, justifyContent: "space-between", alignItems: "center" },
});
const FAV = "krish_art_favs_v2";
const OK = ["image/png", "image/jpeg", "image/webp", "image/gif", "image/avif"];
const MAX_BYTES = 15 * 1024 * 1024;

export default function Art() {
  const [items, setItems] = useState<ArtworkItem[]>(INITIAL_ARTWORK);
  const [tab, setTab] = useState("all");
  const [idx, setIdx] = useState<number | null>(null);
  const [err, setErr] = useState("");
  const [favs, setFavs] = useState<string[]>(() => { try { const v = JSON.parse(localStorage.getItem(FAV) || "[]"); return Array.isArray(v) ? v.filter((x) => typeof x === "string") : []; } catch { return []; } });
  const file = useRef<HTMLInputElement>(null);

  const shown = useMemo(() => items.filter((i) => tab === "all" || (tab === "fav" ? favs.includes(i.id) : i.medium === tab)).sort((a, b) => b.date.localeCompare(a.date)), [items, tab, favs]);
  const cur = idx === null ? null : shown[idx];
  const step = (d: number) => setIdx((i) => (i === null || !shown.length ? i : (i + d + shown.length) % shown.length));
  const toggleFav = (id: string) => setFavs((f) => { const n = f.includes(id) ? f.filter((x) => x !== id) : [...f, id]; try { localStorage.setItem(FAV, JSON.stringify(n)); } catch { /* ignore */ } return n; });
  const count = (m: string) => items.filter((i) => i.medium === m).length;

  useEffect(() => {
    if (idx === null) return;
    const k = (e: KeyboardEvent) => { if (e.key === "ArrowRight") step(1); if (e.key === "ArrowLeft") step(-1); };
    addEventListener("keydown", k); return () => removeEventListener("keydown", k);
  });

  const onFiles = (l: FileList | null) => {
    if (!l) return; setErr("");
    const medium = tab === "digital" ? "digital" : "traditional";
    const good = Array.from(l).slice(0, 24).filter((f) => OK.includes(f.type) && f.size <= MAX_BYTES);
    if (good.length < l.length) setErr("Some files were skipped. Use PNG, JPG, WebP, GIF or AVIF under 15 MB.");
    setItems((c) => [...good.map((f, n): ArtworkItem => ({ id: `local-${Date.now()}-${n}`, title: f.name.replace(/\.[^.]+$/, "").slice(0, 80), src: URL.createObjectURL(f), medium, date: new Date().toISOString().slice(0, 10), collections: [`${medium}-art`] })), ...c]);
  };

  return (
    <div {...stylex.props(ui.wrap)}>
      <PageHead eyebrow="Art" title={<>Pencil, pen &amp; <span {...stylex.props(ui.grad)}>pixels</span></>} sub="Original artwork, shown unfiltered. Sketched on paper and painted on screen." />
      <div {...stylex.props(ui.grid)}>
        {PRIMARY_COLLECTIONS.map((c) => (
          <Panel key={c.id}>
            <span {...stylex.props(ui.eyebrow)}>{c.mediumFilter === "digital" ? "Digital" : "Traditional"}</span>
            <h3 {...stylex.props(ui.title)}>{c.name}</h3><p {...stylex.props(ui.muted)}>{c.description}</p>
            <div {...stylex.props(ui.row)} style={{ marginTop: "auto", justifyContent: "space-between" }}>
              <span {...stylex.props(ui.muted)}>{count(c.mediumFilter ?? "")} pieces</span>
              <Button variant="bordered" onClick={() => setTab(c.mediumFilter ?? "all")}>View <I.arrow size={15} /></Button>
            </div>
          </Panel>
        ))}
      </div>

      <Reveal style={{ marginTop: 36 }}>
        <div {...stylex.props(s.bar)}>
          <div {...stylex.props(ui.scrollX)}>
            <Tabs value={tab} onValueChange={(v) => setTab(String(v))}>
              <Tabs.ListContainer><Tabs.List aria-label="Library">
                <Tabs.Tab value="all">All</Tabs.Tab><Tabs.Tab value="traditional">Traditional</Tabs.Tab><Tabs.Tab value="digital">Digital</Tabs.Tab><Tabs.Tab value="fav">Favorites</Tabs.Tab><Tabs.Indicator />
              </Tabs.List></Tabs.ListContainer>
            </Tabs>
          </div>
          <Button variant="prominent" onClick={() => file.current?.click()}><I.plus size={16} /> Add artwork</Button>
          <input ref={file} type="file" accept={OK.join(",")} multiple hidden onChange={(e) => { onFiles(e.target.files); e.target.value = ""; }} />
        </div>
        {err && <p role="alert" {...stylex.props(ui.muted)} style={{ marginTop: 10, color: "#ff453a" }}>{err}</p>}
      </Reveal>

      {shown.length === 0 ? (
        <div style={{ marginTop: 24 }}>
          <Panel center pad={36}>
            <h3 {...stylex.props(ui.title)}>{tab === "fav" ? "No favorites yet" : "No artwork added yet"}</h3>
            <p {...stylex.props(ui.muted)} style={{ maxWidth: 480 }}>Add original images to <code>public/artwork/</code> and register them in <code>src/data/artwork.ts</code>, or use “Add artwork” to preview an image in this session.</p>
          </Panel>
        </div>
      ) : (
        <div {...stylex.props(s.masonry)} key={tab}>
          {shown.map((a, i) => (
            <Reveal key={a.id} delay={(i % 6) * 60} style={{ breakInside: "avoid" }}>
              <div className="art-item" style={{ position: "relative" }}>
                <button type="button" {...stylex.props(s.tile)} onClick={() => setIdx(i)} aria-label={`Open ${a.title}`}>
                  <img src={a.src} alt={a.title} loading="lazy" decoding="async" {...stylex.props(s.img)} /><span {...stylex.props(s.cap)}>{a.title}</span>
                </button>
                <button type="button" {...stylex.props(s.heart)} aria-label={favs.includes(a.id) ? "Remove favorite" : "Add favorite"} onClick={() => toggleFav(a.id)} style={{ color: favs.includes(a.id) ? "#ff375f" : "#fff" }}><I.heart size={17} /></button>
              </div>
            </Reveal>
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
              <GlassButton aria-label="Previous" onClick={() => step(-1)}><I.left size={18} /></GlassButton>
              <Button variant="bordered" onClick={() => cur && toggleFav(cur.id)}><I.heart size={16} /> {cur && favs.includes(cur.id) ? "Favorited" : "Favorite"}</Button>
              <GlassButton aria-label="Next" onClick={() => step(1)}><I.right size={18} /></GlassButton>
            </div>
          </Modal.Body>
        </Modal.Content>
      </Modal>
    </div>
  );
}
