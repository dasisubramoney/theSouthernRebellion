import { Seo } from '../components/seo/Seo';
import { Dagger } from '../components/brand/Dagger';
import { TodoNote, TodoOr } from '../components/content/TodoNote';
import { ExternalLink } from '../components/layout/ExternalLink';
import { aftercare } from '../content/aftercare';
import { studio } from '../content/studio';
import { isTodo, type Maybe } from '../content/todo';

type Section = { heading: string; body: Maybe<string> };

const parts = [
  { id: 'tattoo', title: 'New tattoo', sections: aftercare.tattoo },
  { id: 'piercing', title: 'New piercing', sections: aftercare.piercing },
] as const;

export default function Aftercare() {
  return (
    <>
      <Seo
        title="Aftercare"
        description="Aftercare for new tattoos and piercings from The Southern Rebellion, Johannesburg, and when to call the studio."
        path="/aftercare"
      />

      <section className="shell pt-10 md:pt-16">
        <h1 className="max-w-[14ch] font-display text-h1">Looking after it once you leave</h1>
        <p className="measure mt-6 text-lead text-smoke">
          Follow what your artist told you on the day. If anything here is different, or something doesn’t look right,
          ask the studio.
        </p>
        <p className="mt-6">
          <ExternalLink className="link font-semibold" href={studio.whatsapp}>
            WhatsApp the studio on <span className="num">{studio.phoneDisplay}</span>
          </ExternalLink>
        </p>
        <TodoOr className="mt-6 text-small text-ash" value={aftercare.reviewedBy}>
          {(v) => <p className="mt-6 text-small text-ash">Reviewed by {v}</p>}
        </TodoOr>
      </section>

      <div className="shell mt-(--section) grid-page gap-y-12">
        <nav aria-label="Aftercare sections" className="col-span-4 md:col-span-8 lg:col-span-3">
          <ul className="flex gap-6 border-b border-coal pb-4 lg:sticky lg:top-24 lg:flex-col lg:gap-3 lg:border-b-0">
            {parts.map((p) => (
              <li key={p.id}>
                <a className="link ui" href={`#${p.id}`}>
                  {p.title}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="col-span-4 space-y-(--section) md:col-span-8 lg:col-span-8 lg:col-start-5">
          {parts.map((p) => (
            <section key={p.id} id={p.id} aria-labelledby={`${p.id}-heading`} className="scroll-mt-24">
              <h2 id={`${p.id}-heading`} className="font-display text-h2">
                {p.title}
              </h2>
              <ol className="mt-8 border-t border-coal">
                {(p.sections as readonly Section[]).map((s, i) => (
                  <li key={s.heading} className="grid grid-cols-[2.5rem_1fr] gap-x-4 border-b border-coal py-6">
                    <span className="flex items-start gap-1.5 pt-1 text-ash">
                      <Dagger className="h-4 w-auto" />
                      <span className="ui num">{i + 1}</span>
                    </span>
                    <div>
                      <h3 className="text-h3 font-semibold">{s.heading}</h3>
                      {isTodo(s.body) ? <TodoNote className="mt-3" item={s.body} /> : <p className="measure mt-2">{s.body}</p>}
                    </div>
                  </li>
                ))}
              </ol>
            </section>
          ))}
        </div>
      </div>
    </>
  );
}
