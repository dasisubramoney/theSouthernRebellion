import type { Maybe } from '../../content/todo';
import { isTodo } from '../../content/todo';
import { Dagger } from '../brand/Dagger';
import { TodoNote } from '../content/TodoNote';

type Step = { title: string; body: Maybe<string> };

/**
 * Numbered steps with a dagger marker. `level` is the heading level of each step title:
 * one below the heading the list sits under, so the outline stays in order.
 */
export function StepList({ steps, className = '', level = 3 }: { steps: readonly Step[]; className?: string; level?: 2 | 3 }) {
  const Heading = level === 2 ? 'h2' : 'h3';
  return (
    <ol className={`border-t border-current/20 ${className}`}>
      {steps.map((s, i) => (
        <li key={s.title} className="grid grid-cols-[2.5rem_1fr] gap-x-4 border-b border-current/20 py-6 md:grid-cols-[4rem_1fr]">
          <span className="flex items-start gap-2 pt-1">
            <Dagger className="h-5 w-auto" />
            <span className="ui num">{String(i + 1).padStart(2, '0')}</span>
          </span>
          <div>
            <Heading className="font-serif text-h3 font-semibold">{s.title}</Heading>
            {isTodo(s.body) ? <TodoNote className="mt-3" item={s.body} /> : <p className="measure mt-2">{s.body}</p>}
          </div>
        </li>
      ))}
    </ol>
  );
}
