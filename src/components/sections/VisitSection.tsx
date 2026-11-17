import { Link } from 'react-router-dom';
import { Dagger } from '../brand/Dagger';
import { TodoNote, TodoOr } from '../content/TodoNote';
import { contactPath } from '../layout/nav';
import { ExternalLink } from '../layout/ExternalLink';
import { PhotoTodo } from '../media/Picture';
import { studio } from '../../content/studio';
import { isTodo, known } from '../../content/todo';

/**
 * Address, hours, parking and the map. WhatsApp, email and Instagram are in the footer on
 * every page, so they are not repeated here.
 */
export function VisitSection() {
  const { location } = studio;
  const mapsUrl = known(location.mapsUrl);
  return (
    <section id="visit" aria-labelledby="visit-heading" className="mt-(--section) scroll-mt-24">
      <div className="shell">
        <h2 id="visit-heading" className="font-display text-name">
          {location.centre}
        </h2>
        <p className="mt-4 text-lead text-smoke">{location.city}</p>
      </div>

      <div className="shell mt-(--section)">
        <div className="grid-page gap-y-10">
          <div className="col-span-4 md:col-span-4 lg:col-span-5">
            <h3 className="ui text-ash">Address</h3>
            <address className="mt-4 not-italic">
              <p>{location.centre}</p>
              {known(location.street) ? <p>{known(location.street)}</p> : null}
              <p>{location.city}</p>
            </address>
            <div className="mt-4 space-y-3">
              {isTodo(location.street) ? <TodoNote item={location.street} /> : null}
              {isTodo(location.areaName) ? <TodoNote item={location.areaName} /> : null}
            </div>

            <h3 className="ui mt-12 text-ash">Hours</h3>
            <TodoOr className="mt-4" value={studio.hours} />

            <h3 className="ui mt-12 text-ash">Parking and getting in</h3>
            <TodoOr className="mt-4" value={location.parking} />
          </div>

          <div className="col-span-4 md:col-span-4 lg:col-span-6 lg:col-start-7">
            {mapsUrl ? (
              <ExternalLink href={mapsUrl} className="block">
                <PhotoTodo aspect="square" label="Static map image of the studio" />
                <span className="link mt-3 inline-block">Open in Google Maps</span>
              </ExternalLink>
            ) : (
              <>
                <PhotoTodo aspect="square" label="Static map image (no third-party map embed, so no tracking)" />
                {isTodo(location.mapsUrl) ? <TodoNote className="mt-3" item={location.mapsUrl} /> : null}
              </>
            )}
          </div>
        </div>

        <p className="mt-12">
          <Link
            to={contactPath}
            className="ui inline-flex items-center gap-3 bg-bone px-5 py-4 text-ink transition-colors duration-200 hover:bg-smoke"
          >
            Send a booking enquiry
            <Dagger point="right" className="h-3 w-auto" />
          </Link>
        </p>
      </div>
    </section>
  );
}
