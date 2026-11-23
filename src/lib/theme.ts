import { useCallback, useEffect, useState } from 'react';
import { effects } from '../motion/effects';

export type Theme = 'dark' | 'light';

/** Same key as public/boot.js, which applies the theme before first paint. */
const KEY = 'tsr-theme';
const THEME_COLOR = { dark: '#0B0B0B', light: '#F5F3EE' } as const;
const EVENT = 'tsr-theme-change';

function current(): Theme {
  return document.documentElement.dataset.theme === 'light' ? 'light' : 'dark';
}

function swap(theme: Theme) {
  document.documentElement.dataset.theme = theme;
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', THEME_COLOR[theme]);
  try {
    // Dark is the default, so only a light choice needs remembering.
    if (theme === 'light') window.localStorage.setItem(KEY, 'light');
    else window.localStorage.removeItem(KEY);
  } catch {
    /* storage blocked: the theme still applies for this visit */
  }
  window.dispatchEvent(new Event(EVENT));
}

/**
 * Switches theme with the blade: the browser snapshots the page, the new theme is
 * applied underneath, and CSS (::view-transition-new(root) in index.css) brings it down
 * behind a dagger-point edge, like the page transition. No motion library involved.
 * Instant when motion is reduced, when the effect is off, or in browsers without
 * View Transitions.
 */
function apply(theme: Theme) {
  const reduced = document.documentElement.dataset.motion !== 'full';
  if (!effects.themeSwitch || reduced || typeof document.startViewTransition !== 'function') {
    swap(theme);
    return;
  }
  document.startViewTransition(() => swap(theme));
}

/**
 * The site theme. Server HTML and the first client render both say "dark" (the default),
 * so the switch text matches the server HTML; the real value is read after hydration.
 * Every switch on the page stays in step through a window event.
 */
export function useTheme() {
  const [theme, setTheme] = useState<Theme>('dark');
  /** False until the real theme has been read, so a switch can skip animating into place on load. */
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const sync = () => setTheme(current());
    sync();
    requestAnimationFrame(() => setReady(true));
    window.addEventListener(EVENT, sync);
    return () => window.removeEventListener(EVENT, sync);
  }, []);

  const toggle = useCallback(() => apply(current() === 'dark' ? 'light' : 'dark'), []);

  return { theme, toggle, ready };
}
