import type { Maybe } from './todo.ts';
import { todo } from './todo.ts';

type Step = { title: string; body: Maybe<string> };

/**
 * The booking process. Only step 1 is known (it is how this site works).
 * Everything else must come from the studio. Do not invent prices or terms.
 */
export const booking = {
  primaryRoute:
    'Send a booking enquiry through the form on this site. It goes straight to the artist you choose. If you are not sure who to pick, choose "Not sure, help me choose" and the studio will match you.',

  steps: [
    {
      title: 'Send an enquiry to your artist',
      body: 'Use the form below. Tell us the placement, the rough size, colour or black and grey, and add up to three reference images.',
    },
    {
      title: 'Hear back from the artist',
      body: todo(
        'How and when the reply comes (WhatsApp? email? how long it usually takes), and who sends it: the artist, or Bram and Bron for the studio',
        'The questionnaire says Bramley and Bronwyn answer enquiries. The site sends each enquiry as that artist\'s own form and says it is "with" the artist.',
      ),
    },
    { title: 'Consult and design', body: todo('Is there a consult? Is it free? When is the design shown: before the day, or on the day?') },
    { title: 'Pay the deposit', body: todo('How to pay the deposit (EFT? in studio?) and what happens next') },
    { title: 'Come in for your session', body: todo('What to bring (ID, food, water), arriving on time, how long sessions run') },
  ] satisfies Step[],

  policies: {
    deposits: todo('Deposit amount or rule, and whether it comes off the final price'),
    designFee: todo('Design fees, if any, and whether they are refundable'),
    designTime: todo('How long custom designs take'),
    reschedule: todo('Reschedule policy: how much notice, and what happens to the deposit'),
    noShow: todo('No-show policy'),
    minimum: todo('Shop minimum'),
    dayRates: todo(
      'Day rates per artist, if they should be published',
      'Kimmy (streetgypsy) has a "My DAY RATES" post; only its cover was in the screenshots.',
    ),
    age: todo('Exact age policy for tattoos and what ID is required'),
    coverUps: todo('Whether the studio takes cover-ups and reworks, and how to enquire'),
    payment: todo('Payment methods accepted in the studio'),
  },

  form: {
    kinds: ['Tattoo', 'Piercing'],
    palettes: ['Black and grey', 'Colour', 'Not sure yet'],
    /** The visible form's "not sure" option routes to booking-unsure. */
    unsureLabel: 'Not sure, help me choose',
    sizeHint: 'Rough size in centimetres, or compare it to something: "palm-sized", "half the forearm"',
    budgetRanges: todo('Budget ranges to offer in the form, or leave it as free text'),
    availabilityHint: 'Days and times that usually work for you',
    references: {
      maxFiles: 3,
      acceptedTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/heic'],
      /**
       * Netlify caps the whole request (files and text) at 8 MB and times uploads out
       * after 30 seconds. 7 MB of files leaves room for the text fields. Large photos
       * are scaled down in the browser before this is checked.
       */
      maxTotalBytes: 7 * 1024 * 1024,
    },
    ageConfirmation: todo(
      'Exact wording for the age checkbox, based on the studio\'s age policy (the form says "I am 18 or older" until then)',
    ),
  },
};
