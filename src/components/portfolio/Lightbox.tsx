import { useEffect, useRef } from 'react';
import type { PortfolioEntry } from '../../content/types';
import { Picture } from '../media/Picture';
import { Dagger } from '../brand/Dagger';
import { caption } from './PortfolioGrid';
import { useEngine } from '../../lib/useEngine';
import { effects } from '../../motion/effects';
import { press } from '../../lib/press';

type Props = {
  items: PortfolioEntry[];
  index: number | null;
  /** Where the clicked grid cell was, so the image can grow out of it. */
  origin: DOMRect | null;
  onIndex: (i: number) => void;
  onClose: () => void;
  label: string;
  /** Names the artist on each piece, where the pieces come from several artists. */
  byline?: (p: PortfolioEntry) => string | null | undefined;
};

/**
 * Native <dialog>: focus is kept inside while open, Esc closes it, and the page
 * behind is inert. Left and right arrows move between pieces.
 */
export function Lightbox({ items, index, origin, onIndex, onClose, label, byline }: Props) {
  const ref = useRef<HTMLDialogElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const wasOpen = useRef(false);
  /** True when the last move between pieces came from an arrow key. */
  const byKey = useRef(false);
  // While the dialog fades out (index is already null) it keeps showing the piece it closed on.
  const lastIndex = useRef<number | null>(index);
  if (index !== null) lastIndex.current = index;
  const shownIndex = index ?? lastIndex.current;
  const item = shownIndex === null ? null : items[shownIndex];

  // First open: grow from the grid cell. Next/previous with the buttons: a short fade-in.
  // Arrow keys: no animation, so paging through quickly keeps up with the keys.
  useEngine(
    (e) => {
      const el = imageRef.current;
      if (!el) return;
      const first = !wasOpen.current;
      wasOpen.current = true;
      if (first && origin) return e.flipFrom(el, origin);
      if (byKey.current) return;
      return e.swapIn(el);
    },
    [index],
    { enabled: effects.lightbox && index !== null },
  );

  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (index !== null && !d.open) d.showModal();
    if (index === null && d.open) d.close();
    // Closed: the next open grows from its cell again rather than cross-fading, and starts with no
    // memory of the last session's arrow keys.
    if (index === null) {
      wasOpen.current = false;
      byKey.current = false;
    }
  }, [index]);

  useEffect(() => {
    if (index === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
      byKey.current = true;
      onIndex(e.key === 'ArrowRight' ? (index + 1) % items.length : (index - 1 + items.length) % items.length);
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [index, items.length, onIndex]);

  return (
    <dialog
      ref={ref}
      aria-label={label}
      onClose={onClose}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      className={`lightbox m-0 h-dvh max-h-none w-screen max-w-none bg-ink/95 p-0 text-bone ${effects.lightbox ? 'lightbox-fade' : ''}`}
    >
      {item && shownIndex !== null ? (
        <div className="flex h-full flex-col">
          <div className="shell flex items-center justify-between py-4">
            <p className="ui num text-ash">
              {shownIndex + 1} / {items.length}
            </p>
            <button type="button" className={`ui py-2 ${press}`} onClick={onClose} autoFocus>
              Close
            </button>
          </div>

          <figure className="flex min-h-0 flex-1 flex-col items-center justify-center gap-4 px-4">
            <div ref={imageRef} key={item.id} className="relative flex min-h-0 w-full flex-1 items-center justify-center">
              <Picture
                key={item.id}
                imageKey={item.imageKey}
                rendition="full"
                alt={item.alt}
                sizes="100vw"
                priority
                className="max-h-[70dvh] w-auto max-w-full object-contain"
              />
            </div>
            <figcaption className="measure pb-2 text-center">
              <span className="block text-small text-smoke">{item.alt}</span>
              <span className="ui mt-2 block text-ash">{caption(item, byline?.(item))}</span>
            </figcaption>
          </figure>

          <div className="shell flex items-center justify-between border-t border-coal py-3">
            <button
              type="button"
              className={`ui flex items-center gap-2 py-3 ${press}`}
              onClick={() => {
                byKey.current = false;
                onIndex((shownIndex - 1 + items.length) % items.length);
              }}
            >
              <Dagger point="left" className="h-3 w-auto" />
              Previous
            </button>
            <button
              type="button"
              className={`ui flex items-center gap-2 py-3 ${press}`}
              onClick={() => {
                byKey.current = false;
                onIndex((shownIndex + 1) % items.length);
              }}
            >
              Next
              <Dagger point="right" className="h-3 w-auto" />
            </button>
          </div>
        </div>
      ) : null}
    </dialog>
  );
}
