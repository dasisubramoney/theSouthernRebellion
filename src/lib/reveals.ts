/**
 * "Cut" and "draw" reveals without a motion library: a passive, frame-throttled scroll
 * check adds and removes one class, CSS does the animating (see "Reveals" in index.css).
 *
 * A scroll check rather than IntersectionObserver: an element that is jumped past
 * (anchor link, End key, a fast fling) goes from below the screen to above it without
 * ever intersecting, so an observer never fires and it would stay hidden. Here anything
 * at or above the reveal line is shown, whether it is on screen or already passed.
 *
 * afterCover: the page has just arrived behind the blade, so content in view can start
 * hidden and open as the panel passes. On a first load only content below the fold is
 * hidden, so nothing already on screen disappears.
 */
export function setupReveals(main: HTMLElement, { afterCover }: { afterCover: boolean }) {
  const targets = Array.from(main.querySelectorAll<HTMLElement>('[data-reveal]'));
  if (!targets.length) return () => {};

  const line = () => window.innerHeight * 0.92;
  let pending = targets.filter((el) => afterCover || el.getBoundingClientRect().top >= window.innerHeight);

  // Apply the hidden state instantly: with the transition left on, a fast scroll
  // could catch an element half-way through closing.
  pending.forEach((el) => {
    el.style.transition = 'none';
    el.classList.add('reveal-out');
  });
  void main.offsetHeight;
  pending.forEach((el) => (el.style.transition = ''));

  let frame = 0;
  let base = afterCover ? 220 : 0; // content in view waits for the blade to start lifting
  const check = () => {
    frame = 0;
    const due = pending.filter((el) => el.getBoundingClientRect().top < line());
    if (!due.length) return;
    due.forEach((el, i) => {
      el.style.transitionDelay = `${base + i * 70}ms`;
      el.classList.remove('reveal-out');
    });
    base = 0;
    pending = pending.filter((el) => !due.includes(el));
    if (!pending.length) stop();
  };
  const onScroll = () => {
    if (!frame) frame = requestAnimationFrame(check);
  };
  const stop = () => {
    window.removeEventListener('scroll', onScroll);
    window.removeEventListener('resize', onScroll);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll, { passive: true });
  onScroll();

  return () => {
    stop();
    if (frame) cancelAnimationFrame(frame);
    targets.forEach((el) => {
      el.classList.remove('reveal-out');
      el.style.transitionDelay = '';
    });
  };
}
