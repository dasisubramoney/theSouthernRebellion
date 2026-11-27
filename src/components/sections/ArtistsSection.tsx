import { Link } from 'react-router-dom';
import { Dagger } from '../brand/Dagger';
import { Picture, PhotoTodo, hasImage } from '../media/Picture';
import { TodoNote, TodoOr } from '../content/TodoNote';
import { EmailLink } from '../layout/EmailLink';
import { ExternalLink } from '../layout/ExternalLink';
import { contactPath } from '../layout/nav';
import { publishedArtists } from '../../content/artists';
import { flash, flashNotes, visibleFlash } from '../../content/flash';
import { studio } from '../../content/studio';
import { isTodo, known } from '../../content/todo';
import type { Artist, FlashEntry } from '../../content/types';
import { instagramUrl } from '../../lib/links';
import { contentPreview, portfolioFor } from '../../lib/preview';

const studioEmail = `${studio.email.user}@${studio.email.domain}`;

/** One line of an artist's Instagram bio. The studio email, if it appears, is built in the browser rather than printed. */
function BioLine({ line }: { line: string }) {
  const at = line.indexOf(studioEmail);
  if (at < 0) return <>{line}</>;
  return (
    <>
      {line.slice(0, at)}
      <EmailLink className="link" {...studio.email} />
      {line.slice(at + studioEmail.length)}
    </>
  );
}

/**
 * Each artist, one after another: who they are (bio, styles, Instagram bio), their three best
 * pieces, and three flash designs to claim. Everything comes from src/content.
 */
export function ArtistsSection() {
  return (
    <section id="artists" aria-labelledby="artists-heading" className="scroll-mt-24">
      <div className="shell">
        <h2 id="artists-heading" className="font-display text-h1">
          The Artists
        </h2>
        <p className="measure mt-6 text-lead text-smoke">
          Each artist runs their own book, so choose by the work. Still unsure? Choose “Not sure, help me choose” on the{' '}
          <Link className="link text-bone" to={contactPath}>
            booking form
          </Link>
          .
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-between gap-x-8 gap-y-4">
          <p className="measure text-smoke">
            Flash is a design the artist has already drawn. Pick one you like and claim it. Marked pieces are taken.
          </p>
          <dl className="flex gap-8">
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
        <TodoOr className="measure mt-4" value={flashNotes.howToClaim} />
      </div>

      <ol className="mt-(--section)">
        {publishedArtists.map((a, i) => (
          <ArtistBand key={a.slug} artist={a} index={i} />
        ))}
      </ol>
    </section>
  );
}

function ArtistBand({ artist, index }: { artist: Artist; index: number }) {
  const work = portfolioFor(artist.slug)
    .filter((p) => p.kind === 'tattoo')
    .sort((a, b) => Number(Boolean(b.featured)) - Number(Boolean(a.featured)))
    .slice(0, 3);
  const flip = index % 2 === 1;
  const years = known(artist.yearsTattooing);
  return (
    <li id={`artist-${artist.slug}`} className="scroll-mt-24 border-t border-coal py-12 md:py-16">
      <div className="shell grid-page items-start gap-y-8">
        <div className={`col-span-4 md:col-span-3 lg:col-span-4 ${flip ? 'md:order-2 md:col-start-6 lg:col-start-9' : ''}`}>
          <h3 className="font-display text-[clamp(3rem,1rem+7vw,6.5rem)] leading-[0.9]">{artist.name}</h3>
          <p className="mt-3 text-small text-smoke">
            <ExternalLink className="link" href={instagramUrl(artist.instagram)}>
              @{artist.instagram}
            </ExternalLink>
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

          {isTodo(artist.bio) ? <TodoNote className="mt-6" item={artist.bio} /> : <p className="measure mt-6">{artist.bio}</p>}
          {years ? <p className="mt-3 text-smoke">{years}</p> : null}

          {artist.bioLines.length ? (
            <>
              <p className="ui mt-6 text-ash">Instagram bio</p>
              <ul className="mt-2 space-y-1 border-l border-pewter pl-4 text-small text-smoke">
                {artist.bioLines.map((line) => (
                  <li key={line}>
                    <BioLine line={line} />
                  </li>
                ))}
              </ul>
            </>
          ) : null}

          <p className="mt-6">
            <Link className="link font-semibold" to={`${contactPath}?artist=${artist.slug}`}>
              Book with {artist.name}
            </Link>
          </p>
        </div>

        <div className={`col-span-4 md:col-span-5 lg:col-span-7 ${flip ? 'md:order-1 md:col-start-1' : 'lg:col-start-6'}`}>
          <ul className="grid grid-cols-3 gap-2" aria-label={`Three pieces by ${artist.name}`}>
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
          <ArtistFlash artist={artist} />
        </div>
      </div>
    </li>
  );
}

/** Three flash designs. Entries the artist has not confirmed stay hidden (shown only in content preview). */
function ArtistFlash({ artist }: { artist: Artist }) {
  const list = (contentPreview ? flash[artist.slug] : visibleFlash(artist.slug)).slice(0, 3);
  return (
    <div role="group" aria-labelledby={`flash-${artist.slug}`} className="mt-16 md:mt-20">
      <h4 id={`flash-${artist.slug}`} className="border-b border-coal pb-4 font-serif text-h3 font-semibold">
        Flash
      </h4>
      <ul className="mt-6 grid grid-cols-2 border-l border-t border-coal md:grid-cols-3">
        {list.length ? (
          list.map((f) => <FlashCell key={f.id} entry={f} artist={artist.slug} />)
        ) : (
          [0, 1, 2].map((i) => (
            <li key={i} className="border-b border-r border-coal bg-ink">
              <PhotoTodo label={i === 0 ? `${artist.name}: flash designs` : ''} />
            </li>
          ))
        )}
      </ul>
    </div>
  );
}

function FlashCell({ entry, artist }: { entry: FlashEntry; artist: Artist['slug'] }) {
  const claimed = entry.status === 'claimed';
  return (
    <li className="flex flex-col border-b border-r border-coal bg-ink">
      <div data-reveal="cut" className={`relative ${claimed ? 'opacity-40 grayscale' : ''}`}>
        <Picture imageKey={entry.imageKey} alt={entry.alt} sizes="(min-width: 48rem) 33vw, 50vw" className="h-auto w-full" />
      </div>
      <div className="flex flex-1 flex-col gap-2 p-3 md:p-4">
        <h5 className={`font-semibold ${claimed ? 'text-ash line-through' : ''}`}>{entry.title}</h5>
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
