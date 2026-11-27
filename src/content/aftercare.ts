import type { Maybe, Todo } from './todo.ts';
import { todo } from './todo.ts';

/**
 * A step: one paragraph, or several short instructions shown as a list. `open` is a question still
 * open about a step the studio's text only partly answers; it shows as a TODO under the text.
 */
type Section = { heading: string; body: Maybe<string | readonly string[]>; open?: Todo };

/**
 * The studio's own aftercare, from "Tattoo Aftercare.pdf" and "Piercing Aftercare.pdf" in the
 * onboarding Drive folder (Nov 2026). Only spelling and reading order are tidied: the wording and
 * every instruction are the studio's. Do not add general advice from elsewhere: it is medical
 * guidance and the studio is responsible for it. Steps the PDFs don't cover stay as TODOs.
 */
export const aftercare = {
  reviewedBy: todo('Who at the studio signs off the aftercare text, and the date it was last reviewed'),

  tattoo: [
    {
      heading: 'The first few hours',
      body: [
        'Leave the plastic wrap or protective gel on your tattoo for at least 2 to 3 hours after your session.',
        'Make sure your hands are clean before you take it off.',
      ],
    },
    {
      heading: 'Washing',
      body: [
        'Gently wash your tattoo with your hands and warm soapy water, until all the blood plasma is off.',
        'Use Dove unscented or Protex Gentle bar soap.',
        'Wash your tattoo every morning and evening.',
        'Gently pat it dry with a clean piece of paper towel.',
      ],
    },
    {
      heading: 'Moisturising',
      body: [
        'Let your tattoo air-dry for around 20 minutes before you apply cream. Don’t let anything dirty touch it while it dries.',
        'Then apply a small amount of Epimax, E45 or unscented aqueous cream.',
        'Apply the cream 3 to 4 times a day. Don’t over-moisturise your tattoo.',
      ],
    },
    {
      heading: 'The first two weeks',
      body: [
        'Your tattoo can take up to 2 weeks to heal fully.',
        'While it heals it will itch and form light scabs. Don’t scratch or pick off the scabs: let them fall off naturally.',
        'Give your tattoo a few slaps to ease the itching.',
      ],
    },
    {
      heading: 'What to avoid',
      body: [
        'Don’t soak your tattoo in the bath or shower. No swimming or saunas.',
        'No intense activities for the first few days, and clean your tattoo after any activity.',
        'If you have pets, don’t let them come into close contact with your healing tattoo. Their hair can cause infections and slow the healing.',
        'Don’t pick your tattoo. Keep it clean. Keep it moisturised.',
      ],
      open: todo('Sun: how long to keep the tattoo out of the sun, and sunscreen once it has healed', 'The tattoo aftercare PDF does not mention sun.'),
    },
    { heading: 'Touch-ups', body: todo('Touch-up policy: free within a period? how to book') },
    {
      heading: 'When to call us, and when to see a doctor',
      body: todo('Signs that need the studio, and signs that need medical help', 'The tattoo aftercare PDF does not cover this.'),
    },
  ] satisfies Section[],

  piercing: [
    {
      heading: 'Cleaning',
      body: [
        'Wash your hands thoroughly before you clean or touch your piercing.',
        'Spray it with sterile saline only while it heals. You don’t need to move or turn the jewellery when you clean it, and doing so can irritate the piercing.',
        'Dry it with clean, disposable gauze or cotton swabs, gently removing any crust. Avoid cloth towels: they can carry bacteria and snag on the jewellery.',
      ],
    },
    {
      heading: 'What is normal',
      body: [
        'At first: some bleeding, swelling, tenderness or bruising is completely normal. If you have a lot of pain, swelling or tenderness, you can take an anti-inflammatory such as ibuprofen (for example Mypaid or Gen-Payne).',
        'While it heals: some discolouration, itching, and a whitish-yellow fluid that forms a crust on the jewellery. The skin may tighten around the jewellery.',
        'A piercing can look healed before it is. The inside can still be fragile while the outside looks healed. Be patient, and keep it clean for the whole healing time.',
        'Once healed: the jewellery may not move freely. Don’t force it. Cleaning your piercing as part of your normal routine can help keep it clean and stop normal, sometimes smelly, secretions building up.',
      ],
    },
    {
      heading: 'Healing times',
      body: todo('Typical healing times per piercing, from the studio', 'The piercing aftercare PDF does not give healing times.'),
    },
    {
      heading: 'Sleeping and day-to-day',
      body: [
        'Ear, cartilage and face: keep your bedding clean and change your pillowcase regularly while it heals. Clean phones, headphones and glasses with a suitable disinfectant, and wash hats, scarves and headbands regularly.',
        'Take care when styling your hair, and tell your stylist you have a new or healing piercing.',
        'Don’t sleep directly on a healing cartilage piercing: it can irritate it and even shift its angle. Putting a travel pillow on your pillow and resting your ear in the opening helps.',
        'Navel: a hard, vented eye patch (sold at pharmacies) protects it from sport, tight clothing and knocks.',
        'Nipples: a tight cotton shirt or sports bra can protect them and feel comfortable, especially for sleeping.',
      ],
    },
    {
      heading: 'What to avoid',
      body: [
        'Cleaning with alcohol, hydrogen peroxide, antibacterial soap, iodine or any harsh products.',
        'Over-cleaning. It can slow the healing and irritate your piercing.',
        'Friction and pressure from clothing, a lot of movement, playing with the jewellery and rough cleaning. These can cause scar tissue and migration, and make healing take longer.',
        'Cosmetics, lotions, sprays and other beauty products on or around the piercing.',
        'Lakes, pools, the sea and hot tubs. Or protect your piercing with a waterproof transparent film dressing from the pharmacy, which works well on nipple, navel and surface piercings.',
        'Stress, drugs, and a lot of caffeine, nicotine or alcohol, which can slow the healing.',
      ],
    },
    {
      heading: 'Jewellery and downsizing',
      body: [
        'Unless the size, style or material is a problem, leave the first jewellery in for the whole healing time. Many piercings need a downsize before they are fully healed.',
        'Leave your jewellery in at all times. Even a well-healed piercing can shrink or close in minutes, and putting jewellery back in can be difficult or impossible.',
        'With clean hands or paper towel, check regularly that threaded and threadless ends are tight.',
        'If you no longer want the piercing, take the jewellery out (or have a piercer do it) and keep cleaning until the hole closes. A body piercing is a permanent change to the body: most scarring is minimal, but a piercing will leave a scar.',
      ],
      open: todo('When to come back to downsize, and when it is safe to change jewellery', 'The PDF says many piercings need a downsize before they are healed, but not when.'),
    },
    {
      heading: 'When to call us, and when to see a doctor',
      body: 'If you think your piercing is infected, contact your piercer before you seek further medical help.',
      open: todo('Other signs that need the studio, and signs that need medical help', 'The piercing aftercare PDF covers only a suspected infection.'),
    },
  ] satisfies Section[],
};
