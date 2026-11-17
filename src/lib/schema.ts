import { studio } from '../content/studio';
import { known } from '../content/todo';
import type { Artist } from '../content/types';
import { instagramUrl } from './links';

export function artistPerson(a: Artist) {
  return {
    '@type': 'Person',
    name: known(a.fullName) ?? a.name,
    alternateName: known(a.fullName) ? a.name : undefined,
    jobTitle: a.pierces === true ? 'Tattoo artist and body piercer' : 'Tattoo artist',
    url: `${studio.origin}/artists/${a.slug}`,
    sameAs: [instagramUrl(a.instagram)],
    worksFor: { '@id': `${studio.origin}/#studio` },
  };
}

/** TattooParlor (a LocalBusiness subtype). Street address is added once the client supplies it. */
export function studioSchema() {
  const street = known(studio.location.street);
  const postal = known(studio.location.postalCode);
  return {
    '@context': 'https://schema.org',
    '@type': 'TattooParlor',
    '@id': `${studio.origin}/#studio`,
    name: studio.legalName,
    alternateName: studio.name,
    url: `${studio.origin}/`,
    telephone: studio.phoneE164,
    image: `${studio.origin}/og/studio.png`,
    logo: `${studio.origin}/icon-512.png`,
    address: {
      '@type': 'PostalAddress',
      ...(street ? { streetAddress: street } : {}),
      ...(postal ? { postalCode: postal } : {}),
      addressLocality: studio.location.city,
      addressRegion: studio.location.province,
      addressCountry: studio.location.country,
    },
    sameAs: [instagramUrl(studio.instagram)],
    // The artists' Person entries (artistPerson, above) are left out while there are no artist pages.
    // To restore: add `employee: publishedArtists.map(artistPerson)` here once the pages are back.
  };
}
