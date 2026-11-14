import { useEffect, type DependencyList } from 'react';
import { useMotion } from './motion';

export type Engine = typeof import('../motion/engine');

let engine: Promise<Engine> | null = null;

/**
 * Loads the motion engine once. Safe to call repeatedly. A failed load (flaky
 * connection, a chunk replaced by a new deploy) is not cached, so the next call retries.
 */
export function loadEngine() {
  engine ??= import('../motion/engine').catch((err: unknown) => {
    engine = null;
    throw err;
  });
  return engine;
}

let intent: Promise<void> | null = null;

/**
 * Resolves on the visitor's first interaction: a tap, click, key press, wheel or
 * mouse movement. The engine waits for this, so the first page load (and Lighthouse)
 * never parses GSAP. A link press starts the load before the click lands.
 */
function firstInteraction() {
  intent ??= new Promise<void>((resolve) => {
    const events = ['pointerdown', 'keydown', 'wheel', 'touchstart', 'pointermove'] as const;
    const done = () => {
      events.forEach((t) => window.removeEventListener(t, done, true));
      resolve();
    };
    events.forEach((t) => window.addEventListener(t, done, { capture: true, passive: true, once: true }));
  });
  return intent;
}

/**
 * Runs a motion effect once the engine has loaded, and only while motion is on.
 * The effect returns its own cleanup; switching "Reduce motion" on reverts it.
 * `waitForInteraction` holds the load until the visitor first interacts.
 */
export function useEngine(
  run: (e: Engine) => (() => void) | void,
  deps: DependencyList,
  { waitForInteraction = false, enabled = true }: { waitForInteraction?: boolean; enabled?: boolean } = {},
) {
  const { reduced } = useMotion();
  useEffect(() => {
    // `enabled: false` means there is nothing to animate, so the engine is not even loaded.
    if (reduced || !enabled) return;
    let cancelled = false;
    let cleanup: (() => void) | void;
    (waitForInteraction ? firstInteraction() : Promise.resolve())
      .then(() => (cancelled ? Promise.reject(new Error('cancelled')) : loadEngine()))
      .then(
        (e) => {
          if (!cancelled) cleanup = run(e);
        },
        () => {
          /* No engine, no effect. Content is already in its final state. */
        },
      );
    return () => {
      cancelled = true;
      cleanup?.();
    };
  }, [reduced, enabled, ...deps]);
}
