import { Link, useParams } from 'react-router-dom';
import { getArtist, publishedArtists } from '../content/artists';
import { isTodo, known } from '../content/todo';
import type { Artist as ArtistType } from '../content/types';
import { Seo } from '../components/seo/Seo';
import { CornerFrame } from '../components/brand/CornerFrame';
import { BramMark } from '../components/brand/BramMark';
import { Dagger } from '../components/brand/Dagger';
import { DaggerRule } from '../components/brand/DaggerRule';
import { Picture } from '../components/media/Picture';
import { PortfolioGrid } from '../components/portfolio/PortfolioGrid';
import { BookingChannels } from '../components/booking/BookingChannels';
import { TodoNote } from '../components/content/TodoNote';
import { ExternalLink } from '../components/layout/ExternalLink';
import { instagramUrl } from '../lib/links';
import { portfolioFor } from '../lib/preview';
import { artistPerson } from '../lib/schema';
import { portfolio } from '../content/portfolio';
import NotFound from './NotFound';

export default function Artist() {
  const { slug } = useParams();
  const artist = getArtist(slug);
  if (!artist) return <NotFound />;

  const work = portfolioFor(artist.slug);
  const listed = portfolio[artist.slug]?.length ?? 0;
  const lead = artist.styles.slice(0, 2).join(' and ').toLowerCase();

  return (
    <>
      <Seo
        title={`${artist.name}, ${artist.styles[0]?.toLowerCase() ?? 'tattoo artist'}`}
        description={`${artist.name} tattoos ${lead} at The Southern Rebellion, Johannesburg. See the portfolio and send ${artist.name} a booking enquiry.`}
        path={`/artists/${artist.slug}`}
        jsonLd={{ '@context': 'https://schema.org', ...artistPerson(artist) }}
      />
      <Intro artist={artist} />

      <section aria-labelledby="work-heading" className="shell mt-(--section)">
        <div className="flex flex-wrap items-baseline justify-between gap-4 border-b border-coal pb-4">
          <h2 id="work-heading" className="font-display text-h2">
            Work by {artist.name}
          </h2>
          <ExternalLink className="link text-small" href={instagramUrl(artist.instagram)}>
            More on Instagram @{artist.instagram}
          </ExternalLink>
        </div>
        <div className="mt-8">
          {work.length ? (
            <PortfolioGrid items={work} artistName={artist.name} />
          ) : (
            <TodoNote
              item={{
                todo: `Original photos with consent confirmed. ${listed} pieces are listed for ${artist.name} in CLIENT-TODO.md.`,
              }}
            />
          )}
        </div>
      </section>

      <section aria-labelledby="book-heading" className="shell mt-(--section)">
        <DaggerRule className="text-ash" align="start" />
        <div className="grid-page mt-12 gap-y-10">
          <div className="col-span-4 md:col-span-4 lg:col-span-5">
            <h2 id="book-heading" className="font-display text-h2">
              How {artist.name} takes bookings
            </h2>
            {isTodo(artist.bookingNote) ? (
              <TodoNote className="mt-6" item={artist.bookingNote} />
            ) : (
              <p className="measure mt-6">{artist.bookingNote}</p>
            )}
          </div>
          <div className="col-span-4 md:col-span-4 lg:col-span-6 lg:col-start-7">
            <BookingChannels artist={artist} />
          </div>
        </div>
      </section>

      <NextArtist current={artist} />
    </>
  );
}

function Intro({ artist }: { artist: ArtistType }) {
  const fullName = known(artist.fullName);
  const quote = artist.introQuote;
  return (
    <section className="overflow-hidden">
      <div className="shell grid-page items-end gap-y-8 pt-10 md:pt-16">
        <div className="relative z-10 col-span-4 md:col-span-5 lg:col-span-7">
          <p className="ui text-ash">
            Resident artist{artist.pronouns ? ` · ${artist.pronouns}` : ''}
          </p>
          <h1 className="mt-4 font-display text-name lg:-mr-[30%]">{artist.name}</h1>
          {fullName && fullName !== artist.name ? <p className="mt-4 text-lead text-smoke">{fullName}</p> : null}

          <ul className="mt-8 flex flex-wrap gap-x-5 gap-y-2">
            {artist.styles.map((s) => (
              <li key={s} className="ui flex items-center gap-2 text-smoke">
                <Dagger className="h-3 w-auto text-ash" />
                {s}
              </li>
            ))}
          </ul>

          {quote ? (
            <figure className="mt-10 max-w-[36ch] border-l border-pewter pl-5">
              <blockquote className="text-lead">“{quote}”</blockquote>
              <figcaption className="mt-2 text-small text-ash">From {artist.name}’s Instagram bio</figcaption>
            </figure>
          ) : null}

          {known(artist.yearsTattooing) ? <p className="mt-6 text-smoke">{known(artist.yearsTattooing)}</p> : null}

          <div className="mt-8 space-y-3">
            {isTodo(artist.bio) ? <TodoNote item={artist.bio} /> : <p className="measure text-lead">{artist.bio}</p>}
            {isTodo(artist.yearsTattooing) ? <TodoNote item={artist.yearsTattooing} /> : null}
          </div>
        </div>

        <div className="col-span-3 col-start-2 md:col-span-3 md:col-start-6 lg:col-span-4 lg:col-start-9">
          <CornerFrame>
            {isTodo(artist.portrait) ? (
              <Picture
                imageKey={`portraits/${artist.slug}`}
                alt={`Portrait of ${artist.name}`}
                sizes="(min-width: 64rem) 30vw, 75vw"
                priority
                className="h-auto w-full grayscale"
              />
            ) : (
              <Picture
                imageKey={artist.portrait.imageKey}
                alt={artist.portrait.alt}
                sizes="(min-width: 64rem) 30vw, 75vw"
                priority
                className="h-auto w-full grayscale"
              />
            )}
          </CornerFrame>
          {artist.slug === 'bram' ? <BramMark className="mt-6 size-16 text-bone" title="Bram's mark" /> : null}
        </div>
      </div>
    </section>
  );
}

function NextArtist({ current }: { current: ArtistType }) {
  const i = publishedArtists.findIndex((a) => a.slug === current.slug);
  const next = publishedArtists[(i + 1) % publishedArtists.length];
  if (!next || next.slug === current.slug) return null;
  return (
    <section className="shell mt-(--section)">
      <Link
        to={`/artists/${next.slug}`}
        className="group flex flex-col gap-2 border-y border-coal py-10 md:flex-row md:items-end md:justify-between"
      >
        <span className="ui text-ash">Next artist</span>
        <span className="flex items-center gap-4">
          <span className="font-display text-h1 transition-transform duration-300 ease-(--ease-settle) group-hover:-translate-x-2">
            {next.name}
          </span>
          <Dagger point="right" className="h-6 w-auto" />
        </span>
      </Link>
    </section>
  );
}
