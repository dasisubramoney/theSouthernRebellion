import { useCallback, useEffect, useRef, useState } from 'react';
import type { PortfolioEntry } from '../../content/types';
import { isTodo } from '../../content/todo';
import { Picture } from '../media/Picture';
import { contentPreview } from '../../lib/preview';
import { Lightbox } from './Lightbox';

const placementText = (p: PortfolioEntry) => (isTodo(p.placement) ? null : p.placement);

export function caption(p: PortfolioEntry) {
  return [p.style, placementText(p)].filter(Boolean).join(' · ');
}

/**
 * Ruled grid, like a printed flash sheet: hairline rules between cells, 4:5 crops.
 * The first featured piece takes a double cell from tablet up.
 */
export function PortfolioGrid({ items, artistName }: { items: PortfolioEntry[]; artistName: string }) {
  const [open, setOpen] = useState<number | null>(null);
  const [origin, setOrigin] = useState<DOMRect | null>(null);
  const triggers = useRef<(HTMLButtonElement | null)[]>([]);

  const ordered = [...items].sort((a, b) => Number(Boolean(b.featured)) - Number(Boolean(a.featured)));

  const lastOpen = useRef<number | null>(null);

  const close = useCallback(() => setOpen(null), []);

  // Return focus to the cell of the piece last viewed, after the dialog has closed.
  // Focusing earlier loses: closing a native <dialog> restores focus to whatever had it
  // before opening, which is <main> after a page change, or nothing in Safari, where
  // clicking a button does not focus it.
  useEffect(() => {
    if (open !== null) {
      lastOpen.current = open;
      return;
    }
    const i = lastOpen.current;
    lastOpen.current = null;
    if (i !== null) requestAnimationFrame(() => triggers.current[i]?.focus());
  }, [open]);

  return (
    <>
      <ul className="grid grid-cols-2 gap-px border border-coal bg-coal md:grid-cols-3 lg:grid-cols-4">
        {ordered.map((p, i) => {
          // The lead piece spans two columns and two rows from tablet up. Its image fills
          // whatever height the two rows beside it take, so the rules line up.
          const lead = i === 0 && ordered.length >= 5;
          return (
            <li key={p.id} className={`flex flex-col bg-ink ${lead ? 'md:col-span-2 md:row-span-2' : ''}`}>
              <button
                ref={(el) => {
                  triggers.current[i] = el;
                }}
                type="button"
                data-reveal="cut"
                className={`group relative block w-full cursor-zoom-in overflow-hidden ${lead ? 'md:min-h-0 md:flex-1' : ''}`}
                onClick={(e) => {
                  setOrigin(e.currentTarget.getBoundingClientRect());
                  setOpen(i);
                }}
                aria-haspopup="dialog"
              >
                <Picture
                  imageKey={p.imageKey}
                  alt={p.alt}
                  sizes={lead ? '(min-width: 64rem) 50vw, (min-width: 48rem) 66vw, 50vw' : '(min-width: 64rem) 25vw, (min-width: 48rem) 33vw, 50vw'}
                  priority={lead}
                  className={`h-auto w-full transition-transform duration-500 ease-(--ease-settle) group-hover:scale-[1.02] ${
                    lead ? 'md:absolute md:inset-0 md:size-full md:object-cover' : ''
                  }`}
                />
              </button>
              <div className="px-3 py-2.5 md:px-4">
                <p className="text-small text-ash">{caption(p)}</p>
                {contentPreview && !p.consentConfirmed ? <p className="ui mt-1 text-alert-on-ink">No consent</p> : null}
              </div>
              {contentPreview && p.needsDecision ? (
                <p className="px-3 pb-3 text-small text-alert-on-ink md:px-4">Decision needed: {p.needsDecision}</p>
              ) : null}
            </li>
          );
        })}
      </ul>
      <Lightbox items={ordered} index={open} origin={origin} onIndex={setOpen} onClose={close} label={`Work by ${artistName}`} />
    </>
  );
}
