type Props = { className?: string; title?: string };

const leaves = [
  'M20 86C52 74 86 98 98 166C82 126 54 104 20 86Z',
  'M46 115C68 109 88 128 98 166C85 141 66 124 46 115Z',
];

/** Bram's personal mark: one dagger with a flourish. Only used on his page. */
export function BramMark({ className, title }: Props) {
  return (
    <svg
      viewBox="0 0 200 200"
      className={className}
      fill="currentColor"
      role={title ? 'img' : undefined}
      aria-hidden={title ? undefined : true}
      focusable="false"
    >
      {title ? <title>{title}</title> : null}
      <circle cx="100" cy="17" r="4.6" />
      <path d="M100 21C108 28 108 52 100 59C92 52 92 28 100 21Z" />
      <path d="M70 66Q100 54 130 66" fill="none" stroke="currentColor" strokeWidth={4.4} strokeLinecap="round" />
      <circle cx="67.5" cy="67.5" r="5" />
      <circle cx="132.5" cy="67.5" r="5" />
      <path d="M100 190 109 76 111 71 89 71 91 76Z" />
      {leaves.map((d) => (
        <path key={d} d={d} />
      ))}
      <g transform="matrix(-1 0 0 1 200 0)">
        {leaves.map((d) => (
          <path key={d} d={d} />
        ))}
      </g>
    </svg>
  );
}
