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
    /** From the onboarding questionnaire (20 Nov 2026): "106 14th Ave, Fairland, Randburg, 2170". */
    street: '106 14th Ave, Fairland',
    postalCode: '2170',
    /** The town in the postal address. The structured data uses it as the locality. */
    areaName: 'Randburg',
    mapsUrl: pending('Google Maps link for the studio pin'),
    parking: pending('Parking and access notes (gate, buzzer, which floor)'),
  },

  /** From the questionnaire: "10am - 5pm (Tuesday - Saturday) Sundays are appointment based". */
  hours: 'Tuesday to Saturday, 10am to 5pm. Sundays by appointment.',
  /** The same hours for the structured data. Sunday is left out because it is by appointment only. */
  openingHours: [{ days: ['Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'], opens: '10:00', closes: '17:00' }],

  ownership: pending(
    'Who owns the studio, and whether ownership should appear on the site',
    'Bron\'s bio: "Co-Owner of @thesouthernrebellion". The questionnaire names Bramley and Bronwyn as the people who answer enquiries and approve the site, but does not say who owns the studio.',
  ),

  tagline: {
    text: 'Tattoos for the unique and curious',
    source: pending(
      'This line is from Kimmy (streetgypsy)\'s bio ("Tattoos for the Unique & Curious"). Confirm the studio can use it as its own line.',
    ),
  },

  privacy: {
    informationOfficer: pending('Name and contact of the POPIA information officer'),
    retention: pending('How long booking enquiries and reference images are kept before deletion'),
  },

  established: pending(
    'The year the studio was founded (shown as "Est." in the footer)',
    'The questionnaire (20 Nov 2026) says 7 years in business, so 2019 or 2020.',
  ),

  /** The poster footer (src/components/ui/strobe-footer.tsx). */
  footer: {
    /** Runs round the seal; the trailing dot joins the end back to the start. */
    sealText: 'The Southern Rebellion · Tattoo & Piercing · Johannesburg · ',
    /** Set edge to edge in the black band. "SOUTHERN REBELLION" also works. */
    wordmark: 'REBELLION',
    /** The barcode encodes the studio number, so it carries a real detail. */
    barcodeDigits: '0645075342',
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
      'The site name still reads "The Southern Rebellion" (page titles, footer, header link label) while the logo says "The Rebellion". When should the name change?',
      'The header now shows the "New Logo" wordmark, cut from New Logo.png in the Drive folder. The questionnaire says the name "The Rebellion Tattoo & Piercing" is final and the new brand is ready in Jan 2027; the new domain is not registered yet.',
    ),
    vectorLogo: pending(
      'The logo as SVG, or permission to convert New Logo.pdf to SVG, so it stays sharp at large sizes',
      'The site uses the 945px PNG, which is sharp in the header but not for a full-screen use.',
    ),
    colours: pending(
      'Whether the yellow-green #725E2B should be used on the site, and where',
      'Questionnaire brand colours: "Black / White / yellow-green - Hex#725E2B". The flower logo uses it. The site uses #0B0B0B and #F5F3EE for the black and white.',
    ),
    displayFontLicence: pending(
      'The licensed MCF Stone Head font file (with its web licence), to replace the one in the Drive folder before launch',
      'The supplied "MCF StoneHead[63].ttf" replaces @ / & $ [ ] { } | _ ~ ^ and ` with the designer\'s "Mister Chek" badge, which is how free demo copies are marked; a purchased copy from Creative Market does not do this. Creative Market sells desktop and web licences separately. The site uses this file for now, limited to letters, numbers and plain punctuation.',
    ),
    bodoniLicence: pending(
      'A web licence for ITC Bodoni Seventy Two (Monotype), if the studio wants the exact Bodoni 72 rather than Bodoni Moda',
      'The supplied "Bodoni 72.ttc" and "Bodoni 72 OS.ttc" are the copies that come with macOS (version 13.0d2e1, (c) ITC), which may not be put on a website. The site uses Bodoni Moda (free, open licence), which is very close.',
    ),
    photos: pending('Studio interior photos (high-res originals)'),
  },

  securityContact: pending('Email for security reports in /.well-known/security.txt (currently info@)'),

  /** From the questionnaire. Reference for the build; not shown on the site. */
  competitorsOrInfluences: 'Palm Black Tattoos, Be Kind Tattoos, Two Lovers',
  dislikes: 'A busy site. Visitors should be able to move around easily and find all the information quickly.',
} as const;
