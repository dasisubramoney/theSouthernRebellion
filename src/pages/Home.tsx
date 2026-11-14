import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Seo } from '../components/seo/Seo';
import { StudioMark } from '../components/brand/StudioMark';
import { Dagger } from '../components/brand/Dagger';
import { DaggerRule } from '../components/brand/DaggerRule';
import { Picture, PhotoTodo, hasImage } from '../components/media/Picture';
import { StepList } from '../components/booking/StepList';
import { SaturdaySpecial } from '../components/piercing/SaturdaySpecial';
import { TodoNote, TodoOr } from '../components/content/TodoNote';
import { EmailLink } from '../components/layout/EmailLink';
import { ExternalLink } from '../components/layout/ExternalLink';
import { publishedArtists } from '../content/artists';
import { booking } from '../content/booking';
import { studio } from '../content/studio';
import { isTodo } from '../content/todo';
import type { Artist } from '../content/types';
import { contentPreview, leadPiece } from '../lib/preview';
import { studioSchema } from '../lib/schema';
import { effects } from '../motion/effects';

export default function Home() {
  return (
    <>
      <Seo
        title="The Southern Rebellion Tattoo Company, Fairland, Johannesburg"
        description="Artist-led tattoo and piercing studio at Fairlands on 14th, Johannesburg. Five resident artists. Send a booking enquiry to the artist whose work you want."
        path="/"
        jsonLd={studioSchema()}
      />
      <Hero />
      <Roster />
      <Booking />
      <SaturdaySpecial />
      <div className="shell">
        <DaggerRule className="text-ash" align="start" />
      </div>
      <Visit />
    </>
  );
}

const heroArtist = publishedArtists.find((a) => a.slug === 'theshen') ?? publishedArtists[0];

function Hero() {
  const piece = heroArtist ? leadPiece(heroArtist.slug) : undefined;
  // The fan (daggers drop, circle opens) is a CSS animation: see [data-fan] in index.css.
  return (
    <section className="overflow-hidden pb-(--section)">
      <div className="shell grid-page items-end gap-y-10 pt-10 md:pt-16">
        <div className="col-span-4 md:col-span-5 lg:col-span-6 lg:pb-16">
          <p className="ui text-ash">Tattoo and piercing · {studio.location.centre}, Johannesburg</p>
          <h1 className="mt-5 font-display text-h1">{studio.tagline.text}</h1>
          {contentPreview && isTodo(studio.tagline.source) ? (
            <TodoNote className="mt-4" item={studio.tagline.source} />
          ) : null}
          <p className="measure mt-6 text-lead text-smoke">
            Five resident artists, each with their own style and their own book. Find work you like and send that artist
            your idea.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-4">
            <Link
              to="/book#enquiry"
              className="ui inline-flex items-center gap-3 bg-bone px-5 py-4 text-ink transition-colors duration-200 hover:bg-smoke"
            >
              Send a booking enquiry
              <Dagger point="right" className="h-3 w-auto" />
            </Link>
            <ExternalLink href={studio.whatsapp} className="link">
              WhatsApp the studio
            </ExternalLink>
          </div>
        </div>

        <figure className="relative col-span-4 -mr-[18%] md:col-span-3 md:-mr-[30%] lg:col-span-6 lg:mr-[-8%]">
          <div data-fan={effects.fan ? 'disc' : undefined} className="relative aspect-square overflow-hidden [clip-path:circle(50%)]">
            {piece && hasImage(piece.imageKey) ? (
              <Picture
                imageKey={piece.imageKey}
                alt={piece.alt}
                sizes="(min-width: 64rem) 50vw, 100vw"
                priority
                className="size-full object-cover"
              />
            ) : piece ? (
              <PhotoTodo aspect="square" label={piece.alt} />
            ) : (
              <PhotoTodo aspect="square" label="Healed piece for the hero" />
            )}
          </div>
          <StudioMark animated={effects.fan} className="absolute -bottom-2 left-0 size-20 text-bone md:size-28" title="Studio mark" />
          {piece && heroArtist ? (
            <figcaption className="mt-4 pl-24 text-small text-ash md:pl-32">
              {piece.style} by{' '}
              <Link className="link text-bone" to={`/artists/${heroArtist.slug}`}>
                {heroArtist.name}
              </Link>
            </figcaption>
          ) : null}
        </figure>
      </div>
    </section>
  );
}

