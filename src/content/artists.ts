import type { Artist } from './types.ts';
import { todo } from './todo.ts';

const shopWhatsApp = { kind: 'whatsapp', number: '27645075342', display: '064 507 5342' } as const;
const shopEmail = { kind: 'email', user: 'info', domain: 'thesouthernrebellion.co.za' } as const;

const portraitTodo = (name: string) => todo(`Portrait photo of ${name} (high-res original, not an Instagram screenshot)`);
const bioTodo = (name: string) => todo(`Short bio for ${name}, in their own words`);

export const artists: Artist[] = [
  {
    slug: 'bram',
    name: 'Bram',
    /** As he signed the onboarding questionnaire. Used only in structured data. */
    fullName: 'Bramley Luttig',
    pronouns: null,
    instagram: 'bram_luttig_tattoos',
    otherAccounts: [],
    bioLines: ['Tattoo artist', '@thesouthernrebellion', '@proper.tattoosupply – Pro Artist', 'Bookings / enquiries: 064 507 5342'],
    introQuote: null,
    styles: ['Neo-traditional', 'Neo-Japanese', 'Geometric', 'Black and grey'],
    stylesInOwnWords: 'Neo-Traditional / Neo-Japanese / Geometric / Black & Grey',
    bio: bioTodo('Bram'),
    yearsTattooing: todo('Year Bram started tattooing'),
    portrait: portraitTodo('Bram'),
    booking: [{ kind: 'form' }, shopWhatsApp],
    bookingNote: todo(
      'How Bram takes bookings (consult first? design fee?)',
      'Bram has a "How to…" story highlight on Instagram. Its contents were not in the screenshots.',
    ),
    pierces: false,
    ownWords: [],
    published: true,
    openQuestions: [
      todo('Where linktr.ee/bram_tattoos points, and whether any booking tool on it should be linked from the site'),
      todo('Whether to mention the @proper.tattoosupply Pro Artist role on his page'),
      todo('Vector file of Bram\'s single-dagger mark (currently traced from his profile picture)'),
    ],
  },
  {
    slug: 'bron',
    name: 'Bron',
    fullName: 'Bronwyn Luttig',
    pronouns: null,
    instagram: 'bron_tattoos',
    otherAccounts: [],
    bioLines: ['Tattoo artist', 'Co-Owner of @thesouthernrebellion', 'Randburg (jhb)', 'Email for bookings & enquiries: info@thesouthernrebellion.co.za'],
    introQuote: null,
    styles: ['Blackwork', 'Ornamental', 'Colour'],
    stylesInOwnWords: 'Blackwork / Ornamental / Colour',
    bio: bioTodo('Bron'),
    yearsTattooing: todo('Year Bron started tattooing'),
    portrait: portraitTodo('Bron'),
    booking: [{ kind: 'form' }, shopEmail],
    bookingNote: todo('How Bron takes bookings, and how custom flash is claimed'),
    /** The questionnaire names Rio as the only piercer. */
    pierces: false,
    ownWords: ['Available custom flash', 'Some of the smaller tattoos I have done'],
    published: true,
    openQuestions: [todo('Whether "Co-Owner" should appear on her page')],
  },
  {
    slug: 'theshen',
    name: 'Theshen',
    fullName: 'Theshen Phillip',
    pronouns: null,
    instagram: 'savage_ink_sa',
    otherAccounts: [],
    bioLines: ['Black and grey realism artist in JHB', '@thesouthernrebellion', 'To book: WhatsApp 0645075342 or DM me'],
    introQuote: 'Black and grey realism artist in JHB',
    styles: ['Fine-line', 'Black and grey realism'],
    stylesInOwnWords: 'Fine-line / Black & Grey Realism',
    bio: bioTodo('Theshen'),
    yearsTattooing: todo('Year Theshen started tattooing'),
    portrait: portraitTodo('Theshen'),
    booking: [{ kind: 'form' }, shopWhatsApp, { kind: 'instagram-dm', handle: 'savage_ink_sa' }],
    bookingNote: todo('How Theshen takes bookings for large work (sleeves, back pieces): consult, sessions, day rate'),
    pierces: false,
    ownWords: [],
    published: true,
    openQuestions: [
      todo('Vector file of the "Savage" mark, and whether it should appear on his page'),
      todo('Contents of his "Designs", "Flash pieces" and "Healed" highlights, for the flash and portfolio pages'),
    ],
  },
  {
    slug: 'rio',
    name: 'Rio',
    fullName: 'Rio Wallis Ashington',
    pronouns: 'she/her',
    instagram: 'xxrio.ashington.tattoosxx',
    otherAccounts: [
      { handle: 'xxrioashington_artxx', label: 'Art' },
      { handle: 'xxrio.wallis.ashingtonxx', label: 'Personal' },
    ],
    bioLines: ['Tattoo Artist & Body Piercer', '@thesouthernrebellion', 'Tattooing since Oct 2017', 'Body piercer (2016)'],
    introQuote: null,
    styles: ['Illustrative', 'Body piercing'],
    stylesInOwnWords: 'Illustrative',
    bio: bioTodo('Rio'),
    yearsTattooing: 'Tattooing since October 2017. Piercing since 2016.',
    portrait: portraitTodo('Rio'),
    booking: [{ kind: 'form' }],
    bookingNote: todo('How Rio takes tattoo bookings and piercing appointments (her bio gives no booking route)'),
    pierces: true,
    ownWords: ['This is your sign to get a tattoo'],
    published: true,
    openQuestions: [todo('Whether to link her personal account from the site, or only the art account')],
  },
  {
    slug: 'streetgypsy',
    /**
     * The questionnaire lists her as "Kimmy (streetgypsy)": Kimmy and streetgypsy are the same artist.
     * The slug stays "streetgypsy" so existing links (/#artist-streetgypsy, /artists/streetgypsy) keep working.
     */
    name: 'Kimmy',
    fullName: todo('Kimmy\'s surname, if she wants it in the site\'s structured data', 'Questionnaire: "Kimmy (streetgypsy)"'),
    pronouns: null,
    instagram: 'streetgypsy_tattoo',
    otherAccounts: [],
    bioLines: ['Tattoos for the Unique & Curious', 'Books are open', 'South Africa Johannesburg', 'DM for availability'],
    introQuote: 'Tattoos for the Unique & Curious',
    styles: ['Traditional', 'Realism', 'Combining the styles'],
    stylesInOwnWords: 'Traditional / Realism..... combining the styles',
    bio: bioTodo('Kimmy'),
    yearsTattooing: todo('Year Kimmy started tattooing'),
    portrait: portraitTodo('Kimmy'),
    booking: [{ kind: 'form' }, { kind: 'instagram-dm', handle: 'streetgypsy_tattoo' }],
    bookingNote: todo(
      'Kimmy\'s booking terms and day rate',
      'She has a "My DAY RATES as a tattoo artist with an interest in mixing styles" post. Only the cover was in the screenshots.',
    ),
    pierces: false,
    ownWords: ['Tattoos for the unique and curious', 'Books are open'],
    published: true,
    openQuestions: [
      todo('The number behind the WhatsApp button on her profile: the shop number or her own?'),
      todo('Her "Reviews" highlight: may the site quote any of them, with the client\'s permission?'),
    ],
  },
];

export const publishedArtists = artists.filter((a) => a.published);

export function getArtist(slug: string | undefined) {
  return publishedArtists.find((a) => a.slug === slug);
}
