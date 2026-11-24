# Design system

The rules for how this site looks and moves. If a change breaks one of these rules, change the rule here first or don't make the change.

## Direction

The studio's own graphics set the direction: the "How to Book" post (grey Victorian lettering on black), the black-and-white artist intro cards with white corner frames, Bron's ruled flash sheet, and the logo itself.

- **Base (from "Name Card"):** ink ground, bone type, Sancreek for names and page headings, Libre Franklin for everything else.
- **Flash and portfolio grids (from "Flash Sheet"):** pieces sit in ruled cells with hairline borders, like a printed flash sheet.
- **Artists section (from "Studio Roster"):** artist names set very large as a typographic list; the work appears next to the name.

## Colour

The palette is the logo's two colours plus greys mixed from them. There are no other hues. Colour on the page comes from the tattoo photos.

| Token | Hex | Mix (bone into ink) | Use |
|---|---|---|---|
| `ink` | `#0B0B0B` | 0% | Page ground. Working value, confirm against the vector logo. |
| `soot` | `#191919` | 6% | Image mats, raised panels on ink |
| `coal` | `#30302F` | 16% | Hairlines and dividers on ink (decorative only) |
| `iron` | `#565554` | 32% | Secondary text on bone |
| `pewter` | `#696866` | 40% | Form field borders on ink (UI component, 3:1 minimum) |
| `ash` | `#8E8D8A` | 56% | Secondary text on ink |
| `smoke` | `#C6C5C1` | 80% | Muted text on ink where `bone` is too loud |
| `bone` | `#F5F3EE` | 100% | Type on ink, ground for long reading. Working value. |

Sampled from the Instagram profile pictures: the studio logo renders at about `#020203` / `#FBFBFB`, and Bram's mark at `#131311` / `#F9F8F0`. The working tokens sit between the two. Replace them with values from the vector file when it arrives.

### Contrast (WCAG 2.2)

| Pair | Ratio | Allowed for |
|---|---|---|
| bone on ink | 17.75:1 | All text |
| smoke on ink | 11.4:1 | All text |
| ash on ink | 5.93:1 | Body and small text |
| pewter on ink | 3.54:1 | Borders, icons, large text (18.66px bold / 24px) only |
| coal on ink | 1.49:1 | Decorative lines only, never meaning |
| ink on bone | 17.75:1 | All text |
| iron on bone | 6.71:1 | Body and small text |
| pewter on bone | 5.02:1 | Body and small text |
| ash on bone | 2.99:1 | Not for text. Decorative only. |

### Functional colour (not brand)

Form errors and validation only. One colour cannot reach 4.5:1 on both ink and bone (the best possible is about 4.2:1), so there are two tones:

| Token | Hex | Contrast |
|---|---|---|
| `alert-on-ink` | `#FF8A7A` | 8.59:1 on ink |
| `alert-on-bone` | `#B3261E` | 5.89:1 on bone |

Errors never rely on colour alone. Every error also has text and is linked to its field with `aria-describedby`.

### Light and dark mode

**Dark is the default** and the brand's home: the studio's own graphics are black. Visitors switch with the toggle in the header or the text switch in the footer. The header toggle has a square-cornered track (the hairline rule) and a round knob after the logo's disc, carrying a moon (dark) or sun (light). Sun and moon are the one place icons are used: they carry the meaning. The choice is remembered in that browser only. The system light/dark setting is deliberately not followed, so the site always opens dark unless the visitor chose light.

Light mode swaps the tokens, not the components. Every colour on the site goes through the tokens above, so `ink` becomes the light ground and `bone` the dark type. The greys mirror; `ash` and `pewter` are darkened slightly so they keep AA contrast on the light ground. Bone bands become dark bands, which keeps the page's rhythm. The two error tones swap so each stays on the ground it can be read on.

