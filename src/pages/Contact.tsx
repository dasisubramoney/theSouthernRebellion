import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { Seo } from '../components/seo/Seo';
import { Dagger } from '../components/brand/Dagger';
import { DaggerRule } from '../components/brand/DaggerRule';
import { BookingForm } from '../components/forms/BookingForm';
import { ContactForm } from '../components/forms/ContactForm';
import { Picture } from '../components/media/Picture';
import { EmailLink } from '../components/layout/EmailLink';
import { ExternalLink } from '../components/layout/ExternalLink';
import { contactPath } from '../components/layout/nav';
import { studio } from '../content/studio';
import { instagramUrl } from '../lib/links';

/** One ruled cell: the whole cell is the link, and it inverts on hover. */
const cell =
  'group flex h-full min-h-32 flex-col justify-between gap-6 p-5 transition-colors duration-200 md:p-6';
const cellPlain = 'bg-bone text-ink hover:bg-ink hover:text-bone';

function CellText({ label, value, small, labelClass = 'text-iron group-hover:text-smoke' }: { label: string; value: ReactNode; small?: boolean; labelClass?: string }) {
  return (
    <>
      <span className={`ui ${labelClass}`}>{label}</span>
      <span className="flex items-end justify-between gap-4">
        <span className={`font-semibold [overflow-wrap:anywhere] ${small ? 'text-body' : 'text-h3'}`}>{value}</span>
        <Dagger point="right" className="mb-1 h-3 w-auto shrink-0 transition-transform duration-200 group-hover:translate-x-1" />
      </span>
    </>
  );
}

export default function Contact() {
  return (
    <>
      <Seo
        title="Send a booking enquiry"
        description={`Send ${studio.name} a booking enquiry for a tattoo or piercing, or ask a question. WhatsApp and email also work.`}
        path={contactPath}
      />

      {/*
        The booking enquiry, one question at a time, over a full-bleed photo.
        data-scheme="photo" keeps this stage dark in both themes, with greys lifted to stay
        readable over the photo (index.css). The photo is decorative, so its alt is empty.
      */}
      <section
        id="enquiry"
        data-scheme="photo"
        aria-labelledby="enquiry-heading"
        className="relative isolate scroll-mt-20 overflow-hidden py-16 md:py-24"
      >
        <div aria-hidden="true" className="absolute inset-0 -z-10">
          <Picture
            imageKey={studio.bookingBackground.imageKey}
            rendition="full"
            alt=""
            sizes="100vw"
            priority
            className="size-full object-cover object-[60%_30%] lg:object-[50%_35%]"
          />
          {/* Ink scrim, not decoration: 80% everywhere on phones. On desktop the form sits in the
              left half, so the scrim stays at 80% or more there and eases off to the right to let
              the photo's subject show. */}
          <div className="absolute inset-0 bg-ink/80 lg:bg-transparent lg:bg-linear-to-r lg:from-ink/90 lg:via-ink/80 lg:to-ink/35" />
        </div>

        <div className="shell grid-page min-h-[calc(100svh-12rem)] content-center gap-y-10">
          <div className="col-span-4 md:col-span-8 lg:col-span-6">
            {/* Intro block: a bone rule on the left, the page heading, and the two other ways in. */}
            <div className="border-l-2 border-bone pl-5">
              <h1 id="enquiry-heading" className="text-lead font-semibold text-bone">
                Send a booking enquiry
              </h1>
              <p className="mt-2 text-smoke">Fill in what you know; the artist will help with the rest.</p>
              <ul className="mt-4 flex flex-wrap gap-x-8 gap-y-3">
                <li className="text-smoke">
                  Prefer to talk first?{' '}
                  <ExternalLink className="link whitespace-nowrap font-semibold text-bone" href={studio.whatsapp}>
                    WhatsApp <span className="num">{studio.phoneDisplay}</span>
                  </ExternalLink>
                </li>
                <li>
                  <Link className="link whitespace-nowrap font-semibold text-bone" to="/#special">
                    Saturday piercing special
                  </Link>
                </li>
              </ul>
            </div>
            <div className="mt-10">
              <BookingForm />
            </div>
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
        <div className="shell">
          {/* The number is the headline and the main action: it opens WhatsApp. */}
          <h2 id="talk-heading">
            <span className="ui flex items-center gap-2 text-iron">
              <Dagger className="h-4 w-auto" />
              Studio phone and WhatsApp
            </span>
            <ExternalLink
              href={studio.whatsapp}
              aria-label={`WhatsApp the studio on ${studio.phoneDisplay}`}
              className="num mt-4 block w-fit whitespace-nowrap font-display text-[clamp(min(3.1rem,13.6vw),0.6rem+9.2vw,9rem)] leading-[0.95] decoration-2 underline-offset-[0.12em] hover:underline"
            >
              {studio.phoneDisplay}
            </ExternalLink>
          </h2>

          {/* Ruled action cells, like a flash sheet. WhatsApp is filled: it is the quickest way in. */}
          <ul className="mt-12 grid grid-cols-1 gap-px border border-ink/25 bg-ink/25 sm:grid-cols-2 lg:grid-cols-4">
            <li>
              <ExternalLink href={studio.whatsapp} className={`${cell} bg-ink text-bone hover:bg-coal`}>
                <CellText label="WhatsApp" value="Send a message" labelClass="text-smoke" />
              </ExternalLink>
            </li>
            <li>
              <a href={`tel:${studio.phoneE164}`} className={`${cell} ${cellPlain}`}>
                <CellText label="Phone" value="Call the studio" />
              </a>
            </li>
            <li>
              <EmailLink {...studio.email} subject="Question for the studio" className={`${cell} ${cellPlain}`}>
                {(address) => <CellText label="Email" value={address} small />}
              </EmailLink>
            </li>
            <li>
              <ExternalLink href={instagramUrl(studio.instagram)} className={`${cell} ${cellPlain}`}>
                <CellText label="Instagram" value={`@${studio.instagram}`} small />
              </ExternalLink>
            </li>
          </ul>
        </div>
      </section>
    </>
  );
}
