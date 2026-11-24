import { useEffect, useId, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { StudioMark } from '../brand/StudioMark';
import { Dagger } from '../brand/Dagger';
import { useActiveSection } from '../../lib/activeSection';
import { press } from '../../lib/press';
import { effects } from '../../motion/effects';
import { ThemeSwitch } from './ThemeSwitch';
import { contactPath, primaryNav } from './nav';

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const panelId = useId();
  const buttonRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const { pathname, hash } = useLocation();
  const activeSection = useActiveSection();
  const onContact = pathname === contactPath;

  // Close on any navigation, including a tap on a link to a section of the page you are already on.
  useEffect(() => setOpen(false), [pathname, hash]);

  useEffect(() => {
    if (!open) return;
    const panel = panelRef.current;
    const focusables = () => Array.from(panel?.querySelectorAll<HTMLElement>('a[href], button') ?? []);
    focusables()[0]?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false);
        buttonRef.current?.focus();
        return;
      }
      if (e.key !== 'Tab') return;
      const items = [buttonRef.current, ...focusables()].filter((el): el is HTMLElement => el !== null);
      const first = items[0];
      const last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last?.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first?.focus();
      }
    };
    document.addEventListener('keydown', onKey);
    document.documentElement.classList.add('menu-open');
    return () => {
      document.removeEventListener('keydown', onKey);
      document.documentElement.classList.remove('menu-open');
    };
  }, [open]);

  return (
    <header className="sticky top-0 z-40 border-b border-coal bg-ink">
      <div className="shell flex h-16 items-center justify-between gap-6 md:h-20">
        <Link to="/" className="flex items-center gap-3" aria-label="The Southern Rebellion, home">
          <StudioMark className="size-10 text-bone md:size-12" disc={false} />
          <span className="lockup hidden leading-tight sm:block" aria-hidden="true">
            The Southern
            <br />
            Rebellion
          </span>
        </Link>

        <nav aria-label="Main" className="hidden lg:block">
          <ul className="flex items-center gap-7">
            {primaryNav.map((item) => {
              const isActive = activeSection === item.id;
              return (
                <li key={item.id}>
                  <Link
                    to={item.to}
                    aria-current={isActive ? 'location' : undefined}
                    className="group ui relative flex items-center gap-1.5 py-2"
                  >
                    <Dagger
                      className={`h-3.5 w-auto transition-opacity duration-200 ${
                        isActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-60'
                      }`}
                    />
                    <span>{item.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="flex items-center gap-3">
          <ThemeSwitch />
          <Link
            to={contactPath}
            aria-current={onContact ? 'page' : undefined}
            className={`ui inline-block border border-bone px-4 py-3 hover:bg-bone hover:text-ink ${press}`}
          >
            <span className="md:hidden">Book</span>
            <span className="hidden md:inline">Send a booking enquiry</span>
          </Link>
          <button
            ref={buttonRef}
            type="button"
            className={`ui relative z-50 py-3 lg:hidden ${press}`}
            aria-expanded={open}
            aria-controls={panelId}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? 'Close' : 'Menu'}
          </button>
        </div>
      </div>

      {/*
        Closed, the panel is invisible (visibility: hidden), which also takes it out of the tab order and
        the accessibility tree. With effects.menu it fades and drops 8px in over 200ms and leaves over
        150ms. Opening, visibility is not transitioned, so the panel is visible at once and the first link
        can take focus; closing, it is, so the panel stays visible until it has faded out.
      */}
      <div
        id={panelId}
        ref={panelRef}
        className={`fixed inset-0 z-40 overflow-y-auto bg-ink pt-20 lg:hidden ${
          effects.menu
            ? `ease-(--ease-quick) ${open ? 'transition-[opacity,translate] duration-200' : 'transition-[opacity,translate,visibility] duration-150'}`
            : ''
        } ${open ? 'visible opacity-100' : 'invisible -translate-y-2 opacity-0'}`}
      >
        <nav aria-label="Main, mobile" className="shell pb-12">
          <ul className="border-t border-coal">
            {primaryNav.map((item) => {
              const isActive = activeSection === item.id;
              return (
                <li key={item.id} className="border-b border-coal">
                  <Link
                    to={item.to}
                    aria-current={isActive ? 'location' : undefined}
                    onClick={() => setOpen(false)}
                    className="flex items-center justify-between py-4 font-display text-h3"
                  >
                    <span>{item.label}</span>
                    {isActive ? <Dagger point="left" className="h-4 w-auto" /> : null}
                  </Link>
                </li>
              );
            })}
          </ul>
          <Link
            to={contactPath}
            onClick={() => setOpen(false)}
            className={`ui mt-8 block border border-bone px-4 py-4 text-center ${press}`}
          >
            Send a booking enquiry
          </Link>
        </nav>
      </div>
    </header>
  );
}