function Roster() {
  const [active, setActive] = useState(publishedArtists[0]?.slug);
  return (
    <section aria-labelledby="roster-heading" className="shell">
      <div className="grid-page gap-y-8">
        <div className="col-span-4 md:col-span-8 lg:col-span-7">
          <div className="flex items-baseline justify-between gap-4 border-b border-coal pb-4">
            <h2 id="roster-heading" className="ui text-ash">
              Resident artists
            </h2>
            <Link to="/artists" className="link text-small">
              All artists
            </Link>
          </div>
          <ol>
            {publishedArtists.map((a) => (
              <RosterRow key={a.slug} artist={a} onActive={() => setActive(a.slug)} active={active === a.slug} />
            ))}
          </ol>
        </div>

        <div className="relative hidden lg:col-span-4 lg:col-start-9 lg:block" aria-hidden="true">
          <div className="sticky top-24">
            <div className="relative aspect-[4/5]">
              {publishedArtists.map((a) => {
                const p = leadPiece(a.slug);
                return (
                  <div
                    key={a.slug}
                    className={`absolute inset-0 transition-opacity duration-300 ${active === a.slug ? 'opacity-100' : 'opacity-0'}`}
                  >
                    {p ? (
                      <Picture imageKey={p.imageKey} alt="" sizes="30vw" className="h-auto w-full" />
                    ) : (
                      <PhotoTodo label={`${a.name}: lead piece`} />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function RosterRow({ artist, active, onActive }: { artist: Artist; active: boolean; onActive: () => void }) {
  const p = leadPiece(artist.slug);
  return (
    <li className="border-b border-coal">
      <Link
        to={`/artists/${artist.slug}`}
        onMouseEnter={onActive}
        onFocus={onActive}
        className="group grid grid-cols-[minmax(0,1fr)_5.5rem] items-center gap-x-4 py-5 md:grid-cols-[minmax(0,1fr)_7rem] lg:grid-cols-[minmax(0,1fr)]"
      >
        <span>
          <span className="flex items-center gap-3">
            <span className="font-display text-[clamp(2.25rem,1rem+6vw,4.5rem)] leading-[0.95] transition-transform duration-300 ease-(--ease-settle) lg:text-[clamp(4rem,1rem+5vw,7rem)] lg:group-hover:translate-x-2">
              {artist.name}
            </span>
            <Dagger
              point="left"
              className={`hidden h-6 w-auto transition-opacity duration-200 lg:block ${active ? 'opacity-100' : 'opacity-0'}`}
            />
          </span>
          <span className="mt-2 block text-small text-ash">{artist.styles.slice(0, 3).join(' · ')}</span>
          <span className="mt-1 block text-small text-smoke">@{artist.instagram}</span>
        </span>
        <span className="relative lg:hidden">
          {p && hasImage(p.imageKey) ? (
            <Picture imageKey={p.imageKey} alt="" sizes="7rem" className="h-auto w-full" />
          ) : (
            <span className="block aspect-[4/5] w-full border border-dashed border-pewter bg-soot" />
          )}
        </span>
      </Link>
    </li>
  );
}

function Booking() {
  return (
    <section data-ground="bone" aria-labelledby="booking-heading" className="mt-(--section) py-(--section)">
      <div className="shell grid-page gap-y-10">
        <div className="col-span-4 md:col-span-8 lg:col-span-4">
          <h2 id="booking-heading" className="font-display text-h2">
            {booking.steps.length} steps from enquiry to the chair
          </h2>
          <p className="measure mt-6">
            First time? This is the whole process. Every enquiry goes to the artist you pick. Not sure who suits your idea?
            Choose “{booking.form.unsureLabel}” and the studio will point you to the right artist.
          </p>
          <Link to="/book" className="link mt-6 inline-block font-semibold">
            Deposits, reschedules and age policy
          </Link>
        </div>
        <div className="col-span-4 md:col-span-8 lg:col-span-7 lg:col-start-6">
          <StepList steps={booking.steps} />
        </div>
      </div>
    </section>
  );
}

function Visit() {
  return (
    <section aria-labelledby="visit-heading" className="shell pt-(--section)">
      <div className="grid-page gap-y-10">
        <div className="col-span-4 md:col-span-8 lg:col-span-7">
          <h2 id="visit-heading" className="font-display text-h1">
            {studio.location.centre}
          </h2>
          <p className="mt-3 text-lead text-smoke">{studio.location.city}</p>
        </div>
        <div className="col-span-4 space-y-6 md:col-span-4 lg:col-span-4 lg:col-start-9 lg:pt-10">
          <TodoOr value={studio.location.street} />
          <TodoOr value={studio.hours} />
          <ul className="space-y-2">
            <li>
              <ExternalLink className="link" href={studio.whatsapp}>
                WhatsApp <span className="num">{studio.phoneDisplay}</span>
              </ExternalLink>
            </li>
            <li>
              <EmailLink className="link" {...studio.email} />
            </li>
            <li>
              <Link className="link" to="/visit">
                Directions and parking
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
}
