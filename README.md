# The Southern Rebellion Tattoo Company website

Marketing and booking site for The Southern Rebellion, an artist-led tattoo and piercing studio at Fairlands on 14th, Johannesburg. Deployed on Netlify at `thesouthernrebellion.co.za`.

- Vite 7, React 18, TypeScript, Tailwind 4 (custom theme only), React Router 6
- Every route is prerendered to static HTML at build time, then hydrated
- Content lives in typed files under `src/content/`, not in components
- Booking and contact forms use Netlify Forms
- Motion: CSS for the first page load, GSAP and Lenis loaded on the first interaction

Design rules (colours, type, the dagger motif, the motion vocabulary) are in [DESIGN.md](DESIGN.md). Open questions for the studio are in [CLIENT-TODO.md](CLIENT-TODO.md).

---

## Summary of changes: two-page restructure

Branch `restructure-two-page` turns the site from one page per topic into two pages. Details of how the pieces work are under "Site structure" below.

**What changed**
- **Pages:** `/` (the hero, then six sections at the time: Artists, Flash, Piercing, How to book, Aftercare, Visit; it is five now, see "Later change" below) and `/contact` (the booking enquiry form, then "Just have a question?"). `/privacy` and `/sent` are unchanged.
- **Content moved, not rewritten:** each old page's copy now lives in a section component under `src/components/sections/`. Headings were demoted so each section has one `h2` and each page one `h1`; the visual classes are unchanged.
- **Header:** sticky, with a Book button on every screen size, nav links that scroll to the section (or navigate to `/#section` from `/contact`), a highlight that follows the scroll, and a mobile menu that closes on every link tap.
- **Calls to action:** a "Send a booking enquiry" button ends both How to book and Visit. Each artist band has "Book with <artist>", which opens `/contact?artist=<slug>`.
- **Forms:** both forms moved to `/contact` with fields, validation, honeypot, per-artist routing, `?artist=` and `&flash=` prefill and the `/sent` fallback unchanged. The only markup change is the success message heading, now an `h2` so heading order stays valid under the page's `h1`.
- **SEO:** a new title, description and canonical for `/contact`; the sitemap lists `/`, `/contact` and `/privacy`; the `TattooParlor` JSON-LD is on `/` only.
- **Redirects** (`netlify.toml`): `/book`, `/book/*`, `/booking`, `/bookings` go to `/contact`; `/artists`, `/piercing` and `/aftercare` go to their section of `/`; `/artists/<slug>` goes to `/#artist-<slug>`; `/flash` goes to `/#artists` and `/visit` to `/` (those two sections were later folded in or removed, see "Later change" below). The old `/contact` to `/visit` rule is gone.
- **Scrolling:** React Router does not scroll to a hash by itself, so `PageRoutes.tsx` does it, including direct loads of `/#section`. Lenis re-measures the page before scrolling (it otherwise clamps to a stale height after a page swap). Sections carry `scroll-mt-24` for the sticky header.

**What was removed**
- The page components for `/artists`, `/artists/<slug>`, `/flash`, `/piercing`, `/book`, `/aftercare` and `/visit`, and Home's duplicate blocks (artist roster, "N steps" band, Visit teaser).
- The `Person` JSON-LD, which pointed at the removed artist pages.
- Nothing in `src/content/`: all artist, portrait and portfolio data is intact. To bring the artist pages back, see "Restoring the artist pages" below.

**Checked locally (the six-section build, before the rebuild below)**
- `npm run build` and the typecheck pass; the prerendered HTML has one `h1` per page, six sections in order, no duplicate ids and each form name registered once.
- A Chrome run at 375, 768 and 1280 widths (nav, highlight, mobile menu, CTAs, `/contact` to `/#section`, direct loads, reduced motion, form request payloads) passed with no console errors.
- Lighthouse on mobile scored 99 / 100 / 100 / 100 (performance, accessibility, best practices, SEO) for `/` and `/contact`.

