import { describe, expect, it } from 'vitest';
import {
  barcodeBars,
  barcodeModules,
  clamp,
  echoScale,
  fanAngle,
  fitScale,
  isSettled,
  pointerDrive,
  springFrame,
  springStep,
  stiffnessFor,
} from './strobe-footer.math';

describe('springs', () => {
  it('softens with each echo', () => {
    expect(stiffnessFor(0)).toBe(200);
    expect(stiffnessFor(2)).toBe(100);
    expect(stiffnessFor(6)).toBeCloseTo(50);
    expect(stiffnessFor(3)).toBeLessThan(stiffnessFor(2));
  });

  it('steps with semi-implicit Euler', () => {
    const k = 100;
    const dt = 0.01;
    const s = springStep({ x: 0, v: 0 }, 10, k, dt, 0.72);
    const a = k * 10; // velocity is 0, so no damping term yet
    expect(s.v).toBeCloseTo(a * dt);
    expect(s.x).toBeCloseTo(s.v * dt); // position uses the new velocity
  });

  it('converges on the target and settles', () => {
    let s = { x: 0, v: 0 };
    for (let n = 0; n < 240; n++) s = springFrame(s, 42, stiffnessFor(3), 1 / 60);
    expect(s.x).toBeCloseTo(42, 1);
    expect(isSettled(s, 42)).toBe(true);
  });

  it('is not settled while moving', () => {
    expect(isSettled({ x: 0, v: 0 }, 10)).toBe(false);
    expect(isSettled({ x: 10, v: 5 }, 10)).toBe(false);
  });

  it('caps a long frame so a stalled tab does not explode the spring', () => {
    const capped = springFrame({ x: 0, v: 0 }, 100, 200, 2);
    const fifty = springFrame({ x: 0, v: 0 }, 100, 200, 0.05);
    expect(capped).toEqual(fifty);
    expect(Number.isFinite(capped.x)).toBe(true);
  });

  it('overshoots slightly with ζ = 0.72 (underdamped) but stays bounded', () => {
    let s = { x: 0, v: 0 };
    let peak = 0;
    for (let n = 0; n < 240; n++) {
      s = springFrame(s, 1, 200, 1 / 60);
      peak = Math.max(peak, s.x);
    }
    expect(peak).toBeGreaterThan(1);
    expect(peak).toBeLessThan(1.1);
  });
});

describe('fan', () => {
  it('opens left and right symmetrically', () => {
    expect(fanAngle(1, -1)).toBe(-14);
    expect(fanAngle(1, 1)).toBe(14);
    expect(fanAngle(6, 1)).toBe(84);
  });

  it('applies spread and swing', () => {
    expect(fanAngle(2, 1, 1.24, 0)).toBeCloseTo(34.72);
    expect(fanAngle(2, -1, 1, 18)).toBe(-10);
  });

  it('never folds past ±165°', () => {
    expect(fanAngle(6, 1, 1.24, 200)).toBe(165);
    expect(fanAngle(6, -1, 1.24, -200)).toBe(-165);
  });

  it('prints each echo a little larger', () => {
    expect(echoScale(0)).toBe(1);
    expect(echoScale(6)).toBeCloseTo(1.36);
  });

  it('maps the pointer to swing and spread', () => {
    expect(pointerDrive(0.5, 0.5)).toEqual({ swing: 0, spread: 1 });
    expect(pointerDrive(1, 0).swing).toBe(18);
    expect(pointerDrive(0, 0).swing).toBe(-18);
    expect(pointerDrive(0.5, 0).spread).toBeCloseTo(1.24);
    expect(pointerDrive(0.5, 1).spread).toBeCloseTo(0.75);
    expect(pointerDrive(0.5, 5).spread).toBe(0.74);
  });
});

describe('barcode', () => {
  it('wraps L-patterns in 101 guards', () => {
    expect(barcodeModules('0')).toBe('101' + '0001101' + '101');
    expect(barcodeModules('12')).toBe('101' + '0011001' + '0010011' + '101');
  });

  it('ignores non-digits', () => {
    expect(barcodeModules('0 6-4')).toBe(barcodeModules('064'));
  });

  it('merges runs of 1s into bars', () => {
    const { bars, width } = barcodeBars('0');
    // 101 0001101 101 -> 1,0,1, 0,0,0,1,1,0,1, 1,0,1
    expect(width).toBe(13);
    expect(bars).toEqual([
      { x: 0, w: 1 },
      { x: 2, w: 1 },
      { x: 6, w: 2 },
      { x: 9, w: 2 },
      { x: 12, w: 1 },
    ]);
  });

  it('encodes the studio number', () => {
    const { width, bars } = barcodeBars('0645075342');
    expect(width).toBe(3 + 10 * 7 + 3);
    const ink = bars.reduce((n, b) => n + b.w, 0);
    expect(ink).toBe([...barcodeModules('0645075342')].filter((c) => c === '1').length);
  });
});

describe('fitScale', () => {
  it('fills the width', () => {
    expect(fitScale(1000, 300, 500, 100).sx).toBe(2);
  });

  it('fills the height within 0.8× to 2.6× of the x scale', () => {
    expect(fitScale(1000, 300, 500, 100).sy).toBe(3); // 300/100 = 3, within 1.6..5.2
    expect(fitScale(1000, 1000, 500, 100).sy).toBeCloseTo(5.2); // capped at 2.6 × 2
    expect(fitScale(1000, 50, 500, 100).sy).toBeCloseTo(1.6); // floored at 0.8 × 2
  });

  it('survives an empty measurement', () => {
    expect(fitScale(1000, 300, 0, 0)).toEqual({ sx: 1, sy: 1 });
  });

  it('clamps', () => {
    expect(clamp(5, 0, 1)).toBe(1);
    expect(clamp(-5, 0, 1)).toBe(0);
  });
});
