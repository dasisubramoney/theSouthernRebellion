import { Dagger } from '../brand/Dagger';
import { TodoNote, TodoOr } from '../content/TodoNote';
import { ExternalLink } from '../layout/ExternalLink';
import { aftercare } from '../../content/aftercare';
import { studio } from '../../content/studio';
import { isTodo, type Maybe, type Todo } from '../../content/todo';

type Section = { heading: string; body: Maybe<string | readonly string[]>; open?: Todo };

/** Ids are prefixed so they cannot collide with the page's own section ids ("#piercing" is the piercing section). */
const parts = [
  { id: 'aftercare-tattoo', title: 'New tattoo', sections: aftercare.tattoo },
  { id: 'aftercare-piercing', title: 'New piercing', sections: aftercare.piercing },
] as const;

/**
 * From tablet up the steps zig-zag: the odd steps in the left column, the even steps in the right
 * column and half a step lower. Each step spans two grid rows and starts one row after the step
 * before it, so the page order stays 1, 2, 3 and nothing needs a pixel offset. Written out in full
 * because Tailwind only generates class names it can find in the source. This covers up to 12 steps
 * in a list; add entries here if a list ever grows past that.
 */
const rowStart = [
  'md:row-start-1',
  'md:row-start-2',
  'md:row-start-3',
  'md:row-start-4',
  'md:row-start-5',
  'md:row-start-6',
  'md:row-start-7',
  'md:row-start-8',
  'md:row-start-9',
  'md:row-start-10',
  'md:row-start-11',
  'md:row-start-12',
] as const;

export function AftercareSection() {
  return (
    <section id="aftercare" aria-labelledby="aftercare-heading" className="mt-(--section) scroll-mt-24">
      <div className="shell text-center">
        <h2 id="aftercare-heading" className="mx-auto max-w-[14ch] font-display text-h1">
          Looking after it once you leave
        </h2>
        <p className="measure mx-auto mt-6 text-lead text-smoke">
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
      </div>

      <div className="shell mt-(--section)">
        <div className="mx-auto max-w-5xl space-y-(--section)">
          {parts.map((p) => (
            <div key={p.id} id={p.id} role="group" aria-labelledby={`${p.id}-heading`} className="scroll-mt-24">
              <h3 id={`${p.id}-heading`} className="text-center font-display text-h2">
                {p.title}
              </h3>
              <ol className="mt-8 border-b border-coal md:grid md:grid-cols-2 md:gap-x-12 md:border-b-0">
                {(p.sections as readonly Section[]).map((s, i) => (
                  <li
                    key={s.heading}
                    className={`grid grid-cols-[2.5rem_1fr] gap-x-4 self-start border-t border-coal pb-8 pt-6 md:row-span-2 ${
                      i % 2 === 0 ? 'md:col-start-1' : 'md:col-start-2'
                    } ${rowStart[i] ?? ''}`}
                  >
                    <span className="flex items-start gap-1.5 pt-1 text-ash">
                      <Dagger className="h-4 w-auto" />
                      <span className="ui num">{i + 1}</span>
                    </span>
                    <div>
                      <h4 className="font-serif text-h3 font-semibold">{s.heading}</h4>
                      {isTodo(s.body) ? (
                        <TodoNote className="mt-3" item={s.body} />
                      ) : typeof s.body === 'string' ? (
                        <p className="measure mt-2">{s.body}</p>
                      ) : (
                        <ul className="measure mt-2 space-y-2">
                          {s.body.map((line) => (
                            <li key={line}>{line}</li>
                          ))}
                        </ul>
                      )}
                      {s.open ? <TodoNote className="mt-3" item={s.open} /> : null}
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
