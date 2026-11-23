import { useEffect, useRef, useState, type FormEvent, type KeyboardEvent, type ReactNode } from 'react';
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
import { Dagger } from '../brand/Dagger';
import { Check, Field, Honeypot } from './Field';

const UNSURE = 'unsure';
const SPECIAL = 'piercing-special';
const { references } = booking.form;
const REFERENCE_FIELDS = ['reference1', 'reference2', 'reference3'] as const;
const limitMb = (references.maxTotalBytes / 1024 / 1024).toFixed(0);

/** Underline-only field, large type: the step-by-step style. */
const lineControl =
  'block w-full border-0 border-b border-pewter bg-transparent px-0 py-3 text-h3 text-bone placeholder:text-ash focus:border-bone focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-bone aria-[invalid=true]:border-alert-on-ink';

function formNameFor(choice: string) {
  if (choice === SPECIAL) return 'booking-piercing';
  if (publishedArtists.some((a) => a.slug === choice)) return `booking-${choice}`;
  return 'booking-unsure';
}

function artistLabel(choice: string) {
  if (choice === SPECIAL) return 'the studio';
  return publishedArtists.find((a) => a.slug === choice)?.name ?? 'the studio';
}

type StepId = 'name' | 'contact' | 'artist' | 'kind' | 'placement' | 'colour' | 'idea' | 'references' | 'planning' | 'confirm';
const ALL_STEPS: StepId[] = ['name', 'contact', 'artist', 'kind', 'placement', 'colour', 'idea', 'references', 'planning', 'confirm'];

/** Which error keys belong to which step, so OK only checks the step on screen. */
const STEP_FIELDS: Record<StepId, string[]> = {
  name: ['firstName', 'lastName'],
  contact: ['email'],
  artist: ['artist'],
  kind: ['kind'],
  placement: ['placement'],
  colour: ['colour'],
  idea: ['description'],
  references: ['references'],
  planning: [],
  confirm: ['age', 'consent'],
};

type Errors = Partial<Record<string, string>>;
type State = { artist: string; kind: string; palette: string; age: boolean; consent: boolean };

