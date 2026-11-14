import { lazy } from 'react';
import { publishedArtists } from './content/artists';

const load = {
  home: () => import('./pages/Home'),
  artists: () => import('./pages/Artists'),
  artist: () => import('./pages/Artist'),
  flash: () => import('./pages/Flash'),
  piercing: () => import('./pages/Piercing'),
  book: () => import('./pages/Book'),
  sent: () => import('./pages/Sent'),
  aftercare: () => import('./pages/Aftercare'),
  visit: () => import('./pages/Visit'),
  privacy: () => import('./pages/Privacy'),
  notFound: () => import('./pages/NotFound'),
};

export const Home = lazy(load.home);
export const Artists = lazy(load.artists);
export const Artist = lazy(load.artist);
export const Flash = lazy(load.flash);
export const Piercing = lazy(load.piercing);
export const Book = lazy(load.book);
export const Sent = lazy(load.sent);
export const Aftercare = lazy(load.aftercare);
export const Visit = lazy(load.visit);
export const Privacy = lazy(load.privacy);
export const NotFound = lazy(load.notFound);

/** Fetches a route's code ahead of navigation, so the page is ready when the blade lifts. */
export function preloadRoute(pathname: string) {
  const [first = '', second] = pathname.split('/').filter(Boolean);
  const key =
    first === ''
      ? 'home'
      : first === 'artists'
        ? second
          ? 'artist'
          : 'artists'
        : first in load
          ? (first as keyof typeof load)
          : 'notFound';
  return load[key]().catch(() => undefined);
}

/** Every URL the sitemap lists. All are prerendered. */
export const staticPaths = [
  '/',
  '/artists',
  ...publishedArtists.map((a) => `/artists/${a.slug}`),
  '/flash',
  '/piercing',
  '/book',
  '/aftercare',
  '/visit',
  '/privacy',
];

/** Prerendered but kept out of the sitemap (they carry noindex). */
export const unlistedPaths = ['/sent'];
