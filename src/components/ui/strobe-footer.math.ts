/** Pure maths for the poster footer. No DOM, so it is tested directly (strobe-footer.math.test.ts). */

export const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));

/* ---------------------------------------------------------------- springs */

export const ZETA = 0.72;
export const DT_CAP = 0.05;
export const SUBSTEPS = 3;

/** Echo i (1 = nearest the real blade) is softer than the one before, so a sweep leaves a trail. */
export const stiffnessFor = (i: number) => 200 / (1 + i * 0.5);

export type Spring = { x: number; v: number };

/** One semi-implicit Euler step: a = k(target − x) − 2ζ√k·v; v += a·dt; x += v·dt. */
export function springStep(s: Spring, target: number, k: number, dt: number, zeta = ZETA): Spring {
  const a = k * (target - s.x) - 2 * zeta * Math.sqrt(k) * s.v;
  const v = s.v + a * dt;
  return { x: s.x + v * dt, v };
}

/** Advances a spring by one frame: dt capped, split into sub-steps for stability. */
export function springFrame(s: Spring, target: number, k: number, frameDt: number): Spring {
  const dt = Math.min(Math.max(frameDt, 0), DT_CAP) / SUBSTEPS;
  let next = s;
  for (let n = 0; n < SUBSTEPS; n++) next = springStep(next, target, k, dt);
  return next;
}

/** Close enough to rest that the animation loop can stop. */
export const isSettled = (s: Spring, target: number, eps = 0.01) => Math.abs(target - s.x) < eps && Math.abs(s.v) < eps;

/* -------------------------------------------------------------------- fan */

export const ECHOES_PER_SIDE = 6;
export const FAN_STEP = 14;

/** Angle (degrees) of echo i on one side. dir is -1 for the left side, +1 for the right. */
export function fanAngle(i: number, dir: -1 | 1, spread = 1, swing = 0, step = FAN_STEP): number {
  return clamp(dir * i * step * spread + swing, -165, 165);
}

/** Each echo prints a little larger, like a copy of a copy. */
export const echoScale = (i: number) => 1 + i * 0.06;

/**
 * Pointer position over the stage (0..1 on each axis, 0,0 top-left) to fan drive:
 * left/right turns the whole fan, high opens it, low folds it.
 */
export function pointerDrive(x: number, y: number): { swing: number; spread: number } {
  return {
    swing: clamp((x - 0.5) * 2, -1, 1) * 18,
    spread: clamp(1 + (0.5 - y) * 0.5, 0.74, 1.24),
  };
}

/* ---------------------------------------------------------------- barcode */

/** EAN left-hand (odd parity) patterns for 0–9. */
export const L_PATTERNS = ['0001101', '0011001', '0010011', '0111101', '0100011', '0110001', '0101111', '0111011', '0110111', '0001011'];

/** The module string: 101 guard, one L-pattern per digit, 101 guard. Non-digits are ignored. */
export function barcodeModules(digits: string): string {
  const body = [...digits].filter((d) => /\d/.test(d)).map((d) => L_PATTERNS[Number(d)]).join('');
  return `101${body}101`;
}

/** Runs of 1s merged into bars: x and width in modules. */
export function barcodeBars(digits: string): { bars: { x: number; w: number }[]; width: number } {
  const m = barcodeModules(digits);
  const bars: { x: number; w: number }[] = [];
  let start = -1;
  for (let i = 0; i <= m.length; i++) {
    if (m[i] === '1') {
      if (start < 0) start = i;
    } else if (start >= 0) {
      bars.push({ x: start, w: i - start });
      start = -1;
    }
  }
  return { bars, width: m.length };
}

/* ---------------------------------------------------------------- wordmark */

/**
 * Scale for fitting the wordmark's ink box edge to edge in the band: x fills the width,
 * y fills the height but stays within 0.8× and 2.6× of the x scale, so letters are
 * stretched like a poster, never squashed flat or pulled into sticks.
 */
export function fitScale(boxW: number, boxH: number, inkW: number, inkH: number): { sx: number; sy: number } {
  if (inkW <= 0 || inkH <= 0) return { sx: 1, sy: 1 };
  const sx = boxW / inkW;
  const sy = clamp(boxH / inkH, sx * 0.8, sx * 2.6);
  return { sx, sy };
}
