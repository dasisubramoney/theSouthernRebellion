// Collects every open question in src/content into CLIENT-TODO.md.
// Run with `npm run todos`. Uses Node's built-in TypeScript type stripping,
// so content files must stick to erasable syntax (no enums, no namespaces).
import { writeFile } from 'node:fs/promises';

const load = (f) => import(new URL(`../src/content/${f}`, import.meta.url).href);

const [{ studio }, { artists }, { portfolio, excludedImages }, { flash, flashNotes }, { piercing }, { booking }, { aftercare }] =
  await Promise.all(
    ['studio.ts', 'artists.ts', 'portfolio.ts', 'flash.ts', 'piercing.ts', 'booking.ts', 'aftercare.ts'].map(load),
  );

const isTodo = (v) => typeof v === 'object' && v !== null && 'todo' in v;

function collect(value, out = []) {
  if (isTodo(value)) out.push(value);
  else if (Array.isArray(value)) value.forEach((v) => collect(v, out));
  else if (typeof value === 'object' && value !== null) Object.values(value).forEach((v) => collect(v, out));
  return out;
}

const line = (t) => `- [ ] ${t.todo}${t.evidence ? `\n  - Seen so far: ${t.evidence}` : ''}`;
const section = (title, items) => (items.length ? `## ${title}\n\n${items.map(line).join('\n')}\n` : '');

const parts = ['# Open questions for the studio\n', 'Written by `npm run todos` from the files in `src/content`. Tick items off by updating those files.\n'];

parts.push(section('Studio', collect(studio)));

for (const a of artists) {
  const { slug, ...rest } = a;
  parts.push(section(`${a.name}${a.published ? '' : ' (not published)'}`, collect(rest)));
  void slug;
}

const unconfirmedFlash = Object.values(flash)
  .flat()
  .filter((f) => f.status === null);
const flashItems = collect(flashNotes);
if (unconfirmedFlash.length) {
  flashItems.push({
    todo: `Confirm which of these designs seen on Instagram are available flash, with size and price: ${unconfirmedFlash.map((f) => f.title).join(', ')}`,
  });
}
parts.push(section('Flash', flashItems));
parts.push(section('Piercing', collect(piercing)));
// Steps and sections carry their heading, so each question reads on its own. A step can be a TODO
// itself (body), or have the studio's text plus a question still open about it (open).
const withHeading = (prefix, list, key) =>
  list.flatMap((x) =>
    [x.body, x.open].filter(isTodo).map((t) => ({ ...t, todo: `${prefix}, "${x[key]}": ${t.todo}` })),
  );

const { steps, ...bookingRest } = booking;
parts.push(section('Booking', [...withHeading('Step', steps, 'title'), ...collect(bookingRest)]));

const { tattoo, piercing: piercingCare, ...careRest } = aftercare;
parts.push(
  section('Aftercare', [
    ...collect(careRest),
    ...withHeading('Tattoo', tattoo, 'heading'),
    ...withHeading('Piercing', piercingCare, 'heading'),
  ]),
);

const all = Object.entries(portfolio).flatMap(([artist, list]) => list.map((p) => ({ artist, ...p })));
parts.push(
  `## Portfolio photos\n\n` +
    `${all.length} pieces were identified in the artists' grids. For each one the studio needs to send the original photo ` +
    `(not a screenshot) and confirm the person in it agreed to it being on the website.\n\n` +
    `| Artist | Piece | Where it is on Instagram | Consent | Notes |\n|---|---|---|---|---|\n` +
    all
      .map((p) => {
        const notes = [
          p.needsDecision,
          p.flags.includes('face') ? 'Face visible: needs explicit consent' : null,
          p.flags.includes('profanity') ? 'Contains a swear word: shown, but never in headings or alt text' : null,
          p.flags.includes('personal-name') && !p.needsDecision ? 'Contains a name or number that may identify someone' : null,
        ]
          .filter(Boolean)
          .join('; ');
        return `| ${p.artist} | ${p.id} | ${p.seenIn} | ${p.consentConfirmed ? 'yes' : 'no'} | ${notes} |`;
      })
      .join('\n') +
    '\n',
);

parts.push(
  `## Images left out\n\n| Artist | Image | Why | Where |\n|---|---|---|---|\n` +
    excludedImages.map((e) => `| ${e.artist} | ${e.description} | ${e.reason} | ${e.seenIn} |`).join('\n') +
    '\n',
);

const md = parts.filter(Boolean).join('\n');
await writeFile('CLIENT-TODO.md', md);
const count = (md.match(/- \[ \]/g) ?? []).length;
console.log(`CLIENT-TODO.md: ${count} open questions, ${all.length} portfolio photos to collect, ${excludedImages.length} images left out`);
