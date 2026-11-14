# The Southern Rebellion Tattoo Company website

Marketing and booking site for The Southern Rebellion, an artist-led tattoo and piercing studio at Fairlands on 14th, Johannesburg. Deployed on Netlify at `thesouthernrebellion.co.za`.

- Vite 7, React 18, TypeScript, Tailwind 4 (custom theme only), React Router 6
- Every route is prerendered to static HTML at build time, then hydrated
- Content lives in typed files under `src/content/`, not in components
- Booking and contact forms use Netlify Forms
- Motion: CSS for the first page load, GSAP and Lenis loaded on the first interaction

Design rules (colours, type, the dagger motif, the motion vocabulary) are in [DESIGN.md](DESIGN.md). Open questions for the studio are in [CLIENT-TODO.md](CLIENT-TODO.md).

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
  pages/               One file per route
  components/          brand/ (dagger, marks, frame), forms/, layout/, media/, portfolio/, ...
  motion/              engine.ts (GSAP, lazy), effects.ts (on/off switches)
  lib/                 Motion preference, reveals, Netlify form helpers, schema.org JSON-LD
  styles/index.css     Theme tokens and the CSS half of the motion
  routes.tsx           Route list, lazy imports, the paths that get prerendered
netlify.toml           Build, redirects, security headers, caching
```

`public/img/` and `src/manifest/` are build output and are not committed.

---

## Deploying to Netlify

1. In Netlify, **Add new site → Import an existing project** and pick this repository. The build settings come from `netlify.toml` (`npm run build`, publish `dist`, Node 24.15.0). Leave the UI fields empty.
2. In **Site configuration → Forms**, turn on **form detection**, then trigger a new deploy so Netlify registers the forms (see "Forms").
3. Check the deploy preview before connecting the domain:
   - Send a test enquiry with a reference image through `/book`, and a question through `/visit`. Both should appear under **Forms**.
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
- short links for Instagram bios: `/booking` and `/bookings` → `/book`, `/contact` → `/visit`

### Routing and 404s

Each route is a real file (`dist/artists/theshen.html`, served at `/artists/theshen`), so there is no SPA fallback to `index.html`. Unknown URLs get `404.html` with a real 404 status. To add a page, add it to `src/routes.tsx` (the route, the lazy import, and `staticPaths` so it is prerendered and listed in the sitemap) and to `PageRoutes.tsx`.

---

## Forms

Two forms, both Netlify Forms:

| Form | Where | Netlify form name |
|---|---|---|
| Booking enquiry | `/book#enquiry` | `booking-<artist slug>`, `booking-unsure`, `booking-piercing` |
| Question | `/visit` | `contact` |

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
4. Deploy. The artist page, the roster, the artists index, the sitemap, the schema.org data and a new `booking-<slug>` Netlify form all appear automatically.
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

In `piercing.ts`: `special.enabled: false` takes it off the home page and the piercing page. The price, day, times and jewellery wording are in the same object. The jewellery wording is copied from the flyer ("standard silver titanium jewellery") and needs confirming.

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

- **One effect, for everyone:** set its flag to `false` in `src/motion/effects.ts` (`fan`, `blade`, `reveals`, `heading`, `lightbox`, `smoothScroll`). Content is unaffected.
- **All motion, for one visitor:** "Reduce motion" in the footer. It is remembered in that browser.
- **Automatically:** visitors with the system "reduce motion" setting get no motion and never download the engine.

Animate only `transform`, `opacity` and `clip-path`. New JavaScript effects go in `engine.ts` and return a `gsap.context().revert()` cleanup.

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
- **No third-party scripts, fonts, embeds or maps.** Fonts are self-hosted (`@fontsource`). The Visit page links out to Google Maps instead of embedding it.
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
