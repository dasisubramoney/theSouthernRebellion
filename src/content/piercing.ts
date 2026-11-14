import { todo } from './todo.ts';

export const piercing = {
  piercer: 'rio' as const,
  /** From Rio's bio: "Body piercer (2016)". */
  piercingSince: 2016,

  services: todo(
    'List of piercings offered, with prices',
    'Seen in Rio\'s grid: eyebrow, above-the-brow studs, nostril hoop, ear cartilage and lobe.',
  ),
  jewellery: todo(
    'Jewellery materials stocked (implant-grade titanium? gold?), and whether clients can bring their own',
  ),
  agePolicy: todo('Minimum age for piercing, whether a parent or guardian can consent for minors, and what ID is needed'),
  downsizing: todo('Whether the studio does downsizing and jewellery changes, and what it costs'),

  /**
   * Saturday special, from the "Piercing Special" flyer in the shop grid.
   * Set `enabled: false` to take it off the site.
   */
  special: {
    enabled: true,
    title: 'Saturday piercing special',
    day: 'Saturday',
    opens: '10:00',
    closes: '17:00',
    priceZar: 550,
    offer: 'Two standard piercings',
    /** Verbatim from the flyer. */
    jewelleryWording: 'Includes standard silver titanium jewellery',
    bookingEmail: { user: 'info', domain: 'thesouthernrebellion.co.za' },
    confirmedForLaunch: todo(
      'Confirm the special is still running, the price, and the jewellery wording. "Silver titanium" is not a material: is it implant-grade titanium in a silver finish?',
      'Flyer: "Every Saturday · 10am–5pm · R550 for two standard piercings · Includes standard silver titanium jewellery · Book now – info@thesouthernrebellion.co.za"',
    ),
    whichPiercingsCount: todo('Which piercings count as "standard" for the special'),
    walkIns: todo('Walk-ins on Saturday, or booking only?'),
  },
};
