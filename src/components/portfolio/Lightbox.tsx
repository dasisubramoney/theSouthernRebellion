import { useEffect, useRef } from 'react';
import type { PortfolioEntry } from '../../content/types';
import { Picture } from '../media/Picture';
import { Dagger } from '../brand/Dagger';
import { caption } from './PortfolioGrid';
import { useEngine } from '../../lib/useEngine';
import { effects } from '../../motion/effects';

type Props = {
  items: PortfolioEntry[];
  index: number | null;
  /** Where the clicked grid cell was, so the image can grow out of it. */
  origin: DOMRect | null;
  onIndex: (i: number) => void;
  onClose: () => void;
  label: string;
};

/**
 * Native <dialog>: focus is kept inside while open, Esc closes it, and the page
 * behind is inert. Left and right arrows move between pieces.
 */
export function Lightbox({ items, index, origin, onIndex, onClose, label }: Props) {
  const ref = useRef<HTMLDialogElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const wasOpen = useRef(false);
  const item = index === null ? null : items[index];

  // First open: grow from the grid cell. Next/previous: short cross-fade.
  useEngine(
    (e) => {
      const el = imageRef.current;
      if (!el) return;
      const first = !wasOpen.current;
      wasOpen.current = true;
      return first && origin ? e.flipFrom(el, origin) : e.swapIn(el);
    },
    [index],
    { enabled: effects.lightbox && index !== null },
  );

  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (index !== null && !d.open) d.showModal();
    if (index === null && d.open) d.close();
    // Closed: the next open grows from its cell again rather than cross-fading.
    if (index === null) wasOpen.current = false;
  }, [index]);

  useEffect(() => {
    if (index === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') onIndex((index + 1) % items.length);
      if (e.key === 'ArrowLeft') onIndex((index - 1 + items.length) % items.length);
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
      className="lightbox m-0 h-dvh max-h-none w-screen max-w-none bg-ink/95 p-0 text-bone"
    >
      {item && index !== null ? (
        <div className="flex h-full flex-col">
          <div className="shell flex items-center justify-between py-4">
            <p className="ui num text-ash">
              {index + 1} / {items.length}
            </p>
            <button type="button" className="ui py-2" onClick={onClose} autoFocus>
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
              <span className="ui mt-2 block text-ash">{caption(item)}</span>
            </figcaption>
          </figure>

          <div className="shell flex items-center justify-between border-t border-coal py-3">
            <button
              type="button"
              className="ui flex items-center gap-2 py-3"
              onClick={() => onIndex((index - 1 + items.length) % items.length)}
            >
              <Dagger point="left" className="h-3 w-auto" />
              Previous
            </button>
            <button
              type="button"
              className="ui flex items-center gap-2 py-3"
              onClick={() => onIndex((index + 1) % items.length)}
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
