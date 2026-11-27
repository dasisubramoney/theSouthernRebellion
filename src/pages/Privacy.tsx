import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { Seo } from '../components/seo/Seo';
import { TodoNote, TodoOr } from '../components/content/TodoNote';
import { EmailLink } from '../components/layout/EmailLink';
import { ExternalLink } from '../components/layout/ExternalLink';
import { studio } from '../content/studio';
import { isTodo } from '../content/todo';

function Block({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="border-t border-ink/20 py-8">
      <h2 className="font-serif text-h3 font-semibold">{title}</h2>
      <div className="measure mt-3 space-y-3">{children}</div>
    </section>
  );
}

/**
 * POPIA notice. Describes only what this site actually does. Have it reviewed
 * before launch: it is a draft, not legal advice.
 */
export default function Privacy() {
  const { privacy } = studio;
  return (
    <>
      <Seo
        title="Privacy"
        description="How The Southern Rebellion collects, uses and protects your personal information under POPIA."
        path="/privacy"
      />
      <div data-ground="bone" className="pb-(--section)">
        <section className="shell pt-10 md:pt-16">
          <div className="grid-page gap-y-8">
            <div className="col-span-4 md:col-span-8 lg:col-span-4">
              <h1 className="font-display text-h1">Your information</h1>
              <p className="mt-6 text-iron">
                This notice covers this website and the enquiries sent through it, under the Protection of Personal
                Information Act (POPIA).
              </p>
              <TodoNote className="mt-6" item={{ todo: 'Have this notice reviewed before launch. It is a draft based on how the site works, not legal advice.' }} />
            </div>

            <div className="col-span-4 md:col-span-8 lg:col-span-7 lg:col-start-6">
              <Block title="Who is responsible">
                <p>
                  {studio.legalName}, {studio.location.street}, {studio.location.areaName}, {studio.location.postalCode}.
                </p>
                {isTodo(privacy.informationOfficer) ? <TodoNote item={privacy.informationOfficer} /> : <p>{privacy.informationOfficer}</p>}
                <TodoOr value={studio.registrationNumber}>{(n) => <p>Registration number: {n}</p>}</TodoOr>
              </Block>

              <Block title="What we collect">
                <p>
                  Only what you type into the booking enquiry or contact form: your name, email address, WhatsApp number if
                  you add it, the details of the tattoo or piercing you want, and any reference images you upload. You also
                  confirm your age.
                </p>
                <p>Reference images can show your body, existing tattoos or your face. We treat them as personal information.</p>
              </Block>

              <Block title="Why we use it">
                <p>
                  To reply to your enquiry, plan your design and book your appointment. We do not use it for marketing and we
                  do not sell it.
                </p>
              </Block>

              <Block title="Who sees it">
                <p>
                  The artist you choose, and studio staff who handle bookings. If you choose “Not sure, help me choose”, the
                  studio reads it and passes it to the right artist.
                </p>
              </Block>

              <Block title="Where it is stored">
                <p>
                  Form submissions, including any images you upload, are received and stored by Netlify, the US company that
                  hosts this website, so your information may be stored outside South Africa.
                </p>
              </Block>

              <Block title="How long we keep it">
                {isTodo(privacy.retention) ? <TodoNote item={privacy.retention} /> : <p>{privacy.retention}</p>}
              </Block>

              <Block title="Photos of your tattoo or piercing">
                <p>
                  We only put a photo of your tattoo or piercing on this website if you have agreed to it. You can ask us to
                  take it down at any time.
                </p>
              </Block>

              <Block title="Tracking and cookies">
                <p>
                  This website has no analytics, advertising trackers or social media widgets, and sets no cookies. If you
                  switch off motion in the footer, your browser remembers that choice on your device only.
                </p>
                <p>
                  Links to Instagram and WhatsApp take you to those services, which have their own privacy policies.
                </p>
              </Block>

              <Block title="Your rights">
                <p>
                  You can ask what information we hold about you, ask us to correct or delete it, or object to how we use it.
                  Email <EmailLink className="link font-semibold" {...studio.email} subject="Privacy request" />.
                </p>
                <p>
                  If you are not happy with how we handle it, you can complain to the{' '}
                  <ExternalLink className="link font-semibold" href="https://inforegulator.org.za/">
                    Information Regulator
                  </ExternalLink>
                  .
                </p>
              </Block>

              <p className="border-t border-ink/20 pt-8">
                <Link className="link font-semibold" to="/contact#enquiry">
                  Back to the booking form
                </Link>
              </p>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
