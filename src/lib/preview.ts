import { portfolio, visiblePortfolio } from '../content/portfolio';
import type { ArtistSlug, PortfolioEntry } from '../content/types';

/**
 * Content preview: shows every portfolio entry as a labelled placeholder, including
 * ones without consent, so layouts can be reviewed before photos arrive.
 * On in `npm run dev`. In a build, only when VITE_CONTENT_PREVIEW=true.
 * Never set that variable for the production context on Netlify.
 */
export const contentPreview = import.meta.env.DEV || import.meta.env.VITE_CONTENT_PREVIEW === 'true';

export function portfolioFor(slug: ArtistSlug): PortfolioEntry[] {
  return contentPreview ? (portfolio[slug] ?? []) : visiblePortfolio(slug);
}

export function leadPiece(slug: ArtistSlug): PortfolioEntry | undefined {
  const list = portfolioFor(slug);
  return list.find((p) => p.featured) ?? list[0];
}
