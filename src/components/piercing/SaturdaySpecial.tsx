import { Link } from 'react-router-dom';
import { piercing } from '../../content/piercing';
import { isTodo } from '../../content/todo';
import { EmailLink } from '../layout/EmailLink';
import { TodoNote } from '../content/TodoNote';

/**
 * The Saturday piercing special, from the studio's flyer (a group inside the piercing section). Renders nothing when
 * `piercing.special.enabled` is false.
 */
export function SaturdaySpecial({ id = 'special' }: { id?: string }) {
  const s = piercing.special;
  if (!s.enabled) return null;
  return (
    <div id={id} role="group" aria-labelledby={`${id}-heading`} className="shell scroll-mt-24 py-(--section)">
      <div className="grid-page gap-y-8">
        <div className="col-span-4 md:col-span-4 lg:col-span-5">
          <h3 id={`${id}-heading`} className="font-display text-h2">
            Saturday piercing special
          </h3>
          <dl className="mt-8 grid grid-cols-[6rem_1fr] gap-y-3 border-t border-coal pt-6">
            <dt className="ui pt-1 text-ash">When</dt>
            <dd className="num">Every {s.day}, 10am to 5pm</dd>
            <dt className="ui pt-1 text-ash">What</dt>
            <dd>{s.offer}</dd>
            <dt className="ui pt-1 text-ash">Jewellery</dt>
            <dd>{s.jewelleryWording}</dd>
          </dl>
          <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-4">
            <Link
              to="/contact?artist=piercing"
              className="ui inline-flex items-center gap-3 border border-bone px-5 py-4 transition-colors duration-200 hover:bg-bone hover:text-ink"
            >
              Book a Saturday piercing
            </Link>
            <span className="text-small text-ash">
              or email <EmailLink className="link text-bone" {...s.bookingEmail} subject="Saturday piercing special" />
            </span>
          </div>
          <div className="mt-6 space-y-3">
            {isTodo(s.confirmedForLaunch) ? <TodoNote item={s.confirmedForLaunch} /> : null}
            {isTodo(s.whichPiercingsCount) ? <TodoNote item={s.whichPiercingsCount} /> : null}
          </div>
        </div>
        <p
          className="col-span-4 self-center font-display text-[clamp(6rem,2rem+22vw,20rem)] leading-[0.8] md:col-span-4 md:text-right lg:col-span-7"
          aria-hidden="true"
        >
          R{s.priceZar}
        </p>
        <p className="visually-hidden">
          Price: R{s.priceZar} for {s.offer.toLowerCase()}.
        </p>
      </div>
    </div>
  );
}