| Token | Dark | Light | Light-mode contrast |
|---|---|---|---|
| `ink` (ground) | `#0B0B0B` | `#F5F3EE` | |
| `bone` (type) | `#F5F3EE` | `#0B0B0B` | 17.75:1 on the ground |
| `soot` | `#191919` | `#E7E5E0` | surface only |
| `coal` | `#30302F` | `#D0CECA` | decorative lines only |
| `iron` | `#565554` | `#AAA9A5` | 8.37:1 on a dark band |
| `pewter` | `#696866` | `#878683` | 3.28:1 on the ground (borders) |
| `ash` | `#8E8D8A` | `#6D6C6A` | 4.73:1 on the ground |
| `smoke` | `#C6C5C1` | `#3A3938` | 10.39:1 on the ground |
| `alert-on-ink` | `#FF8A7A` | `#B3261E` | 5.89:1 on the ground |
| `alert-on-bone` | `#B3261E` | `#FF8A7A` | 8.59:1 on a dark band |

Rules:
- **The logo does not change.** `StudioMark` with its disc always draws a black disc with white daggers (`.logo-disc`, `--logo-black`, `--logo-white`). Without the disc, the daggers follow the text colour, like a one-colour logo.
- **Never hard-code a colour in a component.** Use the tokens, or light mode breaks.
- `public/boot.js` sets `data-theme` before first paint, so there is no flash of the wrong theme. `src/lib/theme.ts` handles the switch and the browser's `theme-color`.

## Type

| Face | Use | Source |
|---|---|---|
| Sancreek 400 | Artist names, page `h1`, section `h2` on feature sections | `@fontsource/sancreek` (OFL) |
| Libre Franklin (variable, 100–900) | Everything else: body, labels, navigation, forms, numbers | `@fontsource-variable/libre-franklin` (OFL) |

Sancreek is the closest open-licence match to the lettering on the artist cards and the "How to Book" post. Too much of it starts to look like a Wild West saloon sign, so:

- Never set Sancreek below `h3` size or in running text.
- Never set Sancreek in all caps. Its lowercase does the work.
- At most one Sancreek heading per screen, plus the artist names in the Artists section.

### Scale

Fluid sizes, mobile first. Tokens live in `src/styles/index.css`.

| Token | Size (360px → 1440px) | Leading | Face |
|---|---|---|---|
| `text-name` | 56px → 184px | 0.86 | Sancreek |
| `text-h1` | 46px → 112px | 0.92 | Sancreek |
| `text-h2` | 34px → 64px | 0.98 | Sancreek or Franklin 600 |
| `text-h3` | 22px → 30px | 1.15 | Franklin 600 |
| `text-lead` | 19px → 23px | 1.45 | Franklin 380 |
| `text-body` | 17px | 1.6 | Franklin 380 |
| `text-small` | 14px | 1.5 | Franklin 400 |
| `ui` | 14px, sentence case | 1.4 | Franklin 600: nav, buttons, form groups, table labels |
| `lockup` | 12px, caps, +0.16em | 1.3 | Franklin 560: the wordmark only, as on the studio's own graphics |
| `sf-tracked` | 12px, caps, +0.18em | 1.3 | Franklin 600: the poster footer only (column titles, "Est.", "Send a booking enquiry"). The one exception to "caps for the wordmark only": the footer is set as a printed poster, where tracked caps are the label style. |

- Body text is capped at `measure` (66ch).
- Figures (prices, hours, dates, phone numbers) use `.num` for tabular lining numerals.
- No small capitals labels above headings. If a label only repeats the page name, leave it out.
- Artists are never numbered. Where a list of artists needs a secondary line, use their Instagram handle.
- No em dashes in body copy.

## Space and grid

- Spacing uses Tailwind's 4px steps. Section rhythm is `--section` (72px → 144px).
- Page margin `--margin`: 16px → 64px. Gutter `--gutter`: 16px → 24px.
- `.grid-page`: 4 columns under 768px, 8 columns to 1024px, 12 columns above. Max width 1440px.
- Break the grid on purpose. Images can bleed into the margin or run full width. Text can overlap an image edge by a column. No two consecutive sections share a layout.

## Motifs

**The dagger is the only signature element.** It comes from the logo (three daggers fanned point-down) and is drawn from one geometry file, `src/components/brand/geometry.ts`.

