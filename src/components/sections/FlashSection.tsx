import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Dagger } from '../brand/Dagger';
import { Picture } from '../media/Picture';
import { TodoNote, TodoOr } from '../content/TodoNote';
import { contactPath } from '../layout/nav';
import { publishedArtists } from '../../content/artists';
import { flash, flashNotes, visibleFlash } from '../../content/flash';
import { isTodo } from '../../content/todo';
import type { ArtistSlug, FlashEntry } from '../../content/types';
import { contentPreview } from '../../lib/preview';

const listFor = (slug: ArtistSlug) => (contentPreview ? flash[slug] : visibleFlash(slug));

export function FlashSection() {
  const [only, setOnly] = useState<ArtistSlug | 'all'>('all');
  const withFlash = publishedArtists.filter((a) => listFor(a.slug).length > 0);
  const shown = only === 'all' ? withFlash : withFlash.filter((a) => a.slug === only);

  return (
    <section id="flash" aria-labelledby="flash-heading" className="mt-(--section) scroll-mt-24">
      <div className="shell">
        <div className="grid-page items-end gap-y-8">
          <div className="col-span-4 md:col-span-5 lg:col-span-7">
            <h2 id="flash-heading" className="font-display text-h1">
              Available flash
            </h2>
            <p className="measure mt-6 text-lead text-smoke">
              Flash is a design the artist has already drawn. Pick one you like and claim it. Marked pieces are taken.
            </p>
          </div>
          <dl className="col-span-4 flex gap-8 md:col-span-3 lg:col-span-4 lg:col-start-9 lg:justify-end">
            <div className="flex items-center gap-2">
              <dt>
                <Dagger className="h-5 w-auto" title="Available" />
              </dt>
              <dd className="ui">Available</dd>
            </div>
            <div className="flex items-center gap-2">
              <dt>
                <Dagger className="h-5 w-auto text-pewter" title="Claimed" />
              </dt>
              <dd className="ui text-ash line-through">Claimed</dd>
            </div>
          </dl>
        </div>
        <TodoOr className="measure mt-8" value={flashNotes.howToClaim} />
      </div>

      {withFlash.length > 1 ? (
        <nav aria-label="Filter flash by artist" className="shell mt-12">
          <ul className="flex flex-wrap gap-2">
            {[{ slug: 'all' as const, name: 'All artists' }, ...withFlash].map((a) => (
              <li key={a.slug}>
                <button
                  type="button"
                  aria-pressed={only === a.slug}
                  onClick={() => setOnly(a.slug)}
                  className="ui border border-pewter px-4 py-3 aria-pressed:border-bone aria-pressed:bg-bone aria-pressed:text-ink"
                >
                  {a.name}
                </button>
              </li>
            ))}
          </ul>
        </nav>
      ) : null}

      <div className="mt-12 space-y-(--section)">
        {shown.length ? (
          shown.map((a) => (
            <div key={a.slug} role="group" aria-labelledby={`flash-${a.slug}`} className="shell">
              <div className="flex flex-wrap items-baseline justify-between gap-4 border-b border-coal pb-4">
                <h3 id={`flash-${a.slug}`} className="font-display text-h2">
                  {a.name}
                </h3>
              </div>
              <ul className="mt-8 grid grid-cols-2 gap-px border border-coal bg-coal md:grid-cols-3 lg:grid-cols-4">
                {listFor(a.slug).map((f) => (
                  <FlashCell key={f.id} entry={f} artist={a.slug} />
                ))}
              </ul>
            </div>
          ))
        ) : (
          <div className="shell space-y-3">
            <TodoNote item={{ todo: 'No flash has been confirmed yet. Each artist marks their designs as available or claimed in src/content/flash.ts.' }} />
          </div>
        )}
        {contentPreview ? (
          <div className="shell space-y-3">
            {flashNotes.missing.map((m) => (
              <TodoNote key={m.todo} item={m} />
            ))}
          </div>
        ) : null}
      </div>
    </section>
  );
}

function FlashCell({ entry, artist }: { entry: FlashEntry; artist: ArtistSlug }) {
  const claimed = entry.status === 'claimed';
  return (
    <li className="flex flex-col bg-ink">
      <div data-reveal="cut" className={`relative ${claimed ? 'opacity-40 grayscale' : ''}`}>
        <Picture imageKey={entry.imageKey} alt={entry.alt} sizes="(min-width: 64rem) 25vw, (min-width: 48rem) 33vw, 50vw" className="h-auto w-full" />
      </div>
      <div className="flex flex-1 flex-col gap-2 p-3 md:p-4">
        <h4 className={`font-semibold ${claimed ? 'text-ash line-through' : ''}`}>{entry.title}</h4>
        {!isTodo(entry.size) ? <p className="text-small text-ash">{entry.size}</p> : null}
        {!isTodo(entry.price) ? <p className="num text-small">{entry.price}</p> : null}
        {entry.status === null ? <p className="ui text-alert-on-ink">Not confirmed as flash</p> : null}
        <p className="mt-auto pt-2">
          {claimed ? (
            <span className="ui text-ash">Claimed</span>
          ) : (
            <Link className="link text-small font-semibold" to={`${contactPath}?artist=${artist}&flash=${entry.id}`}>
              Claim this piece
            </Link>
          )}
        </p>
      </div>
    </li>
  );
}
