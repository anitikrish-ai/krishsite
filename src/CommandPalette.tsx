import { useEffect, useMemo, useRef, useState } from "react";
import * as stylex from "@stylexjs/stylex";
import { tokens } from "@lenso/tokens/tokens.stylex.const";
import { Modal, TextField } from "@lenso/ui";
import { ALL } from "./layout";
import { go } from "./router";

const styles = stylex.create({
  search: { width: "100%", marginBlock: 12 },
  list: { display: "grid", gap: 4, maxHeight: "min(52dvh, 420px)", overflowY: "auto", padding: 4, margin: 0, listStyle: "none" },
  item: { display: "flex", alignItems: "center", gap: 12, width: "100%", minHeight: 48, padding: "10px 12px", border: 0, borderRadius: 10, color: tokens.labelPrimary, backgroundColor: "transparent", textAlign: "left", font: "inherit", cursor: "pointer", ":hover": { backgroundColor: tokens.fillSecondary }, ":focus-visible": { outline: "3px solid #2563eb", outlineOffset: 2 } },
  empty: { color: tokens.labelSecondary, padding: "12px 8px", margin: 0, fontSize: 14 },
});

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const matches = useMemo(() => ALL.filter(([, label]) => label.toLowerCase().includes(query.trim().toLowerCase())), [query]);

  useEffect(() => {
    const handleShortcut = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setOpen((value) => !value);
        setQuery("");
      }
    };
    window.addEventListener("keydown", handleShortcut);
    return () => window.removeEventListener("keydown", handleShortcut);
  }, []);

  useEffect(() => {
    if (open) requestAnimationFrame(() => inputRef.current?.focus());
  }, [open]);

  return (
    <Modal open={open} onOpenChange={(value) => { setOpen(value); if (!value) setQuery(""); }}>
      <Modal.Backdrop />
      <Modal.Content>
        <Modal.Close aria-label="Close command palette" />
        <Modal.Header>
          <Modal.Title>Go to a page</Modal.Title>
          <Modal.Description>Search portfolio pages. Press Control or Command + K to open this menu.</Modal.Description>
        </Modal.Header>
        <Modal.Body>
          <TextField name="page-search" xstyle={styles.search}>
            <TextField.Label>Search pages</TextField.Label>
            <TextField.Input ref={inputRef} value={query} onChange={(event) => setQuery(event.target.value)} autoComplete="off" />
          </TextField>
          <ul {...stylex.props(styles.list)} aria-label="Portfolio pages">
            {matches.length ? matches.map(([id, label, Icon]) => (
              <li key={id}><button type="button" {...stylex.props(styles.item)} onClick={() => { go(id); setOpen(false); }}>
                <Icon size={18} />{label}
              </button></li>
            )) : <li><p {...stylex.props(styles.empty)}>No matching pages.</p></li>}
          </ul>
        </Modal.Body>
      </Modal.Content>
    </Modal>
  );
}
