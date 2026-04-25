import { useEffect, useState } from "react";

/**
 * Tracks which heading is currently visible in the viewport.
 * Re-scans whenever `pathname` changes so it picks up a new page's headings.
 */
export function useScrollSpy(pathname: string) {
  const [headings, setHeadings] = useState<{ id: string; text: string }[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);

  // Scan headings after route render
  useEffect(() => {
    // Defer to next frame so the new page's DOM is mounted
    const raf = requestAnimationFrame(() => {
      const nodes = Array.from(
        document.querySelectorAll<HTMLHeadingElement>("main h2[id]"),
      );
      const next = nodes.map((n) => ({
        id: n.id,
        text: n.textContent?.trim() ?? n.id,
      }));
      setHeadings(next);
      setActiveId(next[0]?.id ?? null);
    });
    return () => cancelAnimationFrame(raf);
  }, [pathname]);

  // Observe headings for active state
  useEffect(() => {
    if (headings.length === 0) return;
    const observer = new IntersectionObserver(
      (entries) => {
        // Pick the topmost intersecting entry
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) {
          setActiveId((visible[0].target as HTMLElement).id);
        }
      },
      {
        // Trigger when heading enters the top portion of the viewport
        rootMargin: "-80px 0px -70% 0px",
        threshold: [0, 1],
      },
    );
    for (const h of headings) {
      const el = document.getElementById(h.id);
      if (el) observer.observe(el);
    }
    return () => observer.disconnect();
  }, [headings]);

  return { headings, activeId };
}