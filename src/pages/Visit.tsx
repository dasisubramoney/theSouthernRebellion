import { Seo } from '../components/seo/Seo';
import { DaggerRule } from '../components/brand/DaggerRule';
import { TodoNote, TodoOr } from '../components/content/TodoNote';
import { ContactForm } from '../components/forms/ContactForm';
import { EmailLink } from '../components/layout/EmailLink';
import { ExternalLink } from '../components/layout/ExternalLink';
import { PhotoTodo } from '../components/media/Picture';
import { studio } from '../content/studio';
import { isTodo, known } from '../content/todo';
import { instagramUrl } from '../lib/links';
import { studioSchema } from '../lib/schema';

export default function Visit() {
  const { location } = studio;
  const mapsUrl = known(location.mapsUrl);
  return (
    <>
      <Seo
        title="Visit the studio"
        description="Find The Southern Rebellion at Fairlands on 14th, Johannesburg. Address, hours, WhatsApp and email."
        path="/visit"
        jsonLd={studioSchema()}
      />

      <section className="shell pt-10 md:pt-16">
        <h1 className="font-display text-name">{location.centre}</h1>
        <p className="mt-4 text-lead text-smoke">{location.city}</p>
      </section>

      <section aria-label="Address and hours" className="shell mt-(--section)">
        <div className="grid-page gap-y-10">
          <div className="col-span-4 md:col-span-4 lg:col-span-5">
            <h2 className="ui text-ash">Address</h2>
            <address className="mt-4 not-italic">
              <p>{location.centre}</p>
              {known(location.street) ? <p>{known(location.street)}</p> : null}
              <p>{location.city}</p>
            </address>
            <div className="mt-4 space-y-3">
              {isTodo(location.street) ? <TodoNote item={location.street} /> : null}
              {isTodo(location.areaName) ? <TodoNote item={location.areaName} /> : null}
            </div>

            <h2 className="ui mt-12 text-ash">Hours</h2>
            <TodoOr className="mt-4" value={studio.hours} />

            <h2 className="ui mt-12 text-ash">Parking and getting in</h2>
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
      </section>

      <section data-ground="bone" aria-labelledby="talk-heading" className="mt-(--section) py-(--section)">
        <div className="shell grid-page gap-y-8">
          <h2 id="talk-heading" className="col-span-4 md:col-span-8 lg:col-span-5">
            <span className="ui block text-iron">Studio phone and WhatsApp</span>
            <span className="num mt-3 block font-display text-h2">{studio.phoneDisplay}</span>
          </h2>
          <ul className="col-span-4 space-y-4 text-lead md:col-span-8 lg:col-span-6 lg:col-start-7">
            <li>
              <ExternalLink className="link font-semibold" href={studio.whatsapp}>
                WhatsApp <span className="num">{studio.phoneDisplay}</span>
              </ExternalLink>
            </li>
            <li>
              <EmailLink className="link" {...studio.email} />
            </li>
            <li>
              <ExternalLink className="link" href={instagramUrl(studio.instagram)}>
                Instagram @{studio.instagram}
              </ExternalLink>
            </li>
          </ul>
        </div>
      </section>

      <section aria-labelledby="question-heading" className="shell pt-(--section)">
        <DaggerRule className="text-ash" align="start" />
        <div className="grid-page mt-12 gap-y-8">
          <div className="col-span-4 md:col-span-8 lg:col-span-4">
            <h2 id="question-heading" className="font-display text-h2">
              Ask the studio something
            </h2>
            <p className="measure mt-4 text-smoke">For anything that isn’t a booking.</p>
          </div>
          <div className="col-span-4 md:col-span-8 lg:col-span-7 lg:col-start-6">
            <ContactForm />
          </div>
        </div>
      </section>
    </>
  );
}
