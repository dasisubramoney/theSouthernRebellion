import { Link } from 'react-router-dom';
import { Seo } from '../components/seo/Seo';
import { StepList } from '../components/booking/StepList';
import { TodoNote } from '../components/content/TodoNote';
import { BookingForm } from '../components/forms/BookingForm';
import { ExternalLink } from '../components/layout/ExternalLink';
import { booking } from '../content/booking';
import { studio } from '../content/studio';
import { isTodo, type Maybe } from '../content/todo';

const policyRows: { label: string; value: Maybe<string> }[] = [
  { label: 'Deposits', value: booking.policies.deposits },
  { label: 'Design fees', value: booking.policies.designFee },
  { label: 'Design time', value: booking.policies.designTime },
  { label: 'Moving your appointment', value: booking.policies.reschedule },
  { label: 'If you miss it', value: booking.policies.noShow },
  { label: 'Shop minimum', value: booking.policies.minimum },
  { label: 'Day rates', value: booking.policies.dayRates },
  { label: 'Age and ID', value: booking.policies.age },
  { label: 'Cover-ups and reworks', value: booking.policies.coverUps },
  { label: 'Paying on the day', value: booking.policies.payment },
];

export default function Book() {
  return (
    <>
      <Seo
        title="How to book"
        description="How booking works at The Southern Rebellion, Johannesburg: send an enquiry to the artist you want, agree on the design, pay the deposit, then come in for your session."
        path="/book"
      />

      <section className="shell pt-10 md:pt-16">
        <div className="grid-page gap-y-10">
          <div className="col-span-4 md:col-span-8 lg:col-span-5">
            <h1 className="font-display text-h1">How to book</h1>
            <p className="measure mt-6 text-lead text-smoke">{booking.primaryRoute}</p>
            <p className="mt-6">
              <a className="link font-semibold" href="#enquiry">
                Skip to the enquiry form
              </a>
            </p>
          </div>
          <div className="col-span-4 md:col-span-8 lg:col-span-6 lg:col-start-7 lg:pt-24">
            <StepList steps={booking.steps} level={2} />
          </div>
        </div>
      </section>

      <section data-ground="bone" aria-labelledby="policy-heading" className="mt-(--section) py-(--section)">
        <div className="shell grid-page gap-y-8">
          <h2 id="policy-heading" className="col-span-4 font-display text-h2 md:col-span-8 lg:col-span-4">
            Deposits, reschedules and age
          </h2>
          <dl className="col-span-4 md:col-span-8 lg:col-span-7 lg:col-start-6">
            {policyRows.map((row) => (
              <div key={row.label} className="grid gap-2 border-b border-ink/20 py-5 md:grid-cols-[14rem_1fr] md:gap-6">
                <dt className="font-semibold">{row.label}</dt>
                <dd>{isTodo(row.value) ? <TodoNote item={row.value} /> : row.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section id="enquiry" aria-labelledby="enquiry-heading" className="shell scroll-mt-24 pt-(--section)">
        <div className="grid-page gap-y-10">
          <div className="col-span-4 md:col-span-8 lg:col-span-4">
            <h2 id="enquiry-heading" className="font-display text-h2">
              Send a booking enquiry
            </h2>
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
              <Link className="link text-bone" to="/piercing#special">
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
    </>
  );
}