Where it is used:
- `DaggerRule`: section divider. A hairline that ends in a dagger pointing into the next section.
- Active-page marker in the navigation, and the hover state on desktop nav.
- List marker for numbered steps (booking process, aftercare).
- The flash claimed/available legend.
- The hero and page transition (see Motion).

Where it is not used:
- Never as a background pattern, never repeated more than three times in a row, never rotated to arbitrary angles. Point down by default. Point left only for "current item" markers.

**Ornamental corner frame:** only around artist portrait photos, as on the studio's intro cards. Nowhere else.

**Bram's mark** appears only on Bram's page.

**Not used:** the sage green studio walls, the mustard Piercing Special flyer, the Instagram story-ring gradient, the four-point star from the flyer, skull-and-rose clip art, ink splatter, grunge texture.

## Images

- All images go through `npm run images` (see `scripts/build-images.mjs`). AVIF + WebP, `srcset`, explicit `width`/`height`.
- Grid rendition is 4:5. Set the crop focus with a sidecar JSON when the automatic crop misses the piece.
- One grade per artist, set in `GRADES`. Keep it subtle. The goal is a consistent look across one artist's set, not a filter.
- Images below the fold are lazy. Only the first visible image on a page gets `priority`.
- Missing photos use `PhotoTodo`, which keeps the same 4:5 box so nothing shifts later.
- Only images with `consentConfirmed: true` render (enforced in the content layer).

## Motion vocabulary

Small and reused. Everything is off when motion is reduced (system setting or the footer toggle), and nothing is hidden waiting for JavaScript: the server HTML is the final state.

