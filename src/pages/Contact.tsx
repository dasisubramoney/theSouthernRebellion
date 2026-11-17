import { Link } from 'react-router-dom';
import { Seo } from '../components/seo/Seo';
import { DaggerRule } from '../components/brand/DaggerRule';
import { BookingForm } from '../components/forms/BookingForm';
import { ContactForm } from '../components/forms/ContactForm';
import { EmailLink } from '../components/layout/EmailLink';
import { ExternalLink } from '../components/layout/ExternalLink';
import { contactPath } from '../components/layout/nav';
import { studio } from '../content/studio';
import { instagramUrl } from '../lib/links';

export default function Contact() {
  return (
    <>
      <Seo
        title="Send a booking enquiry"
        description={`Send ${studio.name} a booking enquiry for a tattoo or piercing, or ask a question. WhatsApp and email also work.`}
        path={contactPath}
      />

      <section id="enquiry" aria-labelledby="enquiry-heading" className="shell scroll-mt-24 pt-10 md:pt-16">
        <div className="grid-page gap-y-10">
          <div className="col-span-4 md:col-span-8 lg:col-span-4">
            <h1 id="enquiry-heading" className="font-display text-h2">
              Send a booking enquiry
            </h1>
            <p className="measure mt-6 text-smoke">
              Fill in what you know. If you are not sure about size or colour yet, leave it and the artist will help you
              decide.
            </p>
            <p className="mt-6 text-small text-ash">
              Prefer to talk first?{' '}
              <ExternalLink className="link text-bone" href={studio.whatsapp}>
                WhatsApp the studio on <span className="num">{studio.phoneDisplay}</span>
              </ExternalLink>
              .
            </p>
            <p className="mt-3 text-small text-ash">
              Booking a piercing on a Saturday?{' '}
              <Link className="link text-bone" to="/#special">
                See the Saturday special
              </Link>
              .
            </p>
          </div>
          <div className="col-span-4 md:col-span-8 lg:col-span-7 lg:col-start-6">
            <BookingForm />
          </div>
        </div>
      </section>

      <section aria-labelledby="question-heading" className="shell pt-(--section)">
        <DaggerRule className="text-ash" align="start" />
        <div className="grid-page mt-12 gap-y-8">
          <div className="col-span-4 md:col-span-8 lg:col-span-4">
            <h2 id="question-heading" className="font-display text-h2">
              Just have a question?
            </h2>
            <p className="measure mt-4 text-smoke">For anything that isn’t a booking.</p>
          </div>
          <div className="col-span-4 md:col-span-8 lg:col-span-7 lg:col-start-6">
            <ContactForm />
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
    </>
  );
}
