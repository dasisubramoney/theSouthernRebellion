import type { Maybe, Todo } from './todo.ts';

export type ArtistSlug = 'bram' | 'bron' | 'theshen' | 'rio' | 'streetgypsy';

export type BookingChannel =
  | { kind: 'form' }
  | { kind: 'whatsapp'; number: string; display: string }
  | { kind: 'email'; user: string; domain: string }
  | { kind: 'instagram-dm'; handle: string };

export interface Artist {
  slug: ArtistSlug;
  /** Name as shown on the site. */
  name: string;
  /** Full name, only where the artist states it publicly. */
  fullName: Maybe<string>;
  /** Only where the artist states them. */
  pronouns: string | null;
  instagram: string;
  /** Other accounts the artist links from their own bio. */
  otherAccounts: { handle: string; label: string }[];
  /** Lines from their own Instagram bio, verbatim apart from emoji. Source of truth for facts. */
  bioLines: string[];
  /** One line from their own bio to quote at the top of their page, or null. */
  introQuote: string | null;
  /** Styles seen in their grid. Replace with their own words when supplied. */
  styles: string[];
  stylesInOwnWords: Maybe<string>;
  bio: Maybe<string>;
  yearsTattooing: Maybe<string>;
  portrait: Maybe<{ imageKey: string; alt: string; consentConfirmed: boolean }>;
  /** Primary route first. The site form is primary for everyone; the rest are the artist's own channels. */
  booking: BookingChannel[];
  bookingNote: Maybe<string>;
  /** true: presented as a piercer on the site. false: not presented as one. */
  pierces: Maybe<boolean>;
  /** Short phrases from the artist's own posts that can be quoted on their page. */
  ownWords: string[];
  /** Hidden until the client confirms the artist and the page. */
  published: boolean;
  openQuestions: Todo[];
}

export type PortfolioFlag =
  /** Swear word in the tattoo itself. Fine to show; never in headings, alt summaries or meta. */
  | 'profanity'
  /** A trademarked character or a third party's artwork. Client decides. */
  | 'third-party-character'
  /** A recognisable real person's likeness. Client decides. */
  | 'likeness'
  /** A name or date that may identify the client or a family member. */
  | 'personal-name'
  /** The client's face is visible. Needs explicit consent. */
  | 'face';

export interface PortfolioEntry {
  id: string;
  /** Path under media/ without extension. The original goes at media/<imageKey>.jpg */
  imageKey: string;
  kind: 'tattoo' | 'piercing';
  /** Describes style, subject and placement. Never repeats profanity or personal names. */
  alt: string;
  style: string;
  placement: Maybe<string>;
  palette: 'black and grey' | 'colour' | 'blackwork' | 'black and grey with colour' | null;
  healed: boolean | null;
  /** POPIA: false until the client confirms the person in the photo agreed to it being on the site. */
  consentConfirmed: boolean;
  flags: PortfolioFlag[];
  /** Hidden until the client decides. Set to null once decided to show. */
  needsDecision: string | null;
  /** Where it was seen in /brief/instagram, so the client can find the original. */
  seenIn: string;
  featured?: boolean;
}

export interface ExcludedImage {
  artist: ArtistSlug | 'unknown';
  description: string;
  reason: string;
  seenIn: string;
}

export interface FlashEntry {
  id: string;
  imageKey: string;
  title: string;
  alt: string;
  /** null until the artist confirms. Entries with null status are not shown. */
  status: 'available' | 'claimed' | null;
  size: Maybe<string>;
  price: Maybe<string>;
  /** Repeatable designs can be tattooed more than once. */
  repeatable: Maybe<boolean>;
  seenIn: string;
}
