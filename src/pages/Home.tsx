import { Link } from 'react-router-dom';
import { Seo } from '../components/seo/Seo';
import { StudioMark } from '../components/brand/StudioMark';
import { Dagger } from '../components/brand/Dagger';
import { Picture, PhotoTodo, hasImage } from '../components/media/Picture';
import { TodoNote } from '../components/content/TodoNote';
import { ExternalLink } from '../components/layout/ExternalLink';
import { contactPath, primaryNav } from '../components/layout/nav';
import { AftercareSection } from '../components/sections/AftercareSection';
import { ArtistsSection } from '../components/sections/ArtistsSection';
import { GallerySection } from '../components/sections/GallerySection';
import { HowToBookSection } from '../components/sections/HowToBookSection';
import { PiercingSection } from '../components/sections/PiercingSection';
import { publishedArtists } from '../content/artists';
import { studio } from '../content/studio';
import { isTodo } from '../content/todo';
import { useSectionSpy } from '../lib/activeSection';
import { contentPreview, leadPiece } from '../lib/preview';
import { studioSchema } from '../lib/schema';
import { effects } from '../motion/effects';

const sectionIds = primaryNav.map((item) => item.id);

/** The hero, then the five sections in the order of the nav. The hero is not a section. */
export default function Home() {
  useSectionSpy(sectionIds);
  return (
    <>
      <Seo
        title={`${studio.legalName}, Fairland, Johannesburg`}
        description="Artist-led tattoo and piercing studio at Fairlands on 14th, Johannesburg. Five resident artists. Send a booking enquiry to the artist whose work you want."
        path="/"
        jsonLd={studioSchema()}
      />
      <Hero />
      <ArtistsSection />
      <PiercingSection />
      <HowToBookSection />
      <AftercareSection />
      <GallerySection />
    </>
  );
}

const heroArtist = publishedArtists.find((a) => a.slug === 'theshen') ?? publishedArtists[0];

function Hero() {
  const piece = heroArtist ? leadPiece(heroArtist.slug) : undefined;
  // The fan (daggers drop, circle opens) is a CSS animation: see [data-fan] in index.css.
  return (
    <div className="overflow-hidden pb-(--section)">
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
              to={contactPath}
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
              <Link className="link text-bone" to={`/#artist-${heroArtist.slug}`}>
                {heroArtist.name}
              </Link>
            </figcaption>
          ) : null}
        </figure>
      </div>
    </div>
  );
}
