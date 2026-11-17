import { useEffect, useSyncExternalStore } from 'react';

/**
 * Which home-page section is current. The home page publishes it (it owns the sections); the
 * header reads it to highlight the nav link. A tiny store, so the header does not have to find
 * sections that load after it mounts.
 */
let active: string | null = null;
const listeners = new Set<() => void>();

function set(next: string | null) {
  if (next === active) return;
  active = next;
  listeners.forEach((l) => l());
}

export function useActiveSection(): string | null {
  return useSyncExternalStore(
    (cb) => {
      listeners.add(cb);
      return () => listeners.delete(cb);
    },
    () => active,
    () => null,
  );
}

/**
 * The current section is the last one whose top has passed a line near the top of the viewport
 * (below the sticky header). That stays true across the gaps between sections and over the
 * footer, and it is correct after a jump or a reload mid-page, which an observer that only
 * reports entering and leaving is not. Above the first section (the hero) nothing is current.
 */
export function useSectionSpy(ids: readonly string[]) {
  useEffect(() => {
    const elements = ids.map((id) => document.getElementById(id)).filter((el): el is HTMLElement => el !== null);
    if (!elements.length) return;
    let frame = 0;
    const update = () => {
      frame = 0;
      const line = Math.max(window.innerHeight * 0.3, 120);
      let current: string | null = null;
      for (const el of elements) if (el.getBoundingClientRect().top <= line) current = el.id;
      set(current);
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    return () => {
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
      if (frame) cancelAnimationFrame(frame);
      set(null);
    };
    // The ids are a constant list; the effect runs once per mount of the page that owns them.
  }, []);
}
