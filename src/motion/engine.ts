/**
 * The JavaScript half of the motion vocabulary (DESIGN.md), lazily loaded on the
 * visitor's first interaction, never during the first page load. Nothing imports
 * GSAP or Lenis outside this file. Every effect returns a cleanup.
 *
 *   cover/uncover  the blade: a panel with a dagger-point edge passes down between pages
 *   setHeading     "set": the new page's h1 rises line by line behind the blade
 *   flipFrom       the lightbox image grows out of its grid cell
 *   smoothScroll   Lenis, fine pointers only
 *
 * The hero fan and the cut/draw reveals are CSS (index.css, src/lib/reveals.ts),
 * so a first visit costs no motion JavaScript at all.
 */
import { gsap } from 'gsap';
import { SplitText } from 'gsap/SplitText';
import Lenis from 'lenis';

gsap.registerPlugin(SplitText);

const EASE_SETTLE = 'power3.out';

let lenis: Lenis | null = null;

/** Lenis on fine pointers only, driven by the GSAP ticker. Touch keeps native scrolling. */
export function smoothScroll() {
  if (!window.matchMedia('(pointer: fine)').matches) return () => {};
  const instance = new Lenis({ lerp: 0.12, smoothWheel: true });
  const tick = (time: number) => instance.raf(time * 1000);
  gsap.ticker.add(tick);
  gsap.ticker.lagSmoothing(0);
  lenis = instance;
  return () => {
    gsap.ticker.remove(tick);
    instance.destroy();
    if (lenis === instance) lenis = null;
  };
}

/**
 * Lenis honours the target's scroll-margin-top, so sections clear the sticky header. `immediate`
 * is for jumps behind the blade; links inside the page glide. Without Lenis (touch, or before the
 * first pointer interaction) this falls back to native scrolling, which follows CSS scroll-behavior.
 */
export function scrollTo(target: number | HTMLElement, immediate = true) {
  if (lenis) {
    // Lenis clamps to the page height it measured last. After a page swap (the short contact page
    // to the long home page) that height is stale, so measure again before scrolling.
    lenis.resize();
    lenis.scrollTo(target, immediate ? { immediate: true, force: true } : { duration: 0.9, force: true });
  }
  else if (typeof target === 'number') window.scrollTo({ top: target, behavior: immediate ? 'instant' : 'auto' });
  else target.scrollIntoView(immediate ? { behavior: 'instant' } : undefined);
}

/* ----------------------------------------------------------------- blade */

/** Panel comes down over the old page. Resolves when the screen is covered. */
export function cover(panel: HTMLElement): Promise<void> {
  return new Promise((resolve) => {
    gsap.fromTo(
      panel,
      { yPercent: -110, visibility: 'visible' },
      { yPercent: 0, duration: 0.34, ease: 'power3.in', onComplete: () => resolve() },
    );
  });
}

/** Panel carries on down, uncovering the new page. */
export function uncover(panel: HTMLElement): Promise<void> {
  return new Promise((resolve) => {
    gsap.to(panel, {
      yPercent: 110,
      duration: 0.5,
      ease: EASE_SETTLE,
      onComplete: () => {
        gsap.set(panel, { visibility: 'hidden' });
        resolve();
      },
    });
  });
}

/* ------------------------------------------------------------------- set */

/** The arriving page's h1 rises line by line inside a mask, as the blade lifts. */
export function setHeading(main: HTMLElement) {
  const heading = main.querySelector<HTMLElement>('h1');
  if (!heading) return () => {};
  const ctx = gsap.context(() => {
    SplitText.create(heading, {
      type: 'lines',
      mask: 'lines',
      autoSplit: true,
      onSplit: (self) =>
        gsap.from(self.lines, { yPercent: 105, duration: 0.8, ease: EASE_SETTLE, stagger: 0.08, delay: 0.12 }),
    });
  });
  return () => ctx.revert();
}

/* -------------------------------------------------------------- lightbox */

/** FLIP: start the lightbox image at the grid cell's position and size, then settle. */
export function flipFrom(wrapper: HTMLElement, from: DOMRect) {
  const ctx = gsap.context(() => {
    // Measure the image itself, not its full-width wrapper, so it does not stretch on the way.
    const el = wrapper.querySelector<HTMLElement>('img') ?? (wrapper.firstElementChild as HTMLElement | null) ?? wrapper;
    const to = el.getBoundingClientRect();
    if (!to.width || !to.height) return;
    gsap.from(el, {
      x: from.left - to.left,
      y: from.top - to.top,
      scaleX: from.width / to.width,
      scaleY: from.height / to.height,
      transformOrigin: '0 0',
      duration: 0.55,
      ease: EASE_SETTLE,
    });
  });
  return () => ctx.revert();
}

/** Moving between pieces inside the lightbox: a short cross-fade, no travel. */
export function swapIn(el: HTMLElement) {
  const ctx = gsap.context(() => {
    gsap.from(el, { opacity: 0, duration: 0.25, ease: 'power1.out' });
  });
  return () => ctx.revert();
}
