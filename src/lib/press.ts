import { effects } from '../motion/effects';

/**
 * Class for buttons and button-like links: the colour change on hover plus press feedback
 * (`press` in index.css). With effects.press off, only the colour change.
 */
export const press = effects.press ? 'press' : 'transition-colors duration-150';
