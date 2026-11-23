import { useEffect, useState } from "react";

const read = () => (location.hash.replace(/^#\/?/, "").split("?")[0] || "home").toLowerCase().slice(0, 40);
export const go = (r: string) => { location.hash = r === "home" ? "#/" : `#/${r}`; };

export function useRoute() {
  const [route, setRoute] = useState(read);
  useEffect(() => {
    const onChange = () => {
      setRoute(read());
      window.scrollTo({ top: 0, behavior: "auto" });
    };
    addEventListener("hashchange", onChange);
    return () => removeEventListener("hashchange", onChange);
  }, []);
  return route;
}
