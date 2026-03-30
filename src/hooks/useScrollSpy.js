import { useEffect, useMemo, useState } from "react";

export function useScrollSpy(hrefs) {
  const ids = useMemo(
    () =>
      (hrefs || [])
        .map((h) => (typeof h === "string" ? h : h?.href))
        .filter(Boolean)
        .map((h) => h.replace(/^#/, "")),
    [hrefs]
  );

  const [activeId, setActiveId] = useState(ids[0] || "");

  useEffect(() => {
    const nodes = ids
      .map((id) => document.getElementById(id))
      .filter(Boolean);

    if (!nodes.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => (b.intersectionRatio || 0) - (a.intersectionRatio || 0));
        if (visible[0]?.target?.id) setActiveId(visible[0].target.id);
      },
      { root: null, rootMargin: "-20% 0px -65% 0px", threshold: [0.12, 0.25, 0.5] }
    );

    for (const node of nodes) observer.observe(node);
    return () => observer.disconnect();
  }, [ids]);

  return activeId ? `#${activeId}` : "";
}

