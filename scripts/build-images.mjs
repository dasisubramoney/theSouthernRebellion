// Image pipeline.
//
// Reads originals from media/<group>/<artist?>/<name>.(jpg|jpeg|png|webp|tif)
// and writes AVIF + WebP sizes to public/img, plus a manifest at
// src/manifest/images.json, which the <Picture> component reads.
//
// Each source gets two renditions:
//   grid  cropped to 4:5 for portfolio and flash grids
//   full  original aspect for the lightbox
//
// Crop focus: put a sidecar <name>.json next to the original with
//   { "focus": [x, y] }  // 0..1 from the top-left, e.g. [0.5, 0.3]
// Without one, sharp's "attention" strategy picks the busiest region.
//
// Grade: per-artist adjustments live in GRADES below. Keep them subtle.
// Filenames carry a hash of the source, so unchanged images are skipped
// and the /img/* cache headers can be immutable.

import { createHash } from 'node:crypto';
import { mkdir, readdir, readFile, rm, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const SRC = 'media';
const OUT = 'public/img';
const MANIFEST = 'src/manifest/images.json';
const EXT = new Set(['.jpg', '.jpeg', '.png', '.webp', '.tif', '.tiff']);

const RENDITIONS = {
  grid: { aspect: 4 / 5, widths: [360, 540, 720, 1080] },
  full: { aspect: null, widths: [800, 1400, 2000] },
};

const FORMATS = {
  avif: (img) => img.avif({ quality: 52, effort: 5 }),
  webp: (img) => img.webp({ quality: 74, effort: 5 }),
};

/** Per-artist grade. `saturation` and `brightness` are multipliers, `gamma` >= 1. */
const GRADES = {
  default: { saturation: 1, brightness: 1, gamma: null },
};

async function walk(dir) {
  if (!existsSync(dir)) return [];
  const out = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...(await walk(full)));
    else if (EXT.has(path.extname(entry.name).toLowerCase())) out.push(full);
  }
  return out;
}

async function readSidecar(file) {
  const side = file.replace(/\.[^.]+$/, '.json');
  if (!existsSync(side)) return {};
  return JSON.parse(await readFile(side, 'utf8'));
}

function cropBox(meta, aspect, focus) {
  const { width: w, height: h } = meta;
  let cw = w;
  let ch = Math.round(w / aspect);
  if (ch > h) {
    ch = h;
    cw = Math.round(h * aspect);
  }
  const [fx, fy] = focus;
  const left = Math.min(Math.max(Math.round(fx * w - cw / 2), 0), w - cw);
  const top = Math.min(Math.max(Math.round(fy * h - ch / 2), 0), h - ch);
  return { left, top, width: cw, height: ch };
}

function graded(img, grade) {
  let out = img.modulate({ saturation: grade.saturation, brightness: grade.brightness });
  if (grade.gamma) out = out.gamma(grade.gamma);
  return out;
}

const manifest = {};
const keep = new Set();
const files = await walk(SRC);

for (const file of files) {
  const rel = path.relative(SRC, file).split(path.sep).join('/');
  const key = rel.replace(/\.[^.]+$/, '');
  const [group, maybeArtist] = key.split('/');
  const buf = await readFile(file);
  const hash = createHash('sha256').update(buf).digest('hex').slice(0, 10);
  const side = await readSidecar(file);
  const grade = GRADES[maybeArtist] ?? GRADES.default;
  const base = sharp(buf, { failOn: 'none' }).rotate();
  const meta = await base.metadata();
  const oriented =
    meta.orientation && meta.orientation >= 5
      ? { width: meta.height, height: meta.width }
      : { width: meta.width, height: meta.height };

  const entry = {};
  for (const [name, spec] of Object.entries(RENDITIONS)) {
    const box = spec.aspect ? cropBox(oriented, spec.aspect, side.focus ?? [0.5, 0.5]) : null;
    const useAttention = Boolean(spec.aspect) && !side.focus;
    const ratio = spec.aspect ?? oriented.width / oriented.height;
    const maxAvailable = box ? box.width : oriented.width;
    const widths = spec.widths.filter((w) => w <= maxAvailable);
    if (widths.length === 0) widths.push(maxAvailable);

    const sources = {};
    for (const [fmt, encode] of Object.entries(FORMATS)) {
      sources[fmt] = [];
      for (const w of widths) {
        const outRel = `${key}.${hash}.${name}-${w}.${fmt}`;
        const outFile = path.join(OUT, outRel);
        keep.add(path.normalize(outFile));
        sources[fmt].push({ w, src: `/img/${outRel}` });
        if (existsSync(outFile)) continue;
        await mkdir(path.dirname(outFile), { recursive: true });
        // sharp applies one resize per pipeline, so each branch resizes exactly once.
        let img = sharp(buf, { failOn: 'none' }).rotate();
        if (useAttention) {
          img = img.resize({
            width: w,
            height: Math.round(w / ratio),
            fit: 'cover',
            position: sharp.strategy.attention,
          });
        } else {
          if (box) img = img.extract(box);
          img = img.resize({ width: w, withoutEnlargement: true });
        }
        await encode(graded(img, grade)).toFile(outFile);
      }
    }
    const maxW = widths[widths.length - 1];
    entry[name] = { width: maxW, height: Math.round(maxW / ratio), ...sources };
  }
  manifest[key] = { group, ...entry };
}

// Remove outputs whose source has gone or changed.
async function prune(dir) {
  if (!existsSync(dir)) return;
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      await prune(full);
      if ((await readdir(full)).length === 0) await rm(full, { recursive: true });
    } else if (!keep.has(path.normalize(full))) {
      await rm(full);
    }
  }
}
await prune(OUT);

await mkdir(path.dirname(MANIFEST), { recursive: true });
const next = JSON.stringify(manifest, null, 2) + '\n';
const prev = existsSync(MANIFEST) ? await readFile(MANIFEST, 'utf8') : '';
if (next !== prev) await writeFile(MANIFEST, next);

const count = Object.keys(manifest).length;
console.log(`images: ${count} source${count === 1 ? '' : 's'} processed`);
