import { useEffect, useState } from "react";
import { flushSync } from "react-dom";

const read = () => location.hash.replace(/^#\/?/, "").split("?")[0] || "home";
export const go = (r: string) => { location.hash = r === "home" ? "#/" : `#/${r}`; };

export function useRoute() {
  const [route, setRoute] = useState(read);
  useEffect(() => {
    const onChange = () => {
      const apply = () => { flushSync(() => setRoute(read())); window.scrollTo({ top: 0 }); };
      const vt = (document as unknown as { startViewTransition?: (cb: () => void) => unknown }).startViewTransition;
      if (vt && !matchMedia("(prefers-reduced-motion: reduce)").matches) vt.call(document, apply); else apply();
    };
    addEventListener("hashchange", onChange);
    return () => removeEventListener("hashchange", onChange);
  }, []);
  return route;
}
