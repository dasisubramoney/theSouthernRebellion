import { Link } from 'react-router-dom';
import { Seo } from '../components/seo/Seo';
import { DaggerRule } from '../components/brand/DaggerRule';
import { TodoNote } from '../components/content/TodoNote';
import { PortfolioGrid } from '../components/portfolio/PortfolioGrid';
import { SaturdaySpecial } from '../components/piercing/SaturdaySpecial';
import { getArtist } from '../content/artists';
import { piercing } from '../content/piercing';
import { isTodo, type Maybe } from '../content/todo';
import { portfolioFor } from '../lib/preview';

const facts: { label: string; value: Maybe<string> }[] = [
  { label: 'Piercings and prices', value: piercing.services },
  { label: 'Jewellery', value: piercing.jewellery },
  { label: 'Age and ID', value: piercing.agePolicy },
  { label: 'Downsizing and changes', value: piercing.downsizing },
];

export default function Piercing() {
  const piercer = getArtist(piercing.piercer);
  const work = portfolioFor(piercing.piercer).filter((p) => p.kind === 'piercing');

  return (
    <>
      <Seo
        title="Piercing"
        description={`Body piercing at The Southern Rebellion, Johannesburg, with Rio, a body piercer since ${piercing.piercingSince}. Saturday piercing special and jewellery information.`}
        path="/piercing"
      />

      <section className="shell pt-10 md:pt-16">
        <div className="grid-page items-end gap-y-8">
          <div className="col-span-4 md:col-span-6 lg:col-span-8">
            <h1 className="font-display text-h1">Pierced by {piercer?.name ?? 'Rio'}</h1>
          </div>
          <p className="col-span-4 text-lead text-smoke md:col-span-2 lg:col-span-4">
            <span className="num font-display text-h2 text-bone">{piercing.piercingSince}</span>
            <span className="mt-2 block">
              The year {piercer?.name ?? 'Rio'} started piercing, a year before she started tattooing.{' '}
              {piercer ? (
                <Link className="link text-bone" to={`/artists/${piercer.slug}`}>
                  {piercer.name} tattoos too
                </Link>
              ) : null}
            </span>
          </p>
        </div>
      </section>

      <SaturdaySpecial />

      <section data-ground="bone" aria-labelledby="piercing-facts" className="py-(--section)">
        <div className="shell grid-page gap-y-8">
          <h2 id="piercing-facts" className="col-span-4 font-display text-h2 md:col-span-8 lg:col-span-4">
            Before you come in
          </h2>
          <dl className="col-span-4 md:col-span-8 lg:col-span-7 lg:col-start-6">
            {facts.map((f) => (
              <div key={f.label} className="grid gap-2 border-b border-ink/20 py-5 md:grid-cols-[14rem_1fr] md:gap-6">
                <dt className="font-semibold">{f.label}</dt>
                <dd>{isTodo(f.value) ? <TodoNote item={f.value} /> : f.value}</dd>
              </div>
            ))}
          </dl>
          <p className="col-span-4 md:col-span-8 lg:col-span-7 lg:col-start-6">
            <Link className="link font-semibold" to="/aftercare#piercing">
              Piercing aftercare
            </Link>
          </p>
        </div>
      </section>

      <section aria-labelledby="piercing-work" className="shell pt-(--section)">
        <DaggerRule className="text-ash" align="end" />
        <h2 id="piercing-work" className="mt-12 font-display text-h2">
          Recent piercings
        </h2>
        <div className="mt-8">
          {work.length ? (
            <PortfolioGrid items={work} artistName={piercer?.name ?? 'Rio'} />
          ) : (
            <TodoNote item={{ todo: 'Piercing photos with consent confirmed (faces are visible in most of them).' }} />
          )}
        </div>
      </section>
    </>
  );
}
