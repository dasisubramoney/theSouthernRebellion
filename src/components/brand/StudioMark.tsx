import { DaggerShape } from './Dagger';
import { fan } from './geometry';

type Props = {
  className?: string;
  /** Draw the black circle behind the daggers. */
  disc?: boolean;
  title?: string;
  /** Hero only: the daggers drop in (the fan, a CSS animation in index.css). */
  animated?: boolean;
};

export function StudioMark({ className, disc = true, title, animated }: Props) {
  return (
    <svg
      viewBox="0 0 200 200"
      // With its disc, the mark is the logo and keeps black and white in both themes
      // (.logo-disc in index.css). Without it, the daggers follow the text colour.
      className={disc ? `logo-disc ${className ?? ''}` : className}
      role={title ? 'img' : undefined}
      aria-hidden={title ? undefined : true}
      focusable="false"
    >
      {title ? <title>{title}</title> : null}
      {disc ? <circle cx="100" cy="100" r="100" fill="var(--logo-black)" /> : null}
      <g fill="currentColor">
        {fan.map(({ rotate, scale }) => (
          // The outer group is what moves; the inner one keeps the fan geometry.
          <g
            key={rotate}
            data-dagger={rotate === 0 ? 'centre' : rotate < 0 ? 'left' : 'right'}
            data-fan={animated ? 'dagger' : undefined}
          >
            <g transform={`translate(100 176) rotate(${rotate}) scale(${scale})`}>
              <DaggerShape />
            </g>
          </g>
        ))}
      </g>
    </svg>
  );
}
