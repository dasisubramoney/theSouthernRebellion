import { useState } from 'react';
import { TodoNote } from '../content/TodoNote';
import { PortfolioGrid } from '../portfolio/PortfolioGrid';
import { publishedArtists } from '../../content/artists';
import { portfolio } from '../../content/portfolio';
import type { ArtistSlug, PortfolioEntry } from '../../content/types';
import { portfolioFor } from '../../lib/preview';

/** How many pieces show at first, and how many each "Show more" adds. */
const PAGE = 12;

/** Takes one piece from each list in turn, so the first screen shows several artists, not just one. */
function interleave(lists: PortfolioEntry[][]) {
  const out: PortfolioEntry[] = [];
  const longest = Math.max(0, ...lists.map((l) => l.length));
  for (let i = 0; i < longest; i++) {
    for (const l of lists) {
      const piece = l[i];
      if (piece) out.push(piece);
    }
  }
  return out;
}

/** The artist's name for a piece, read from its image key (portfolio/<artist>/<id>). */
const artistOf = (p: PortfolioEntry) => publishedArtists.find((a) => p.imageKey.startsWith(`portfolio/${a.slug}/`))?.name;

const featuredFirst = (a: PortfolioEntry, b: PortfolioEntry) => Number(Boolean(b.featured)) - Number(Boolean(a.featured));

/**
 * Tattoos from every artist (piercings are in the Piercing section). Only pieces whose client has
 * agreed (POPIA) show; see src/content/portfolio.ts.
 */
export function GallerySection() {
  const [only, setOnly] = useState<ArtistSlug | 'all'>('all');
  const [limit, setLimit] = useState(PAGE);

  const withWork = publishedArtists
    .map((a) => ({ artist: a, items: portfolioFor(a.slug).filter((p) => p.kind === 'tattoo') }))
    .filter((x) => x.items.length > 0);
  // Sorted once over the whole list, so "Show more" only ever adds to the end.
  const items = interleave(withWork.filter((x) => only === 'all' || x.artist.slug === only).map((x) => x.items)).sort(featuredFirst);
  const listed = publishedArtists.reduce((n, a) => n + (portfolio[a.slug]?.filter((p) => p.kind === 'tattoo').length ?? 0), 0);

  return (
    <section id="gallery" aria-labelledby="gallery-heading" className="mt-(--section) scroll-mt-24">
      <div className="shell">
        <h2 id="gallery-heading" className="font-display text-h1">
          Gallery
        </h2>

        {withWork.length > 1 ? (
          <nav aria-label="Filter the gallery by artist" className="mt-8">
            <ul className="flex flex-wrap gap-2">
              {[{ slug: 'all' as const, name: 'All artists' }, ...withWork.map((x) => x.artist)].map((a) => (
                <li key={a.slug}>
                  <button
                    type="button"
                    aria-pressed={only === a.slug}
                    onClick={() => {
                      setOnly(a.slug);
                      setLimit(PAGE);
                    }}
                    className="ui border border-pewter px-4 py-3 aria-pressed:border-bone aria-pressed:bg-bone aria-pressed:text-ink"
                  >
                    {a.name}
                  </button>
                </li>
              ))}
            </ul>
          </nav>
        ) : null}

        <div className="mt-8">
          {items.length ? (
            <>
              <PortfolioGrid items={items.slice(0, limit)} label="Gallery" byline={artistOf} keepOrder />
              {items.length > limit ? (
                <p className="mt-8">
                  <button
                    type="button"
                    onClick={() => setLimit((n) => n + PAGE)}
                    className="ui border border-bone px-6 py-4 transition-colors duration-200 hover:bg-bone hover:text-ink"
                  >
                    Show more
                  </button>
                </p>
              ) : null}
            </>
          ) : (
            <TodoNote item={{ todo: `Original photos with consent confirmed. ${listed} pieces are listed in CLIENT-TODO.md.` }} />
          )}
        </div>
      </div>
    </section>
  );
}
