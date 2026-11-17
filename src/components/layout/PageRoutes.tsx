import { startTransition, Suspense, useEffect, useRef, useState } from 'react';
import { Route, Routes, useLocation, type Location } from 'react-router-dom';
import { Dagger } from '../brand/Dagger';
import { useMotion } from '../../lib/motion';
import { loadEngine } from '../../lib/useEngine';
import { setupReveals } from '../../lib/reveals';
import { effects } from '../../motion/effects';
import { Contact, Home, NotFound, Privacy, Sent, preloadRoute } from '../../routes';

const samePage = (a: Location, b: Location) => a.pathname === b.pathname && a.search === b.search;

/** The element a URL hash points at. A malformed hash (such as "#%E0%A4%A") must not crash the page. */
function hashTarget(hash: string) {
  if (!hash) return null;
  try {
    return document.getElementById(decodeURIComponent(hash.slice(1)));
  } catch {
    return null;
  }
}

/**
 * Routes with the blade transition. The current page stays on screen while the
 * panel comes down and the next page's code loads; the swap happens behind it.
 * With motion reduced, pages swap straight away.
 */
export function PageRoutes() {
  const location = useLocation();
  const { reduced } = useMotion();
  const [shown, setShown] = useState(location);
  const panel = useRef<HTMLDivElement>(null);
  const covered = useRef(false);
  /** True while the page on screen arrived behind the blade (so in-view content may animate). */
  const arrived = useRef(false);
  const firstRender = useRef(true);
  const lastPath = useRef(shown.pathname);
  const reducedRef = useRef(reduced);
  reducedRef.current = reduced;

  useEffect(() => {
    if (samePage(location, shown)) {
      // A link to a section of the page you are already on, or the same link again: scroll, do not transition.
      if (location.hash !== shown.hash || location.key !== shown.key) setShown(location);
      return;
    }
    let cancelled = false;
    const swap = () => {
      if (cancelled) return;
      // A transition keeps the old page on screen until the lazy route is ready.
      startTransition(() => setShown(location));
    };
    // Navigation must never depend on motion. preloadRoute already swallows its own errors.
    if (reduced || !effects.blade || !panel.current) {
      preloadRoute(location.pathname).then(swap);
      return () => {
        cancelled = true;
      };
    }
    const el = panel.current;
    const blade = loadEngine()
      .then((e) => e.cover(el))
      .then(
        () => true,
        () => false, // engine failed to load: swap without the blade
      );
    // If the blade stalls for any reason, swap anyway.
    const timeout = new Promise<boolean>((resolve) => window.setTimeout(() => resolve(false), 1500));
    Promise.all([Promise.race([blade, timeout]), preloadRoute(location.pathname)]).then(([didCover]) => {
      covered.current = didCover;
      swap();
    });
    return () => {
      cancelled = true;
    };
  }, [location, shown, reduced]);

  // After the new page commits: scroll, move focus, lift the blade, start its reveals.
  useEffect(() => {
    const main = document.getElementById('main');
    const target = hashTarget(shown.hash);
    if (firstRender.current) {
      firstRender.current = false;
      // A direct load of /#visit: the browser has already jumped to the section in the prerendered
      // HTML, but fonts and images can shift the layout afterwards. Land on it again once settled
      // (scroll-margin-top on the section clears the sticky header).
      if (target) requestAnimationFrame(() => target.scrollIntoView({ behavior: 'instant' }));
      return;
    }
    const wasCovered = covered.current;
    covered.current = false;
    arrived.current = wasCovered;
    // A change of page always jumps (the old page's scroll offset means nothing on the new one), even
    // if the blade did not cover it. Only links inside the page glide.
    const pathChanged = lastPath.current !== shown.pathname;
    lastPath.current = shown.pathname;
    const instant = wasCovered || pathChanged;

    // Behind the blade the jump is invisible and should be instant. For a link inside the page, native
    // scrolling follows the CSS scroll-behavior (smooth when motion is on, plain when it is reduced).
    const nativeScroll = () => {
      if (target) target.scrollIntoView(instant ? { behavior: 'instant' } : undefined);
      else window.scrollTo({ top: 0, behavior: 'instant' });
    };
    if (reducedRef.current && !wasCovered) {
      // No motion code is loaded in reduced mode: native scrolling only.
      nativeScroll();
    } else {
      loadEngine().then(
        (e) => {
          e.scrollTo(target ?? 0, instant);
          const el = panel.current;
          if (!wasCovered || !el) return;
          // Wait two frames so the new page's setup (reveals, heading split) runs while
          // the screen is still covered; otherwise it stalls the panel's exit.
          requestAnimationFrame(() => requestAnimationFrame(() => e.uncover(el)));
        },
        nativeScroll,
      );
    }
    if (!target) main?.focus({ preventScroll: true });
  }, [shown]);

  // Cut and draw reveals (no motion library). Behind the blade, content in view animates too.
  useEffect(() => {
    const main = document.getElementById('main');
    if (reduced || !effects.reveals || !main) return;
    return setupReveals(main, { afterCover: arrived.current });
  }, [shown.pathname, reduced]);

  // "Set": only on pages that arrived behind the blade (the engine is loaded by then).
  // A plain effect, because `arrived` is only known after the commit, not at render.
  useEffect(() => {
    const main = document.getElementById('main');
    if (reduced || !effects.heading || !main || !arrived.current) return;
    let cancelled = false;
    let undo: (() => void) | undefined;
    loadEngine().then(
      (e) => {
        if (!cancelled) undo = e.setHeading(main);
      },
      () => {},
    );
    return () => {
      cancelled = true;
      undo?.();
    };
  }, [shown.pathname, reduced]);

  return (
    <>
      <Suspense fallback={null}>
        <Routes location={shown}>
          <Route path="/" element={<Home />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/sent" element={<Sent />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
      <div ref={panel} aria-hidden="true" className="blade">
        <Dagger className="h-16 w-auto text-ash" />
      </div>
    </>
  );
}
