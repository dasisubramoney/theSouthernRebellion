/**
 * A gap in the client's material. Components render it as a visible "TODO:" note,
 * and `npm run todos` lists every one for the client.
 */
export type Todo = {
  readonly todo: string;
  /** What the material does say, if anything, so the client can confirm rather than start from scratch. */
  readonly evidence?: string;
};

export type Maybe<T> = T | Todo;

export function todo(question: string, evidence?: string): Todo {
  return evidence ? { todo: question, evidence } : { todo: question };
}

export function isTodo(value: unknown): value is Todo {
  return typeof value === 'object' && value !== null && 'todo' in value;
}

export function known<T>(value: Maybe<T>): T | null {
  return isTodo(value) ? null : value;
}
