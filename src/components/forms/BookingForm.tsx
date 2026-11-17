import { useEffect, useRef, useState, type FormEvent } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { publishedArtists } from '../../content/artists';
import { booking } from '../../content/booking';
import { flash } from '../../content/flash';
import { honeypotField } from '../../content/forms';
import { isTodo } from '../../content/todo';
import { studio } from '../../content/studio';
import { emailPattern, formDataFrom, shrinkImages, submitNetlifyForm, totalFileBytes } from '../../lib/netlifyForm';
import { ExternalLink } from '../layout/ExternalLink';
import { TodoNote } from '../content/TodoNote';
import { Check, ChoiceGroup, Field, Honeypot, controlClass } from './Field';

const UNSURE = 'unsure';
const SPECIAL = 'piercing-special';
const { references } = booking.form;
const REFERENCE_FIELDS = ['reference1', 'reference2', 'reference3'] as const;
const limitMb = (references.maxTotalBytes / 1024 / 1024).toFixed(0);

function formNameFor(choice: string) {
  if (choice === SPECIAL) return 'booking-piercing';
  if (publishedArtists.some((a) => a.slug === choice)) return `booking-${choice}`;
  return 'booking-unsure';
}

function artistLabel(choice: string) {
  if (choice === SPECIAL) return 'the studio';
  return publishedArtists.find((a) => a.slug === choice)?.name ?? 'the studio';
}

type Errors = Partial<Record<string, string>>;

function validate(form: HTMLFormElement, s: { artist: string; kind: string; palette: string; age: boolean; consent: boolean }): Errors {
  const d = new FormData(form);
  const text = (k: string) => String(d.get(k) ?? '').trim();
  const e: Errors = {};
  if (!text('name')) e.name = 'Add your name.';
  if (!text('email')) e.email = 'Add your email address.';
  else if (!emailPattern.test(text('email'))) e.email = 'Check the email address. It should look like name@example.com.';
  if (!s.artist) e.artist = 'Choose an artist, or "Not sure, help me choose".';
  if (!s.kind) e.kind = 'Choose tattoo or piercing.';
  if (!text('placement')) e.placement = s.kind === 'Piercing' ? 'Say which piercing you want.' : 'Say where on your body it goes.';
  if (s.kind === 'Tattoo' && !s.palette) e.colour = 'Choose colour, black and grey, or not sure yet.';
  if (!text('description')) e.description = 'Tell the artist what you have in mind.';

  for (const key of REFERENCE_FIELDS) {
    const f = d.get(key);
    if (f instanceof File && f.size > 0 && !references.acceptedTypes.includes(f.type) && !/\.(jpe?g|png|webp|heic)$/i.test(f.name)) {
      e.references = `"${f.name}" is not a photo we can open. Use JPG, PNG, WebP or HEIC.`;
    }
  }
  if (!s.age) e.age = 'Confirm your age to send the enquiry.';
  if (!s.consent) e.consent = 'Tick this so the studio can use your details to reply.';
  return e;
}

