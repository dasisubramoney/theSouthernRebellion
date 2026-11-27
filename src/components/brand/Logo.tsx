/**
 * The studio's wordmark ("The Rebellion / Tattoo & Piercing"), cut from the "New Logo" in the
 * onboarding Drive folder without the daggers, for small spaces like the header. Drawn in the
 * current text colour (a CSS mask over the supplied PNG; see .brand-wordmark in index.css).
 *
 * Pass `title` when the wordmark is the only thing naming its link or figure; leave it out when the
 * surrounding element is already labelled, and it is hidden from screen readers.
 */
export function Wordmark({ className = '', title }: { className?: string; title?: string }) {
  return title ? (
    <span role="img" aria-label={title} className={`brand-wordmark ${className}`} />
  ) : (
    <span aria-hidden="true" className={`brand-wordmark ${className}`} />
  );
}
