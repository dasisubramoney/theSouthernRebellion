import { Link } from 'react-router-dom';
import { StepList } from '../booking/StepList';
import { Dagger } from '../brand/Dagger';
import { TodoNote } from '../content/TodoNote';
import { contactPath } from '../layout/nav';
import { booking } from '../../content/booking';
import { isTodo, type Maybe } from '../../content/todo';
import { press } from '../../lib/press';

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

export function HowToBookSection() {
  return (
    <section id="how-to-book" aria-labelledby="how-to-book-heading" className="mt-(--section) scroll-mt-24">
      <div className="shell">
        <div className="grid-page gap-y-10">
          <div className="col-span-4 md:col-span-8 lg:col-span-5">
            <h2 id="how-to-book-heading" className="font-display text-h1">
              How to book
            </h2>
            <p className="measure mt-6 text-lead text-smoke">{booking.primaryRoute}</p>
            <p className="mt-6">
              <Link className="link font-semibold" to={contactPath}>
                Skip to the enquiry form
              </Link>
            </p>
          </div>
          <div className="col-span-4 md:col-span-8 lg:col-span-6 lg:col-start-7 lg:pt-24">
            <StepList steps={booking.steps} />
          </div>
        </div>
      </div>

      <div data-ground="bone" role="group" aria-labelledby="policy-heading" className="mt-(--section) py-(--section)">
        <div className="shell grid-page gap-y-8">
          <h3 id="policy-heading" className="col-span-4 font-display text-h2 md:col-span-8 lg:col-span-4">
            Deposits, reschedules and age
          </h3>
          <dl className="col-span-4 md:col-span-8 lg:col-span-7 lg:col-start-6">
            {policyRows.map((row) => (
              <div key={row.label} className="grid gap-2 border-b border-ink/20 py-5 md:grid-cols-[14rem_1fr] md:gap-6">
                <dt className="font-semibold">{row.label}</dt>
                <dd>{isTodo(row.value) ? <TodoNote item={row.value} /> : row.value}</dd>
              </div>
            ))}
          </dl>
          <p className="col-span-4 md:col-span-8 lg:col-span-7 lg:col-start-6">
            <Link
              to={contactPath}
              className={`ui inline-flex items-center gap-3 bg-ink px-5 py-4 text-bone hover:bg-iron ${press}`}
            >
              Send a booking enquiry
              <Dagger point="right" className="h-3 w-auto" />
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
}
