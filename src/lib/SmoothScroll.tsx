import { useEngine } from './useEngine';
import { effects } from '../motion/effects';

/**
 * Lenis smooth scrolling while motion is on, from the first interaction
 * (fine pointers only; touch keeps native scrolling).
 */
export function SmoothScroll() {
  useEngine((e) => e.smoothScroll(), [], { waitForInteraction: true, enabled: effects.smoothScroll });
  return null;
}
