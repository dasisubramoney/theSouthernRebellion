import { useEffect, useId, useRef, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { StudioMark } from '../brand/StudioMark';
import { Dagger } from '../brand/Dagger';
import { primaryNav } from './nav';

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const panelId = useId();
  const buttonRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const { pathname } = useLocation();

  useEffect(() => setOpen(false), [pathname]);

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
    <header className="relative z-40 border-b border-coal">
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
            {primaryNav.map((item) => (
              <li key={item.to}>
                <NavLink to={item.to} className="group ui relative flex items-center gap-1.5 py-2">
                  {({ isActive }) => (
                    <>
                      <Dagger
                        className={`h-3.5 w-auto transition-opacity duration-200 ${
                          isActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-60'
                        }`}
                      />
                      <span>{item.label}</span>
                    </>
                  )}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-3">
          <Link
            to="/book#enquiry"
            className="ui hidden border border-bone px-4 py-3 transition-colors duration-200 hover:bg-bone hover:text-ink md:inline-block"
          >
            Send a booking enquiry
          </Link>
          <button
            ref={buttonRef}
            type="button"
            className="ui relative z-50 py-3 lg:hidden"
            aria-expanded={open}
            aria-controls={panelId}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? 'Close' : 'Menu'}
          </button>
        </div>
      </div>

      <div id={panelId} ref={panelRef} hidden={!open} className="fixed inset-0 z-40 overflow-y-auto bg-ink pt-20 lg:hidden">
        <nav aria-label="Main, mobile" className="shell pb-12">
          <ul className="border-t border-coal">
            {primaryNav.map((item) => (
              <li key={item.to} className="border-b border-coal">
                <NavLink to={item.to} className="flex items-center justify-between py-4 font-display text-h3">
                  {({ isActive }) => (
                    <>
                      <span>{item.label}</span>
                      {isActive ? <Dagger point="left" className="h-4 w-auto" /> : null}
                    </>
                  )}
                </NavLink>
              </li>
            ))}
          </ul>
          <Link to="/book#enquiry" className="ui mt-8 block border border-bone px-4 py-4 text-center">
            Send a booking enquiry
          </Link>
        </nav>
      </div>
    </header>
  );
}
