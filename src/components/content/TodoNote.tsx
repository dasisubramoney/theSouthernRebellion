import type { ReactNode } from 'react';
import type { Maybe, Todo } from '../../content/todo';
import { isTodo } from '../../content/todo';

/** Visible marker for content the client has not supplied yet. */
export function TodoNote({ item, className = '' }: { item: Todo; className?: string }) {
  return (
    <p className={`todo ${className}`}>
      TODO: {item.todo}
      {item.evidence ? <span className="mt-1 block font-normal opacity-75">Seen so far: {item.evidence}</span> : null}
    </p>
  );
}

/**
 * Shows the real value once the client supplies it, and the TODO until then.
 * Use this for anything in src/content typed as Maybe<string>.
 */
export function TodoOr({
  value,
  className = '',
  children,
}: {
  value: Maybe<string>;
  className?: string;
  children?: (v: string) => ReactNode;
}) {
  if (isTodo(value)) return <TodoNote className={className} item={value} />;
  return children ? <>{children(value)}</> : <p className={className}>{value}</p>;
}
