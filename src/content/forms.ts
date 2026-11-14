import { publishedArtists } from './artists.ts';

/**
 * Netlify only routes notifications per form, so each artist has a form name.
 * Field names must match the BookingForm component. The prerender step writes
 * a hidden copy of every form into index.html so Netlify registers them.
 */
export const bookingFields = [
  'name',
  'email',
  'whatsapp',
  'artist',
  'kind',
  'placement',
  'size',
  'colour',
  'description',
  'reference1',
  'reference2',
  'reference3',
  'budget',
  'availability',
  'age',
  'consent',
  'subject',
] as const;

export const fileFields = new Set(['reference1', 'reference2', 'reference3']);

export const bookingFormNames = [
  ...publishedArtists.map((a) => `booking-${a.slug}`),
  'booking-unsure',
  'booking-piercing',
];

export const contactFields = ['name', 'email', 'whatsapp', 'message', 'consent', 'subject'] as const;

export const honeypotField = 'company';
