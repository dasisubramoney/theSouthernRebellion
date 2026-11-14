import { Link } from 'react-router-dom';
import type { Artist } from '../../content/types';
import { instagramUrl, whatsappUrl } from '../../lib/links';
import { Dagger } from '../brand/Dagger';
import { EmailLink } from '../layout/EmailLink';
import { ExternalLink } from '../layout/ExternalLink';

/** The ways to book one artist. The site form first, then the artist's own channels. */
export function BookingChannels({ artist }: { artist: Artist }) {
  const others = artist.booking.filter((c) => c.kind !== 'form');
  return (
    <div>
      <Link
        to={`/book?artist=${artist.slug}#enquiry`}
        className="ui inline-flex items-center gap-3 bg-bone px-5 py-4 text-ink transition-colors duration-200 hover:bg-smoke"
      >
        Send {artist.name} a booking enquiry
        <Dagger point="right" className="h-3 w-auto" />
      </Link>

      {others.length ? (
        <>
          <p className="mt-8 text-small text-ash">Or book the way {artist.name}’s Instagram bio says:</p>
          <ul className="mt-3 space-y-3">
            {others.map((c) => (
              <li key={c.kind} className="flex items-baseline gap-3">
                <Dagger className="h-3.5 w-auto shrink-0 translate-y-0.5 text-ash" />
                {c.kind === 'whatsapp' ? (
                  <ExternalLink className="link" href={whatsappUrl(c.number, `Hi, I'd like to book with ${artist.name}.`)}>
                    WhatsApp <span className="num">{c.display}</span>
                    <span className="text-ash"> (studio number)</span>
                  </ExternalLink>
                ) : c.kind === 'email' ? (
                  <span>
                    Email <EmailLink className="link" user={c.user} domain={c.domain} subject={`Booking enquiry for ${artist.name}`} />
                  </span>
                ) : c.kind === 'instagram-dm' ? (
                  <ExternalLink className="link" href={instagramUrl(c.handle)}>
                    DM @{c.handle} on Instagram
                  </ExternalLink>
                ) : null}
              </li>
            ))}
          </ul>
        </>
      ) : null}
    </div>
  );
}
