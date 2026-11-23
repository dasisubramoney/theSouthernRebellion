/**
 * The five sections of the home page, after the hero. `id` is the section's element id on "/", and `to` is
 * where the link goes from either page: on "/" it scrolls, from /contact it navigates.
 */
export const primaryNav = [
  { id: 'artists', to: '/#artists', label: 'Artists' },
  { id: 'piercing', to: '/#piercing', label: 'Piercing' },
  { id: 'how-to-book', to: '/#how-to-book', label: 'How to book' },
  { id: 'aftercare', to: '/#aftercare', label: 'Aftercare' },
  { id: 'gallery', to: '/#gallery', label: 'Gallery' },
] as const;

export type SectionId = (typeof primaryNav)[number]['id'];

/** The page for booking enquiries and questions. */
export const contactPath = '/contact';
