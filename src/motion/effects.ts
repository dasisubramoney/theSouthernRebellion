/**
 * One switch per effect. Set a flag to false to turn that effect off for everyone;
 * the content is unaffected, it just appears without the motion.
 * Visitors can also turn all motion off with "Reduce motion" in the footer, and
 * anyone with the system "reduce motion" setting gets none of it.
 */
export const effects = {
  /** Home hero: daggers drop into the stamp, the circle opens onto the work. CSS only. */
  fan: true,
  /** Page transition panel with the dagger-point edge. */
  blade: true,
  /** Images open top to bottom, dividers draw out, as they scroll into view. */
  reveals: true,
  /** The new page's h1 rises line by line behind the blade. Needs `blade`. */
  heading: true,
  /** Lightbox image grows out of its grid cell; the lightbox fades in and out. */
  lightbox: true,
  /** Buttons shrink a touch while pressed. CSS only (`press` in index.css). */
  press: true,
  /** Mobile menu fades and drops in, and fades out a little faster. CSS only. */
  menu: true,
  /** Lenis smooth scrolling on mouse and trackpad. */
  smoothScroll: true,
  /** Light/dark switch: the new theme comes down behind a dagger-point edge. CSS only. */
  themeSwitch: true,
};
