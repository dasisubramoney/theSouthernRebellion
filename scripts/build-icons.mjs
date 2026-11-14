// Builds the favicon set, app icons and default share image from public/brand/mark-studio.svg.
// Run with `npm run icons` after the logo changes. Outputs are committed.
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import sharp from 'sharp';

const INK = '#0B0B0B';
const BONE = '#F5F3EE';
const mark = await readFile('public/brand/mark-studio.svg');

const png = (size) => sharp(mark, { density: 600 }).resize(size, size).png().toBuffer();

// Mark centred on a square ink field, scaled to `share` of the side.
async function onField(side, share) {
  const inner = Math.round(side * share);
  const art = await sharp(mark, { density: 600 }).resize(inner, inner).png().toBuffer();
  return sharp({ create: { width: side, height: side, channels: 4, background: INK } })
    .composite([{ input: art, gravity: 'centre' }])
    .png()
    .toBuffer();
}

// ICO containing a single 32px PNG (supported by every current browser).
function ico(pngBuffer, size) {
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(1, 4);
  const entry = Buffer.alloc(16);
  entry.writeUInt8(size, 0);
  entry.writeUInt8(size, 1);
  entry.writeUInt8(0, 2);
  entry.writeUInt8(0, 3);
  entry.writeUInt16LE(1, 4);
  entry.writeUInt16LE(32, 6);
  entry.writeUInt32LE(pngBuffer.length, 8);
  entry.writeUInt32LE(22, 12);
  return Buffer.concat([header, entry, pngBuffer]);
}

await writeFile('public/favicon.svg', mark);
await writeFile('public/favicon.ico', ico(await png(32), 32));
await writeFile('public/apple-touch-icon.png', await onField(180, 0.86));
await writeFile('public/icon-192.png', await png(192));
await writeFile('public/icon-512.png', await png(512));
await writeFile('public/icon-maskable-512.png', await onField(512, 0.72));

// Default Open Graph image, 1200x630: mark on ink with the studio name.
await mkdir('public/og', { recursive: true });
const ogMark = await sharp(mark, { density: 600 }).resize(360, 360).png().toBuffer();
const words = Buffer.from(
  `<svg xmlns="http://www.w3.org/2000/svg" width="640" height="200">
    <text x="0" y="80" fill="${BONE}" font-family="Georgia, serif" font-size="64" letter-spacing="2">THE SOUTHERN</text>
    <text x="0" y="160" fill="${BONE}" font-family="Georgia, serif" font-size="64" letter-spacing="2">REBELLION</text>
  </svg>`,
);
await sharp({ create: { width: 1200, height: 630, channels: 4, background: INK } })
  .composite([
    { input: ogMark, left: 110, top: 135 },
    { input: words, left: 530, top: 215 },
  ])
  .png()
  .toFile('public/og/studio.png');

console.log('icons written');
