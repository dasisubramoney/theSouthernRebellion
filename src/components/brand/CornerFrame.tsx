import type { ReactNode } from 'react';

/**
 * White ornamental corners, after the studio's black-and-white artist intro cards.
 * Only for artist portraits (see DESIGN.md).
 */
function Corner({ className }: { className: string }) {
  return (
    <svg viewBox="0 0 64 64" className={`absolute size-12 md:size-16 ${className}`} aria-hidden="true" focusable="false">
      <g fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M6 64V22A16 16 0 0 1 22 6h42" />
        <path d="M14 64V30a16 16 0 0 1 16-16h34" />
        <path d="M6 22a16 16 0 0 0 16 16 16 16 0 0 0-16-16" />
      </g>
      <circle cx="22" cy="22" r="3.2" fill="currentColor" />
      <circle cx="6" cy="6" r="2.4" fill="currentColor" />
    </svg>
  );
}

export function CornerFrame({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <div className={`relative p-3 text-bone md:p-4 ${className}`}>
      {children}
      <Corner className="left-0 top-0" />
      <Corner className="right-0 top-0 -scale-x-100" />
      <Corner className="bottom-0 left-0 -scale-y-100" />
      <Corner className="bottom-0 right-0 -scale-100" />
    </div>
  );
}
