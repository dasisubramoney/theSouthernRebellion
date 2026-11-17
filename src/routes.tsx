import { lazy } from 'react';

const load = {
  home: () => import('./pages/Home'),
  contact: () => import('./pages/Contact'),
  sent: () => import('./pages/Sent'),
  privacy: () => import('./pages/Privacy'),
  notFound: () => import('./pages/NotFound'),
};

export const Home = lazy(load.home);
export const Contact = lazy(load.contact);
export const Sent = lazy(load.sent);
export const Privacy = lazy(load.privacy);
export const NotFound = lazy(load.notFound);

/** Fetches a route's code ahead of navigation, so the page is ready when the blade lifts. */
export function preloadRoute(pathname: string) {
  const [first = ''] = pathname.split('/').filter(Boolean);
  const key = first === '' ? 'home' : first in load ? (first as keyof typeof load) : 'notFound';
  return load[key]().catch(() => undefined);
}

/** Every URL the sitemap lists. All are prerendered. */
export const staticPaths = ['/', '/contact', '/privacy'];

/** Prerendered but kept out of the sitemap (they carry noindex). */
export const unlistedPaths = ['/sent'];
