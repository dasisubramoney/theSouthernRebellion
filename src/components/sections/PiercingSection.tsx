import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { DaggerRule } from '../brand/DaggerRule';
import { TodoNote } from '../content/TodoNote';
import { PortfolioGrid } from '../portfolio/PortfolioGrid';
import { SaturdaySpecial } from '../piercing/SaturdaySpecial';
import { getArtist } from '../../content/artists';
import { piercing } from '../../content/piercing';
import { isTodo, type Maybe } from '../../content/todo';
import { portfolioFor } from '../../lib/preview';

const piercingList = (
  <ul className="space-y-2">
    {piercing.services.map((g) => (
      <li key={g.area}>
        <span className="font-semibold">{g.area}:</span> {g.piercings.join(', ')}
      </li>
    ))}
  </ul>
);

const facts: { label: string; value: Maybe<ReactNode> }[] = [
  { label: 'Piercings we do', value: piercingList },
  { label: 'Prices', value: piercing.prices },
  { label: 'Jewellery', value: piercing.jewellery },
  { label: 'Age and ID', value: piercing.agePolicy },
  { label: 'Downsizing and changes', value: piercing.downsizing },
];

export function PiercingSection() {
  const piercer = getArtist(piercing.piercer);
  const work = portfolioFor(piercing.piercer).filter((p) => p.kind === 'piercing');

  return (
    <section id="piercing" aria-labelledby="piercing-heading" className="mt-(--section) scroll-mt-24">
      <div className="shell">
        <div className="grid-page items-end gap-y-8">
          <div className="col-span-4 md:col-span-6 lg:col-span-8">
            <h2 id="piercing-heading" className="font-display text-h1">
              Pierced by {piercer?.name ?? 'Rio'}
            </h2>
          </div>
          <p className="col-span-4 text-lead text-smoke md:col-span-2 lg:col-span-4">
            <span className="num font-display text-h2 text-bone">{piercing.piercingSince}</span>
            <span className="mt-2 block">
              The year {piercer?.name ?? 'Rio'} started piercing, a year before she started tattooing.{' '}
              {piercer ? (
                <Link className="link text-bone" to={`/#artist-${piercer.slug}`}>
                  {piercer.name} tattoos too
                </Link>
              ) : null}
            </span>
          </p>
        </div>
      </div>

      <SaturdaySpecial />

      <div data-ground="bone" role="group" aria-labelledby="piercing-facts" className="py-(--section)">
        <div className="shell grid-page gap-y-8">
          <h3 id="piercing-facts" className="col-span-4 font-display text-h2 md:col-span-8 lg:col-span-4">
            Before you come in
          </h3>
          <dl className="col-span-4 md:col-span-8 lg:col-span-7 lg:col-start-6">
            {facts.map((f) => (
              <div key={f.label} className="grid gap-2 border-b border-ink/20 py-5 md:grid-cols-[14rem_1fr] md:gap-6">
                <dt className="font-semibold">{f.label}</dt>
                <dd>{isTodo(f.value) ? <TodoNote item={f.value} /> : f.value}</dd>
              </div>
            ))}
          </dl>
          <p className="col-span-4 md:col-span-8 lg:col-span-7 lg:col-start-6">
            <Link className="link font-semibold" to="/#aftercare-piercing">
              Piercing aftercare
            </Link>
          </p>
        </div>
      </div>

      <div role="group" aria-labelledby="piercing-work" className="shell pt-(--section)">
        <DaggerRule className="text-ash" align="end" />
        <h3 id="piercing-work" className="mt-12 font-display text-h2">
          Recent piercings
        </h3>
        <div className="mt-8">
          {work.length ? (
            <PortfolioGrid items={work} artistName={piercer?.name ?? 'Rio'} />
          ) : (
            <TodoNote item={{ todo: 'Piercing photos with consent confirmed (faces are visible in most of them).' }} />
          )}
        </div>
      </div>
    </section>
  );
}
