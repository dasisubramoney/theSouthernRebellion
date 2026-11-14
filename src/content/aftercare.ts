import type { Maybe } from './todo.ts';
import { todo } from './todo.ts';

type Section = { heading: string; body: Maybe<string> };

/**
 * Aftercare structure only. Every instruction must come from the studio.
 * Do not fill these in from general advice: it is medical guidance and the
 * studio is responsible for it.
 */
export const aftercare = {
  reviewedBy: todo('Who at the studio signs off the aftercare text, and the date it was last reviewed'),

  tattoo: [
    { heading: 'The first few hours', body: todo('Wrap or film: how long to keep it on, how to take it off') },
    { heading: 'Washing', body: todo('How often, with what') },
    { heading: 'Moisturising', body: todo('Which products the studio recommends, how much, how often') },
    { heading: 'The first two weeks', body: todo('What is normal: peeling, itching, cloudiness') },
    { heading: 'What to avoid', body: todo('Sun, swimming, gym, scratching, tight clothes: for how long') },
    { heading: 'Touch-ups', body: todo('Touch-up policy: free within a period? how to book') },
    { heading: 'When to call us, and when to see a doctor', body: todo('Signs that need the studio, and signs that need medical help') },
  ] satisfies Section[],

  piercing: [
    { heading: 'Cleaning', body: todo('Saline or other: how often, how') },
    { heading: 'Healing times', body: todo('Typical healing times per piercing, from the studio') },
    { heading: 'Sleeping and day-to-day', body: todo('Sleeping on it, phones and earrings, makeup, hats') },
    { heading: 'What to avoid', body: todo('Swimming, twisting, changing jewellery early: for how long') },
    { heading: 'Downsizing and changing jewellery', body: todo('When to come back to downsize, and when it is safe to change jewellery') },
    { heading: 'When to call us, and when to see a doctor', body: todo('Signs that need the studio, and signs that need medical help') },
  ] satisfies Section[],
};
