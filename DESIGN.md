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
| **Page transition: the blade.** A panel with a dagger-point bottom edge comes down over the old page, the page swaps behind it, and it carries on down off the new one. About 850ms in total. | Moving between rooms of one studio, in the direction the daggers point. | Every route change |
| **Reveal: cut.** Images open top to bottom with `clip-path`. | Ink going in along a line. Draws the eye to the piece, not the page. | Portfolio and flash grids, Artists section |
| **Reveal: set.** The `h1` rises line by line inside a mask (SplitText). | The names are set like type on a card. | `h1`, only on pages that arrive behind the blade |
| **Reveal: draw.** `DaggerRule` hairlines extend outward from the dagger. | Marks the start of a new section. | Dividers |
| **Lightbox.** The image grows out of its grid cell (hand-written FLIP); next and previous cross-fade. Closing returns focus to the cell of the piece last viewed. | You're looking closer at the same piece, not opening a new one. | Portfolio |

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
