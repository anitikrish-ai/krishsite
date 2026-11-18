import { useEffect, useState } from "react";
import { flushSync } from "react-dom";

const read = () => (location.hash.replace(/^#\/?/, "").split("?")[0] || "home").toLowerCase().slice(0, 40);
export const go = (r: string) => { location.hash = r === "home" ? "#/" : `#/${r}`; };

// remember where the user last pressed so the page "grows" out of that point
let px = innerWidth / 2, py = 80;
if (typeof window !== "undefined") addEventListener("pointerdown", (e) => { px = e.clientX; py = e.clientY; }, { passive: true, capture: true });

type VT = { ready: Promise<void> };
export function useRoute() {
  const [route, setRoute] = useState(read);
  useEffect(() => {
    const onChange = () => {
      const apply = () => { flushSync(() => setRoute(read())); window.scrollTo({ top: 0 }); };
      const vt = (document as unknown as { startViewTransition?: (cb: () => void) => VT }).startViewTransition;
      if (!vt || matchMedia("(prefers-reduced-motion: reduce)").matches) { apply(); return; }
      const t = vt.call(document, apply);
      const r = Math.hypot(Math.max(px, innerWidth - px), Math.max(py, innerHeight - py));
      t.ready.then(() => {
        document.documentElement.animate(
          { clipPath: [`circle(0px at ${px}px ${py}px)`, `circle(${r}px at ${px}px ${py}px)`] },
          { duration: 800, easing: "cubic-bezier(0.32, 0.72, 0, 1)", pseudoElement: "::view-transition-new(root)" },
        );
      }).catch(() => undefined);
    };
    addEventListener("hashchange", onChange);
    return () => removeEventListener("hashchange", onChange);
  }, []);
  return route;
}
