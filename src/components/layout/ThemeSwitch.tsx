import { useTheme } from '../../lib/theme';

function Moon({ className }: { className: string }) {
  return (
    <svg viewBox="0 0 16 16" className={className} aria-hidden="true" focusable="false">
      <path fill="currentColor" d="M10.6 1.4a6.6 6.6 0 1 0 4 11.4A5.6 5.6 0 0 1 10.6 1.4Z" />
    </svg>
  );
}

function Sun({ className }: { className: string }) {
  return (
    <svg viewBox="0 0 16 16" className={className} aria-hidden="true" focusable="false">
      <circle cx="8" cy="8" r="3.2" fill="currentColor" />
      <g stroke="currentColor" strokeWidth="1.4" strokeLinecap="round">
        <path d="M8 1v1.6M8 13.4V15M1 8h1.6M13.4 8H15M3.05 3.05l1.13 1.13M11.82 11.82l1.13 1.13M3.05 12.95l1.13-1.13M11.82 4.18l1.13-1.13" />
      </g>
    </svg>
  );
}

/**
 * Light/dark switch for the header. A square-cornered track (the design's hairline rule)
 * and a round knob, after the logo's disc. The knob carries the current mode's icon:
 * moon on the right for dark (the default), sun on the left for light. The other icon
 * shows faintly in the empty half, so the switch says what it does.
 */
export function ThemeSwitch() {
  const { theme, toggle, ready } = useTheme();
  const dark = theme === 'dark';
  return (
    <button
      type="button"
      role="switch"
      aria-checked={dark}
      aria-label="Dark mode"
      title={dark ? 'Switch to light mode' : 'Switch to dark mode'}
      onClick={toggle}
      className="relative inline-flex h-7 w-13 shrink-0 items-center rounded-hair border border-current/50 transition-colors duration-200 hover:border-current"
    >
      {/* Faint icon for the mode you would switch to, in the half the knob is not in. */}
      <Sun className={`absolute left-1.5 size-3.5 transition-opacity duration-200 ${dark ? 'opacity-50' : 'opacity-0'}`} />
      <Moon className={`absolute right-1.5 size-3.5 transition-opacity duration-200 ${dark ? 'opacity-0' : 'opacity-50'}`} />
      <span
        aria-hidden="true"
        className={`absolute top-0.5 left-0.5 flex size-5.5 items-center justify-center [border-radius:50%] bg-bone text-ink ${
          ready ? 'transition-transform duration-300 ease-(--ease-settle)' : ''
        } ${dark ? 'translate-x-6' : 'translate-x-0'}`}
      >
        {dark ? <Moon className="size-3" /> : <Sun className="size-3" />}
      </span>
    </button>
  );
}
