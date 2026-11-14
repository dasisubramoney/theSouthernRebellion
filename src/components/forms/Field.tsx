import type { ReactNode } from 'react';

type FieldProps = {
  id: string;
  label: string;
  hint?: ReactNode;
  error?: string;
  optional?: boolean;
  children: (describedBy: string | undefined) => ReactNode;
  className?: string;
};

/**
 * Label, hint and error wired to the control with aria-describedby.
 * Errors are text first; colour only reinforces them.
 */
export function Field({ id, label, hint, error, optional, children, className = '' }: FieldProps) {
  const hintId = hint ? `${id}-hint` : undefined;
  const errorId = error ? `${id}-error` : undefined;
  const describedBy = [hintId, errorId].filter(Boolean).join(' ') || undefined;
  return (
    <div className={className}>
      <label htmlFor={id} className="block font-semibold">
        {label}
        {optional ? <span className="font-normal text-ash"> (optional)</span> : null}
      </label>
      {hint ? (
        <p id={hintId} className="mt-1 text-small text-ash">
          {hint}
        </p>
      ) : null}
      <div className="mt-2">{children(describedBy)}</div>
      {error ? (
        <p id={errorId} className="mt-2 text-small font-semibold text-alert-on-ink">
          {error}
        </p>
      ) : null}
    </div>
  );
}

/** Shared control styling: pewter border (3.5:1 on ink), bone focus ring. */
export const controlClass =
  'block w-full border border-pewter bg-ink px-3 py-3 text-bone placeholder:text-ash focus:border-bone focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-bone aria-[invalid=true]:border-alert-on-ink';

type ChoiceProps = {
  name: string;
  legend: string;
  options: readonly string[];
  value: string;
  onChange: (v: string) => void;
  error?: string;
  required?: boolean;
};

export function ChoiceGroup({ name, legend, options, value, onChange, error, required }: ChoiceProps) {
  const errorId = error ? `${name}-error` : undefined;
  return (
    <fieldset aria-describedby={errorId}>
      <legend className="font-semibold">{legend}</legend>
      <div className="mt-3 flex flex-wrap gap-2">
        {options.map((o) => (
          <label
            key={o}
            className="flex cursor-pointer items-center gap-2 border border-pewter px-4 py-3 has-[:checked]:border-bone has-[:checked]:bg-bone has-[:checked]:text-ink has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-bone"
          >
            <input
              type="radio"
              name={name}
              value={o}
              checked={value === o}
              onChange={() => onChange(o)}
              required={required}
              className="visually-hidden"
            />
            {o}
          </label>
        ))}
      </div>
      {error ? (
        <p id={errorId} className="mt-2 text-small font-semibold text-alert-on-ink">
          {error}
        </p>
      ) : null}
    </fieldset>
  );
}

type CheckProps = {
  id: string;
  name: string;
  children: ReactNode;
  checked: boolean;
  onChange: (v: boolean) => void;
  error?: string;
};

export function Check({ id, name, children, checked, onChange, error }: CheckProps) {
  const errorId = error ? `${id}-error` : undefined;
  return (
    <div>
      <div className="flex items-start gap-3">
        <input
          id={id}
          type="checkbox"
          name={name}
          value="yes"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          required
          aria-invalid={error ? true : undefined}
          aria-describedby={errorId}
          className="mt-1 size-5 shrink-0 accent-bone"
        />
        <label htmlFor={id}>{children}</label>
      </div>
      {error ? (
        <p id={errorId} className="mt-2 pl-8 text-small font-semibold text-alert-on-ink">
          {error}
        </p>
      ) : null}
    </div>
  );
}

/** Visually hidden trap field. Real people never see or fill it. */
export function Honeypot({ name }: { name: string }) {
  return (
    <p className="visually-hidden" aria-hidden="true">
      <label>
        Leave this empty
        <input type="text" name={name} tabIndex={-1} autoComplete="off" />
      </label>
    </p>
  );
}
