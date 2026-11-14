import type { ReactNode } from 'react';
import { SiteHeader } from './SiteHeader';
import { SiteFooter } from './SiteFooter';
import { SmoothScroll } from '../../lib/SmoothScroll';

/** Focus and scroll after navigation are handled in PageRoutes, once the new page is on screen. */
export function Layout({ children }: { children: ReactNode }) {
  return (
    <>
      <a
        href="#main"
        className="ui fixed left-4 top-4 z-50 -translate-y-24 bg-bone px-4 py-3 text-ink focus:translate-y-0"
      >
        Skip to content
      </a>
      <SiteHeader />
      <main id="main" tabIndex={-1} className="outline-none">
        {children}
      </main>
      <SiteFooter />
      <SmoothScroll />
    </>
  );
}
