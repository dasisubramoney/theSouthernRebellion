import { useEffect, useRef, useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { honeypotField } from '../../content/forms';
import { studio } from '../../content/studio';
import { emailPattern, formDataFrom, submitNetlifyForm } from '../../lib/netlifyForm';
import { ExternalLink } from '../layout/ExternalLink';
import { Check, Field, Honeypot, controlClass } from './Field';

/** For questions that are not a booking: directions, parking, gift vouchers, anything else. */
export function ContactForm() {
  const [enhanced, setEnhanced] = useState(false);
  const [consent, setConsent] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'failed'>('idle');
  const doneRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => setEnhanced(true), []);
  useEffect(() => {
    if (status === 'sent') doneRef.current?.focus();
  }, [status]);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const d = new FormData(form);
    const t = (k: string) => String(d.get(k) ?? '').trim();
    const found: Record<string, string> = {};
    if (!t('name')) found.name = 'Add your name.';
    if (!emailPattern.test(t('email'))) found.email = 'Add an email address the studio can reply to.';
    if (!t('message')) found.message = 'Write your question.';
    if (!consent) found.consent = 'Tick this so the studio can use your details to reply.';
    setErrors(found);
    if (Object.keys(found).length) {
      const first = Object.keys(found)[0];
      form.querySelector<HTMLElement>(`#contact-${first}`)?.focus();
      return;
    }
    setStatus('sending');
    try {
      const data = formDataFrom(form);
      data.set('subject', 'Question from the website (%{submissionId})');
      await submitNetlifyForm('contact', data);
      setStatus('sent');
    } catch {
      setStatus('failed');
    }
  }

  if (status === 'sent') {
    return (
      <p ref={doneRef} tabIndex={-1} role="status" className="border border-bone p-6 text-lead outline-none">
        Thanks. The studio has your message.
      </p>
    );
  }

  return (
    <form name="contact" method="POST" action="/sent" noValidate={enhanced} onSubmit={onSubmit} className="space-y-6">
      <input type="hidden" name="form-name" defaultValue="contact" />
      <Honeypot name={honeypotField} />
      <div className="grid gap-6 md:grid-cols-2 md:items-end">
        <Field id="contact-name" label="Your name" error={errors.name}>
          {(d) => <input id="contact-name" name="name" autoComplete="name" required aria-describedby={d} aria-invalid={errors.name ? true : undefined} className={controlClass} />}
        </Field>
        <Field id="contact-email" label="Email" error={errors.email}>
          {(d) => (
            <input id="contact-email" name="email" type="email" autoComplete="email" required aria-describedby={d} aria-invalid={errors.email ? true : undefined} className={controlClass} />
          )}
        </Field>
      </div>
      <Field id="contact-whatsapp" label="WhatsApp number" optional>
        {(d) => <input id="contact-whatsapp" name="whatsapp" type="tel" autoComplete="tel" aria-describedby={d} className={`${controlClass} num`} />}
      </Field>
      <Field id="contact-message" label="Your question" hint={<>Booking a tattoo? Use the <Link className="link" to="/contact#enquiry">booking enquiry</Link> instead, so it goes to the right artist.</>} error={errors.message}>
        {(d) => <textarea id="contact-message" name="message" rows={4} required aria-describedby={d} aria-invalid={errors.message ? true : undefined} className={controlClass} />}
      </Field>
      <Check id="contact-consent" name="consent" checked={consent} onChange={setConsent} error={errors.consent}>
        The studio may use these details to reply, as set out in the{' '}
        <Link className="link" to="/privacy">
          privacy notice
        </Link>
        .
      </Check>
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:gap-8">
        <button type="submit" disabled={status === 'sending'} className="ui border border-bone px-6 py-4 transition-colors duration-200 hover:bg-bone hover:text-ink disabled:opacity-60">
          {status === 'sending' ? 'Sending…' : 'Send your question'}
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