**Still to check on a deploy preview**
- A real submission of each form from `/contact`, and one with JavaScript off (it should land on `/sent`).
- That Netlify lists all eight form names (`booking-<artist slug>` x5, `booking-unsure`, `booking-piercing`, `contact`).
- That the redirects keep their `#fragment` (`curl -sI <preview>/artists`) and the query string (`/book?artist=x`). If a fragment is dropped, point that rule at `/`.

**Commits**
1. Move the old pages into six home-page sections and add a /contact page
2. Add a sticky header with a Book button, section highlighting and scroll handling
3. Update redirects, form registration note, JSON-LD and README for the two-page structure
4. Update DESIGN.md to match the two-page structure

### Later change: five-section rebuild

The home page was rebuilt as the hero plus five sections: **Artists, Piercing, How to book (the booking process), Aftercare, Gallery**. It is still one scrolling page; `/contact` is still the page with the forms.

- **Artists** now holds everything about each artist in one block: name, linked Instagram handle, styles, bio (a TODO note until supplied), the lines from their Instagram bio, their three best pieces, and three flash designs with a "Claim this piece" link, plus "Book with <artist>". Flash is no longer a section of its own.
- **Gallery** is new: work from every artist in one ruled grid with an artist filter, the existing lightbox, and "Show more" after the first 12. Only pieces with `consentConfirmed: true` show (see "Adding portfolio images"); until then it shows a TODO note.
- **Removed:** the Flash section (its content moved into the artists), the Visit section (the address and hours are in the footer; the map placeholder and parking note are no longer shown, though they are still in `src/content/studio.ts`), and the "Start from the style" list.
- **Fixed on the way:** the portfolio grid left a solid grey block in an incomplete last row; it now uses per-cell hairlines.
- **Needs the client:** the Instagram bio lines are shown verbatim, so some wording that was an open question is now on the page ("Co-Owner" on Bron, "Pro Artist" on Bram, "Randburg"). See `CLIENT-TODO.md`.
- **Aftercare** is a zig-zag: from tablet width up, odd steps (1, 3, 5, 7) sit in the left column and even steps (2, 4, 6) in the right, each half a step lower. The tattoo list has seven steps and the piercing list six. The page order is still 1, 2, 3, and on phones it is one column. The title, intro and both lists are centred, and the "New tattoo / New piercing" side links were removed; the two lists keep the ids `#aftercare-tattoo` and `#aftercare-piercing`, which the Piercing section links to. Each list supports up to 12 steps (see `rowStart` in `AftercareSection.tsx`).
- **Merged from `main`** (the other developer's commits): light and dark mode with the animated switch (see "Light and dark mode"), and the booking enquiry on `/contact` rebuilt as one question at a time over a full-bleed photo, plus a redone contact band. In the Netlify submission the name field is now `firstName` and `lastName`, and the artist is picked from lettered radio choices. The background photo needs the photographer's permission, or replacing, before launch (`CLIENT-TODO.md`).

**Checked locally (after the rebuild and the merge)**
- Typecheck and `npm run build` pass; the built pages have one `h1` each, five sections in order, no duplicate ids and each form name registered once.
- 91 browser checks pass in Chrome at 375, 768 and 1280 widths with no console errors: nav and highlight, the mobile menu, `/contact` to `/#section`, direct loads, the artist blocks, the Gallery, the aftercare zig-zag, and the step-by-step booking form (every step of a tattoo enquiry, which has ten (a piercing enquiry has nine, as it skips colour), the request it sends, and the question form).
- Lighthouse on mobile scored 99 / 100 / 100 / 100 for `/` and `/contact` before the merge; it has not been re-run since the merge.

**Commits for this change**
1. Rebuild the home page as Artists, Piercing, How to book, Aftercare and Gallery, with a zig-zag aftercare
2. Update redirects and README for the five-section home page
3. Merge remote-tracking branch 'origin/main' into restructure-two-page (brings in light and dark mode, and the booking enquiry as steps)

---

## Repository

- **GitHub:** https://github.com/dasisubramoney/theSouthernRebellion (public)
- **Branch:** `main`. Netlify builds from it once connected (see "Deploying to Netlify").

Day-to-day:

```sh
git pull origin main          # before starting work
npm run build                 # must pass before committing
git add -A
git commit -m "What changed and why"
git push origin main
```

Deliberately not in git (see `.gitignore`):
- **`brief/`**: the client's source material, including Instagram screenshots that show clients' faces and follower names. That is personal information under POPIA, and this repository is public. Keep it on the studio's own drive and share it privately.
- **Build output:** `dist/`, `dist-ssr/`, `public/img/`, `src/manifest/`. These are rebuilt from source.
- **`.env*` files.** The site needs no secrets. Keep it that way.

`media/` (the original photos) **is** committed, because Netlify needs it to build the images. Before adding any photo, make sure it is approved for the public site (`consentConfirmed: true`). Anything pushed to a public repository can be copied, even if it is deleted later.

---

## Local development

Requirements: Node 24 (`.nvmrc` pins 24.15.0). npm comes with it.

```sh
npm install
npm run dev        # http://localhost:5173, content preview on (see below)
```

| Script | What it does |
|---|---|
| `npm run dev` | Processes images, then starts the Vite dev server |
| `npm run build` | Images, typecheck, client build, server build, prerender every route, write `sitemap.xml` |
| `npm run preview` | Serves `dist/` on port 4173 with the security headers from `netlify.toml` |
| `npm run images` | Runs the image pipeline on `media/` (also part of `dev` and `build`) |
| `npm run icons` | Rebuilds favicons, app icons and `public/og/studio.png` from `public/brand/mark-studio.svg` |
| `npm run todos` | Rewrites `CLIENT-TODO.md` from the `todo(...)` markers in `src/content` |
| `npm run typecheck` | `tsc --noEmit` |

### Content preview

In `npm run dev`, every portfolio and flash entry shows as a labelled placeholder, including entries without consent. That is for reviewing layouts before photos arrive. A production build only shows entries with `consentConfirmed: true`.

To get the same in a build: `VITE_CONTENT_PREVIEW=true npm run build`. **Never set that variable for a deploy anyone outside the studio can open.** Once real photos are in `media/`, preview mode shows them whether or not the client in the photo has agreed.


### If something looks wrong locally

- **Pages do not switch, or you see `504 Outdated Optimize Dep`:** stop the dev server and run `npx vite --force` once. Vite's dependency cache was stale.
- **Lighthouse scores much lower than expected, "third-party code" or "unminified JavaScript" flagged:** antivirus software (Kaspersky on the original development machine) injects a script into every page and rewrites the CSP. Run Lighthouse with `--blocked-url-patterns="*kaspersky-labs.com*"` and extensions disabled, or test on the deployed site.

---

## Project layout

```
media/                 Original photos (portfolio/<artist>/, portraits/, flash/<artist>/, studio/)
public/                Copied as-is: favicons, robots.txt, security.txt, boot.js, brand SVGs
scripts/
  build-images.mjs     media/ -> public/img/ (AVIF + WebP) and src/manifest/images.json
  prerender.mjs        Renders each route to dist/<route>.html, writes 404.html, sitemap.xml, hidden forms
  build-icons.mjs      Favicons and share image from the logo
  list-todos.mjs       CLIENT-TODO.md
src/
  content/             All site content (see "Editing content")
  pages/               One file per route: Home, Contact, Privacy, Sent, NotFound
  components/sections/ The five home-page sections (Artists, Piercing, How to book, Aftercare, Gallery)
  components/          brand/ (dagger, marks, frame), forms/, layout/, media/, portfolio/, ...
  motion/              engine.ts (GSAP, lazy), effects.ts (on/off switches)
  lib/                 Motion preference, reveals, Netlify form helpers, schema.org JSON-LD
  styles/index.css     Theme tokens and the CSS half of the motion
  routes.tsx           Route list, lazy imports, the paths that get prerendered
netlify.toml           Build, redirects, security headers, caching
```

`public/img/` and `src/manifest/` are build output and are not committed.

---

## Site structure

Two pages, plus two utility URLs:

| URL | What it is |
|---|---|
| `/` | The hero, then five sections in this order: `#artists`, `#piercing`, `#how-to-book`, `#aftercare`, `#gallery` (components in `src/components/sections/`, assembled in `src/pages/Home.tsx`) |
| `/contact` | The booking enquiry form, then the question form under "Just have a question?" |
| `/privacy`, `/sent` | The POPIA notice (linked from the footer and both forms), and the landing page for forms sent without JavaScript (`noindex`) |

- Nav links are `/#<section>`. On `/` they scroll; from `/contact` they navigate and then scroll. `PageRoutes.tsx` does the scrolling (React Router does not scroll to a hash by itself), through Lenis where it runs, otherwise natively. Each section has `scroll-mt-24` so the sticky header does not cover its heading.
- The nav highlight follows the scroll: `useSectionSpy` in `Home.tsx` publishes the section under the top of the viewport and the header reads it (`src/lib/activeSection.ts`).
- Each section has one `h2`, and the page has one `h1` (the hero). Section ids are reserved: do not reuse `#piercing` and friends for anything inside a section (the aftercare sub-sections are `#aftercare-tattoo` and `#aftercare-piercing`).
- The page's JSON-LD (`TattooParlor`) is on `/` only.

### Restoring the artist pages

`/artists` and `/artists/<slug>` were removed when the site went to two pages. All the data is still in `src/content/` (artists, portraits, portfolio, flash), and these are kept but unused: `BookingChannels`, `CornerFrame`, `BramMark`, and `artistPerson` in `src/lib/schema.ts`. (`PortfolioGrid` and `Lightbox` are still used by the Piercing and Gallery sections.) To bring the pages back:

1. Recover the old route components from the commit before the restructure: `git show 81fe22c:src/pages/Artist.tsx` and `git show 81fe22c:src/pages/Artists.tsx` (the old Flash, Piercing, Book, Aftercare and Visit pages are there too).
2. Put them back in `src/pages/`, then add the routes in `src/routes.tsx` (lazy import, `preloadRoute`, `staticPaths`) and `PageRoutes.tsx`.
3. Re-add `employee: publishedArtists.map(artistPerson)` to `studioSchema()` in `src/lib/schema.ts` (the Person JSON-LD was dropped).
4. Delete the `/artists` and `/artists/*` redirects in `netlify.toml`, and point the band's links at the artist pages.

---

## Deploying to Netlify

1. In Netlify, **Add new site → Import an existing project** and pick this repository. The build settings come from `netlify.toml` (`npm run build`, publish `dist`, Node 24.15.0). Leave the UI fields empty.
2. In **Site configuration → Forms**, turn on **form detection**, then trigger a new deploy so Netlify registers the forms (see "Forms").
3. Check the deploy preview before connecting the domain:
   - Send a test enquiry with a reference image, and a question, both through `/contact`. Both should appear under **Forms**.
   - Send one with JavaScript turned off in the browser. It should land on `/sent` and appear under `booking-unsure`. (This path was built to Netlify's docs but not yet tested on a live deploy.)

The first build processes every image in `media/`. With hundreds of photos that takes minutes, and Netlify does it on every deploy, because `public/img/` is not committed. If builds get slow, cache `public/img` and `src/manifest` between builds (for example with `netlify-plugin-cache`). The pipeline already skips files whose output exists.

### Connecting the domain

The domain currently points at a WordPress "Coming Soon" page with the studio's existing host.

1. **Site configuration → Domain management → Add a domain:** `thesouthernrebellion.co.za`. Add `www.thesouthernrebellion.co.za` as well. Set the **apex** (no www) as the primary domain. `netlify.toml` already 301s www to the apex.
2. DNS, at whoever hosts the domain's DNS today:
   - apex `A` record → Netlify's load balancer IP, as shown in Netlify's domain settings (currently `75.2.60.5`)
   - `www` `CNAME` → `<your-site>.netlify.app`
   - Or move the nameservers to Netlify DNS.
3. **Keep the email working.** `info@thesouthernrebellion.co.za` is the studio's booking address. Whatever you do with DNS, the existing `MX` records (and any SPF, DKIM or DMARC `TXT` records) must stay exactly as they are. If you move nameservers to Netlify DNS, recreate them there first.
4. HTTPS is issued automatically once DNS resolves. Check the certificate covers both names.

**HSTS:** `netlify.toml` sends `Strict-Transport-Security: max-age=63072000; includeSubDomains; preload`. `includeSubDomains` forces HTTPS on every subdomain for two years, including webmail or anything else the host runs on a subdomain. Confirm with the studio's host that every subdomain serves HTTPS before going live. Do not submit the domain to hstspreload.org unless you are sure: removal takes months.

### Redirects

The old site had no content URLs, so there is nothing to map one-to-one. `netlify.toml` covers:
- www to apex
- old WordPress paths (`/wp-admin/*`, `/wp-login.php`, `/wp-content/*`, `/feed/*`) and `/sitemap_index.xml`
- the old booking URLs and the Instagram short links: `/book`, `/book/*`, `/booking`, `/bookings` → `/contact`
- the old one-page-per-topic routes: `/artists`, `/piercing`, `/aftercare` → the matching section of `/`; `/artists/<slug>` → `/#artist-<slug>`; `/flash` → `/#artists` (flash now sits inside each artist); `/visit` → `/` (there is no Visit section). Whether Netlify keeps the `#fragment` in the redirect is unverified: check on a deploy preview, and if it does not, point them at `/`.

### Routing and 404s

Each route is a real file (`dist/contact.html`, served at `/contact`), so there is no SPA fallback to `index.html`. Unknown URLs get `404.html` with a real 404 status. To add a page, add it to `src/routes.tsx` (the route, the lazy import, and `staticPaths` so it is prerendered and listed in the sitemap) and to `PageRoutes.tsx`.

---

## Forms

Two forms, both Netlify Forms:

| Form | Where | Netlify form name |
|---|---|---|
| Booking enquiry | `/contact` | `booking-<artist slug>`, `booking-unsure`, `booking-piercing` |
| Question | `/contact` | `contact` |

Netlify only routes notifications per form, not by field value. So the booking form submits under a different form name depending on the artist chosen. `prerender.mjs` writes a hidden copy of every form name into `dist/index.html` so Netlify registers them all. The names come from `src/content/forms.ts`, which reads the published artists, so a new artist gets a new form automatically.

Without JavaScript, the booking form still submits natively, as `booking-unsure`, and lands on `/sent`.

### Notification routing

Set up once, after the first deploy: **Site configuration → Notifications → Emails and webhooks → Form submission notifications → Add notification → Email notification**, one per form.

| Form | Send to |
|---|---|
| `booking-bram` | Bram (`TODO: address`) |
| `booking-bron` | Bron, or info@ (her bio says bookings go to info@) |
| `booking-theshen` | Theshen (`TODO: address`) |
| `booking-rio` | Rio (`TODO: address`) |
| `booking-streetgypsy` | streetgypsy (`TODO: address`) |
| `booking-unsure` | info@thesouthernrebellion.co.za |
| `booking-piercing` | info@thesouthernrebellion.co.za |
| `contact` | info@thesouthernrebellion.co.za |

**Netlify only sends form notifications to active members of the site's Netlify team.** Each artist who should get their own enquiries needs to be invited to the team. If that is not wanted, route with a webhook, Zapier or a Netlify function instead.

The email's subject line comes from a `subject` field the form sets: "Booking enquiry for Theshen" followed by Netlify's submission ID. The reply-to is the visitor's email address, so replying to the notification answers the client.

### Limits and spam

- **Size:** Netlify caps a submission at 8 MB including text, allows one file per field, and times uploads out after 30 seconds. The form allows three reference images, 7 MB in total. Photos over 1.5 MB (JPEG, PNG, WebP) are scaled to 2000px on the long edge in the browser before sending. HEIC files cannot be scaled outside Safari and are sent as they are.
- **Plan:** older Netlify plans meter form submissions and upload storage per month, and some pause the whole account at the limit. Check the studio's plan under **Usage & billing** before launch.
- **Spam:** a honeypot field named `company`, plus Netlify's own Akismet filter. Spam goes to **Forms → Spam submissions**.
- **Testing:** submissions only work on Netlify. Locally the form validates and builds the request, then shows "That didn't go through" because there is no Netlify to receive it. That is expected.

---

## Editing content

Everything the site says is in `src/content/`. Components read from there. After any content change, run `npm run todos` to refresh `CLIENT-TODO.md`, then commit and push. Netlify rebuilds.

### Filling in a TODO

Gaps are written as `todo('question', 'what we know so far')`. Replace the call with the real value:

```ts
// before
street: pending('Street address and unit number'),
// after
street: 'Unit 12, Fairlands on 14th, 14th Street, Fairland',
```

The page then shows the value instead of the dashed TODO box, and the item drops off `CLIENT-TODO.md`. Studio-wide facts (address, hours, parking, map link, privacy officer) are in `studio.ts`; booking policies in `booking.ts`; aftercare in `aftercare.ts`.

Aftercare is medical guidance. Only put in text the studio has written or approved, and fill in `reviewedBy`.

### Adding an artist

1. `src/content/types.ts`: add the slug to `ArtistSlug`, for example `| 'kimmy'`.
2. `src/content/artists.ts`: add an entry (copy an existing one). Only state what the artist states publicly. Set `published: true` when the studio approves the page.
3. `src/content/portfolio.ts` and `src/content/flash.ts`: add `slug: []` to each.
4. Deploy. The artist appears as a band in the Artists section (with a "Book with <name>" link to `/contact?artist=<slug>`), in the booking form's artist list, and gets a new `booking-<slug>` Netlify form, all automatically.
5. In Netlify, add an email notification for the new `booking-<slug>` form.

Kimmy already has an unpublished entry, waiting on the studio to confirm who she is.

### Adding portfolio images

1. Put the original photo (not a screenshot) at `media/portfolio/<artist>/<id>.jpg`, where `<id>` matches an entry in `portfolio.ts`. JPG, PNG, WebP or TIFF.
2. In that entry:
   - set `consentConfirmed: true` **only once the studio confirms the person in the photo agreed** (POPIA)
   - check the `alt` text: style, subject, placement. Never repeat a swear word or a name that is in the tattoo.
   - set `needsDecision: null` if the client has decided to show a flagged piece
3. If the automatic 4:5 crop misses the tattoo, add `media/portfolio/<artist>/<id>.json` with `{ "focus": [0.5, 0.3] }` (0 to 1 from the top-left), and the crop centres there.
4. `npm run dev` or `npm run build` processes it. Unchanged photos are skipped.

To add a piece that is not listed yet, copy an entry in `portfolio.ts`. `featured: true` puts it first in the grid (and in the home hero, for Theshen) and in the artist index. Pieces the studio should not show at all go in `excludedImages` with the reason.

Each artist can have a grade (`GRADES` in `scripts/build-images.mjs`): small saturation and brightness multipliers so one artist's set looks consistent. Leave them at 1 unless the studio asks.

**Portraits:** put the photo at `media/portraits/<artist>.jpg` and set `portrait` in `artists.ts` to `{ imageKey: 'portraits/<artist>', alt: '…', consentConfirmed: true }`. Portraits are shown in black and white inside the ornamental frame.

**Originals in git:** hundreds of full-size photos will make the repository large. Consider Git LFS for `media/`.

### Flash

In `flash.ts`, under the artist's slug. The image goes at `media/flash/<artist>/<id>.png`.

- `status: 'available'`: shown, with a "Claim this piece" link that prefills the booking form
- `status: 'claimed'`: stays on the page, greyed out and marked claimed
- `status: null`: not shown (designs seen on Instagram that the artist has not confirmed as flash)
- To remove a piece, delete the entry.

### Saturday piercing special

In `piercing.ts`: `special.enabled: false` takes it off the Piercing section. The price, day, times and jewellery wording are in the same object. The jewellery wording is copied from the flyer ("standard silver titanium jewellery") and needs confirming.

### Logo and colours

The marks in `public/brand/` and `src/components/brand/geometry.ts` are traced from the Instagram profile picture. When the vector logo arrives:
1. Replace `public/brand/mark-studio.svg` (and `mark-bram.svg`).
2. Update the dagger paths in `geometry.ts` to match. Every dagger on the site (dividers, markers, the blade, the hero) is drawn from that one file.
3. Run `npm run icons`.
4. Sample the real black and white and update `--color-ink` and `--color-bone` in `src/styles/index.css`. Recheck the contrast table in `DESIGN.md`.

---

## Motion

The full vocabulary, and the rules for adding to it, are in `DESIGN.md` under "Motion vocabulary". In short:

- **CSS only, on first load:** the home hero ("the fan") and the image and divider reveals. `public/boot.js` sets `data-motion` on `<html>` before first paint, which switches them on.
- **JavaScript, loaded on the first tap, click, key or scroll:** `src/motion/engine.ts` (GSAP core, SplitText, Lenis, about 36 KB gzipped) runs the page transition ("the blade"), the heading split after a transition, the lightbox and smooth scrolling. The first page load never downloads it, which keeps mobile Lighthouse above 90.
- **Navigation never waits on motion.** If the engine fails to load, or the transition takes longer than 1.5s, the page changes without it.

### Turning effects off

- **One effect, for everyone:** set its flag to `false` in `src/motion/effects.ts` (`fan`, `blade`, `reveals`, `heading`, `lightbox`, `smoothScroll`, `themeSwitch`). Content is unaffected.
- **All motion, for one visitor:** "Reduce motion" in the footer. It is remembered in that browser.
- **Automatically:** visitors with the system "reduce motion" setting get no motion and never download the engine.

Animate only `transform`, `opacity` and `clip-path`. New JavaScript effects go in `engine.ts` and return a `gsap.context().revert()` cleanup.

---

## Light and dark mode

The site opens in **dark mode** for everyone, whatever their device setting. Visitors switch with the toggle in the header (a sun and a moon; the knob shows the current mode), or "Dark mode: on/off" in the footer. A light choice is remembered in that browser; switching back to dark clears it.

- The colours are in `src/styles/index.css`: the `@theme` block is dark, and `:root[data-theme='light']` overrides the same tokens for light. Contrast figures for both are in `DESIGN.md`.
- `public/boot.js` applies the saved choice before the page paints, so a returning light-mode visitor never sees a dark flash.
- `src/lib/theme.ts` (`useTheme`) holds the logic; `src/components/layout/ThemeSwitch.tsx` is the header toggle (`role="switch"`, announced as "Dark mode, on/off"). Every switch on the page stays in step.
- The switch is animated with the blade: the new theme comes down behind a dagger-point edge (`::view-transition-new(root)` in `index.css`, using the browser's View Transitions). It is instant with "Reduce motion" on, in browsers without View Transitions, or with `themeSwitch: false` in `src/motion/effects.ts`.
- The logo (`StudioMark` with its disc) stays black and white in both themes.
- **Never hard-code a colour in a component.** Use the tokens (`bg-ink`, `text-bone`, `border-pewter`, ...) so both themes keep working.

---

## Security

`netlify.toml` sets the headers for every route. The CSP is strict and has no exceptions:

```
default-src 'self'; script-src 'self'; style-src 'self'; img-src 'self' data:; font-src 'self';
connect-src 'self'; manifest-src 'self'; form-action 'self'; frame-ancestors 'none';
base-uri 'self'; object-src 'none'; upgrade-insecure-requests
```

Consequences to keep in mind:
- **No inline scripts.** `public/boot.js` is a separate file for that reason.
- **No `style` attributes in server-rendered HTML.** `prerender.mjs` fails the build if it finds one. Styles set from JavaScript after load are fine.
- **No third-party scripts, fonts, embeds or maps.** Fonts are self-hosted (`@fontsource`). Maps are never embedded: link out to Google Maps instead.
- Adding analytics or an embed means adding its origin to the right directive. Keep it to the one directive it needs.
- The email address is assembled in the browser, so it is not in the HTML for scrapers.

Other headers: HSTS (see "Connecting the domain"), `X-Frame-Options: DENY`, `nosniff`, a restrictive `Permissions-Policy`, `Referrer-Policy: strict-origin-when-cross-origin`, `Cross-Origin-Opener-Policy` and `Cross-Origin-Resource-Policy: same-origin`. `/assets/*` and `/img/*` are cached as immutable; HTML revalidates on every visit.

`npm run preview` sends the same headers, so CSP problems show up locally.

### Dependencies

All versions are pinned exactly. `npm audit` has no high or critical issues. Two moderate React Router advisories remain:
- one affects server-side hydration, which this site does not use
- one is an open redirect through backslashes in `<Link>`, and every link here is a hard-coded internal path

Fixing them means moving to React Router 7. React Router 6's v7 future flags are already on, which makes that move smaller.

---

## Where this differs from the original brief, and why

- **Prerendering** every route, so content shows without JavaScript and link previews (WhatsApp, Instagram) get each page's own title and image.
- **Unknown URLs get a real 404** instead of the `/* /index.html 200` SPA fallback, because every real route is its own file.
- **No Framer Motion, no ScrollTrigger, no `@gsap/react`.** GSAP core covers what needs JavaScript. CSS covers the rest. Loading GSAP during the first page load cost about 900ms on a throttled phone.
- **Vite 7 rather than 8,** to stay on the stable `@vitejs/plugin-react` 5.

---

## Before launch

The full list for the studio is in [CLIENT-TODO.md](CLIENT-TODO.md): 101 open questions, 84 portfolio photos to collect (with where each one is on Instagram) and 7 images left out, with reasons. The ones that block launch:

**From the studio**
- Street address, hours, parking, Google Maps link, and how to name the area (Fairland, Fairlands or Randburg)
- Booking policy: deposits, design fees, reschedules, no-shows, minimums, age and ID
- Aftercare text, written or approved by the studio
- Original photos with consent for each artist, and a portrait of each
- Bios and years tattooing for each artist
- Confirmation of the Saturday special (still running, price, jewellery wording)
- Who Kimmy is, and streetgypsy's preferred credit
- Permission to use "Tattoos for the unique and curious" (streetgypsy's line) as the studio's
- The vector logo
- POPIA information officer and how long enquiries are kept; a review of the privacy notice

**For whoever deploys**
- Artist email addresses, team invitations and notification routing in Netlify
- A live form test with file uploads, including one with JavaScript off
- The Netlify plan's form and upload limits
- DNS move without breaking the studio's email (`MX` records)
- An HTTPS check on every subdomain before relying on HSTS `includeSubDomains`
- The contact for `public/.well-known/security.txt` (currently info@), and its `Expires` date (2027-11-03)
