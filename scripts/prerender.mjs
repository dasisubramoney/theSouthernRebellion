// Renders every route in staticPaths to its own HTML file in dist/, writes
// 404.html and sitemap.xml, injects font preloads, and adds a hidden copy of
// every Netlify form to index.html so Netlify registers them at deploy.
// The real forms render on /contact. They carry no data-netlify attribute, so Netlify
// does not detect them there: each form name is registered exactly once, by the copy here.
import { mkdir, readdir, readFile, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const DIST = 'dist';
const ORIGIN = 'https://thesouthernrebellion.co.za';

const server = await import(pathToFileURL(path.resolve('dist-ssr/entry-server.js')).href);
const { render, staticPaths, unlistedPaths, bookingFields, bookingFormNames, contactFields, fileFields, honeypotField } = server;

const template = await readFile(path.join(DIST, 'index.html'), 'utf8');

// Preload the two latin font files so text does not reflow when they arrive.
const assets = await readdir(path.join(DIST, 'assets'));
const preloads = assets
  .filter((f) => /^(sancreek-latin-400-normal|libre-franklin-latin-wght-normal)-.*\.woff2$/.test(f))
  .map((f) => `<link rel="preload" href="/assets/${f}" as="font" type="font/woff2" crossorigin>`)
  .join('');

const esc = (s) => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');

function hiddenForms() {
  const bookingInputs = bookingFields
    .map((f) => `<input type="${fileFields.has(f) ? 'file' : 'text'}" name="${f}">`)
    .join('');
  const booking = bookingFormNames
    .map(
      (name) =>
        `<form name="${esc(name)}" data-netlify="true" netlify-honeypot="${honeypotField}" enctype="multipart/form-data" hidden>` +
        `<input type="text" name="${honeypotField}">${bookingInputs}</form>`,
    )
    .join('');
  const contact =
    `<form name="contact" data-netlify="true" netlify-honeypot="${honeypotField}" hidden>` +
    `<input type="text" name="${honeypotField}">` +
    contactFields.map((f) => `<input type="text" name="${f}">`).join('') +
    `</form>`;
  return booking + contact;
}

function page({ html, head }, { forms = false } = {}) {
  return template
    .replace('<!--app-head-->', preloads + head)
    .replace('<!--app-html-->', html)
    .replace('<!--netlify-forms-->', forms ? hiddenForms() : '');
}

function outFile(route) {
  if (route === '/') return path.join(DIST, 'index.html');
  return path.join(DIST, `${route.replace(/^\//, '')}.html`);
}

const inlineStyle = /<[^>]+\sstyle="/;

for (const route of [...staticPaths, ...unlistedPaths]) {
  const result = await render(route);
  const html = page(result, { forms: route === '/' });
  if (inlineStyle.test(result.html)) {
    throw new Error(`${route}: server HTML has a style attribute, which the CSP blocks.`);
  }
  const file = outFile(route);
  await mkdir(path.dirname(file), { recursive: true });
  await writeFile(file, html);
}

await writeFile(path.join(DIST, '404.html'), page(await render('/404')));

const today = new Date().toISOString().slice(0, 10);
const sitemap =
  '<?xml version="1.0" encoding="UTF-8"?>\n' +
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
  staticPaths
    .map((r) => `  <url><loc>${ORIGIN}${r === '/' ? '/' : r}</loc><lastmod>${today}</lastmod></url>`)
    .join('\n') +
  '\n</urlset>\n';
await writeFile(path.join(DIST, 'sitemap.xml'), sitemap);

await rm('dist-ssr', { recursive: true, force: true });
console.log(`prerendered ${staticPaths.length + unlistedPaths.length} routes + 404`);