| Effect | What it says | Where |
|---|---|---|
| **Hero: the fan.** The three daggers of the stamp drop in one at a time (left, right, centre), then the circle opens from a small disc onto a healed piece. About 1.2s, pure CSS. | The studio is the mark, and the work is what's inside it. | Home only |
| **Page transition: the blade.** A panel with a dagger-point bottom edge comes down over the old page, the page swaps behind it, and it carries on down off the new one. About 800ms in total: 280ms down (accelerating), 500ms off (decelerating). | Moving between rooms of one studio, in the direction the daggers point. | Every route change |
| **Reveal: cut.** Images open top to bottom with `clip-path`. | Ink going in along a line. Draws the eye to the piece, not the page. | Portfolio and flash grids, Artists section |
| **Reveal: set.** The `h1` rises line by line inside a mask (SplitText). | The names are set like type on a card. | `h1`, only on pages that arrive behind the blade |
| **Reveal: draw.** `DaggerRule` hairlines extend outward from the dagger. | Marks the start of a new section. | Dividers |
| **Lightbox.** The lightbox fades in over 200ms and out over 150ms, showing the piece it closed on until it has gone (the fade out only where the browser can keep a closing dialog in the top layer; elsewhere it closes at once). The image grows out of its grid cell (hand-written FLIP); the Previous and Next buttons fade the new piece in over 200ms, and the arrow keys swap it at once. Closing returns focus to the cell of the piece last viewed. | You're looking closer at the same piece, not opening a new one. | Portfolio |
| **Press.** Buttons and button-like links shrink to 97% while held (160ms, `press` in index.css and `src/lib/press.ts`). | The page heard you before anything else happens. | Filled and outlined buttons, the booking choices, the Menu button and the lightbox controls. Not text links, the theme switch or the portfolio cells (scaling a cell would throw off the lightbox's grow-from-cell) |
| **Mobile menu.** The panel fades and drops 8px in over 200ms, and fades and rises 8px out over 150ms. | The menu comes down over the page, like the blade. | Header, under 1024px |
| **Booking steps.** Each question of the booking enquiry rises in a little and fades in when it comes on screen. CSS only. | One thing to answer at a time, like a conversation at the front desk. | `/contact` booking enquiry |
| **Theme switch: the blade.** Switching light/dark, the new theme comes down over the old one behind a dagger-point edge. About 0.75s, CSS only (View Transitions). Instant when motion is reduced or the browser has no View Transitions. | The same blade as the page transition: one studio, a different light. | Header and footer switches |
| **Footer: the stamp.** When 20% of the footer is on screen, the seal and barcode rise, the barcode bars grow in one after another, the disc opens, the wordmark letters press down one at a time, the dagger is wiped in top to bottom and the echo daggers fan out. About 1.6s, CSS plus a small spring loop. | The poster being printed: every visit ends on the studio's mark. | Footer |
| **Footer: the fan.** Six echo daggers each side pivot on the real dagger's point on springs, each one softer and a shade lighter. On a mouse, left/right turns the fan and up/down opens or folds it. | The three-dagger mark multiplied, like a strobe photo of a blade swung once. | Footer |
| **Footer: the lens.** A soft circle under the pointer shows a clean copy of the gritty wordmark. | The print is rough, the studio behind it is precise. | Footer |
| **Footer: grit.** The wordmark is printed with ragged edges and specks (SVG filter, static). | Screen-printed and hand-made, not a font on a screen. | Footer (always on; it does not move) |
| **Footer: the seal and disc.** The seal's ring text turns while hovered; clicking the disc replays the entrance with a pulse ring; the disc follows the pointer by up to 3%. | The mark is something you can pick up and stamp again. | Footer |

### When things animate

Nothing that is already on screen at first load starts hidden, except the home hero:
- **First load:** only content below the fold gets `cut` and `draw`, as it scrolls in. Headings and above-the-fold images appear at once, so the largest paint is never delayed.
- **After a navigation:** the new page is hidden behind the blade, so content in view can start hidden and open as the panel passes.
- **Home hero:** a CSS animation under `html[data-motion="full"]`, which `public/boot.js` sets before first paint. No JavaScript is involved, so it cannot get stuck.

### How it is built

The first page load runs no motion JavaScript at all. That is what keeps the home page at Lighthouse 90+ on a throttled phone: parsing GSAP alone cost about 900ms there.

- **CSS only:** the hero fan (`[data-fan]` in `index.css`) and the `cut`/`draw` transitions (`.reveal-out`).
- **`src/lib/reveals.ts`** (about 1 KB, main bundle): a passive, frame-throttled scroll check that removes `.reveal-out` once an element reaches 92% of the viewport height. Not IntersectionObserver: an element that is jumped past (anchor link, End key, a fast fling) never intersects, so an observer would leave it hidden.
- **`src/motion/engine.ts`** (GSAP core, SplitText, Lenis; about 36 KB gzipped): the blade, the heading split, the lightbox FLIP and smooth scrolling. It loads on the visitor's first interaction (tap, click, key, wheel or mouse movement) or when a navigation starts, never during the first load. Reduced-motion visitors never download it.
- Components reach the engine through `useEngine(run, deps, options)` (`src/lib/useEngine.ts`). `run` returns a cleanup, always `gsap.context().revert()`, so switching "Reduce motion" on mid-visit undoes everything. `enabled: false` skips loading entirely when there is nothing to animate.
- **Navigation never waits on motion.** `PageRoutes` keeps the old page on screen (`startTransition`) while the blade covers and the next route's code loads. If the engine fails to load, or the blade takes longer than 1.5s, the page swaps without it. The blade lifts two frames after the swap, so the new page's setup runs while the screen is covered.
- Framer Motion and ScrollTrigger are not used. GSAP core covers what needs JavaScript, and CSS covers the rest.
- `src/motion/effects.ts` has one on/off switch per effect.

Rules:
- Animate only `transform`, `opacity`, `clip-path` and SVG strokes.
- All GSAP runs inside `gsap.context()` in the engine and is reverted on unmount.
- Measured at 4x CPU throttle, 390px: scroll reveals median 16.7ms per frame (60fps), worst 33ms; the blade's long frames all fall while the screen is covered.
- Lenis runs on fine pointers only and is driven by the GSAP ticker. Touch keeps native scrolling.
- Under 768px: no pinned horizontal scroll, no custom cursor, no magnetic effects.
- Motion code budget: about 60 KB gzipped.
- New effects go in the engine, follow the "When things animate" rules, and get a row in the table above with one sentence on what they say. If there is no sentence, there is no effect.

## CSP constraints on markup

The CSP has `style-src 'self'` with no `unsafe-inline`:
- No `style` attributes in server-rendered HTML. The prerender step fails the build if it finds one.
- Setting styles from JavaScript after hydration (GSAP) is allowed, because CSSOM writes are not blocked.
- `public/boot.js` is a same-origin file, not an inline script, so `script-src 'self'` covers it.

## Do and don't

Do:
- Let photos carry the colour.
- Use the studio's own words where they exist ("Tattoos for the unique and curious", "Available custom flash").
- Name the artist in every call to action ("Book with Theshen").
- Show `TODO:` blocks for anything the client has not supplied.

Don't:
- Add a hue, a gradient, a blur, glass panels or soft drop shadows.
- Round corners (the only radius token is a 2px hairline radius).
- Use icon sets for decoration. The dagger is the only ornament.
- Centre every section, or stack eyebrow + heading + subtitle as a pattern.
- Fade-up everything on scroll.
- Put profanity from a tattoo into a heading, alt text summary or meta description.

## The poster footer

`src/components/ui/strobe-footer.tsx`, styles in `strobe-footer.css` (`.sf-` classes), maths in `strobe-footer.math.ts` (tested with `npm test`). It uses the logo's two colours in both themes: it is a printed poster, not a themed panel.

- **Head (paper):** a seal with the studio name running round the dagger mark, "Est." and the year (a TODO until supplied, shown in preview builds only), "Send a booking enquiry", and a barcode that encodes the studio number (EAN left-hand patterns between 101 guards).
- **Stage:** the logo's black disc (a button that replays the entrance), the main dagger standing with its point on the floor, the echo fan, and a black band along the bottom (its own height, 150 to 240px, so the wordmark does not grow with the columns) holding `REBELLION` fitted edge to edge and cut off by the floor. The footer is only as tall as its content, so the whole poster fits on one screen. The dagger lands on the first L and stands in for it.
- **Columns:** Studio and Artists on the left, Visit and Follow on the right (two navs with different labels). Each side stacks its two columns below 1200px (two a side only fit beside the disc from there); below 720px they move under the stage as a two-column grid on black. Nothing is allowed to overlap: the stage grows until the columns fit above the band (the band keeps its height), the disc, dagger and fan sit below the columns rather than between them, the dagger is sized from the disc, and the echo daggers fade out behind the column text.
- **Legal bar (black):** copyright, Privacy (POPIA), the dark mode and reduce motion switches, Back to top, over faint perspective floor lines.
- **Layout follows the footer's own width** through a container query, so the server HTML is already laid out and nothing shifts. JavaScript only measures (stage size for the SVGs, the wordmark fit).
- **Reduced motion** (system setting or the footer switch): no entrance, the fan is drawn open and still, pointer effects off. Pointer effects also need a mouse or trackpad and a footer at least 768px wide; on phones the fan opens once and stays.

## The booking enquiry

`/contact` asks one question at a time (`src/components/forms/BookingForm.tsx`): name, contact, artist, tattoo or piercing, placement, colour (tattoos only), the idea, references, timing, and the confirmations. Each step has a number badge, the question in the display face (one per screen, within the Sancreek rule), underline-only fields, a square OK button (Enter works too) and Back. Choices are lettered; pressing the letter picks it. Without JavaScript every step shows as one long form that still submits.

It sits on a full-bleed photo (`media/studio/booking-background.jpg`) under an ink scrim. The scrim is functional, not decoration: 80% on phones; on desktop the form stays in the left half and the scrim eases from 90% to 35% across the photo so its subject shows. Inside, `data-scheme="photo"` keeps the stage dark in both themes and lifts the greys so text stays readable over the photo's lightest part (bone 10:1, hints 6.5:1, field lines 3.4:1, errors 4.9:1). The current photo needs permission or replacing before launch (see CLIENT-TODO.md).

