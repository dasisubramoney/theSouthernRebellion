import type { ArtistSlug, FlashEntry } from './types.ts';
import { todo } from './todo.ts';

/**
 * Flash, keyed by artist slug.
 *
 * To mark a piece claimed: set `status: 'claimed'`. It stays on the page, marked as taken.
 * To remove a piece: delete the entry.
 * Entries with `status: null` are not shown. They are designs seen on Instagram
 * that the artist has not yet confirmed as flash.
 */

const draft = (artist: ArtistSlug, d: Pick<FlashEntry, 'id' | 'title' | 'alt' | 'seenIn'>): FlashEntry => ({
  imageKey: `flash/${artist}/${d.id}`,
  status: null,
  size: todo('Size'),
  price: todo('Price, or "quote on enquiry"'),
  repeatable: todo('Can this design be tattooed more than once?'),
  ...d,
});

export const flash: Record<ArtistSlug, FlashEntry[]> = {
  bram: [
    draft('bram', {
      id: 'woman-flower-headdress',
      title: 'Woman with flower headdress',
      alt: 'Black and grey design of a woman\'s face under a large flower and bow, with a curling ornament below',
      seenIn: 'bram-07.jpg, row 3, middle (drawing on white)',
    }),
    draft('bram', {
      id: 'crescent-moon-face',
      title: 'Crescent moon face',
      alt: 'Black and grey design of a woman\'s face inside a crescent moon, with flowing hair',
      seenIn: 'bram-08.jpg, row 1, right (drawing on white)',
    }),
  ],
  bron: [
    draft('bron', {
      id: 'ornament-sheet',
      title: 'Ornament sheet',
      alt: 'Sheet of nine small black ornaments on cream paper: diamonds, flowers and four-point stars, inside a double-ruled border',
      seenIn: 'bron-10.jpg, row 4, middle',
    }),
    draft('bron', {
      id: 'nouveau-woman',
      title: 'Art nouveau woman',
      alt: 'Art nouveau design of a woman\'s profile in red and pink with a decorative frame',
      seenIn: 'bron-10.jpg, row 2, right',
    }),
  ],
  theshen: [],
  rio: [],
  streetgypsy: [
    draft('streetgypsy', {
      id: 'moth-mouse',
      title: 'Moth-winged mouse',
      alt: 'Black linework design of a mouse with moth wings',
      seenIn: 'streetgypsy-19.jpg, row 5, left ("Flash tattoos" post)',
    }),
    draft('streetgypsy', {
      id: 'pomegranate-woman',
      title: 'Woman with pomegranates',
      alt: 'Black and grey design of a woman with curled hair and a spiked crown, with red pomegranates',
      seenIn: 'streetgypsy-20.jpg, row 3, right',
    }),
  ],
};

export const flashNotes = {
  howToClaim: todo(
    'How a client claims a flash piece (enquiry form, DM, first come first served?) and whether a deposit holds it',
    'Bron posts "Available Custom Flash". Theshen and Kimmy (streetgypsy) have "Flash" story highlights.',
  ),
  missing: [
    todo('Theshen\'s current flash (from his "Flash pieces" highlight)'),
    todo('Kimmy (streetgypsy)\'s current flash (from her "Flash" highlight)'),
    todo('Rio\'s flash, if she offers any'),
  ],
};

export function visibleFlash(slug: ArtistSlug) {
  return (flash[slug] ?? []).filter((f) => f.status !== null);
}
