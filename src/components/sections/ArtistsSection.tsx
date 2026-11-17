import { Link } from 'react-router-dom';
import { Dagger } from '../brand/Dagger';
import { Picture, PhotoTodo, hasImage } from '../media/Picture';
import { contactPath } from '../layout/nav';
import { publishedArtists } from '../../content/artists';
import type { Artist } from '../../content/types';
import { portfolioFor } from '../../lib/preview';

/** Styles grouped across artists, so a first-timer can start from the look they want. */
function styleIndex() {
  const map = new Map<string, Artist[]>();
  for (const a of publishedArtists) {
    for (const s of a.styles) {
      if (s === 'Body piercing') continue;
      const list = map.get(s) ?? [];
      list.push(a);
      map.set(s, list);
    }
  }
  return [...map.entries()].sort(([a], [b]) => a.localeCompare(b));
}

export function ArtistsSection() {
  return (
    <section id="artists" aria-labelledby="artists-heading" className="scroll-mt-24">
      <div className="shell">
        <h2 id="artists-heading" className="max-w-[16ch] font-display text-h1">
          Pick the artist whose work you want
        </h2>
        <p className="measure mt-6 text-lead text-smoke">
          Each artist runs their own book, so choose by the work. Not sure where to start? The list of styles below
          shows who tattoos what.
        </p>
      </div>

      <ol className="mt-(--section)">
        {publishedArtists.map((a, i) => (
          <ArtistBand key={a.slug} artist={a} index={i} />
        ))}
      </ol>

      <div aria-labelledby="styles-heading" role="group" className="shell mt-(--section)">
        <div className="grid-page gap-y-8">
          <div className="col-span-4 md:col-span-8 lg:col-span-4">
            <h3 id="styles-heading" className="font-display text-h2">
              Start from the style
            </h3>
            <p className="measure mt-4 text-smoke">
              Not sure who to choose? Find the look you want, then the artists who tattoo it. Still unsure? Choose “Not
              sure, help me choose” on the{' '}
              <Link className="link text-bone" to={contactPath}>
                booking form
              </Link>
              .
            </p>
          </div>
          <dl className="col-span-4 md:col-span-8 lg:col-span-7 lg:col-start-6">
            {styleIndex().map(([style, list]) => (
              <div key={style} className="grid grid-cols-1 gap-1 border-b border-coal py-4 sm:grid-cols-[1fr_auto] sm:gap-6">
                <dt>{style}</dt>
                <dd className="flex flex-wrap gap-x-4">
                  {list.map((a) => (
                    <Link key={a.slug} className="link text-smoke" to={`/#artist-${a.slug}`}>
                      {a.name}
                    </Link>
                  ))}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}

function ArtistBand({ artist, index }: { artist: Artist; index: number }) {
  const work = portfolioFor(artist.slug)
    .filter((p) => p.kind === 'tattoo')
    .sort((a, b) => Number(Boolean(b.featured)) - Number(Boolean(a.featured)))
    .slice(0, 3);
  const flip = index % 2 === 1;
  return (
    <li id={`artist-${artist.slug}`} className="scroll-mt-24 border-t border-coal py-12 md:py-16">
      <div className="shell grid-page items-end gap-y-8">
        <div className={`col-span-4 md:col-span-3 lg:col-span-4 ${flip ? 'md:order-2 md:col-start-6 lg:col-start-9' : ''}`}>
          <h3 className="font-display text-[clamp(3rem,1rem+7vw,6.5rem)] leading-[0.9]">{artist.name}</h3>
          <p className="mt-3 text-small text-smoke">
            @{artist.instagram}
            {artist.pronouns ? <span className="text-ash"> · {artist.pronouns}</span> : null}
          </p>
          <ul className="mt-5 space-y-1">
            {artist.styles.map((s) => (
              <li key={s} className="flex items-center gap-2 text-smoke">
                <Dagger className="h-3 w-auto text-ash" />
                {s}
              </li>
            ))}
          </ul>
          <p className="mt-6">
            <Link className="link font-semibold" to={`${contactPath}?artist=${artist.slug}`}>
              Book with {artist.name}
            </Link>
          </p>
        </div>
        <ul
          className={`col-span-4 grid grid-cols-3 gap-2 md:col-span-5 lg:col-span-7 ${flip ? 'md:order-1 md:col-start-1' : 'lg:col-start-6'}`}
          aria-label={`Three pieces by ${artist.name}`}
        >
          {work.length
            ? work.map((p, i) => (
                <li key={p.id} data-reveal="cut" className={`relative ${i === 1 ? 'translate-y-6 md:translate-y-10' : ''}`}>
                  {hasImage(p.imageKey) ? (
                    <Picture imageKey={p.imageKey} alt={p.alt} sizes="(min-width: 64rem) 20vw, 30vw" className="h-auto w-full" />
                  ) : (
                    <span className="block aspect-[4/5] border border-dashed border-pewter bg-soot" />
                  )}
                </li>
              ))
            : [0, 1, 2].map((i) => (
                <li key={i} className={i === 1 ? 'translate-y-6 md:translate-y-10' : ''}>
                  <PhotoTodo label={i === 0 ? `${artist.name}: photos with consent` : ''} />
                </li>
              ))}
        </ul>
      </div>
    </li>
  );
}
