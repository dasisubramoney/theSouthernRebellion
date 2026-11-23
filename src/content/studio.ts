import type { Maybe } from './todo.ts';
import { todo } from './todo.ts';

/** A value the client has not supplied yet. Typed so the real string can replace it later. */
const pending = (question: string, evidence?: string): Maybe<string> => todo(question, evidence);

export const studio = {
  name: 'The Southern Rebellion',
  /** As set on the "How to Book" graphic. */
  legalName: 'The Southern Rebellion Tattoo Company',
  registrationNumber: pending('Company registration number, and whether to show it on the site'),
  origin: 'https://thesouthernrebellion.co.za',
  instagram: 'thesouthernrebellion',
  /** Instagram's category label on the shop account. */
  category: 'Tattoo and piercing shop',

  phoneDisplay: '064 507 5342',
  phoneE164: '+27645075342',
  whatsapp: 'https://wa.me/27645075342',
  email: { user: 'info', domain: 'thesouthernrebellion.co.za' },

  location: {
    /** Spelled as in the shop bio. */
    centre: 'Fairlands on 14th',
    city: 'Johannesburg',
    province: 'Gauteng',
    country: 'ZA',
    street: pending('Street address and unit number'),
    postalCode: pending('Postal code'),
    areaName: pending(
      'How to name the area: "Fairland" (usual suburb spelling), "Fairlands" (as in the shop bio) or "Randburg" (as in Bron\'s bio)',
      'Shop bio: "Fairlands on 14th". Bron\'s bio: "Randburg ( jhb)".',
    ),
    mapsUrl: pending('Google Maps link for the studio pin'),
    parking: pending('Parking and access notes (gate, buzzer, which floor)'),
  },

  hours: pending(
    'Studio opening hours',
    'streetgypsy\'s grid has a "Tues–Sat STUDIO HOURS 10am–5pm" post. The Saturday piercing special runs 10am–5pm.',
  ),

  ownership: pending(
    'Who owns the studio, and whether ownership should appear on the site',
    'Bron\'s bio: "Co-Owner of @thesouthernrebellion". No one else states it.',
  ),

  tagline: {
    text: 'Tattoos for the unique and curious',
    source: pending(
      'This line is from streetgypsy\'s bio ("Tattoos for the Unique & Curious"). Confirm the studio can use it as its own line.',
    ),
  },

  privacy: {
    informationOfficer: pending('Name and contact of the POPIA information officer'),
    retention: pending('How long booking enquiries and reference images are kept before deletion'),
  },

  /** Background of the booking enquiry on /contact (media/studio/booking-background.jpg). */
  bookingBackground: {
    imageKey: 'studio/booking-background',
    permission: pending(
      'Who took the booking-form background photo (tattooed artist painting at a trolley), and written permission to use it on the site. Or replace it with a studio photo, ideally 2000px wide or more.',
      'Supplied as a 736 x 981 JPEG, which is the size Pinterest serves; it looks soft on large screens.',
    ),
  },

  brandAssets: {
    logo: pending(
      'Vector logo (SVG, Illustrator or PDF) of the three-dagger mark, to replace the version traced from the Instagram profile picture',
    ),
    colours: pending(
      'Exact black and white of the logo',
      'Sampled from the profile picture: about #020203 and #FBFBFB. Site uses #0B0B0B and #F5F3EE until confirmed.',
    ),
    photos: pending('Studio interior photos (high-res originals)'),
  },

  securityContact: pending('Email for security reports in /.well-known/security.txt (currently info@)'),

  competitorsOrInfluences: pending('Sites or studios the client likes'),
  dislikes: pending('Anything the client does not want on the site'),
} as const;