export function BookingForm() {
  const [params] = useSearchParams();
  const formRef = useRef<HTMLFormElement>(null);
  const summaryRef = useRef<HTMLDivElement>(null);
  const doneRef = useRef<HTMLHeadingElement>(null);
  const [enhanced, setEnhanced] = useState(false);
  const [artist, setArtist] = useState('');
  const [kind, setKind] = useState('');
  const [palette, setPalette] = useState('');
  const [age, setAge] = useState(false);
  const [consent, setConsent] = useState(false);
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'failed'>('idle');

  // Read ?artist= and ?flash= after hydration so the server HTML stays the same for every visitor.
  useEffect(() => {
    setEnhanced(true);
    const a = params.get('artist');
    if (a === 'piercing') {
      setArtist(SPECIAL);
      setKind('Piercing');
    } else if (a && publishedArtists.some((p) => p.slug === a)) {
      setArtist(a);
    }
    const f = params.get('flash');
    if (f && a) {
      const piece = flash[a as keyof typeof flash]?.find((x) => x.id === f);
      const desc = formRef.current?.elements.namedItem('description');
      if (piece && desc instanceof HTMLTextAreaElement && !desc.value) {
        desc.value = `I'd like to claim the "${piece.title}" flash.`;
        setKind('Tattoo');
      }
    }
  }, [params]);

  useEffect(() => {
    if (status === 'sent') doneRef.current?.focus();
  }, [status]);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const found = validate(form, { artist, kind, palette, age, consent });
    setErrors(found);
    if (Object.keys(found).length) {
      requestAnimationFrame(() => summaryRef.current?.focus());
      return;
    }
    setStatus('sending');
    // Large phone photos are scaled down first, then the real total is checked.
    const data = await shrinkImages(formDataFrom(form), REFERENCE_FIELDS);
    const total = totalFileBytes(data);
    if (total > references.maxTotalBytes) {
      setStatus('idle');
      setErrors({
        references: `The images add up to ${(total / 1024 / 1024).toFixed(1)} MB. Keep them under ${limitMb} MB in total, or send them on WhatsApp after you hear back.`,
      });
      requestAnimationFrame(() => summaryRef.current?.focus());
      return;
    }
    // Netlify uses this as the notification email's subject line.
    data.set('subject', `Booking enquiry for ${artistLabel(artist)} (%{submissionId})`);
    try {
      await submitNetlifyForm(formNameFor(artist), data);
      setStatus('sent');
    } catch {
      setStatus('failed');
    }
  }

  if (status === 'sent') {
    const reply = booking.steps[1]?.body;
    return (
      <div role="status" className="border border-bone p-6 md:p-10">
        <h2 ref={doneRef} tabIndex={-1} className="font-display text-h2 outline-none">
          Sent to {artistLabel(artist)}
        </h2>
        <p className="measure mt-4 text-lead">
          Your enquiry and images are with {artistLabel(artist)}.
        </p>
        {reply && isTodo(reply) ? <TodoNote className="mt-6" item={reply} /> : null}
        <p className="mt-8">
          <Link className="link" to="/#aftercare">
            Read the aftercare notes before your session
          </Link>
        </p>
      </div>
    );
  }

  const errorList = Object.entries(errors).filter(([, v]) => v);
  const who = artist && artist !== UNSURE ? artistLabel(artist) : null;
  const isPiercing = kind === 'Piercing';

  return (
    <form
      ref={formRef}
      name="booking-unsure"
      method="POST"
      action="/sent"
      encType="multipart/form-data"
      noValidate={enhanced}
      onSubmit={onSubmit}
      className="space-y-12"
    >
      <input type="hidden" name="form-name" defaultValue="booking-unsure" />
      <Honeypot name={honeypotField} />

      {errorList.length ? (
        <div ref={summaryRef} tabIndex={-1} role="alert" className="border border-alert-on-ink p-5 outline-none">
          <p className="font-semibold">
            {errorList.length === 1 ? 'One thing needs fixing' : `${errorList.length} things need fixing`} before this can
            be sent:
          </p>
          <ul className="mt-3 list-disc space-y-1 pl-5">
            {errorList.map(([k, v]) => (
              <li key={k}>
                <a className="link" href={`#field-${k}`}>
                  {v}
                </a>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      <fieldset className="space-y-6">
        <legend className="ui mb-6 text-ash">About you</legend>
        <Field id="field-name" label="Your name" error={errors.name}>
          {(d) => (
            <input id="field-name" name="name" autoComplete="name" required aria-describedby={d} aria-invalid={errors.name ? true : undefined} className={controlClass} />
          )}
        </Field>
        <div className="grid gap-6 md:grid-cols-2 md:items-end">
          <Field id="field-email" label="Email" error={errors.email}>
            {(d) => (
              <input id="field-email" name="email" type="email" autoComplete="email" inputMode="email" required aria-describedby={d} aria-invalid={errors.email ? true : undefined} className={controlClass} />
            )}
          </Field>
          <Field id="field-whatsapp" label="WhatsApp number" optional hint="If you'd rather hear back on WhatsApp.">
            {(d) => <input id="field-whatsapp" name="whatsapp" type="tel" autoComplete="tel" inputMode="tel" aria-describedby={d} className={`${controlClass} num`} />}
          </Field>
        </div>
      </fieldset>

      <fieldset className="space-y-6">
        <legend className="ui mb-6 text-ash">The work</legend>
        <Field id="field-artist" label="Which artist?" error={errors.artist} hint="Each enquiry goes straight to the artist you choose.">
          {(d) => (
            <select
              id="field-artist"
              name="artist"
              required
              value={artist}
              onChange={(e) => setArtist(e.target.value)}
              aria-describedby={d}
              aria-invalid={errors.artist ? true : undefined}
              className={controlClass}
            >
              <option value="">Choose an artist</option>
              {publishedArtists.map((a) => (
                <option key={a.slug} value={a.slug}>
                  {a.name}: {a.styles.slice(0, 2).join(', ').toLowerCase()}
                </option>
              ))}
              <option value={UNSURE}>{booking.form.unsureLabel}</option>
              <option value={SPECIAL}>Saturday piercing special</option>
            </select>
          )}
        </Field>

        <div id="field-kind">
          <ChoiceGroup name="kind" legend="Tattoo or piercing?" options={booking.form.kinds} value={kind} onChange={setKind} error={errors.kind} required />
        </div>

        <div className="grid gap-6 md:grid-cols-2 md:items-end">
          <Field
            id="field-placement"
            label={isPiercing ? 'Which piercing?' : 'Placement'}
            hint={isPiercing ? 'For example: nostril, helix, two lobes.' : 'Where on your body: inner forearm, calf, sternum.'}
            error={errors.placement}
          >
            {(d) => <input id="field-placement" name="placement" required aria-describedby={d} aria-invalid={errors.placement ? true : undefined} className={controlClass} />}
          </Field>
          {!isPiercing ? (
            <Field id="field-size" label="Approximate size" optional hint={booking.form.sizeHint}>
              {(d) => <input id="field-size" name="size" aria-describedby={d} className={controlClass} />}
            </Field>
          ) : null}
        </div>

        {!isPiercing ? (
          <div id="field-colour">
            <ChoiceGroup name="colour" legend="Colour or black and grey?" options={booking.form.palettes} value={palette} onChange={setPalette} error={errors.colour} />
          </div>
        ) : null}

        <Field
          id="field-description"
          label="What do you have in mind?"
          hint="The idea, the feeling, anything it must or mustn't include. If it's a cover-up, say so."
          error={errors.description}
        >
          {(d) => (
            <textarea id="field-description" name="description" rows={6} required aria-describedby={d} aria-invalid={errors.description ? true : undefined} className={controlClass} />
          )}
        </Field>

        <div id="field-references">
          <p className="font-semibold">
            Reference images <span className="font-normal text-ash">(optional, up to {references.maxFiles})</span>
          </p>
          <p className="mt-1 text-small text-ash">
            Photos of the placement, designs you like, or the tattoo you want covered. JPG, PNG, WebP or HEIC, under{' '}
            {limitMb} MB in total. Large photos are made smaller before sending.
          </p>
          <div className="mt-3 grid gap-3 md:grid-cols-3">
            {[1, 2, 3].map((n) => (
              <div key={n}>
                <label htmlFor={`field-reference${n}`} className="visually-hidden">
                  Reference image {n}
                </label>
                <input
                  id={`field-reference${n}`}
                  name={`reference${n}`}
                  type="file"
                  accept={references.acceptedTypes.join(',')}
                  aria-describedby={errors.references ? 'references-error' : undefined}
                  className="block w-full border border-pewter bg-ink p-2 text-small file:mr-3 file:border-0 file:bg-bone file:px-3 file:py-2 file:font-semibold file:text-ink"
                />
              </div>
            ))}
          </div>
          {errors.references ? (
            <p id="references-error" className="mt-2 text-small font-semibold text-alert-on-ink">
              {errors.references}
            </p>
          ) : null}
        </div>
      </fieldset>

      <fieldset className="space-y-6">
        <legend className="ui mb-6 text-ash">Planning</legend>
        <div className="grid gap-6 md:grid-cols-2 md:items-end">
          <Field id="field-budget" label="Budget" optional hint="A rough figure helps the artist plan the size and detail.">
            {(d) => <input id="field-budget" name="budget" inputMode="numeric" aria-describedby={d} className={`${controlClass} num`} />}
          </Field>
          <Field id="field-availability" label="When suits you?" optional hint={booking.form.availabilityHint}>
            {(d) => <input id="field-availability" name="availability" aria-describedby={d} className={controlClass} />}
          </Field>
        </div>
        {isTodo(booking.form.budgetRanges) ? <TodoNote item={booking.form.budgetRanges} /> : null}
      </fieldset>

      <fieldset className="space-y-5 border-t border-coal pt-8">
        <legend className="visually-hidden">Confirm</legend>
        <div id="field-age">
          <Check id="check-age" name="age" checked={age} onChange={setAge} error={errors.age}>
            I am 18 or older.
          </Check>
          {isTodo(booking.form.ageConfirmation) ? <TodoNote className="mt-3" item={booking.form.ageConfirmation} /> : null}
        </div>
        <div id="field-consent">
          <Check id="check-consent" name="consent" checked={consent} onChange={setConsent} error={errors.consent}>
            The studio may use these details and images to reply to my enquiry, as set out in the{' '}
            <Link className="link" to="/privacy">
              privacy notice
            </Link>
            .
          </Check>
        </div>
      </fieldset>

      <div className="flex flex-col gap-4 md:flex-row md:items-center md:gap-8">
        <button
          type="submit"
          disabled={status === 'sending'}
          className="ui bg-bone px-6 py-4 text-ink transition-colors duration-200 hover:bg-smoke disabled:opacity-60"
        >
          {status === 'sending' ? 'Sending…' : who ? `Send ${who} your enquiry` : 'Send your enquiry'}
        </button>
        <p aria-live="polite" className="text-small">
          {status === 'failed' ? (
            <span className="font-semibold text-alert-on-ink">
              That didn't go through. Try again, or{' '}
              <ExternalLink className="link" href={studio.whatsapp}>
                WhatsApp the studio
              </ExternalLink>
              .
            </span>
          ) : null}
        </p>
      </div>
    </form>
  );
}
