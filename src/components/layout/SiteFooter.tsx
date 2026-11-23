import { Link } from 'react-router-dom';
import { studio } from '../../content/studio';
import { TodoOr } from '../content/TodoNote';
import { useMotion } from '../../lib/motion';
import { useTheme } from '../../lib/theme';
import { instagramUrl } from '../../lib/links';
import { EmailLink } from './EmailLink';
import { ExternalLink } from './ExternalLink';
import { DaggerRule } from '../brand/DaggerRule';
import { primaryNav } from './nav';

export function SiteFooter() {
  const { reduced, setChoice } = useMotion();
  const { theme, toggle } = useTheme();
  const year = new Date().getFullYear();

  return (
    <footer className="mt-(--section) pb-10">
      <div className="shell">
        <DaggerRule className="text-ash" />
        <div className="grid-page mt-12 gap-y-10">
          <div className="col-span-4 md:col-span-4 lg:col-span-5">
            <p className="font-display text-h3 leading-none sm:text-h2">{studio.legalName}</p>
            <p className="mt-4 text-ash">
              {studio.location.centre}, {studio.location.city}
            </p>
            <TodoOr className="mt-3 text-ash" value={studio.location.street} />
          </div>

          <div className="col-span-4 sm:col-span-2 md:col-span-2 lg:col-span-3">
            <h2 className="ui text-ash">Talk to the studio</h2>
            <ul className="mt-4 space-y-2">
              <li>
                <ExternalLink className="link" href={studio.whatsapp}>
                  WhatsApp <span className="num">{studio.phoneDisplay}</span>
                </ExternalLink>
              </li>
              <li>
                <EmailLink className="link" {...studio.email} />
              </li>
              <li>
                <ExternalLink className="link" href={instagramUrl(studio.instagram)}>
                  Instagram @{studio.instagram}
                </ExternalLink>
              </li>
            </ul>
          </div>

          <nav aria-label="Footer" className="col-span-4 sm:col-span-2 md:col-span-2 lg:col-span-2">
            <h2 className="ui text-ash">Pages</h2>
            <ul className="mt-4 space-y-2">
              {primaryNav.map((item) => (
                <li key={item.to}>
                  <Link className="link" to={item.to}>
                    {item.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link className="link" to="/privacy">
                  Privacy
                </Link>
              </li>
            </ul>
          </nav>

          <div className="col-span-4 md:col-span-8 lg:col-span-2">
            <h2 className="ui text-ash">Hours</h2>
            <TodoOr className="mt-4" value={studio.hours} />
          </div>
        </div>

        <div className="mt-16 flex flex-col gap-4 border-t border-coal pt-6 text-small text-ash sm:flex-row sm:items-center sm:justify-between">
          <p className="num">
            © {year} {studio.legalName}
          </p>
          <div className="flex flex-wrap gap-x-6 gap-y-2">
            <button type="button" className="link text-left" aria-pressed={theme === 'dark'} onClick={toggle}>
              Dark mode: {theme === 'dark' ? 'on' : 'off'}
            </button>
            <button
              type="button"
              className="link text-left"
              aria-pressed={reduced}
              onClick={() => setChoice(reduced ? 'full' : 'reduced')}
            >
              Reduce motion: {reduced ? 'on' : 'off'}
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