function validate(form: HTMLFormElement, s: State): Errors {
  const d = new FormData(form);
  const text = (k: string) => String(d.get(k) ?? '').trim();
  const e: Errors = {};
  if (!text('firstName')) e.firstName = 'Add your first name.';
  if (!text('lastName')) e.lastName = 'Add your last name.';
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

type Option = { value: string; label: string; detail?: string };

/**
 * Lettered choices (A, B, C...) as radio buttons. The step heading labels the group.
 * Pressing a letter picks that option when the step is on screen (see onKeyDown below).
 */
function Choices({ name, labelledBy, options, value, onChange, error }: { name: string; labelledBy: string; options: Option[]; value: string; onChange: (v: string) => void; error?: string }) {
  const errorId = error ? `${name}-error` : undefined;
  return (
    <fieldset aria-labelledby={labelledBy} aria-describedby={errorId}>
      <div className="grid gap-2">
        {options.map((o, i) => (
          <label
            key={o.value}
            className="flex cursor-pointer items-start gap-3 border border-pewter bg-ink/40 px-4 py-3 transition-colors duration-150 hover:border-bone has-[:checked]:border-bone has-[:checked]:bg-bone has-[:checked]:text-ink has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-bone"
          >
            <input type="radio" name={name} value={o.value} checked={value === o.value} onChange={() => onChange(o.value)} required className="visually-hidden" />
            <span aria-hidden="true" className="ui num mt-0.5 inline-flex size-6 shrink-0 items-center justify-center border border-current">
              {String.fromCharCode(65 + i)}
            </span>
            <span>
              <span className="block font-semibold">{o.label}</span>
              {o.detail ? <span className="block text-small opacity-80">{o.detail}</span> : null}
            </span>
          </label>
        ))}
      </div>
      {error ? (
        <p id={errorId} className="mt-3 text-small font-semibold text-alert-on-ink">
          {error}
        </p>
      ) : null}
    </fieldset>
  );
}

export function BookingForm() {
  const [params] = useSearchParams();
  const formRef = useRef<HTMLFormElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const doneRef = useRef<HTMLHeadingElement>(null);
  /** False on the server and before hydration: every step shows, so the form works without JavaScript. */
  const [enhanced, setEnhanced] = useState(false);
  const [current, setCurrent] = useState<StepId>('name');
  const [artist, setArtist] = useState('');
  const [kind, setKind] = useState('');
  const [palette, setPalette] = useState('');
  const [age, setAge] = useState(false);
  const [consent, setConsent] = useState(false);
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'failed'>('idle');
  const moved = useRef(false);

  const isPiercing = kind === 'Piercing';
  const steps = ALL_STEPS.filter((s) => !(s === 'colour' && isPiercing));
  const index = Math.max(0, steps.indexOf(current));
  const last = index === steps.length - 1;

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

  // After moving to a step: keep the stage in view and put focus on the step's first control.
  useEffect(() => {
    if (!enhanced || !moved.current) return;
    const step = formRef.current?.querySelector<HTMLElement>(`[data-step="${current}"]`);
    const stageTop = stageRef.current?.getBoundingClientRect().top ?? 0;
    if (stageTop < 0) stageRef.current?.scrollIntoView({ block: 'start' });
    const target =
      step?.querySelector<HTMLElement>('input:checked:not([type=hidden]), input:not([type=hidden]):not([type=radio]):not([type=checkbox]), textarea') ??
      step?.querySelector<HTMLElement>('input:not([type=hidden]), select, textarea, button');
    target?.focus({ preventScroll: true });
  }, [current, enhanced]);

  useEffect(() => {
    if (status === 'sent') doneRef.current?.focus();
  }, [status]);

  const state = { artist, kind, palette, age, consent };

  function go(to: StepId) {
    moved.current = true;
    setErrors({});
    setCurrent(to);
  }

  function next() {
    const form = formRef.current;
    if (!form) return;
    const found = validate(form, state);
    const mine = Object.fromEntries(Object.entries(found).filter(([k]) => STEP_FIELDS[current].includes(k)));
    if (Object.keys(mine).length) {
      setErrors(mine);
      const first = Object.keys(mine)[0];
      requestAnimationFrame(() => form.querySelector<HTMLElement>(`[data-step="${current}"] [aria-invalid=true], [data-step="${current}"] input[name="${first}"]`)?.focus());
      return;
    }
    const to = steps[index + 1];
    if (to) go(to);
  }

  function back() {
    const to = steps[index - 1];
    if (to) go(to);
  }

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const found = validate(form, state);
    if (Object.keys(found).length) {
      // Go back to the first step with something missing.
      const step = steps.find((s) => STEP_FIELDS[s].some((k) => k in found)) ?? current;
      moved.current = true;
      setCurrent(step);
      setErrors(Object.fromEntries(Object.entries(found).filter(([k]) => STEP_FIELDS[step].includes(k))));
      return;
    }
    setStatus('sending');
    // Large phone photos are scaled down first, then the real total is checked.
    const data = await shrinkImages(formDataFrom(form), REFERENCE_FIELDS);
    const total = totalFileBytes(data);
    if (total > references.maxTotalBytes) {
      setStatus('idle');
      moved.current = true;
      setCurrent('references');
      setErrors({
        references: `The images add up to ${(total / 1024 / 1024).toFixed(1)} MB. Keep them under ${limitMb} MB in total, or send them on WhatsApp after you hear back.`,
      });
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

  // Enter moves on (except in the description box and on the last step); letters pick a choice.
  function onKeyDown(e: KeyboardEvent<HTMLFormElement>) {
    if (!enhanced) return;
    const t = e.target as HTMLElement;
    if (e.key === 'Enter' && !last && t.tagName === 'INPUT' && (t as HTMLInputElement).type !== 'file') {
      e.preventDefault();
      next();
      return;
    }
    const typing = t.tagName === 'TEXTAREA' || (t.tagName === 'INPUT' && !['radio', 'checkbox'].includes((t as HTMLInputElement).type));
    if (typing || e.ctrlKey || e.metaKey || e.altKey || !/^[a-z]$/i.test(e.key)) return;
    const choices: Partial<Record<StepId, [Option[], (v: string) => void]>> = {
      artist: [artistOptions, setArtist],
      kind: [kindOptions, setKind],
      colour: [paletteOptions, setPalette],
    };
    const pick = choices[current];
    const o = pick?.[0][e.key.toUpperCase().charCodeAt(0) - 65];
    if (pick && o) {
      e.preventDefault();
      pick[1](o.value);
    }
  }

  const artistOptions: Option[] = [
    ...publishedArtists.map((a) => ({ value: a.slug, label: a.name, detail: a.styles.slice(0, 3).join(', ') })),
    { value: UNSURE, label: booking.form.unsureLabel, detail: 'The studio reads it and passes it to the right artist.' },
    { value: SPECIAL, label: 'Saturday piercing special', detail: 'Two standard piercings, Saturdays 10am to 5pm.' },
  ];
  const kindOptions: Option[] = booking.form.kinds.map((k) => ({ value: k, label: k }));
  const paletteOptions: Option[] = booking.form.palettes.map((p) => ({ value: p, label: p }));
  const who = artist && artist !== UNSURE ? artistLabel(artist) : null;

  const step = (id: StepId, heading: ReactNode, body: ReactNode, hint?: ReactNode) => {
    const n = steps.indexOf(id) + 1;
    if (n === 0) return null;
    const active = id === current;
    const headingId = `step-${id}-heading`;
    return (
      <div
        key={id}
        data-step={id}
        data-step-active={enhanced && active ? '' : undefined}
        role="group"
        aria-labelledby={headingId}
        hidden={enhanced && !active}
        className={enhanced ? '' : 'border-t border-coal pt-10'}
      >
        <h2 id={headingId} className="flex items-start gap-3 font-display text-h2">
          <span aria-hidden="true" className="ui num mt-2 inline-flex h-7 min-w-7 shrink-0 items-center justify-center gap-1 rounded-hair bg-bone px-1.5 text-ink">
            {n}
            <Dagger point="right" className="h-2 w-auto" />
          </span>
          <span>{heading}</span>
        </h2>
        {hint ? <p className="measure mt-3 pl-10 text-ash">{hint}</p> : null}
        <div className="mt-8 space-y-8 pl-10">{body}</div>
        {enhanced ? (
          <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-4 pl-10">
            {last ? (
              <button type="submit" disabled={status === 'sending'} className="ui bg-bone px-6 py-4 text-ink transition-colors duration-200 hover:bg-smoke disabled:opacity-60">
                {status === 'sending' ? 'Sending…' : who ? `Send ${who} your enquiry` : 'Send your enquiry'}
              </button>
            ) : (
              <button type="button" onClick={next} className="ui inline-flex items-center gap-3 bg-bone px-6 py-3 text-ink transition-colors duration-200 hover:bg-smoke">
                OK
                <Dagger point="right" className="h-2.5 w-auto" />
              </button>
            )}
            {!last ? <span className="text-small text-ash">or press Enter</span> : null}
            {index > 0 ? (
              <button type="button" onClick={back} className="link ui">
                Back
              </button>
            ) : null}
          </div>
        ) : null}
      </div>
    );
  };

  if (status === 'sent') {
    const reply = booking.steps[1]?.body;
    return (
      <div ref={stageRef} role="status">
        <h2 ref={doneRef} tabIndex={-1} className="font-display text-h1 outline-none">
          Sent to {artistLabel(artist)}
        </h2>
        <p className="measure mt-6 text-lead">Your enquiry and images are with {artistLabel(artist)}.</p>
        {reply && isTodo(reply) ? <TodoNote className="mt-6" item={reply} /> : null}
        <p className="mt-8">
          <Link className="link" to="/#aftercare">
            Read the aftercare notes before your session
          </Link>
        </p>
      </div>
    );
  }

  return (
    <div ref={stageRef} className="scroll-mt-28">
      {enhanced ? (
        <div className="mb-10">
          <p aria-live="polite" className="ui num text-ash">
            Step {index + 1} of {steps.length}
          </p>
          <div className="mt-2 h-px w-full bg-coal" aria-hidden="true">
            <div
              className={`h-px origin-left bg-bone transition-transform duration-500 ease-(--ease-settle) ${
                ['scale-x-[0.1]', 'scale-x-[0.2]', 'scale-x-[0.3]', 'scale-x-[0.4]', 'scale-x-[0.5]', 'scale-x-[0.6]', 'scale-x-[0.7]', 'scale-x-[0.8]', 'scale-x-[0.9]', 'scale-x-100'][
                  Math.round(((index + 1) / steps.length) * 10) - 1
                ] ?? 'scale-x-100'
              }`}
            />
          </div>
        </div>
      ) : null}

      <form
        ref={formRef}
        name="booking-unsure"
        method="POST"
        action="/sent"
        encType="multipart/form-data"
        noValidate={enhanced}
        onSubmit={onSubmit}
        onKeyDown={onKeyDown}
        className={enhanced ? '' : 'space-y-12'}
      >
        <input type="hidden" name="form-name" defaultValue="booking-unsure" />
        <Honeypot name={honeypotField} />

        {step(
          'name',
          'Hi, nice to meet you…',
          <div className="grid gap-8 md:grid-cols-2">
            <Field id="field-firstName" label="First name" error={errors.firstName}>
              {(d) => <input id="field-firstName" name="firstName" autoComplete="given-name" required aria-describedby={d} aria-invalid={errors.firstName ? true : undefined} className={lineControl} />}
            </Field>
            <Field id="field-lastName" label="Last name" error={errors.lastName}>
              {(d) => <input id="field-lastName" name="lastName" autoComplete="family-name" required aria-describedby={d} aria-invalid={errors.lastName ? true : undefined} className={lineControl} />}
            </Field>
          </div>,
        )}

        {step(
          'contact',
          'How do we reach you?',
          <>
            <Field id="field-email" label="Email" error={errors.email}>
              {(d) => (
                <input id="field-email" name="email" type="email" autoComplete="email" inputMode="email" required aria-describedby={d} aria-invalid={errors.email ? true : undefined} className={lineControl} />
              )}
            </Field>
            <Field id="field-whatsapp" label="WhatsApp number" optional hint="If you'd rather hear back on WhatsApp.">
              {(d) => <input id="field-whatsapp" name="whatsapp" type="tel" autoComplete="tel" inputMode="tel" aria-describedby={d} className={`${lineControl} num`} />}
            </Field>
          </>,
        )}

        {step(
          'artist',
          'Who would you like to tattoo you?',
          <Choices name="artist" labelledBy="step-artist-heading" options={artistOptions} value={artist} onChange={setArtist} error={errors.artist} />,
          'Each enquiry goes straight to the artist you choose. Press a letter to pick.',
        )}

        {step(
          'kind',
          'Tattoo or piercing?',
          <Choices name="kind" labelledBy="step-kind-heading" options={kindOptions} value={kind} onChange={setKind} error={errors.kind} />,
        )}

        {step(
          'placement',
          isPiercing ? 'Which piercing?' : 'Where does it go?',
          <div className="grid gap-8 md:grid-cols-2">
            <Field
              id="field-placement"
              label={isPiercing ? 'Piercing' : 'Placement'}
              hint={isPiercing ? 'For example: nostril, helix, two lobes.' : 'Inner forearm, calf, sternum.'}
              error={errors.placement}
            >
              {(d) => <input id="field-placement" name="placement" required aria-describedby={d} aria-invalid={errors.placement ? true : undefined} className={lineControl} />}
            </Field>
            {!isPiercing ? (
              <Field id="field-size" label="Approximate size" optional hint={booking.form.sizeHint}>
                {(d) => <input id="field-size" name="size" aria-describedby={d} className={lineControl} />}
              </Field>
            ) : null}
          </div>,
        )}

        {step(
          'colour',
          'Colour or black and grey?',
          <Choices name="colour" labelledBy="step-colour-heading" options={paletteOptions} value={palette} onChange={setPalette} error={errors.colour} />,
        )}

        {step(
          'idea',
          'Tell us the idea',
          <Field id="field-description" label="What do you have in mind?" error={errors.description}>
            {(d) => <textarea id="field-description" name="description" rows={5} required aria-describedby={d} aria-invalid={errors.description ? true : undefined} className={`${lineControl} text-lead`} />}
          </Field>,
          "The idea, the feeling, anything it must or mustn't include. If it's a cover-up, say so.",
        )}

        {step(
          'references',
          'Got any reference images?',
          <div id="field-references">
            <div className="grid gap-3 md:grid-cols-3">
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
                    className="block w-full border border-pewter bg-ink/40 p-2 text-small file:mr-3 file:border-0 file:bg-bone file:px-3 file:py-2 file:font-semibold file:text-ink"
                  />
                </div>
              ))}
            </div>
            {errors.references ? (
              <p id="references-error" className="mt-3 text-small font-semibold text-alert-on-ink">
                {errors.references}
              </p>
            ) : null}
          </div>,
          `Optional, up to ${references.maxFiles}. Photos of the placement, designs you like, or the tattoo you want covered. JPG, PNG, WebP or HEIC, under ${limitMb} MB in total; large photos are made smaller before sending.`,
        )}

        {step(
          'planning',
          'When suits you?',
          <>
            <div className="grid gap-8 md:grid-cols-2">
              <Field id="field-availability" label="Days and times" optional hint={booking.form.availabilityHint}>
                {(d) => <input id="field-availability" name="availability" aria-describedby={d} className={lineControl} />}
              </Field>
              <Field id="field-budget" label="Budget" optional hint="A rough figure helps the artist plan the size and detail.">
                {(d) => <input id="field-budget" name="budget" inputMode="numeric" aria-describedby={d} className={`${lineControl} num`} />}
              </Field>
            </div>
            {isTodo(booking.form.budgetRanges) ? <TodoNote item={booking.form.budgetRanges} /> : null}
          </>,
        )}

        {step(
          'confirm',
          'Last thing',
          <div className="space-y-5">
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
          </div>,
        )}

        {/* Without JavaScript every step shows and this sends the whole form natively. */}
        {!enhanced ? (
          <div className="mt-10">
            <button type="submit" className="ui bg-bone px-6 py-4 text-ink">
              Send your enquiry
            </button>
          </div>
        ) : null}

        <p aria-live="polite" className="mt-6 text-small">
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
      </form>
    </div>
  );
}
